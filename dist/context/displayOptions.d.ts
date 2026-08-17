import React from "react";
/**
 * Display options shared by every card and node wove renders.
 *
 * These are host decisions, not per-card ones: whether identifiers are on show
 * and whether unit status means anything depends on *where* the components are
 * mounted — a designer, where nothing has run, or a job view, where status is
 * the point. Threading that through would mean prop-drilling
 * `UnitsFlowchartContainer → UnitsFlowchart → reactflow node data → UnitNode →
 * UnitCard`, which is exactly the shape this package already avoids elsewhere
 * with context.
 *
 * Defaults are the quiet ones. A host opts in; individual components can still
 * override with an explicit prop.
 */
export interface WoveDisplayOptions {
    /** Render flowchart ids (with their copy affordance) under card titles. */
    showDeveloperInfo: boolean;
    /** Render unit status badges. */
    showStatus: boolean;
}
export declare function useWoveDisplayOptions(): WoveDisplayOptions;
export declare function WoveDisplayOptionsProvider({ children, showDeveloperInfo, showStatus, }: {
    children: React.ReactNode;
} & Partial<WoveDisplayOptions>): React.JSX.Element;
