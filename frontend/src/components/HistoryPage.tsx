import type { GeneratedReport } from '../domain/report';
import { Download, FileText, Calendar } from 'lucide-react';

interface HistoryPageProps {
  reports: GeneratedReport[];
  onSelectReport: (report: GeneratedReport) => void;
  onDownloadReport: (report: GeneratedReport) => void;
}

export function HistoryPage({ reports, onSelectReport, onDownloadReport }: HistoryPageProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">История отчётов</h1>
        <p className="text-gray-600">Все ваши сгенерированные отчёты</p>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-16 border border-gray-200 text-center">
          <FileText className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-gray-900 mb-2">Отчётов пока нет</h2>
          <p className="text-gray-600">Создайте свой первый отчёт, чтобы увидеть его здесь</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:border-purple-500 hover:shadow-xl transition-all cursor-pointer group"
              onClick={() => onSelectReport(report)}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-purple-100 p-3 rounded-lg flex-shrink-0">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-medium line-clamp-2 mb-1">
                    {report.titlePage.title}
                  </h3>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {new Date(report.generatedDate).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
                <p className="text-sm text-gray-600">
                  <strong>Автор:</strong> {report.titlePage.author}
                </p>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {report.titlePage.organization}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownloadReport(report);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all opacity-0 group-hover:opacity-100"
              >
                <Download className="w-4 h-4" />
                Скачать отчёт
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
