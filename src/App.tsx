import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useNavigationStore } from './stores/navigation-store';
import { usePwaStore } from './stores/pwa-store';
import { useAuthStore } from './stores/auth-store';
import { initSync } from './lib/sync';
import { BottomTabBar } from './components/BottomTabBar';
import { QuizPage } from './pages/QuizPage';
import { WordsPage } from './pages/WordsPage';
import { StoriesPage } from './pages/StoriesPage';
import { ProgressPage } from './pages/ProgressPage';
import { SettingsPage } from './pages/SettingsPage';

const tabContent = {
  quiz: <QuizPage />,
  words: <WordsPage />,
  stories: <StoriesPage />,
  progress: <ProgressPage />,
  settings: <SettingsPage />,
};

function App() {
  const currentTab = useNavigationStore((s) => s.currentTab);
  const isQuizActive = useNavigationStore((s) => s.isQuizActive);
  const isFlashcardActive = useNavigationStore((s) => s.isFlashcardActive);
  const isStoryActive = useNavigationStore((s) => s.isStoryActive);
  const setPwaStatus = usePwaStore((s) => s.setStatus);

  const {
    offlineReady: [offlineReady],
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      registration?.update();
    },
  });

  useEffect(() => {
    setPwaStatus(offlineReady, needRefresh, updateServiceWorker);
  }, [offlineReady, needRefresh, updateServiceWorker, setPwaStatus]);

  useEffect(() => {
    useAuthStore.getState().init();
    initSync();
  }, []);

  return (
    <div className="h-full flex flex-col bg-app-bg text-txt-primary">
      {tabContent[currentTab]}
      {!isQuizActive && !isFlashcardActive && !isStoryActive && <BottomTabBar />}
    </div>
  );
}

export default App;
