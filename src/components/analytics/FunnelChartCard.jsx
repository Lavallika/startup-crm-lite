import React, { useMemo, useState } from 'react';
import { CheckCircle2, XCircle, Clock, Info, ShieldCheck, ArrowDown } from 'lucide-react';
import { STATUS_COLORS } from '../../constants/analyticsColors';

/**
 * Enterprise Trapezoid-Shaped Sales Funnel Visualization Component
 * 
 * Features:
 * - Wide top section tapering smoothly down through 5 vertically stacked trapezoids
 * - Each segment centered horizontally with smooth sloping sides
 * - Represents all 3 leads across 5 sequential progression stages:
 *     1. New: 1 (33%)
 *     2. Contacted: 0 (0%)
 *     3. Qualified: 1 (33%)
 *     4. Proposal Sent: 0 (0%)
 *     5. Converted: 1 (33%)
 *     Total Funnel Leads: 3 (100% mathematical parity with Total Leads KPI)
 * - Closed Lost leads (0) kept strictly separate as a closed outcome
 * - Dual-column layout: Left = Stacked SVG Trapezoid Funnel; Right = Stage Details with Progress Bars
 * - Explicit metrics for Active Pipeline Count (2), Closed Won (1), Closed Lost (0), and Total Leads (3)
 * - Complete dark mode and light mode enterprise styling
 */
export const FunnelChartCard = ({ data }) => {
  const [activeHoverId, setActiveHoverId] = useState(null);

  // Extract counts and canonical stages
  const funnel = useMemo(() => {
    if (!data) {
      return {
        stages: [],
        lostStage: { id: 'Lost', name: 'Lost', label: 'Lost', count: 0, percentage: 0 },
        total: 0,
        lostCount: 0,
        wonCount: 0,
        activeCount: 0,
        wonPercentage: 0,
        lostPercentage: 0
      };
    }

    const stages = Array.isArray(data) ? data : (data.stages || []);
    const total = data.total ?? stages.reduce((sum, s) => sum + (s.count ?? s.value ?? 0), 0);
    const lostCount = data.lostCount ?? (stages.find(s => s.name === 'Lost' || s.id === 'Lost')?.count ?? 0);
    const wonCount = data.wonCount ?? (stages.find(s => s.name === 'Converted' || s.name === 'Won')?.count ?? 0);
    const activeCount = data.activeCount ?? Math.max(0, total - lostCount - wonCount);
    const wonPercentage = total > 0 ? Math.round((wonCount / total) * 100) : 0;
    const lostPercentage = total > 0 ? Math.round((lostCount / total) * 100) : 0;

    // Filter to the 5 primary forward pipeline stages (including Converted)
    const primaryFunnelStages = stages.filter(s => s.id !== 'Lost' && s.name !== 'Lost');

    // Ensure Lost stage object exists separately
    const lostStage = data.lostStage || stages.find(s => s.id === 'Lost' || s.name === 'Lost') || {
      id: 'Lost',
      name: 'Lost',
      label: 'Lost',
      description: 'Opportunity dropped or declined',
      count: lostCount,
      percentage: lostPercentage,
      color: STATUS_COLORS.Lost || '#EF4444'
    };

    return {
      stages: primaryFunnelStages,
      lostStage,
      total,
      lostCount,
      wonCount,
      activeCount,
      wonPercentage,
      lostPercentage
    };
  }, [data]);

  // Compute trapezoid geometry for the 5 progression stages
  const svgGeometry = useMemo(() => {
    const stageList = funnel.stages;
    const count = stageList.length || 5;

    // SVG coordinate space
    const svgWidth = 280;
    const svgHeight = 240;
    const centerX = svgWidth / 2;
    const gap = 5;
    const topPadding = 8;
    const bottomPadding = 8;

    const availableHeight = svgHeight - topPadding - bottomPadding - (count - 1) * gap;
    const segmentHeight = availableHeight / count;

    // Smooth tapering base widths from wide at top to narrow at bottom
    // Stages: [New, Contacted, Qualified, Proposal Sent, Converted]
    const boundaryWidths = [240, 202, 166, 132, 102, 76];

    // Build trapezoid polygons for each stage
    const segments = stageList.map((stage, i) => {
      const topY = topPadding + i * (segmentHeight + gap);
      const botY = topY + segmentHeight;
      const topW = boundaryWidths[i] || 100;
      const botW = boundaryWidths[i + 1] || 75;

      const x1 = centerX - topW / 2;
      const x2 = centerX + topW / 2;
      const x3 = centerX + botW / 2;
      const x4 = centerX - botW / 2;

      const pathData = `M ${x1.toFixed(1)} ${topY.toFixed(1)} L ${x2.toFixed(1)} ${topY.toFixed(1)} L ${x3.toFixed(1)} ${botY.toFixed(1)} L ${x4.toFixed(1)} ${botY.toFixed(1)} Z`;

      const midY = (topY + botY) / 2;
      const midW = (topW + botW) / 2;

      return {
        ...stage,
        pathData,
        topY,
        botY,
        midY,
        midW,
        centerX
      };
    });

    return {
      svgWidth,
      svgHeight,
      segments
    };
  }, [funnel.stages]);

  return (
    <div className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between transition-colors">
      
      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700/60">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              Sales Funnel
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {funnel.total} {funnel.total === 1 ? 'Lead' : 'Leads'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Stage-wise volume & progression across pipeline
          </p>
        </div>

        {/* Win Rate Quick Badges */}
        <div className="flex items-center gap-2 text-xs self-start sm:self-auto flex-wrap">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 font-semibold flex items-center gap-1.5 shadow-xs">
            <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
            {funnel.wonPercentage}% Win Rate
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 font-semibold flex items-center gap-1.5 shadow-xs">
            <Clock size={13} className="text-blue-600 dark:text-blue-400" />
            Active: {funnel.activeCount}
          </span>
        </div>
      </div>

      {/* ── Main Funnel Body: SVG Trapezoids + Stage Information ─────────── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center py-1">
        
        {/* Left: Stacked SVG Trapezoid Funnel */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[280px] aspect-[280/240] flex items-center justify-center">
            <svg
              viewBox={`0 0 ${svgGeometry.svgWidth} ${svgGeometry.svgHeight}`}
              className="w-full h-full overflow-visible drop-shadow-xs"
            >
              <defs>
                {/* Stage Gradients */}
                {svgGeometry.segments.map((seg, idx) => (
                  <linearGradient key={`funnel-grad-${idx}`} id={`funnel-grad-${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={seg.color || '#3B82F6'} stopOpacity={0.95} />
                    <stop offset="100%" stopColor={seg.color || '#3B82F6'} stopOpacity={0.80} />
                  </linearGradient>
                ))}
                {/* Glow Filter */}
                <filter id="funnel-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* Stacked Trapezoid Paths */}
              {svgGeometry.segments.map((seg, idx) => {
                const count = seg.count ?? seg.value ?? 0;
                const isHovered = activeHoverId === seg.id || activeHoverId === seg.name;
                const isZero = count === 0;

                return (
                  <g
                    key={seg.id || idx}
                    className="cursor-pointer transition-transform duration-200"
                    onMouseEnter={() => setActiveHoverId(seg.id || seg.name)}
                    onMouseLeave={() => setActiveHoverId(null)}
                  >
                    {/* Trapezoid Polygon */}
                    <path
                      d={seg.pathData}
                      fill={`url(#funnel-grad-${idx})`}
                      filter="url(#funnel-glow)"
                      className="transition-all duration-300"
                      stroke={isHovered ? '#FFFFFF' : 'rgba(255,255,255,0.3)'}
                      strokeWidth={isHovered ? 2 : 1}
                      opacity={isHovered ? 1 : activeHoverId ? 0.65 : isZero ? 0.75 : 0.95}
                    />

                    {/* Centered Stage Name inside Trapezoid */}
                    <text
                      x={seg.centerX}
                      y={seg.midY - 2}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize={seg.midW >= 120 ? '11' : '10'}
                      fontWeight="bold"
                      className="pointer-events-none select-none drop-shadow-sm tracking-wide"
                    >
                      {seg.name}
                    </text>

                    {/* Centered Count & Percentage inside Trapezoid */}
                    <text
                      x={seg.centerX}
                      y={seg.midY + 11}
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.95)"
                      fontSize="10"
                      fontWeight="600"
                      className="pointer-events-none select-none drop-shadow-xs"
                    >
                      {count} {count === 1 ? 'Lead' : 'Leads'} ({seg.percentage}%)
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500 mt-2 text-center">
            <span>Trapezoid funnel</span>
            <span>•</span>
            <span>New → Converted ({funnel.total} Leads)</span>
          </div>
        </div>

        {/* Right: Stage Information Breakdown (All 5 Funnel Stages + Lost Closed Outcome) */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-2.5">
          
          {/* Header Row */}
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-1">
            <span className="flex items-center gap-1.5">
              <Clock size={12} className="text-blue-500" />
              Funnel Progression ({funnel.stages.length} Stages • {funnel.total} Leads)
            </span>
            <span>Lead Count • Share</span>
          </div>

          {/* 5 Funnel Progression Stages */}
          <div className="space-y-2">
            {funnel.stages.map((stage) => {
              const count = stage.count ?? stage.value ?? 0;
              const pct = stage.percentage ?? (funnel.total > 0 ? Math.round((count / funnel.total) * 100) : 0);
              const isHovered = activeHoverId === stage.id || activeHoverId === stage.name;
              const isZero = count === 0;

              return (
                <div
                  key={stage.id}
                  onMouseEnter={() => setActiveHoverId(stage.id || stage.name)}
                  onMouseLeave={() => setActiveHoverId(null)}
                  className={`flex flex-col p-2 rounded-xl border text-xs transition-all duration-150 cursor-pointer ${
                    isHovered
                      ? 'bg-gray-100/90 dark:bg-gray-700/80 border-blue-400 dark:border-blue-500 shadow-xs'
                      : 'bg-gray-50/70 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700/60 hover:bg-gray-100/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: stage.color || '#3B82F6' }}
                      />
                      <div className="truncate">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {stage.label || stage.name}
                        </span>
                        {stage.description && (
                          <span className="text-[11px] text-gray-500 dark:text-gray-400 ml-1.5 hidden sm:inline">
                            • {stage.description}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-medium flex-shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          isZero
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            : 'text-white'
                        }`}
                        style={{ backgroundColor: isZero ? undefined : stage.color }}
                      >
                        {count} {count === 1 ? 'Lead' : 'Leads'}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300 text-xs w-8 text-right font-semibold">
                        {pct}%
                      </span>
                    </div>
                  </div>

                  {/* Horizontal mini progress bar showing stage volume proportion */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.max(isZero ? 0 : 6, pct)}%`,
                        backgroundColor: stage.color || '#3B82F6'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dedicated Closed Outcome: Lost Deals */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60">
            <div
              onMouseEnter={() => setActiveHoverId('Lost')}
              onMouseLeave={() => setActiveHoverId(null)}
              className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                activeHoverId === 'Lost'
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 dark:border-rose-600 shadow-xs'
                  : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/70 dark:border-rose-800/40'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <XCircle size={14} className="text-rose-500 flex-shrink-0" />
                <div>
                  <span className="font-bold text-rose-700 dark:text-rose-400">
                    Closed Lost
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 ml-1.5 hidden sm:inline">
                    • Disqualified or declined (separate from forward funnel)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300">
                  {funnel.lostCount} {funnel.lostCount === 1 ? 'Lead' : 'Leads'}
                </span>
                <span className="text-rose-700 dark:text-rose-300 text-xs w-8 text-right font-semibold">
                  {funnel.lostPercentage}%
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ── Summary Breakdown Footer ─────────────────────────────────── */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/70 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
          <Clock size={13} className="text-blue-500" />
          <span>Active Pipeline:</span>
          <strong className="text-gray-900 dark:text-white font-semibold">{funnel.activeCount}</strong>
        </div>

        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
          <CheckCircle2 size={13} className="text-emerald-500" />
          <span>Closed Won:</span>
          <strong className="text-gray-900 dark:text-white font-semibold">{funnel.wonCount}</strong>
        </div>

        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
          <XCircle size={13} className="text-rose-500" />
          <span>Closed Lost:</span>
          <strong className="text-gray-900 dark:text-white font-semibold">{funnel.lostCount}</strong>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
          <Info size={12} className="text-blue-500" />
          <span>Total CRM Leads: {funnel.total} ({funnel.activeCount} Active + {funnel.wonCount} Won + {funnel.lostCount} Lost)</span>
        </div>
      </div>

    </div>
  );
};
