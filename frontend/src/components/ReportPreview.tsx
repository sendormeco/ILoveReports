import type { GeneratedReport } from '../domain/report';
import { Download, RotateCcw, FileText, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

interface ReportPreviewProps {
  report: GeneratedReport;
  onReset: () => void;
  onDownload: (report: GeneratedReport) => Promise<void>;
}

export function ReportPreview({ report, onReset, onDownload }: ReportPreviewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'screenshots'>('preview');

  const handleDownload = () => {
    void onDownload(report);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Success Message */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="bg-green-500 text-white p-3 rounded-full">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-green-900 mb-1">Отчёт успешно сгенерирован!</h3>
            <p className="text-green-700">
              Ваш отчёт готов. Вы можете просмотреть его ниже или скачать в формате DOCX.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-lg"
        >
          <Download className="w-5 h-5" />
          Скачать отчёт
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          Создать новый отчёт
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-t-xl border border-b-0 border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-6 py-4 transition-colors ${
              activeTab === 'preview'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-5 h-5" />
            Предпросмотр отчёта
          </button>
          {report.screenshots.length > 0 && (
            <button
              onClick={() => setActiveTab('screenshots')}
              className={`flex items-center gap-2 px-6 py-4 transition-colors ${
                activeTab === 'screenshots'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ImageIcon className="w-5 h-5" />
              Скриншоты ({report.screenshots.length})
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-b-xl border border-gray-200 shadow-xl">
        {activeTab === 'preview' ? (
          <div className="p-8 md:p-12 prose prose-lg max-w-none">
            <div className="mb-12 text-center border-b border-gray-200 pb-8">
              <h1 className="mb-4">{report.titlePage.title}</h1>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Автор:</strong> {report.titlePage.author}
                </p>
                <p>
                  <strong>Организация:</strong> {report.titlePage.organization}
                </p>
                <p>
                  <strong>Дата:</strong> {new Date(report.titlePage.date).toLocaleDateString('ru-RU')}
                </p>
                {report.titlePage.supervisor && (
                  <p>
                    <strong>Руководитель:</strong> {report.titlePage.supervisor}
                  </p>
                )}
              </div>
            </div>

            <div className="whitespace-pre-wrap">
              {report.generatedContent.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return (
                    <h1 key={index} className="mb-4">
                      {line.substring(2)}
                    </h1>
                  );
                } else if (line.startsWith('## ')) {
                  return (
                    <h2 key={index} className="mb-3 mt-8">
                      {line.substring(3)}
                    </h2>
                  );
                } else if (line.startsWith('### ')) {
                  return (
                    <h3 key={index} className="mb-2 mt-6">
                      {line.substring(4)}
                    </h3>
                  );
                } else if (line.startsWith('**') && line.endsWith('**')) {
                  return (
                    <p key={index} className="mb-2">
                      <strong>{line.substring(2, line.length - 2)}</strong>
                    </p>
                  );
                } else if (line.startsWith('- ')) {
                  return (
                    <li key={index} className="mb-1">
                      {line.substring(2)}
                    </li>
                  );
                } else if (line.startsWith('---')) {
                  return <hr key={index} className="my-8 border-gray-300" />;
                } else if (line.startsWith('*') && line.endsWith('*')) {
                  return (
                    <p key={index} className="mb-2 text-gray-500 italic">
                      {line.substring(1, line.length - 1)}
                    </p>
                  );
                } else if (line.trim() === '') {
                  return <div key={index} className="h-4" />;
                } else {
                  return (
                    <p key={index} className="mb-3">
                      {line}
                    </p>
                  );
                }
              })}
            </div>
          </div>
        ) : (
          <div className="p-8">
            <h3 className="mb-6 text-gray-900">Прикреплённые скриншоты</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {report.screenshots.map((screenshot, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(screenshot)}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-64 object-contain bg-gray-50"
                  />
                  <div className="p-3 bg-gray-50 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Скриншот {index + 1} - {screenshot.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Примечание:</strong> В реальной версии приложения отчёт будет сгенерирован с помощью
          локальных open-source LLM через Ollama. Это позволяет генерировать отчёты по локальным данным
          без прямой зависимости бизнес-логики от конкретной модели.
        </p>
      </div>
    </div>
  );
}