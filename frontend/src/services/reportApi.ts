import type { GenerateDocxPayload, GenerateReportPayload, GenerateReportResponse, PluginCatalog } from '../domain/report';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';

async function parseError(response: Response): Promise<string> {
  try {
    const body = await response.json();
    return body.detail ?? body.error ?? response.statusText;
  } catch {
    return response.statusText;
  }
}

export async function generateReport(payload: GenerateReportPayload): Promise<GenerateReportResponse> {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Ошибка генерации отчёта: ${await parseError(response)}`);
  }

  return response.json();
}

export async function exportReportDocx(payload: GenerateDocxPayload): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/generate-docx`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Ошибка экспорта DOCX: ${await parseError(response)}`);
  }

  return response.blob();
}


export async function fetchPlugins(): Promise<PluginCatalog> {
  const response = await fetch(`${API_BASE_URL}/plugins`);

  if (!response.ok) {
    throw new Error(`Ошибка получения списка плагинов: ${await parseError(response)}`);
  }

  return response.json();
}

export async function exportReport(payload: GenerateDocxPayload, exporterName: string): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/export/${encodeURIComponent(exporterName)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Ошибка экспорта отчёта: ${await parseError(response)}`);
  }

  return response.blob();
}
