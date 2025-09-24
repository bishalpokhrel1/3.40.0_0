export const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    name: String
    preferences: UserPreferences
    workspace: Workspace
    googleIntegration: GoogleIntegration
  }

  type UserPreferences {
    theme: String
    newsCategories: [String]
    weatherLocation: String
    aiSettings: AISettings
  }

  type AISettings {
    enableContentSummary: Boolean
    enableTaskSuggestions: Boolean
    enableSmartNotifications: Boolean
    modelPreferences: JSON
  }

  type Workspace {
    id: ID!
    name: String!
    items: [WorkspaceItem!]!
    collections: [Collection!]!
    tasks: [Task!]!
    notes: [Note!]!
    lastSynced: String
  }

  type WorkspaceItem {
    id: ID!
    type: String!
    title: String!
    url: String
    content: String
    tags: [String!]
    aiSummary: String
    createdAt: String!
    updatedAt: String!
  }

  type Collection {
    id: ID!
    name: String!
    items: [WorkspaceItem!]!
    shared: Boolean
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: String!
    dueDate: String
    priority: Int
    tags: [String!]
    aiSuggestions: [String!]
  }

  type Note {
    id: ID!
    title: String!
    content: String!
    tags: [String!]
    aiSummary: String
    lastEdited: String!
  }

  type GoogleIntegration {
    connected: Boolean!
    email: String
    calendarSync: Boolean
    driveSync: Boolean
    gmailSync: Boolean
    tasksSync: Boolean
    lastSynced: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type AISuggestion {
    type: String!
    content: String!
    confidence: Float!
    metadata: JSON
  }

  type Query {
    me: User
    getWorkspace: Workspace!
    getCollection(id: ID!): Collection!
    getTasks(status: String): [Task!]!
    getNotes(tag: String): [Note!]!
    getAISuggestions(context: String!): [AISuggestion!]!
    getGoogleEvents(startDate: String!, endDate: String!): [JSON!]!
    getGoogleEmails(query: String): [JSON!]!
    searchWorkspace(query: String!): [WorkspaceItem!]!
  }

  type Mutation {
    signup(email: String!, password: String!, name: String): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updatePreferences(input: UpdatePreferencesInput!): UserPreferences!
    
    # Workspace mutations
    createWorkspaceItem(input: CreateWorkspaceItemInput!): WorkspaceItem!
    updateWorkspaceItem(id: ID!, input: UpdateWorkspaceItemInput!): WorkspaceItem!
    deleteWorkspaceItem(id: ID!): Boolean!
    
    # Collection mutations
    createCollection(input: CreateCollectionInput!): Collection!
    updateCollection(id: ID!, input: UpdateCollectionInput!): Collection!
    deleteCollection(id: ID!): Boolean!
    
    # Task mutations
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Boolean!
    
    # Note mutations
    createNote(input: CreateNoteInput!): Note!
    updateNote(id: ID!, input: UpdateNoteInput!): Note!
    deleteNote(id: ID!): Boolean!
    
    # Google integration
    connectGoogle(code: String!): GoogleIntegration!
    disconnectGoogle: Boolean!
    syncGoogleServices: Boolean!
  }

  input UpdatePreferencesInput {
    theme: String
    newsCategories: [String]
    weatherLocation: String
    aiSettings: AISettingsInput
  }

  input AISettingsInput {
    enableContentSummary: Boolean
    enableTaskSuggestions: Boolean
    enableSmartNotifications: Boolean
    modelPreferences: JSON
  }

  input CreateWorkspaceItemInput {
    type: String!
    title: String!
    url: String
    content: String
    tags: [String!]
  }

  input UpdateWorkspaceItemInput {
    title: String
    url: String
    content: String
    tags: [String!]
  }

  input CreateCollectionInput {
    name: String!
    shared: Boolean
  }

  input UpdateCollectionInput {
    name: String
    shared: Boolean
  }

  input CreateTaskInput {
    title: String!
    description: String
    status: String!
    dueDate: String
    priority: Int
    tags: [String!]
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
  }

  input UpdateNoteInput {
    title: String
    content: String
    tags: [String!]
  }

  scalar JSON
`;