# Jira Ticket Refinement

A Next.js application that helps refine Jira tickets using AI. This tool connects to your Jira backlog and uses OpenAI to suggest improvements to user stories, acceptance criteria, and testing guidelines.

## Features

- Connect to your Jira instance with API credentials
- Fetch and display your Jira backlog items
- Search for specific Jira issues
- AI-powered suggestions for improving:
  - User stories
  - Acceptance criteria
  - Testing guidelines
- Apply refinements directly back to Jira
- Provide feedback to refine AI suggestions further

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [React 18](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [OpenAI API](https://openai.com/) - AI completion service
- [Radix UI](https://www.radix-ui.com/) - Headless UI components
- [Jira API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/) - Jira integration

## Getting Started

### Prerequisites

- Node.js 18 or later
- Jira account with API key
- OpenAI API key

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/jira-ticket-refinement.git
cd jira-ticket-refinement
```

2. Install dependencies

```bash
npm install
```

3. Run the development server

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser

### Configuration

In the Settings tab of the application, you'll need to provide:

- Jira URL (e.g., https://your-domain.atlassian.net)
- Jira Username (email)
- Jira Project Key
- Jira API Token
- OpenAI API Key

These settings are saved in your browser's local storage.

## Usage

1. Configure your Jira and OpenAI credentials in the Settings tab
2. Navigate to the Backlog tab to view your Jira backlog items
3. Click on an item to view its details in the Refinement tab
4. Click "Generate Refinement Suggestions" to get AI recommendations
5. Review and edit the suggestions as needed
6. Apply the refined description back to Jira

## Development

### Building for production

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## License

[MIT](LICENSE)
