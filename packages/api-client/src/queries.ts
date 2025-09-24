import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
        preferences {
          theme
          aiSettings {
            enableContentSummary
            enableTaskSuggestions
            enableSmartNotifications
          }
        }
      }
    }
  }
`;

export const SIGNUP = gql`
  mutation Signup($email: String!, $password: String!, $name: String) {
    signup(email: $email, password: $password, name: $name) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

export const GET_ME = gql`
  query Me {
    me {
      id
      email
      name
      preferences {
        theme
        aiSettings {
          enableContentSummary
          enableTaskSuggestions
          enableSmartNotifications
        }
      }
      workspace {
        id
        name
        lastSynced
      }
      googleIntegration {
        connected
        email
        calendarSync
        driveSync
        gmailSync
        tasksSync
      }
    }
  }
`;

export const GET_WORKSPACE = gql`
  query GetWorkspace {
    getWorkspace {
      id
      name
      items {
        id
        type
        title
        url
        content
        tags
        aiSummary
        createdAt
        updatedAt
      }
      collections {
        id
        name
        items {
          id
          title
        }
      }
      tasks {
        id
        title
        status
        dueDate
        priority
      }
      notes {
        id
        title
        lastEdited
      }
    }
  }
`;

export const CREATE_WORKSPACE_ITEM = gql`
  mutation CreateWorkspaceItem($input: CreateWorkspaceItemInput!) {
    createWorkspaceItem(input: $input) {
      id
      type
      title
      url
      content
      tags
      aiSummary
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PREFERENCES = gql`
  mutation UpdatePreferences($input: UpdatePreferencesInput!) {
    updatePreferences(input: $input) {
      theme
      aiSettings {
        enableContentSummary
        enableTaskSuggestions
        enableSmartNotifications
        modelPreferences
      }
    }
  }
`;

export const CONNECT_GOOGLE = gql`
  mutation ConnectGoogle($code: String!) {
    connectGoogle(code: $code) {
      connected
      email
      calendarSync
      driveSync
      gmailSync
      tasksSync
    }
  }
`;

export const GET_AI_SUGGESTIONS = gql`
  query GetAISuggestions($context: String!) {
    getAISuggestions(context: $context) {
      type
      content
      confidence
      metadata
    }
  }
`;