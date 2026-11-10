import { procedures } from "./procedures";
import { aeComboStates } from "./aeComboAssets";
import type { Language } from "../lib/language";

export const comboIds = ["bbl", "liposuccion", "abdominoplastia", "aumento-de-pecho", "levantamiento-de-pecho", "reduccion-de-pecho"] as const;
export type ComboId = typeof comboIds[number];
export type ComboView = "front" | "back";
const imageStates = new Set<string>(aeComboStates);

export function comboState(selected: readonly ComboId[]): string {
  return comboIds.filter(id => selected.includes(id)).join("__") || "base";
}

export function hasComboImage(selected: readonly ComboId[]): boolean {
  return imageStates.has(comboState(selected));
}

export function comboImage(selected: readonly ComboId[] = [], view: ComboView = "front"): string {
  return `/media/combo-ae/${comboState(selected)}-${view}.webp`;
}

export const comboOptions = comboIds.map(id => {
  const procedure = procedures.find(item => item.slug === id)!;
  return { id, name: procedure.name, group: procedure.category === "breast" ? "breast" as const : "body" as const };
});

const isBreast = (id: ComboId) => comboOptions.some(item => item.id === id && item.group === "breast");

export function changeCombo(selected: readonly ComboId[], id: ComboId): ComboId[] {
  if (selected.includes(id)) return selected.filter(item => item !== id);
  const next = isBreast(id) ? selected.filter(item => !isBreast(item)) : [...selected];
  return next.length < 3 ? [...next, id] : [...selected];
}

export function canChangeCombo(selected: readonly ComboId[], id: ComboId): boolean {
  const next = changeCombo(selected, id);
  return (selected.includes(id) || next.includes(id)) && hasComboImage(next);
}

export function readCombo(raw: string | null): ComboId[] {
  return [...new Set((raw ?? "").split(","))].reduce<ComboId[]>((selected, value) =>
    comboIds.includes(value as ComboId) ? changeCombo(selected, value as ComboId) : selected, []);
}

export function comboNames(selected: readonly ComboId[], language: Language): string {
  return selected.map(id => comboOptions.find(item => item.id === id)!.name[language]).join(" + ");
}
