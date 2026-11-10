export type BmiCategory = "underweight" | "healthy" | "overweight" | "obesity";

export const POUNDS_PER_KILOGRAM = 1 / 0.45359237;
export const CENTIMETERS_PER_INCH = 2.54;

export function parseMeasurement(value: string): number | null {
  const normalized = value.trim().replace(",", ".");
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) return null;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

export function calculateBmi(kilograms: number, centimeters: number): number | null {
  if (!Number.isFinite(kilograms) || !Number.isFinite(centimeters) || kilograms <= 0 || centimeters <= 0) return null;
  const bmi = kilograms / (centimeters / 100) ** 2;
  return Number.isFinite(bmi) && bmi > 0 ? bmi : null;
}

export function bmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "healthy";
  if (bmi < 30) return "overweight";
  return "obesity";
}
