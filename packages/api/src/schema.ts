export const typeDefs = `#graphql
  type Task {
    id: ID!
    title: String!
    description: String
    status: String!
    dueDate: String
    priority: Int
    tags: [String!]
    createdAt: String!
    updatedAt: String!
    deviceId: String
    lastSyncedAt: String
  }

  type Note {
    id: ID!
    title: String!
    content: String!
    tags: [String!]
    createdAt: String!
    updatedAt: String!
    deviceId: String
    lastSyncedAt: String
  }

  type SyncResponse {
    tasks: [Task!]!
    notes: [Note!]!
    lastSyncedAt: String!
  }

  type Query {
    getTasks: [Task!]!
    getTask(id: ID!): Task
    getNotes: [Note!]!
    getNote(id: ID!): Note
    sync(deviceId: String!, lastSyncedAt: String): SyncResponse!
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Boolean!
    
    createNote(input: CreateNoteInput!): Note!
    updateNote(id: ID!, input: UpdateNoteInput!): Note!
    deleteNote(id: ID!): Boolean!

    syncChanges(deviceId: String!, changes: SyncChangesInput!): SyncResponse!
  }

  input CreateTaskInput {
    title: String!
    description: String
    status: String!
    dueDate: String
    priority: Int
    tags: [String!]
    deviceId: String!
  }

  input UpdateTaskInput {
    title: String
    description: String
    status: String
    dueDate: String
    priority: Int
    tags: [String!]
  }

  input CreateNoteInput {
    title: String!
    content: String!
    tags: [String!]
    deviceId: String!
  }

  input UpdateNoteInput {
    title: String
    content: String
    tags: [String!]
  }

  input SyncChangesInput {
    tasks: [TaskChange!]
    notes: [NoteChange!]
    lastSyncedAt: String!
  }

  input TaskChange {
    id: ID!
    operation: ChangeOperation!
    data: CreateTaskInput
  }

  input NoteChange {
    id: ID!
    operation: ChangeOperation!
    data: CreateNoteInput
  }

  enum ChangeOperation {
    CREATE
    UPDATE
    DELETE
  }
`;
