import { useState, useCallback } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TabBar } from './components/TabBar';
import { HomePage } from './pages/HomePage';
import { TodayPage } from './pages/TodayPage';
import { RecordsPage } from './pages/RecordsPage';
import { RecordDetailPage } from './pages/RecordDetailPage';
import { SettingsPage } from './pages/SettingsPage';
import { ResultPage } from './pages/ResultPage';
import { AgentWorkflowPage } from './pages/AgentWorkflowPage';
import { Mic } from 'lucide-react';

type Page = 'home' | 'today' | 'records' | 'settings' | 'detail' | 'result' | 'workflow';

function AppShell() {
  const { state, dispatch } = useApp();
  const [page, setPage] = useState<Page>('workflow');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const handleNavigate = useCallback((target: string, recordId?: string) => {
    if (target === 'detail' && recordId) {
      setSelectedRecordId(recordId);
      setPage('detail');
    } else {
      setPage(target as Page);
    }
  }, []);

  const handleBack = useCallback(() => {
    setPage('records');
    setSelectedRecordId(null);
  }, []);

  const showTabBar = page !== 'detail' && page !== 'workflow';
  const isHomeWithResults = page === 'home' && state.currentCards !== null;
  const showRecordButton = page === 'result' || isHomeWithResults;

  const handleRecordButtonClick = useCallback(() => {
    if (page === 'result') {
      handleNavigate('home');
    } else if (isHomeWithResults) {
      dispatch({ type: 'SET_TRANSCRIPT', payload: null });
      dispatch({ type: 'SET_CURRENT_CARDS', payload: null });
    }
  }, [page, isHomeWithResults, handleNavigate, dispatch]);

  return (
    <>
      <div className="flex-1 flex flex-col min-h-0">
        {page === 'home' && <HomePage onNavigate={handleNavigate} />}
        {page === 'today' && <TodayPage />}
        {page === 'records' && <RecordsPage onNavigate={handleNavigate} />}
        {page === 'detail' && selectedRecordId && (
          <RecordDetailPage recordId={selectedRecordId} onBack={handleBack} />
        )}
        {page === 'result' && <ResultPage onNavigate={handleNavigate} />}
        {page === 'workflow' && <AgentWorkflowPage onNavigate={handleNavigate} />}
        {page === 'settings' && <SettingsPage />}
      </div>

      {/* Bottom fixed layer: record button + tab bar */}
      <div className="bottom-fixed-layer">
        {showRecordButton && (
          <button className="bottom-record-button" onClick={handleRecordButtonClick}>
            <Mic size={18} strokeWidth={2.2} />
            继续录音
          </button>
        )}
        {showTabBar && <TabBar active={page} onNavigate={handleNavigate} />}
      </div>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
