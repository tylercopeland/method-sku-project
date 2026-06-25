// Single source of truth for which features each plan tier unlocks.
//
// Derived from the SKU feature matrix (Trial / Essentials = SKU1 / Build = SKU2 /
// Scale = SKU3). This encodes only the subset of the matrix that the prototype
// actually gates in the UI — switching the active plan drives every gate from here.
//
// The three paid ids match `PlanId` in ./plans; `trial` is the unsubscribed,
// trial-active state.

export type PlanTier = 'trial' | 'essentials' | 'build' | 'scale';

export interface Entitlements {
  /** Included full seats. 999 = effectively unlimited (Trial). */
  includedSeats: number;
  /** Multi-user apps: Inventory, Time Tracking, Field Crew, Work Orders, Jobs, Schedules. */
  multiUserApps: boolean;
  /** Screen designer, customize launcher, App Builder access. */
  appCustomization: boolean;
  /** App Studio is visible and can draft apps. */
  appStudioAccess: boolean;
  /** App Studio can create & publish (not just draft). */
  appStudioPublish: boolean;
  /** AI-assisted custom field editing on detail screens. */
  aiCustomFields: boolean;
  /** App routines / automations. */
  appRoutines: boolean;
  /** API access. */
  apiAccess: boolean;
  /** Multi-entity is available as an add-on (does not auto-enable). */
  multiEntity: boolean;
}

export const ENTITLEMENTS: Record<PlanTier, Entitlements> = {
  trial: {
    includedSeats: 999,
    multiUserApps: true,
    appCustomization: true,
    appStudioAccess: true,
    appStudioPublish: true,
    aiCustomFields: true,
    appRoutines: true,
    apiAccess: false,
    multiEntity: false,
  },
  essentials: {
    includedSeats: 1,
    multiUserApps: false,
    appCustomization: false,
    appStudioAccess: true, // draft-only; publishing is gated by appStudioPublish
    appStudioPublish: false,
    aiCustomFields: true,
    appRoutines: false,
    apiAccess: false,
    multiEntity: false,
  },
  build: {
    includedSeats: 3,
    multiUserApps: true,
    appCustomization: true,
    appStudioAccess: true,
    appStudioPublish: true,
    aiCustomFields: true,
    appRoutines: true,
    apiAccess: true,
    multiEntity: false,
  },
  scale: {
    includedSeats: 8,
    multiUserApps: true,
    appCustomization: true,
    appStudioAccess: true,
    appStudioPublish: true,
    aiCustomFields: true,
    appRoutines: true,
    apiAccess: true,
    multiEntity: true,
  },
};

export const getEntitlements = (tier: PlanTier): Entitlements => ENTITLEMENTS[tier];
