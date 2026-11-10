import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { aeComboStates } from "./aeComboAssets";
import { canChangeCombo, changeCombo, comboIds, comboImage, comboOptions, comboState, hasComboImage } from "./combo";

describe("original A&E image coverage", () => {
  it("ships front and back for every selectable state, independent of click order", () => {
    const states = new Set<string>();
    for (let mask = 0; mask < 1 << comboIds.length; mask++) {
      const selected = comboIds.filter((_, i) => mask & 1 << i);
      if (selected.length > 3 || selected.filter(id => comboOptions.find(item => item.id === id)?.group === "breast").length > 1 || !hasComboImage(selected)) continue;
      states.add(comboState(selected));
      for (const view of ["front", "back"] as const) {
        const path = comboImage(selected, view);
        expect(comboImage([...selected].reverse(), view)).toBe(path);
        expect(existsSync(resolve("public", `.${path}`))).toBe(true);
      }
      for (const id of comboIds) if (canChangeCombo(selected, id)) expect(hasComboImage(changeCombo(selected, id))).toBe(true);
    }
    expect(states.size).toBe(27);
    expect([...states].sort()).toEqual([...aeComboStates].sort());
  });

  it("blocks the two triples without original images and preserves valid replacements", () => {
    expect(canChangeCombo(["bbl", "liposuccion"], "abdominoplastia")).toBe(false);
    expect(canChangeCombo(["bbl", "abdominoplastia"], "reduccion-de-pecho")).toBe(false);
    expect(canChangeCombo(["bbl", "abdominoplastia"], "levantamiento-de-pecho")).toBe(true);
    expect(canChangeCombo(["bbl", "liposuccion", "aumento-de-pecho"], "levantamiento-de-pecho")).toBe(true);
  });
});
