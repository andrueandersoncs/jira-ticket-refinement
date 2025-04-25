"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SettingsFormProps {
  jiraUrl: string;
  jiraUsername: string;
  jiraProject: string;
  apiKey: string;
  openaiKey: string;
  isLoading: boolean;
  onJiraUrlChange: (value: string) => void;
  onJiraUsernameChange: (value: string) => void;
  onJiraProjectChange: (value: string) => void;
  onApiKeyChange: (value: string) => void;
  onOpenaiKeyChange: (value: string) => void;
  onSave: () => Promise<void>;
}

export function SettingsForm({
  jiraUrl,
  jiraUsername,
  jiraProject,
  apiKey,
  openaiKey,
  isLoading,
  onJiraUrlChange,
  onJiraUsernameChange,
  onJiraProjectChange,
  onApiKeyChange,
  onOpenaiKeyChange,
  onSave,
}: SettingsFormProps) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <div className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="jiraUsername">Jira Username</Label>
          <Input
            type="email"
            id="jiraUsername"
            value={jiraUsername}
            onChange={(e) => onJiraUsernameChange(e.target.value)}
            placeholder="your.email@company.com"
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="jiraProject">Jira Project Key</Label>
          <Input
            type="text"
            id="jiraProject"
            value={jiraProject}
            onChange={(e) => onJiraProjectChange(e.target.value.toUpperCase())}
            placeholder="PROJ"
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="jiraUrl">Jira URL</Label>
          <Input
            type="text"
            id="jiraUrl"
            value={jiraUrl}
            onChange={(e) => onJiraUrlChange(e.target.value)}
            placeholder="https://your-domain.atlassian.net"
            disabled
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="apiKey">Jira API Token</Label>
          <Input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="Your Jira API token"
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="openaiKey">OpenAI API Key</Label>
          <Input
            type="password"
            id="openaiKey"
            value={openaiKey}
            onChange={(e) => onOpenaiKeyChange(e.target.value)}
            placeholder="Your OpenAI API key"
          />
        </div>

        <Button 
          className="mt-4" 
          onClick={onSave}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </Card>
  );
}