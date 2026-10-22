import {pendingActivity,assignActivity,recordActivityView,mendelEvidence,populationPairEvidence,REGIONAL_CASES} from "./learning-activities.mjs";
import {investigationId, interventionEvent, bindComparison, resolveComparisonView, selectComparisonView, stateId} from "./learning-context.mjs";
import {temperatureView, temperatureWorkspace} from "./learning-workspace.mjs";
import {createTankViews} from "./learning-tank-views.mjs";
import {learningProvenance, crossingPrediction, ORIGIN_LABELS} from "./learning-provenance.mjs";
import {fishStatusText,habitatProblems} from "./biology-quality.mjs";
import { dialControl, mountDials } from "./control-dial.mjs";
import { controlNumber, requireControlValue, applyEquipmentSetting, EQUIPMENT_SWITCHES } from "./control-values.mjs";
import {
  QUESTS,
  newQuest,
  questEvent,
  answerQuest,
  comparisonReading,
  questConclusion,
  validateQuest,
} from "./learning-quests.mjs";
import {
  createStudentViews,
  STUDENT_METRICS,
  STUDENT_TOOLS,
} from "./learning-student.mjs";
import {
  CURRICULUM,
  GRADE_PROFILES,
  MISSIONS,
  missionById,
  SUPPORT,
  HELP,
  TRANSFER,
} from "./learning-content.mjs";
import {
  LEARNING_MODEL_REVISION,
  POPULATION_METRICS,
  snapshotLearningPlan,
  planMatchesComparison,
  comparisonTimes,
  measurementCSV,
  LEARNING_TOOLS,
  reconcileLearningStudy,
  LEARNING_METRICS,
  learningSlot,
  learningTools,
  learningMetrics,
  waterIndicators,
  learningSample,
  createLearningTank,
  applyLearningIntervention,
  runLearningComparison,
  comparisonCSV,
  comparisonMetricDefinitions,
  normalizeTeacher,
  validateLearningProduct,
} from "./learning-model.mjs";
import {
  repeatLearningPopulation,
  createLearningPopulation,
  populationCounts,
  crossLearningPopulation,
  compareLearningPopulations,
} from "./learning-population.mjs";
import { punnettSquare } from "./genetics.mjs";
import { genotypeText } from "./fish-variants.mjs";
import { buildFoodWeb } from "./ecology.mjs";
const esc = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const num = (v, d = 2) =>
  Number.isFinite(v)
    ? v.toLocaleString("de-DE", { maximumFractionDigits: d })
    : "—";
const options = (rows, value) =>
  rows
    .map(
      ([id, label]) =>
        `<option value="${esc(id)}" ${String(id) === String(value) ? "selected" : ""}>${esc(label)}</option>`,
    )
    .join("");
const noteFields = {
  prior: "Meine erste Erklärung / Vorwissen",
  question: "Meine Forschungsfrage",
  hypothesis: "Meine Hypothese mit Begründung",
  prediction: "Meine Vorhersage vor dem Versuch",
  plan: "Mein Plan: ändern, messen, konstant halten",
  observation: "Beobachtung: Was zeigen meine Daten?",
  explanation: "Deutung: Wie erkläre ich die Daten?",
  reflection:
    "Rückblick: Was denke ich jetzt anders? Welche Grenze hat das Modell?",
  transfer: "Transfer / begründetes Urteil",
  assessment: "Rückmeldung der Lehrkraft",
};
const textArea = (key, value, label = noteFields[key]) =>
  `<label>${esc(label)}<textarea data-learning-note="${key}" rows="3" maxlength="20000">${esc(value || "")}</textarea></label>`;
const button = (action, label, extra = "") =>
  `<button data-learn="${action}" ${extra}>${label}</button>`;
const helpButton = (key) =>
  `<button class="learn-help" data-learn-help="${key}" aria-label="Hilfe: ${esc(HELP[key]?.term || key)}">?</button>`;
const panelHeader = (title, help) =>
  `<header><h2 tabindex="-1">${esc(title)}</h2><div>${help ? helpButton(help) : ""}${button("close", "Schließen", 'aria-label="Werkzeug schließen"')}</div></header>`;
export function mountLearningUI(host) {
  const root = document.createElement("div");
  root.id = "learning-root";
  host.root.append(root);
  const tankViews = createTankViews(host);
  let playback = null;
  let screen =
      new URLSearchParams(location.search).get("expert") === "1"
        ? "expert"
        : "home",
    grade = null,
    tag = null,
    session = null,
    panel = null,
    detailed = false,
    selected = null,
    showGenes = false,
    homeMode = null,
    helpKey = null,
    lastOpener = null;
  let teacher = loadJSON("aquarium-teacher-v1", normalizeTeacher()),
    storageError = "",
    imported = null,
    importedMetric = "oxygen",
    manualMetric = "oxygen",
    importedManualMetric = "oxygen";
  const archiveRefs = new Map();
  try {
    teacher = normalizeTeacher(teacher);
  } catch {
    teacher = normalizeTeacher();
  }
  const student = createStudentViews({
    esc,
    num,
    button,
    helpButton,
    panelHeader,
    options,
    state: () => ({
      session,
      tag,
      panel,
      s: host.getState(),
      w: waterIndicators(host.getState()),
      types: host.types,
      showGenes,
      unlockedMetrics: teacher.unlockMetrics,
      support: teacher.support,
      help: teacher.help,
      comparisonHistory: session?.comparisonHistory || [],
    }),
    healthText: () => fishStatusText(host.getState(), host.types),
    tools,
    sample: () => learningSample(host.getState(), host.types),
    catalog: () => GRADE_PROFILES[tag.grade].catalog,
    form: interventionForm,
    plot,
    times: comparisonTimes,
    matches: () =>
      planMatchesComparison(
        session.comparison,
        currentPlan(session.comparison.kind),
      ),
    studentMetrics: () => studentMetricKeys(),
    manual: () => studentManual(),
    comparisonView: () => resolveComparisonView(session),
    questionResult: () => inspectedQuestResult(),
    attempts: () => archivedAttempts(),
  });
  const isPrototype = () => screen === "active" && !detailed && tag?.mission === "8-ecosystem";
  function inspectedQuestResult() {
    if (!isPrototype() || session.quest?.step !== 3) return session?.quest?.result;
    const v = resolveComparisonView(session);
    if (!v || v.comparison !== session.comparison) return session.quest.result;
    const r = comparisonReading({...v.comparison,runs:[{...v.run,control:v.row.control?[v.row.control]:[],test:v.row.test?[v.row.test]:[]}]},QUESTS[tag.mission].experiment);
    return r ? {...r,displayPrecision:1,viewContext:v.context} : null;
  }
  function stopPlayback() {clearInterval(playback); playback = null;}
  function showTime(time) {
    selectComparisonView(session,{time});
    const v = resolveComparisonView(session);
    if (isPrototype() && v?.comparison === session.comparison && v.context.time === v.rows.at(-1).time && session.quest.step === 2)
      recordQuestExperiment("ecology");
    persist(); render();
  }
  function playWorkspace() {
    stopPlayback();
    let v = resolveComparisonView(session);
    if (!v) return;
    if (v.context.time === v.rows.at(-1).time) showTime(v.rows[0].time);
    playback = setInterval(() => {
      v = resolveComparisonView(session);
      const i = v.rows.findIndex(r=>r.time === v.context.time);
      if (!isPrototype() || i >= v.rows.length-1) {stopPlayback(); return;}
      if (i+1 === v.rows.length-1) stopPlayback();
      showTime(v.rows[i+1].time);
    },600);
  }
  function studentMetricKeys() {
    if (tag.grade === 9) return ["dark", "light", "A"];
    const rawPrimary = QUESTS[tag.mission]?.experiment.metric,primary=rawPrimary === "fishOutcome" ? "fishAlive" : rawPrimary;
    return primary
      ? [...new Set([primary, ...({"8-oxygen":["temp"],"8-health":["fishAlive","health"],"10-enrichment":["oxygen"],"10-carbon":["plantBiomass"],"10-restore":["fishAlive","health"],"10-northsea":["oxygen"]}[tag.mission] || []), ...teacher.unlockMetrics])]
      : [
          ...new Set([
            "oxygen",
            "health",
            "algae",
            "plantBiomass",
            "organic",
            ...teacher.unlockMetrics,
          ]),
        ];
  }
  function pickObject(side, uid, water = false) {
    const v = temperatureView(session,host,LEARNING_MODEL_REVISION);
    if (!v.sides[side]?.state) return;
    session.prototypeSelection = {side,uid:water ? null : Number(uid),water,context:v.context,stateId:v.sides[side].stateId};
    questEvent(session.quest,"observe");
    persist(); render();
  }
  function savedView() {
    const v = resolveComparisonView(session), side = session.view?.side === "control" ? "control" : "test", data = v?.sides[side];
    if (!v) return panelHeader("Gespeicherte Ansicht") + "<p>Kein Versuch vorhanden.</p>";
    const s = data.sample;
    return panelHeader(`Becken ${side === "control" ? 1 : 2} ansehen`) +
      `<section data-saved-view data-series-id="${esc(v.context.seriesId)}" data-repetition="${v.context.repetition}" data-state-id="${data.stateId || "unknown"}"><p>Versuchsreihe ${v.context.series+1} · Wiederholung ${v.context.repetition} · Tag ${num(v.context.time)}</p><p>Gespeicherte Messwertansicht. Dein eigenes Spielbecken wird dadurch nicht verändert.</p>${s ? `<dl><dt>Lebende Fische</dt><dd>${s.fishAlive ?? "Nicht dokumentiert"}</dd><dt>Wassertemperatur</dt><dd>${num(s.temp,1)} °C</dd></dl>` : "<p>Dieses Becken ist beendet. Keine Folgemessung vorhanden.</p>"}${!data.state && s ? "<p>Ein damaliges Beckenbild ist hier nicht gespeichert.</p>" : ""}${data.state ? button("adopt-view","Als eigenes Becken übernehmen") : ""}</section>`;
  }
  function archivedAttempts() {
    const keys=Object.keys(localStorage).filter(k=>k.startsWith("aquarium-learning-attempt-v1:"));
    return keys.length ? `<details><summary>Frühere Durchgänge ansehen</summary>${keys.map(k=>{
      const p=loadJSON(k,null)?.product;
      return p ? `<button data-learning-archived-product="${esc(k)}">Klasse ${p.profile.grade} · ${esc(p.profile.mission || "Freies Forschen")} · ${esc(new Date(p.created).toLocaleString("de-DE"))}</button>` : "";
    }).join("")}</details>` : "";
  }
  function restartAttempt(repeat) {
    const previous = {product:product(),tank:structuredClone(host.getState()),session:structuredClone(session)};
    if (!saveJSON("aquarium-learning-attempt-v1:"+session.attemptId,previous)) return;
    const old=session, tank=repeat ? structuredClone(old.baseline) : createLearningTank(tag,host);
    const e=QUESTS[tag.mission].experiment;
    session={version:1,viewVersion:1,attemptId:investigationId(),planId:investigationId(),notes:{},measurements:[],baseline:structuredClone(tank),comparison:null,
      population:tag.grade === 9 ? (repeat ? repeatLearningPopulation(old.population) : createLearningPopulation()) : null,
      study:{tool:e.tool || tools().find(k=>LEARNING_TOOLS[k]) || "light",value:tag.mission === "8-ecosystem" ? tank.setTemp : e.value ?? null,
        days:3,repetitions:2,metric:e.metric || (tag.grade === 9 ? "dark" : "oxygen"),environment:"neutral",generations:5},quest:newQuest(tag.mission)};
    selected=null;showGenes=false;panel=null;host.open(tank);persist();render();
  }
  function studentManual() {
    if (!session.measurements.length) return "";
    const keys = recordedMetrics(session.measurements, metrics()).filter((k) =>
        (tag.grade === 9
          ? ["individuals", ...teacher.unlockMetrics]
          : studentMetricKeys()
        ).includes(k),
      ),
      key = keys.includes(manualMetric) ? manualMetric : keys[0];
    if (!key) return "";
    const rows = session.measurements.map((r) => ({
      ...r,
      [key]: r.metrics && !r.metrics.includes(key) ? null : r[key],
    }));
    return `<section class="learn-measurements"><h3>Deine Messungen</h3><label>Wert<select data-learning-manual-metric="local">${options(
      keys.map((k) => [k, STUDENT_METRICS[k][0]]),
      key,
    )}</select></label>${plot({ kind: "manual", runs: [{ control: rows, test: [] }] }, key)}<div class="learn-table-wrap"><table><thead><tr><th>Tag</th><th>${esc(STUDENT_METRICS[key][0])}</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${num(r.day)}</td><td>${key === "health" && r.metricsVersion !== 2 ? "Früherer Tierwert: " : ""}${num(r[key], 3)}</td></tr>`).join("")}</tbody></table></div><small>— bedeutet: Hier fehlt ein Wert.</small></section>`;
  }
  function recordQuestExperiment(kind) {
    if (detailed || !session.quest) return;
    const d = QUESTS[tag.mission];
    if (!d) return;
    let evidence;
    if (kind === "ecology") {
      const c = session.comparison;
      // The actual intervention must change the cloned baseline, not merely be selected.
      const action = c.runs[0].intervention || interventionEvent(session.baseline,
        applyLearningIntervention(session.baseline,c.tool,c.value,host),c.tool,c.value);
      const changed = action.effective;
      evidence = {
        changed,
        intervention: action,
        result: comparisonReading(c, d.experiment),
        tool: c.tool,
        compatible:
          (c.tool === d.experiment.tool || (["8-health", "10-restore"].includes(d.id) && mission().tools.includes(c.tool))) &&
          (d.id !== "8-ecosystem" || (c.value > session.baseline.params.temp && c.value <= Math.min(...session.baseline.entities.filter(e=>!e.dead && host.types[e.species]?.temp).map(e=>host.types[e.species].temp[1])))),
        value: c.value,
      };
    } else if (kind === "population")
      evidence = {
        generations: session.comparison.generations,
        populationPair: populationPairEvidence(session.comparisonHistory,session.comparison),
        compatible:
          true,
        result: {...comparisonReading(session.comparison, d.experiment),populationPair:populationPairEvidence(session.comparisonHistory,session.comparison)},
      };
    else if (kind === "cross")
      evidence = {
        generation: session.population.generation,
        mendel: mendelEvidence(session.population),
        result: { kind: "cross", ...populationCounts(session.population),mendel:mendelEvidence(session.population) },
        parents: session.population.events.at(-1)?.parents,
      };
    else {
      const c = populationCounts(session.population);
      evidence = {
        hasAA: c.AA > 0,
        hasAa: c.Aa > 0,
        result: { kind: "traits", AA: c.AA, Aa: c.Aa },
      };
    }
    if (!questEvent(session.quest, kind, evidence) && session.quest.step === 2) {
      const expected = d.experiment.kind;
      session.quest.feedback =
        expected === "traits"
          ? "Starte den Farbversuch neu. Zeige dann die Erbanlagen."
          : expected === "cross"
            ? "Untersuche AA × aa (F1), danach Aa × Aa (F2)."
            : expected === "population"
              ? evidence.compatible === false
                ? "Wähle eine helle oder dunkle Umgebung."
                : "Vergleiche zwei neutrale Wiederholungen und danach eine Umgebung mit Farbvorteil."
              : evidence.compatible === false
                ? d.id === "8-ecosystem" ? "Der Heizstab soll das Wasser erwärmen. Wähle mehr als 25 und höchstens 27 °C." : "Nutze für diese Aufgabe " +
                  STUDENT_TOOLS[d.experiment.tool][0] +
                  "."
                : "Hier ist noch alles gleich. Ändere einen Wert.";
    }
  }
  function loadJSON(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  }
  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      storageError = "";
      return true;
    } catch {
      storageError =
        "Dein Stand konnte hier nicht gespeichert werden. Nutze „Für die Lehrkraft speichern“.";
      host.notify(storageError);
      return false;
    }
  }
  function persist() {
    if (!tag || !session) return;
    session.support = teacher.support;
    session.modelVersion = LEARNING_MODEL_REVISION;
    host.save();
    saveJSON("aquarium-learning-notes-v1:" + learningSlot(tag), session);
  }
  function download(name, value, type = "application/json") {
    const a = document.createElement("a"),
      url = URL.createObjectURL(
        new Blob(
          [typeof value === "string" ? value : JSON.stringify(value, null, 2)],
          { type },
        ),
      );
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function product() {
    return {
      version: 2,
      type: "aquarium-learning-product",
      profile: tag,
      notes: structuredClone(session.notes),
      provenance: learningProvenance(session),
      gameExplanation: session.quest ? questConclusion(QUESTS[tag.mission],session.quest.result).feedback : null,
      created: new Date().toISOString(),
      support: teacher.support,
      model: CURRICULUM,
      modelVersion: LEARNING_MODEL_REVISION,
      comparison: session.comparison,
      currentPlan: currentPlan(),
      population: session.population,
      populationRepeats: session.populationRepeats || [],
      comparisonHistory: session.comparisonHistory || [],
      viewContext: resolveComparisonView(session)?.context || null,
      attemptId: session.attemptId || null,
      measurements: session.measurements,
      measurementMetrics: recordedMetrics(session.measurements, metrics()),
      quest: session.quest || null,
      earlierNotes: session.earlierNotes || null,
      earlierQuest: session.earlierQuest || null,
    };
  }
  function currentPlan(kind = tag?.grade === 9 ? "population" : "ecology") {
    return snapshotLearningPlan({
      kind,
      baseline: session.baseline,
      population: session.population,
      study: session.study,
      profile: tag,
      notes: session.notes,
      metrics:
        kind === "population" ? Object.keys(POPULATION_METRICS) : metrics(),
    });
  }
  function recordedMetrics(rows, fallback) {
    return [...new Set(rows.flatMap((s) => s.metrics || fallback))].filter(
      (k) => Object.hasOwn(LEARNING_METRICS, k),
    );
  }
  function refreshResultNotice() {
    if (!session?.comparison) return;
    const state = root.querySelector("[data-learning-result-state]");
    if (state) {
      const matches = planMatchesComparison(
        session.comparison,
        currentPlan(session.comparison.kind),
      );
      state.textContent = detailed
        ? matches
          ? "Dieses Ergebnis gehört zum aktuellen Plan."
          : "Plan geändert – neu berechnen. Gezeigt und exportiert wird weiterhin der ältere Lauf mit seiner unten festgehaltenen Konfiguration."
        : matches
          ? session.comparison.kind === "population"
            ? "Gruppe 1: keine Farbe bevorzugt. Gruppe 2: deine Umgebung."
            : "Becken 1: Einstellung bleibt gleich. Becken 2: gewählter Eingriff. Beide Becken entwickeln sich weiter."
          : "Du hast etwas geändert. Starte den Versuch neu.";
      state.classList.toggle("learn-outdated", !matches);
    }
  }

  function tools() {
    return learningTools(tag, teacher);
  }
  function metrics() {
    return learningMetrics(tag, teacher);
  }
  function mission() {
    return missionById(tag?.mission);
  }
  function setScreen(next) {
    stopPlayback();
    persist();
    host.pause();
    host.tweezers(false);
    panel = null;
    helpKey = null;
    screen = next;
    if (next !== "active") host.interactive(false);
    render();
  }
  function start(mode, id = null) {
    detailed = false;
    grade = Number(grade || teacher.grade);
    tag = { version: 1, grade, mode, mission: id };
    const key = learningSlot(tag),
      raw = loadJSON(key, null);
    let tank;
    try {
      tank = raw ? host.normalize(raw) : createLearningTank(tag, host);
    } catch (e) {
      host.notify(
        "Gespeichertes Lernbecken konnte nicht geladen werden: " + e.message,
      );
      return;
    }
    const saved = loadJSON("aquarium-learning-notes-v1:" + key, null);
    if (saved && !saved.viewVersion && !loadJSON(key+":before-views-v1",null)) {
      if (!saveJSON(key+":before-views-v1",{tank:raw,session:saved})) return;
    }
    session =
      saved?.version === 1 && saved.notes && Array.isArray(saved.measurements)
        ? saved
        : {
            version: 1,
            notes: {},
            measurements: [],
            baseline: structuredClone(tank),
            comparison: null,
            population: grade === 9 ? createLearningPopulation() : null,
            study: {
              tool: tools().find((k) => LEARNING_TOOLS[k]) || "light",
              value: null,
              days: 3,
              repetitions: 2,
              metric: grade === 9 ? "A" : "oxygen",
              environment: "neutral",
              generations: 5,
            },
          };
    session.viewVersion = 1;
    session.attemptId ??= investigationId();
    session.planId ??= investigationId();
    session.study ??= {
      tool: "light",
      days: 3,
      repetitions: 2,
      metric: "oxygen",
      environment: "neutral",
      generations: 5,
    };
    session.population ??= grade === 9 ? createLearningPopulation() : null;
    const freshQuest = !session.quest;
    if (
      freshQuest &&
      saved &&
      tag.mode === "missions" &&
      Object.values(session.notes).some(Boolean)
    )
      session.earlierNotes ??= structuredClone(session.notes);
    try {
      session.quest =
        validateQuest(session.quest, tag.mission) || newQuest(tag.mission);
    } catch {
      session.quest = newQuest(tag.mission);
    }
    if (freshQuest && session.quest && !saved) {
      const e = QUESTS[tag.mission].experiment;
      if (e.kind === "ecology") {
        session.study.tool = e.tool;
        session.study.value = tag.mission === "8-ecosystem" ? tank.setTemp : e.value;
        session.study.metric = e.metric;
      }
      if (e.kind === "population") session.study.metric = "dark";
    }
    // Keep an exact archive before upgrading an unfinished older quest's requirements.
    if (session.quest?.version === 1 && session.quest.step < 5) {
      session.earlierQuest ??= structuredClone(session.quest);
      session.quest.version = 2; session.quest.activities = [];
    }
    const reconciled = reconcileLearningStudy(session.study,tools());
    if (JSON.stringify(reconciled) !== JSON.stringify(session.study)) {
      session.earlierStudy ??= structuredClone(session.study);
    }
    session.study = reconciled;
    selected = null;
    showGenes = false;
    screen = "active";
    homeMode = null;
    host.open(tank);
    panel = null;
    host.interactive(true);
    persist();
    render();
  }
  function showPanel(next) {
    lastOpener = document.activeElement;
    host.pause();
    host.tweezers(false);
    panel = next;
    if (next === "observe") {
      questEvent(session?.quest, "observe");
      if (session?.quest) recordActivityView(session.quest,"fish-water",learningSample(host.getState(),host.types));
      persist();
    }
    helpKey = null;
    host.interactive(false);
    render();
    root.querySelector(".learn-panel h2")?.focus();
  }
  function closePanel() {
    helpKey = null;
    panel = null;
    host.interactive(screen === "active");
    render();
    if (lastOpener?.isConnected) lastOpener.focus();
    else
      (
        root.querySelector(
          '[data-learn="' + (lastOpener?.dataset.learn || "observe") + '"]',
        ) || root.querySelector("button")
      )?.focus();
  }
  function closeHelp() {
    const key = helpKey;
    helpKey = null;
    render();
    root.querySelector('[data-learn-help="' + key + '"]')?.focus();
  }
  function gradeHome() {
    return `<div class="learn-welcome"><p class="learn-kicker">Ökosystem-Werkstatt · Klassen 8–10</p><h1>Biologie im Aquarium</h1><p>Schau hin. Probiere aus. Finde Zusammenhänge.</p><div class="learn-grades">${Object.entries(
      GRADE_PROFILES,
    )
      .map(
        ([g, p]) =>
          `<button data-learn-grade="${g}"><small>Klasse ${g}</small><strong>${p.title}</strong><span>${p.subtitle}</span><b>Entdecken →</b></button>`,
      )
      .join(
        "",
      )}</div><footer>${button("expert", "Expertenmodus · bisheriges Spiel")}${button("teacher", "Lehrkraftmodus")}${button("display", "Darstellung: " + host.graphics().label)}<p>Ohne Konto · alles lokal auf diesem Gerät. Vorhandene Spielstände bleiben erhalten.</p></footer></div>`;
  }
  function modeHome() {
    const p = GRADE_PROFILES[grade];
    return `<div class="learn-welcome">${button("back", "← Jahrgang wechseln")}<p class="learn-kicker">Klasse ${grade}</p><h1>${p.title}</h1><p>${p.question}</p>${
      homeMode !== "missions"
        ? `<div class="learn-modes">${button("missions", "<strong>Lernmissionen</strong><span>Eine Aufgabe nach der anderen.</span>")}${button("free", "<strong>Freies Forschen</strong><span>Probiere deine eigenen Ideen aus.</span>")}</div>`
        : `<div class="learn-mission-list">${MISSIONS.filter(
            (m) => m.grade === grade,
          )
            .map(
              (m) =>
                `<button data-learn-mission="${m.id}"><strong>${esc(m.title)}</strong></button>`,
            )
            .join("")}</div>`
    }<footer>${button("display", "Darstellung: " + host.graphics().label)}<p>Du kannst deinen letzten lokalen Stand in jeder Mission fortsetzen.</p></footer></div>`;
  }
  function status() {
    const s = host.getState(),
      w = waterIndicators(s);
    if (tag.grade === 9)
      return `<span>${learningSample(s, host.types).individuals} Tiere im Becken</span><span>Zuchtmodell: Generation ${session.population.generation}</span>`;
    return `<span>${num(s.params.temp, 1)} °C</span><span>Sauerstoff ${w.oxygen}</span><span>Nährstoffe: ${w.nutrients}</span><span>Belastung ${w.load}</span>`;
  }
  function hud() {
    if (!detailed)
      return `<header class="learn-hud learn-simple-hud"><div><small>Klasse ${tag.grade} · ${tag.mode === "free" ? "Freies Forschen" : "Lernmission"}</small><h1>${esc(QUESTS[tag.mission]?.title || GRADE_PROFILES[tag.grade].title)}</h1></div><div>${host.tweezersActive() ? button("tweezers", "Pinzette beenden", 'aria-pressed="true"') : ""}${button("more", "Mehr")}</div></header><nav class="learn-tools" aria-label="Lernwerkzeuge">${button("observe", "Beobachten")}${button("investigate", "Ausprobieren")}${button("material", tag.grade === 9 ? "Farbe & Nachkommen" : "Tiere & Pflanzen")}${button("notebook", "Meine Ergebnisse")}<div class="learn-time"><span>Tag ${num(host.getState().day, 1)}</span>${button("advance", "+ 1 Tag")}</div></nav>${tag.mode === "missions" ? student.quest() : ""}${storageError ? `<div class="learn-storage" role="alert">${esc(storageError)}</div>` : ""}`;
    return `<header class="learn-hud"><div><small>Klasse ${tag.grade} · ${tag.mode === "free" ? "Freies Forschen" : "Lernmission"}</small><h1>${esc(mission()?.title || GRADE_PROFILES[tag.grade].title)}</h1>${button("mission-info", esc(mission()?.question || "Deine Frage und dein Untersuchungsweg"), 'class="learn-question"')}</div><div>${button("home", "Start")}${button("display", "Darstellung")}${teacher.help ? button("glossary", "Glossar") : ""}</div></header><div class="learn-status" aria-label="Kurzer Beckenüberblick">${status()}</div><nav class="learn-tools" aria-label="Lernwerkzeuge">${button("observe", "Beobachten")}${button("investigate", "Untersuchen")}${button("notebook", "Notizbuch")}${button("material", tag.grade === 9 ? "Vererbung" : "Beziehungen & Arten")}${button("tweezers", "Pinzette", 'aria-pressed="' + String(host.tweezersActive()) + '"')}<div class="learn-time"><span>Tag ${num(host.getState().day, 1)}</span>${button("advance", "+ 1 Tag")}</div></nav>${storageError ? `<div class="learn-storage" role="alert">${esc(storageError)}</div>` : ""}`;
  }
  function observe() {
    if (!detailed) return student.observe();
    const s = host.getState(),
      w = waterIndicators(s),
      allowed = metrics();
    let content =
      tag.grade === 9
        ? `<p>Beobachte Farbe und einzelne Tiere. Die Modellallele kannst du bei Bedarf einblenden.</p>${button("genes", showGenes ? "Genotypen ausblenden" : "Modellgenotypen einblenden")}<ul class="learn-individuals">${s.entities
            .filter(
              (e) => !e.dead && host.types[e.species]?.category === "fish",
            )
            .map(
              (e) =>
                `<li><strong>Nr. ${e.uid} · ${esc(host.types[e.species].name)} ${e.sex}</strong><span>Farbe ${e.variant === "gold" ? "gold" : "dunkel"}${showGenes ? " · " + genotypeText(e.genetics?.loci) : ""}</span></li>`,
            )
            .join(
              "",
            )}</ul><p>Im Werkzeug Vererbung untersucht ihr zusätzlich eine endliche Modellpopulation. Ein Generationsschritt ist kein natürlicher Entwicklungstag.</p>`
        : `<dl class="learn-values"><div><dt>Temperatur</dt><dd>${num(s.params.temp, 1)} °C</dd></div><div><dt>Sauerstoff ${teacher.help ? helpButton("oxygen") : ""}</dt><dd>${w.oxygen}</dd></div><div><dt>Nährstoffe</dt><dd>${w.nutrients}</dd></div><div><dt>Wasserbelastung</dt><dd>${w.load}</dd></div></dl><p>${esc(w.nutrientNote)}</p><p>${
            w.reasons.length
              ? "Hinweise: " +
                esc(
                  tag.grade === 8
                    ? w.reasons
                        .map((x) =>
                          /Nitrit|Ammoniak/.test(x)
                            ? "problematische Stickstoffverbindungen"
                            : x,
                        )
                        .filter((x, i, a) => a.indexOf(x) === i)
                        .join(", ")
                    : w.reasons.join(", "),
                )
              : "Keine der modellierten Belastungswarnungen ist ausgelöst."
          }</p><small>${w.warning}</small>`;
    const selectedEntity = s.entities.find((e) => e.uid === selected);
    if (selectedEntity) {
      const type = host.types[selectedEntity.species];
      content =
        `<section><h3>${esc(type.name)} · Nr. ${selectedEntity.uid}</h3><p>${esc(type.description)}</p><p>${selectedEntity.dead ? "Im Modell verstorben" : selectedEntity.health >= 80 ? "Dem Fisch geht es gut" : selectedEntity.health >= 50 ? "Dem Fisch geht es nicht gut" : "Der Fisch ist in Gefahr"}. ${showGenes && tag.grade === 9 ? esc(genotypeText(selectedEntity.genetics?.loci)) : ""}</p></section>` +
        content;
    }
    const chemistry = allowed.filter(
      (k) =>
        ["no2", "no3", "co2", "oxygen"].includes(k) &&
        ((mission()?.metrics || []).includes(k) ||
          (teacher.unlockMetrics || []).includes(k)),
    );
    if (chemistry.length)
      content += `<h3>Messung für diese Untersuchung</h3><dl class="learn-values">${chemistry.map((k) => `<div><dt>${LEARNING_METRICS[k][0]}</dt><dd>${num(s.params[k], 3)} ${LEARNING_METRICS[k][1]}</dd></div>`).join("")}</dl>`;
    const snap = learningSample(s, host.types);
    return (
      panelHeader("Beobachten", "observe") +
      content +
      `<h3>Beobachtung festhalten</h3><p>${num(snap.individuals, 0)} Tiere · Algen ${s.algae < 0.2 ? "wenig" : s.algae < 0.6 ? "zunehmend" : "viel"} · ${snap.health >= 80 ? "Den Fischen geht es gut" : snap.health >= 50 ? "Den Fischen geht es nicht gut" : "Die Fische sind in Gefahr"}.</p>${button("measure", "Messzeitpunkt protokollieren")}<p>${session.measurements.length} Messzeitpunkte gespeichert.</p>${manualData({ measurements: session.measurements, measurementMetrics: recordedMetrics(session.measurements, metrics()) })}<h3>Einen Eingriff bewusst wählen</h3>${interventionForm("care")}${tools().some((k) => LEARNING_TOOLS[k]) ? button("apply", "Im Becken anwenden") : ""}<p class="learn-caption">Für einen kontrollierten Vergleich öffne „Untersuchen“. Ein Eingriff hier verändert nur dein aktuelles Becken.</p>`
    );
  }
  function selectTool(key) {
    if (!tools().includes(key) || !LEARNING_TOOLS[key]) throw new Error("Dieses Werkzeug ist nicht freigeschaltet.");
    session.study.values ??= {};
    session.study.values[session.study.tool] = session.study.value;
    session.study.tool = key;
    session.study.value = session.study.values[key] ?? LEARNING_TOOLS[key].value;
  }
  function openDevice(key, scope = panel === "investigate" || tag?.mode === "missions" ? "study" : "care") {
    if (isPrototype()) {stopPlayback(); session.view = {mode:"plan"};}
    const toggle = EQUIPMENT_SWITCHES[key];
    if (toggle) {
      if (tag?.mode !== "free") throw new Error("Dieses Gerät gehört nicht zum Versuchsplan dieser Mission.");
      scope = "care";
    } else selectTool(key);
    const previous = panel;
    closePanel();
    host.deviceOpen(key, {
      compact: !detailed,
      scope: scope === "study" ? "study" : "live",
      definition: toggle || LEARNING_TOOLS[key],
      value: scope === "study" ? session.study.value : host.getState()[{temperature:"setTemp",light:"hours",filter:"flow"}[key]],
      onCommit: (value, intensity) => {
        if (!toggle) {
          session.study.value = value;
          if (session.study.drafts) delete session.study.drafts[key];
        }
        if (scope !== "study") {
          let next = toggle ? applyEquipmentSetting(host.getState(), key, value) : applyLearningIntervention(host.getState(), key, value, host);
          if (intensity != null) next = applyEquipmentSetting(next, "intensity", intensity);
          host.open(next);
        }
        persist();
        if (scope === "study") showPanel("investigate"); else render();
      },
      onCancel: () => {if (previous) showPanel(previous);},
      focusTarget: () => root.querySelector(`[data-learn="device-${key}"],[data-learning-tool-choice="${key}"]`) || root.querySelector(".learn-panel button") || root.querySelector(`[data-learn="${previous}"]`),
    });
  }
  function interventionForm(prefix) {
    const list = tools().filter(k => LEARNING_TOOLS[k]);
    if (!list.length) return "<p>Für dieses Lernziel ist kein Pflegeeingriff freigeschaltet.</p>";
    const key = session.study.tool, d = LEARNING_TOOLS[key], value = session.study.drafts?.[key] ?? session.study.value ?? d.value;
    const device = ["temperature", "light", "filter"].includes(key), persistent = device || ["feed","co2"].includes(key);
    if (!detailed) {
      const choose=list.length>1 ? `<details><summary>Anderen Eingriff wählen</summary><div class="learn-tool-choices">${list.map(k=>`<button data-learning-tool-choice="${k}">${esc(STUDENT_TOOLS[k][0])}</button>`).join("")}</div></details>` : "";
      const field=`<label>${esc(STUDENT_TOOLS[key][0])} (${esc(key === "feed" ? "Spielportionen pro Tag" : d.unit)})<input type="text" inputmode="decimal" autocomplete="off" data-learning-value value="${esc(value)}" required></label><p data-control-error role="alert"></p>`;
      return `<section data-learning-form class="learn-compact-form"><input type="hidden" data-learning-tool="${prefix}" value="${key}">${device ? `<p>Geplant: ${esc(value)} ${esc(d.unit)}</p>${button("device-"+key,({temperature:"Heizstab einstellen",light:"Beleuchtung einstellen",filter:"Filter einstellen"})[key])}<details class="learn-numeric-alternative"><summary>Wert direkt eingeben</summary>${field}</details>` : field}${device ? `<details class="learn-more-tools"><summary>Weitere Werkzeuge</summary>${choose}</details>` : choose}</section>`;
    }
    return `<section data-learning-form><div class="learn-tool-choices" role="group" aria-label="Eingriff wählen">${list.map(k => `<button type="button" data-learning-tool-choice="${k}" aria-pressed="${k === key}">${esc(STUDENT_TOOLS[k][0])}</button>`).join("")}</div><input type="hidden" data-learning-tool="${prefix}" value="${key}">${device ? button("device-"+key, "Am 3D-Gerät einstellen") + dialControl(d,value,"data-learning-value") : `<label>${esc(STUDENT_TOOLS[key][0])} (${esc(key === "feed" ? "Spielportionen pro Tag" : d.unit)})<input type="text" inputmode="decimal" autocomplete="off" data-learning-value value="${esc(value)}" required></label><p data-control-error role="alert"></p>`}<p class="learn-setting-note">${persistent ? "Dauerhafte Einstellung: bleibt bis zur nächsten Änderung bestehen." : "Einmalige Aktion: wird genau einmal ausgeführt."} ${prefix === "study" ? "Hier planst du Becken 2. Der Vergleich beginnt erst mit „Versuch starten“." : "Wirkt auf dein aktuelles Becken."}</p><small>${esc(d.description)}</small></section>`;
  }
  function readIntervention() {
    const tool = session.study.tool, def = LEARNING_TOOLS[tool], field = root.querySelector("[data-learning-value]");
    try {
      const value = requireControlValue(field?.value ?? session.study.drafts?.[tool] ?? session.study.value, def);
      session.study.value = value;
      return {tool, value};
    } catch (error) {
      const errorLabel = root.querySelector("[data-learning-form] [data-control-error]");
      if (errorLabel) errorLabel.textContent = error.message;
      field?.setAttribute("aria-invalid", "true");
      for (let parent=field?.parentElement;parent;parent=parent.parentElement) if (parent.tagName === "DETAILS") parent.open=true;
      field?.focus(); throw error;
    }
  }
  function notebook() {
    if (!detailed) return student.notebook();
    const p = GRADE_PROFILES[tag.grade],
      m = mission();
    return (
      panelHeader("Mein Forschungsnotizbuch", "hypothesis") +
      `<p>${esc(m?.question || p.question)}</p><p class="learn-guidance">${SUPPORT[teacher.support].prompt}</p>${textArea("prior", session.notes.prior, p.diagnosis)}${textArea("question", session.notes.question)}${textArea("hypothesis", session.notes.hypothesis)}${textArea("prediction", session.notes.prediction)}${textArea("plan", session.notes.plan)}${textArea("observation", session.notes.observation)}${textArea("explanation", session.notes.explanation, m?.consolidation || p.reflection)}${textArea("reflection", session.notes.reflection)}${session ? textArea("transfer", session.notes.transfer) : ""}${manualData({ measurements: session.measurements, measurementMetrics: recordedMetrics(session.measurements, metrics()) })}<p>Vergleiche deine erste und deine jetzige Erklärung. Nutze mindestens zwei Datenpunkte und nenne eine Unsicherheit. Gepflegte Fische allein belegen noch kein Verständnis.</p><div class="learn-actions">${button("export", "Lernprodukt als JSON")}${button("export-text", "Lesbares Protokoll")}</div><small>Automatisch lokal gespeichert. Ein Dateiexport schützt deine Arbeit auch beim Löschen von Browserdaten. Namen sind nicht erforderlich.</small>`
    );
  }
  function investigation() {
    if (!detailed) return student.investigation();
    if (tag.grade === 9 && tools().includes("selection"))
      return selectionView();
    if (tag.grade === 9) return breedingView();
    return (
      panelHeader("Kontrollierter Vergleich", "control") +
      `<p>Beide Becken starten aus derselben gesicherten Ausgangslage (Tag ${num(session.baseline.day, 1)}). Nur im Versuch wird eine Bedingung geändert.</p>${SUPPORT[teacher.support].steps ? "<ol><li>Frage, Hypothese und Plan notieren.</li><li>Eine Bedingung auswählen und Verlauf vorhersagen.</li><li>Kontrolle und Versuch messen; Daten erklären.</li></ol>" : ""}${tag.mode === "free" ? textArea("question", session.notes.question) : ""}${textArea("hypothesis", session.notes.hypothesis)}${textArea("prediction", session.notes.prediction)}${textArea("plan", session.notes.plan)}${interventionForm("study")}<div class="learn-two"><label>Beobachtungszeitraum (Tage)<input type="number" data-learning-days min="1" max="14" value="${session.study.days || 3}"></label><label>Wiederholungen<input type="number" data-learning-repetitions min="1" max="4" value="${session.study.repetitions || 2}"></label></div><div class="learn-actions">${button("compare", "Vergleich berechnen")}${button("baseline", "Aktuelles Becken als Ausgangslage")}</div><small>Wiederholungen variieren den Zufallsstart, nicht die Startbestände. Das Modell erzeugt keine künstlichen Messfehler. Gleiche Kurven sind möglich.</small>${session.comparison?.kind === "ecology" ? results(session.comparison) : ""}`
    );
  }
  function plot(comp, key, context = null) {
    const technical = detailed || panel === "teacher";
    const percent =
      !technical &&
      comp.kind === "population" &&
      POPULATION_METRICS[key]?.[1].includes("Anteil");
    const rawRun=comp.runs[0],oldHealth=key === "health" && [...rawRun.control,...rawRun.test].some(s=>s.metricsVersion !== 2),mixedHealth=oldHealth && [...rawRun.control,...rawRun.test].some(s=>s.metricsVersion === 2);
    const run = mixedHealth ? {...rawRun,control:rawRun.control.map(s=>({...s,health:s.metricsVersion===2?s.health:null})),test:rawRun.test.map(s=>({...s,health:s.metricsVersion===2?s.health:null}))} : rawRun,
      a = percent
        ? run.control.map((v) => ({
            ...v,
            [key]: Number.isFinite(v[key]) ? v[key] * 100 : v[key],
          }))
        : run.control,
      b = percent
        ? run.test.map((v) => ({
            ...v,
            [key]: Number.isFinite(v[key]) ? v[key] * 100 : v[key],
          }))
        : run.test,
      all = [...a, ...b],
      x = (k) => (comp.kind === "population" ? k.generation : k.day);
    const minX = Math.min(...all.map(x)),
      maxX = Math.max(...all.map(x)),
      finite = all.filter((v) => Number.isFinite(v[key]));
    const minY = Math.min(0, ...finite.map((v) => v[key])),
      maxY =
        comp.kind === "population" &&
        POPULATION_METRICS[key]?.[1].includes("Anteil")
          ? percent
            ? 100
            : 1
          : Math.max(0.01, ...finite.map((v) => v[key]));
    const xx = (v) => 45 + ((x(v) - minX) / (maxX - minX || 1)) * 405,
      yy = (v) => 180 - ((v[key] - minY) / (maxY - minY || 1)) * 150;
    const title = (
      (!technical && oldHealth && [mixedHealth ? "Fischzustand ab neuer Messreihe" : "Früherer Tierzustand","Punkte"]) ||
      (!technical &&
        (percent ? [STUDENT_METRICS[key][0], "%"] : STUDENT_METRICS[key])) ||
      comparisonMetricDefinitions(comp)[key] || [key, ""]
    ).join(" · ");
    return `<svg class="learn-chart" data-view-time="${context?.time ?? ""}" data-series-id="${esc(context?.seriesId || "")}" viewBox="0 0 480 270" role="img" aria-label="Verlauf ${esc(title)}: ${comp.kind === "manual" ? (technical ? "Eigenes Becken" : "Dein Becken") : technical ? "Kontrolle und Versuch" : comp.kind === "population" ? "Gruppe 1 und Gruppe 2" : "Becken 1 und Becken 2"}"><desc>${esc(technical ? runDescription(comp) : "Messwerte aus deinem Versuch.")}</desc><text x="45" y="13" font-size="12">${esc(title)}</text>${context ? `<line data-time-cursor x1="${numRaw(45+(context.time-minX)/(maxX-minX || 1)*410)}" x2="${numRaw(45+(context.time-minX)/(maxX-minX || 1)*410)}" y1="24" y2="180" stroke="#8a6822" stroke-width="2"/><text x="240" y="13" font-size="12">Tag ${num(context.time)}</text>` : ""}<path d="M45 24 V180 H455" fill="none" stroke="currentColor"/><text x="5" y="33">${num(maxY)}</text><text x="7" y="184">${num(minY)}</text><text x="45" y="204">${num(minX)}</text><text x="420" y="204">${num(maxX)}</text>${[
      a,
      b,
    ]
      .map((rows, i) => {
        const known = rows.filter((v) => Number.isFinite(v[key])),
          color = i ? "#a35325" : "#216c70";
        return `${known.length === 1 ? `<circle cx="${numRaw(xx(known[0]))}" cy="${numRaw(yy(known[0]))}" r="4" fill="${color}"/>` : ""}<polyline points="${known.map((v) => numRaw(xx(v)) + "," + numRaw(yy(v))).join(" ")}" fill="none" stroke="${color}" stroke-width="3" ${i ? 'stroke-dasharray="7 3"' : ""}/>`;
      })
      .join(
        "",
      )}<text x="170" y="224" font-size="12">${comp.kind === "population" ? "Generation" : technical ? "Tag · Modellzeit" : "Tag"} ${technical ? (comp.kind === "manual" ? "(eigene Messreihe)" : "(Wiederholung 1)") : ""}</text><path d="M50 246 H80" stroke="#216c70" stroke-width="3"/><text x="88" y="250" font-size="12">${comp.kind === "manual" ? (technical ? "Eigenes Becken" : "Dein Becken") : technical ? "Kontrolle" : comp.kind === "population" ? "Gruppe 1" : "Becken 1"}</text>${comp.kind === "manual" ? "" : `<path d="M250 246 H280" stroke="#a35325" stroke-width="3" stroke-dasharray="7 3"/><text x="288" y="250" font-size="12">${technical ? "Versuch" : comp.kind === "population" ? "Gruppe 2" : "Becken 2"}</text>`}</svg>`;
  }
  function numRaw(v) {
    return Number(v.toFixed(3));
  }
  function results(comp) {
    const population = comp.kind === "population",
      defs = comparisonMetricDefinitions(comp),
      keys = population
        ? ["A", "a", "dark", "light", "AA", "Aa", "aa", "n"]
        : metrics(),
      metric = keys.includes(session.study.metric)
        ? session.study.metric
        : keys[0],
      matches = planMatchesComparison(comp, currentPlan(comp.kind));
    return `<section class="learn-results"><h3>Tatsächlich berechnete Daten</h3><p data-learning-result-state role="status" class="learn-result-state ${matches ? "" : "learn-outdated"}">${matches ? "Dieses Ergebnis gehört zum aktuellen Plan." : "Plan geändert – neu berechnen. Gezeigt und exportiert wird weiterhin der ältere Lauf mit seiner unten festgehaltenen Konfiguration."}</p>${runMetadata(comp)}<label>Messgröße<select data-learning-metric>${options(
      keys.map((k) => [k, defs[k].join(" · ")]),
      metric,
    )}</select></label>${plot(comp, metric)}<p class="learn-caption">Kontrolle: durchgezogen · Versuch: gestrichelt. Diagramm: Wiederholung 1. „—“ bedeutet unbekannt; „keine Folgemessung“ bedeutet: diese Seite wurde beendet. Nach Ausfall einer Seite gibt es keinen vollständigen Paarvergleich mehr.</p>${runTables(comp, metric)}<div class="learn-actions">${button("csv", "Daten als CSV")}${button("export", "Protokoll mit Daten")}${button("chart", "Diagramm als SVG")}</div>${!population ? `<div class="learn-actions">${button("show-control", "Kontrollbecken ansehen")}${button("show-test", "Versuchsbecken ansehen")}</div>` : ""}${textArea("observation", session.notes.observation)}${textArea("explanation", session.notes.explanation)}${textArea("reflection", session.notes.reflection)}</section>`;
  }
  function runDescription(comp) {
    const c = comp.configuration,
      tool = LEARNING_TOOLS[c?.tool || comp.tool];
    return `${comp.kind === "manual" ? "Eigene Messreihe" : "Berechneter Lauf"}: ${tool ? tool.label + " " + (c?.value ?? comp.value) + " " + tool.unit : { neutral: "Neutrale Modellumwelt (nur Drift)", dark: "Dunkle Modellumwelt", light: "Helle Modellumwelt" }[c?.environment || comp.environment] || ""}; geplante Dauer ${c?.days ?? c?.generations ?? comp.days ?? comp.generations ?? "nicht dokumentiert"}; Ausgangszeit ${c?.baseline?.time ?? "nicht dokumentiert"}; Kennung ${c?.baseline?.fingerprint ?? "Altbestand"}; Seeds ${comp.runs.map((r) => r.seed ?? "nicht dokumentiert").join(", ")}. ${comp.runs.map((r) => ["control", "test"].map((side) => `${side}: ${{ completed: "vollständig berechnet", failed: "biologisch ausgefallen", stopped: "vorzeitig beendet" }[r.status?.[side]?.state] || "nicht dokumentiert"}, Ende ${r.status?.[side]?.end ?? "unbekannt"}; ${r.status?.[side]?.reason || ""}`).join("; ")).join("; ")}`;
  }
  function runMetadata(comp) {
    const c = comp.configuration,
      planning = comp.planning || c?.planning || {},
      population = comp.kind === "population";
    return `<div class="learn-run-metadata"><p><strong>Festgehaltener Lauf:</strong> ${esc(runDescription(comp))}</p>${!c ? "<p>Älterer Export: keine vollständige feste Konfiguration vorhanden. Fehlende Angaben werden nicht nachträglich erfunden.</p>" : `<p>Klasse ${c.profile?.grade ?? "—"} · ${esc(c.profile?.mission || "Freies Forschen")} · Modellstand ${esc(c.modelVersion)} · ${c.repetitions} Wiederholung(en). ${population ? "Generation ist keine natürliche Entwicklungsdauer." : "Zeitschritt: 0,25 Modelltage."}</p>`}<details><summary>Planung vor genau diesem Lauf</summary>${["question", "hypothesis", "prediction", "plan"].map((k) => `<h4>${esc(noteFields[k])}</h4><p class="learn-pre">${esc(planning[k] || "Nicht dokumentiert.")}</p>`).join("")}</details><p>${esc(comp.source || comp.assumption || "Modellannahmen im älteren Export nicht dokumentiert.")}</p></div>`;
  }
  function runTables(comp, metric) {
    const population = comp.kind === "population",
      def = comparisonMetricDefinitions(comp)[metric];
    return comp.runs
      .map(
        (run) =>
          `<details class="learn-run"><summary>Wiederholung ${run.repetition} · Kontrolle ${run.control.length}, Versuch ${run.test.length} Zeitpunkte${run.stopped ? " · Seite beendet" : ""}</summary><p>Seed ${run.seed ?? "nicht dokumentiert"}.</p>${[
            "control",
            "test",
          ]
            .map((side) => {
              const st = run.status?.[side],
                rows = run[side],
                end = st?.end ?? rows.at(-1)?.day ?? rows.at(-1)?.generation;
              return `<p><strong>${side === "control" ? "Kontrolle" : "Versuch"}:</strong> ${esc(st?.state === "failed" ? "biologisch ausgefallen" : st?.state === "stopped" ? "vorzeitig beendet" : st?.state === "completed" ? "bis zum geplanten Ende berechnet" : "Status nicht dokumentiert")}; Ende ${num(end)}; tatsächliche Dauer ${num(end - (st?.start ?? rows[0]?.day ?? rows[0]?.generation))} ${population ? "Generationen" : "Modelltage"}. ${esc(st?.reason || "")}</p>`;
            })
            .join(
              "",
            )}${run.stopped ? `<p class="learn-outdated">${esc(run.stopped)} Nach dem Ausfall einer Seite sind nur die verbleibenden Einzelverläufe auswertbar.</p>` : ""}<div class="learn-table-wrap"><table><caption>${esc(def.join(" · "))}</caption><thead><tr><th>${population ? "Generation" : "Tag"}</th><th>Kontrolle</th><th>Versuch</th></tr></thead><tbody>${comparisonTimes(
            run,
            comp.kind,
          )
            .map(
              (row) =>
                `<tr><td>${num(row.time)}</td><td>${row.control ? (metric === "health" && row.control.metricsVersion !== 2 ? "Früherer Tierwert: " : "") + num(row.control[metric], 4) : "keine Folgemessung"}</td><td>${row.test ? (metric === "health" && row.test.metricsVersion !== 2 ? "Früherer Tierwert: " : "") + num(row.test[metric], 4) : "keine Folgemessung"}</td></tr>`,
            )
            .join(
              "",
            )}</tbody></table></div>${population ? ["control", "test"].map((side) => (run.archives?.[side] ? archiveView(run.archives[side], `${side === "control" ? "Kontroll" : "Selektions"}lauf · Wiederholung ${run.repetition}`) : "<p>Dieser ältere Export enthält kein Laufarchiv; Fortpflanzungserfolg daraus nicht rekonstruierbar.</p>")).join("") : ""}</details>`,
      )
      .join("");
  }
  function manualData(item, readOnly = false) {
    const rows = item.measurements || [],
      keys = item.measurementMetrics || [];
    if (!rows.length) return "";
    const defs=comparisonMetricDefinitions({kind:"manual",runs:[{control:rows,test:[]}]});
    const selected = readOnly ? importedManualMetric : manualMetric,
      key = keys.includes(selected) ? selected : keys[0];
    if (!key)
      return "<p>Messpunkte vorhanden; freigegebene Messgrößen nicht dokumentiert.</p>";
    const filtered = rows.map((s) => ({
      ...s,
      [key]: s.metrics && !s.metrics.includes(key) ? null : s[key],
    }));
    return `<section class="learn-measurements"><h3>Eigene Messreihe · ${rows.length} Zeitpunkte</h3><p>Aufeinanderfolgende Beobachtungen desselben Beckens. Kein automatischer Kontrollversuch; mehrere Eingriffe oder Zeitabstände können sich unterscheiden.</p><label>Eigene Messgröße<select data-learning-manual-metric="${readOnly ? "imported" : "local"}">${options(
      keys.map((k) => [k, defs[k].join(" · ")]),
      key,
    )}</select></label>${plot({ kind: "manual", runs: [{ control: filtered, test: [] }] }, key)}<div class="learn-table-wrap"><table><caption>${esc(defs[key].join(" · "))}</caption><thead><tr><th>Tag · Modellzeit</th><th>Eigenes Becken</th></tr></thead><tbody>${filtered.map((s) => `<tr><td>${num(s.day)}</td><td>${key === "health" && s.metricsVersion !== 2 ? "Früherer Tierwert: " : ""}${num(s[key], 4)}</td></tr>`).join("")}</tbody></table></div><p>„—“: unbekannt oder zum Aufnahmezeitpunkt nicht freigegeben. Reale Nullwerte stehen als 0.</p><div class="learn-actions">${button(readOnly ? "imported-manual-csv" : "manual-csv", "Eigene Messreihe als CSV")}${button("manual-chart", "Eigene Messreihe als SVG")}${!readOnly ? button("export", "Messreihe und Notizen als JSON") : ""}</div></section>`;
  }
  function archiveView(population, label) {
    const id = String(archiveRefs.size);
    archiveRefs.set(id, population);
    return `<details data-learning-archive="${id}"><summary>Eltern, Nachkommen und Fortpflanzungserfolg · ${esc(label)}</summary><div data-archive-body></div></details>`;
  }
  function fillArchive(details, generation = null) {
    const p = archiveRefs.get(details.dataset.learningArchive);
    if (!p) return;
    const g = generation ?? p.generation,
      event = p.events.find((e) => e.generation === g),
      individuals = p.archive.filter((i) => i.generation === g),
      h = p.history.find((h) => h.generation === g),
      parentById = new Map(p.archive.map((i) => [i.uid, i]));
    details.querySelector("[data-archive-body]").innerHTML =
      `<label>Archivgeneration<select data-learning-archive-generation>${options(
        p.history.map((h) => [h.generation, "Generation " + h.generation]),
        g,
      )}</select></label><p>AA ${h?.AA ?? "—"}, Aa ${h?.Aa ?? "—"}, aa ${h?.aa ?? "—"}; dunkel ${num((h?.dark ?? NaN) * 100)} %, hell ${num((h?.light ?? NaN) * 100)} %; Allel A ${num((h?.A ?? NaN) * 100)} %.</p>${
        event
          ? `<p>${event.kind === "population" ? "Modellumwelt: " + esc(event.environment) + ". Hypothetisches Elternwahlgewicht ist keine garantierte Nachkommenzahl; AA/Aa desselben Phänotyps erhalten dasselbe Gewicht." : "Gezielte Kreuzung; die Nachkommen stammen aus den angegebenen Eltern."}</p><div class="learn-table-wrap"><table><caption>Tatsächliche Eltern dieser Generation</caption><thead><tr><th>Nr.</th><th>Genotyp</th><th>Phänotyp</th><th>Gewicht</th><th>Nachkommen</th></tr></thead><tbody>${event.parents
              .map((id) => {
                const i = parentById.get(id);
                return `<tr><td>${id}</td><td>${esc(genotypeText(i.loci))}</td><td>${i.phenotype === "gold" ? "hell" : "dunkel"}</td><td>${event.weights ? num(event.weights[id]) : "gezielte Wahl"}</td><td>${event.offspring[id]}</td></tr>`;
              })
              .join("")}</tbody></table></div>`
          : "<p>Gründergeneration: noch keine Fortpflanzungsereignisse.</p>"
      }<div class="learn-table-wrap"><table><caption>${event ? "Tatsächliche Nachkommen" : "Gründer"}</caption><thead><tr><th>Nr.</th><th>Geschlecht</th><th>Eltern</th><th>Genotyp</th><th>Phänotyp</th></tr></thead><tbody>${individuals.map((i) => `<tr><td>${i.uid}</td><td>${i.sex}</td><td>${esc(i.parents.join(" + ") || "Gründer")}</td><td>${esc(genotypeText(i.loci))}</td><td>${i.phenotype === "gold" ? "hell" : "dunkel"}</td></tr>`).join("")}</tbody></table></div><p>Nachkommenzahl zählt die Kinder eines Elternteils; die Summe über beide Geschlechter zählt jedes Kind zweimal. Die Häufigkeiten oben werden aus diesen tatsächlichen Genotypen berechnet.</p>`;
  }

  function selectionView() {
    const p = session.population,
      c = populationCounts(p);
    return (
      panelHeader("Populationen vergleichen", "selection") +
      `<p>Erbliche Varianten sind von Beginn an vorhanden. Zufällige Keimzellen bilden Nachkommen. Zwei gleich große Anfangspopulationen: neutrale Elternwahl und gewählte Modellumwelt.</p><p><strong>Offengelegte Annahme:</strong> In dunkler oder heller Umgebung erhält der passende Phänotyp relatives Elternwahlgewicht 1, der andere 0,5. Das ist eine Hypothese über Tarnung, kein gemessener Molly-Wert. Dominanz allein gibt keinen Vorteil.</p>${tag.mode === "free" ? textArea("question", session.notes.question) : ""}${textArea("hypothesis", session.notes.hypothesis)}${textArea("prediction", session.notes.prediction)}${textArea("plan", session.notes.plan)}<label>Modellumwelt<select data-learning-environment>${options(
        [
          ["neutral", "Neutral · nur Drift"],
          ["dark", "Dunkle Umgebung begünstigt dunklen Phänotyp"],
          ["light", "Helle Umgebung begünstigt hellen Phänotyp"],
        ],
        session.study.environment,
      )}</select></label><div class="learn-two"><label>Generationen<input type="number" data-learning-generations min="1" max="15" value="${session.study.generations || 5}"></label><label>Wiederholungen<input type="number" data-learning-repetitions min="1" max="4" value="${session.study.repetitions || 2}"></label></div>${button("population-compare", "Drift und Modellselektion vergleichen")}<p>Start: Generation ${p.generation}, ${c.n} Individuen; Allel A ${num(c.A * 100, 1)} %, Allel a ${num(c.a * 100, 1)} %. Das Ergebnis verändert keine Allele aus Bedarf. Ein Generationsschritt ersetzt die Elterngeneration und ist keine Zeitangabe für echte Fische.</p>${session.comparison?.kind === "population" ? results(session.comparison) : ""}`
    );
  }
  function material() {
    if (!detailed) return student.material();
    if (tag.grade === 9) return breedingView();
    const s = host.getState(),
      web = buildFoodWeb(s, host.types),
      visible = GRADE_PROFILES[tag.grade].catalog;
    return (
      panelHeader("Beziehungen und Arten", "energy") +
      `<h3>Ausgewählte Nahrungsbeziehungen im Becken</h3><p>Pfeile zeigen Nahrung → Nutzer. Zersetzung, Mineralisierung und Pflanzenaufnahme verbinden organische Reste und Nährstoffe. Lichtenergie fließt hinein; Wärme wird abgegeben.</p><ul>${web.edges
        .slice(0, 18)
        .map(
          (e) =>
            `<li>${esc(web.nodes.find((n) => n.id === e.from)?.name)} → ${esc(web.nodes.find((n) => n.id === e.to)?.name)}<small> ${esc(e.label)}</small></li>`,
        )
        .join(
          "",
        )}</ul><details><summary>Mikroorganismen und Stoffumwandlung</summary><p>Heterotrophe Destruenten zerlegen organische Reste und mineralisieren Nährstoffe. Nitrifizierer oxidieren Stickstoffverbindungen und verbrauchen Sauerstoff. Ein biologischer Filter lässt Stoffe nicht verschwinden.</p></details><h3>Arten für diese Untersuchung</h3><p>Die Auswahl ist bewusst klein. Im Expertenmodus bleibt der vollständige Katalog mit 144 Arten und 181 Produkten erhalten.</p><div class="learn-catalog">${visible
        .filter((id) => host.types[id])
        .map((id) => {
          const d = host.types[id];
          return `<article><strong>${esc(d.name)}</strong><small>${esc(d.latin || "Einrichtung")} · ${d.category === "plant" ? "Produzent" : d.category === "decor" ? "Struktur" : "Konsument"}</small><p>${esc(d.description)}</p><p>${num(d.size, 0)} cm · mindestens ${d.minL} L${d.temp ? " · " + d.temp.join("–") + " °C" : ""}</p>${button("species-" + id, "Artkarte und Einsatz")}</article>`;
        })
        .join("")}</div>`
    );
  }
  function breedingView() {
    if (!detailed) return student.breeding();
    const p = session.population,
      c = populationCounts(p),
      f = p.individuals.filter((i) => i.sex === "♀"),
      m = p.individuals.filter((i) => i.sex === "♂");
    return (
      panelHeader("Vererbung untersuchen", "genotype") +
      `<p>Endliches Zuchtmodell mit denselben Mendel-Funktionen wie die Fische im Aquarium. Modellpopulation: ${c.n} Individuen, Generation ${p.generation}. Die Beckenbewohner bleiben davon getrennt beobachtbar.</p><p>Keine natürliche Entwicklungsdauer: Ein Klick erzeugt eine vollständige Modellgeneration. A ist dominant für dunkle Farbe; aa ist hell. Das ist keine gemessene DNA-Erklärung echter Zuchtformen.</p>${tag.mode === "free" ? textArea("question", session.notes.question) : ""}${textArea("prediction", session.notes.prediction)}<div class="learn-two"><label>Mutter<select data-learning-mother>${options(
        f.map((i) => [
          i.uid,
          "Nr. " +
            i.uid +
            " · " +
            (i.phenotype === "gold" ? "hell" : "dunkel") +
            (showGenes ? " · " + genotypeText(i.loci) : ""),
        ]),
        session.mother || f[0]?.uid,
      )}</select></label><label>Vater<select data-learning-father>${options(
        m.map((i) => [
          i.uid,
          "Nr. " +
            i.uid +
            " · " +
            (i.phenotype === "gold" ? "hell" : "dunkel") +
            (showGenes ? " · " + genotypeText(i.loci) : ""),
        ]),
        session.father ||
          m.find((i) => genotypeText(i.loci) === "aa")?.uid ||
          m[0]?.uid,
      )}</select></label></div><div class="learn-actions">${button("genes", showGenes ? "Genotypen ausblenden" : "Modellgenotypen zeigen")}${button("cross", "Nachkommen erzeugen")}${button("punnett", "Punnett-Vorhersage prüfen")}</div><p>Vor der ersten Kreuzung eine eigene Vorhersage notieren. Für F1 wähle AA × aa; für F2 zwei F1-Individuen. Erwartete Anteile sind Wahrscheinlichkeiten.</p>${session.punnett && session.notes.prediction ? `<details open><summary>Punnett-Quadrat zur letzten geprüften Elternwahl</summary><div class="learn-table-wrap"><table><thead><tr><th>Keimzellen</th>${session.punnett.columns.map((g) => `<th>${Object.values(g.alleles).join("")}</th>`).join("")}</tr></thead><tbody>${session.punnett.cells.map((row, r) => `<tr><th>${Object.values(session.punnett.rows[r].alleles).join("")}</th>${row.map((cell) => `<td>${esc(cell.genotype)} · ${num(cell.probability * 100)} %</td>`).join("")}</tr>`).join("")}</tbody></table></div><p>Zellen: gemeinsame Wahrscheinlichkeiten. Wiederholte Allele können dieselbe Merkmalsausprägung ergeben.</p></details>` : ""}<h3>Individuen und gezählte Häufigkeiten</h3><p>AA ${c.AA}, Aa ${c.Aa}, aa ${c.aa} · dunkel ${num(c.dark * 100)} % · hell ${num(c.light * 100)} % · Allel A ${num(c.A * 100)} %.</p><div class="learn-population">${p.individuals.map((i) => `<div class="${i.phenotype === "gold" ? "gold" : "dark"}"><strong>Nr. ${i.uid} ${i.sex}</strong><span>${showGenes ? genotypeText(i.loci) : i.phenotype === "gold" ? "hell" : "dunkel"}</span><small>${i.parents.length ? "Eltern " + i.parents.join(" + ") : "Gründer"}</small></div>`).join("")}</div><details><summary>Generationen und Fortpflanzungserfolg</summary><div class="learn-table-wrap"><table><thead><tr><th>Generation</th><th>AA</th><th>Aa</th><th>aa</th><th>Allel A</th></tr></thead><tbody>${p.history.map((h) => `<tr><td>${h.generation}</td><td>${h.AA}</td><td>${h.Aa}</td><td>${h.aa}</td><td>${num(h.A * 100)} %</td></tr>`).join("")}</tbody></table></div>${p.events
        .slice(-3)
        .map(
          (e) =>
            `<p>Generation ${e.generation}: ${Object.entries(e.offspring)
              .map(([id, n]) => "Nr. " + id + ": " + n + " Nachkommen")
              .join("; ")}</p>`,
        )
        .join(
          "",
        )}</details><p>Eltern-Kind-Beziehungen sind ein Familienarchiv. Ein Artenstammbaum rekonstruiert dagegen gemeinsame Vorfahren verschiedener Arten.</p>${tools().includes("selection") ? button("investigate", "Populationen und Selektion vergleichen") : ""}${archiveView(p, "aktueller Zuchtversuch")}<h3>Mendelversuch wiederholen</h3><p>Startseed: ${p.initialSeed ?? "im Altbestand nicht dokumentiert"}. Dieselbe Ausgangsgenetik bleibt erhalten. Gleicher Seed und gleiche Elternwahl reproduzieren dieselben Ziehungen; ein neuer Seed beginnt eine neue Stichprobe, ohne ein Verhältnis zu erzwingen.</p><label>Dokumentierter Startseed<input type="number" data-learning-seed min="0" max="4294967295" step="1" value="${p.initialSeed ?? 47291}"></label><div class="learn-actions">${button("population-reset", "Gleichen Seed reproduzieren (Sicherung bleibt)")}${button("population-new", "Neue unabhängige Wiederholung")}${button("population-seed", "Mit eingegebenem Seed beginnen")}</div><details><summary>Bisherige Wiederholungen</summary>${(session.populationRepeats || []).map((r) => `<p>Seed ${r.seed}: Generation ${r.final.generation}, AA ${r.final.AA}, Aa ${r.final.Aa}, aa ${r.final.aa}.</p>`).join("")}</details>`
    );
  }
  function missionInfo() {
    if (!detailed)
      return (
        panelHeader(
          tag.mode === "free" ? "Freies Forschen" : "Questbuch",
          tag.mode === "free" ? "free" : "quest",
        ) +
        (tag.mode === "free"
          ? "<p>Wähle deine eigene Frage. Probiere sie aus.</p>"
          : student.quest(true))
      );
    const m = mission();
    return (
      panelHeader(m ? "Meine Lernmission" : "Freies Forschen", "model") +
      `<p>${esc(m?.question || GRADE_PROFILES[tag.grade].question)}</p><h3>Dein Erkenntnisziel</h3><p>${esc(m?.goal || "Entwickle eine eigene prüfbare Frage und untersuche sie mit einem passenden Vergleich. Begründe deine Erklärung mit Daten.")}</p>${m && SUPPORT[teacher.support].steps ? "<ol>" + m.path.map((x) => "<li>" + esc(x) + "</li>").join("") + "</ol>" : ""}<p>${esc(m?.limits || "Begründe, was dein Versuch im Modell zeigt und welche Beobachtung in der Natur noch nötig wäre.")}</p>${m?.transfer ? transfer(m.transfer) : ""}<details><summary>Curriculum und Modellklärung</summary><p>${esc(m?.curriculum || CURRICULUM.pages)} · ${esc(CURRICULUM.title)}</p><p>${esc(m?.misconception || "Eine stabile Simulation beweist noch keine Erklärung.")}</p><p>${esc(CURRICULUM.scope)}</p><a href="${CURRICULUM.url}" target="_blank" rel="noopener">Originalcurriculum</a></details>${button("notebook", "Eigene Erklärung festhalten")}`
    );
  }
  function transfer(key, withNotes = true) {
    const t = TRANSFER[key];
    return `<section class="learn-transfer"><h3>${esc(t.title)}</h3>${t.facts.map((f) => "<p>" + esc(f) + "</p>").join("")}<ol>${t.tasks.map((f) => "<li>" + esc(f) + "</li>").join("")}</ol>${t.consolidation ? `<h4>Fachliche Sicherung</h4><p>${esc(t.consolidation)}</p>` : ""}${t.limits ? `<h4>Grenzen dieser Übertragung</h4><p>${esc(t.limits)}</p>` : ""}<details><summary>Quellen zum Prüfen und Weiterforschen</summary><ul>${t.sources.map(([label, url]) => `<li><a href="${url}" target="_blank" rel="noopener">${esc(label)}</a></li>`).join("")}</ul><small>Amtliche bzw. institutionelle Quellen. Externe Inhalte sind keine Simulationsdaten; notiere die genaue Fundstelle. Die hier genannten externen Webinhalte wurden nicht live abgerufen; die Schulcurriculum-PDF wurde im Original geprüft.</small></details>${session && withNotes ? textArea("transfer", session.notes.transfer) : ""}</section>`;
  }
  function glossary() {
    if (!detailed) return student.glossary();
    return (
      panelHeader("Glossar") +
      `<p>Kurze Hilfen zum Begriff und zur Untersuchung. Sie geben dir keine fertige Versuchslösung.</p>${Object.entries(
        HELP,
      )
        .map(
          ([k, h]) =>
            `<details><summary>${esc(h.term)}</summary><p>${esc(h[tag?.grade || grade || teacher.grade])}</p></details>`,
        )
        .join("")}`
    );
  }
  function display() {
    return (
      panelHeader("Darstellung") +
      `<p>Wähle eine Darstellung, die auf deinem Gerät flüssig läuft.</p><label>Grafikprofil<select data-learning-graphics>${options(
        host.profiles.map((p) => [p.id, p.label]),
        host.graphics().id,
      )}</select></label><p>Für Tablets gibt es die Einstellung iPad.</p>`
    );
  }
  function teacherData(comp) {
    const defs = comparisonMetricDefinitions(comp),
      keys = Object.keys(defs),
      key = keys.includes(importedMetric) ? importedMetric : keys[0];
    return `<section class="learn-teacher-comparison"><h3>Datenbezug prüfen</h3>${runMetadata(comp)}<label>Untersuchte Messgröße<select data-learning-imported-metric>${options(
      keys.map((k) => [k, defs[k].join(" · ")]),
      key,
    )}</select></label>${plot(comp, key)}${button("imported-csv", "Alle importierten Messreihen als CSV")}${runTables(comp, key)}</section>`;
  }

  function teacherView() {
    const savedKeys = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k.startsWith("aquarium-learning-notes-v1:")) savedKeys.push(k);
      }
    } catch {}
    return (
      panelHeader("Unterricht vorbereiten") +
      `<p>Offline auf diesem Gerät, ohne Anmeldung. Einstellungen ändern Hilfen und sichtbare Werkzeuge, niemals die biologischen Regeln. Nicht als Zugriffsschutz für Prüfungen gedacht.</p><label>Klasse<select data-teacher="grade">${options(
        Object.entries(GRADE_PROFILES).map(([g, p]) => [
          g,
          "Klasse " + g + " · " + p.title,
        ]),
        teacher.grade,
      )}</select></label><label>Lernmission<select data-teacher="mission">${options(
        MISSIONS.filter((m) => m.grade === teacher.grade).map((m) => [
          m.id,
          m.title,
        ]),
        teacher.mission,
      )}</select></label><label>Unterstützung<select data-teacher="support">${options(
        Object.entries(SUPPORT).map(([id, s]) => [id, s.label]),
        teacher.support,
      )}</select></label><label class="learn-check"><input type="checkbox" data-teacher="help" ${teacher.help ? "checked" : ""}> Kontexthilfen und Glossar anbieten</label><details><summary>Zusätzliche Werkzeuge bewusst freischalten</summary>${Object.entries(
        LEARNING_TOOLS,
      )
        .map(
          ([k, d]) =>
            `<label class="learn-check"><input type="checkbox" data-teacher-tool="${k}" ${teacher.unlockTools.includes(k) ? "checked" : ""}>${esc(d.label)}</label>`,
        )
        .join(
          "",
        )}</details><details><summary>Zusätzliche Messgrößen freischalten</summary>${Object.entries(
        LEARNING_METRICS,
      )
        .map(
          ([k, d]) =>
            `<label class="learn-check"><input type="checkbox" data-teacher-metric="${k}" ${teacher.unlockMetrics.includes(k) ? "checked" : ""}>${esc(d[0])} (${d[1]})</label>`,
        )
        .join(
          "",
        )}</details><div class="learn-actions">${button("student-launch", "Schüleransicht starten")}${button("teacher-launch", "Technische Untersuchung öffnen")}${button("teacher-free", "Freies Forschen technisch öffnen")}${button("config-export", "Konfiguration exportieren")}<label class="learn-file">Konfiguration importieren<input type="file" data-learning-import="config" accept=".json,application/json"></label></div><h3>Lernprodukte auf diesem Gerät</h3><p>Beurteile Frage und Hypothese, Kontrolle, Datenbezug, Erklärung und Modellkritik. Keine automatische Note aus Tierkondition.</p>${
        savedKeys.length
          ? savedKeys
              .map((key, i) => {
                const item = loadJSON(key, {}),
                  parts = key.split(":");
                return `<button data-learning-product="${esc(key)}">${esc(parts.at(-2))} · ${esc(parts.at(-1))} · ${Object.values(item.notes || {}).filter(Boolean).length} Texte</button>`;
              })
              .join("")
          : "<p>Noch keine lokalen Lernprodukte.</p>"
      }<label class="learn-file">Exportiertes Lernprodukt lesen<input type="file" data-learning-import="product" accept=".json,application/json"></label>${
        imported
          ? `<section class="learn-imported-product"><h3>Lernprodukt Klasse ${imported.profile.grade}</h3><p>${esc(imported.profile.mission || "Freies Forschen")} · Unterstützung: ${esc(SUPPORT[imported.support]?.label || "nicht dokumentiert")} · ${esc(imported.created || "Exportdatum nicht dokumentiert")}</p><p>Modellstand: ${esc(imported.modelVersion || "Altbestand – nicht dokumentiert")}. ${esc(imported.model?.title || "")}</p><p>Die folgenden Planungsnotizen sind der aktuelle Bearbeitungsstand. Die vor der Berechnung festgehaltene Planung steht getrennt beim jeweiligen Lauf.</p>${imported.currentPlan && imported.comparison && !planMatchesComparison(imported.comparison, imported.currentPlan) ? `<p class="learn-outdated">Der Plan wurde nach dem gezeigten Lauf geändert. Die Daten gehören zur festgehaltenen älteren Laufkonfiguration.</p>` : ""}${imported.currentPlan?.incomplete ? `<p class="learn-outdated">Der neue Plan enthält unvollständige oder ungültige Einstellungen. Er wurde nicht berechnet; vorhandene Messdaten bleiben lesbar.</p>` : ""}${Object.entries(
              imported.notes,
            )
              .map(
                ([k, v]) =>
                  `<h4>${esc(k)} · ${esc(ORIGIN_LABELS[imported.provenance?.notes?.[k] || "unknown"])}</h4><p class="learn-pre">${esc(v || "Noch kein Eintrag.")}</p>`,
              )
              .join("")}${
              imported.earlierNotes
                ? `<h3>Frühere Notizen vor dem Questbuch</h3>${Object.entries(
                    imported.earlierNotes,
                  )
                    .map(
                      ([k, v]) =>
                        `<h4>${esc(noteFields[k] || k)}</h4><p>${esc(v)}</p>`,
                    )
                    .join("")}`
                : ""
            }${imported.gameExplanation ? `<h4>Spielerklärung</h4><p>${esc(imported.gameExplanation)}</p>` : ""}${imported.provenance?.legacy ? "<p>Altprodukt: Urheberschaft vorhandener Texte ist nicht dokumentiert. Sie gelten nicht automatisch als selbst formulierte Schülerleistung.</p>" : ""}${imported.earlierQuest ? `<details><summary>Früheres Questbuch · Anforderungen vor der Überarbeitung</summary><p>${imported.earlierQuest.step} von 5 damaligen Schritten. Originaleinträge bleiben im JSON erhalten.</p></details>` : ""}${imported.quest ? `<h3>Questbuch${imported.quest.version === 1 ? " · historischer Anforderungsstand" : ""}</h3><p>${imported.quest.step} von 5 Aufgaben</p>${imported.quest.entries.map((e) => `<p>${e.answer ? "Auswahl" : "Spielhandlung"} · ${esc(e.question || e.event)}: ${esc(e.answer || "Tatsächlich ausgeführter Eingriff")}</p>`).join("")}` : ""}${imported.comparisonHistory?.length ? `<details class="learn-comparison-history"><summary>Frühere Versuchsreihen (${imported.comparisonHistory.length})</summary>${imported.comparisonHistory.map(c=>`<p>${esc(c.kind)} · ${esc(c.environment || c.tool)} · ${c.runs.length} Wiederholungen · Ausgangslage ${esc(c.configuration?.baseline.fingerprint || "nicht dokumentiert")}</p><p>Seeds ${c.runs.map(r=>r.seed).join(", ")}. Vollständige tatsächliche Messreihen und Archive sind im JSON erhalten.</p>`).join("")}</details>` : ""}${imported.quest?.activities?.length ? `<h4>Bearbeitete Lernhandlungen</h4>${imported.quest.activities.map(a=>`<p>${a.kind === "assignment" ? "Auswahl/Zuordnung" : "Spielhandlung"} · ${esc(a.id)}: ${esc(a.from || "")} ${esc(a.to || "Messwerte angesehen")}</p>`).join("")}` : ""}${imported.comparison ? teacherData(imported.comparison) : ""}${manualData(imported, true)}${imported.population ? `<h3>Separater Zuchtversuch</h3><p>Startseed ${imported.population.initialSeed ?? "nicht dokumentiert"}; aktueller Zufallszustand ${imported.population.seed}. Dieses Archiv ersetzt nicht die Archive der Kontroll-/Selektionsläufe.</p>${archiveView(imported.population, "separater Mendelversuch")}` : ""}${imported.populationRepeats?.length ? `<h4>Dokumentierte Wiederholungen</h4>${imported.populationRepeats.map((r) => `<p>Seed ${r.seed}: AA ${r.final.AA}, Aa ${r.final.Aa}, aa ${r.final.aa}.</p>`).join("")}` : ""}</section>`
          : ""
      }<details><summary>Alle Missionshintergründe und Modellgrenzen</summary>${MISSIONS.map((m) => `<h3>${esc(m.title)}</h3><p>${esc(m.goal)}</p><p>${esc(m.curriculum)}</p><p>${esc(m.limits)}</p>${m.transfer ? transfer(m.transfer, false) : ""}`).join("")}</details>${archivedAttempts()}<h3>Versuche verwalten</h3><p>Ein Neustart sichert den bisherigen lokalen Stand. Exporte bleiben auf deinem Gerät.</p>${button("teacher-reset", "Ausgewählte Mission neu beginnen")}${button("teacher-restore", "Gesicherte Mission wiederherstellen")}<details><summary>Fachliche und curriculare Grundlage</summary><p>${CURRICULUM.title}, ${CURRICULUM.pages}; Original-PDF am 20.10.2026 abgeglichen. Die Simulation deckt ausgewählte Einheiten ab, nicht alle Inhalte der Klassen.</p><p>Gesundheit, Biomasse und Belastung sind Modellgrößen. Kohlenstoff nur qualitativ; Selektion nutzt offengelegte hypothetische Gewichte.</p></details>`
    );
  }
  function render() {
    archiveRefs.clear();
    document.documentElement.classList.toggle("learning-coherent",isPrototype());
    document.documentElement.classList.toggle("learning-history-view",screen === "active" && panel === "saved-view");
    const learner = screen !== "expert";
    document.documentElement.classList.toggle("learning-mode", learner);
    document.documentElement.classList.toggle(
      "learning-home",
      learner && screen !== "active",
    );
    root.hidden = !learner;
    if (!learner) {
      tankViews.dispose();
      host.interactive(!host.isHome());
      host.sceneInert(host.isHome());
      host.layout(false);
      return;
    }
    const active = screen === "active";
    document.documentElement.classList.toggle("learning-coherent",isPrototype());
    document.documentElement.classList.toggle("learning-history-view",active && panel === "saved-view");
    if (isPrototype() && !["more","notebook","teacher","display","restart-attempt"].includes(panel)) {
      const openDetails=[...root.querySelectorAll("details[open] > summary")].map(s=>s.textContent);
      const scrolls=[".coherent-views",".coherent-notebook"].map(selector=>({selector,top:root.querySelector(selector)?.scrollTop || 0}));
      const active=document.activeElement,focusAttribute=active?.getAttributeNames?.().find(a=>a.startsWith("data-") && !a.startsWith("data-view"));
      const v = temperatureView(session,host,LEARNING_MODEL_REVISION);
      const panelBody = panel === "observe" ? `<section class="coherent-note"><h3>Schau auf Fisch und Wasser ${helpButton("observe")}</h3><p>Wähle sie direkt am Becken. Die beiden Temperaturanzeigen gehören zum gleichen Zeitpunkt.</p>${button("close","Zur Aufgabe")}</section>` : "";
      root.innerHTML = temperatureWorkspace({session,view:v,quest:student.quest(true),esc,button,helpButton,types:host.types,playing:!!playback,results:v.mode === "result" ? student.results() : "",panelBody});
      for (const summary of root.querySelectorAll("details > summary")) if (openDetails.includes(summary.textContent)) summary.parentElement.open=true;
      for (const {selector,top} of scrolls) root.querySelector(selector).scrollTop=top;
      if(focusAttribute) [...root.querySelectorAll(`[${focusAttribute}]`)].find(e=>e.getAttribute(focusAttribute)===active.getAttribute(focusAttribute))?.focus({preventScroll:true});
      if (helpKey) root.innerHTML += `<section class="learn-help-pop" role="dialog" aria-modal="true" aria-label="Begriffshilfe"><h2>${esc(HELP[helpKey].term)}</h2><p>${esc(HELP[helpKey][8])}</p>${button("help-close","Hilfe schließen")}</section>`;
      root.querySelector(".coherent-workspace")?.toggleAttribute("inert",!!helpKey);
      host.layout(false); host.sceneInert(true); host.interactive(false);
      tankViews.update(root,v.sides,(side,uid)=>pickObject(side,uid),session.prototypeSelection);
      return;
    }
    tankViews.dispose();
    const view =
      panel === "observe"
        ? observe
        : panel === "investigate"
          ? investigation
          : panel === "notebook"
            ? notebook
            : panel === "material"
              ? material
              : panel === "mission-info"
                ? missionInfo
                : panel === "glossary"
                  ? glossary
                  : panel === "display"
                    ? display
                    : panel === "teacher"
                      ? teacherView
                      : panel === "more"
                        ? student.more
                        : panel === "restart-attempt"
                          ? () => panelHeader("Noch einmal")+`<p>Dein bisheriger Durchgang bleibt unter „Frühere Durchgänge“ erhalten. Für neue Aufgaben brauchst du neue Beobachtungen.</p>${button("repeat-attempt","Mit gleichen Bedingungen wiederholen")}${button("new-attempt","Mit frischem Startbecken beginnen")}${button("close","Fortsetzen")}`
                        : panel === "saved-view"
                          ? savedView
                        : null;
    const body = view ? view() : "";
    const panelBody =
      active &&
      !detailed &&
      tag.mode === "missions" &&
      !["mission-info", "teacher", "more"].includes(panel)
        ? body.replace("</header>", "</header>" + student.quest(true))
        : body;
    root.innerHTML =
      (active
        ? hud()
        : screen === "home"
          ? gradeHome()
          : screen === "grade"
            ? modeHome()
            : gradeHome()) +
      (view
        ? `<section class="learn-panel ${panel === "teacher" ? "learn-teacher" : ""}" role="dialog" aria-modal="${!active}" aria-label="${panel === "teacher" ? "Lehrkraftmodus" : "Lernwerkzeug"}">${panelBody}</section>`
        : "") +
      (helpKey
        ? `<section class="learn-help-pop" role="dialog" aria-modal="true" aria-label="Begriffshilfe"><h2>${esc(HELP[helpKey].term)}</h2><p>${esc(HELP[helpKey][tag?.grade || grade || teacher.grade])}</p>${button("help-close", "Hilfe schließen")}</section>`
        : "");
    root.querySelector(".learn-welcome")?.toggleAttribute("inert", !!panel);
    if (helpKey) {
      root.querySelector(".learn-panel")?.setAttribute("inert", "");
      root.querySelector(".learn-hud")?.setAttribute("inert", "");
      root.querySelector(".learn-tools")?.setAttribute("inert", "");
      root.querySelector(".learn-quest")?.setAttribute("inert", "");
      root.querySelector(".learn-quest-chip")?.setAttribute("inert", "");
    }
    if (!teacher.help)
      root.querySelectorAll("[data-learn-help]").forEach((b) => b.remove());
    host.sceneInert(!active || !!panel || !!helpKey);
    host.layout(active && !!panel);
  }
  function requirePlan(predictionOnly = false) {
    if (!detailed) {
      if (session.quest && session.quest.step < 2) {
        host.notify("Wähle zuerst deine Vermutung im Questbuch.");
        return false;
      }
      return true;
    }
    const ok =
      (tag.mode !== "free" || session.notes.question?.trim()) &&
      (predictionOnly
        ? session.notes.prediction?.trim()
        : session.notes.hypothesis?.trim() &&
          session.notes.prediction?.trim() &&
          session.notes.plan?.trim());
    if (!ok) {
      host.notify(
        predictionOnly
          ? "Notiere zuerst deine eigene Vorhersage und im freien Forschen deine Frage."
          : "Notiere zuerst Hypothese, Vorhersage und Plan; im freien Forschen auch deine eigene Frage.",
      );
      root
        .querySelector(
          '[data-learning-note="' +
            (predictionOnly ? "prediction" : "hypothesis") +
            '"]',
        )
        ?.focus();
      return false;
    }
    return true;
  }
  function rememberBackup() {
    if (tag) {
      persist();
      saveJSON(learningSlot(tag) + ":previous", {
        tank: host.getState(),
        session,
      });
    }
  }
  mountDials(root);
  root.addEventListener("input", (e) => {
    if (e.target.dataset.learningNote) {
      session.notes[e.target.dataset.learningNote] = e.target.value;
      (session.noteOrigins ??= {})[e.target.dataset.learningNote] = "own-input";
      persist();
      refreshResultNotice();
    }
    const numeric = {
      "data-learning-value": "value",
      "data-learning-days": "days",
      "data-learning-repetitions": "repetitions",
      "data-learning-generations": "generations",
    };
    for (const [attr, key] of Object.entries(numeric))
      if (e.target.hasAttribute(attr)) {
        session.study[key] = controlNumber(e.target.value);
        if (key === "value") {
          session.study.drafts ??= {};
          session.study.drafts[session.study.tool] = e.target.value;
        }
        persist();
        refreshResultNotice();
      }
  });
  root.addEventListener("change", async (e) => {
    const t = e.target,
      d = t.dataset;
    try {
      if (t.hasAttribute("data-coherent-time")) {stopPlayback();showTime(Number(t.value));return;}
      if (d.learningTool) {
        selectTool(t.value);
        persist();
        render();
      }
      if (t.hasAttribute("data-learning-days"))
        session.study.days = Number(t.value);
      if (t.hasAttribute("data-learning-repetitions"))
        session.study.repetitions = Number(t.value);
      if (t.hasAttribute("data-learning-generations"))
        session.study.generations = Number(t.value);
      if (t.hasAttribute("data-learning-environment"))
        session.study.environment = t.value;
      if (t.hasAttribute("data-learning-series")) {stopPlayback();session.study.series=Number(t.value);delete session.view;selectComparisonView(session);persist();render();}
      if (t.hasAttribute("data-learning-run")) {stopPlayback();session.study.run=Number(t.value);delete session.view;selectComparisonView(session);persist();render();}
      if (t.hasAttribute("data-learning-metric")) {
        session.study.metric = t.value;
        persist();
        render();
      }
      if (t.hasAttribute("data-learning-mother"))
        session.mother = Number(t.value);
      if (t.hasAttribute("data-learning-father"))
        session.father = Number(t.value);
      if (t.hasAttribute("data-learning-graphics")) {
        host.setGraphics(t.value);
        render();
      }
      if (d.teacher) {
        teacher[d.teacher] =
          t.type === "checkbox"
            ? t.checked
            : d.teacher === "grade"
              ? Number(t.value)
              : t.value;
        if (d.teacher === "grade")
          teacher.mission = MISSIONS.find((m) => m.grade === teacher.grade).id;
        teacher = normalizeTeacher(teacher);
        saveJSON("aquarium-teacher-v1", teacher);
        render();
      }
      for (const [attr, key] of [
        ["teacherTool", "unlockTools"],
        ["teacherMetric", "unlockMetrics"],
      ])
        if (d[attr]) {
          teacher[key] = t.checked
            ? [...new Set([...teacher[key], d[attr]])]
            : teacher[key].filter((k) => k !== d[attr]);
          saveJSON("aquarium-teacher-v1", teacher);
        }
      if (t.hasAttribute("data-learning-imported-metric")) {
        importedMetric = t.value;
        render();
      }
      if (t.hasAttribute("data-learning-manual-metric")) {
        if (t.dataset.learningManualMetric === "imported")
          importedManualMetric = t.value;
        else manualMetric = t.value;
        render();
      }
      if (t.hasAttribute("data-learning-archive-generation"))
        fillArchive(t.closest("details"), Number(t.value));
      if (
        session &&
        [
          "data-learning-days",
          "data-learning-repetitions",
          "data-learning-generations",
          "data-learning-environment",
        ].some((a) => t.hasAttribute(a))
      ) {
        persist();
        refreshResultNotice();
      }
      if (d.learningImport) {
        const file = t.files[0];
        if (!file) return;
        if (file.size > 32 * 1024 * 1024)
          throw new Error("Die Datei ist zu groß.");
        const raw = JSON.parse(await file.text());
        if (d.learningImport === "config") {
          teacher = normalizeTeacher(raw);
          saveJSON("aquarium-teacher-v1", teacher);
        } else imported = validateLearningProduct(raw);
        render();
      }
    } catch (error) {
      host.notify(error.message);
    }
  });
  root.addEventListener(
    "toggle",
    (e) => {
      const d = e.target;
      if (d.matches?.("details[data-learning-archive]") && d.open)
        fillArchive(d);
    },
    true,
  );
  root.addEventListener("click", (e) => {
    const t = e.target.closest("button");
    if (!t) return;
    const d = t.dataset;
    try {
      if (d.coherentPick) {pickObject(d.coherentPick,d.coherentUid);return;}
      if (d.coherentWater) {pickObject(d.coherentWater,null,true);return;}
      if (d.learningArchivedProduct) {
        const prior = loadJSON(d.learningArchivedProduct,null);
        imported = validateLearningProduct(prior.product);showPanel("teacher");return;
      }
      if (d.learningToolChoice) {
        selectTool(d.learningToolChoice); persist(); render();
        root.querySelector(`[data-learning-tool-choice="${d.learningToolChoice}"]`)?.focus();
        return;
      }
      if (d.activityId) {
        if (isPrototype() && ["living","water"].includes(d.activityId)) {
          const picked=session.prototypeSelection;
          const v=temperatureView(session,host,LEARNING_MODEL_REVISION), entity=v.sides[picked?.side]?.state?.entities.find(e=>e.uid===picked.uid);
          if (!picked || (d.activityId === "water" ? !picked.water : host.types[entity?.species]?.category !== "fish")) {
            session.quest.feedback = d.activityId === "water" ? "Wähle zuerst „Wasser ansehen“ am Becken." : "Tippe zuerst auf einen Fisch oder wähle „Fisch zeigen“.";
            session.quest.feedbackKind="neutral";persist();render();return;
          }
        }
        const accepted = assignActivity(session.quest,d.activityId,Number(d.activityChoice));
        session.quest.feedbackKind = accepted ? "success" : "error";
        if (accepted && isPrototype()) session.quest.activities.at(-1).object = structuredClone(session.prototypeSelection);
        const q=session.quest;
        if (q.id === "10-wadden" && q.step === 2 && !pendingActivity(q,2)) {
          const choice=q.activities.find(a=>a.id==="harbour-interest");
          questEvent(q,"case",{result:{kind:"case",measure:choice.to,source:REGIONAL_CASES[q.id].source,consequences:q.activities.filter(a=>["harbour-benefit","harbour-effort"].includes(a.id))}});
        }
        persist();render();root.querySelector(".learn-activity h3,.learn-quest h2")?.focus();return;
      }
      if (d.activityView) {
        const q=session.quest,a=pendingActivity(q);
        if (d.activityView === "traits") {showPanel("material");return;}
        if (d.activityView === "observe") {showPanel("observe");return;}
        const c=session.comparison;
        if (!c || !planMatchesComparison(c,currentPlan(c.kind))) throw new Error("Starte zuerst den passenden Versuch neu.");
        const v=resolveComparisonView(session),rows=v.rows,row=d.activityView === "early" ? rows[1] : rows.at(-1);
        if (!row || !a) return;
        selectComparisonView(session,{time:row.time});
        const evidence={configuration:structuredClone(v.comparison.configuration),context:resolveComparisonView(session).context,time:row.time,control:row.control || null,test:row.test || null};
        recordActivityView(q,a.id,evidence);
        session.inspection = evidence;
        session.study.metric=["early","late"].includes(d.activityView) ? "fishAlive" : d.activityView;
        persist();showPanel("investigate");return;
      }
      if (d.questAnswer !== undefined) {
        const old = session.quest.step;
        if ([3, 4].includes(old) && ["ecology", "population"].includes(QUESTS[session.quest.id].experiment.kind) &&
            (!session.comparison || !planMatchesComparison(session.comparison, currentPlan(session.comparison.kind)) ||
             !planMatchesComparison(session.quest.result, currentPlan(session.comparison.kind))))
          throw new Error("Der Versuch wurde geändert. Starte ihn erneut, bevor du diese Ergebnisse vergleichst.");
        if (isPrototype() && old === 3 && resolveComparisonView(session)?.comparison !== session.comparison)
          throw new Error("Du betrachtest eine frühere Reihe. Wähle für diese Frage deinen aktuellen Versuch.");
        if (answerQuest(session.quest, Number(d.questAnswer), inspectedQuestResult())) {
          if (old === 3) session.quest.entries.at(-1).viewContext = resolveComparisonView(session)?.context || null;
          // Selected answers stay in the questbook; game text never becomes a learner note.
        }
        persist();
        render();
        root.querySelector(".learn-quest-inline h2,.learn-quest h2")?.focus();
        return;
      }
      if (d.learningIndividual) {
        questEvent(session.quest, "observe");
        const i = session.population.individuals.find(
          (x) => x.uid === Number(d.learningIndividual),
        );
        if (!showGenes && session.quest) {
          (session.quest.visibleIndividuals ??= {})[i.uid]=i.phenotype;
          recordActivityView(session.quest,"visible-traits",{uids:Object.keys(session.quest.visibleIndividuals),phenotypes:Object.values(session.quest.visibleIndividuals),beforeGenes:true});
        }
        persist();
        root.querySelector("[data-individual-detail]").textContent =
          `Fisch ${i.uid}: ${i.phenotype === "gold" ? "hell" : "dunkel"}${showGenes ? " · " + genotypeText(i.loci) : ""}`;
        return;
      }
      if (d.learnGrade) {
        grade = Number(d.learnGrade);
        screen = "grade";
        homeMode = null;
        render();
        return;
      }
      if (d.learnMission) {
        start("missions", d.learnMission);
        return;
      }
      if (d.learnHelp) {
        helpKey = d.learnHelp;
        host.interactive(false);
        render();
        root.querySelector(".learn-help-pop button")?.focus();
        return;
      }
      if (d.learningProduct) {
        const x = loadJSON(d.learningProduct, null);
        if (x) {
          const suffix = d.learningProduct.replace(
              "aquarium-learning-notes-v1:",
              "",
            ),
            tank = loadJSON(suffix, null);
          if (tank?.learning)
            imported = validateLearningProduct({
              ...x,
              version: 2,
              type: "aquarium-learning-product",
              profile: tank.learning,
              provenance: x.noteOrigins ? learningProvenance(x) : null,
              model: CURRICULUM,
              measurementMetrics: recordedMetrics(
                x.measurements || [],
                learningMetrics(tank.learning),
              ),
              quest: x.quest || null,
              earlierNotes: x.earlierNotes || null,
              currentPlan:
                x.baseline &&
                x.study &&
                (tank.learning.grade !== 9 || x.population)
                  ? snapshotLearningPlan({
                      kind:
                        tank.learning.grade === 9 ? "population" : "ecology",
                      baseline: x.baseline,
                      population: x.population,
                      study: x.study,
                      profile: tank.learning,
              provenance: x.noteOrigins ? learningProvenance(x) : null,
                      notes: x.notes,
                      metrics:
                        x.comparison?.configuration?.metrics ||
                        learningMetrics(tank.learning),
                    })
                  : null,
            });
        }
        render();
        return;
      }
      const a = d.learn;
      if (!a) return;
      if (a === "workspace-play") {playWorkspace();render();return;}
      if (a === "workspace-pause") {stopPlayback();render();return;}
      if (a === "workspace-plan") {stopPlayback();session.view={mode:"plan"};persist();render();return;}
      if (a === "quest-hint") {session.quest.showHint=!session.quest.showHint;persist();render();return;}
      if (a.startsWith("device-")) {openDevice(a.slice(7));return;}
      if (
        [
          "observe",
          "investigate",
          "notebook",
          "material",
          "mission-info",
          "glossary",
          "display",
          "more",
        ].includes(a)
      ) {
        showPanel(a);
        return;
      }
      if (a === "quest-toggle" && panel) {
        showPanel("mission-info");
        return;
      }
      if (a === "quest-toggle") {
        session.quest.collapsed = !session.quest.collapsed;
        persist();
        render();
        return;
      }
      if (a === "quest-open") {
        session.quest.collapsed = false;
        closePanel();
        return;
      }
      if (a === "quest-restart") {
        stopPlayback();showPanel("restart-attempt");
        return;
      }
      if (a === "repeat-attempt" || a === "new-attempt") {restartAttempt(a === "repeat-attempt");return;}
      if (a === "student-launch") {
        grade = teacher.grade;
        start("missions", teacher.mission);
        return;
      }
      if (a === "close") {
        closePanel();
        return;
      }
      if (a === "help-close") {
        closeHelp();
        return;
      }
      if (a === "home") {
        setScreen("home");
        tag = null;
        session = null;
        grade = null;
        return;
      }
      if (a === "back") {
        screen = "home";
        grade = null;
        homeMode = null;
        render();
        return;
      }
      if (a === "missions") {
        homeMode = "missions";
        render();
        return;
      }
      if (a === "free") {
        start("free");
        return;
      }
      if (a === "expert") {
        setScreen("expert");
        host.home();
        return;
      }
      if (a === "teacher") {
        showPanel("teacher");
        return;
      }
      if (a === "teacher-reset" || a === "teacher-restore") {
        const prepared = {
          version: 1,
          grade: teacher.grade,
          mode: "missions",
          mission: teacher.mission,
        };
        const slot = learningSlot(prepared),
          notesKey = "aquarium-learning-notes-v1:" + slot;
        if (a === "teacher-restore") {
          const previous = loadJSON(slot + ":previous", null);
          if (!previous?.tank || !previous?.session)
            throw new Error(
              "Für diese Mission liegt keine vollständige Sicherung vor.",
            );
          const tank = host.normalize(previous.tank);
          if (learningSlot(tank.learning) !== slot)
            throw new Error("Die Sicherung gehört zu einer anderen Mission.");
          if (!saveJSON(slot, tank) || !saveJSON(notesKey, previous.session))
            throw new Error(
              "Wiederherstellung konnte nicht vollständig gespeichert werden.",
            );
          host.open(tank);
          host.notify(
            "Gesicherte Mission einschließlich Notizen und Vergleich wiederhergestellt.",
          );
        } else {
          const previous = {
            tank: loadJSON(slot, null),
            session: loadJSON(notesKey, null),
          };
          if (
            (previous.tank || previous.session) &&
            !saveJSON(slot + ":previous", previous)
          )
            throw new Error(
              "Sicherung fehlgeschlagen; die Mission bleibt erhalten.",
            );
          const tank = host.normalize(createLearningTank(prepared, host));
          const fresh = {
            version: 1,
            notes: {},
            measurements: [],
            baseline: tank,
            comparison: null,
            population: teacher.grade === 9 ? createLearningPopulation() : null,
            study: {
              tool:
                learningTools(prepared, teacher).find(
                  (k) => LEARNING_TOOLS[k],
                ) || "light",
              value: null,
              days: 3,
              repetitions: 2,
              metric: teacher.grade === 9 ? "A" : "oxygen",
              environment: "neutral",
              generations: 5,
            },
          };
          if (!saveJSON(slot, tank) || !saveJSON(notesKey, fresh))
            throw new Error(
              "Neustart konnte nicht vollständig gespeichert werden. Die Sicherung bleibt erhalten.",
            );
          host.open(tank);
          host.notify(
            "Ausgewählte Mission neu vorbereitet; der vorherige Stand ist gesichert.",
          );
        }
        render();
        return;
      }
      if (a === "teacher-free") {
        grade = teacher.grade;
        start("free");
        detailed = true;
        render();
        return;
      }
      if (a === "teacher-launch") {
        grade = teacher.grade;
        start("missions", teacher.mission);
        detailed = true;
        showPanel("investigate");
        return;
      }
      if (a === "imported-csv") {
        download(
          "aquarium-lernprodukt-daten.csv",
          comparisonCSV(imported.comparison),
          "text/csv;charset=utf-8",
        );
        return;
      }
      if (a === "config-export") {
        download("aquarium-unterricht.json", teacher);
        return;
      }
      if (a === "advance") {
        host.advanceCurrent(1);
        persist();
        render();
        return;
      }
      if (a === "tweezers") {
        // The placement controller deliberately rejects activation behind an open drawer.
        if (!detailed && panel === "more") closePanel();
        host.tweezers();
        if (!detailed) render();
        else t.setAttribute("aria-pressed", String(host.tweezersActive()));
        return;
      }
      if (a === "measure") {
        session.measurements.push({
          ...learningSample(host.getState(), host.types),
          metrics: metrics(),
        });
        session.measurements = session.measurements.slice(-300);
        persist();
        render();
        return;
      }
      if (a === "genes") {
        if (session.quest?.id === "9-traits" && pendingActivity(session.quest)?.id === "visible-traits") throw new Error("Sieh dir zuerst einen hellen und einen dunklen Fisch ohne Erbanlagen an.");
        showGenes = !showGenes;
        if (showGenes) recordQuestExperiment("traits");
        persist();
        render();
        return;
      }
      if (a === "apply") {
        const {tool, value} = readIntervention();
        if (!tools().includes(tool))
          throw new Error("Dieses Werkzeug ist nicht freigeschaltet.");
        const next = applyLearningIntervention(
          host.getState(),
          tool,
          value,
          host,
        );
        host.open(next);
        persist();
        render();
        return;
      }
      if (a === "baseline") {
        session.baseline = structuredClone(host.getState());
        persist();
        host.notify("Aktuelle Ausgangslage für beide Becken gesichert.");
        render();
        return;
      }
      if (a === "compare") {
        stopPlayback();
        if (!requirePlan()) return;
        const {tool, value} = readIntervention();
        if (!tools().includes(tool))
          throw new Error("Werkzeug nicht freigeschaltet.");
        const next = runLearningComparison(
          session.baseline,
          {
            tool,
            value,
            days: session.study.days,
            repetitions: session.study.repetitions,
            configuration: currentPlan("ecology"),
          },
          host,
        );
        delete session.study.series;delete session.inspection;delete session.view;
        if (session.comparison) session.comparisonHistory=[...(session.comparisonHistory || []),session.comparison].slice(-3);
        session.comparison = bindComparison(next,session.attemptId);
        session.comparison.planning = structuredClone(session.notes);
        if (isPrototype()) selectComparisonView(session,{time:next.runs[0].control[0].day});
        else {selectComparisonView(session);recordQuestExperiment("ecology");}
        persist();
        render();
        if (isPrototype()) playWorkspace();
        return;
      }
      if (a === "show-control" || a === "show-test") {
        stopPlayback();selectComparisonView(session,{side:a === "show-control" ? "control" : "test"});
        if (isPrototype()) {persist();render();} else showPanel("saved-view");
        return;
      }
      if (a === "adopt-view") {
        const v=resolveComparisonView(session),s=v?.sides[session.view?.side]?.state;
        if (!s) throw new Error("Für diesen Zeitpunkt ist kein Becken gespeichert.");
        host.open(structuredClone(s));persist();closePanel();return;
      }
      if (a === "population-compare") {
        if (!requirePlan()) return;
        delete session.study.series; delete session.inspection;
        if (session.comparison) session.comparisonHistory=[...(session.comparisonHistory || []),session.comparison].slice(-3);
        session.comparison = bindComparison(compareLearningPopulations(
          session.population,
          session.study.environment,
          session.study.generations,
          session.study.repetitions,
          currentPlan("population"),
        ),session.attemptId);
        session.comparison.planning = structuredClone(session.notes);
        recordQuestExperiment("population");
        persist();
        render();
        return;
      }
      if (a === "cross" || a === "punnett") {
        if (!detailed && session.quest?.id === "9-mendel" && !showGenes) throw new Error("Zeige zuerst die Erbanlagen. Wähle dann deine Eltern.");
        if (!requirePlan(true)) return;
        const mother = Number(
            root.querySelector("[data-learning-mother]").value,
          ),
          father = Number(root.querySelector("[data-learning-father]").value);
        if (a === "cross") {
          session.population = crossLearningPopulation(
            session.population,
            mother,
            father,
          );
          const event=session.population.events.at(-1),mendel=mendelEvidence(session.population);
          Object.assign(event,crossingPrediction(session,event.generation,mendel.f1 ? mendel.f1.generation+1 : null));
          session.mother = null;
          session.father = null;
          session.punnett = null;
          recordQuestExperiment("cross");
        } else
          session.punnett = punnettSquare(
            session.population.individuals.find((i) => i.uid === mother),
            session.population.individuals.find((i) => i.uid === father),
          );
        persist();
        render();
        return;
      }
      if (
        ["population-reset", "population-new", "population-seed"].includes(a)
      ) {
        const previous = session.population,
          oldSeed = previous.initialSeed ?? 47291;
        let seed =
          a === "population-seed"
            ? root.querySelector("[data-learning-seed]").valueAsNumber
            : oldSeed;
        if (a === "population-new") {
          seed = crypto.getRandomValues(new Uint32Array(1))[0];
          if (seed === oldSeed) seed = (seed + 1) >>> 0;
        }
        const repeated = repeatLearningPopulation(previous, seed);
        rememberBackup();
        session.populationRepeats = [
          ...(session.populationRepeats || []),
          { seed: oldSeed, final: populationCounts(previous) },
        ].slice(-20);
        session.population = repeated;
        session.mother = null;
        session.father = null;
        session.punnett = null;
        persist();
        render();
        return;
      }
      if (a === "reset-study") {
        rememberBackup();
        session.baseline = createLearningTank(tag, host);
        session.comparison = null;
        session.measurements = [];
        host.open(session.baseline);
        persist();
        render();
        return;
      }
      if (["manual-csv", "imported-manual-csv"].includes(a)) {
        const item = a === "manual-csv" ? product() : imported;
        download(
          "aquarium-eigene-messreihe.csv",
          measurementCSV(item.measurements, {
            profile: item.profile,
            metrics: item.measurementMetrics,
            modelVersion: item.modelVersion,
          }),
          "text/csv;charset=utf-8",
        );
        return;
      }
      if (a === "manual-chart") {
        download(
          "aquarium-eigene-messreihe.svg",
          t
            .closest(".learn-measurements")
            .querySelector("svg")
            .outerHTML.replace(
              "<svg ",
              '<svg xmlns="http://www.w3.org/2000/svg" ',
            ),
          "image/svg+xml",
        );
        return;
      }
      if (a === "csv") {
        const v=resolveComparisonView(session);
        download(
          "aquarium-daten.csv",
          comparisonCSV({...v.comparison,runs:[v.run],viewContext:v.context}),
          "text/csv;charset=utf-8",
        );
        return;
      }
      if (a === "chart") {
        download(
          "aquarium-diagramm.svg",
          root
            .querySelector(".learn-chart")
            .outerHTML.replace(
              "<svg ",
              '<svg xmlns="http://www.w3.org/2000/svg" ',
            ),
          "image/svg+xml",
        );
        return;
      }
      if (a === "export") {
        download(
          "aquarium-lernprodukt-klasse-" + tag.grade + ".json",
          product(),
        );
        return;
      }
      if (a === "export-text") {
        download(
          "aquarium-protokoll.txt",
          "Klasse " +
            tag.grade +
            " · " +
            (mission()?.title || "Freies Forschen") +
            "\n\n" +
            Object.entries(noteFields)
              .map(([k, label]) => label + " · " + ORIGIN_LABELS[session.noteOrigins?.[k] || "unknown"] + "\n" + (session.notes[k] || "—"))
              .join("\n\n") +
            "\n\nAusgewählte Antworten (Auswahl, kein selbst formulierter Text):\n" + (session.quest?.entries || []).filter(e=>e.answer).map(e=>e.question+": "+e.answer).join("\n") + "\n\nSpielerklärung:\n" + (session.quest ? questConclusion(QUESTS[tag.mission],session.quest.result).feedback : "—") + "\n\nMesswerte aus dem Simulationsmodell sind im JSON-/CSV-Export enthalten.",
          "text/plain;charset=utf-8",
        );
        return;
      }
      if (a.startsWith("species-")) {
        if (!detailed) {
          selected = a.slice(8);
          const type = host.types[selected];
          root.querySelector(".learn-panel").innerHTML =
            panelHeader(type.name, "species") +
            `<p>Diese Art braucht Platz und passendes Wasser.</p><p>Mindestens ${type.minL} Liter · ${type.temp?.join("–") || "—"} °C</p>${button("add-species", "Einsetzen")}${button("material", "Zurück")}`;
          questEvent(session.quest, "observe");
          persist();
          return;
        }
        selected = a.slice(8);
        const s = host.types[selected];
        root.querySelector(".learn-panel").innerHTML =
          panelHeader(s.name, "model") +
          `<p>${esc(s.description)}</p><p>Mindestens ${s.minL} L · ${s.temp?.join("–") || "—"} °C · ${s.category === "fish" ? "Gruppe mindestens " + s.group : ""}</p><p>Aktuelles Becken: ${host.getState().liters} L. Tiere zusätzlich einzusetzen braucht eine begründete Frage und passende Bedingungen.</p>${button("add-species", "Ein Exemplar einsetzen")}`;
        return;
      }
      if (a === "add-species") {
        const s = host.getState(),
          type = host.types[selected];
        if (
          !GRADE_PROFILES[tag.grade].catalog.includes(selected) ||
          s.liters < type.minL ||
          !["both", s.water].includes(type.water) ||
          (type.temp &&
            (s.params.temp < type.temp[0] || s.params.temp > type.temp[1]))
        )
          throw new Error("Wasserart, Temperatur oder Platz passt nicht.");
        if (!host.addCurrent(selected))
          throw new Error("Kein freier Platz für diese Art.");
        persist();
        showPanel("material");
        return;
      }
    } catch (error) {
      host.notify(error.message);
    }
  });
  document.addEventListener(
    "keydown",
    (e) => {
      if (screen === "expert") return;
      if (e.key === "Escape" && (helpKey || panel)) {
        e.preventDefault();
        e.stopPropagation();
        if (helpKey) closeHelp();
        else closePanel();
      }
      if (e.key === "Tab" && (panel || helpKey || screen !== "active")) {
        const scope =
            root.querySelector(".learn-help-pop") ||
            root.querySelector(".learn-panel") ||
            root,
          focusable = [
            ...scope.querySelectorAll(
              "button,input,select,textarea,a[href],summary",
            ),
          ].filter((x) => !x.disabled && x.getClientRects().length);
        if (focusable.length) {
          const first = focusable[0],
            last = focusable.at(-1);
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    true,
  );
  const entry = document.createElement("button");
  entry.className = "learn-expert-entry glass-button";
  entry.textContent = "Klassen 8–10";
  entry.addEventListener("click", () => {
    host.home();
    tag = null;
    session = null;
    setScreen("home");
  });
  host.root.append(entry);
  render();
  return {
    openDevice,
    deviceView: () => isPrototype() ? tankViews.get("test") : null,
    deviceState: () => isPrototype() ? tankViews.get("test")?.state : null,
    deviceContext: () => ({
      visible: screen === "active" && !helpKey && (!panel || panel === "investigate"),
      tools: tag ? [...tools(), ...(tag.mode === "free" ? Object.keys(EQUIPMENT_SWITCHES) : [])] : [],
      focus: panel === "investigate" && tag?.grade !== 9 ? session.study.tool : null,
    }),
    blocksScene: () =>
      screen !== "expert" && (screen !== "active" || !!panel || !!helpKey),
    active: () => screen === "active",
    tweezersChanged: () => {
      const control = root.querySelector('[data-learn="tweezers"]');
      control?.setAttribute("aria-pressed", String(host.tweezersActive()));
      if (control && !detailed)
        control.textContent = host.tweezersActive()
          ? "Pinzette beenden"
          : "Pinzette";
    },
    select: (uid) => {
      selected = uid;
      showPanel("observe");
    },
    snapshot: () => ({
      screen,
      grade: tag?.grade || grade,
      profile: tag,
      panel,
      visibleTools: tag ? tools() : [],
      visibleMetrics: tag ? metrics() : [],
      help: teacher.help,
      support: teacher.support,
      comparison: session?.comparison,
      population: session?.population,
      notes: session?.notes,
      provenance: session ? learningProvenance(session) : null,
      measurements: session?.measurements,
      comparisonHistory: session?.comparisonHistory || [],
      sample: tag ? learningSample(host.getState(),host.types) : null,
      habitat: tag ? habitatProblems(host.getState(),host.types) : null,
      storageError,
      study: session?.study,
      quest: session?.quest,
      detailed,
      attemptId: session?.attemptId,
      view: session ? resolveComparisonView(session)?.context : null,
      prototype: isPrototype() ? {mode:session.view?.mode || (session.comparison ? "result" : "plan"),render:tankViews.snapshot(),selection:session.prototypeSelection} : null,
      resultMatchesPlan: session?.comparison
        ? planMatchesComparison(
            session.comparison,
            currentPlan(session.comparison.kind),
          )
        : null,
    }),
    refresh: () => {
      if (screen === "active" && !panel) render();
    },
  };
}
