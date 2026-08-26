import { useNavigationStore } from './stores/navigation-store';
import { BottomTabBar } from './components/BottomTabBar';
import { QuizPage } from './pages/QuizPage';
import { WordsPage } from './pages/WordsPage';
import { ProgressPage } from './pages/ProgressPage';
import { SettingsPage } from './pages/SettingsPage';

const tabContent = {
  quiz: <QuizPage />,
  words: <WordsPage />,
  progress: <ProgressPage />,
  settings: <SettingsPage />,
};

function App() {
  const currentTab = useNavigationStore((s) => s.currentTab);

  return (
    <div className="h-full flex flex-col bg-app-bg text-txt-primary">
      {tabContent[currentTab]}
      <BottomTabBar />
    </div>
  );
}

export default App;
