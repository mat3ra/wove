import { WORKFLOW_STATUSES } from "@mat3ra/wode";

export function WORKFLOW_STATUS_TEXT(status) {
    return (
        {
            [WORKFLOW_STATUSES["up-to-date"]]: "✔",
            [WORKFLOW_STATUSES.outdated]: "✘",
        }[status] || "-"
    );
}
export function WORKFLOW_STATUS_COLOR(status) {
    return (
        {
            [WORKFLOW_STATUSES["up-to-date"]]: "success",
            [WORKFLOW_STATUSES.outdated]: "error",
        }[status] || "default"
    );
}
