export interface BacklogItem {
  id: string;
  key: string;
  fields: {
    summary: string;
    description: string | null;
    status: {
      name: string;
    };
  };
}

export interface Settings {
  jiraUrl: string;
  jiraUsername: string;
  jiraProject: string;
  apiKey: string;
  openaiKey: string;
}