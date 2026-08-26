import { useNavigationStore, type Tab } from '../stores/navigation-store';

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'quiz', label: 'Quiz', icon: '📝' },
  { id: 'words', label: 'Words', icon: '📚' },
  { id: 'progress', label: 'Progress', icon: '📊' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export function BottomTabBar() {
  const { currentTab, setTab } = useNavigationStore();

  return (
    <div className="flex border-t border-divider bg-app-bg pb-[env(safe-area-inset-bottom)]">
      {tabs.map((tab) => {
        const isSelected = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className="flex-1 flex flex-col items-center gap-0.5 py-2"
          >
            <span className="text-lg">{tab.icon}</span>
            <span className={`text-[10px] font-semibold ${isSelected ? 'text-accent' : 'text-txt-tertiary'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
