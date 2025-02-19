import { beforeEach, describe, expect, it } from 'vitest';
import {
  calculateDiscount,
  canDrive,
  fetchData,
  getCoupons,
  isPriceInRange,
  isValidUsername,
  Stack,
  validateUserInput,
} from '../src/core';

describe('core', () => {
  describe('getCoupons', () => {
    it('should return an array of coupons', () => {
      const coupons = getCoupons();
      expect(Array.isArray(coupons)).toBe(true);
      expect(coupons.length).toBeGreaterThan(0);
    });

    it('should return an array with valid coupon codes', () => {
      const coupons = getCoupons();
      coupons.forEach((coupon) => {
        expect(coupon).toHaveProperty('code');
        expect(typeof coupon.code).toBe('string');
        expect(coupon.code).toBeTruthy();
      });
    });

    it('should return an array with valid discounts', () => {
      const coupons = getCoupons();
      coupons.forEach((coupon) => {
        expect(coupon).toHaveProperty('discount');
        expect(typeof coupon.discount).toBe('number');
        expect(coupon.discount).toBeGreaterThan(0);
        expect(coupon.discount).toBeLessThan(1);
      });
    });
  });

  describe('calculateDiscount', () => {
    it('should return discounted price if given valid code', () => {
      expect(calculateDiscount(10, 'SAVE10')).toBe(9);
      expect(calculateDiscount(10, 'SAVE20')).toBe(8);
    });

    it('should handle non-numeric price', () => {
      expect(calculateDiscount('10', 'SAVE10')).toMatch(/invalid/i);
    });

    it('should handle negative price', () => {
      expect(calculateDiscount(-10, 'SAVE10')).toMatch(/invalid/i);
    });

    it('should handle non-string discount code', () => {
      expect(calculateDiscount(10, 10)).toMatch(/invalid/i);
    });

    it('should handle invalid discount code', () => {
      expect(calculateDiscount(10, 'INVALID')).toBe(10);
    });
  });

  describe('validateUserInput', () => {
    it('should return success if given valid input', () => {
      expect(validateUserInput('mosh', 42)).toMatch(/success/i);
    });

    it('should return an error if username is not a string', () => {
      expect(validateUserInput(1, 42)).toMatch(/invalid/i);
    });

    it('should return an error if username is less than 3 characters', () => {
      expect(validateUserInput('mo', 42)).toMatch(/invalid/i);
    });

    it('should return an error if username is longer than 255 characters', () => {
      expect(validateUserInput('A'.repeat(256), 42)).toMatch(/invalid/i);
    });

    it('should return an error if age is not a number', () => {
      expect(validateUserInput('mosh', '42')).toMatch(/invalid/i);
    });

    it('should return an error if age is less than 18', () => {
      expect(validateUserInput('mosh', 17)).toMatch(/invalid/i);
    });

    it('should return an error if age is greater than 100', () => {
      expect(validateUserInput('mosh', 101)).toMatch(/invalid/i);
    });

    it('should return an error if both username and age are invalid', () => {
      expect(validateUserInput('', 0)).toMatch(/invalid username/i);
      expect(validateUserInput('', 0)).toMatch(/invalid age/i);
    });
  });

  describe('isPriceInRange', () => {
    it('should return true if price is within range', () => {
      expect(isPriceInRange(10, 0, 100)).toBe(true);
    });

    it('should return true if price is equal to min or max', () => {
      expect(isPriceInRange(0, 0, 100)).toBe(true);
      expect(isPriceInRange(100, 0, 100)).toBe(true);
    });

    it('should return false if price is below range', () => {
      expect(isPriceInRange(-10, 0, 100)).toBe(false);
    });

    it('should return false if price is above range', () => {
      expect(isPriceInRange(110, 0, 100)).toBe(false);
    });
  });

  describe('isValidUsername', () => {
    it('should return true if username is within range', () => {
      expect(isValidUsername('Diakte')).toBe(true);
    });

    it('should return true if username is equal to min or max', () => {
      expect(isValidUsername('Diake')).toBe(true);
      expect(isValidUsername('Diakitemania123')).toBe(true);
    });

    it('should return false if username is below range', () => {
      expect(isValidUsername('mo')).toBe(false);
    });

    it('should return false if username is above range', () => {
      expect(isValidUsername('Diakitemania1234')).toBe(false);
    });

    it('should return false if username is invalid typeof', () => {
      expect(isValidUsername(123)).toBe(false);
      expect(isValidUsername(null)).toBe(false);
      expect(isValidUsername(undefined)).toBe(false);
    });
  });

  describe('canDrive', () => {
    it('should return error for invalid country code', () => {
      expect(canDrive(20, 'FR')).toMatch(/invalid/i);
    });

    it.each([
      { age: 15, country: 'US', result: false },
      { age: 16, country: 'US', result: true },
      { age: 17, country: 'US', result: true },
      { age: 16, country: 'UK', result: false },
      { age: 17, country: 'UK', result: true },
      { age: 18, country: 'UK', result: true },
    ])(
      'should return $result for $age, $country',
      ({ age, country, result }) => {
        expect(canDrive(age, country)).toBe(result);
      },
    );
  });

  describe('fetchData', () => {
    it('should return a promise that will resolve to an array of numbers', async () => {
      try {
        await fetchData();
      } catch (error) {
        expect(error).toHaveProperty('reason');
        expect(error.reason).toMatch(/fail/i);
      }
    });
  });

  describe('Stack', () => {
    let stack;

    beforeEach(() => {
      stack = new Stack();
    });

    it('push should add an item to the stack', () => {
      stack.push(1);

      expect(stack.size()).toBe(1);
    });

    it('pop should remove and return the top item from the stack', () => {
      stack.push(1);
      stack.push(2);

      const poppedItem = stack.pop();

      expect(poppedItem).toBe(2);
      expect(stack.size()).toBe(1);
    });

    it('pop should throw an error if stack is empty', () => {
      expect(() => stack.pop()).toThrow(/empty/i);
    });

    it('peek should return the top item from the stack without removing it', () => {
      stack.push(1);
      stack.push(2);

      const peekedItem = stack.peek();

      expect(peekedItem).toBe(2);
      expect(stack.size()).toBe(2);
    });

    it('peek should throw an error if stack is empty', () => {
      expect(() => stack.peek()).toThrow(/empty/i);
    });

    it('isEmpty should return true if stack is empty', () => {
      expect(stack.isEmpty()).toBe(true);
    });

    it('isEmpty should return false if stack is not empty', () => {
      stack.push(1);

      expect(stack.isEmpty()).toBe(false);
    });

    it('size should return the number of items in the stack', () => {
      stack.push(1);
      stack.push(2);

      expect(stack.size()).toBe(2);
    });

    it('clear should remove all items from the stack', () => {
      stack.push(1);
      stack.push(2);

      stack.clear();

      expect(stack.size()).toBe(0);
    });
  });
});
