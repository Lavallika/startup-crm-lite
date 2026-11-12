/**
 * Design token palette for analytics visualizers.
 * Configured to dynamically resolve to light and dark theme brand colors using CSS custom properties.
 */

export const STATUS_COLORS = {
  New: "var(--brand-secondary)",
  Contacted: "var(--brand-primary)",
  Meeting: "var(--brand-accent)",
  Proposal: "var(--brand-accent)",
  Won: "var(--brand-success)",
  Lost: "var(--brand-error)",
};

export const CHART_COLORS = {
  primary: "var(--brand-accent)",
  success: "var(--brand-success)",
  warning: "var(--brand-warning)",
  danger: "var(--brand-error)",
  purple: "var(--brand-primary)",
  muted: "var(--brand-secondary)"
};
