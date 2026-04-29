(function () {
  const STORAGE_KEY = "dementia_dashboard_state_v3";
  const LANG_KEY = "dementia_dashboard_lang_v1";
  const TAB_KEY = "dementia_dashboard_tab_v1";
  const TOTAL_HOURS = 24;
  const INTERVAL_MINUTES = 10;
  const INTERVAL_MS = INTERVAL_MINUTES * 60 * 1000;
  const POINTS = (TOTAL_HOURS * 60) / INTERVAL_MINUTES;
  const SLEEP_GOAL_HOURS = 7.5;
  const SLEEP_LOW_HOURS = 6.5;
  const HEATMAP_COLUMNS = 24;

  const translations = {
    ru: {
      locale: "ru-RU",
      overviewDocTitle: "Панель оценки риска деменции",
      dashboardDocTitle: "Детальный дашборд",
      dashboardTag: "Панель оценки риска деменции",
      overviewPageTitle: "Главный показатель и ключевые изменения",
      dashboardPageTitle: "Детальный дашборд сигналов",
      dashboardIntro: "Переключайте графики по одному, чтобы разбирать изменения без визуальной перегрузки.",
      recorded: "Период",
      riskScore: "Риск",
      dashboardLink: "Открыть дашборд",
      overviewLink: "К обзору",
      primaryMetricLabel: "Главный показатель",
      currentRisk: "Риск деменции",
      age: "Возраст",
      avgPeriod: "Среднее 24ч",
      peak: "Пик",
      insightLabel: "Контекст",
      insightTitle: "Что важно сейчас",
      insightCopy: "Оценка объединяет сон, восстановление, кислород и температуру в один понятный ориентир.",
      comparisonLabel: "Окно оценки",
      packetLabel: "Дискретность",
      comparisonPeakLabel: "Пик риска",
      sleepDuration: "Сон за 24 часа",
      hrs: "ч",
      deviationsLabel: "Ключевые изменения",
      deviationsTitle: "Самые заметные отклонения от базового уровня",
      deviationsCopy: "Карточки отсортированы по силе отклонения, чтобы первым показывать то, что влияет сильнее.",
      dashboardRiskLabel: "Текущий риск",
      dashboardPeriodLabel: "Окно оценки",
      dashboardPacketLabel: "Дискретность",
      dashboardSleepLabel: "Сон за 24 часа",
      dashboardPeakLabel: "Пик риска",
      viewerSectionLabel: "Детальный дашборд",
      viewerSectionTitle: "Сигналы по одному через табы",
      viewerSectionCopy: "Открывайте графики по одному через табы и смотрите только нужный сигнал.",
      sleepQualityLabel: "Качество сна",
      recoveryStateLabel: "Восстановление",
      stressLevelLabel: "Стресс",
      cognitiveStabilityLabel: "Когнитивная стабильность",
      sleepStatusGood: "сон восстанавливает",
      sleepStatusFair: "сон немного сжат",
      sleepStatusLow: "сну нужно внимание",
      recoveryStatusGood: "ресурс растет",
      recoveryStatusFair: "восстановление ровное",
      recoveryStatusLow: "ресурс снижен",
      stressStatusGood: "фон спокойный",
      stressStatusFair: "нагрузка заметна",
      stressStatusHigh: "нагрузка высокая",
      cognitiveStatusGood: "состояние устойчивое",
      cognitiveStatusFair: "нужна мягкая проверка",
      cognitiveStatusLow: "фон нестабилен",
      summarySleepMeta: (hours, wakeups) => `${hours} ч сна · ${wakeups} пробужд.`,
      summaryRecoveryMeta: (delta) => `${delta} мс к начальному уровню`,
      summaryStressMeta: (episodes) => `${episodes} стресс-эп. за сутки`,
      summaryCognitiveMeta: (delta) => `сдвиг риска ${delta} п.`,
      packet: (hours, step, points, windowHours) => `${hours} ч · шаг ${step} мин · ${points} точек · окно риска ${windowHours} ч`,
      summary: (tone, stress, desat, alcohol, hrvShift) => `За последние 24 часа видно ${tone}: стрессовых окон ${stress}, десатураций ${desat}, алкогольных эпизодов ${alcohol}; HRV к концу окна изменился на ${hrvShift} мс.`,
      lowSummaryTone: "спокойную картину",
      moderateSummaryTone: "умеренную нагрузку",
      highSummaryTone: "напряженную картину",
      lowLoad: "спокойно",
      moderateLoad: "нужно внимание",
      highLoad: "зона риска",
      riskHint: (delta, isAbove, hours) => `Текущий риск ${isAbove ? "выше" : "ниже"} среднего за первые ${hours} ч на ${delta} пункта.`,
      riskInterpretationLow: "Сейчас картина выглядит спокойной: выраженных отклонений от обычного фона не видно.",
      riskInterpretationModerate: "Есть несколько мягких отклонений от базового уровня. Полезно дать приоритет сну, восстановлению и спокойному темпу.",
      riskInterpretationHigh: "Сигналы заметно ушли от привычного фона. Лучше снизить нагрузку и понаблюдать за восстановлением.",
      trendRising: "рост",
      trendEasing: "снижение",
      trendWorsening: "ухудшение",
      trendRecovering: "восстановление",
      trendFlat: "без заметного сдвига относительно начала окна",
      hrvTrend: (word, amount, hours) => `${word} на ${amount} мс относительно первых ${hours} ч`,
      hrvHint: (recent, baseline, hours) => `Среднее HRV за последние ${hours} ч: ${recent} мс при обычном уровне ${baseline} мс.`,
      avg: "Среднее",
      min: "Мин",
      max: "Макс",
      spo2Stable: "провалов почти нет",
      spo2Dips: "есть падения сатурации",
      spo2HintSome: (minutes, min, severeMinutes) => severeMinutes > 0
        ? `${minutes} мин ниже 95%, минимум ${min}%, из них ${severeMinutes} мин ниже 92%.`
        : `${minutes} мин ниже 95%, минимум ${min}%.`,
      spo2HintNone: "Падений сатурации ниже 95% за окно не было.",
      desatMinutes: (minutes) => `${minutes} мин <95%`,
      sleepWindowMeta: "Окно сна",
      wakeupsMeta: "Пробужд.",
      goalMeta: "Цель",
      goalMet: "цель выполнена",
      goalMissed: "ниже цели",
      sleepSideNormal: "цель сна достигнута",
      sleepSideCompressed: "сна за сутки не хватило",
      sleepHint: (windowText, wakeups, goalText) => `Основное окно сна: ${windowText}; пробуждений ${wakeups}; ${goalText}.`,
      hrvFoot: (hours, min, max) => `за ${hours} ч: ${min}-${max} мс`,
      spo2Foot: (min) => `минимум ${min}%`,
      sleepFoot: (goal, wakeups) => `цель ${goal} ч · пробуждений ${wakeups}`,
      fragFoot: (time) => `пик около ${time}`,
      tempFoot: (baseline) => `обычно ${baseline} °C`,
      swsFoot: (sws, rem) => `глубокий сон ${sws}% · REM ${rem}%`,
      remFoot: (stress, desat) => `стресс ${stress} · десатурации ${desat}`,
      hrvChartNote: "Пунктир показывает обычный уровень, а линия помогает быстро увидеть отклонения.",
      spo2ChartNote: "Оранжевые и красные точки отмечают заметные падения сатурации.",
      sleepChartNote: "Столбцы показывают, когда сон набирался и хватило ли его за сутки.",
      tempChartNote: "Пунктир — обычная температура, линия показывает нестабильность относительно базового уровня.",
      swsChartNote: "Серый — легкий сон, зеленый — глубокий, фиолетовый — REM.",
      fragChartNote: "Чем насыщеннее цвет, тем больше ночных прерываний и фрагментации.",
      remChartNote: "Стресс, плохой сон, алкоголь и десатурации объясняют скачки по времени.",
      tabHrv: "HRV",
      tabSpo2: "SpO2",
      tabSleep: "Сон",
      tabTemp: "Температура",
      tabSws: "Структура сна",
      tabFrag: "Фрагментация",
      tabTimeline: "События",
      hrvChartKicker: "Восстановление",
      spo2ChartKicker: "Кислород",
      sleepChartKicker: "Сон",
      tempChartKicker: "Температура",
      swsChartKicker: "Стадии сна",
      fragChartKicker: "Непрерывность сна",
      remChartKicker: "Лента событий",
      tempTrend: (delta) => `сдвиг ${delta} °C от обычного`,
      fragTrend: (wakeups) => `${wakeups} пробуждений за окно`,
      timelineValue: (count) => `${count} событий`,
      timelineTrend: (stress, desat) => `стресс ${stress} · O2 ${desat}`,
      deviationSeverityHigh: "приоритет",
      deviationSeverityMedium: "умеренно",
      deviationSeverityLow: "легко",
      deviationMetricHrv: "HRV",
      deviationMetricSleep: "Сон",
      deviationMetricSpo2: "SpO2",
      deviationMetricTemp: "Температура",
      deviationMetricFrag: "Фрагментация",
      deviationFromBaseline: "от базового уровня",
      eventStress: "Стресс",
      eventSleep: "Сон",
      eventAlcohol: "Алк",
      eventDesat: "O2",
      noSleep: "без сна",
      calm: "спокойно",
      medium: "внимание",
      severe: "сильнее"
    },
    kk: {
      locale: "kk-KZ",
      dashboardLink: "Дашбордты ашу",
      overviewLink: "Шолуға оралу",
      overviewPageTitle: "Негізгі көрсеткіш пен басты өзгерістер",
      dashboardPageTitle: "Сигналдардың егжей-тегжейлі дашборды",
      dashboardIntro: "Графиктерді бір-бірден ауыстырып, өзгерістерді визуалдық жүктемесіз қараңыз."
    }
  };

  let currentLang = loadLanguage();
  let activeChart = null;

  document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;
    if (page === "overview") {
      initOverviewPage();
    }
    if (page === "dashboard") {
      initDashboardPage();
    }
  });

  function initOverviewPage() {
    destroyActiveChart();
    renderOverviewPage();
  }

  function initDashboardPage() {
    destroyActiveChart();
    renderDashboardPage();
  }

  function t(key, ...args) {
    const langPack = translations[currentLang] || translations.ru;
    const value = key in langPack ? langPack[key] : translations.ru[key];
    return typeof value === "function" ? value(...args) : value;
  }

  function loadLanguage() {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      return saved === "kk" ? "kk" : "ru";
    } catch {
      return "ru";
    }
  }

  function saveLanguage(lang) {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      return;
    }
  }

  function loadTab() {
    try {
      return localStorage.getItem(TAB_KEY) || "hrv";
    } catch {
      return "hrv";
    }
  }

  function saveTab(tab) {
    try {
      localStorage.setItem(TAB_KEY, tab);
    } catch {
      return;
    }
  }

  function randn_bm() {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function sigmoid(value) {
    return 1 / (1 + Math.exp(-value));
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomFloat(min, max) {
    return min + Math.random() * (max - min);
  }

  function round(value, decimals) {
    const digits = decimals === undefined ? 2 : decimals;
    const factor = 10 ** digits;
    return Math.round(value * factor) / factor;
  }

  function average(values) {
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  }

  function stdDev(values) {
    if (values.length < 2) {
      return 0;
    }
    const mean = average(values);
    const variance = average(values.map((value) => (value - mean) ** 2));
    return Math.sqrt(variance);
  }

  function minValue(values) {
    return values.length ? Math.min(...values) : 0;
  }

  function maxValue(values) {
    return values.length ? Math.max(...values) : 0;
  }

  function windowAverage(values, size, fromEnd) {
    const slice = fromEnd === false ? values.slice(0, size) : values.slice(-size);
    return average(slice);
  }

  function format(value, decimals) {
    const digits = decimals === undefined ? 0 : decimals;
    return new Intl.NumberFormat(t("locale"), {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    }).format(value);
  }

  function formatSigned(value, decimals) {
    const digits = decimals === undefined ? 0 : decimals;
    if (Math.abs(value) < 0.05) {
      return format(0, digits);
    }
    return `${value > 0 ? "+" : "-"}${format(Math.abs(value), digits)}`;
  }

  function alignToInterval(date, minutes) {
    const aligned = new Date(date);
    aligned.setSeconds(0, 0);
    aligned.setMinutes(Math.floor(aligned.getMinutes() / minutes) * minutes);
    return aligned;
  }

  function minuteOfDay(date) {
    return date.getHours() * 60 + date.getMinutes();
  }

  function isWithinWindow(minute, start, end) {
    if (start <= end) {
      return minute >= start && minute < end;
    }
    return minute >= start || minute < end;
  }

  function formatDateTime(date) {
    return new Intl.DateTimeFormat(t("locale"), {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(date);
  }

  function formatTime(date) {
    return new Intl.DateTimeFormat(t("locale"), {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(date);
  }

  function countEpisodes(collection, predicate) {
    let count = 0;
    let active = false;
    collection.forEach((item) => {
      const matches = predicate(item);
      if (matches && !active) {
        count += 1;
        active = true;
      } else if (!matches) {
        active = false;
      }
    });
    return count;
  }

  function createProfile(age) {
    const sleepStartMinute = randomInt(22 * 60, 23 * 60 + 20);
    const sleepDuration = clamp(7.1 + randn_bm() * 0.55, 6.1, 8.3);

    return {
      age,
      rollingWindow: randomInt(18, 30),
      sleepStartMinute,
      sleepEndMinute: (sleepStartMinute + Math.round(sleepDuration * 60)) % (24 * 60),
      hrvBaseline: clamp(58 - (age - 45) * 0.28 + randn_bm() * 4.5, 40, 72),
      sleepBaseline: clamp(7.05 + randn_bm() * 0.45, 5.8, 8.7),
      spo2Baseline: clamp(97.0 - Math.max(age - 55, 0) * 0.03 + randn_bm() * 0.2, 95, 98.6),
      swsBaseline: clamp(0.21 - Math.max(age - 45, 0) * 0.0015 + randn_bm() * 0.01, 0.14, 0.25),
      remBaseline: clamp(0.22 + randn_bm() * 0.012, 0.17, 0.26),
      temperatureBaseAbs: clamp(36.45 + randn_bm() * 0.12, 36.1, 36.8),
      phi: {
        hrv: randomFloat(0.84, 0.92),
        sleep: randomFloat(0.88, 0.95),
        spo2: randomFloat(0.85, 0.94),
        fragmentation: randomFloat(0.76, 0.88),
        sws: randomFloat(0.74, 0.86),
        rem: randomFloat(0.74, 0.86),
        temp: randomFloat(0.84, 0.92)
      },
      sigma: {
        hrv: 2.8,
        sleep: 0.12,
        spo2: 0.18,
        fragmentation: 0.24,
        sws: 0.012,
        rem: 0.013,
        temp: 0.035
      }
    };
  }

  function ar1Step(previous, mu, phi, sigma, min, max) {
    const next = mu + phi * (previous - mu) + randn_bm() * sigma;
    return clamp(next, min, max);
  }

  function rollingStats(values, index, window, fallbackMean, fallbackStd) {
    const start = Math.max(0, index - window + 1);
    const slice = values.slice(start, index + 1);
    const mean = slice.length > 1 ? average(slice) : fallbackMean;
    const std = slice.length > 1 ? Math.max(stdDev(slice), fallbackStd * 0.35, 0.0001) : fallbackStd;
    return { mean, std };
  }

  function annotateRisk(data, profile) {
    const window = profile.rollingWindow;
    const zAge = (profile.age - 47.5) / 10;
    const hrvValues = data.map((sample) => Math.max(sample.hrv, 30));
    const spo2Values = data.map((sample) => sample.spo2);
    const fragValues = data.map((sample) => sample.fragmentation);
    const sleepValues = data.map((sample) => sample.sleep_hours);
    const tempValues = data.map((sample) => Math.abs(sample.temperature - profile.temperatureBaseAbs));
    const swsValues = data.map((sample) => sample.sws_ratio);
    const remValues = data.map((sample) => sample.rem_ratio);

    data.forEach((sample, index) => {
      const hrvStats = rollingStats(hrvValues, index, window, profile.hrvBaseline, 5.2);
      const spo2Stats = rollingStats(spo2Values, index, window, profile.spo2Baseline, 0.7);
      const fragStats = rollingStats(fragValues, index, window, 1.0, 0.55);
      const sleepStats = rollingStats(sleepValues, index, window, profile.sleepBaseline, 0.45);
      const tempStats = rollingStats(tempValues, index, window, 0.08, 0.05);
      const swsStats = rollingStats(swsValues, index, window, profile.swsBaseline * 0.5, 0.05);
      const remStats = rollingStats(remValues, index, window, profile.remBaseline * 0.5, 0.05);

      const zLowHrv = (hrvStats.mean - Math.max(sample.hrv, 30)) / hrvStats.std;
      const zSpo2Desat = Math.max(0, (spo2Stats.mean - sample.spo2) / spo2Stats.std);
      const zSleepFragmentation = (sample.fragmentation - fragStats.mean) / fragStats.std;
      const zShortSleep = Math.max(0, (sleepStats.mean - sample.sleep_hours) / sleepStats.std);
      const zTempInstability = Math.max(0, (Math.abs(sample.temperature - profile.temperatureBaseAbs) - tempStats.mean) / tempStats.std);
      const zSwsRatio = (sample.sws_ratio - swsStats.mean) / swsStats.std;
      const zRemRatio = (sample.rem_ratio - remStats.mean) / remStats.std;

      let raw =
        0.88 * zAge +
        0.82 * zLowHrv +
        0.78 * zSpo2Desat +
        0.62 * zSleepFragmentation +
        0.44 * zShortSleep +
        0.34 * zTempInstability -
        0.22 * zSwsRatio -
        0.16 * zRemRatio +
        (sample.events.stress ? 0.35 : 0) +
        (sample.events.alcohol ? 0.46 : 0) +
        (sample.events.badSleep ? 0.3 : 0);

      if (sample.spo2 < 92) {
        raw += 0.95 + (92 - sample.spo2) * 0.22;
      }

      if (sample.sleep_hours < SLEEP_LOW_HOURS) {
        raw += 0.3 + (SLEEP_LOW_HOURS - sample.sleep_hours) * 0.22;
      }

      sample.risk = Math.round(clamp(100 * sigmoid(raw), 1, 99));
    });
  }

  function generateData(points, age, endTime) {
    const profile = createProfile(age);
    const data = [];
    const finalEndTime = alignToInterval(endTime || new Date(), INTERVAL_MINUTES);
    const startTime = new Date(finalEndTime.getTime() - points * INTERVAL_MS);

    let prev = {
      hrv: profile.hrvBaseline,
      sleepHours: profile.sleepBaseline,
      spo2: profile.spo2Baseline,
      fragmentation: clamp(0.8 + randn_bm() * 0.15, 0, 5),
      sws: profile.swsBaseline,
      rem: profile.remBaseline,
      temperature: profile.temperatureBaseAbs
    };

    let stressCarry = 0;
    let alcoholCarry = 0;
    let desatCarry = 0;
    let badSleepCarry = 0;
    let wakeups = 0;
    let wasAsleep = false;

    for (let index = 0; index < points; index += 1) {
      const timestamp = new Date(startTime.getTime() + (index + 1) * INTERVAL_MS);
      const minute = minuteOfDay(timestamp);
      const workHours = minute >= 8 * 60 && minute < 18 * 60;
      const evening = minute >= 19 * 60 && minute < 24 * 60;
      const inBedWindow = isWithinWindow(minute, profile.sleepStartMinute, profile.sleepEndMinute);

      if (stressCarry === 0 && workHours && Math.random() < (index > points * 0.55 ? 0.08 : 0.05)) {
        stressCarry = randomInt(3, 8);
      }
      if (alcoholCarry === 0 && evening && Math.random() < 0.045) {
        alcoholCarry = randomInt(6, 12);
      }
      if (desatCarry === 0 && inBedWindow && Math.random() < 0.07) {
        desatCarry = randomInt(2, 8);
      }
      if (badSleepCarry === 0 && inBedWindow && Math.random() < ((stressCarry > 0 || alcoholCarry > 0 || desatCarry > 0) ? 0.1 : 0.03)) {
        badSleepCarry = randomInt(3, 7);
      }

      const stressEvent = stressCarry > 0;
      const alcoholEvent = alcoholCarry > 0;
      const desatEvent = desatCarry > 0;
      const badSleepEvent = badSleepCarry > 0;
      const microAwake = inBedWindow && (badSleepEvent ? Math.random() < 0.22 : Math.random() < 0.05);
      const asleep = inBedWindow && !microAwake;

      if (!asleep && wasAsleep && inBedWindow) {
        wakeups += 1;
      }
      wasAsleep = asleep;

      const sleepHours = ar1Step(
        prev.sleepHours,
        clamp(
          profile.sleepBaseline +
          (asleep ? 0.12 : -0.02) -
          (badSleepEvent ? randomFloat(0.18, 0.55) : 0) -
          (stressEvent ? randomFloat(0.08, 0.32) : 0) -
          (alcoholEvent ? randomFloat(0.12, 0.45) : 0),
          4.6,
          9.1
        ),
        profile.phi.sleep,
        profile.sigma.sleep,
        4.4,
        9.5
      );

      const spo2 = ar1Step(
        prev.spo2,
        clamp(
          profile.spo2Baseline -
          (asleep ? 0.1 : 0) -
          (desatEvent ? randomFloat(1.8, 4.8) : 0) -
          (alcoholEvent ? randomFloat(0.25, 0.8) : 0) -
          (badSleepEvent ? randomFloat(0.05, 0.25) : 0),
          89,
          99
        ),
        profile.phi.spo2,
        profile.sigma.spo2,
        88.5,
        99.5
      );

      const temperature = ar1Step(
        prev.temperature,
        clamp(
          profile.temperatureBaseAbs +
          (stressEvent ? randomFloat(0.05, 0.18) : 0) +
          (alcoholEvent ? randomFloat(0.12, 0.28) : 0) +
          (badSleepEvent ? randomFloat(0.03, 0.1) : 0) +
          (asleep ? -0.05 : 0.03),
          35.9,
          37.7
        ),
        profile.phi.temp,
        profile.sigma.temp,
        35.8,
        37.8
      );

      const hrv = ar1Step(
        prev.hrv,
        clamp(
          profile.hrvBaseline +
          (asleep ? randomFloat(2.5, 5.2) : 0) -
          (stressEvent ? randomFloat(5, 11) : 0) -
          (alcoholEvent ? randomFloat(6, 14) : 0) -
          (badSleepEvent ? randomFloat(4, 10) : 0) -
          Math.max(0, profile.spo2Baseline - spo2) * 3.1 -
          Math.max(0, temperature - profile.temperatureBaseAbs) * 12,
          22,
          108
        ),
        profile.phi.hrv,
        profile.sigma.hrv,
        22,
        110
      );

      let fragmentation = ar1Step(
        prev.fragmentation,
        clamp(
          0.55 +
          (asleep ? 0.2 : 0) +
          (badSleepEvent ? randomFloat(1.0, 1.8) : 0) +
          (desatEvent ? randomFloat(1.0, 2.1) : 0) +
          (stressEvent ? randomFloat(0.3, 0.8) : 0) +
          (alcoholEvent ? randomFloat(0.45, 0.95) : 0) +
          Math.max(0, profile.hrvBaseline - hrv) / 18,
          0,
          5
        ),
        profile.phi.fragmentation,
        profile.sigma.fragmentation,
        0,
        5
      );

      if (desatEvent && spo2 < 92) {
        fragmentation = clamp(fragmentation + 0.3, 0, 5);
      }

      let swsRatio = 0;
      let remRatio = 0;
      let otherSleepRatio = 0;

      if (asleep) {
        swsRatio = ar1Step(
          prev.sws,
          clamp(
            profile.swsBaseline -
            (badSleepEvent ? randomFloat(0.03, 0.08) : 0) -
            (alcoholEvent ? randomFloat(0.02, 0.05) : 0) -
            Math.max(0, fragmentation - 1.1) * 0.02,
            0.05,
            0.29
          ),
          profile.phi.sws,
          profile.sigma.sws,
          0.05,
          0.3
        );

        remRatio = ar1Step(
          prev.rem,
          clamp(
            profile.remBaseline -
            (stressEvent ? randomFloat(0.02, 0.05) : 0) -
            (alcoholEvent ? randomFloat(0.03, 0.07) : 0) -
            Math.max(0, fragmentation - 1.0) * 0.015,
            0.08,
            0.32
          ),
          profile.phi.rem,
          profile.sigma.rem,
          0.08,
          0.32
        );

        otherSleepRatio = clamp(1 - swsRatio - remRatio, 0.32, 0.86);
        const total = swsRatio + remRatio + otherSleepRatio;
        swsRatio /= total;
        remRatio /= total;
        otherSleepRatio /= total;
      }

      const sample = {
        index,
        timestamp,
        hrv: Math.round(hrv),
        sleep_hours: round(sleepHours, 2),
        sleep: asleep ? 1 : 0,
        spo2: round(spo2, 1),
        fragmentation: round(fragmentation, 2),
        frag: round(fragmentation, 2),
        sws_ratio: round(asleep ? swsRatio : 0, 2),
        sws: round(asleep ? swsRatio : 0, 2),
        rem_ratio: round(asleep ? remRatio : 0, 2),
        rem: round(asleep ? remRatio : 0, 2),
        other_sleep: round(asleep ? otherSleepRatio : 0, 2),
        temperature: round(temperature, 2),
        temp: round(temperature, 2),
        asleep,
        risk: 0,
        events: {
          stress: stressEvent,
          badSleep: badSleepEvent,
          alcohol: alcoholEvent,
          desat: desatEvent
        }
      };

      data.push(sample);

      prev = {
        hrv: sample.hrv,
        sleepHours: sample.sleep_hours,
        spo2: sample.spo2,
        fragmentation: sample.fragmentation,
        sws: asleep ? sample.sws_ratio : prev.sws,
        rem: asleep ? sample.rem_ratio : prev.rem,
        temperature: sample.temperature
      };

      stressCarry = Math.max(0, stressCarry - 1);
      alcoholCarry = Math.max(0, alcoholCarry - 1);
      desatCarry = Math.max(0, desatCarry - 1);
      badSleepCarry = Math.max(0, badSleepCarry - 1);
    }

    annotateRisk(data, profile);

    return {
      profile,
      data,
      startTime,
      endTime: finalEndTime,
      wakeups
    };
  }

  function serializeSimulation(simulation) {
    return {
      ...simulation,
      startTime: simulation.startTime.toISOString(),
      endTime: simulation.endTime.toISOString(),
      data: simulation.data.map((item) => ({
        ...item,
        timestamp: item.timestamp.toISOString()
      }))
    };
  }

  function reviveSimulation(raw) {
    return {
      ...raw,
      startTime: new Date(raw.startTime),
      endTime: new Date(raw.endTime),
      data: raw.data.map((item) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }))
    };
  }

  function loadSimulation() {
    const alignedEnd = alignToInterval(new Date(), INTERVAL_MINUTES);
    const targetEndIso = alignedEnd.toISOString();

    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.endTime === targetEndIso) {
          return reviveSimulation(parsed);
        }
        const age = parsed && parsed.profile && parsed.profile.age ? parsed.profile.age : randomInt(30, 65);
        const regenerated = generateData(POINTS, age, alignedEnd);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeSimulation(regenerated)));
        return regenerated;
      }
    } catch {
      return generateData(POINTS, randomInt(30, 65), alignedEnd);
    }

    const created = generateData(POINTS, randomInt(30, 65), alignedEnd);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeSimulation(created)));
    } catch {
      return created;
    }
    return created;
  }

  function toneForRisk(risk) {
    if (risk < 34) {
      return {
        name: "low",
        color: "#3d7a52",
        bg: "rgba(79, 138, 99, 0.12)",
        soft: "rgba(79, 138, 99, 0.18)"
      };
    }
    if (risk < 67) {
      return {
        name: "moderate",
        color: "#9a6b27",
        bg: "rgba(212, 176, 96, 0.16)",
        soft: "rgba(212, 176, 96, 0.18)"
      };
    }
    return {
      name: "high",
      color: "#b66f55",
      bg: "rgba(201, 122, 98, 0.15)",
      soft: "rgba(201, 122, 98, 0.2)"
    };
  }

  function describeTrend(current, baseline, comparisonHours, positiveWhenHigher) {
    const delta = current - baseline;
    const direction = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
    const amount = Math.abs(delta);

    if (direction === "flat" || amount < 0.1) {
      return t("trendFlat");
    }

    const word = positiveWhenHigher
      ? direction === "up" ? t("trendRising") : t("trendEasing")
      : direction === "up" ? t("trendWorsening") : t("trendRecovering");

    return t("hrvTrend", word, format(amount, 1), format(comparisonHours, 1));
  }

  function deriveMetrics(simulation) {
    const profile = simulation.profile;
    const data = simulation.data;
    const latest = data[data.length - 1];
    const comparisonWindow = Math.min(profile.rollingWindow, data.length);
    const comparisonHours = round((comparisonWindow * INTERVAL_MINUTES) / 60, 1);
    const labels = data.map((item) => formatTime(item.timestamp));
    const risks = data.map((item) => item.risk);
    const hrvs = data.map((item) => item.hrv);
    const spo2s = data.map((item) => item.spo2);
    const sleepMetricValues = data.map((item) => item.sleep_hours);
    const sleepBars = data.map((item) => item.sleep);
    const frags = data.map((item) => item.frag);
    const swss = data.filter((item) => item.asleep).map((item) => item.sws);
    const rems = data.filter((item) => item.asleep).map((item) => item.rem);
    const temps = data.map((item) => item.temp);

    const desatIntervals = data.filter((item) => item.spo2 < 95).length;
    const severeDesatIntervals = data.filter((item) => item.spo2 < 92).length;
    const desatMinutes = desatIntervals * INTERVAL_MINUTES;
    const severeDesatMinutes = severeDesatIntervals * INTERVAL_MINUTES;
    const stressEpisodes = countEpisodes(data, (item) => item.events.stress);
    const alcoholEpisodes = countEpisodes(data, (item) => item.events.alcohol);
    const desatEpisodes = countEpisodes(data, (item) => item.spo2 < 95);
    const avgRisk = average(risks);
    const baselineRisk = windowAverage(risks, comparisonWindow, false);
    const recentRisk = windowAverage(risks, comparisonWindow, true);
    const riskShift = latest.risk - baselineRisk;
    const baselineHrv = windowAverage(hrvs, comparisonWindow, false);
    const recentHrv = windowAverage(hrvs, comparisonWindow, true);
    const baselineSpo2 = windowAverage(spo2s, comparisonWindow, false);
    const recentSpo2 = windowAverage(spo2s, comparisonWindow, true);
    const baselineSleepWindow = windowAverage(sleepMetricValues, comparisonWindow, false);
    const recentSleepWindow = windowAverage(sleepMetricValues, comparisonWindow, true);
    const baselineFrag = windowAverage(frags, comparisonWindow, false);
    const recentFrag = windowAverage(frags, comparisonWindow, true);
    const hrvShift = recentHrv - baselineHrv;
    const totalSleepHours = round(sleepBars.filter(Boolean).length * INTERVAL_MINUTES / 60, 2);
    const sleepStartSample = data.find((item) => item.asleep);
    const sleepEndSample = [...data].reverse().find((item) => item.asleep);
    const sleepWindowText = sleepStartSample && sleepEndSample
      ? `${formatTime(sleepStartSample.timestamp)} - ${formatTime(new Date(sleepEndSample.timestamp.getTime() + INTERVAL_MS))}`
      : "--:-- - --:--";
    const sleepGoalReached = totalSleepHours >= SLEEP_GOAL_HOURS;
    const averageSws = average(swss) * 100;
    const averageRem = average(rems) * 100;
    const maxFragIndex = frags.indexOf(maxValue(frags));
    const peakFragTime = maxFragIndex >= 0 ? formatTime(data[maxFragIndex].timestamp) : formatTime(simulation.startTime);
    const latestTempDelta = latest.temp - profile.temperatureBaseAbs;

    let cumulativeSleep = 0;
    const sleepBarColors = data.map((item) => {
      if (!item.asleep) {
        return "rgba(127, 144, 167, 0.14)";
      }
      cumulativeSleep += INTERVAL_MINUTES / 60;
      if (cumulativeSleep < SLEEP_LOW_HOURS) {
        return buildChartColor("red", 0.78);
      }
      if (cumulativeSleep < SLEEP_GOAL_HOURS) {
        return buildChartColor("orange", 0.76);
      }
      return buildChartColor("green", 0.82);
    });

    return {
      simulation,
      profile,
      data,
      latest,
      comparisonWindow,
      comparisonHours,
      labels,
      risks,
      hrvs,
      spo2s,
      sleepMetricValues,
      sleepBars,
      frags,
      swss,
      rems,
      temps,
      desatIntervals,
      severeDesatIntervals,
      desatMinutes,
      severeDesatMinutes,
      stressEpisodes,
      alcoholEpisodes,
      desatEpisodes,
      avgRisk,
      baselineRisk,
      recentRisk,
      riskShift,
      baselineHrv,
      recentHrv,
      baselineSpo2,
      recentSpo2,
      baselineSleepWindow,
      recentSleepWindow,
      baselineFrag,
      recentFrag,
      hrvShift,
      totalSleepHours,
      sleepWindowText,
      sleepGoalReached,
      averageSws,
      averageRem,
      peakFragTime,
      latestTempDelta,
      sleepBarColors,
      startLabel: formatTime(simulation.startTime),
      endLabel: formatTime(simulation.endTime)
    };
  }

  function buildChartColor(key, alpha) {
    const map = {
      green: `rgba(67, 160, 71, ${alpha})`,
      yellow: `rgba(251, 192, 45, ${alpha})`,
      orange: `rgba(251, 140, 0, ${alpha})`,
      red: `rgba(229, 57, 53, ${alpha})`,
      slate: `rgba(127, 144, 167, ${alpha})`,
      violet: `rgba(124, 97, 196, ${alpha})`,
      warm: `rgba(141, 92, 29, ${alpha})`
    };
    return map[key];
  }

  function getAdaptiveTickStep(chartWidth) {
    if (chartWidth <= 360) return 36;
    if (chartWidth <= 520) return 24;
    if (chartWidth <= 760) return 18;
    if (chartWidth <= 1040) return 12;
    return 9;
  }

  function axisTickLabel(metrics, index, chartWidth) {
    const step = getAdaptiveTickStep(chartWidth);
    return index % step === 0 || index === metrics.labels.length - 1 ? metrics.labels[index] : "";
  }

  function tooltipTitle(metrics, items) {
    const raw = items[0].raw;
    const sourceIndex = raw && typeof raw.originalIndex === "number" ? raw.originalIndex : items[0].dataIndex;
    return formatDateTime(metrics.data[sourceIndex].timestamp);
  }

  function createBaseOptions(metrics, yOptions, tooltipFormatter, extraPlugins) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index"
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: false,
          backgroundColor: "rgba(20, 28, 44, 0.92)",
          titleColor: "#f0f4f8",
          bodyColor: "#f0f4f8",
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            title(items) {
              return tooltipTitle(metrics, items);
            },
            label: tooltipFormatter
          }
        },
        ...(extraPlugins || {})
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            autoSkip: false,
            color: "#7f90a7",
            maxRotation: 0,
            callback(value, index) {
              return axisTickLabel(metrics, index, this.chart.width);
            }
          }
        },
        y: {
          grid: { color: "rgba(127, 144, 167, 0.12)" },
          border: { display: false },
          ticks: { color: "#7f90a7" },
          ...(yOptions || {})
        }
      }
    };
  }

  function destroyActiveChart() {
    if (activeChart) {
      activeChart.destroy();
      activeChart = null;
    }
  }

  function renderOverviewPage() {
    const metrics = deriveMetrics(loadSimulation());
    document.documentElement.lang = currentLang === "kk" ? "kk" : "ru";
    document.title = t("overviewDocTitle");

    setText("dashboardTag", t("dashboardTag"));
    setText("pageTitle", t("overviewPageTitle"));
    setText("recordedLabel", t("recorded"));
    setText("recordedValue", `${formatDateTime(metrics.simulation.startTime)} - ${formatDateTime(metrics.simulation.endTime)}`);
    setText("lastPacket", t("packet", TOTAL_HOURS, INTERVAL_MINUTES, POINTS, format(metrics.comparisonHours, 1)));
    setText("riskScoreLabel", t("riskScore"));
    setText("riskScoreBadge", `${metrics.latest.risk}%`);
    setText("dashboardLink", t("dashboardLink"));

    setText("primaryMetricLabel", t("primaryMetricLabel"));
    setText("currentRiskLabel", t("currentRisk"));
    setText("riskCenterLabel", t("currentRisk"));
    setText("riskValue", format(metrics.latest.risk));
    setText("ageLabel", t("age"));
    setText("ageValue", metrics.profile.age);
    setText("riskAvgLabel", t("avgPeriod"));
    setText("riskAvg", `${format(metrics.avgRisk, 1)}%`);
    setText("riskPeakLabel", t("peak"));
    setText("riskPeak", `${format(maxValue(metrics.risks))}%`);

    setText("insightLabel", t("insightLabel"));
    setText("insightTitle", t("insightTitle"));
    setText("insightCopy", t("insightCopy"));
    setText("comparisonLabel", t("comparisonLabel"));
    setText("comparisonWindowValue", `${format(metrics.comparisonHours, 1)} ${t("hrs")}`);
    setText("insightRiskLabel", t("riskScore"));
    setText("insightRiskValue", `${metrics.latest.risk}%`);
    setText("packetLabel", t("packetLabel"));
    setText("insightPacket", t("packet", TOTAL_HOURS, INTERVAL_MINUTES, POINTS, format(metrics.comparisonHours, 1)));
    setText("sleepDurationLabel", t("sleepDuration"));
    setText("insightSleepValue", `${format(metrics.totalSleepHours, 1)} ${t("hrs")}`);
    setText("comparisonPeakLabel", t("comparisonPeakLabel"));
    setText("comparisonPeakValue", `${format(maxValue(metrics.risks))}%`);

    setText("deviationsLabel", t("deviationsLabel"));
    setText("deviationsTitle", t("deviationsTitle"));
    setText("deviationsCopy", t("deviationsCopy"));

    const tone = toneForRisk(metrics.latest.risk);
    const summaryTone = tone.name === "low"
      ? t("lowSummaryTone")
      : tone.name === "moderate"
        ? t("moderateSummaryTone")
        : t("highSummaryTone");

    setText("summaryCopy", t(
      "summary",
      summaryTone,
      format(metrics.stressEpisodes),
      format(metrics.desatEpisodes),
      format(metrics.alcoholEpisodes),
      format(metrics.hrvShift, 1)
    ));
    setText("riskHint", t("riskHint", format(Math.abs(metrics.riskShift), 1), metrics.riskShift >= 0, format(metrics.comparisonHours, 1)));
    setText("riskInterpretation", tone.name === "low"
      ? t("riskInterpretationLow")
      : tone.name === "moderate"
        ? t("riskInterpretationModerate")
        : t("riskInterpretationHigh"));

    applyRiskTone({
      badgeId: "riskScoreBadge",
      chipId: "riskTrend",
      valueId: "riskValue",
      orbId: "riskOrb",
      text: tone.name === "low" ? t("lowLoad") : tone.name === "moderate" ? t("moderateLoad") : t("highLoad")
    }, tone, metrics.latest.risk);

    renderSummaryCards(metrics);
    renderDeviationList(metrics);
    bindLanguageButtons(renderOverviewPage);
  }

  function renderSummaryCards(metrics) {
    const sleepStatusKey = metrics.totalSleepHours >= SLEEP_GOAL_HOURS && metrics.simulation.wakeups <= 3
      ? "sleepStatusGood"
      : metrics.totalSleepHours >= SLEEP_LOW_HOURS && metrics.simulation.wakeups <= 5
        ? "sleepStatusFair"
        : "sleepStatusLow";
    const recoveryDelta = metrics.recentHrv - metrics.profile.hrvBaseline;
    const recoveryStatusKey = recoveryDelta >= 2.5
      ? "recoveryStatusGood"
      : recoveryDelta >= -2
        ? "recoveryStatusFair"
        : "recoveryStatusLow";
    const stressStatusKey = metrics.stressEpisodes <= 1
      ? "stressStatusGood"
      : metrics.stressEpisodes <= 3
        ? "stressStatusFair"
        : "stressStatusHigh";
    const cognitiveStatusKey = metrics.latest.risk < 34 && Math.abs(metrics.riskShift) < 8
      ? "cognitiveStatusGood"
      : metrics.latest.risk < 67
        ? "cognitiveStatusFair"
        : "cognitiveStatusLow";

    setSummaryCard("summarySleepCard", "summarySleepLabel", "summarySleepStatus", "summarySleepMeta", {
      tone: sleepStatusKey === "sleepStatusGood" ? "rest" : sleepStatusKey === "sleepStatusFair" ? "focus" : "warm",
      label: t("sleepQualityLabel"),
      status: t(sleepStatusKey),
      meta: t("summarySleepMeta", format(metrics.totalSleepHours, 1), format(metrics.simulation.wakeups))
    });

    setSummaryCard("summaryRecoveryCard", "summaryRecoveryLabel", "summaryRecoveryStatus", "summaryRecoveryMeta", {
      tone: recoveryStatusKey === "recoveryStatusGood" ? "focus" : recoveryStatusKey === "recoveryStatusFair" ? "support" : "warm",
      label: t("recoveryStateLabel"),
      status: t(recoveryStatusKey),
      meta: t("summaryRecoveryMeta", formatSigned(recoveryDelta, 1))
    });

    setSummaryCard("summaryStressCard", "summaryStressLabel", "summaryStressStatus", "summaryStressMeta", {
      tone: stressStatusKey === "stressStatusGood" ? "rest" : "warm",
      label: t("stressLevelLabel"),
      status: t(stressStatusKey),
      meta: t("summaryStressMeta", format(metrics.stressEpisodes))
    });

    setSummaryCard("summaryCognitiveCard", "summaryCognitiveLabel", "summaryCognitiveStatus", "summaryCognitiveMeta", {
      tone: cognitiveStatusKey === "cognitiveStatusGood" ? "support" : cognitiveStatusKey === "cognitiveStatusFair" ? "focus" : "warm",
      label: t("cognitiveStabilityLabel"),
      status: t(cognitiveStatusKey),
      meta: t("summaryCognitiveMeta", formatSigned(metrics.riskShift, 1))
    });
  }

  function setSummaryCard(cardId, labelId, statusId, metaId, config) {
    const card = document.getElementById(cardId);
    card.dataset.tone = config.tone;
    setText(labelId, config.label);
    setText(statusId, config.status);
    setText(metaId, config.meta);
  }

  function getSeverityTone(score) {
    if (score >= 68) {
      return {
        label: t("deviationSeverityHigh"),
        background: "rgba(201, 122, 98, 0.15)",
        color: "#9f5c4a"
      };
    }
    if (score >= 38) {
      return {
        label: t("deviationSeverityMedium"),
        background: "rgba(212, 176, 96, 0.16)",
        color: "#8d6823"
      };
    }
    return {
      label: t("deviationSeverityLow"),
      background: "rgba(95, 156, 148, 0.14)",
      color: "#316b65"
    };
  }

  function renderDeviationList(metrics) {
    const container = document.getElementById("deviationList");
    container.innerHTML = "";

    const hrvPercentChange = ((metrics.recentHrv - metrics.baselineHrv) / Math.max(metrics.baselineHrv, 1)) * 100;
    const sleepPercentChange = ((metrics.recentSleepWindow - metrics.baselineSleepWindow) / Math.max(metrics.baselineSleepWindow, 0.5)) * 100;
    const spo2PercentChange = ((metrics.recentSpo2 - metrics.baselineSpo2) / Math.max(metrics.baselineSpo2, 0.5)) * 100;
    const fragPercentChange = ((metrics.recentFrag - metrics.baselineFrag) / Math.max(metrics.baselineFrag, 0.4)) * 100;

    const items = [
      {
        label: t("deviationMetricHrv"),
        deltaText: `${formatSigned(hrvPercentChange, 0)}%`,
        severity: clamp(((metrics.baselineHrv - metrics.recentHrv) / Math.max(metrics.baselineHrv, 1)) * 240, 0, 100),
        meta: `${t("deviationFromBaseline")} · ${format(metrics.recentHrv, 1)} ms`
      },
      {
        label: t("deviationMetricSleep"),
        deltaText: `${formatSigned(sleepPercentChange, 0)}%`,
        severity: clamp(((metrics.baselineSleepWindow - metrics.recentSleepWindow) / Math.max(metrics.baselineSleepWindow, 0.5)) * 220, 0, 100),
        meta: `${t("deviationFromBaseline")} · ${format(metrics.totalSleepHours, 1)} ${t("hrs")}`
      },
      {
        label: t("deviationMetricSpo2"),
        deltaText: `${formatSigned(spo2PercentChange, 1)}%`,
        severity: clamp(((metrics.baselineSpo2 - metrics.recentSpo2) / Math.max(metrics.baselineSpo2, 0.5)) * 4200, 0, 100),
        meta: `${t("deviationFromBaseline")} · ${format(metrics.recentSpo2, 1)}%`
      },
      {
        label: t("deviationMetricTemp"),
        deltaText: `${formatSigned(metrics.latestTempDelta, 2)}°C`,
        severity: clamp((Math.abs(metrics.latestTempDelta) / 0.45) * 100, 0, 100),
        meta: `${t("deviationFromBaseline")} · ${format(metrics.latest.temp, 2)} °C`
      },
      {
        label: t("deviationMetricFrag"),
        deltaText: `${formatSigned(fragPercentChange, 0)}%`,
        severity: clamp(((metrics.recentFrag - metrics.baselineFrag) / Math.max(metrics.baselineFrag, 0.4)) * 170, 0, 100),
        meta: `${t("deviationFromBaseline")} · ${format(metrics.recentFrag, 2)}`
      }
    ];

    items.sort((left, right) => right.severity - left.severity).forEach((item) => {
      const tone = getSeverityTone(item.severity);
      const article = document.createElement("article");
      article.className = "deviation-item";

      article.innerHTML = `
        <div class="deviation-top">
          <div>
            <div class="deviation-name">${item.label}</div>
            <div class="deviation-delta">${item.deltaText}</div>
          </div>
          <span class="severity-pill" style="background:${tone.background};color:${tone.color};">${tone.label}</span>
        </div>
        <div class="deviation-bar"><div class="deviation-fill" style="width:${Math.max(14, round(item.severity, 0))}%;"></div></div>
        <div class="deviation-meta">${item.meta}</div>
      `;
      container.appendChild(article);
    });
  }

  function applyRiskTone(ids, tone, risk) {
    const badge = document.getElementById(ids.badgeId);
    if (badge) {
      badge.style.color = tone.color;
      if (badge.parentElement) {
        badge.parentElement.style.background = tone.bg;
        badge.parentElement.style.borderColor = tone.bg;
      }
    }

    const chip = document.getElementById(ids.chipId);
    if (chip) {
      chip.style.background = tone.bg;
      chip.style.color = tone.color;
      chip.textContent = ids.text;
    }

    const value = document.getElementById(ids.valueId);
    if (value) {
      value.style.color = tone.color;
    }

    const orb = document.getElementById(ids.orbId);
    if (orb) {
      orb.style.setProperty("--risk-angle", `${clamp(risk, 0, 100) * 3.6}deg`);
      orb.style.setProperty("--risk-color", tone.color);
      orb.style.setProperty("--risk-soft", tone.soft);
    }
  }

  function bindLanguageButtons(rerender) {
    document.querySelectorAll(".lang-btn").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.lang === currentLang);
      button.onclick = () => {
        currentLang = button.dataset.lang === "kk" ? "kk" : "ru";
        saveLanguage(currentLang);
        destroyActiveChart();
        rerender();
      };
    });
  }

  function renderDashboardPage() {
    const metrics = deriveMetrics(loadSimulation());
    document.documentElement.lang = currentLang === "kk" ? "kk" : "ru";
    document.title = t("dashboardDocTitle");

    setText("dashboardTag", t("dashboardTag"));
    setText("pageTitle", t("dashboardPageTitle"));
    setText("summaryCopy", t("dashboardIntro"));
    setText("overviewLink", t("overviewLink"));
    setText("recordedLabel", t("recorded"));
    setText("recordedValue", `${formatDateTime(metrics.simulation.startTime)} - ${formatDateTime(metrics.simulation.endTime)}`);
    setText("lastPacket", t("packet", TOTAL_HOURS, INTERVAL_MINUTES, POINTS, format(metrics.comparisonHours, 1)));
    setText("riskScoreLabel", t("riskScore"));
    setText("riskScoreBadge", `${metrics.latest.risk}%`);

    setText("dashboardRiskLabel", t("dashboardRiskLabel"));
    setText("dashboardRiskValue", `${metrics.latest.risk}%`);
    setText("dashboardRiskHint", t("riskHint", format(Math.abs(metrics.riskShift), 1), metrics.riskShift >= 0, format(metrics.comparisonHours, 1)));
    setText("dashboardInterpretation", metrics.latest.risk < 34
      ? t("riskInterpretationLow")
      : metrics.latest.risk < 67
        ? t("riskInterpretationModerate")
        : t("riskInterpretationHigh"));
    setText("dashboardPeriodLabel", t("dashboardPeriodLabel"));
    setText("dashboardPeriodValue", `${format(metrics.comparisonHours, 1)} ${t("hrs")}`);
    setText("dashboardPacketLabel", t("dashboardPacketLabel"));
    setText("dashboardPacketValue", t("packet", TOTAL_HOURS, INTERVAL_MINUTES, POINTS, format(metrics.comparisonHours, 1)));
    setText("dashboardSleepLabel", t("dashboardSleepLabel"));
    setText("dashboardSleepValue", `${format(metrics.totalSleepHours, 1)} ${t("hrs")}`);
    setText("dashboardPeakLabel", t("dashboardPeakLabel"));
    setText("dashboardPeakValue", `${format(maxValue(metrics.risks))}%`);

    setText("viewerSectionLabel", t("viewerSectionLabel"));
    setText("viewerSectionTitle", t("viewerSectionTitle"));
    setText("viewerSectionCopy", t("viewerSectionCopy"));

    const tone = toneForRisk(metrics.latest.risk);
    applyRiskTone({
      badgeId: "riskScoreBadge",
      chipId: "dashboardRiskTrend",
      valueId: "dashboardRiskValue",
      text: tone.name === "low" ? t("lowLoad") : tone.name === "moderate" ? t("moderateLoad") : t("highLoad")
    }, tone, metrics.latest.risk);

    renderTabs(metrics);
    bindLanguageButtons(renderDashboardPage);
  }

  function renderTabs(metrics) {
    const tabs = buildTabConfigs(metrics);
    const savedTab = loadTab();
    const activeKey = tabs.some((tab) => tab.key === savedTab) ? savedTab : tabs[0].key;
    const container = document.getElementById("chartTabs");
    container.innerHTML = "";

    tabs.forEach((tab) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `tab-btn${tab.key === activeKey ? " is-active" : ""}`;
      button.textContent = tab.label;
      button.addEventListener("click", () => {
        saveTab(tab.key);
        renderTabs(metrics);
      });
      container.appendChild(button);
    });

    const activeTab = tabs.find((tab) => tab.key === activeKey);
    renderActiveTab(activeTab, metrics);
  }

  function buildTabConfigs(metrics) {
    return [
      {
        key: "hrv",
        label: t("tabHrv"),
        kicker: t("hrvChartKicker"),
        title: "HRV",
        note: t("hrvChartNote"),
        valueHtml: `${format(metrics.latest.hrv)} <span class="risk-unit">ms</span>`,
        trend: describeTrend(metrics.recentHrv, metrics.baselineHrv, metrics.comparisonHours, true),
        foot: t("hrvFoot", TOTAL_HOURS, format(minValue(metrics.hrvs)), format(maxValue(metrics.hrvs))),
        meta: [
          { label: t("avg"), value: `${format(average(metrics.hrvs), 1)} ms` },
          { label: t("min"), value: `${format(minValue(metrics.hrvs))} ms` },
          { label: t("max"), value: `${format(maxValue(metrics.hrvs))} ms` }
        ],
        kind: "chart",
        render: () => renderHrvChart(metrics)
      },
      {
        key: "spo2",
        label: t("tabSpo2"),
        kicker: t("spo2ChartKicker"),
        title: "SpO2",
        note: t("spo2ChartNote"),
        valueHtml: `${format(metrics.latest.spo2, 1)} <span class="risk-unit">%</span>`,
        trend: metrics.desatMinutes > 0 ? t("spo2Dips") : t("spo2Stable"),
        foot: t("spo2Foot", format(minValue(metrics.spo2s), 1)),
        meta: [
          { label: t("avg"), value: `${format(average(metrics.spo2s), 1)}%` },
          { label: t("min"), value: `${format(minValue(metrics.spo2s), 1)}%` },
          { label: t("max"), value: `${format(maxValue(metrics.spo2s), 1)}%` }
        ],
        kind: "chart",
        render: () => renderSpo2Chart(metrics)
      },
      {
        key: "sleep",
        label: t("tabSleep"),
        kicker: t("sleepChartKicker"),
        title: t("sleepDuration"),
        note: t("sleepChartNote"),
        valueHtml: `${format(metrics.totalSleepHours, 2)} <span class="risk-unit">${t("hrs")}</span>`,
        trend: metrics.sleepGoalReached ? t("sleepSideNormal") : t("sleepSideCompressed"),
        foot: t("sleepFoot", format(SLEEP_GOAL_HOURS, 1), format(metrics.simulation.wakeups)),
        meta: [
          { label: t("sleepWindowMeta"), value: metrics.sleepWindowText },
          { label: t("wakeupsMeta"), value: format(metrics.simulation.wakeups) },
          { label: t("goalMeta"), value: metrics.sleepGoalReached ? t("goalMet") : t("goalMissed") }
        ],
        kind: "chart",
        render: () => renderSleepChart(metrics)
      },
      {
        key: "temp",
        label: t("tabTemp"),
        kicker: t("tempChartKicker"),
        title: t("deviationMetricTemp"),
        note: t("tempChartNote"),
        valueHtml: `${format(metrics.latest.temp, 2)} <span class="risk-unit">°C</span>`,
        trend: t("tempTrend", formatSigned(metrics.latestTempDelta, 2)),
        foot: t("tempFoot", format(metrics.profile.temperatureBaseAbs, 2)),
        meta: [
          { label: t("avg"), value: `${format(average(metrics.temps), 2)} °C` },
          { label: t("min"), value: `${format(minValue(metrics.temps), 2)} °C` },
          { label: t("max"), value: `${format(maxValue(metrics.temps), 2)} °C` }
        ],
        kind: "chart",
        render: () => renderTempChart(metrics)
      },
      {
        key: "sws",
        label: t("tabSws"),
        kicker: t("swsChartKicker"),
        title: t("tabSws"),
        note: t("swsChartNote"),
        valueHtml: `${format(metrics.averageSws, 0)}% <span class="risk-unit">SWS</span>`,
        trend: `REM ${format(metrics.averageRem, 0)}%`,
        foot: t("swsFoot", format(metrics.averageSws, 0), format(metrics.averageRem, 0)),
        meta: [
          { label: "SWS", value: `${format(metrics.averageSws, 0)}%` },
          { label: "REM", value: `${format(metrics.averageRem, 0)}%` },
          { label: t("sleepWindowMeta"), value: metrics.sleepWindowText }
        ],
        kind: "chart",
        render: () => renderStructureChart(metrics)
      },
      {
        key: "frag",
        label: t("tabFrag"),
        kicker: t("fragChartKicker"),
        title: t("deviationMetricFrag"),
        note: t("fragChartNote"),
        valueHtml: `${format(metrics.recentFrag, 2)}`,
        trend: t("fragTrend", format(metrics.simulation.wakeups)),
        foot: t("fragFoot", metrics.peakFragTime),
        meta: [
          { label: t("avg"), value: `${format(average(metrics.frags), 2)}` },
          { label: t("peak"), value: `${format(maxValue(metrics.frags), 2)}` },
          { label: t("wakeupsMeta"), value: format(metrics.simulation.wakeups) }
        ],
        kind: "html",
        render: () => renderHeatmap(metrics)
      },
      {
        key: "timeline",
        label: t("tabTimeline"),
        kicker: t("remChartKicker"),
        title: t("tabTimeline"),
        note: t("remChartNote"),
        valueHtml: t("timelineValue", format(metrics.stressEpisodes + metrics.desatEpisodes + metrics.alcoholEpisodes)),
        trend: t("timelineTrend", format(metrics.stressEpisodes), format(metrics.desatEpisodes)),
        foot: t("remFoot", format(metrics.stressEpisodes), format(metrics.desatEpisodes)),
        meta: [
          { label: t("eventStress"), value: format(metrics.stressEpisodes) },
          { label: t("eventAlcohol"), value: format(metrics.alcoholEpisodes) },
          { label: t("eventDesat"), value: format(metrics.desatEpisodes) }
        ],
        kind: "html",
        render: () => renderTimeline(metrics)
      }
    ];
  }

  function renderActiveTab(tab, metrics) {
    setText("viewerKicker", tab.kicker);
    setText("viewerTitle", tab.title);
    setText("viewerNote", tab.note);
    setHtml("viewerValue", tab.valueHtml);
    setText("viewerTrend", tab.trend);
    setText("viewerFoot", tab.foot);
    setText("viewerStart", metrics.startLabel);
    setText("viewerEnd", metrics.endLabel);
    renderViewerMeta(tab.meta);

    const canvas = document.getElementById("viewerCanvas");
    const html = document.getElementById("viewerHtml");
    destroyActiveChart();
    html.innerHTML = "";

    if (tab.kind === "chart") {
      canvas.classList.remove("is-hidden");
      html.classList.add("is-hidden");
      activeChart = tab.render(canvas, html, metrics);
    } else {
      canvas.classList.add("is-hidden");
      html.classList.remove("is-hidden");
      tab.render(canvas, html, metrics);
    }
  }

  function renderViewerMeta(items) {
    const container = document.getElementById("viewerMeta");
    container.innerHTML = "";
    items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "viewer-meta-card";
      card.innerHTML = `<span class="viewer-meta-label">${item.label}</span><strong class="viewer-meta-value">${item.value}</strong>`;
      container.appendChild(card);
    });
  }

  function renderHrvChart(metrics) {
    const canvas = document.getElementById("viewerCanvas");
    return new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels: metrics.labels,
        datasets: [
          {
            data: metrics.data.map(() => round(metrics.profile.hrvBaseline, 1)),
            borderColor: buildChartColor("slate", 0.7),
            borderDash: [5, 5],
            borderWidth: 1.5,
            pointRadius: 0,
            fill: false
          },
          {
            data: metrics.hrvs,
            borderColor: buildChartColor("green", 0.96),
            backgroundColor: buildChartColor("green", 0.14),
            fill: {
              target: 0,
              above: "rgba(67, 160, 71, 0.08)",
              below: "rgba(229, 57, 53, 0.16)"
            },
            borderWidth: 2.2,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 2,
            pointHoverBackgroundColor: "#ffffff",
            pointHoverBorderColor: buildChartColor("green", 1),
            tension: 0.28
          }
        ]
      },
      options: createBaseOptions(
        metrics,
        {
          min: Math.max(20, Math.floor((minValue(metrics.hrvs) - 6) / 5) * 5),
          max: Math.ceil((maxValue(metrics.hrvs) + 6) / 5) * 5,
          ticks: {
            color: "#7f90a7",
            callback(value) {
              return `${value} ms`;
            }
          }
        },
        (context) => `${format(context.parsed.y)} ms`
      )
    });
  }

  function renderSpo2Chart(metrics) {
    const canvas = document.getElementById("viewerCanvas");
    return new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels: metrics.labels,
        datasets: [
          {
            data: metrics.spo2s,
            borderColor: buildChartColor("yellow", 0.96),
            backgroundColor: buildChartColor("yellow", 0.12),
            fill: false,
            borderWidth: 2.1,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 2,
            pointHoverBackgroundColor: "#ffffff",
            pointHoverBorderColor: buildChartColor("yellow", 1),
            tension: 0.24
          },
          {
            type: "scatter",
            data: metrics.data.map((item, index) => item.spo2 < 95 && item.spo2 >= 92 ? { x: metrics.labels[index], y: item.spo2, originalIndex: index } : null).filter(Boolean),
            pointRadius: 3.5,
            pointHoverRadius: 4.5,
            pointBackgroundColor: buildChartColor("orange", 0.95),
            pointBorderWidth: 0
          },
          {
            type: "scatter",
            data: metrics.data.map((item, index) => item.spo2 < 92 ? { x: metrics.labels[index], y: item.spo2, originalIndex: index } : null).filter(Boolean),
            pointRadius: 4.2,
            pointHoverRadius: 5,
            pointBackgroundColor: buildChartColor("red", 0.95),
            pointBorderWidth: 0
          }
        ]
      },
      options: createBaseOptions(
        metrics,
        {
          min: 90,
          max: 100,
          ticks: {
            color: "#7f90a7",
            callback(value) {
              return `${value}%`;
            }
          }
        },
        (context) => `${format(context.parsed.y, 1)}%`
      )
    });
  }

  function renderSleepChart(metrics) {
    const canvas = document.getElementById("viewerCanvas");
    return new Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: metrics.labels,
        datasets: [{
          data: metrics.sleepBars,
          backgroundColor: metrics.sleepBarColors,
          borderRadius: 3,
          borderSkipped: false,
          barPercentage: 1,
          categoryPercentage: 1
        }]
      },
      options: {
        ...createBaseOptions(
          metrics,
          {
            min: 0,
            max: 1,
            ticks: { display: false },
            grid: { display: false }
          },
          (context) => context.parsed.y > 0 ? `${INTERVAL_MINUTES} мин сна` : t("noSleep")
        ),
        plugins: {
          legend: { display: false },
          tooltip: {
            displayColors: false,
            backgroundColor: "rgba(20, 28, 44, 0.92)",
            titleColor: "#f0f4f8",
            bodyColor: "#f0f4f8",
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              title(items) {
                return tooltipTitle(metrics, items);
              },
              label(context) {
                return context.parsed.y > 0 ? `${INTERVAL_MINUTES} мин сна` : t("noSleep");
              }
            }
          }
        }
      }
    });
  }

  function renderTempChart(metrics) {
    const canvas = document.getElementById("viewerCanvas");
    return new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels: metrics.labels,
        datasets: [
          {
            data: metrics.data.map(() => round(metrics.profile.temperatureBaseAbs, 2)),
            borderColor: buildChartColor("slate", 0.68),
            borderDash: [5, 5],
            borderWidth: 1.5,
            pointRadius: 0,
            fill: false
          },
          {
            data: metrics.temps,
            borderColor: buildChartColor("red", 0.9),
            backgroundColor: buildChartColor("red", 0.12),
            fill: {
              target: 0,
              above: "rgba(229, 57, 53, 0.18)",
              below: "rgba(127, 144, 167, 0.08)"
            },
            borderWidth: 2.1,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 2,
            pointHoverBackgroundColor: "#ffffff",
            pointHoverBorderColor: buildChartColor("red", 1),
            tension: 0.24
          }
        ]
      },
      options: createBaseOptions(
        metrics,
        {
          min: Math.floor((minValue(metrics.temps) - 0.15) * 10) / 10,
          max: Math.ceil((maxValue(metrics.temps) + 0.15) * 10) / 10,
          ticks: {
            color: "#7f90a7",
            callback(value) {
              return `${value}°C`;
            }
          }
        },
        (context) => `${format(context.parsed.y, 2)} °C`
      )
    });
  }

  function renderStructureChart(metrics) {
    const canvas = document.getElementById("viewerCanvas");
    return new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels: metrics.labels,
        datasets: [
          {
            data: metrics.data.map((item) => item.other_sleep),
            borderColor: buildChartColor("slate", 0.72),
            backgroundColor: buildChartColor("slate", 0.2),
            fill: true,
            stack: "sleep-structure",
            pointRadius: 0,
            borderWidth: 1.2,
            tension: 0.24
          },
          {
            data: metrics.data.map((item) => item.sws),
            borderColor: buildChartColor("green", 0.9),
            backgroundColor: buildChartColor("green", 0.28),
            fill: true,
            stack: "sleep-structure",
            pointRadius: 0,
            borderWidth: 1.5,
            tension: 0.24
          },
          {
            data: metrics.data.map((item) => item.rem),
            borderColor: buildChartColor("violet", 0.92),
            backgroundColor: buildChartColor("violet", 0.28),
            fill: true,
            stack: "sleep-structure",
            pointRadius: 0,
            borderWidth: 1.5,
            tension: 0.24
          }
        ]
      },
      options: createBaseOptions(
        metrics,
        {
          stacked: true,
          min: 0,
          max: 1,
          ticks: {
            color: "#7f90a7",
            callback(value) {
              return `${Math.round(value * 100)}%`;
            }
          }
        },
        (context) => `${format(context.parsed.y * 100, 0)}%`
      )
    });
  }

  function heatmapColor(value) {
    const ratio = clamp(value / 5, 0, 1);
    const hue = 42 - ratio * 38;
    const lightness = 96 - ratio * 42;
    return `hsl(${hue} 88% ${lightness}%)`;
  }

  function renderHeatmap(metrics) {
    const container = document.getElementById("viewerHtml");
    container.innerHTML = "";

    const shell = document.createElement("div");
    shell.className = "heatmap-shell";

    const legend = document.createElement("div");
    legend.className = "legend-inline";
    [
      { label: t("calm"), color: "hsl(42 88% 92%)" },
      { label: t("medium"), color: "hsl(18 88% 72%)" },
      { label: t("severe"), color: "hsl(4 82% 56%)" }
    ].forEach((item) => {
      const legendItem = document.createElement("span");
      legendItem.className = "legend-item";
      legendItem.innerHTML = `<i class="legend-dot" style="background:${item.color};"></i><span>${item.label}</span>`;
      legend.appendChild(legendItem);
    });

    const grid = document.createElement("div");
    grid.className = "heatmap-grid";
    grid.style.gridTemplateColumns = `repeat(${HEATMAP_COLUMNS}, minmax(0, 1fr))`;

    metrics.data.forEach((item) => {
      const cell = document.createElement("div");
      cell.className = "heatmap-cell";
      cell.style.background = heatmapColor(item.frag);
      cell.title = `${formatDateTime(item.timestamp)} - ${format(item.frag, 2)}`;
      grid.appendChild(cell);
    });

    shell.append(legend, grid);
    container.appendChild(shell);
  }

  function renderTimeline(metrics) {
    const container = document.getElementById("viewerHtml");
    container.innerHTML = "";
    container.classList.remove("timeline-shell");
    container.classList.add("timeline-shell");

    const lanes = [
      { label: t("eventStress"), color: buildChartColor("red", 0.84), isActive: (item) => item.events.stress },
      { label: t("eventSleep"), color: buildChartColor("orange", 0.84), isActive: (item) => item.events.badSleep },
      { label: t("eventAlcohol"), color: buildChartColor("warm", 0.88), isActive: (item) => item.events.alcohol },
      { label: t("eventDesat"), color: buildChartColor("red", 0.96), isActive: (item) => item.spo2 < 95 }
    ];

    lanes.forEach((lane) => {
      const row = document.createElement("div");
      row.className = "timeline-row";

      const label = document.createElement("div");
      label.className = "timeline-label";
      label.textContent = lane.label;

      const track = document.createElement("div");
      track.className = "timeline-track";

      metrics.data.forEach((item) => {
        const cell = document.createElement("div");
        cell.className = "timeline-cell";
        if (lane.isActive(item)) {
          cell.classList.add("is-active");
          cell.style.background = lane.color;
        }
        cell.title = `${formatDateTime(item.timestamp)} - ${lane.label}`;
        track.appendChild(cell);
      });

      row.append(label, track);
      container.appendChild(row);
    });
  }

  function setText(id, value) {
    const node = document.getElementById(id);
    if (node) {
      node.textContent = value;
    }
  }

  function setHtml(id, value) {
    const node = document.getElementById(id);
    if (node) {
      node.innerHTML = value;
    }
  }
})();
