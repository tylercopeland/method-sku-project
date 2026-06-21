export const PLAN_ORDER = ['essentials', 'build', 'scale'] as const;
export type PlanId = typeof PLAN_ORDER[number];

export function nextPlanId(currentPlanId: string): PlanId | null {
  const idx = PLAN_ORDER.indexOf(currentPlanId as PlanId);
  return idx >= 0 && idx < PLAN_ORDER.length - 1 ? PLAN_ORDER[idx + 1] : null;
}
