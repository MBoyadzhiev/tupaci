# Scoring System Explanation

## Scoring Rules

### Rule 1: Exact Score Match = 3 Points

If a player predicts the **exact same score** as the actual result, they get **3 points**.

**Examples:**

- Prediction: `1-0`, Actual: `1-0` → **3 points** ✅
- Prediction: `2-1`, Actual: `2-1` → **3 points** ✅
- Prediction: `0-0`, Actual: `0-0` → **3 points** ✅

### Rule 2: Correct Outcome = 1 Point

If a player predicts the **correct outcome** (win/loss/draw) but NOT the exact score, they get **1 point**.

**Outcome Types:**

- **Home Win**: Home team scores more (e.g., 2-1, 3-0, 1-0)
- **Away Win**: Away team scores more (e.g., 0-1, 1-2, 0-3)
- **Draw**: Both teams score the same (e.g., 0-0, 1-1, 2-2)

**Examples:**

- Prediction: `2-1`, Actual: `1-0` → Both are home wins → **1 point** ✅
- Prediction: `0-2`, Actual: `1-2` → Both are away wins → **1 point** ✅
- Prediction: `1-1`, Actual: `0-0` → Both are draws → **1 point** ✅
- Prediction: `2-1`, Actual: `1-2` → Wrong outcome (home win vs away win) → **0 points** ❌

### Rule 3: Wrong Outcome = 0 Points

If the outcome is wrong, the player gets **0 points**, regardless of how close the score was.

**Examples:**

- Prediction: `2-1`, Actual: `1-2` → Wrong (predicted home win, got away win) → **0 points** ❌
- Prediction: `1-0`, Actual: `0-0` → Wrong (predicted home win, got draw) → **0 points** ❌
- Prediction: `0-0`, Actual: `1-0` → Wrong (predicted draw, got home win) → **0 points** ❌

## Why Nikolay Kemchev Got +3 Points

**The test match (Al Ettifaq vs Al Nassr) was:**

- Actual score: `1-1` (from mock data)
- Nikolay's prediction: `1-1`
- **Exact match!** → **3 points** ✅

**Calculation:**

- Base score: 114
- Test match points: +3 (exact match 1-1)
- Other matches: 0 (not started yet)
- **Total: 114 + 3 = 117** ✅

## Current Standings Explanation

Since the test match is now removed, all players should be back to their base scores:

1. **Nikolay Kemchev**: 114 точки (base) + 0 (no matches started) = **114 точки**
2. **Daniel Lyubomirov**: 113 точки (base) + 0 = **113 точки**
3. **Жозе Сисиньо**: 113 точки (base) + 0 = **113 точки**
4. **Dimitar Lazarov**: 112 точки (base) + 0 = **112 точки**
5. **Martin Boyadzhiev**: 112 точки (base) + 0 = **112 точки**

## How Points Will Be Calculated When Matches Start

### Example: Burnley vs Newcastle

**If actual score is 1-2 (Newcastle wins):**

- **Kemchev** predicted `1-2` → **Exact match** → **3 points** ✅
- **Daniel** predicted `1-2` → **Exact match** → **3 points** ✅
- **Жозе** predicted `1-2` → **Exact match** → **3 points** ✅
- **Dimitar** predicted `1-2` → **Exact match** → **3 points** ✅
- **Martin** predicted `0-2` → **Correct outcome** (away win) → **1 point** ✅

**If actual score is 2-1 (Burnley wins):**

- **Kemchev** predicted `1-2` → **Wrong outcome** (predicted away win, got home win) → **0 points** ❌
- **Daniel** predicted `1-2` → **Wrong outcome** → **0 points** ❌
- **Жозе** predicted `1-2` → **Wrong outcome** → **0 points** ❌
- **Dimitar** predicted `1-2` → **Wrong outcome** → **0 points** ❌
- **Martin** predicted `0-2` → **Wrong outcome** → **0 points** ❌

**If actual score is 0-0 (Draw):**

- **Kemchev** predicted `1-2` → **Wrong outcome** (predicted away win, got draw) → **0 points** ❌
- **Daniel** predicted `1-2` → **Wrong outcome** → **0 points** ❌
- **Жозе** predicted `1-2` → **Wrong outcome** → **0 points** ❌
- **Dimitar** predicted `1-2` → **Wrong outcome** → **0 points** ❌
- **Martin** predicted `0-2` → **Wrong outcome** → **0 points** ❌

## Summary

- **Exact score** = 3 points (highest reward)
- **Correct outcome** = 1 point (partial reward)
- **Wrong outcome** = 0 points (no reward)

The scoring is **NOT cumulative** - you get either 3 points (exact) OR 1 point (correct outcome) OR 0 points (wrong), never both.
