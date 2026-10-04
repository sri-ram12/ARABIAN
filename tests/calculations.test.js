const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Haversine formula
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Coupon discount calculator
function calculateCouponDiscount(coupon, subtotal) {
  if (!coupon || !coupon.isActive) return 0;
  if (subtotal < coupon.minOrderAmount) return 0;
  let discount = 0;
  if (coupon.discountType === 'PERCENTAGE') {
    discount = (subtotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }
  return Math.min(discount, subtotal);
}

// Order Total Calculator
function calculateOrderTotal({ subtotal, discount = 0, deliveryFee = 35, taxPercentage = 5, packagingFee = 25 }) {
  const taxable = Math.max(0, subtotal - discount);
  const tax = Math.round(taxable * (taxPercentage / 100) * 100) / 100;
  return Math.round((taxable + tax + deliveryFee + packagingFee) * 100) / 100;
}

describe('Arabian Mandi Core Business Logic Tests', () => {
  test('Haversine distance calculation within Thagarapuvalasa', () => {
    // Distance from restaurant on NH16 to Sangivalasa Arch (~0.6 km)
    const dist = calculateDistanceKm(17.9288, 83.4350, 17.9250, 83.4385);
    assert.ok(dist >= 0.5 && dist <= 0.8, `Expected distance ~0.6km, got ${dist}km`);
  });

  test('Haversine distance calculation to Bheemili (~4.5 km)', () => {
    const dist = calculateDistanceKm(17.9288, 83.4350, 17.8920, 83.4540);
    assert.ok(dist >= 4.0 && dist <= 5.5, `Expected distance ~4.5km, got ${dist}km`);
  });

  test('Flat discount coupon WELCOME50 logic', () => {
    const coupon = {
      code: 'WELCOME50',
      discountType: 'FLAT',
      discountValue: 50,
      minOrderAmount: 299,
      isActive: true,
    };

    assert.equal(calculateCouponDiscount(coupon, 250), 0); // below minimum
    assert.equal(calculateCouponDiscount(coupon, 329), 50); // meets minimum
  });

  test('Percentage discount coupon FESTIVE15 with cap', () => {
    const coupon = {
      code: 'FESTIVE15',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      minOrderAmount: 499,
      maxDiscount: 150,
      isActive: true,
    };

    // 15% of 600 = 90
    assert.equal(calculateCouponDiscount(coupon, 600), 90);
    // 15% of 2000 = 300, capped at 150
    assert.equal(calculateCouponDiscount(coupon, 2000), 150);
  });

  test('Order total computation with 5% GST and packaging fee', () => {
    const total = calculateOrderTotal({
      subtotal: 600,
      discount: 50,
      deliveryFee: 30,
      taxPercentage: 5,
      packagingFee: 25,
    });
    // Taxable = 600 - 50 = 550
    // Tax = 550 * 0.05 = 27.5
    // Total = 550 + 27.5 + 30 + 25 = 632.5
    assert.equal(total, 632.5);
  });

  test('Order status progression validation', () => {
    const validTransitions = {
      PLACED: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['PREPARING', 'CANCELLED'],
      PREPARING: ['READY_FOR_PICKUP'],
      READY_FOR_PICKUP: ['OUT_FOR_DELIVERY'],
      OUT_FOR_DELIVERY: ['DELIVERED'],
    };

    assert.ok(validTransitions['PLACED'].includes('CONFIRMED'));
    assert.ok(validTransitions['PREPARING'].includes('READY_FOR_PICKUP'));
    assert.ok(!validTransitions['PREPARING'].includes('DELIVERED')); // Cannot skip steps
  });
});
