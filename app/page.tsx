"use client";

import { useState, useEffect, FormEvent } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, LayoutList } from "lucide-react";
import {
  fetchBacklogItems,
  getRefinementSuggestions,
  searchJiraIssue,
} from "@/app/actions";
import { toast } from "sonner";
import { Header } from "@/components/header";
import { BacklogList } from "@/components/backlog-list";
import { RefinementView } from "@/components/refinement-view";
import { SettingsForm } from "@/components/settings-form";
import { BacklogItem, Settings as SettingsType } from "@/lib/types";
import { renderDescription } from "@/lib/utils";
import { RefinementResponse } from "@/lib/schema";

export default function Home() {
  const [jiraUrl, setJiraUrl] = useState("");
  const [jiraUsername, setJiraUsername] = useState("");
  const [jiraProject, setJiraProject] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [backlogItems, setBacklogItems] = useState<BacklogItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<BacklogItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("backlog");
  const [searchQuery, setSearchQuery] = useState("");
  const [refinementSuggestions, setRefinementSuggestions] =
    useState<RefinementResponse | null>(null);
  const [isRefining, setIsRefining] = useState(false);

  const loadBacklogItems = async (
    url: string = jiraUrl,
    username: string = jiraUsername,
    project: string = jiraProject,
    token: string = apiKey
  ) => {
    if (url && username && project && token) {
      setIsLoading(true);
      try {
        const items = await fetchBacklogItems({
          url,
          username,
          project,
          token,
        });
        setBacklogItems(items.issues || []);
      } catch (error) {
        console.error("Failed to fetch backlog items:", error);
        toast.error("Failed to fetch backlog items");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const savedSettings = localStorage.getItem("jiraSettings");
    if (savedSettings) {
      const settings: SettingsType = JSON.parse(savedSettings);
      setJiraUrl(settings.jiraUrl);
      setJiraUsername(settings.jiraUsername);
      setJiraProject(settings.jiraProject);
      setApiKey(settings.apiKey);
      setOpenaiKey(settings.openaiKey);
      loadBacklogItems(
        settings.jiraUrl,
        settings.jiraUsername,
        settings.jiraProject,
        settings.apiKey
      );
    } else {
      setActiveTab("settings");
    }
  }, []);

  useEffect(() => {
    if (jiraUsername) {
      const emailDomain = jiraUsername.split("@")[1];
      if (emailDomain) {
        const inferredUrl = `https://${
          emailDomain.split(".")[0]
        }.atlassian.net`;
        setJiraUrl(inferredUrl);
      }
    }
  }, [jiraUsername]);

  const handleSaveSettings = async () => {
    if (!jiraProject) {
      toast.error("Please enter a Jira project key");
      return;
    }

    const settings: SettingsType = {
      jiraUrl,
      jiraUsername,
      jiraProject,
      apiKey,
      openaiKey,
    };
    localStorage.setItem("jiraSettings", JSON.stringify(settings));

    loadBacklogItems();
    toast.success("Settings saved and backlog refreshed");
    setActiveTab("backlog");
  };

  const handleItemClick = (item: BacklogItem) => {
    setSelectedItem(item);
    setActiveTab("refinement");
    setRefinementSuggestions(null);
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!searchQuery.trim()) {
        // If search is empty, load backlog items
        await loadBacklogItems();
      } else {
        // Otherwise, search for the specific issue
        const result = await searchJiraIssue(
          {
            url: jiraUrl,
            username: jiraUsername,
            project: jiraProject,
            token: apiKey,
          },
          searchQuery
        );

        if (result.issues && result.issues.length > 0) {
          setBacklogItems(result.issues);
        } else {
          toast.error("No issues found");
          // Optionally, you could reload the backlog here as well
          await loadBacklogItems();
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search for issue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartRefinement = async () => {
    if (!selectedItem || !openaiKey) return;

    setIsRefining(true);
    try {
      const description = renderDescription(selectedItem.fields.description);
      const suggestions = await getRefinementSuggestions(
        description,
        openaiKey
      );
      setRefinementSuggestions(suggestions);
      toast.success("Refinement suggestions generated");
    } catch (error) {
      console.error("Refinement error:", error);
      toast.error("Failed to generate refinement suggestions");
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto p-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="backlog">
              <LayoutList className="mr-2 h-4 w-4" />
              Backlog
            </TabsTrigger>
            <TabsTrigger value="refinement">Refinement</TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="backlog">
            <BacklogList
              items={backlogItems}
              isLoading={isLoading}
              selectedItem={selectedItem}
              searchQuery={searchQuery}
              onSearch={handleSearch}
              onSearchChange={setSearchQuery}
              onItemClick={handleItemClick}
            />
          </TabsContent>

          <TabsContent value="refinement">
            <RefinementView
              selectedItem={selectedItem}
              refinementSuggestions={refinementSuggestions}
              isRefining={isRefining}
              openaiKey={openaiKey}
              jiraConfig={{
                url: jiraUrl,
                username: jiraUsername,
                project: jiraProject,
                token: apiKey,
              }}
              onStartRefinement={handleStartRefinement}
              onUpdateRefinement={setRefinementSuggestions}
              onClearSuggestions={() => setRefinementSuggestions(null)}
            />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsForm
              jiraUrl={jiraUrl}
              jiraUsername={jiraUsername}
              jiraProject={jiraProject}
              apiKey={apiKey}
              openaiKey={openaiKey}
              isLoading={isLoading}
              onJiraUrlChange={setJiraUrl}
              onJiraUsernameChange={setJiraUsername}
              onJiraProjectChange={setJiraProject}
              onApiKeyChange={setApiKey}
              onOpenaiKeyChange={setOpenaiKey}
              onSave={handleSaveSettings}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
