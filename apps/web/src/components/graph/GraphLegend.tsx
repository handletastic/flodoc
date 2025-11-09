export function GraphLegend() {
  const legendItems = [
    { type: 'prerequisite', label: 'Prerequisite', color: '#ef4444' },
    { type: 'related', label: 'Related', color: '#3b82f6' },
    { type: 'example', label: 'Example', color: '#10b981' },
  ];

  return (
    <div
      data-testid="graph-legend"
      className="bg-background border rounded-lg shadow-lg p-3"
    >
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        Connection Types
      </h3>
      <div className="space-y-2">
        {legendItems.map(({ type, label, color }) => (
          <div
            key={type}
            data-legend-item={type}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-0.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <svg className="w-3 h-3" style={{ color }}>
                <path
                  d="M0,1.5 L3,1.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="10"
                    refX="5"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 6 3, 0 6" fill="currentColor" />
                  </marker>
                </defs>
              </svg>
            </div>
            <span className="text-sm">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
