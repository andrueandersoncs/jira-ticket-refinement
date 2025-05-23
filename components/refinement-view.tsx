"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { BacklogItem } from "@/lib/types";
import { renderDescription } from "@/lib/utils";
import { RefinementResponse } from "@/lib/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useState } from "react";
import { applyRefinementToJira, getUpdatedRefinement } from "@/app/actions";
import { FeedbackDialog, FeedbackType } from "@/components/feedback-dialog";

interface RefinementViewProps {
  selectedItem: BacklogItem | null;
  refinementSuggestions: RefinementResponse | null;
  isRefining: boolean;
  openaiKey: string;
  jiraConfig: {
    url: string;
    username: string;
    project: string;
    token: string;
  };
  onStartRefinement: () => Promise<void>;
  onUpdateRefinement: (refinement: RefinementResponse) => void;
  onClearSuggestions: () => void;
}

export function RefinementView({
  selectedItem,
  refinementSuggestions,
  isRefining,
  openaiKey,
  jiraConfig,
  onStartRefinement,
  onUpdateRefinement,
  onClearSuggestions,
}: RefinementViewProps) {
  const [isApplying, setIsApplying] = useState(false);

  const handleFeedback = async (type: FeedbackType, feedback: string) => {
    if (!refinementSuggestions || !openaiKey) return;

    try {
      const updatedRefinement = await getUpdatedRefinement(
        refinementSuggestions,
        type,
        feedback,
        openaiKey
      );

      onUpdateRefinement(updatedRefinement);
      toast.success("Refinement updated with feedback");
    } catch (error) {
      toast.error("Failed to update refinement with feedback");
    }
  };

  const handleApplyToJira = async () => {
    if (!selectedItem || !refinementSuggestions || !jiraConfig) return;

    setIsApplying(true);
    try {
      const refinedDescription = [
        "# User Story",
        refinementSuggestions.ClearRequirements.UserStory,
        "\n# Acceptance Criteria",
        ...refinementSuggestions.ClearRequirements.AcceptanceCriteria.map(
          (criteria, i) => `${i + 1}. ${criteria}`
        ),
        "\n# Testing Guidelines",
        ...refinementSuggestions.Testability.TestingGuidelines.map(
          (guideline, i) => `${i + 1}. ${guideline}`
        ),
      ].join("\n");

      await applyRefinementToJira(
        jiraConfig,
        selectedItem.key,
        refinedDescription
      );
      toast.success(
        "Successfully appended refinement suggestions to Jira ticket"
      );
    } catch (error) {
      console.error("Failed to update Jira:", error);
      toast.error("Failed to update Jira ticket");
    } finally {
      setIsApplying(false);
    }
  };

  if (!selectedItem) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Story Refinement</h2>
          <div className="text-muted-foreground">
            Select a story from the backlog to start refinement
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{selectedItem.key}</h2>
          <div className="text-lg text-muted-foreground mt-1">
            {selectedItem.fields.summary}
          </div>
        </div>
        <span className="text-sm bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full">
          {selectedItem.fields.status.name}
        </span>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Original Description</h3>
          <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
            {renderDescription(selectedItem.fields.description)}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Refinement Suggestions</h3>
          <div className="bg-muted p-4 rounded-lg">
            {refinementSuggestions ? (
              <ScrollArea className="h-[600px]">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">User Story</h4>
                      <FeedbackDialog
                        type="user_story"
                        content={
                          refinementSuggestions.ClearRequirements.UserStory
                        }
                        onSubmit={(feedback) =>
                          handleFeedback("user_story", feedback)
                        }
                      />
                    </div>
                    <div className="bg-background p-3 rounded whitespace-pre-wrap">
                      {refinementSuggestions.ClearRequirements.UserStory}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Acceptance Criteria</h4>
                      <FeedbackDialog
                        type="acceptance_criteria"
                        content={
                          <ol className="list-decimal pl-5 space-y-1">
                            {refinementSuggestions.ClearRequirements.AcceptanceCriteria.map(
                              (criteria, i) => (
                                <li key={i}>{criteria}</li>
                              )
                            )}
                          </ol>
                        }
                        onSubmit={(feedback) =>
                          handleFeedback("acceptance_criteria", feedback)
                        }
                      />
                    </div>
                    <div className="bg-background p-3 rounded whitespace-pre-wrap">
                      <ol className="list-decimal pl-5 space-y-1">
                        {refinementSuggestions.ClearRequirements.AcceptanceCriteria.map(
                          (criteria, i) => (
                            <li key={i}>{criteria}</li>
                          )
                        )}
                      </ol>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Testing Guidelines</h4>
                      <FeedbackDialog
                        type="testing_guidelines"
                        content={
                          <ol className="list-decimal pl-5 space-y-1">
                            {refinementSuggestions.Testability.TestingGuidelines.map(
                              (guideline, i) => (
                                <li key={i}>{guideline}</li>
                              )
                            )}
                          </ol>
                        }
                        onSubmit={(feedback) =>
                          handleFeedback("testing_guidelines", feedback)
                        }
                      />
                    </div>
                    <div className="bg-background p-3 rounded whitespace-pre-wrap">
                      <ol className="list-decimal pl-5 space-y-1">
                        {refinementSuggestions.Testability.TestingGuidelines.map(
                          (guideline, i) => (
                            <li key={i}>{guideline}</li>
                          )
                        )}
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button onClick={onClearSuggestions} variant="outline">
                    Clear Suggestions
                  </Button>
                  <Button onClick={handleApplyToJira} disabled={isApplying}>
                    {isApplying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Appending to Jira...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Append to Jira
                      </>
                    )}
                  </Button>
                </div>
              </ScrollArea>
            ) : (
              <div>
                <div className="text-muted-foreground">
                  Click &quot;Start Refinement&quot; to get AI-powered
                  suggestions for improving this user story.
                </div>
                <Button
                  className="mt-4"
                  onClick={onStartRefinement}
                  disabled={!openaiKey || isRefining}
                >
                  {isRefining ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Suggestions...
                    </>
                  ) : (
                    "Start Refinement"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
