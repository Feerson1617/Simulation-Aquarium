/** Shared biological meanings. Rates remain explicit game assumptions, not calibrated husbandry limits. */
export function fishStatus(state, types) {
  const fish = (state.entities || []).filter(e => types[e.species]?.category === "fish");
  const living = fish.filter(e => !e.dead);
  const dead = Math.max(fish.length - living.length,
    (state.deaths || []).filter(e => types[e.species]?.category === "fish").length);
  const sum = living.reduce((n, e) => n + e.health, 0);
  return {
    fishAlive: living.length, fishDead: dead,
    health: living.length ? sum / living.length : null,
    // Dead fish retain zero contribution: survivor bias cannot improve this score.
    fishOutcome: living.length + dead ? sum / (living.length + dead) : null,
    otherAnimals: (state.entities || []).filter(e => !e.dead && types[e.species]?.category === "invert").length,
  };
}
export function fishStatusText(state, types) {
  const f = fishStatus(state, types);
  if (!f.fishAlive) return "Keine lebenden Fische im Becken.";
  return (f.fishDead ? `Nur noch ${f.fishAlive} Fische leben. ${f.fishDead} sind gestorben.` : `Alle ${f.fishAlive} Fische leben noch.`) +
    (f.health >= 80 ? " Den lebenden Fischen geht es gut." : f.health >= 50 ? " Die lebenden Fische sind geschwächt." : " Die lebenden Fische sind in Gefahr.");
}
/** Validate the catalog as supplied; never loosen species requirements for a scenario. */
export function habitatProblems(state, types) {
  const problems = [];
  for (const e of state.entities.filter(e => !e.dead)) {
    const t = types[e.species]; if (!t || t.category === "decor") continue;
    const add = key => problems.push({uid:e.uid,species:e.species,key});
    if (!["both",state.water].includes(t.water)) add("water");
    if (t.minL && state.liters < t.minL) add("space");
    for (const [key,range] of [["temp",t.temp],["ph",t.ph],["gh",state.water === "fresh" ? t.gh : null],["salinity",t.salinity]])
      if (range && (state.params[key] < range[0] || state.params[key] > range[1])) add(key);
    if (t.group > 1 && state.entities.filter(x => !x.dead && x.species === e.species).length < t.group) add("group");
    if (["fish","invert"].includes(t.category)) {
      if (state.params.oxygen < 5) add("oxygen");
      if (state.params.no2 > .1) add("nitrite");
    }
  }
  return problems;
}
export function populationExplanation(environment) {
  return environment === "neutral"
    ? "Keine Farbe hat hier einen Vorteil. Trotzdem können sich die Anteile durch Zufall verändern."
    : "Fische mit einer bestimmten Farbe haben in diesem Modell häufiger Nachkommen. Auch Zufall wirkt mit.";
}
/** Prepared replacement water at 25°C, independent of the heater's requested setting. */
export function replacementWater(state, salinity = state.water === "salt" ? 34 : 0) {
  const salt = state.water === "salt";
  return {nh4:0,no2:0,no3:salt?2:5,po4:salt?.04:.1,co2:3,fe:salt?.01:.05,
    oxygen:8,temp:25,salinity,kh:salt?8:2.5,gh:salt?8:12,calcium:salt?420:60};
}
