import { describe, it, expect } from 'vitest';

/**
 * Isolated unit tests for Budibase Schema Field Type definitions.
 */

const STANDARD_FIELD_TYPES = ['string', 'number', 'boolean', 'datetime', 'options', 'array', 'link'] as const;

function isValidFieldType(typeStr: string): boolean {
  return (STANDARD_FIELD_TYPES as readonly string[]).includes(typeStr);
}

describe('Schema Field Type Validation', () => {
  it('should accept all supported Budibase core field types', () => {
    for (const type of STANDARD_FIELD_TYPES) {
      expect(isValidFieldType(type)).toBe(true);
    }
  });

  it('should reject invalid or custom unsupported type identifiers', () => {
    expect(isValidFieldType('unknown_type')).toBe(false);
    expect(isValidFieldType('')).toBe(false);
  });
});
