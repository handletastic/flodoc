import type { ViewMode } from '@/components/DocumentGraph';
import { useReactFlow } from '@xyflow/react';

interface GraphControlsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showMinimap: boolean;
  onToggleMinimap: () => void;
}

export function GraphControls({
  viewMode,
  onViewModeChange,
  showMinimap,
  onToggleMinimap,
}: GraphControlsProps) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const viewModes: { mode: ViewMode; label: string }[] = [
    { mode: 'knowledge-graph', label: 'Knowledge Graph' },
    { mode: 'navigation-tree', label: 'Navigation Tree' },
    { mode: 'learning-path', label: 'Learning Path' },
  ];

  return (
    <div
      data-testid="graph-controls"
      className="bg-background border rounded-lg shadow-lg p-3 space-y-3"
    >
      {/* View Mode Selector */}
      <div data-testid="view-mode-selector" className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          View Mode
        </label>
        <div className="flex flex-col gap-1">
          {viewModes.map(({ mode, label }) => (
            <button
              key={mode}
              data-view-mode={mode}
              onClick={() => onViewModeChange(mode)}
              className={`
                px-3 py-2 text-sm rounded-md text-left transition-colors
                ${
                  viewMode === mode
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'bg-secondary hover:bg-accent'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="space-y-2 pt-3 border-t">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Controls
        </label>
        <div className="flex flex-col gap-1">
          <button
            data-testid="zoom-in"
            onClick={() => zoomIn()}
            className="px-3 py-2 text-sm bg-secondary hover:bg-accent rounded-md transition-colors flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Zoom In
          </button>

          <button
            data-testid="zoom-out"
            onClick={() => zoomOut()}
            className="px-3 py-2 text-sm bg-secondary hover:bg-accent rounded-md transition-colors flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
            Zoom Out
          </button>

          <button
            data-testid="fit-view"
            onClick={() => fitView({ padding: 0.2, duration: 300 })}
            className="px-3 py-2 text-sm bg-secondary hover:bg-accent rounded-md transition-colors flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
            Fit View
          </button>

          <button
            data-testid="toggle-minimap"
            onClick={onToggleMinimap}
            className={`
              px-3 py-2 text-sm rounded-md transition-colors flex items-center gap-2
              ${
                showMinimap
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-accent'
              }
            `}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            {showMinimap ? 'Hide' : 'Show'} Minimap
          </button>
        </div>
      </div>
    </div>
  );
}
