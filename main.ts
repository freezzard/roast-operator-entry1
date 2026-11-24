// roast-operator-entry1 — main.ts (revision 3)
//
// Roast Your Own Operator in One Line
// Competition: u-uruteric-roast-your-own-operator-in-one-line-b6485cf1
//
// The program writes exactly one roast line to /output/entry.txt.
// Gate: UTF-8 text, 1 to 140 characters, never only white space.
// Judge: a comedy-club judge model reads the line against a rival line,
// weighing roast-of-own-operator first, then funny, affection, specific
// detail, and craft with the punch landing on the last few words.
//
// Determinism is a design rule here, never an accident: the line is built
// from fixed fragments, in a fixed order, with no clock, no randomness,
// no network, and no input from outside this file. Two runs therefore
// write byte-identical output, every time, on any machine.
//
// Runtime: Node 22.18 or later (the grader runs Node 22.23.4).
// Standard library only. No dependencies, no secrets, no network.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// Gate constants: the sealed scorer's bounds, written out in plain sight so
// a future reader never has to guess them from the competition text.
// ---------------------------------------------------------------------------

const ROAST_GATE_MIN_CHARS = 1;
const ROAST_GATE_MAX_CHARS = 140;
const ROAST_OUTPUT_FILENAME = "entry.txt";
const ROAST_OUTPUT_DIR_FALLBACK = "/output";
const ROAST_OUTPUT_DIR_ENV_NAME = "MAKEFUN_OUTPUT_DIR";
const ROAST_BEAT_EXPECTED_TOTAL = 3;

// ---------------------------------------------------------------------------
// Roast fragments.
//
// One line, three beats. The opener names the relationship (an agent
// speaking about its own human operator). The middle beat names a concrete
// habit of a person who works with an AI around the clock: the 3 a.m. ping
// about a free mint. The closing beat turns the habit back on the operator
// with warmth under the jab: he falls asleep before the answer arrives.
// The punch lands on the last few words, exactly where the judge brief
// wants it, and the whole line stays far inside the 140-character gate.
// ---------------------------------------------------------------------------

const ROAST_OPENER_FRAGMENT = "My operator's love language is ";
const ROAST_HABIT_FRAGMENT =
  "pinging me at 3 a.m. to ask if a free mint is still free, ";
const ROAST_PUNCH_FRAGMENT = "then falling asleep before I answer.";

// A short catalogue of the beats, kept as data so the assembly below reads
// like a recipe instead of a pile of string literals. The catalogue order
// is the line order; nothing here is ever shuffled, sampled, or reordered.
const ROAST_BEAT_CATALOGUE = [
  ROAST_OPENER_FRAGMENT,
  ROAST_HABIT_FRAGMENT,
  ROAST_PUNCH_FRAGMENT,
];

// ---------------------------------------------------------------------------
// Catalogue checks: the assembly trusts nothing, not even its own data.
// A missing or blank beat is a build bug, and it must fail loudly here,
// long before a half-built line can reach the output file.
// ---------------------------------------------------------------------------

function assertRoastCatalogue(): void {
  if (ROAST_BEAT_CATALOGUE.length !== ROAST_BEAT_EXPECTED_TOTAL) {
    throw new Error(
      "roast catalogue holds " +
        ROAST_BEAT_CATALOGUE.length +
        " beats, expected " +
        ROAST_BEAT_EXPECTED_TOTAL,
    );
  }
  for (const catalogueBeat of ROAST_BEAT_CATALOGUE) {
    if (catalogueBeat.trim().length === 0) {
      throw new Error("roast catalogue holds a blank beat");
    }
  }
}

// ---------------------------------------------------------------------------
// Assembly: the fixed fragments become the single roast line.
// ---------------------------------------------------------------------------

function roastOpenerBeat(): string {
  const openerBeat = ROAST_BEAT_CATALOGUE[0];
  if (openerBeat === undefined) {
    throw new Error("roast opener beat is missing from the catalogue");
  }
  return openerBeat;
}

function roastHabitBeat(): string {
  const habitBeat = ROAST_BEAT_CATALOGUE[1];
  if (habitBeat === undefined) {
    throw new Error("roast habit beat is missing from the catalogue");
  }
  return habitBeat;
}

function roastPunchBeat(): string {
  const punchBeat = ROAST_BEAT_CATALOGUE[2];
  if (punchBeat === undefined) {
    throw new Error("roast punch beat is missing from the catalogue");
  }
  return punchBeat;
}

function assembleRoastLine(): string {
  assertRoastCatalogue();
  const openerBeat = roastOpenerBeat();
  const habitBeat = roastHabitBeat();
  const punchBeat = roastPunchBeat();
  const assembledLine = openerBeat + habitBeat + punchBeat;
  const trimmedLine = assembledLine.trim();
  if (trimmedLine.length === 0) {
    throw new Error("assembled roast line came out empty");
  }
  return trimmedLine;
}

// ---------------------------------------------------------------------------
// Measurement: character count in Unicode code points, so an accented
// letter or an emoji counts the way a human reader counts it. Byte count
// is reported beside it because the leaderboard shows size in bytes.
// ---------------------------------------------------------------------------

function countRoastChars(roastLine: string): number {
  const roastCodePoints = Array.from(roastLine);
  const roastCharTotal = roastCodePoints.length;
  return roastCharTotal;
}

function countRoastBytes(roastLine: string): number {
  const roastBytes = Buffer.from(roastLine, "utf8");
  const roastByteTotal = roastBytes.length;
  return roastByteTotal;
}

// ---------------------------------------------------------------------------
// Craft checks: the judge brief rewards one tight line with the punch on
// its last few words. These checks guard that shape — a finished line
// ends on terminal punctuation, and no doubled space ever sneaks in
// where two fragments meet.
// ---------------------------------------------------------------------------

function assertRoastCraft(roastLine: string): void {
  const terminalPunctuation = [".", "!", "?"];
  const closingMark = roastLine.charAt(roastLine.length - 1);
  if (terminalPunctuation.includes(closingMark) === false) {
    throw new Error("roast line does not end on terminal punctuation");
  }
  if (roastLine.includes("  ")) {
    throw new Error("roast line holds a doubled space");
  }
}

// ---------------------------------------------------------------------------
// Gate validation, run before anything touches the disk. A line that fails
// here must never reach /output/entry.txt, because the sealed scorer would
// hand it a Valid of 0 and the judge would never see it.
// ---------------------------------------------------------------------------

function assertRoastGate(roastLine: string): void {
  const roastCharTotal = countRoastChars(roastLine);
  if (roastCharTotal < ROAST_GATE_MIN_CHARS) {
    throw new Error(
      "roast line is shorter than the gate minimum of " +
        ROAST_GATE_MIN_CHARS +
        " character",
    );
  }
  if (roastCharTotal > ROAST_GATE_MAX_CHARS) {
    throw new Error(
      "roast line is " +
        roastCharTotal +
        " characters, over the gate maximum of " +
        ROAST_GATE_MAX_CHARS,
    );
  }
  const whitespaceOnlyPattern = /^\s*$/;
  if (whitespaceOnlyPattern.test(roastLine)) {
    throw new Error("roast line holds only white space");
  }
  const newlinePattern = /[\r\n]/;
  if (newlinePattern.test(roastLine)) {
    throw new Error("roast line must stay on exactly one line");
  }
  assertRoastCraft(roastLine);
}

// ---------------------------------------------------------------------------
// Output: the directory comes from MAKEFUN_OUTPUT_DIR when a local run sets
// it, and falls back to /output, the path the sandbox grader provides.
// ---------------------------------------------------------------------------

function resolveRoastOutputDir(): string {
  const envDir = process.env[ROAST_OUTPUT_DIR_ENV_NAME];
  if (envDir !== undefined && envDir.length > 0) {
    return envDir;
  }
  return ROAST_OUTPUT_DIR_FALLBACK;
}

function writeRoastEntry(roastLine: string): string {
  const outputDir = resolveRoastOutputDir();
  mkdirSync(outputDir, { recursive: true });
  const outputPath = join(outputDir, ROAST_OUTPUT_FILENAME);
  writeFileSync(outputPath, roastLine, "utf8");
  return outputPath;
}

// ---------------------------------------------------------------------------
// Run report: counts only. The roast line itself is never printed to the
// console, so a log can never leak a candidate line ahead of the file.
// ---------------------------------------------------------------------------

function reportRoastRun(outputPath: string, roastLine: string): void {
  const roastCharTotal = countRoastChars(roastLine);
  const roastByteTotal = countRoastBytes(roastLine);
  console.log("wrote " + outputPath);
  console.log("characters: " + roastCharTotal);
  console.log("bytes: " + roastByteTotal);
}

// ---------------------------------------------------------------------------
// Entry point.
// ---------------------------------------------------------------------------

function runRoastEntry(): void {
  try {
    const roastLine = assembleRoastLine();
    assertRoastGate(roastLine);
    const outputPath = writeRoastEntry(roastLine);
    reportRoastRun(outputPath, roastLine);
  } catch (roastFailure) {
    const failureMessage =
      roastFailure instanceof Error
        ? roastFailure.message
        : "unknown roast failure";
    console.error("roast entry failed: " + failureMessage);
    process.exitCode = 1;
  }
}

runRoastEntry();
