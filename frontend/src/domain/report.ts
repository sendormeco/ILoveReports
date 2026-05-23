export interface TitlePageData {
  title: string;
  author: string;
  organization: string;
  date: string;
  supervisor?: string;
  exporter?: string;
}

export interface ReportData {
  workDescription: string;
  workGoal: string;
  conclusion: string;
  tone: string;
  screenshots: File[];
  titlePage: TitlePageData;
}

export interface GeneratedReport extends ReportData {
  id: string;
  generatedContent: string;
  generatedDate: string;
}

export interface GenerateReportPayload {
  goal: string;
  process: string;
  results: string;
  conclusion: string;
  tone?: string;
  report_type?: string;
  generator?: string;
}

export interface PluginInfo {
  name: string;
  description: string;
}

export interface PluginCatalog {
  generators: PluginInfo[];
  exporters: PluginInfo[];
}

export interface GenerateReportResponse {
  report: string;
  generator?: string;
}

export interface GenerateDocxPayload {
  title: string;
  report: string;
  author: string;
  organization: string;
  date: string;
  supervisor?: string;
  exporter?: string;
}
