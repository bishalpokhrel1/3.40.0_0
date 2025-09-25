import { db } from './firebase';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp, onSnapshot } from 'firebase/firestore';

const tasksCollection = collection(db, 'tasks');
const notesCollection = collection(db, 'notes');

export const resolvers = {
  Query: {
    getTasks: async () => {
      const q = query(tasksCollection, orderBy('updatedAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    getTask: async (_, { id }) => {
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

    getNote: async (_, { id }) => {
      const noteDoc = doc(notesCollection, id);
      const snapshot = await getDoc(noteDoc);
      if (!snapshot.exists()) {
        return null;
      }
      return { id: snapshot.id, ...snapshot.data() };
    },

    sync: async (_, { deviceId, lastSyncedAt }) => {
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
    }
  },

  Mutation: {
    createTask: async (_, { input }) => {
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

    updateTask: async (_, { id, input }) => {
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

    deleteTask: async (_, { id }) => {
      const taskDoc = doc(tasksCollection, id);
      await deleteDoc(taskDoc);
      return true;
    },

    createNote: async (_, { input }) => {
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

    updateNote: async (_, { id, input }) => {
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

    deleteNote: async (_, { id }) => {
      const noteDoc = doc(notesCollection, id);
      await deleteDoc(noteDoc);
      return true;
    },

    syncChanges: async (_, { deviceId, changes }) => {
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
      subscribe: (_, { deviceId }, { pubsub }) => {
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
      subscribe: (_, { deviceId }, { pubsub }) => {
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
