import React, { useState } from 'react';
import type { YearSimulationPoint } from '../../types/finance';
import { formatCurrency } from '../../utils/formatters';

interface DcaChartProps {
  timeline: YearSimulationPoint[];
}

export const DcaChart: React.FC<DcaChartProps> = ({ timeline }) => {
  const [hoveredPoint, setHoveredPoint] = useState<YearSimulationPoint | null>(null);

  if (!timeline || timeline.length === 0) return null;

  const width = 800;
  const height = 340;
  const padding = { top: 20, right: 30, bottom: 40, left: 70 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxYear = timeline[timeline.length - 1].year || 1;
  const maxGross = Math.max(...timeline.map((p) => p.grossValue), 1000);
  const yMax = Math.ceil(maxGross * 1.1);

  const getX = (year: number) => padding.left + (year / maxYear) * chartWidth;
  const getY = (val: number) => padding.top + chartHeight - (val / yMax) * chartHeight;

  const generatePath = (valExtractor: (p: YearSimulationPoint) => number) => {
    return timeline.reduce((acc, point, i) => {
      const x = getX(point.year);
      const y = getY(valExtractor(point));
      return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  };

  const generateAreaPath = (valExtractor: (p: YearSimulationPoint) => number) => {
    const linePath = generatePath(valExtractor);
    const lastPoint = timeline[timeline.length - 1];
    const firstPoint = timeline[0];
    return `${linePath} L ${getX(lastPoint.year)} ${getY(0)} L ${getX(firstPoint.year)} ${getY(0)} Z`;
  };

  const grossPath = generatePath((p) => p.grossValue);
  const netPath = generatePath((p) => p.netValueAfterTaxes);
  const depositedPath = generatePath((p) => p.totalDeposited);
  const areaNet = generateAreaPath((p) => p.netValueAfterTaxes);

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => Math.round(yMax * ratio));
  const xTicks = timeline
    .filter((_, idx) => idx % Math.max(1, Math.floor(timeline.length / 6)) === 0 || idx === timeline.length - 1)
    .map((p) => p.year);

  return (
    <div className="relative w-full overflow-hidden bg-claude-card dark:bg-claude-darkCard p-4 rounded-xl border border-claude-border dark:border-claude-darkBorder">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-2 border-b border-claude-border/50 dark:border-claude-darkBorder/50">
        <span className="text-xs font-semibold text-claude-muted dark:text-claude-darkMuted">
          Évolution du Capital
        </span>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 bg-claude-accent rounded-full"></span>
            <span className="text-claude-text dark:text-claude-darkText">Brut</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 bg-emerald-500 rounded-full"></span>
            <span className="text-claude-text dark:text-claude-darkText">Net après taxe</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 bg-stone-400 rounded-full border-dashed"></span>
            <span className="text-claude-muted dark:text-claude-darkMuted">Dépôts</span>
          </div>
        </div>
      </div>

      <div className="relative w-full" style={{ paddingBottom: '42%' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="absolute inset-0 w-full h-full select-none"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {yTicks.map((val) => {
            const y = getY(val);
            return (
              <g key={`y-${val}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="currentColor"
                  className="text-claude-border/70 dark:text-claude-darkBorder/70"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] font-mono fill-claude-muted dark:fill-claude-darkMuted"
                >
                  {formatCurrency(val)}
                </text>
              </g>
            );
          })}

          {xTicks.map((yr) => {
            const x = getX(yr);
            return (
              <g key={`x-${yr}`}>
                <text
                  x={x}
                  y={height - padding.bottom + 20}
                  textAnchor="middle"
                  className="text-[11px] font-mono fill-claude-muted dark:fill-claude-darkMuted"
                >
                  An {yr}
                </text>
              </g>
            );
          })}

          <path d={areaNet} fill="url(#netGradient)" />

          <path
            d={depositedPath}
            fill="none"
            stroke="currentColor"
            className="text-stone-400 dark:text-stone-600"
            strokeWidth="1.5"
            strokeDasharray="5 5"
          />
          <path
            d={netPath}
            fill="none"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={grossPath}
            fill="none"
            stroke="#C25E34"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {timeline.map((point) => {
            const x = getX(point.year);
            const y = getY(point.netValueAfterTaxes);
            const isHovered = hoveredPoint?.year === point.year;
            return (
              <g
                key={`point-${point.year}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(point)}
              >
                <rect
                  x={x - (chartWidth / maxYear) / 2}
                  y={padding.top}
                  width={chartWidth / maxYear}
                  height={chartHeight}
                  fill="transparent"
                />
                {isHovered && (
                  <>
                    <line
                      x1={x}
                      y1={padding.top}
                      x2={x}
                      y2={padding.top + chartHeight}
                      stroke="currentColor"
                      className="text-claude-muted/50"
                      strokeWidth="1"
                    />
                    <circle cx={x} cy={getY(point.grossValue)} r="4" fill="#C25E34" />
                    <circle cx={x} cy={y} r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                    <circle cx={x} cy={getY(point.totalDeposited)} r="3" fill="#888888" />
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {hoveredPoint && (
          <div
            className="absolute z-20 pointer-events-none p-2.5 rounded-lg bg-claude-card dark:bg-claude-darkCard shadow-lg border border-claude-border dark:border-claude-darkBorder text-xs text-claude-text dark:text-claude-darkText min-w-[190px]"
            style={{
              left: `${Math.min(80, Math.max(10, (hoveredPoint.year / maxYear) * 100))}%`,
              top: '15px',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="font-semibold text-claude-accent mb-1 border-b border-claude-border/40 pb-1 flex justify-between">
              <span>An {hoveredPoint.year} ({hoveredPoint.age} ans)</span>
              {hoveredPoint.year >= 5 ? (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">&gt; 5 ans (0% IR)</span>
              ) : (
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">&lt; 5 ans (PFU)</span>
              )}
            </div>
            <div className="space-y-1 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-claude-muted">Brut :</span>
                <span className="font-semibold">{formatCurrency(hoveredPoint.grossValue)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Net :</span>
                <span className="font-semibold">{formatCurrency(hoveredPoint.netValueAfterTaxes)}</span>
              </div>
              <div className="flex justify-between text-claude-muted">
                <span>Dépôts :</span>
                <span>{formatCurrency(hoveredPoint.totalDeposited)}</span>
              </div>
              <div className="flex justify-between text-claude-muted text-[10px]">
                <span>Plafond :</span>
                <span>{formatCurrency(hoveredPoint.activeCeiling)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
