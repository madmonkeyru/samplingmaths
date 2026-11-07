/**
 * Unified Access and Capability Service
 * Conforms to Frontend Architecture Analysis.md (UX-ACCESS-01 Section 10).
 *
 * Provides a single canonical capability and access evaluation point for the entire application,
 * eliminating fragmented checks across components.
 */

import {
  createCapabilityProvider,
  type CapabilityDecision,
  type CapabilityProvider,
  type ProductCapability,
} from './capabilityModel';
import { entitlementService } from './entitlementService';
import type { UserTier } from '../types/learningDomain';
import type {
  ContentAccessClassification,
  AccessDecision,
} from '../types/access';

export class AccessService {
  private getCapabilityProvider(): CapabilityProvider {
    return createCapabilityProvider(entitlementService.getTier());
  }

  public getTier(): UserTier {
    return entitlementService.getTier();
  }

  public setTier(tier: UserTier): void {
    entitlementService.setTier(tier);
  }

  public toggleTier(): UserTier {
    return entitlementService.toggleTier();
  }

  public subscribe(listener: (tier: UserTier) => void): () => void {
    return entitlementService.subscribe(listener);
  }

  /**
   * Evaluates if a given product capability is permitted for the current learner tier.
   */
  public can(capability: ProductCapability): boolean {
    return this.getCapabilityProvider().canAccess(capability);
  }

  /**
   * Detailed capability evaluation with user-friendly Spanish labels and rationale.
   */
  public evaluateCapability(capability: ProductCapability): CapabilityDecision {
    return this.getCapabilityProvider().evaluate(capability);
  }

  /**
   * Evaluates an access classification (visibility, ownership, capability, provenance).
   */
  public evaluateAccess(
    classification: ContentAccessClassification,
    isLearnerContext: boolean = false
  ): AccessDecision {
    // If content requires learner context but visitor is purely anonymous/public
    if (classification.visibility === 'learner' && !isLearnerContext) {
      return {
        allowed: false,
        reasonEs: 'Este contenido pertenece al espacio privado de estudio.',
      };
    }

    // If content requires a specific product capability, evaluate it
    if (classification.requiredProductCapability) {
      const decision = this.evaluateCapability(classification.requiredProductCapability);
      return {
        allowed: decision.allowed,
        requiredTier: decision.requiredTier,
        reasonEs: decision.reasonEs,
        requiredCapability: decision.capability,
      };
    }

    return {
      allowed: true,
      requiredTier: 'free',
    };
  }

  /**
   * Helper to check if a lesson is viewable given its ID or domain sample status.
   */
  public canAccessLesson(isSampleLesson: boolean): boolean {
    if (isSampleLesson) return true;
    return this.can('full_authored_lesson_pack');
  }

  /**
   * Helper to check if a practice mode is accessible.
   */
  public canAccessPractice(kind: 'diagnostic' | 'reference' | 'sample' | 'authored' | 'isomorphic' | 'mock'): boolean {
    switch (kind) {
      case 'diagnostic':
        return this.can('initial_diagnostic_and_basic_results');
      case 'reference':
        return this.can('official_reference_benchmark');
      case 'sample':
        return true;
      case 'authored':
        return this.can('extended_authored_practice');
      case 'isomorphic':
        return this.can('isomorphic_practice_drills');
      case 'mock':
        return this.can('configurable_mock_sessions');
      default:
        return false;
    }
  }
}

export const accessService = new AccessService();
