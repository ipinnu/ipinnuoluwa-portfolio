This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## AI Mentor Connection

The private portfolio tools use a unified AI mentor layer. The goal is one assistant that can read the relevant portfolio context and, where supported, return structured actions that the app executes.

### Current Implementation

- `components/ai/MentorShell.tsx` is the shared chat UI.
- `components/my-world/asset-manager/ForgeMentorPanel.tsx` wraps `MentorShell` for the Forge dashboard.
- `app/api/mentor/chat/route.ts` is the unified mentor endpoint.
- `lib/ai/chat-provider.ts` selects the configured model provider in this order: Groq, Gemini, then Anthropic.
- `lib/ai/context.ts` builds the system prompt from Forge data plus lightweight Chronicle, Archive, and Brainbox signals.
- `lib/forge/mentor-actions.ts` parses and executes supported `forge-actions` returned by the model.

The older `app/api/forge/chat/route.ts` still exists as a Forge-specific route, but the dashboard now reaches the unified `/api/mentor/chat` route through `ForgeMentorPanel`.

### Configuration

Add at least one provider key to `.env.local`:

```env
GROQ_API_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
```

Groq is preferred when `GROQ_API_KEY` is present. Gemini is used next, and Anthropic is the fallback.

The context fetcher also expects Supabase environment variables when cross-domain context is enabled:

```env
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

### Runtime Flow

1. The user sends a message from the private mentor UI.
2. `MentorShell` posts the message, chat history, current Forge state, route, and focus to `/api/mentor/chat`.
3. The API route fetches lightweight life context from Supabase and builds a domain-aware system prompt.
4. `runChatCompletion` sends the request to the configured AI provider.
5. The response is returned to the UI.
6. If the response includes a fenced `forge-actions` block, the UI parses it, executes the action handlers, strips the hidden block, and shows the visible reply.

Supported Forge actions include updating assets, creating assets, selecting assets, toggling or adding mandate actions, updating the floor, and updating visions.

### Guardrails

- The mentor is intended for private tools, not public pages.
- Model-driven mutations should happen only when the user explicitly asks for a change or clearly confirms one.
- The visible assistant reply should explain what changed in plain language.
- Non-Forge write actions for Chronicle, Archive, Brainbox, and React learners are planned but not fully implemented.

More detailed planning notes are in `project_work_summary_858d7d30.plan.md`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
