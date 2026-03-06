import { describe, it, expect } from "vitest";
import {
  generateCodename,
  setA,
  setB,
  setC,
} from "@/lib/utils/generateCodename";

describe("generateCodename", () => {
  it("returns a non-empty string", () => {
    expect(typeof generateCodename()).toBe("string");
    expect(generateCodename().length).toBeGreaterThan(0);
  });

  it("matches PascalCase pattern (each segment starts uppercase, no spaces)", () => {
    const codename = generateCodename();
    expect(codename).toMatch(/^[A-Z][a-z]+[A-Z][a-z]+[A-Z][a-z]+$/);
  });

  it("is composed of exactly one word from each of the three lists", () => {
    const codename = generateCodename();
    const matchedA = setA.find((w) => codename.startsWith(w));
    expect(matchedA).toBeDefined();

    const remainder = codename.slice(matchedA!.length);
    const matchedB = setB.find((w) => remainder.startsWith(w));
    expect(matchedB).toBeDefined();

    const matchedC = remainder.slice(matchedB!.length);
    expect(setC).toContain(matchedC);
  });

  it("each word list has no duplicate entries", () => {
    expect(new Set(setA).size).toBe(setA.length);
    expect(new Set(setB).size).toBe(setB.length);
    expect(new Set(setC).size).toBe(setC.length);
  });
});
