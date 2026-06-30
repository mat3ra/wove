import React from "react";

/**
 * Minimal Application component stub for the wove standalone.
 *
 * The real @mat3ra/ave Application component calls ApplicationRegistry which
 * requires a Meteor/server-side driver. This stub renders the app name/version
 * read-only using React.createElement (no JSX so this file stays .js).
 */
export function Application({ application }) {
    if (!application) return null;
    const label = [application.name, application.version].filter(Boolean).join(" ");
    return React.createElement(
        "div",
        { style: { fontSize: "0.75rem", color: "#aaa", padding: "4px 0" } },
        "Application: ",
        React.createElement("strong", null, label || "unknown"),
    );
}

export default { Application };
