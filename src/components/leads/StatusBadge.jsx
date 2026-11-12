import React from 'react';
import { PIPELINE_STAGES, getLeadStage } from '../../constants/leadStatuses';

/**
 * A pill-shaped badge component that visually indicates the lead's status.
 *
 * @param {{ status: string, className?: string }} props
 * @returns {JSX.Element}
 */
const StatusBadge = ({ status, className = '' }) => {
  const stageId = getLeadStage(status);
  const stageConfig = PIPELINE_STAGES.find((s) => s.id === stageId) || PIPELINE_STAGES[0];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${stageConfig.badgeClass} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${stageConfig.color}`} />
      {status || stageConfig.label}
    </span>
  );
};

export default StatusBadge;
