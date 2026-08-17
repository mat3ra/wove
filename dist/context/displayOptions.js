import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo } from "react";
const DEFAULT_DISPLAY_OPTIONS = {
    showDeveloperInfo: false,
    showStatus: false,
};
const WoveDisplayOptionsContext = createContext(DEFAULT_DISPLAY_OPTIONS);
export function useWoveDisplayOptions() {
    return useContext(WoveDisplayOptionsContext);
}
export function WoveDisplayOptionsProvider({ children, showDeveloperInfo = DEFAULT_DISPLAY_OPTIONS.showDeveloperInfo, showStatus = DEFAULT_DISPLAY_OPTIONS.showStatus, }) {
    const value = useMemo(() => ({ showDeveloperInfo, showStatus }), [showDeveloperInfo, showStatus]);
    return (_jsx(WoveDisplayOptionsContext.Provider, { value: value, children: children }));
}
