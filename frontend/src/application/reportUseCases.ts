import type { GeneratedReport, GenerateDocxPayload, PluginCatalog, ReportData } from '../domain/report';
import { exportReportDocx, fetchPlugins, generateReport } from '../services/reportApi';

export async function generateComprehensiveReport(data: ReportData): Promise<GeneratedReport> {
  const result = await generateReport({
    goal: data.workGoal,
    process: data.workDescription,
    results: 'Данные переданы из локальной формы frontend',
    conclusion: data.conclusion,
    tone: data.tone || undefined,
    report_type: 'comprehensive',
  });

  return {
    ...data,
    id: Date.now().toString(),
    generatedContent: result.report,
    generatedDate: new Date().toISOString(),
  };
}

export async function downloadReportAsDocx(report: GeneratedReport): Promise<void> {
  const payload: GenerateDocxPayload = {
    title: report.titlePage.title,
    report: report.generatedContent,
    author: report.titlePage.author,
    organization: report.titlePage.organization,
    date: report.titlePage.date,
    supervisor: report.titlePage.supervisor || undefined,
  };

  const blob = await exportReportDocx(payload);
  const url = URL.createObjectURL(blob);
  const element = document.createElement('a');
  element.href = url;
  element.download = `${report.titlePage.title || 'report'}.docx`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  URL.revokeObjectURL(url);
}


export async function getAvailableReportPlugins(): Promise<PluginCatalog> {
  return fetchPlugins();
}
