import { useState } from 'react';
import { ReportForm } from './components/ReportForm';
import { ReportPreview } from './components/ReportPreview';
import { HistoryPage } from './components/HistoryPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { FileText, History, FileStack, LogIn, UserPlus } from 'lucide-react';
import type { GeneratedReport, ReportData } from './domain/report';
import { downloadReportAsDocx, generateComprehensiveReport } from './application/reportUseCases';

export default function App() {
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);
  const [reportHistory, setReportHistory] = useState<GeneratedReport[]>([]);
  const [currentPage, setCurrentPage] = useState<'home' | 'history' | 'login' | 'register'>('home');
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const handleGenerateReport = async (data: ReportData) => {
    setIsGenerating(true);
    setGenerationProgress(10);

    const progressInterval = window.setInterval(() => {
      setGenerationProgress(prev => (prev < 80 ? prev + 5 : prev));
    }, 500);

    try {
      const newReport = await generateComprehensiveReport(data);
      setGenerationProgress(100);
      setGeneratedReport(newReport);
      setReportHistory(prev => [newReport, ...prev]);
    } catch (err) {
      console.error(err);
      alert('Ошибка генерации отчёта. Проверьте backend, Ollama или переключите TEXT_GENERATOR=static.');
    } finally {
      window.clearInterval(progressInterval);
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleReset = () => setGeneratedReport(null);
  const handleLogin = (name: string) => { setUser({ name }); setCurrentPage('home'); };
  const handleLogout = () => setUser(null);
  const handleSelectReport = (report: GeneratedReport) => { setGeneratedReport(report); setCurrentPage('home'); };

  const handleDownloadReport = async (report: GeneratedReport) => {
    try {
      await downloadReportAsDocx(report);
    } catch (err) {
      console.error(err);
      alert('Не удалось скачать отчёт в DOCX. Проверьте backend.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2">
              <div className="bg-purple-600 p-2 rounded-lg"><FileText className="w-6 h-6 text-white" /></div>
              <span className="text-gray-900">ILoveReports</span>
            </button>
            <nav className="flex items-center gap-4">
              <button onClick={() => setCurrentPage('home')} className={`flex items-center gap-2 px-4 py-2 transition-colors ${currentPage==='home' ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'}`}>
                <FileStack className="w-4 h-4" /> Отчёты
              </button>
              <button onClick={() => setCurrentPage('history')} className={`flex items-center gap-2 px-4 py-2 transition-colors ${currentPage==='history' ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'}`}>
                <History className="w-4 h-4" /> История
              </button>
            </nav>
          </div>
          <div>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-700">Привет, {user.name}</span>
                <button onClick={handleLogout} className="px-4 py-2 text-gray-600 hover:text-gray-900">Выйти</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => setCurrentPage('login')} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentPage==='login' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}><LogIn className="w-4 h-4"/> Войти</button>
                <button onClick={() => setCurrentPage('register')} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"><UserPlus className="w-4 h-4"/> Зарегистрироваться</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'home' && (
          !generatedReport ? (
            <ReportForm 
              onGenerate={handleGenerateReport} 
              reportHistory={reportHistory}
              onSelectReport={handleSelectReport}
              onDownloadReport={handleDownloadReport}
              isGenerating={isGenerating}
              generationProgress={generationProgress}
            />
          ) : (
            <ReportPreview report={generatedReport} onReset={handleReset} onDownload={handleDownloadReport}/>
          )
        )}
        {currentPage === 'history' && (
          <HistoryPage reports={reportHistory} onSelectReport={handleSelectReport} onDownloadReport={handleDownloadReport}/>
        )}
        {currentPage === 'login' && <LoginPage onLogin={handleLogin}/>} 
        {currentPage === 'register' && <RegisterPage onRegister={handleLogin}/>} 
      </main>
    </div>
  );
}
