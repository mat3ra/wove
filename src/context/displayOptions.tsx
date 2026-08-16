import React, { createContext, useContext, useMemo } from "react";

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

const DEFAULT_DISPLAY_OPTIONS: WoveDisplayOptions = {
    showDeveloperInfo: false,
    showStatus: false,
};

const WoveDisplayOptionsContext = createContext<WoveDisplayOptions>(DEFAULT_DISPLAY_OPTIONS);

export function useWoveDisplayOptions(): WoveDisplayOptions {
    return useContext(WoveDisplayOptionsContext);
}

export function WoveDisplayOptionsProvider({
    children,
    showDeveloperInfo = DEFAULT_DISPLAY_OPTIONS.showDeveloperInfo,
    showStatus = DEFAULT_DISPLAY_OPTIONS.showStatus,
}: {
    children: React.ReactNode;
} & Partial<WoveDisplayOptions>) {
    const value = useMemo(
        () => ({ showDeveloperInfo, showStatus }),
        [showDeveloperInfo, showStatus],
    );

    return (
        <WoveDisplayOptionsContext.Provider value={value}>
            {children}
        </WoveDisplayOptionsContext.Provider>
    );
}
