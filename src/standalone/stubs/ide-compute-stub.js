/**
 * Stub for @mat3ra/ide/dist/js/compute
 *
 * `computedEntityMixin` is called at class-body time in @mat3ra/wode's
 * Workflow.js and Subworkflow.js to attach compute-related prototype methods.
 * In the wove standalone we don't use compute functionality, so a no-op is fine.
 */
export const computedEntityMixin = (prototype) => prototype;

// Stub out any other exports that wode or its deps might pull in.
export const ComputeMethod = {};
export const ComputeMethodFactory = { create: () => ({}) };
export default { computedEntityMixin, ComputeMethod, ComputeMethodFactory };
