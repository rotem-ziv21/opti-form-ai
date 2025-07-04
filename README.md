# opti-form-ai

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/rotem-ziv21/opti-form-ai)

## Local development

1. Copy `.env.example` to `.env` and provide your OpenAI key under `OPENAI_API_KEY`.
2. Start the API server:

```bash
npm run server
```

3. In another terminal, run the Vite dev server:

```bash
npm run dev
```

All requests to `/api/generate-message` are handled server‑side to prevent exposing the OpenAI API key.
