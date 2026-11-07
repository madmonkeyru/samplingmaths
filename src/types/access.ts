/**
 * Access, Visibility, Ownership, and Provenance domain model.
 * Based on Frontend Architecture Analysis.md (UX-ACCESS-01).
 *
 * Distinguishes:
 * - Visibility: What can be viewed / browsed publicly vs. in learner context
 * - Ownership: Shared platform content vs. learner-private data
 * - Capability: Permitted product actions evaluated against capability provider
 * - Provenance: Official MEP content vs. Platform authored vs. Learner generated
 */

import type { ProductCapability } from '../services/capabilityModel';
import type { UserTier } from '../types/learningDomain';

export type ContentVisibility =
  | 'public'   // Freely viewable by any visitor without a profile
  | 'learner'; // Accessible in a learner workspace / personal context

export type ContentOwnership =
  | 'shared'   // Platform / official public asset
  | 'learner'; // Learner's private data (attempts, mastery, personal notes)

export type ContentProvenance =
  | 'official'          // Official MEP document, spec, benchmark question
  | 'authored'          // Platform-authored lesson, explanation, item
  | 'learner-generated';// Student answer, attempt, personal record

export type CoreCapability =
  | 'view'
  | 'practice'
  | 'save'
  | 'track'
  | 'analyze';

export interface AccessDecision {
  allowed: boolean;
  requiredTier?: UserTier;
  reasonEs?: string;
  requiredCapability?: ProductCapability;
}

export interface ContentAccessClassification {
  visibility: ContentVisibility;
  ownership: ContentOwnership;
  provenance: ContentProvenance;
  capabilities: CoreCapability[];
  requiredProductCapability?: ProductCapability;
}

/**
 * Common access presets across the application.
 */
export const ACCESS_PRESETS = {
  OFFICIAL_PUBLIC: {
    visibility: 'public' as ContentVisibility,
    ownership: 'shared' as ContentOwnership,
    provenance: 'official' as ContentProvenance,
    capabilities: ['view'] as CoreCapability[],
  },
  OFFICIAL_BENCHMARK: {
    visibility: 'public' as ContentVisibility,
    ownership: 'shared' as ContentOwnership,
    provenance: 'official' as ContentProvenance,
    capabilities: ['view', 'practice'] as CoreCapability[],
  },
  AUTHORED_SAMPLE: {
    visibility: 'public' as ContentVisibility,
    ownership: 'shared' as ContentOwnership,
    provenance: 'authored' as ContentProvenance,
    capabilities: ['view', 'practice'] as CoreCapability[],
  },
  AUTHORED_EXTENDED: {
    visibility: 'public' as ContentVisibility,
    ownership: 'shared' as ContentOwnership,
    provenance: 'authored' as ContentProvenance,
    capabilities: ['view', 'practice'] as CoreCapability[],
    requiredProductCapability: 'extended_authored_practice' as ProductCapability,
  },
  LEARNER_ATTEMPT: {
    visibility: 'learner' as ContentVisibility,
    ownership: 'learner' as ContentOwnership,
    provenance: 'learner-generated' as ContentProvenance,
    capabilities: ['view', 'track', 'analyze'] as CoreCapability[],
  },
  LEARNER_PROGRESS: {
    visibility: 'learner' as ContentVisibility,
    ownership: 'learner' as ContentOwnership,
    provenance: 'learner-generated' as ContentProvenance,
    capabilities: ['view', 'track', 'analyze'] as CoreCapability[],
  },
} as const;
