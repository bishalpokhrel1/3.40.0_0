import { db } from './firebase';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp, onSnapshot } from 'firebase/firestore';
import { analyzeContentWithGemini, generateWithGemini, summarizeWithGemini, taskSuggestionsWithGemini } from './ai/gemini';

const tasksCollection = collection(db, 'tasks');
const notesCollection = collection(db, 'notes');

export const resolvers = {
  Query: {
    getTasks: async () => {
      const q = query(tasksCollection, orderBy('updatedAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

  getTask: async (_: unknown, { id }: { id: string }) => {
      const taskDoc = doc(tasksCollection, id);
      const snapshot = await getDoc(taskDoc);
      if (!snapshot.exists()) {
        return null;
      }
      return { id: snapshot.id, ...snapshot.data() };
    },

    getNotes: async () => {
      const q = query(notesCollection, orderBy('updatedAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

  getNote: async (_: unknown, { id }: { id: string }) => {
      const noteDoc = doc(notesCollection, id);
      const snapshot = await getDoc(noteDoc);
      if (!snapshot.exists()) {
        return null;
      }
      return { id: snapshot.id, ...snapshot.data() };
    },

    sync: async (
      _: unknown,
      { deviceId, lastSyncedAt }: { deviceId: string; lastSyncedAt?: string | null }
    ) => {
      const lastSyncedTimestamp = lastSyncedAt ? Timestamp.fromDate(new Date(lastSyncedAt)) : null;

      const [tasksSnapshot, notesSnapshot] = await Promise.all([
        getDocs(query(
          tasksCollection,
          ...(lastSyncedTimestamp ? [
            where('updatedAt', '>', lastSyncedTimestamp),
            where('deviceId', '!=', deviceId)
          ] : []),
          orderBy('updatedAt', 'desc')
        )),
        getDocs(query(
          notesCollection,
          ...(lastSyncedTimestamp ? [
            where('updatedAt', '>', lastSyncedTimestamp),
            where('deviceId', '!=', deviceId)
          ] : []),
          orderBy('updatedAt', 'desc')
        ))
      ]);

      return {
        tasks: tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        notes: notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        lastSyncedAt: new Date().toISOString()
      };
    },

    aiSummarize: async (_: unknown, { content }: { content: string }) => {
      return summarizeWithGemini(content);
    },

    aiGenerate: async (
      _: unknown,
      { input, context }: { input: string; context?: string | null }
    ) => {
      return generateWithGemini(input, context ?? undefined);
    },

    aiTaskSuggestions: async (_: unknown, { input }: { input: string }) => {
      return taskSuggestionsWithGemini(input);
    },

    aiAnalyze: async (_: unknown, { content }: { content: string }) => {
      return analyzeContentWithGemini(content);
    }
  },

  Mutation: {
    createTask: async (
      _: unknown,
      { input }: { input: Record<string, unknown> }
    ) => {
      const now = Timestamp.now();
      const taskData = {
        ...input,
        createdAt: now,
        updatedAt: now,
        lastSyncedAt: now
      };
      const docRef = await addDoc(tasksCollection, taskData);
      return { id: docRef.id, ...taskData };
    },

    updateTask: async (
      _: unknown,
      { id, input }: { id: string; input: Record<string, unknown> }
    ) => {
      const taskDoc = doc(tasksCollection, id);
      const now = Timestamp.now();
      const updateData = {
        ...input,
        updatedAt: now,
        lastSyncedAt: now
      };
      await updateDoc(taskDoc, updateData);
      return { id, ...updateData };
    },

  deleteTask: async (_: unknown, { id }: { id: string }) => {
      const taskDoc = doc(tasksCollection, id);
      await deleteDoc(taskDoc);
      return true;
    },

    createNote: async (
      _: unknown,
      { input }: { input: Record<string, unknown> }
    ) => {
      const now = Timestamp.now();
      const noteData = {
        ...input,
        createdAt: now,
        updatedAt: now,
        lastSyncedAt: now
      };
      const docRef = await addDoc(notesCollection, noteData);
      return { id: docRef.id, ...noteData };
    },

    updateNote: async (
      _: unknown,
      { id, input }: { id: string; input: Record<string, unknown> }
    ) => {
      const noteDoc = doc(notesCollection, id);
      const now = Timestamp.now();
      const updateData = {
        ...input,
        updatedAt: now,
        lastSyncedAt: now
      };
      await updateDoc(noteDoc, updateData);
      return { id, ...updateData };
    },

  deleteNote: async (_: unknown, { id }: { id: string }) => {
      const noteDoc = doc(notesCollection, id);
      await deleteDoc(noteDoc);
      return true;
    },

    syncChanges: async (
      _: unknown,
      { deviceId, changes }: {
        deviceId: string;
        changes: {
          tasks?: Array<{ id: string; operation: string; data?: Record<string, unknown> }>;
          notes?: Array<{ id: string; operation: string; data?: Record<string, unknown> }>;
          lastSyncedAt: string;
        };
      }
    ) => {
      const { tasks: taskChanges = [], notes: noteChanges = [], lastSyncedAt } = changes;

      // Process task changes
      for (const change of taskChanges) {
        const now = Timestamp.now();
        switch (change.operation) {
          case 'CREATE':
            await addDoc(tasksCollection, {
              ...change.data,
              createdAt: now,
              updatedAt: now,
              lastSyncedAt: now
            });
            break;
          case 'UPDATE': {
            const taskDoc = doc(tasksCollection, change.id);
            await updateDoc(taskDoc, {
              ...change.data,
              updatedAt: now,
              lastSyncedAt: now
            });
            break;
          }
          case 'DELETE': {
            const taskDoc = doc(tasksCollection, change.id);
            await deleteDoc(taskDoc);
            break;
          }
        }
      }

      // Process note changes
      for (const change of noteChanges) {
        const now = Timestamp.now();
        switch (change.operation) {
          case 'CREATE':
            await addDoc(notesCollection, {
              ...change.data,
              createdAt: now,
              updatedAt: now,
              lastSyncedAt: now
            });
            break;
          case 'UPDATE': {
            const noteDoc = doc(notesCollection, change.id);
            await updateDoc(noteDoc, {
              ...change.data,
              updatedAt: now,
              lastSyncedAt: now
            });
            break;
          }
          case 'DELETE': {
            const noteDoc = doc(notesCollection, change.id);
            await deleteDoc(noteDoc);
            break;
          }
        }
      }

      // Return all updated data
      const lastSyncedTimestamp = Timestamp.fromDate(new Date(lastSyncedAt));
      const [tasksSnapshot, notesSnapshot] = await Promise.all([
        getDocs(query(
          tasksCollection,
          where('updatedAt', '>', lastSyncedTimestamp),
          where('deviceId', '!=', deviceId),
          orderBy('updatedAt', 'desc')
        )),
        getDocs(query(
          notesCollection,
          where('updatedAt', '>', lastSyncedTimestamp),
          where('deviceId', '!=', deviceId),
          orderBy('updatedAt', 'desc')
        ))
      ]);

      return {
        tasks: tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        notes: notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        lastSyncedAt: new Date().toISOString()
      };
    }
  },

  Subscription: {
    taskUpdated: {
      subscribe: (
        _: unknown,
        { deviceId }: { deviceId: string },
        { pubsub }: { pubsub: { publish: (channel: string, payload: unknown) => void; asyncIterator: (channels: string[]) => AsyncIterable<unknown> } }
      ) => {
        const channelName = `TASK_UPDATES_${deviceId}`;
        
        const unsubscribe = onSnapshot(query(tasksCollection, where('deviceId', '!=', deviceId)), (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'modified' || change.type === 'added') {
              const task = { id: change.doc.id, ...change.doc.data() };
              pubsub.publish(channelName, { taskUpdated: task });
            }
          });
        });

        setTimeout(() => unsubscribe(), 1000 * 60 * 60); // Auto-cleanup after 1 hour
        return pubsub.asyncIterator([channelName]);
      }
    },

    noteUpdated: {
      subscribe: (
        _: unknown,
        { deviceId }: { deviceId: string },
        { pubsub }: { pubsub: { publish: (channel: string, payload: unknown) => void; asyncIterator: (channels: string[]) => AsyncIterable<unknown> } }
      ) => {
        const channelName = `NOTE_UPDATES_${deviceId}`;
        
        const unsubscribe = onSnapshot(query(notesCollection, where('deviceId', '!=', deviceId)), (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'modified' || change.type === 'added') {
              const note = { id: change.doc.id, ...change.doc.data() };
              pubsub.publish(channelName, { noteUpdated: note });
            }
          });
        });

        setTimeout(() => unsubscribe(), 1000 * 60 * 60); // Auto-cleanup after 1 hour
        return pubsub.asyncIterator([channelName]);
      }
    }
  }
};
