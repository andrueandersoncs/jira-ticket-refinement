export interface JiraConfig {
  url: string;
  username: string;
  project: string;
  token: string;
  searchQuery?: string;
}

export async function fetchBacklogItems(config: JiraConfig) {
  const jql = encodeURIComponent(
    `project = "${config.project}" AND statusCategory = "To Do" ORDER BY Rank ASC`
  );

  const response = await fetch(
    `${config.url}/rest/api/3/search?jql=${jql}&fields=summary,description,status`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${config.username}:${config.token}`
        ).toString("base64")}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response.json();
}

export async function searchIssue(config: JiraConfig, issueKey: string) {
  const jql = encodeURIComponent(`key = "${issueKey}"`);

  const response = await fetch(
    `${config.url}/rest/api/3/search?jql=${jql}&fields=summary,description,status`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${config.username}:${config.token}`
        ).toString("base64")}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response.json();
}

export async function updateJiraTicket(
  config: JiraConfig,
  issueKey: string,
  description: string
) {
  // First, get the current description
  const response = await fetch(
    `${config.url}/rest/api/3/issue/${issueKey}?fields=description`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${config.username}:${config.token}`
        ).toString("base64")}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  let issue;

  try {
    issue = await response.json();
  } catch (error) {
    console.error("Error parsing Jira ticket:", error);
    throw new Error("Failed to parse Jira ticket");
  }

  const doc = issue.fields.description ?? {
    type: "doc",
    version: 1,
    content: [],
  };

  // Create the new description by appending the refinement
  const separator = "\n\n---\n\n## Refinement\n\n";

  doc.content.push({
    type: "paragraph",
    content: [{ type: "text", text: separator + description }],
  });

  const body = JSON.stringify({
    update: { description: [{ set: doc }] },
  });

  // Update the ticket with the combined description
  const updateResponse = await fetch(
    `${config.url}/rest/api/3/issue/${issueKey}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${config.username}:${config.token}`
        ).toString("base64")}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    }
  );

  if (!updateResponse.ok) {
    const error = await updateResponse.text();
    throw new Error(error);
  }

  try {
    return updateResponse.json();
  } catch (error) {
    console.error(
      "Error updating Jira ticket, failed to parse response:",
      error
    );
    throw new Error("Failed to update Jira ticket");
  }
}
