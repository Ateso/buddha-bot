# Buddha Bot

> critique through the dharma, not against it

A Buddhist philosophy tool for articulating critique using concepts from within the tradition. Built with React + Vite, deployed via Netlify.

---

## Local Development

```bash
npm install
npm run dev
```

> Note: The app calls `/.netlify/functions/chat` for the API proxy. To test locally, install the Netlify CLI:
>
> ```bash
> npm install -g netlify-cli
> netlify dev
> ```
>
> Then add your API key to a `.env` file:
>
> ```
> ANTHROPIC_API_KEY=sk-ant-...
> ```

---

## Deploy to Netlify

1. Push this repo to GitHub
2. Connect repo at [netlify.com](https://netlify.com) → **Add new site > Import from Git**
3. Build settings are pre-configured in `netlify.toml`
4. Add environment variable in **Site settings > Environment variables**:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your `sk-ant-...` key
5. Deploy

---

## Project Structure

```
buddha-bot/
├── index.html                  # HTML shell
├── netlify.toml                # Build + redirect config
├── package.json
├── vite.config.js
├── netlify/
│   └── functions/
│       └── chat.js             # API proxy (holds key server-side)
└── src/
    ├── main.jsx                # React entry point
    └── BuddhaBot.jsx           # Main component
```

---

## Traditions Referenced

Grounded in Pali Canon (Theravada), Mahayana, Vajrayana, and Zen sources.
