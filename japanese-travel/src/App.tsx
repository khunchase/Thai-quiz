import { useNavigationStore } from './stores/navigation-store';
import { BottomTabBar } from './components/BottomTabBar';
import { PracticePage } from './pages/PracticePage';
import { PhrasesPage } from './pages/PhrasesPage';
import { ProgressPage } from './pages/ProgressPage';
import { SettingsPage } from './pages/SettingsPage';

const tabContent = {
  practice: <PracticePage />,
  phrases: <PhrasesPage />,
  progress: <ProgressPage />,
  settings: <SettingsPage />,
};

function App() {
  const currentTab = useNavigationStore((s) => s.currentTab);
  const isSessionActive = useNavigationStore((s) => s.isSessionActive);

  return (
    <div className="h-full flex flex-col bg-app-bg text-txt-primary">
      {tabContent[currentTab]}
      {!isSessionActive && <BottomTabBar />}
    </div>
  );
}

export default App;
