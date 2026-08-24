# Project: Dwarf Eats Mountain Companion, Build Planner, and Progression Optimizer

I want you to build a polished local-first website/web app for **Dwarf Eats Mountain**.

This should NOT just be a wiki.

The goal is to create an interactive companion application where a player can enter everything they currently own/unlocked, reproduce their current game state, and have the application mathematically estimate:

- what Prestige upgrades they should buy next;
- what upgrades have the highest value per Prestige Point;
- what their current bottleneck is;
- what they should buy during the current run;
- what run strategy they should use;
- whether they should Prestige now or keep pushing;
- whether they should do a short PP-farming run or a longer progression/push run;
- what mountain milestone they should target;
- what artifacts/upgrades would most improve their build;
- approximately how different upgrade combinations compare;
- the fastest estimated path toward their next major goal, especially first Ascension.

The application should eventually function somewhat like a build planner + calculator + interactive wiki + optimization assistant.

---

# VERY IMPORTANT: RESEARCH FIRST

Before implementing the optimizer, research the current version of Dwarf Eats Mountain.

Use current information where possible.

Useful sources include:

- the official Dwarf Eats Mountain Steam page;
- official Steam news and patch notes from GreenWizardGames;
- SteamDB patch history;
- the Dwarf Eats Mountain player-maintained wiki;
- the Dwarf Eats Mountain GameDB wiki;
- developer posts;
- reliable community discussions when primary information does not exist.

Prefer official patch notes when sources disagree.

Do NOT silently invent missing formulas.

For every mechanic or formula in our database, track its provenance.

For example:

```ts
interface DataSource {
  sourceType:
    | "official_patch"
    | "official_game"
    | "wiki"
    | "community"
    | "derived"
    | "estimated";

  sourceName: string;
  gameVersion?: string;
  verifiedAt?: string;
  confidence: "verified" | "high" | "medium" | "low";
  notes?: string;
}
```

If information cannot be confirmed, mark it explicitly as estimated.

The optimizer needs to understand the difference between:

- exact game formula;
- experimentally inferred formula;
- heuristic;
- player strategy recommendation.

Do not mix them together.

---

# COPYRIGHT / GAME ASSETS

This is a fan-made personal companion tool.

I own the game.

The website may visually use assets extracted from my locally installed copy of Dwarf Eats Mountain.

However:

**Do not commit or redistribute proprietary game assets in the public source repository.**

Instead create an asset system such as:

```text
/public
  /assets
    /game
      .gitkeep
```

And document how I can put locally extracted game assets there.

If useful, create:

```text
tools/
  import-game-assets/
```

so local assets can be copied/renamed into the format expected by the website.

Also support placeholder/fallback artwork so development works without proprietary assets.

Keep all filenames and mappings in a central manifest:

```text
src/data/assets/
  assetManifest.ts
```

The application should make it easy to swap placeholders for the real game sprites later.

---

# TECHNOLOGY

Use:

- React
- TypeScript
- Vite
- modern CSS
- a maintainable component architecture
- Vitest for mathematical/data tests
- Playwright for important UI workflows

Avoid unnecessary backend infrastructure initially.

This should run completely locally with:

```bash
npm install
npm run dev
```

Persist the player's save/profile using IndexedDB or localStorage.

Structure the project so a backend/cloud sync system could be added later without rewriting the app.

Do NOT build authentication for the first version.

---

# DESIGN GOAL

The site should feel like a companion interface belonging beside Dwarf Eats Mountain.

It should use:

- pixel-art styling;
- game-like panels;
- compact information density;
- tooltips;
- icon-heavy interfaces;
- clear highlighting;
- visual tier separators;
- responsive layouts;
- subtle game-like animations;
- readable numbers;
- desktop-first design that still works on mobile.

Do not make it look like a generic SaaS dashboard.

---

# PRESTIGE SCREEN — HIGH PRIORITY

The Prestige planner is the most important first interface.

I want this screen to visually reproduce the **layout and interaction style of the actual Dwarf Eats Mountain Prestige screen as closely as practical**.

Use screenshots/references from the current game when implementing it.

The game uses tiered rows of upgrade icons with upgrade states visually represented in the grid.

Recreate:

- tier rows;
- upgrade positions;
- upgrade icons;
- locked upgrades;
- unlocked upgrades;
- purchased upgrades;
- partially ranked upgrades;
- maximum ranks;
- hover tooltips;
- PP costs;
- current ranks;
- Tier labels;
- requirement indicators;
- PP counter.

It should look immediately familiar to someone who plays the game.

---

# CLICKING PRESTIGE UPGRADES

I am NOT purchasing them in-game through this website.

Clicking is used to tell the planner:

> "I already own this rank."

Normal click:

- increase owned rank by one.

Right-click or another sensible interaction:

- decrease rank by one.

Also support:

### Shift + click

Increase by multiple ranks where appropriate.

### Ctrl + Shift + click

Mark an entire row/tier according to the game's familiar bulk-purchase interaction.

Do not allow ranks higher than the upgrade's maximum.

Clearly distinguish:

- NOT OWNED
- PARTIAL
- MAXED
- LOCKED
- RECOMMENDED NEXT
- POSSIBLE BUT LOW PRIORITY

When selected, recalculate everything immediately.

---

# PRESTIGE TOOLTIP

Hovering an upgrade should show a game-style tooltip containing:

**Name**

**Current rank**

**Maximum rank**

**Tier**

**Cost per rank**

**Total PP invested**

**Current effect**

**Next-rank effect**

**Requirements**

**Optimizer score**

**Why the optimizer currently values it**

Example:

```text
Fated Finds
Rank 2 / 3
Tier 2

Current:
First 2 dens guarantee an Artifact.

Next Rank:
First 3 dens guarantee an Artifact.

Next rank cost:
2 PP

Current optimizer score:
9.3 / 10

Why:
Your current build has strong Den killing and
Artifact scaling. This converts your first three
Dens into guaranteed permanent run acceleration.
```

---

# AVAILABLE PRESTIGE POINTS

The player should enter:

```text
Available Prestige Points: [ 28 ]
```

The app should then visually show:

- recommended upgrades;
- exact recommended purchase order;
- cost;
- remaining PP;
- estimated impact;
- alternatives.

For example:

```text
Recommended 28 PP Plan

1. Buried Heirlooms Newspaper
   1/4 → 4/4
   Cost: 6 PP

2. Fated Finds
   0/3 → 3/3
   Cost: 6 PP

3. Key Master
   0/3 → 3/3
   Cost: 9 PP

...

Total: 28 / 28 PP
```

The optimizer should solve the actual constrained problem:

> Given X PP, which combination of currently legal upgrade ranks appears most likely to minimize time toward the selected objective?

Do NOT simply rank upgrades independently.

Combinations and synergies matter.

---

# OPTIMIZATION GOAL SELECTOR

Add a prominent selector:

```text
Optimize For:

[ Fastest First Ascension ▼ ]
```

Options should eventually include:

- Fastest First Ascension
- Maximum PP/hour
- Fastest Early Run
- Fastest Mountain 20
- Fastest Mountain 40
- Fastest Mountain 50
- Fastest Mountain 80
- Mountain 100 / World Spire
- Mithril Farming
- Artifact Farming
- Den Farming
- Boss Damage
- Idle Progression
- Active Progression
- Endless / Post-Ascension

Different goals MUST produce different recommendations.

---

# PLAYER PROFILE

Create a persistent player profile.

Track at minimum:

## Meta

- Prestige Points available
- Prestige Points spent
- Prestige Tier
- Ascension rank
- highest mountain reached
- highest boss defeated
- World Spire status

## Prestige

Every Prestige upgrade and rank.

## Artifacts

Every Artifact:

- not found;
- discovered;
- currently owned;
- retained between Prestiges when applicable.

## Keys

- Ruby Key
- Sapphire Key
- Emerald Key

## Unlocks

Track important game systems such as:

- Manufactorum
- Spelunker's Guild
- Great Forge
- Powder Hall
- Shrine
- Alchemy
- Rituals
- relevant buildings/features

## Current Run

Allow optional entry of:

- mountain level;
- gold;
- Mithril;
- Souls;
- Faith;
- Underground Mapping;
- current artifacts;
- current dwarves;
- buildings;
- upgrades;
- approximate mountain kill time;
- approximate Den kill time;
- loose ore count;
- runner throughput information.

The more information the player enters, the more specific the recommendation becomes.

Do NOT require every field before producing advice.

---

# GAME DATABASE

Create a proper normalized data layer.

Something like:

```text
src/
  data/
    prestige/
    artifacts/
    buildings/
    buildingUpgrades/
    dwarves/
    dens/
    mountains/
    bosses/
    calamities/
    resources/
    mechanics/
```

Do not put enormous game-data objects directly into React components.

---

# PRESTIGE DATA MODEL

Each Prestige upgrade should have something similar to:

```ts
interface PrestigeUpgrade {
  id: string;
  name: string;

  tier: number;

  position: {
    row: number;
    column: number;
  };

  maxRank: number;

  costPerRank: number | number[];

  requirements: Requirement[];

  effects: PrestigeEffect[];

  tags: PrestigeTag[];

  synergies: string[];

  conflicts?: string[];

  icon: string;

  description: string;

  source: DataSource[];
}
```

Tags might include:

```ts
type PrestigeTag =
  | "damage"
  | "runner"
  | "economy"
  | "gold"
  | "mithril"
  | "artifact"
  | "den"
  | "prestige_points"
  | "starting_power"
  | "demolition"
  | "ballista"
  | "scientist"
  | "runesmith"
  | "spelunker"
  | "boss"
  | "key"
  | "ascension"
  | "quality_of_life";
```

---

# EFFECT ENGINE

Do not store every upgrade merely as English text.

Where possible, encode effects mathematically.

Example concept:

```ts
{
  type: "multiply",
  stat: "ballistaDamage",
  valuePerRank: 0.07
}
```

or:

```ts
{
  type: "add",
  stat: "keyDropChance",
  valuePerRank: 0.25
}
```

or:

```ts
{
  type: "custom",
  evaluator: "fatedFinds"
}
```

This allows the optimizer to actually reason about builds.

---

# DERIVED PLAYER STATS

Given the player's selections, calculate useful derived values where possible.

Examples:

```text
Starting Dwarves
Starting Gold
Starting Mithril
Starting Souls

Runner movement multiplier
Runner carrying capacity
Runner survivability

Demodwarf damage bonuses
Ballista damage bonuses
Critical chance
Den damage multiplier

Mithril Luck
Artifact probability bonuses
Key probability bonuses

Expected early artifacts
Expected Mithril income
Expected Prestige Point bonuses
```

Every derived number should be inspectable.

Clicking it should show:

```text
Why is this number 1.42×?

Base                             1.00
Deep Penetration                 +...
Ballista Lore                    +...
Artifact X                       +...
-------------------------------------
Estimated multiplier             1.42
```

That transparency is important.

---

# RUN PLANNER

Create a separate **Run Planner** page.

It should produce a sequence of recommended actions based on the player's current profile.

Example:

```text
RUN TYPE
Fast PP Run

TARGET
Prestige around Mountain 32–40

OPENING

1. Stabilize Runners
2. Build Demolition Shack
3. Buy 1–2 Demodwarves
4. Efficient Delivery → Tier 5
5. Tightly Packed Package → Tier 6
6. Build Ballistics Workshop
7. Add Harpoon Ballistas
8. Upgrade Lubed Crank
9. Clear cheap Dens
10. Increase Runner throughput if ore accumulates

MID RUN

11. Get 2 Runesmiths
12. Get 4 Scientists
13. Improve Big Bomb/Powder Hall package
14. Prepare burst damage before Mountain 20
15. Push until PP/minute falls significantly

RESET CONDITION

Prestige when:
• clear time rises sharply;
• next PP reward is several slow Mountains away;
• no major milestone is nearby.
```

Make this dynamic.

It should change depending on what the player owns.

---

# RUN TYPES

Support at least:

## Fast PP Run

Goal:

maximize PP/hour.

Avoid unnecessary long-term setup.

## Push Run

Goal:

reach a new mountain milestone.

Spend more on long-term scaling.

## Artifact Run

Goal:

maximize artifact acquisition.

## Mithril Run

Goal:

generate Mithril efficiently.

## Key / Mountain 50 Run

Goal:

obtain Triple Seal Gate progression and Nauglamir.

## World Spire Run

Goal:

collect/check required progression and reach Mountain 100.

---

# BOTTLENECK DETECTION

This is one of the most important features.

The app should determine likely bottlenecks.

Possible states:

```text
DAMAGE BOTTLENECK
RUNNER/TRANSPORT BOTTLENECK
MITHRIL BOTTLENECK
DEN DAMAGE BOTTLENECK
ARTIFACT BOTTLENECK
PRESTIGE POINT BOTTLENECK
GOLD BOTTLENECK
BOSS DAMAGE BOTTLENECK
NO CLEAR BOTTLENECK
INSUFFICIENT DATA
```

For example:

If ore accumulation is high but mountains die quickly:

```text
Primary Bottleneck:
Transport

Do NOT buy more damage yet.

Recommended:
1. Runner capacity
2. Runner speed
3. Additional Runners
4. Manufactorum/Bulldozer support
```

If the screen is clean but Mountain kill times are exploding:

```text
Primary Bottleneck:
Damage
```

---

# PP/HOUR ESTIMATOR

Build an estimator for run efficiency.

It does not need perfect simulation initially.

Start with a heuristic/model that can improve later.

Inputs can include:

- current mountain;
- PP gained during run;
- elapsed run time;
- last several Mountain clear times;
- expected next PP Mountain;
- predicted Mountain HP scaling;
- boss milestone proximity;
- possible key/artifact reward nearby.

Output:

```text
CURRENT PP RATE
13.4 PP/hour

ESTIMATED IF YOU CONTINUE 10 MIN
9.1 PP/hour

ESTIMATED NEW RUN
14.8 PP/hour

Recommendation:
PRESTIGE
```

Make assumptions visible.

---

# MANUAL RUN TIMER

Let me use the website while playing.

Add:

```text
Start Run
```

Then let me record Mountains simply by clicking:

```text
Mountain Cleared
```

or entering the mountain number.

Record timestamps automatically.

From this derive:

- clear time;
- rolling average;
- acceleration/deceleration;
- estimated PP/hour;
- probable reset point.

Graph:

```text
Mountain Clear Time
vs
Mountain Level
```

When the curve suddenly bends upward, warn me:

```text
Run efficiency is deteriorating.

Estimated reset efficiency:
Prestiging now is likely faster.
```

---

# LIVE RUN ASSISTANT

Create a dashboard that answers:

```text
WHAT SHOULD I DO RIGHT NOW?
```

Example:

```text
PRIMARY ACTION

Buy Runner Carrying Capacity

WHY

Your estimated ore generation is currently
~1.6× your transport capacity.

More damage would increase the bottleneck.

NEXT

After transport stabilizes:
Upgrade Efficient Delivery.
```

Then underneath:

```text
1. Runner Capacity
2. +2 Runners
3. Efficient Delivery
4. Ballista damage
5. Save Mithril
```

---

# UPGRADE COMPARISON

Let me select two or more candidate upgrades.

Example:

```text
Compare

[ Ballista Lore Rank 3 ]
vs
[ Mountain's Buried Treasures Rank 1 ]
```

Show:

```text
FASTEST ASCENSION

Ballista Lore
Immediate clear-speed gain: HIGH
PP generation gain: INDIRECT
Artifact gain: NONE

Mountain's Buried Treasures
Immediate clear-speed gain: LOW
PP generation gain: MEDIUM
Artifact gain: HIGH

Recommendation:
Mountain's Buried Treasures

Reason:
Your current damage is above the estimated
minimum needed for your normal PP-reset range.
```

---

# OPTIMIZER ARCHITECTURE

Do NOT make the optimizer an enormous switch statement.

Separate it into modules.

Example:

```text
src/optimizer/
  evaluatePlayer.ts
  detectBottleneck.ts
  scorePrestige.ts
  optimizePrestigeSpend.ts
  estimateRun.ts
  recommendRun.ts
  milestoneValue.ts
  synergies.ts
  confidence.ts
```

---

# PRESTIGE SPEND OPTIMIZATION

For a given available PP count:

1. determine every legally purchasable rank;
2. calculate its immediate effects;
3. calculate synergy effects;
4. calculate unlock value;
5. calculate how buying it affects future available choices;
6. consider combinations of purchases;
7. compare paths that consume ≤ available PP;
8. rank complete purchase plans.

Do not use a naïve greedy algorithm if it produces poor results.

The Prestige tree is small enough that dynamic programming, constrained search, beam search, branch-and-bound, or another appropriate method should be practical.

Return at least:

```text
BEST PLAN
ALTERNATIVE PLAN
HIGH-DAMAGE PLAN
ECONOMY PLAN
```

---

# OBJECTIVE FUNCTION

For fastest first Ascension, conceptually optimize something like:

```text
minimize:
estimated real-world minutes until Tier 6 / first Ascension
```

This will need approximations.

Possible factors:

```text
openingSpeed
mountainClearSpeed
transportCapacity
mithrilAccess
artifactGeneration
denClearSpeed
keyProgression
prestigePointGeneration
resetAcceleration
milestoneUnlockValue
```

Do NOT pretend the model is exact.

Display:

```text
Recommendation confidence:
High / Medium / Experimental
```

---

# SYNERGY SYSTEM

The optimizer needs explicit synergy rules.

Examples:

### Dens + Artifacts

If player has strong Den health reduction + Den damage + Fated Finds:

value artifact-related Den upgrades more highly.

### Spelunker's Guild + Underground Mapping

Value upgrades that convert Mapping into useful scaling.

### Powder Hall + Scientists

Scientist count affects Demolition value.

### Ballista prestige + Den hunting

Ballista upgrades increase in value when Dens are a progression bottleneck.

### Key Master + Mountain 50 objective

Key Master becomes dramatically more valuable.

### PP-generating bonuses + Ascension rush

Direct PP generation should receive higher weight.

Make synergy scoring transparent rather than hidden.

---

# MILESTONE SYSTEM

Track:

```text
Mountain 20
Goblin King

Mountain 40
Dragon

Mountain 50
Triple Seal Gate

Mountain 60
Architect

Mountain 80
Balrogg

Mountain 100
Great World Spire
```

The optimizer should understand milestone proximity.

For example, do NOT recommend Prestiging at Mountain 49 if:

- all three keys are available;
- Mountain 50 is realistically beatable;
- the milestone reward is highly valuable.

---

# ARTIFACT DATABASE

Eventually reproduce the Artifact Gallery as an interactive screen.

I want to be able to click artifacts exactly like Prestige upgrades.

States:

```text
Unknown
Discovered
Currently Owned
Retained
Needed for Current Goal
```

Allow filters:

- Damage
- Mithril
- Prestige Points
- Dens
- Runners
- Demolition
- Ballistas
- Spelunkers
- Bosses
- World Spire
- Economy

Clicking an artifact should update recommendations immediately.

---

# BUILDING / RUN-UPGRADE SCREEN

Eventually reproduce the game's building upgrade trees.

Let the player indicate what they currently bought during a run.

This should include things like:

- Great Maw;
- Runners;
- Demolition Shack;
- Ballistics Workshop;
- Great Forge;
- Scientists;
- Runesmiths;
- Spelunker's Guild;
- Powder Hall;
- Manufactorum;
- other current buildings.

Click the same way:

```text
0 / X
1 / X
...
MAX
```

Then let the optimizer answer:

```text
Your next purchase should probably be:
Efficient Delivery Tier 5
```

---

# SAVE PROFILES

Support multiple profiles.

Example:

```text
Keean — Main Save
Test Build
Fresh Ascension
```

Functions:

- Create
- Rename
- Duplicate
- Export JSON
- Import JSON
- Delete

Export format should be versioned.

Example:

```json
{
  "schemaVersion": 1,
  "gameVersion": "...",
  "profile": {}
}
```

---

# GAME PATCH VERSIONING

The game's balance changes.

Design for this.

Store a current:

```text
Game Data Version
```

Show it prominently somewhere like:

```text
Data:
Dwarf Eats Mountain vX.X.X
Updated: YYYY-MM-DD
```

Keep data migrations possible.

A patch should not require rewriting the optimizer.

---

# DATA VALIDATION

Add automated tests checking:

- no duplicate IDs;
- ranks are valid;
- every Prestige upgrade has a tier;
- every icon mapping resolves;
- dependency IDs exist;
- costs are valid;
- effects are valid;
- source data exists;
- tier positions do not collide unintentionally.

---

# FORMULA TESTS

Create deterministic tests for known calculations.

Examples:

```text
PP expenditure
Tier unlock thresholds
rank effects
starting dwarf calculations
Mithril Luck aggregation
key probability
damage multipliers
artifact probability
```

If an official formula exists, create a regression test for it.

---

# OPTIMIZER TEST CASE

Include my current save as a fixture so we can test the recommendation engine.

Create:

```text
src/fixtures/keean-pre-ascension.json
```

My current state:

## Tier 1

ALL Tier 1 Prestige upgrades purchased.

## Tier 2

Relic Grant 3/3

Buried Heirlooms Newspaper 1/4

Panic Stride 2/2

Cyberdwarf 1/1

Acquisitions Incorporated 3/3

Ancestor's Picks 4/4

Powder Hall 1/1

Ritual Power 1/1

Blast Aegis 2/2

Hard Carries 2/2

Fleet Footed and Rock Hard 3/3

Marching Orders 2/2

Soul Echoes 1/1

Soulbound Legacy 1/1

Gyro-Stabilized Emplacements 2/2

## Tier 3

Favored by Fortune 4/4

Eternal Feasting 1/1

Undermined Foundations 3/3

Deep Penetration 3/3

Ballista Lore 2/4

Infernal Fortune 2/2

Manufactorum 1/1

Spelunker's Guild 1/1

## Tier 4

Nothing purchased yet.

## Available Prestige Points

28

## Current Goal

Fastest possible route to first Ascension.

The optimizer should be able to consume this fixture and generate recommendations.

Do NOT hard-code the recommendation specifically for this fixture.

It needs to arrive at recommendations from the scoring/model.

---

# INITIAL EXPECTED SANITY CHECK

Our current manual analysis suggests that upgrades such as these should receive substantial value for this save:

- Buried Heirlooms Newspaper
- Fated Finds
- Key Master
- Stalwart Legacy
- Mountain's Buried Treasures
- Greyglitter Leylines

while additional damage upgrades should become more valuable if measured Mountain clear times indicate damage is actually the bottleneck.

The optimizer does NOT need to exactly reproduce this list.

If it disagrees, show why.

That is important.

---

# EXPLANATIONS

Never output recommendations like:

```text
Buy Fated Finds
Score: 91
```

without explanation.

Instead:

```text
Fated Finds
Priority: Very High

Why:
You already have strong Den support from
Undermined Foundations and Spelunker's Guild.

Guaranteeing early Artifacts converts this existing
investment into more reliable run acceleration.

Estimated strongest effects:
+ Artifact consistency
+ Mithril/Den route synergy
+ Less run-to-run RNG

Confidence:
High
```

---

# WHAT-IF MODE

Add a toggle:

```text
WHAT IF I BUY THIS?
```

The player can temporarily alter their build without changing the saved profile.

For example:

```text
Current
Ballista Lore 2/4

Simulation
Ballista Lore 4/4
```

Then all stats/recommendations recalculate.

Allow:

```text
Apply Changes
Discard
```

This is very important.

---

# PRESTIGE PATH PLANNER

Create a longer-term progression view.

Example:

```text
CURRENT
148 PP spent

TIER 5
180 PP

32 PP until Tier 5

TIER 6
250 PP

102 PP until Tier 6

ESTIMATED PATH

Current 28 PP
↓
Artifact/PP engine
↓
Mithril acceleration
↓
Tier 5
↓
Artifact retention
↓
PP farming
↓
Tier 6
↓
First Ascension
```

Estimate number of additional runs when enough user timing data exists.

---

# LEARNING FROM MY RUNS

Store historical runs locally.

Example:

```ts
interface RunHistory {
  startedAt: string;
  endedAt: string;

  prestigeBefore: number;
  prestigeAfter: number;

  highestMountain: number;

  mountainTimes: MountainTime[];

  ppEarned: number;

  artifactsFound: string[];
  mithrilEarned?: number;

  buildSnapshot: PlayerBuildSnapshot;
}
```

Over time the optimizer should increasingly use **my actual performance** instead of generic assumptions.

For example:

```text
Based on your last 7 runs:

Your PP/hour peaks around Mountain 34.

Recommendation:
Prestige between Mountain 32–36 unless a major
milestone is nearby.
```

This is one of the most valuable eventual features.

---

# ESTIMATION MODEL

Do not begin with machine learning.

Start deterministic and interpretable.

Use:

- known formulas;
- weighted heuristics;
- regression against local run history;
- interpolation;
- rolling averages.

Only consider more advanced optimization after we collect useful data.

---

# DEBUG / DEVELOPER MODE

Add an optional developer panel.

Show:

```text
Optimizer inputs
Calculated modifiers
Weights
Candidate actions
Candidate scores
Rejected plans
Assumptions
Confidence
```

I want to be able to understand why the optimizer behaved a certain way.

---

# UI PAGES

Initial navigation:

```text
Dashboard
Prestige
Run Planner
Current Run
Artifacts
Buildings
Optimizer
Progression
Database
Settings
```

---

# DASHBOARD

The Dashboard should immediately show:

```text
CURRENT GOAL
First Ascension

AVAILABLE PP
28

PP SPENT
...

NEXT TIER
Tier 5
... PP remaining

RECOMMENDED NEXT PRESTIGE PURCHASE
...

CURRENT RUN RECOMMENDATION
Fast PP Run

LIKELY BOTTLENECK
...

NEXT IMPORTANT MILESTONE
...
```

---

# DATABASE PAGE

Include an internal searchable database.

Search:

```text
ballista
```

Results could include:

- Ballista Lore
- Harpoon Ballista
- Lubed Crank
- Dwarven Precision
- Monster Bane
- related artifacts

This means the project can replace the need to constantly browse external wikis.

---

# RESPONSIVENESS

Desktop is primary.

But the site should work well enough on a phone that I can keep it beside the game or use it remotely.

For mobile:

- horizontal tier scrolling is acceptable;
- tooltips become tap cards;
- sticky recommendation button;
- compact bottom navigation.

---

# VISUAL POLISH

Do not stop after making functional HTML.

The Prestige screen in particular should feel polished.

Include:

- pixel-perfect icon rendering;
- crisp nearest-neighbor image scaling;
- hover effects;
- selected glow;
- max-rank visual;
- locked silhouettes;
- tier backgrounds;
- subtle transitions;
- appropriate game-like typography;
- responsive tooltip positioning.

Use:

```css
image-rendering: pixelated;
```

where appropriate.

---

# ACCESSIBILITY

Even though we're reproducing a game-like UI:

- every icon needs accessible text;
- keyboard navigation should work;
- state should not be conveyed by color alone;
- provide an optional reduced-motion mode;
- tooltips must also be accessible through focus.

---

# DO NOT DO THESE THINGS

Do NOT:

- invent game formulas;
- hard-code the optimizer recommendation;
- scrape unreliable information and treat it as official;
- place all data in one gigantic JSON file;
- tightly couple calculations to React;
- make the site dependent on an external API;
- require a server to use it;
- redistribute proprietary game artwork in Git;
- redesign Prestige as a generic card grid if the actual game layout can be recreated;
- pretend estimates are exact;
- use AI/LLM calls for decisions that deterministic math can handle;
- start by implementing every feature at once.

---

# IMPLEMENTATION PLAN

Work incrementally.

## Phase 0 — Research

Research:

- current game version;
- Prestige tree;
- Prestige effects;
- tier requirements;
- PP costs;
- current Prestige screen layout;
- important progression formulas;
- Mountain scaling;
- PP generation;
- Mithril system;
- Dens;
- Artifacts;
- boss milestones;
- Ascension requirements.

Write findings into:

```text
research/
  current-version.md
  prestige.md
  mechanics.md
  progression.md
  sources.md
  uncertainties.md
```

Explicitly list conflicting data.

Do not code the optimizer until the essential Prestige data has been checked.

---

## Phase 1 — Foundation

Implement:

- React/Vite/TypeScript project;
- routing;
- local persistence;
- player profile model;
- game data architecture;
- test setup;
- pixel UI foundation.

---

## Phase 2 — Prestige UI

Implement the complete interactive Prestige screen.

This is our first major visual milestone.

Requirements:

- all current Prestige nodes;
- correct positions;
- correct ranks;
- click to change ownership;
- PP totals;
- tooltips;
- tier unlock state;
- local save;
- high-fidelity game styling.

Do not move on until this screen feels good.

---

## Phase 3 — Prestige Optimizer

Implement:

- derived Prestige effects;
- bottleneck weights;
- goal system;
- constrained PP spending optimizer;
- recommendations;
- explanations;
- what-if mode.

Test with the supplied current-save fixture.

---

## Phase 4 — Run Planner

Implement:

- Fast PP Run;
- Push Run;
- Artifact Run;
- Mithril Run;
- milestone recommendations;
- dynamic step lists.

---

## Phase 5 — Current Run Tracking

Implement:

- run timer;
- Mountain clear logging;
- PP gained;
- kill-time graph;
- PP/hour;
- Prestige-now estimator;
- run history.

---

## Phase 6 — Artifacts

Implement:

- full Artifact database;
- Artifact Gallery-like UI;
- owned/discovered states;
- effect calculations;
- artifact-aware recommendations.

---

## Phase 7 — Buildings / Run Upgrades

Implement interactive building and run upgrade trees.

Allow the optimizer to answer:

> What should I buy next right now?

---

## Phase 8 — Personal Calibration

Use saved run history to calibrate:

- clear-time estimates;
- reset timing;
- expected PP/hour;
- build effectiveness.

---

# DEVELOPMENT WORKFLOW

After completing each phase:

1. run TypeScript checks;
2. run unit tests;
3. run UI tests;
4. launch the application;
5. inspect it visually;
6. fix layout/interaction problems;
7. update documentation;
8. commit the completed phase separately.

Do not claim something works merely because it compiles.

Actually run it.

---

# VISUAL INSPECTION

For the Prestige screen especially:

Take screenshots during development and compare them against reference screenshots of Dwarf Eats Mountain.

Inspect:

- spacing;
- scale;
- icon size;
- tier row positioning;
- tooltip position;
- backgrounds;
- selected/maxed/locked states.

Iterate until it feels recognizably like the game's Prestige interface.

---

# FIRST DELIVERABLE

Start now with **Phase 0 and Phase 1**, but plan the full architecture before coding.

Then build **Phase 2: Prestige UI** as the first major feature.

When Phase 2 is complete I should be able to:

1. launch the website locally;
2. open Prestige;
3. see the full current Prestige tree in a layout resembling the game;
4. click every upgrade/rank that I own;
5. enter my available PP;
6. close/reopen the website and retain my profile;
7. hover/tap an upgrade and see its exact effect and source information;
8. see my PP spent and current Prestige tier calculated automatically.

After that implement the actual recommendation engine.

If something about the game is uncertain, research it or mark it uncertain. Do not guess silently.