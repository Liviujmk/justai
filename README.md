# JustAI

JustAI is an AI chatbot designed to discuss legislative topics from Romania only.

! Note: This is a work in progress and is not yet ready for production.

## Overview

JustAI is a web-based chatbot that leverages modern AI and web technologies to provide users with conversational access to Romanian legislative information. The application is built with a focus on accessibility, responsive design, and a smooth chat experience.

## Features

- **Conversational AI**: Uses OpenAI’s GPT-4.1 model (via `@ai-sdk/openai`) to generate responses.
- **Legislation Focus**: Restricts conversation topics to Romanian legislative matters.
- **Modern UI**: Built with React 19, Next.js 15, and Tailwind CSS for a clean, responsive interface.
- **Streaming Responses**: Messages from the AI stream in real-time for a natural chat feel.
- **Markdown Support**: AI responses can include formatted text and code blocks.
- **Accessibility**: Keyboard navigation and ARIA roles for improved accessibility.

## Technical Stack

- **Frontend**: React 19, Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide Icons
- **AI Integration**: `@ai-sdk/openai`, `ai` package for chat and streaming
- **Markdown Rendering**: `react-markdown`, `remark-gfm`, `rehype-highlight`, `rehype-raw`
- **Styling**: Tailwind CSS, custom CSS for chat and markdown
- **Other**: Class variance authority, clsx, and utility libraries

## Main Components

- `app/page.tsx`: Main chat interface, handles message state and layout.
- `components/ui/MessageList.tsx`: Renders the list of chat messages.
- `components/ui/Message.tsx`: Renders individual messages, including markdown and code.
- `components/ui/ChatInput.tsx`: User input area with auto-resize and submit handling.
- `app/api/chat/route.ts`: API route for handling chat requests and streaming AI responses.

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

3. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

## Customization

- To change the AI model or provider, edit `app/api/chat/route.ts`.
- UI and chat logic can be customized in the `components/ui/` directory.
