const excipientLibrary = {
  filler: {
    label: "填充剂",
    items: ["微晶纤维素 PH102", "乳糖一水合物", "甘露醇", "磷酸氢钙", "预胶化淀粉"]
  },
  binder: {
    label: "黏合剂",
    items: ["PVP K30", "HPMC E5", "HPC-L", "淀粉浆", "聚乙二醇 6000"]
  },
  disintegrant: {
    label: "崩解剂",
    items: ["交联羧甲纤维素钠", "交联聚维酮", "羧甲淀粉钠", "低取代羟丙纤维素"]
  },
  lubricant: {
    label: "润滑剂",
    items: ["硬脂酸镁", "硬脂富马酸钠", "滑石粉", "硬脂酸"]
  },
  glidant: {
    label: "助流剂",
    items: ["胶态二氧化硅", "滑石粉"]
  },
  functional: {
    label: "功能辅料",
    items: ["十二烷基硫酸钠", "泊洛沙姆 188", "枸橼酸", "碳酸氢钠", "HPMC K100M", "Eudragit L100"]
  },
  api: {
    label: "主药",
    items: ["原料药"]
  },
  other: {
    label: "其他辅料",
    items: ["着色剂", "矫味剂", "包衣材料", "pH调节剂", "抗氧剂", "防腐剂", "其他"]
  }
};

const requiredFormulaRoles = ["api", "filler", "disintegrant", "functional", "lubricant", "other"];

const state = {
  api: {
    name: "",
    formula: "",
    mw: "",
    strength: "",
    density: "",
    flow: "",
    solubility: "",
    pka: "",
    bcs: "",
    hygroscopicity: "",
    notes: ""
  },
  product: {
    name: "",
    dosageForm: "片剂",
    route: "口服",
    developmentType: "仿制药",
    referenceName: "",
    release: "速释",
    referenceInfo: "",
    qtpp: ""
  },
  formula: {
    model: "",
    basis: "参考原研/参比处方",
    rationale: ""
  },
  components: [],
  results: {
    avgWeight: "",
    weightRsd: "",
    hardness: "",
    friability: "",
    disintegration: "",
    contentUniformityAv: "",
    dissolution15: "",
    dissolution30: "",
    dissolution45: "",
    assay: "",
    observations: ""
  }
};

const sampleState = {
  api: {
    name: "示例API",
    formula: "C16H19N3O5S",
    mw: "365.4",
    strength: "100 mg/片",
    density: "0.62",
    flow: "较差",
    solubility: "低",
    pka: "4.1",
    bcs: "II",
    hygroscopicity: "中",
    notes: "水中溶解度低，粒径和润湿性可能影响早期溶出；粉体流动性一般。"
  },
  product: {
    name: "示例API片",
    dosageForm: "片剂",
    route: "口服",
    developmentType: "仿制药",
    referenceName: "参比制剂A",
    release: "速释",
    referenceInfo: "参比制剂为口服速释片，公开资料提示45 min溶出较完全，需进一步补充多介质溶出曲线。",
    qtpp: "片重约300 mg；硬度满足包装运输；崩解时间不超过15 min；45 min溶出不低于80%。"
  },
  formula: {
    model: "F0 初始筛选处方",
    basis: "参考原研/参比处方",
    rationale: "以参比制剂公开信息和速释片常规处方为基础，先建立包含主药、填充剂、崩解剂、功能辅料、润滑剂和其他辅料的初始处方。"
  },
  components: [
    { role: "api", name: "示例API", percent: 33.3, note: "100 mg/片" },
    { role: "filler", name: "微晶纤维素 PH102", percent: 43.2, note: "改善可压性" },
    { role: "disintegrant", name: "交联羧甲纤维素钠", percent: 4.0, note: "内外加比较" },
    { role: "binder", name: "PVP K30", percent: 3.0, note: "湿法制粒" },
    { role: "functional", name: "十二烷基硫酸钠", percent: 1.0, note: "润湿剂" },
    { role: "glidant", name: "胶态二氧化硅", percent: 0.5, note: "外加" },
    { role: "lubricant", name: "硬脂酸镁", percent: 1.0, note: "混合3 min" },
    { role: "filler", name: "乳糖一水合物", percent: 14.0, note: "调节片重" },
    { role: "other", name: "", percent: 0, note: "暂未设置" }
  ],
  results: {
    avgWeight: "300",
    weightRsd: "2.1",
    hardness: "62",
    friability: "0.42",
    disintegration: "11.5",
    contentUniformityAv: "8.2",
    dissolution15: "48",
    dissolution30: "72",
    dissolution45: "86",
    assay: "99.1",
    observations: "压片过程未见明显粘冲，崩解后少量颗粒聚集，45 min溶出达到预设目标。"
  }
};

const colorByRole = {
  api: "#2563eb",
  filler: "#0f766e",
  binder: "#7c3aed",
  disintegrant: "#d97706",
  lubricant: "#b42318",
  glidant: "#64748b",
  functional: "#0891b2",
  other: "#475569"
};

const roleSelect = document.getElementById("roleSelect");
const ingredientSelect = document.getElementById("ingredientSelect");
const percentInput = document.getElementById("percentInput");
const componentNote = document.getElementById("componentNote");
const componentsBody = document.getElementById("componentsBody");
const candidateList = document.getElementById("candidateList");
const totalPercent = document.getElementById("totalPercent");
const riskScore = document.getElementById("riskScore");
const stageLabel = document.getElementById("stageLabel");
const actionLabel = document.getElementById("actionLabel");
const compositionChart = document.getElementById("compositionChart");
const qualityPanel = document.getElementById("qualityPanel");
const recommendations = document.getElementById("recommendations");
const reportText = document.getElementById("reportText");
const referenceLinks = document.getElementById("referenceLinks");
const referenceExtracted = document.getElementById("referenceExtracted");

function getPath(target, path) {
  return path.split(".").reduce((obj, key) => obj?.[key], target);
}

function setPath(target, path, value) {
  const keys = path.split(".");
  const last = keys.pop();
  const parent = keys.reduce((obj, key) => obj[key], target);
  parent[last] = value;
}

function numberValue(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatPercent(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function hydrateInputs() {
  document.querySelectorAll("[data-bind]").forEach((el) => {
    const value = getPath(state, el.dataset.bind);
    el.value = value ?? "";
  });
}

function setupBindings() {
  document.querySelectorAll("[data-bind]").forEach((el) => {
    el.addEventListener("input", () => {
      setPath(state, el.dataset.bind, el.value);
      render();
    });
    el.addEventListener("change", () => {
      setPath(state, el.dataset.bind, el.value);
      render();
    });
  });
}

function setupTabs() {
  document.querySelectorAll(".tab").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
      button.classList.add("active");
      const panel = document.querySelector(`.tab-panel#${button.dataset.tab}`);
      if (panel) panel.classList.add("active");
      render();
    });
  });
}

function setupRoleSelectors() {
  if (!roleSelect || !ingredientSelect) return;
  Object.entries(excipientLibrary).forEach(([key, role]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = role.label;
    roleSelect.append(option);
  });
  roleSelect.value = "filler";
  roleSelect.addEventListener("change", refreshIngredientOptions);
  refreshIngredientOptions();
}

function refreshIngredientOptions() {
  if (!roleSelect || !ingredientSelect) return;
  const role = excipientLibrary[roleSelect.value];
  ingredientSelect.innerHTML = "";
  role.items.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    ingredientSelect.append(option);
  });
}

function addComponent() {
  if (!ingredientSelect) {
    state.components.push({
      role: "other",
      name: "",
      percent: 0,
      note: ""
    });
    render();
    return;
  }
  const percent = numberValue(percentInput.value);
  if (!ingredientSelect.value || percent === null || percent <= 0) {
    alert("请填写成分和大于0的比例。");
    return;
  }
  state.components.push({
    role: roleSelect.value,
    name: ingredientSelect.value,
    percent,
    note: componentNote.value.trim()
  });
  percentInput.value = "";
  componentNote.value = "";
  render();
}

function updateComponent(index, key, value, shouldRenderTable = true) {
  if (key === "percent") {
    state.components[index][key] = numberValue(value) ?? 0;
  } else {
    state.components[index][key] = value;
  }
  if (shouldRenderTable) {
    render();
  } else {
    renderDerivedViews();
  }
}

function removeComponent(index) {
  state.components.splice(index, 1);
  render();
}

function createBaseFormulaRows() {
  return requiredFormulaRoles.map((role) => ({
    role,
    name: role === "api" ? (state.api.name || "原料药") : "",
    percent: 0,
    note: ""
  }));
}

function ensureBaseFormulaRows() {
  if (state.components.length) return;
  state.components = createBaseFormulaRows();
}

function resetFormulaTemplate() {
  state.components = createBaseFormulaRows();
  candidateList.innerHTML = "";
  render();
}

function generateCandidates() {
  const apiPercent = estimateApiPercent();
  const lowSolubility = state.api.solubility === "低" || state.api.bcs === "II" || state.api.bcs === "IV";
  const poorFlow = state.api.flow === "较差" || state.api.flow === "黏性较强";
  const candidates = [
    {
      name: "F1 直接压片筛选",
      reason: "适合先快速判断API可压性、流动性和崩解风险。",
      rows: [
        ["api", state.api.name || "原料药", apiPercent, state.api.strength || ""],
        ["filler", "微晶纤维素 PH102", 100 - apiPercent - 8, "主填充/干黏合"],
        ["disintegrant", "交联羧甲纤维素钠", 4, "外加"],
        ["glidant", "胶态二氧化硅", poorFlow ? 1 : 0.5, "改善流动性"],
        ["lubricant", "硬脂酸镁", poorFlow ? 1 : 0.8, "控制混合时间"]
      ]
    },
    {
      name: "F2 湿法制粒速释",
      reason: "适合粉体流动性较差或含量均匀度风险较高的API。",
      rows: [
        ["api", state.api.name || "原料药", apiPercent, state.api.strength || ""],
        ["filler", "乳糖一水合物", 100 - apiPercent - 12, "稀释剂"],
        ["binder", "PVP K30", 3, "制粒黏合剂"],
        ["disintegrant", "交联聚维酮", 5, "内外加比较"],
        ["functional", lowSolubility ? "十二烷基硫酸钠" : "预胶化淀粉", lowSolubility ? 1 : 3, lowSolubility ? "润湿剂" : "辅助崩解/黏合"],
        ["lubricant", "硬脂富马酸钠", 1, "外加"]
      ]
    },
    {
      name: "F3 溶出强化处方",
      reason: "用于低溶解度或pH依赖API的早期溶出改善验证。",
      rows: [
        ["api", state.api.name || "原料药", apiPercent, state.api.strength || ""],
        ["filler", "甘露醇", 100 - apiPercent - 14, "亲水填充剂"],
        ["functional", lowSolubility ? "泊洛沙姆 188" : "枸橼酸", lowSolubility ? 2 : 1, "润湿/微环境pH"],
        ["disintegrant", "羧甲淀粉钠", 6, "提高崩解"],
        ["binder", "HPC-L", 3, "低黏度黏合剂"],
        ["glidant", "胶态二氧化硅", 1, "助流"],
        ["lubricant", "硬脂酸镁", 1, "外加"]
      ]
    }
  ].map(normalizeCandidate);

  candidateList.innerHTML = "";
  candidates.forEach((candidate) => {
    const node = document.createElement("article");
    node.className = "candidate";
    const lines = candidate.rows.map((row) => `<li>${excipientLibrary[row.role].label}：${row.name} ${row.percent.toFixed(1)}%</li>`).join("");
    node.innerHTML = `
      <h3>${candidate.name}</h3>
      <p>${candidate.reason}</p>
      <ul>${lines}</ul>
      <button type="button">采用该处方</button>
    `;
    node.querySelector("button").addEventListener("click", () => {
      state.components = candidate.rows.map((row) => ({
        role: row.role,
        name: row.name,
        percent: row.percent,
        note: row.note
      }));
      render();
    });
    candidateList.append(node);
  });
}

function buildReferenceLinks() {
  const terms = [
    state.product.referenceName,
    state.product.name,
    state.api.name,
    state.api.strength
  ].filter(Boolean).join(" ").trim();
  if (!terms) {
    referenceLinks.innerHTML = `<div class="empty-state">请先填写原料药名称、制剂名称或参比/原研名称。</div>`;
    return;
  }
  const googleBase = "https://www.google.com/search?q=";
  const links = [
    {
      label: "Google 综合",
      url: `${googleBase}${encodeURIComponent(`${terms} reference listed drug label original formulation dissolution`)}`,
      note: "先找说明书、审评资料、参比制剂和溶出信息。"
    },
    {
      label: "DailyMed 标签",
      url: `https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=${encodeURIComponent(terms)}`,
      note: "美国上市药品标签，可查剂型、规格、辅料和说明书版本。"
    },
    {
      label: "Drugs@FDA",
      url: `https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm?event=BasicSearch.process&searchterm=${encodeURIComponent(terms)}`,
      note: "FDA 批准信息、申请号、申请人和审批文件入口。"
    },
    {
      label: "Orange Book",
      url: `${googleBase}${encodeURIComponent(`site:accessdata.fda.gov/scripts/cder/ob ${terms} Orange Book RLD TE code`)}`,
      note: "用于核对 RLD、RS、TE code、剂型和规格。"
    },
    {
      label: "openFDA 标签API",
      url: `https://api.fda.gov/drug/label.json?search=${encodeURIComponent(`openfda.generic_name:"${state.api.name || terms}"`)}&limit=5`,
      note: "适合后续后端接入；浏览器中可先查看 JSON 是否命中。"
    },
    {
      label: "Google 处方线索",
      url: `${googleBase}${encodeURIComponent(`${terms} inactive ingredients excipients formulation patent assessment report`)}`,
      note: "检索公开辅料、专利、审评报告和处方反推线索。"
    }
  ];
  referenceLinks.innerHTML = links.map((item) => `
    <div class="reference-link">
      <span class="reference-label">${item.label}</span>
      <span><a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.url}</a><br>${item.note}</span>
    </div>
  `).join("");
}

function extractReferenceInfo() {
  const text = state.product.referenceInfo.trim();
  if (!text) {
    referenceExtracted.innerHTML = `<div class="empty-state">请先把说明书、Orange Book、Drugs@FDA 或公开资料内容粘贴到“原研信息导入”。</div>`;
    return;
  }
  const fields = [
    ["商品名/产品名", extractByPatterns(text, [/brand name[:：]\s*([^\n;；]+)/i, /proprietary name[:：]\s*([^\n;；]+)/i, /商品名[:：]\s*([^\n;；]+)/i])],
    ["通用名/API", extractByPatterns(text, [/generic name[:：]\s*([^\n;；]+)/i, /active ingredient[s]?[:：]\s*([^\n;；]+)/i, /通用名[:：]\s*([^\n;；]+)/i, /活性成分[:：]\s*([^\n;；]+)/i])],
    ["剂型", extractByPatterns(text, [/dosage form[:：]\s*([^\n;；]+)/i, /dosage forms? and strengths?[:：]\s*([^\n;；]+)/i, /剂型[:：]\s*([^\n;；]+)/i])],
    ["规格", extractByPatterns(text, [/strength[:：]\s*([^\n;；]+)/i, /strengths?[:：]\s*([^\n;；]+)/i, /规格[:：]\s*([^\n;；]+)/i, /(\d+(?:\.\d+)?\s?(?:mg|g|mcg|μg|ug|%))/i])],
    ["申请号", extractByPatterns(text, [/\b(NDA|ANDA|BLA)\s?(\d{3,6})\b/i, /application number[:：]\s*([^\n;；]+)/i, /申请号[:：]\s*([^\n;；]+)/i])],
    ["申请人/持有人", extractByPatterns(text, [/applicant[:：]\s*([^\n;；]+)/i, /manufacturer[:：]\s*([^\n;；]+)/i, /holder[:：]\s*([^\n;；]+)/i, /上市许可持有人[:：]\s*([^\n;；]+)/i])],
    ["RLD/RS/TE", extractByPatterns(text, [/\bRLD[:：]?\s*([^\n;；]+)/i, /\bRS[:：]?\s*([^\n;；]+)/i, /\bTE\s?Code[:：]?\s*([A-Z0-9]+)/i])],
    ["辅料线索", extractByPatterns(text, [/inactive ingredients?[:：]\s*([^\n]+)/i, /excipients?[:：]\s*([^\n]+)/i, /辅料[:：]\s*([^\n]+)/i])],
    ["溶出/质量线索", extractByPatterns(text, [/(dissolution[^\n]+)/i, /(溶出[^\n]+)/i, /(崩解[^\n]+)/i])]
  ];
  const rows = fields.filter(([, value]) => value);
  if (!rows.length) {
    referenceExtracted.innerHTML = `<div class="empty-state">未提取到明确字段。建议粘贴包含 Brand Name、Generic Name、Dosage Form、Strength、Inactive Ingredients、RLD 等标签的文本。</div>`;
    return;
  }
  referenceExtracted.innerHTML = rows.map(([label, value]) => `
    <div class="extracted-row">
      <span class="reference-label">${label}</span>
      <span>${escapeHtml(value)}</span>
    </div>
  `).join("");
}

function extractByPatterns(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match.slice(1).filter(Boolean).join(" ").trim().replace(/\s+/g, " ");
    }
  }
  return "";
}

function estimateApiPercent() {
  const strength = String(state.api.strength || "");
  const match = strength.match(/(\d+(?:\.\d+)?)/);
  const mg = match ? Number(match[1]) : null;
  if (!mg) return 30;
  if (mg <= 25) return 8;
  if (mg <= 100) return 30;
  if (mg <= 250) return 45;
  return 55;
}

function normalizeCandidate(candidate) {
  const total = candidate.rows.reduce((sum, row) => sum + row[2], 0);
  const diff = 100 - total;
  const filler = candidate.rows.find((row) => row[0] === "filler");
  if (filler) filler[2] = Math.max(5, filler[2] + diff);
  requiredFormulaRoles.forEach((role) => {
    if (!candidate.rows.some((row) => row[0] === role)) {
      candidate.rows.push([role, role === "api" ? (state.api.name || "原料药") : "", 0, ""]);
    }
  });
  return {
    ...candidate,
    rows: candidate.rows.map(([role, name, percent, note]) => ({ role, name, percent, note }))
  };
}

function roleTotal(role) {
  return state.components
    .filter((item) => item.role === role)
    .reduce((sum, item) => sum + (numberValue(item.percent) || 0), 0);
}

function totalComposition() {
  return state.components.reduce((sum, item) => sum + (numberValue(item.percent) || 0), 0);
}

function evaluate() {
  ensureBaseFormulaRows();
  const items = [];
  const recs = [];
  let score = 100;
  const total = totalComposition();
  const result = state.results;
  const lowSolubility = state.api.solubility === "低" || state.api.bcs === "II" || state.api.bcs === "IV";
  const lubricant = roleTotal("lubricant");
  const disintegrant = roleTotal("disintegrant");
  const functional = roleTotal("functional");

  if (!state.api.name) {
    score -= 8;
    recs.push("补充原料药名称、剂量规格、溶解性、pKa、吸湿性和粉体流动性，避免处方筛选缺少判断基础。");
  }
  if (Math.abs(total - 100) > 0.2) {
    score -= 15;
    recs.push(`当前处方总量为${formatPercent(total)}，建议先将各成分归一至100.0%，再比较不同处方。`);
  }
  const missingRoles = requiredFormulaRoles
    .filter((role) => !state.components.some((item) => item.role === role))
    .map((role) => excipientLibrary[role].label);
  if (missingRoles.length) {
    score -= 8;
    recs.push(`初始处方框缺少${missingRoles.join("、")}类别，建议补齐基础类别后再开展筛选。`);
  }
  if (state.product.developmentType === "仿制药" && !state.product.referenceInfo.trim()) {
    score -= 8;
    recs.push("仿制药项目建议补充参比制剂说明书、公开质量标准、多介质溶出曲线或原研处方线索。");
  }
  if (lowSolubility && functional < 0.5) {
    score -= 8;
    recs.push("API存在低溶解度或BCS II/IV风险，建议设置润湿剂、粒径控制或微环境pH调节处方进行对比。");
  }
  if (lubricant > 1.2) {
    score -= 6;
    recs.push("润滑剂比例偏高时需关注硬度、崩解和溶出下降，建议考察润滑剂种类、比例和混合时间。");
  }
  if (disintegrant < 2 && state.product.release === "速释") {
    score -= 6;
    recs.push("速释片处方中崩解剂比例偏低，建议设置2%至6%范围，并比较内加、外加和内外加组合。");
  }

  addQuality(items, "处方总量", total ? formatPercent(total) : "未录入", Math.abs(total - 100) <= 0.2 ? "good" : "bad");
  evaluateWeight(items, recs, result);
  evaluateRange(items, recs, "硬度", result.hardness, 40, 120, "N", "硬度偏低时关注压缩力、黏合剂和可压性；硬度过高时关注崩解和溶出。", score);
  score = adjustScoreByRange(score, result.hardness, 40, 120);
  score = evaluateUpper(items, recs, score, "脆碎度", result.friability, 1.0, "%", "脆碎度超过1.0%时，建议提高黏合剂水平、优化制粒粒度或调整压片压力。");
  score = evaluateUpper(items, recs, score, "崩解时间", result.disintegration, 15, "min", "崩解时间偏长，建议提高超级崩解剂比例、优化加入方式，并确认润滑剂混合是否过度。");
  score = evaluateUpper(items, recs, score, "含量均匀度AV", result.contentUniformityAv, 15, "", "含量均匀度风险偏高，建议优化混合顺序、API粒径分布、制粒方式或低剂量预混策略。");
  score = evaluateLower(items, recs, score, "45 min溶出", result.dissolution45, 80, "%", "45 min溶出低于80%，建议优先考察润湿剂、粒径、崩解剂、压片压力和溶出介质pH敏感性。");
  score = evaluateAssay(items, recs, score, result.assay);

  if (state.results.observations.includes("粘冲")) {
    score -= 5;
    recs.push("实验记录提示粘冲，建议比较润滑剂/助流剂、降低颗粒水分、调整冲模表面状态或压片速度。");
  }
  if (state.results.observations.includes("顶裂") || state.results.observations.includes("裂片")) {
    score -= 5;
    recs.push("实验记录提示顶裂或裂片，建议评估弹性回复、黏合剂水平、颗粒细粉比例和压片速度。");
  }
  if (recs.length === 0) {
    recs.push("当前录入数据未见明显处方或质量风险，可进入重复批验证、关键工艺参数范围确认和参比制剂对比。");
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  return { items, recs, score };
}

function addQuality(items, label, value, status) {
  items.push({ label, value, status });
}

function evaluateWeight(items, recs, result) {
  const avgWeight = numberValue(result.avgWeight);
  const rsd = numberValue(result.weightRsd);
  if (avgWeight === null || rsd === null) {
    addQuality(items, "片重差异", "未录入", "warn");
    return;
  }
  const limit = avgWeight <= 80 ? 10 : avgWeight < 250 ? 7.5 : 5;
  const status = rsd <= limit ? "good" : "bad";
  addQuality(items, "片重RSD", `${rsd}% / 参考限度${limit}%`, status);
  if (status === "bad") {
    recs.push("片重RSD超过当前片重区间的常用参考限度，建议优化颗粒流动性、装量稳定性和压片转速。");
  }
}

function evaluateRange(items, recs, label, raw, min, max, unit, rec) {
  const value = numberValue(raw);
  if (value === null) {
    addQuality(items, label, "未录入", "warn");
    return;
  }
  const status = value >= min && value <= max ? "good" : "warn";
  addQuality(items, label, `${value}${unit}`, status);
  if (status !== "good") recs.push(rec);
}

function adjustScoreByRange(score, raw, min, max) {
  const value = numberValue(raw);
  if (value === null) return score - 2;
  return value >= min && value <= max ? score : score - 5;
}

function evaluateUpper(items, recs, score, label, raw, limit, unit, rec) {
  const value = numberValue(raw);
  if (value === null) {
    addQuality(items, label, "未录入", "warn");
    return score - 2;
  }
  const status = value <= limit ? "good" : "bad";
  addQuality(items, label, `${value}${unit} / 参考限度${limit}${unit}`, status);
  if (status === "bad") {
    recs.push(rec);
    return score - 10;
  }
  return score;
}

function evaluateLower(items, recs, score, label, raw, limit, unit, rec) {
  const value = numberValue(raw);
  if (value === null) {
    addQuality(items, label, "未录入", "warn");
    return score - 2;
  }
  const status = value >= limit ? "good" : "bad";
  addQuality(items, label, `${value}${unit} / 目标不低于${limit}${unit}`, status);
  if (status === "bad") {
    recs.push(rec);
    return score - 12;
  }
  return score;
}

function evaluateAssay(items, recs, score, raw) {
  const value = numberValue(raw);
  if (value === null) {
    addQuality(items, "含量", "未录入", "warn");
    return score - 2;
  }
  const status = value >= 95 && value <= 105 ? "good" : "bad";
  addQuality(items, "含量", `${value}% / 参考范围95%-105%`, status);
  if (status === "bad") {
    recs.push("含量结果偏离95%至105%参考范围，建议先确认检测方法、样品均匀性和制备过程损失。");
    return score - 12;
  }
  return score;
}

function inferStage(score) {
  if (!state.components.length) return ["未开始", "建立初始处方"];
  if (score < 60) return ["风险较高", "调整处方变量"];
  if (score < 80) return ["处方优化", "补充对比实验"];
  return ["可推进", "重复批验证"];
}

function renderComponents() {
  ensureBaseFormulaRows();
  componentsBody.innerHTML = "";
  if (!state.components.length) {
    componentsBody.innerHTML = `<tr><td colspan="5" class="empty-state">尚未录入处方成分。</td></tr>`;
    return;
  }
  state.components.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><select aria-label="处方成分类别">${buildRoleOptions(item.role)}</select></td>
      <td><input list="ingredientOptions-${index}" value="${escapeHtml(item.name)}" aria-label="处方成分/型号" placeholder="填写成分名称或型号">${buildIngredientDatalist(index, item.role)}</td>
      <td><input type="number" step="0.1" value="${item.percent}" aria-label="比例"></td>
      <td><input value="${escapeHtml(item.note || "")}" aria-label="说明" placeholder="如：内加、外加、规格、型号或依据"></td>
      <td><button class="delete-btn" type="button">删除</button></td>
    `;
    const roleField = row.querySelector("select");
    const [nameInput, percentField, noteInput] = row.querySelectorAll("input");
    roleField.addEventListener("change", (event) => updateComponent(index, "role", event.target.value));
    nameInput.addEventListener("input", (event) => updateComponent(index, "name", event.target.value, false));
    percentField.addEventListener("input", (event) => updateComponent(index, "percent", event.target.value, false));
    noteInput.addEventListener("input", (event) => updateComponent(index, "note", event.target.value, false));
    row.querySelector("button").addEventListener("click", () => removeComponent(index));
    componentsBody.append(row);
  });
}

function buildRoleOptions(selectedRole) {
  return Object.entries(excipientLibrary).map(([role, config]) => {
    const selected = role === selectedRole ? " selected" : "";
    return `<option value="${role}"${selected}>${config.label}</option>`;
  }).join("");
}

function buildIngredientDatalist(index, role) {
  const items = excipientLibrary[role]?.items || [];
  const options = items.map((item) => `<option value="${escapeHtml(item)}"></option>`).join("");
  return `<datalist id="ingredientOptions-${index}">${options}</datalist>`;
}

function renderCompositionChart() {
  compositionChart.innerHTML = "";
  if (!state.components.length) {
    compositionChart.innerHTML = `<div class="empty-state">录入处方后自动生成组成图。</div>`;
    return;
  }
  const totals = Object.entries(excipientLibrary)
    .map(([role, config]) => ({ role, label: config.label, value: roleTotal(role) }))
    .filter((item) => item.value > 0);
  totals.forEach((item) => {
    const row = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = `
      <span>${item.label}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.min(item.value, 100)}%; background:${colorByRole[item.role] || "#0f766e"}"></div></div>
      <strong>${item.value.toFixed(1)}%</strong>
    `;
    compositionChart.append(row);
  });
}

function renderQuality(evaluation) {
  qualityPanel.innerHTML = "";
  evaluation.items.forEach((item) => {
    const node = document.createElement("div");
    node.className = "quality-item";
    node.innerHTML = `
      <span>${item.label}</span>
      <span><span class="badge ${item.status}">${item.value}</span></span>
    `;
    qualityPanel.append(node);
  });
}

function renderRecommendations(evaluation) {
  recommendations.innerHTML = "";
  evaluation.recs.forEach((rec) => {
    const li = document.createElement("li");
    li.textContent = rec;
    recommendations.append(li);
  });
}

function buildReport(evaluation) {
  const componentLines = state.components.length
    ? state.components.map((item) => `${excipientLibrary[item.role]?.label || item.role}：${item.name} ${Number(item.percent || 0).toFixed(1)}%${item.note ? `（${item.note}）` : ""}`).join("\n")
    : "尚未录入处方组成。";
  const qualityLines = evaluation.items.map((item) => `${item.label}：${item.value}`).join("\n");
  const recLines = evaluation.recs.map((item, index) => `${index + 1}. ${item}`).join("\n");
  return [
    "制剂处方筛选简要总结",
    "",
    `一、项目概况`,
    `原料药：${state.api.name || "未填写"}；剂量规格：${state.api.strength || "未填写"}；BCS分类：${state.api.bcs || "未确定"}；水中溶解性：${state.api.solubility || "未评估"}。`,
    `制剂：${state.product.name || "未填写"}；剂型：${state.product.dosageForm}；研发类型：${state.product.developmentType}；目标释放：${state.product.release}。`,
    state.product.referenceName ? `参比/原研：${state.product.referenceName}。` : "参比/原研：未填写。",
    `处方型号：${state.formula.model || "未填写"}；处方依据：${state.formula.basis || "未填写"}。`,
    state.formula.rationale ? `设计说明：${state.formula.rationale}` : "设计说明：未填写。",
    "",
    "二、处方组成",
    componentLines,
    "",
    "三、关键质量结果",
    qualityLines,
    state.results.observations ? `实验现象：${state.results.observations}` : "实验现象：未填写。",
    "",
    "四、初步判断与下一步建议",
    `当前风险评分：${evaluation.score}/100。`,
    recLines
  ].join("\n");
}

function renderReport(evaluation) {
  reportText.textContent = buildReport(evaluation);
}

function renderStatus(evaluation) {
  const total = totalComposition();
  const [stage, action] = inferStage(evaluation.score);
  totalPercent.textContent = formatPercent(total);
  totalPercent.style.color = Math.abs(total - 100) <= 0.2 ? "var(--green)" : "var(--red)";
  riskScore.textContent = `${evaluation.score}/100`;
  riskScore.style.color = evaluation.score >= 80 ? "var(--green)" : evaluation.score >= 60 ? "var(--amber)" : "var(--red)";
  stageLabel.textContent = stage;
  actionLabel.textContent = action;
}

function render() {
  renderComponents();
  renderDerivedViews();
}

function renderDerivedViews() {
  const evaluation = evaluate();
  renderCompositionChart();
  renderQuality(evaluation);
  renderRecommendations(evaluation);
  renderReport(evaluation);
  renderStatus(evaluation);
}

function saveDraft() {
  localStorage.setItem("formulation-screening-draft", JSON.stringify(state));
  alert("草稿已保存到当前浏览器。");
}

function loadDraft() {
  const raw = localStorage.getItem("formulation-screening-draft");
  if (!raw) return;
  try {
    Object.assign(state, clone(JSON.parse(raw)));
    hydrateInputs();
    render();
  } catch {
    localStorage.removeItem("formulation-screening-draft");
  }
}

function loadSample() {
  Object.assign(state, clone(sampleState));
  hydrateInputs();
  candidateList.innerHTML = "";
  render();
}

function exportReport() {
  const evaluation = evaluate();
  const payload = {
    exportedAt: new Date().toISOString(),
    state,
    evaluation,
    report: buildReport(evaluation)
  };
  downloadFile(`formulation-screening-${Date.now()}.json`, JSON.stringify(payload, null, 2), "application/json");
  downloadFile(`formulation-summary-${Date.now()}.txt`, payload.report, "text/plain;charset=utf-8");
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function copySummary() {
  try {
    await navigator.clipboard.writeText(reportText.textContent);
    alert("总结已复制。");
  } catch {
    alert("当前浏览器不允许直接复制，可手动选中总结文本。");
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

document.getElementById("addComponentBtn").addEventListener("click", addComponent);
document.getElementById("resetFormulaTemplateBtn").addEventListener("click", resetFormulaTemplate);
document.getElementById("generateCandidatesBtn").addEventListener("click", generateCandidates);
document.getElementById("buildReferenceLinksBtn").addEventListener("click", buildReferenceLinks);
document.getElementById("extractReferenceBtn").addEventListener("click", extractReferenceInfo);
document.getElementById("saveBtn").addEventListener("click", saveDraft);
document.getElementById("loadSampleBtn").addEventListener("click", loadSample);
document.getElementById("exportBtn").addEventListener("click", exportReport);
document.getElementById("copySummaryBtn").addEventListener("click", copySummary);

setupTabs();
setupBindings();
setupRoleSelectors();
loadDraft();
hydrateInputs();
render();
