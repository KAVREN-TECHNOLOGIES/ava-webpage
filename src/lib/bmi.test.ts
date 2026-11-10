import { describe, expect, it } from "vitest";
import { bmiCategory, calculateBmi, CENTIMETERS_PER_INCH, parseMeasurement, POUNDS_PER_KILOGRAM } from "./bmi";

describe("BMI calculations", () => {
  it("calculates metric BMI and equivalent US measurements", () => {
    const metric = calculateBmi(70, 175);
    expect(metric).toBeCloseTo(22.857142857, 8);
    expect(calculateBmi(154.323583529 / POUNDS_PER_KILOGRAM, (5 * 12 + 8.897637795) * CENTIMETERS_PER_INCH)).toBeCloseTo(metric!, 7);
    expect(calculateBmi(200 / POUNDS_PER_KILOGRAM, 68 * CENTIMETERS_PER_INCH)).toBeCloseTo(30.409583894, 8);
  });
  it.each([
    [18.4999, "underweight"], [18.5, "healthy"], [24.9999, "healthy"],
    [25, "overweight"], [29.9999, "overweight"], [30, "obesity"], [45, "obesity"],
  ] as const)("classifies %s using the unrounded value", (bmi, category) => {
    expect(bmiCategory(bmi)).toBe(category);
  });
  it("rejects invalid numbers and supports decimal commas", () => {
    for (const value of ["", " ", "-5", "abc", "Infinity", "1e5", "12.3.4"]) expect(parseMeasurement(value)).toBeNull();
    expect(parseMeasurement("65,5")).toBe(65.5);
    expect(parseMeasurement(" 165.5 ")).toBe(165.5);
    for (const [weight, height] of [[0, 170], [-1, 170], [70, 0], [NaN, 170], [Infinity, 170], [70, Number.MIN_VALUE]]) expect(calculateBmi(weight, height)).toBeNull();
  });
});
