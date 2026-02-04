import { useState } from 'react';
import { ReportData, GeneratedReport } from '../App';
import { ChevronRight, ChevronLeft, Upload, Image, FileText, Sparkles, Palette, Download } from 'lucide-react';

interface ReportFormProps {
  onGenerate: (data: ReportData) => void;
  reportHistory: GeneratedReport[];
  onSelectReport: (report: GeneratedReport) => void;
  onDownloadReport: (report: GeneratedReport) => void;
  isGenerating: boolean;
  generationProgress: number;
}

export function ReportForm({ onGenerate, reportHistory, onSelectReport, onDownloadReport, isGenerating, generationProgress }: ReportFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ReportData>({
    workDescription: '',
    workGoal: '',
    conclusion: '',
    tone: '',
    screenshots: [],
    titlePage: {
      title: '',
      author: '',
      organization: '',
      date: new Date().toISOString().split('T')[0],
      supervisor: '',
    },
  });

  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData({ ...formData, screenshots: files });

      // Create previews
      const previews = files.map(file => URL.createObjectURL(file));
      setScreenshotPreviews(previews);
    }
  };

  const handleSubmit = () => {
    onGenerate(formData);
    setStep(5); // Move to report step
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.titlePage.title && formData.titlePage.author && formData.titlePage.organization;
      case 2:
        return formData.workGoal.length > 10 && formData.workDescription.length > 20 && formData.conclusion.length > 10;
      case 3:
        return true; // Tone description is optional
      case 4:
        return true; // Screenshots are optional
      case 5:
        return true; // Report view
      default:
        return false;
    }
  };

  const steps = [
    { number: 1, title: 'Титульный лист', icon: FileText },
    { number: 2, title: 'Содержание', icon: FileText },
    { number: 3, title: 'Тон отчёта', icon: Palette },
    { number: 4, title: 'Скриншоты', icon: Image },
    { number: 5, title: 'Отчёт', icon: Download },
  ];

  return (
    <div className="flex gap-6">
      {/* Main Form - Larger */}
      <div className="flex-1 max-w-4xl">
        {/* Progress Steps - Square Icons on top, centered */}
        <div className="mb-12">
          <div className="flex items-start justify-center gap-0">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all ${
                      step === s.number
                        ? 'bg-purple-600 text-white shadow-lg scale-110'
                        : step > s.number
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    <s.icon className="w-7 h-7" />
                  </div>
                  <span className={`mt-3 text-sm font-medium ${step === s.number ? 'text-purple-600' : 'text-gray-600'}`}>
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 w-16 mx-3 mt-8 rounded-full ${step > s.number ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card - Larger */}
        <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-200">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-gray-900 mb-2">Титульный лист</h2>
                <p className="text-gray-600">Заполните основную информацию об отчёте</p>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Название отчёта *</label>
                <input
                  type="text"
                  value={formData.titlePage.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      titlePage: { ...formData.titlePage, title: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Отчёт по лабораторной работе №1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Автор *</label>
                  <input
                    type="text"
                    value={formData.titlePage.author}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        titlePage: { ...formData.titlePage, author: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Иванов И.И."
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Организация *</label>
                  <input
                    type="text"
                    value={formData.titlePage.organization}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        titlePage: { ...formData.titlePage, organization: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Московский Университет"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Дата</label>
                  <input
                    type="date"
                    value={formData.titlePage.date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        titlePage: { ...formData.titlePage, date: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Руководитель (необязательно)</label>
                  <input
                    type="text"
                    value={formData.titlePage.supervisor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        titlePage: { ...formData.titlePage, supervisor: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Петров П.П."
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-gray-900 mb-2">Содержание отчёта</h2>
                <p className="text-gray-600">Опишите цель, выполненную работу и выводы</p>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Цель работы *</label>
                <textarea
                  value={formData.workGoal}
                  onChange={(e) => setFormData({ ...formData, workGoal: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Изучить основные принципы работы с базами данных, научиться проектировать реляционные базы данных..."
                />
                <p className="text-sm text-gray-500 mt-1">{formData.workGoal.length} символов</p>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Описание выполненной работы *</label>
                <textarea
                  value={formData.workDescription}
                  onChange={(e) => setFormData({ ...formData, workDescription: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="В ходе выполнения работы была спроектирована база данных для системы управления библиотекой..."
                />
                <p className="text-sm text-gray-500 mt-1">{formData.workDescription.length} символов</p>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Выводы *</label>
                <textarea
                  value={formData.conclusion}
                  onChange={(e) => setFormData({ ...formData, conclusion: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="В результате выполнения работы были достигнуты все поставленные цели..."
                />
                <p className="text-sm text-gray-500 mt-1">{formData.conclusion.length} символов</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-gray-900 mb-2">Тон отчёта</h2>
                <p className="text-gray-600">Опишите, как должен выглядеть отчёт</p>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Описание стиля и формата отчёта (необязательно)</label>
                <textarea
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Например: Отчёт должен быть написан в официальном деловом стиле, с использованием профессиональной терминологии. Необходимо включить подробный анализ результатов, диаграммы и графики. Язык должен быть академическим, но понятным широкой аудитории..."
                />
                <p className="text-sm text-gray-500 mt-1">{formData.tone.length} символов</p>
                <p className="text-sm text-gray-600 mt-2 bg-purple-50 p-3 rounded-lg">
                  💡 Совет: Укажите желаемый стиль (формальный, академический, деловой), структуру отчёта, 
                  уровень детализации и любые специфические требования к оформлению.
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-gray-900 mb-2">Скриншоты</h2>
                <p className="text-gray-600">Добавьте изображения или скриншоты (необязательно)</p>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Загрузить изображения</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-1">Нажмите для загрузки файлов</p>
                    <p className="text-sm text-gray-500">или перетащите файлы сюда</p>
                  </label>
                </div>

                {screenshotPreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {screenshotPreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded text-sm">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-gray-900 mb-2">Генерация отчёта</h2>
                <p className="text-gray-600">
                  {isGenerating ? 'Идёт генерация вашего отчёта...' : 'Отчёт готов к генерации'}
                </p>
              </div>

              {isGenerating && (
                <div className="space-y-4">
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-purple-600 h-4 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                  <p className="text-center text-gray-600">{generationProgress}%</p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {!isGenerating && generationProgress === 0 && (
                <div className="text-center py-8">
                  <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <p className="text-gray-600">Нажмите кнопку "Сгенерировать отчёт" для начала</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1 || isGenerating}
              className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Назад
            </button>

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!isStepValid()}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Далее
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : step === 4 ? (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid() || isGenerating}
                className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                <Sparkles className="w-5 h-5" />
                Сгенерировать отчёт
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Mini History Sidebar */}
      <div className="w-80 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 sticky top-24">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Недавние отчёты
          </h3>
          
          {reportHistory.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Отчётов пока нет</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {reportHistory.slice(0, 5).map((report) => (
                <div
                  key={report.id}
                  className="group p-3 border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md transition-all cursor-pointer relative"
                  onClick={() => onSelectReport(report)}
                >
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">
                    {report.titlePage.title}
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">
                    {new Date(report.generatedDate).toLocaleDateString('ru-RU')}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownloadReport(report);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3 p-1.5 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}