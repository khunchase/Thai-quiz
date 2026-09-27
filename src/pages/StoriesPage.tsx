import { useEffect, useState } from 'react';
import { STORIES } from '../data/stories';
import type { Story } from '../types/story';
import { useSettingsStore, singleThaiFontClass } from '../stores/settings-store';
import { useNavigationStore } from '../stores/navigation-store';
import { Card } from '../components/ui/Card';
import { StoryReader } from '../components/stories/StoryReader';

export function StoriesPage() {
  const fontStyle = useSettingsStore((s) => s.settings.thaiFontStyle);
  const setStoryActive = useNavigationStore((s) => s.setStoryActive);
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  useEffect(() => {
    setStoryActive(activeStory !== null);
    return () => setStoryActive(false);
  }, [activeStory, setStoryActive]);

  if (activeStory) {
    return <StoryReader story={activeStory} onExit={() => setActiveStory(null)} />;
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-y-auto">
      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Stories</h1>

        <div className="flex flex-col gap-2">
          {STORIES.map((story) => (
            <Card key={story.id} onClick={() => setActiveStory(story)} className="flex items-center gap-3">
              <div className="text-2xl shrink-0">📖</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{story.title.english}</div>
                <div className={`${singleThaiFontClass(fontStyle)} text-txt-secondary text-sm truncate`}>
                  {story.title.thai}
                </div>
                <div className="text-txt-tertiary text-xs mt-0.5">{story.sentences.length} sentences</div>
              </div>
              <div className="text-txt-tertiary text-lg shrink-0">›</div>
            </Card>
          ))}
          {STORIES.length === 0 && (
            <div className="text-center text-txt-tertiary text-sm py-8">No stories yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
