import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Layers, TrendingUp } from 'lucide-react';
import { PIPELINE_STAGES, computePipelineCounts } from '../../constants/leadStatuses';

/**
 * PipelineOverview — Dashboard summary widget.
 *
 * Shows:
 * - Total pipeline leads counter
 * - Stacked colour-coded distribution bar
 * - Per-stage count + percentage grid (6 cards)
 * - "View Board" link to /pipeline
 *
 * Guarantee: sum(stage counts) === totalLeads (every lead mapped to exactly one stage)
 */
const PipelineOverview = ({ leads = [] }) => {
  const totalLeads = leads.length;
  const stageCounts = computePipelineCounts(leads);
  const totalPipelineLeads = Object.values(stageCounts).reduce((s, n) => s + n, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 md:px-6 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
            <Layers size={16} className="text-orange-500" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white leading-tight">
              Pipeline Overview
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Real-time lead distribution across all stages
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Total badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
            <TrendingUp size={12} className="text-orange-500" />
            Total:&nbsp;<strong className="text-gray-900 dark:text-white">{totalPipelineLeads}</strong>
          </span>

          {/* View Board link */}
          <NavLink
            to="/pipeline"
            className="inline-flex items-center gap-1 text-xs font-semibold text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
          >
            View Board
            <ArrowRight size={13} />
          </NavLink>
        </div>
      </div>

      <div className="px-5 md:px-6 pt-4 pb-5 space-y-5">

        {/* ── Stacked Distribution Bar ────────────────────────────── */}
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-gray-100 dark:bg-gray-700/60 rounded-full overflow-hidden flex shadow-inner">
            {totalLeads > 0 ? (
              PIPELINE_STAGES.map((stage) => {
                const count = stageCounts[stage.id] || 0;
                if (count === 0) return null;
                const pct = ((count / totalLeads) * 100).toFixed(2);
                return (
                  <div
                    key={stage.id}
                    style={{ width: `${pct}%` }}
                    className={`h-full ${stage.color} transition-all duration-500`}
                    title={`${stage.label}: ${count} lead${count !== 1 ? 's' : ''} (${parseFloat(pct).toFixed(1)}%)`}
                  />
                );
              })
            ) : (
              <div className="h-full w-full bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-[9px] font-medium text-gray-400">No leads yet</span>
              </div>
            )}
          </div>

          {/* Legend row — colour dots */}
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {PIPELINE_STAGES.map((stage) => (
              <span key={stage.id} className="inline-flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                <span className={`w-2 h-2 rounded-full ${stage.color} flex-shrink-0`} />
                {stage.label}
              </span>
            ))}
          </div>
        </div>

        {/* ── Stage Cards Grid ────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {PIPELINE_STAGES.map((stage) => {
            const count = stageCounts[stage.id] || 0;
            const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;

            return (
              <div
                key={stage.id}
                className="flex flex-col items-center px-2 py-3 rounded-xl bg-gray-50/80 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700/50 hover:border-orange-200 dark:hover:border-orange-800/40 transition-colors group"
              >
                {/* Colour dot + label */}
                <div className="flex items-center gap-1.5 mb-2 w-full justify-center">
                  <span className={`w-2 h-2 rounded-full ${stage.color} flex-shrink-0`} />
                  <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 truncate">
                    {stage.label}
                  </span>
                </div>

                {/* Count */}
                <span className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white leading-none">
                  {count}
                </span>

                {/* Percentage */}
                <span className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 font-medium">
                  {pct}%
                </span>

                {/* Thin accent bar at bottom */}
                <div className="mt-2 w-full h-0.5 rounded-full bg-gray-100 dark:bg-gray-700/60 overflow-hidden">
                  <div
                    className={`h-full ${stage.color} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default PipelineOverview;
