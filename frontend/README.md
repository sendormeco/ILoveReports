# ILoveReports frontend

React / TypeScript frontend for ILoveReports.

The frontend is now split into:

- `src/domain/report.ts` - report data types;
- `src/services/reportApi.ts` - HTTP requests to the backend;
- `src/application/reportUseCases.ts` - frontend scenarios for generation and DOCX download;
- `src/components/` - UI components.

## Run

```bash
npm install
npm run dev
```

Backend URL is configured with:

```env
VITE_API_URL=http://127.0.0.1:8000
```
