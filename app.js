const roleLibrary = {
  api: { label: "主药", color: "#2563eb", items: ["原料药"] },
  filler: { label: "填充剂", color: "#0f766e", items: ["乳糖", "微晶纤维素", "甘露醇", "预胶化淀粉", "磷酸氢钙"] },
  disintegrant: { label: "崩解剂", color: "#d97706", items: ["交联羧甲纤维素钠", "交联聚维酮", "羧甲淀粉钠", "低取代羟丙纤维素"] },
  binder: { label: "黏合剂", color: "#7c3aed", items: ["PVP K30", "HPMC E5", "HPC-L", "淀粉浆"] },
  functional: { label: "功能辅料", color: "#0891b2", items: ["十二烷基硫酸钠", "泊洛沙姆188", "枸橼酸", "碳酸氢钠", "HPMC K100M"] },
  lubricant: { label: "润滑剂", color: "#b42318", items: ["硬脂酸镁", "硬脂富马酸钠", "滑石粉", "硬脂酸"] },
  glidant: { label: "助流剂", color: "#64748b", items: ["胶态二氧化硅", "滑石粉"] },
  coating: { label: "包衣材料", color: "#9333ea", items: ["薄膜包衣预混剂", "HPMC", "胃溶型包衣粉", "肠溶型包衣粉"] },
  solvent: { label: "工艺溶剂", color: "#475569", items: ["纯化水", "乙醇", "异丙醇"] },
  other: { label: "其他辅料", color: "#334155", items: ["着色剂", "矫味剂", "pH调节剂", "抗氧剂", "防腐剂", "其他"] }
};

const baseRoles = ["api", "filler", "disintegrant", "functional", "lubricant", "other"];
const timepointColors = ["#2563eb", "#0f766e", "#d97706", "#7c3aed", "#b42318", "#0891b2", "#64748b", "#9333ea"];

const state = {
  project: {
    name: "",
    stage: "初始处方筛选",
    developmentType: "仿制药"
  },
  api: {
    name: "",
    strength: "",
    bcs: "",
    solubility: "",
    flow: "",
    properties: ""
  },
  product: {
    dosageForm: "片剂",
    qtpp: ""
  },
  reference: {
    name: "",
    batchNo: "",
    evidence: ""
  },
  formula: {
    model: "",
    basis: "参考原研/参比处方",
    rationale: ""
  },
  components: [],
  cqa: [],
  risks: [],
  batches: [],
  dissolution: {
    timepoints: "5,10,15,20,30,45,60",
    rule: "f2≥50判定相似",
    curves: []
  }
};

const defaultCqa = [
  { name: "性状/外观", target: "符合目标剂型要求，无明显缺陷", critical: "否", relation: "低", rationale: "通常不直接影响安全性和有效性，但影响患者可接受性和放行外观。", tracked: true },
  { name: "含量", target: "95.0%-105.0%", critical: "是", relation: "高", rationale: "含量偏离会影响安全性和有效性，处方和工艺均可能影响。", tracked: true },
  { name: "含量均匀度", target: "符合药典规定，AV≤15", critical: "是", relation: "高", rationale: "低剂量或混合均匀性风险较高时，需要在处方筛选中重点评价。", tracked: true },
  { name: "溶出度及溶出曲线", target: "与参比制剂相似", critical: "是", relation: "高", rationale: "溶出可能影响体内暴露，处方变量和压片/包衣参数均可产生影响。", tracked: true },
  { name: "有关物质", target: "符合拟定质量标准", critical: "是", relation: "中", rationale: "辅料相容性、湿热过程、pH环境可能影响降解。", tracked: true },
  { name: "晶型/粒度", target: "制剂过程中无不利变化", critical: "是", relation: "中", rationale: "晶型和粒度可能影响溶出、稳定性和含量均匀度。", tracked: true },
  { name: "残留溶剂", target: "符合药典/ICH限度", critical: "是", relation: "低", rationale: "若处方工艺不使用有机溶剂，可不作为处方筛选重点。", tracked: false },
  { name: "微生物限度", target: "符合药典规定", critical: "是", relation: "低", rationale: "通常由生产条件和控制策略保证，处方筛选阶段一般不作为重点变量。", tracked: false }
];

const sampleState = {
  project: {
    name: "阿哌沙班片处方开发",
    stage: "处方优化",
    developmentType: "仿制药"
  },
  api: {
    name: "阿哌沙班",
    strength: "2.5 mg/片",
    bcs: "III",
    solubility: "高",
    flow: "一般",
    properties: "低剂量品种，需关注含量均匀度；参考公开资料和参比制剂解析结果确定初始处方。"
  },
  product: {
    dosageForm: "片剂",
    qtpp: "口服速释包衣片；与参比制剂在多介质中溶出曲线相似；含量、含量均匀度、有关物质符合拟定质量标准；片剂硬度和崩解满足包衣及使用要求。"
  },
  reference: {
    name: "Eliquis",
    batchNo: "ACG6744A, ACK5860S",
    evidence: "参考说明书、公开审评资料、专利信息及参比制剂解析结果。反向工程提示乳糖约占包衣片49%左右，处方含乳糖、微晶纤维素、交联羧甲纤维素钠、十二烷基硫酸钠、硬脂酸镁和薄膜包衣材料。"
  },
  formula: {
    model: "F-OPT",
    basis: "参考原研/参比处方",
    rationale: "以参比制剂公开信息和反向工程结果为基础，先建立初始处方，再围绕崩解剂、填充剂、润滑剂、促渗剂和包衣增重开展单因素筛选。"
  },
  components: [
    { role: "api", name: "阿哌沙班", mg: 2.5, percent: 2.5, note: "主药" },
    { role: "filler", name: "乳糖", mg: 55, percent: 55, note: "填充剂，参考参比制剂解析结果" },
    { role: "filler", name: "微晶纤维素", mg: 36.5, percent: 36.5, note: "填充剂/可压性调节" },
    { role: "disintegrant", name: "交联羧甲纤维素钠", mg: 4, percent: 4, note: "崩解剂" },
    { role: "functional", name: "十二烷基硫酸钠", mg: 1, percent: 1, note: "促渗/润湿" },
    { role: "lubricant", name: "硬脂酸镁", mg: 1, percent: 1, note: "润滑剂" },
    { role: "coating", name: "薄膜包衣预混剂（胃溶型）", mg: 3, percent: 3, note: "包衣材料" }
  ],
  cqa: clone(defaultCqa),
  risks: [
    { variable: "原料药粒度", cqa: "含量、溶出度及溶出曲线", level: "中", rationale: "低剂量品种需关注混合均匀性，粒度也可能影响早期溶出。", strategy: "控制API粒度分布，必要时开展粒度水平对比。" },
    { variable: "乳糖/微晶纤维素比例", cqa: "含量均匀度、硬度、溶出度及溶出曲线", level: "中", rationale: "填充剂比例影响粉体流动性、可压性和片剂孔隙结构。", strategy: "考察51.0:40.5、53.0:38.5、55.0:36.5等比例。" },
    { variable: "交联羧甲纤维素钠用量", cqa: "崩解时间、溶出度及溶出曲线", level: "中", rationale: "崩解剂用量直接影响片剂崩解和早期释放。", strategy: "考察2%、4%、6%、8%，比较pH1.2溶出曲线。" },
    { variable: "硬脂酸镁用量", cqa: "溶出度及溶出曲线", level: "中", rationale: "润滑剂疏水性可能降低早期溶出。", strategy: "考察0.75%、1.0%、1.25%，结合压片需求确定。" },
    { variable: "十二烷基硫酸钠用量", cqa: "溶出度及溶出曲线", level: "低", rationale: "用量较低，但其润湿和促渗作用可能影响溶出。", strategy: "考察0.8%、1.0%、1.2%，以溶出曲线为主评价。" },
    { variable: "包衣增重", cqa: "外观、崩解时间、溶出度及溶出曲线", level: "中", rationale: "包衣增重可能影响崩解和溶出，同时影响外观和操作难度。", strategy: "考察2%-5%，确定可操作范围。" }
  ],
  batches: [
    { batchNo: "24031801", variable: "交联羧甲纤维素钠用量", level: "4%", scale: "6000片", process: "片面光滑，无粘冲", weightVariation: "-3.91%~4.01%", hardness: "46.96", disintegration: "3min30s~3min48s", av: "", note: "崩解剂比例筛选批" },
    { batchNo: "24070803", variable: "乳糖/微晶纤维素比例", level: "55.0:36.5", scale: "小试", process: "片面完整、光滑", weightVariation: "", hardness: "", disintegration: "", av: "", note: "填充剂比例优化批" },
    { batchNo: "24042601", variable: "硬脂酸镁用量", level: "0.75%", scale: "6000片", process: "流动和压片正常", weightVariation: "-1.48%~1.48%", hardness: "39.93", disintegration: "2min21s~2min57s", av: "", note: "润滑剂比例筛选批" }
  ],
  dissolution: {
    timepoints: "5,10,15,20,30,45,60",
    rule: "f2≥50判定相似",
    curves: [
      { id: uid(), sample: "ACK5860S", type: "参比", medium: "pH1.2", n: 12, values: "27.4,65.5,78.4,85.1,91.5,95.4,97.1", f2: "", decision: "参比" },
      { id: uid(), sample: "24070801", type: "自研", medium: "pH1.2", n: 6, values: "54.1,73.4,81.4,86.2,91.6,95.7,97.5", f2: "65", decision: "相似" },
      { id: uid(), sample: "24070802", type: "自研", medium: "pH1.2", n: 6, values: "59.1,77.0,84.5,89.1,94.2,97.9,99.4", f2: "55", decision: "相似" },
      { id: uid(), sample: "24070803", type: "自研", medium: "pH1.2", n: 6, values: "58.5,75.8,83.4,87.9,92.9,96.4,97.5", f2: "58", decision: "相似" }
    ]
  }
};

const refs = {};

function uid() {
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function $(id) {
  return document.getElementById(id);
}

function getPath(target, path) {
  return path.split(".").reduce((obj, key) => obj?.[key], target);
}

function setPath(target, path, value) {
  const keys = path.split(".");
  const last = keys.pop();
  const parent = keys.reduce((obj, key) => obj[key], target);
  parent[last] = value;
}

function num(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function parseNumberList(value) {
  return String(value || "")
    .split(/[,，;；\s]+/)
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item));
}

function setupRefs() {
  [
    "cqaCoverage", "riskCount", "batchCount", "decisionLabel", "referenceLinks",
    "cqaBody", "riskBody", "componentsBody", "batchBody", "dissolutionBody",
    "dissolutionChart", "compositionChart", "qualityPanel", "recommendations", "reportText"
  ].forEach((id) => {
    refs[id] = $(id);
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

function hydrateInputs() {
  document.querySelectorAll("[data-bind]").forEach((el) => {
    el.value = getPath(state, el.dataset.bind) ?? "";
  });
}

function setupTabs() {
  document.querySelectorAll(".tab").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
      button.classList.add("active");
      $(`${button.dataset.tab}`).classList.add("active");
      render();
    });
  });
}

function setupActions() {
  $("loadSampleBtn").addEventListener("click", loadSample);
  $("saveBtn").addEventListener("click", saveDraft);
  $("exportBtn").addEventListener("click", exportWorkspace);
  $("buildReferenceLinksBtn").addEventListener("click", buildReferenceLinks);
  $("addCqaBtn").addEventListener("click", addCqa);
  $("resetCqaBtn").addEventListener("click", resetCqa);
  $("addRiskBtn").addEventListener("click", addRisk);
  $("seedRiskBtn").addEventListener("click", seedRisksFromFormula);
  $("addComponentBtn").addEventListener("click", addComponent);
  $("resetFormulaBtn").addEventListener("click", resetFormula);
  $("addBatchBtn").addEventListener("click", addBatch);
  $("generateBatchBtn").addEventListener("click", generateFactorBatches);
  $("addDissolutionBtn").addEventListener("click", addDissolutionCurve);
  $("calculateF2Btn").addEventListener("click", calculateAllF2);
  $("copyReportBtn").addEventListener("click", copyReport);
  $("exportReportBtn").addEventListener("click", exportReportText);
}

function ensureDefaults() {
  if (!state.cqa.length) state.cqa = clone(defaultCqa);
  if (!state.components.length) state.components = baseRoles.map((role) => ({
    role,
    name: role === "api" ? (state.api.name || "原料药") : "",
    mg: "",
    percent: 0,
    note: ""
  }));
}

function addCqa() {
  state.cqa.push({ name: "", target: "", critical: "是", relation: "中", rationale: "", tracked: true });
  render();
}

function resetCqa() {
  state.cqa = clone(defaultCqa);
  render();
}

function updateCqa(index, key, value) {
  if (key === "tracked") {
    state.cqa[index][key] = value === "true";
  } else {
    state.cqa[index][key] = value;
  }
  render();
}

function removeCqa(index) {
  state.cqa.splice(index, 1);
  render();
}

function addRisk() {
  state.risks.push({ variable: "", cqa: "", level: "中", rationale: "", strategy: "" });
  render();
}

function updateRisk(index, key, value) {
  state.risks[index][key] = value;
  render();
}

function removeRisk(index) {
  state.risks.splice(index, 1);
  render();
}

function seedRisksFromFormula() {
  const generated = [];
  const hasRole = (role) => state.components.some((item) => item.role === role && (item.name || Number(item.percent) > 0));

  if (state.api.name) {
    generated.push({
      variable: "原料药粒度/晶型",
      cqa: "含量均匀度、溶出度及溶出曲线、有关物质",
      level: state.api.solubility === "低" || state.api.bcs === "II" || state.api.bcs === "IV" ? "高" : "中",
      rationale: "API理化性质可能影响混合均匀性、溶出行为和稳定性。",
      strategy: "建立API粒度、晶型和关键理化性质控制，并在筛选批中观察溶出和含量均匀度。"
    });
  }
  if (hasRole("filler")) {
    generated.push({
      variable: "填充剂种类/比例",
      cqa: "含量、含量均匀度、硬度、溶出度及溶出曲线",
      level: "中",
      rationale: "填充剂影响粉体流动性、可压性和片剂孔隙结构。",
      strategy: "设置填充剂比例或种类单因素筛选，评价压片情况、含量均匀度、硬度和溶出。"
    });
  }
  if (hasRole("disintegrant")) {
    generated.push({
      variable: "崩解剂用量/加入方式",
      cqa: "崩解时间、溶出度及溶出曲线",
      level: "中",
      rationale: "崩解剂直接影响片剂崩解和早期溶出。",
      strategy: "设置2%-8%或适合剂型的梯度，必要时比较内加、外加和内外加。"
    });
  }
  if (hasRole("functional")) {
    generated.push({
      variable: "功能辅料用量",
      cqa: "溶出度及溶出曲线、有关物质",
      level: state.api.solubility === "低" ? "中" : "低",
      rationale: "润湿剂、促渗剂或pH调节剂可能改善溶出，也可能引入相容性风险。",
      strategy: "设置低、中、高用量梯度，结合溶出曲线和有关物质判断。"
    });
  }
  if (hasRole("lubricant")) {
    generated.push({
      variable: "润滑剂用量/混合时间",
      cqa: "硬度、崩解时间、溶出度及溶出曲线",
      level: "中",
      rationale: "疏水性润滑剂过量或过混可能降低早期溶出。",
      strategy: "比较0.75%、1.0%、1.25%或同等梯度，并记录混合时间。"
    });
  }
  if (hasRole("coating")) {
    generated.push({
      variable: "包衣增重",
      cqa: "外观、崩解时间、溶出度及溶出曲线",
      level: "中",
      rationale: "包衣增重影响外观、崩解和溶出，同时影响物料成本和操作性。",
      strategy: "设置2%-5%范围筛选，确定可操作增重范围。"
    });
  }
  state.risks = generated;
  render();
}

function addComponent() {
  state.components.push({ role: "other", name: "", mg: "", percent: 0, note: "" });
  render();
}

function resetFormula() {
  state.components = baseRoles.map((role) => ({
    role,
    name: role === "api" ? (state.api.name || "原料药") : "",
    mg: "",
    percent: 0,
    note: ""
  }));
  render();
}

function updateComponent(index, key, value) {
  state.components[index][key] = key === "mg" || key === "percent" ? (num(value) ?? value) : value;
  if (key === "role") {
    const current = state.components[index];
    if (!current.name && roleLibrary[value]?.items?.[0]) current.name = roleLibrary[value].items[0];
  }
  render();
}

function removeComponent(index) {
  state.components.splice(index, 1);
  render();
}

function addBatch() {
  state.batches.push({
    batchNo: "",
    variable: "",
    level: "",
    scale: "",
    process: "",
    weightVariation: "",
    hardness: "",
    disintegration: "",
    av: "",
    note: ""
  });
  render();
}

function updateBatch(index, key, value) {
  state.batches[index][key] = value;
  render();
}

function removeBatch(index) {
  state.batches.splice(index, 1);
  render();
}

function generateFactorBatches() {
  const risk = state.risks.find((item) => item.level === "高" || item.level === "中") || state.risks[0];
  const variable = risk?.variable || "处方变量";
  const levels = inferLevels(variable);
  const prefix = `F${state.batches.length + 1}`;
  levels.forEach((level, index) => {
    state.batches.push({
      batchNo: `${prefix}-${index + 1}`,
      variable,
      level,
      scale: "小试",
      process: "",
      weightVariation: "",
      hardness: "",
      disintegration: "",
      av: "",
      note: "自动生成，待录入实验结果"
    });
  });
  render();
}

function inferLevels(variable) {
  if (variable.includes("崩解")) return ["2%", "4%", "6%", "8%"];
  if (variable.includes("润滑")) return ["0.75%", "1.0%", "1.25%"];
  if (variable.includes("包衣")) return ["2%", "3%", "4%", "5%"];
  if (variable.includes("填充")) return ["51.0:40.5", "53.0:38.5", "55.0:36.5"];
  if (variable.includes("功能") || variable.includes("促渗") || variable.includes("十二烷基")) return ["0.8%", "1.0%", "1.2%"];
  return ["低水平", "中水平", "高水平"];
}

function addDissolutionCurve() {
  state.dissolution.curves.push({
    id: uid(),
    sample: "",
    type: state.dissolution.curves.some((item) => item.type === "参比") ? "自研" : "参比",
    medium: "pH1.2",
    n: 6,
    values: "",
    f2: "",
    decision: ""
  });
  render();
}

function updateDissolution(index, key, value) {
  state.dissolution.curves[index][key] = key === "n" ? (num(value) ?? value) : value;
  if (["values", "type", "medium"].includes(key)) {
    state.dissolution.curves[index].f2 = "";
    state.dissolution.curves[index].decision = state.dissolution.curves[index].type === "参比" ? "参比" : "";
  }
  render();
}

function removeDissolution(index) {
  state.dissolution.curves.splice(index, 1);
  render();
}

function calculateAllF2() {
  const references = state.dissolution.curves.filter((curve) => curve.type === "参比");
  state.dissolution.curves.forEach((curve) => {
    if (curve.type === "参比") {
      curve.f2 = "";
      curve.decision = "参比";
      return;
    }
    const reference = references.find((item) => item.medium === curve.medium) || references[0];
    if (!reference) {
      curve.f2 = "";
      curve.decision = "缺少参比";
      return;
    }
    const refValues = parseNumberList(reference.values);
    const testValues = parseNumberList(curve.values);
    const f2 = calculateF2(refValues, testValues);
    curve.f2 = f2 === null ? "" : String(f2);
    curve.decision = judgeSimilarity(refValues, testValues, f2);
  });
  render();
}

function calculateF2(reference, test) {
  let pairs = reference.map((ref, index) => [ref, test[index]]).filter((pair) => Number.isFinite(pair[0]) && Number.isFinite(pair[1]));
  if (pairs.length > 3 && pairs[0][0] < 40 && Math.abs(pairs[0][0] - pairs[0][1]) > 20) {
    pairs = pairs.slice(1);
  }
  if (pairs.length < 3) return null;
  const meanSquare = pairs.reduce((sum, [ref, val]) => sum + (ref - val) ** 2, 0) / pairs.length;
  const f2 = 50 * Math.log10(100 / Math.sqrt(1 + meanSquare));
  return Math.max(0, Math.round(f2));
}

function judgeSimilarity(reference, test, f2) {
  const enoughFast = reference.length && test.length && reference.some((ref, index) => ref >= 85 && test[index] >= 85 && parseNumberList(state.dissolution.timepoints)[index] <= 15);
  if (state.dissolution.rule === "15min均≥85%可认为相似" && enoughFast) return "相似，15min≥85%";
  if (f2 === null) return "待补充";
  return f2 >= 50 ? "相似" : "不相似";
}

function buildReferenceLinks() {
  const query = [state.api.name, state.project.name, state.reference.name, state.api.strength].filter(Boolean).join(" ").trim();
  if (!query) {
    refs.referenceLinks.innerHTML = `<div class="empty-state">请先填写API、项目名称或参比制剂名称。</div>`;
    return;
  }
  const encoded = encodeURIComponent(query);
  const links = [
    ["Google综合", `https://www.google.com/search?q=${encodeURIComponent(`${query} reference formulation dissolution inactive ingredients`)}`],
    ["DailyMed", `https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=${encoded}`],
    ["Drugs@FDA", `https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm?event=BasicSearch.process&searchterm=${encoded}`],
    ["Orange Book", `https://www.accessdata.fda.gov/scripts/cder/ob/search_product.cfm?search_term=${encoded}`],
    ["专利/审评报告", `https://www.google.com/search?q=${encodeURIComponent(`${query} patent assessment report excipients`)}`]
  ];
  refs.referenceLinks.innerHTML = links.map(([label, url]) => `
    <div class="reference-link">
      <span class="reference-label">${label}</span>
      <a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>
    </div>
  `).join("");
}

function evaluateWorkspace() {
  const recommendations = [];
  const cqaCritical = state.cqa.filter((item) => item.critical === "是");
  const cqaTracked = cqaCritical.filter((item) => item.tracked);
  const cqaCoverage = cqaCritical.length ? Math.round((cqaTracked.length / cqaCritical.length) * 100) : 0;
  const highRisk = state.risks.filter((item) => item.level === "高" || item.level === "中");
  const curves = state.dissolution.curves.filter((item) => item.type === "自研");
  const similarCurves = curves.filter((item) => String(item.decision).startsWith("相似"));
  const bestCurve = chooseBestCurve();
  const totalPercent = state.components
    .filter((item) => !["coating", "solvent"].includes(item.role))
    .reduce((sum, item) => sum + (num(item.percent) || 0), 0);

  if (!state.reference.evidence && state.project.developmentType === "仿制药") {
    recommendations.push("补充参比制剂说明书、审评报告、专利、反向工程或公开辅料线索，明确初始处方依据。");
  }
  if (cqaCoverage < 80) {
    recommendations.push("关键质量属性覆盖不足，建议明确哪些CQA进入处方筛选评价，尤其是含量均匀度、溶出曲线和有关物质。");
  }
  if (!highRisk.length) {
    recommendations.push("尚未建立中高风险处方变量，建议按填充剂、崩解剂、润滑剂、功能辅料、包衣增重等建立风险矩阵。");
  }
  if (!state.batches.length) {
    recommendations.push("尚未录入筛选批次，建议先按最高风险变量生成单因素筛选批次并记录制备情况。");
  }
  if (Math.abs(totalPercent - 100) > 0.2 && totalPercent > 0) {
    recommendations.push(`当前处方比例合计为${totalPercent.toFixed(1)}%，建议归一至100.0%后再用于批次设计。`);
  }
  if (!curves.length) {
    recommendations.push("尚未录入自研样品溶出曲线，无法计算f2和形成处方优选结论。");
  } else if (!similarCurves.length) {
    recommendations.push("当前自研曲线尚未判定与参比相似，建议优先调整影响溶出的中高风险变量。");
  }
  if (bestCurve) {
    recommendations.push(`当前优先推荐${bestCurve.sample}，其${bestCurve.medium}介质下${bestCurve.decision}${bestCurve.f2 ? `，f2=${bestCurve.f2}` : ""}。`);
  }
  if (!recommendations.length) {
    recommendations.push("现有信息支持进入重复批验证、工艺参数范围确认和注册资料草稿整理。");
  }

  return {
    cqaCoverage,
    riskCount: highRisk.length,
    batchCount: state.batches.length,
    totalPercent,
    bestCurve,
    recommendations
  };
}

function chooseBestCurve() {
  const selfCurves = state.dissolution.curves.filter((curve) => curve.type === "自研");
  const pool = selfCurves.some((curve) => String(curve.decision).startsWith("相似"))
    ? selfCurves.filter((curve) => String(curve.decision).startsWith("相似"))
    : selfCurves;
  const candidates = pool
    .map((curve) => ({
      ...curve,
      score: num(curve.f2) ?? (String(curve.decision).startsWith("相似") ? 50 : 0)
    }))
    .sort((a, b) => b.score - a.score);
  return candidates[0] || null;
}

function renderCqa() {
  refs.cqaBody.innerHTML = "";
  state.cqa.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input class="wide-input" value="${escapeHtml(item.name)}" placeholder="质量属性"></td>
      <td><input class="wide-input" value="${escapeHtml(item.target)}" placeholder="目标/限度"></td>
      <td><select>${options(["是", "否", "是*"], item.critical)}</select></td>
      <td><select>${options(["高", "中", "低"], item.relation)}</select></td>
      <td><textarea>${escapeHtml(item.rationale)}</textarea><label class="inline-check"><select>${options(["true", "false"], String(item.tracked))}</select></label></td>
      <td><button class="delete-btn" type="button">删除</button></td>
    `;
    const [name, target, critical, relation, rationale, tracked] = row.querySelectorAll("input, select, textarea");
    name.addEventListener("input", (event) => updateCqa(index, "name", event.target.value));
    target.addEventListener("input", (event) => updateCqa(index, "target", event.target.value));
    critical.addEventListener("change", (event) => updateCqa(index, "critical", event.target.value));
    relation.addEventListener("change", (event) => updateCqa(index, "relation", event.target.value));
    rationale.addEventListener("input", (event) => updateCqa(index, "rationale", event.target.value));
    tracked.addEventListener("change", (event) => updateCqa(index, "tracked", event.target.value));
    row.querySelector("button").addEventListener("click", () => removeCqa(index));
    refs.cqaBody.append(row);
  });
}

function renderRisks() {
  refs.riskBody.innerHTML = "";
  state.risks.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input class="wide-input" value="${escapeHtml(item.variable)}" placeholder="如：崩解剂用量"></td>
      <td><input class="wide-input" value="${escapeHtml(item.cqa)}" placeholder="影响的CQA"></td>
      <td><select>${options(["高", "中", "低"], item.level)}</select></td>
      <td><textarea>${escapeHtml(item.rationale)}</textarea></td>
      <td><textarea>${escapeHtml(item.strategy)}</textarea></td>
      <td><button class="delete-btn" type="button">删除</button></td>
    `;
    const [variable, cqa, level, rationale, strategy] = row.querySelectorAll("input, select, textarea");
    variable.addEventListener("input", (event) => updateRisk(index, "variable", event.target.value));
    cqa.addEventListener("input", (event) => updateRisk(index, "cqa", event.target.value));
    level.addEventListener("change", (event) => updateRisk(index, "level", event.target.value));
    rationale.addEventListener("input", (event) => updateRisk(index, "rationale", event.target.value));
    strategy.addEventListener("input", (event) => updateRisk(index, "strategy", event.target.value));
    row.querySelector("button").addEventListener("click", () => removeRisk(index));
    refs.riskBody.append(row);
  });
}

function renderComponents() {
  refs.componentsBody.innerHTML = "";
  state.components.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><select>${roleOptions(item.role)}</select></td>
      <td><input list="ingredient-${index}" class="wide-input" value="${escapeHtml(item.name)}" placeholder="成分/型号">${ingredientList(index, item.role)}</td>
      <td><input type="number" step="0.001" class="small-input" value="${escapeHtml(item.mg)}"></td>
      <td><input type="number" step="0.01" class="small-input" value="${escapeHtml(item.percent)}"></td>
      <td><input class="wide-input" value="${escapeHtml(item.note)}" placeholder="依据、型号、加入方式"></td>
      <td><button class="delete-btn" type="button">删除</button></td>
    `;
    const [role, name, mg, percent, note] = row.querySelectorAll("select, input");
    role.addEventListener("change", (event) => updateComponent(index, "role", event.target.value));
    name.addEventListener("input", (event) => updateComponent(index, "name", event.target.value));
    mg.addEventListener("input", (event) => updateComponent(index, "mg", event.target.value));
    percent.addEventListener("input", (event) => updateComponent(index, "percent", event.target.value));
    note.addEventListener("input", (event) => updateComponent(index, "note", event.target.value));
    row.querySelector("button").addEventListener("click", () => removeComponent(index));
    refs.componentsBody.append(row);
  });
}

function renderBatches() {
  refs.batchBody.innerHTML = "";
  state.batches.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input value="${escapeHtml(item.batchNo)}" placeholder="批号"></td>
      <td><input class="wide-input" value="${escapeHtml(item.variable)}" placeholder="变量"></td>
      <td><input value="${escapeHtml(item.level)}" placeholder="水平"></td>
      <td><input value="${escapeHtml(item.scale)}" placeholder="批量"></td>
      <td><input class="wide-input" value="${escapeHtml(item.process)}" placeholder="压片/制备情况"></td>
      <td><input value="${escapeHtml(item.weightVariation)}" placeholder="-3.0%~3.0%"></td>
      <td><input value="${escapeHtml(item.hardness)}" placeholder="N"></td>
      <td><input value="${escapeHtml(item.disintegration)}" placeholder="min/s"></td>
      <td><input value="${escapeHtml(item.av)}" placeholder="AV"></td>
      <td><input class="wide-input" value="${escapeHtml(item.note)}" placeholder="备注"></td>
      <td><button class="delete-btn" type="button">删除</button></td>
    `;
    const fields = ["batchNo", "variable", "level", "scale", "process", "weightVariation", "hardness", "disintegration", "av", "note"];
    row.querySelectorAll("input").forEach((input, inputIndex) => {
      input.addEventListener("input", (event) => updateBatch(index, fields[inputIndex], event.target.value));
    });
    row.querySelector("button").addEventListener("click", () => removeBatch(index));
    refs.batchBody.append(row);
  });
}

function renderDissolution() {
  refs.dissolutionBody.innerHTML = "";
  state.dissolution.curves.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input class="wide-input" value="${escapeHtml(item.sample)}" placeholder="样品/批号"></td>
      <td><select>${options(["参比", "自研"], item.type)}</select></td>
      <td><input value="${escapeHtml(item.medium)}" placeholder="pH1.2"></td>
      <td><input type="number" class="small-input" value="${escapeHtml(item.n)}"></td>
      <td><input class="wide-input" value="${escapeHtml(item.values)}" placeholder="5,10,15...对应溶出%"></td>
      <td><input class="small-input" value="${escapeHtml(item.f2)}" placeholder="自动"></td>
      <td><input value="${escapeHtml(item.decision)}" placeholder="判断"></td>
      <td><button class="delete-btn" type="button">删除</button></td>
    `;
    const fields = ["sample", "type", "medium", "n", "values", "f2", "decision"];
    row.querySelectorAll("input, select").forEach((input, inputIndex) => {
      input.addEventListener("input", (event) => updateDissolution(index, fields[inputIndex], event.target.value));
      input.addEventListener("change", (event) => updateDissolution(index, fields[inputIndex], event.target.value));
    });
    row.querySelector("button").addEventListener("click", () => removeDissolution(index));
    refs.dissolutionBody.append(row);
  });
  renderDissolutionChart();
}

function renderDissolutionChart() {
  const svg = refs.dissolutionChart;
  const timepoints = parseNumberList(state.dissolution.timepoints);
  const curves = state.dissolution.curves
    .map((curve) => ({ ...curve, valuesArray: parseNumberList(curve.values) }))
    .filter((curve) => curve.valuesArray.length && timepoints.length);
  const width = 760;
  const height = 360;
  const margin = { left: 48, right: 18, top: 24, bottom: 44 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const maxTime = Math.max(...timepoints, 60);
  svg.innerHTML = "";

  const line = (x1, y1, x2, y2, cls) => `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"></line>`;
  const text = (x, y, value, anchor = "middle") => `<text class="chart-label" x="${x}" y="${y}" text-anchor="${anchor}">${value}</text>`;
  svg.insertAdjacentHTML("beforeend", line(margin.left, margin.top, margin.left, margin.top + plotHeight, "chart-axis"));
  svg.insertAdjacentHTML("beforeend", line(margin.left, margin.top + plotHeight, margin.left + plotWidth, margin.top + plotHeight, "chart-axis"));
  [0, 20, 40, 60, 80, 100].forEach((tick) => {
    const y = margin.top + plotHeight - (tick / 100) * plotHeight;
    svg.insertAdjacentHTML("beforeend", line(margin.left, y, margin.left + plotWidth, y, "chart-grid"));
    svg.insertAdjacentHTML("beforeend", text(margin.left - 8, y + 4, tick, "end"));
  });
  timepoints.forEach((tick) => {
    const x = margin.left + (tick / maxTime) * plotWidth;
    svg.insertAdjacentHTML("beforeend", line(x, margin.top, x, margin.top + plotHeight, "chart-grid"));
    svg.insertAdjacentHTML("beforeend", text(x, margin.top + plotHeight + 20, tick));
  });
  svg.insertAdjacentHTML("beforeend", text(margin.left + plotWidth / 2, height - 8, "时间 min"));
  svg.insertAdjacentHTML("beforeend", text(12, margin.top + plotHeight / 2, "溶出%"));

  curves.forEach((curve, index) => {
    const color = timepointColors[index % timepointColors.length];
    const points = curve.valuesArray.map((value, valueIndex) => {
      const x = margin.left + ((timepoints[valueIndex] || 0) / maxTime) * plotWidth;
      const y = margin.top + plotHeight - (Math.max(0, Math.min(value, 110)) / 110) * plotHeight;
      return [x, y, value];
    });
    const d = points.map(([x, y], pointIndex) => `${pointIndex ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
    svg.insertAdjacentHTML("beforeend", `<path class="chart-line" d="${d}" stroke="${color}"></path>`);
    points.forEach(([x, y]) => {
      svg.insertAdjacentHTML("beforeend", `<circle class="chart-point" cx="${x}" cy="${y}" r="4" fill="${color}"></circle>`);
    });
    const legendY = 22 + index * 18;
    svg.insertAdjacentHTML("beforeend", `<rect x="${width - 190}" y="${legendY - 10}" width="10" height="10" fill="${color}"></rect>`);
    svg.insertAdjacentHTML("beforeend", `<text class="chart-legend" x="${width - 174}" y="${legendY}">${escapeHtml(curve.sample || curve.type)} ${escapeHtml(curve.medium || "")}</text>`);
  });
}

function renderSummary(evaluation) {
  refs.compositionChart.innerHTML = "";
  const totals = Object.entries(roleLibrary).map(([role, config]) => ({
    role,
    label: config.label,
    value: state.components.filter((item) => item.role === role).reduce((sum, item) => sum + (num(item.percent) || 0), 0)
  })).filter((item) => item.value > 0);
  if (!totals.length) {
    refs.compositionChart.innerHTML = `<div class="empty-state">录入处方组成后生成概览。</div>`;
  } else {
    totals.forEach((item) => {
      const row = document.createElement("div");
      row.className = "bar-row";
      row.innerHTML = `
        <span>${item.label}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.min(item.value, 100)}%; background:${roleLibrary[item.role].color}"></div></div>
        <strong>${item.value.toFixed(1)}%</strong>
      `;
      refs.compositionChart.append(row);
    });
  }

  const qualities = [
    ["CQA覆盖率", `${evaluation.cqaCoverage}%`, evaluation.cqaCoverage >= 80 ? "good" : "warn"],
    ["中高风险项", `${evaluation.riskCount}项`, evaluation.riskCount ? "warn" : "good"],
    ["筛选批次", `${evaluation.batchCount}批`, evaluation.batchCount ? "good" : "warn"],
    ["处方比例合计", `${evaluation.totalPercent.toFixed(1)}%`, Math.abs(evaluation.totalPercent - 100) <= 0.2 ? "good" : "warn"],
    ["推荐批次", evaluation.bestCurve?.sample || "待判断", evaluation.bestCurve ? "good" : "warn"]
  ];
  refs.qualityPanel.innerHTML = qualities.map(([label, value, status]) => `
    <div class="quality-item"><span>${label}</span><span class="badge ${status}">${value}</span></div>
  `).join("");

  refs.recommendations.innerHTML = evaluation.recommendations.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  refs.reportText.textContent = buildReport(evaluation);
}

function renderStatus(evaluation) {
  refs.cqaCoverage.textContent = `${evaluation.cqaCoverage}%`;
  refs.cqaCoverage.style.color = evaluation.cqaCoverage >= 80 ? "var(--green)" : "var(--amber)";
  refs.riskCount.textContent = String(evaluation.riskCount);
  refs.riskCount.style.color = evaluation.riskCount ? "var(--amber)" : "var(--green)";
  refs.batchCount.textContent = String(evaluation.batchCount);
  refs.batchCount.style.color = evaluation.batchCount ? "var(--green)" : "var(--amber)";
  refs.decisionLabel.textContent = evaluation.bestCurve ? `推荐 ${evaluation.bestCurve.sample}` : "待评价";
  refs.decisionLabel.style.color = evaluation.bestCurve ? "var(--green)" : "var(--amber)";
}

function buildReport(evaluation) {
  const cqaLines = state.cqa
    .filter((item) => item.tracked || item.critical === "是")
    .map((item) => `${item.name || "[待补充]"}：目标为${item.target || "[待补充]"}，${item.critical === "是" ? "列为关键质量属性" : "暂不列为关键质量属性"}；处方相关性${item.relation || "[待评价]"}。依据：${item.rationale || "[待补充判断依据]"}`)
    .join("\n");
  const riskLines = state.risks.map((item) => `${item.variable || "[待补充变量]"}对${item.cqa || "[待补充CQA]"}的风险评估为${item.level || "[待评价]"}。${item.rationale || "[待补充风险说明]"}筛选策略：${item.strategy || "[待补充]"}`).join("\n");
  const formulaLines = state.components.map((item) => `${item.name || "[待补充]"}：${item.mg || "[待补充]"} mg/单位剂量，占${item.percent || 0}%，作用为${roleLibrary[item.role]?.label || item.role}${item.note ? `；${item.note}` : ""}。`).join("\n");
  const batchLines = state.batches.map((item) => `${item.batchNo || "[待补充批号]"}：考察${item.variable || "[待补充变量]"}，水平${item.level || "[待补充]"}，批量${item.scale || "[待补充]"}。制备情况：${item.process || "[待补充]"}；片重差异${item.weightVariation || "[待补充]"}；硬度${item.hardness || "[待补充]"}；崩解时间${item.disintegration || "[待补充]"}；含量均匀度AV ${item.av || "[待补充]"}。${item.note || ""}`).join("\n");
  const dissolutionLines = state.dissolution.curves.map((item) => `${item.sample || "[待补充样品]"}（${item.type}，${item.medium}，n=${item.n || "[待补充]"}）：${item.values || "[待补充溶出数据]"}；${item.type === "参比" ? "作为参比曲线。" : `相似性判断：${item.decision || "[待计算]"}${item.f2 ? `，f2=${item.f2}` : ""}。`}`).join("\n");
  const recLines = evaluation.recommendations.map((item, index) => `${index + 1}. ${item}`).join("\n");
  const finalFormula = state.components
    .filter((item) => item.name)
    .map((item) => `${item.name}\t${item.mg || "[待补充]"} mg\t${item.percent || 0}%\t${roleLibrary[item.role]?.label || item.role}`)
    .join("\n");

  return [
    "3.2.P.2.2.1 处方开发过程（草稿）",
    "",
    "一、研究依据与开发目标",
    `本品为${state.project.name || "[待补充项目名称]"}，规格为${state.api.strength || "[待补充规格]"}，剂型为${state.product.dosageForm || "[待补充剂型]"}，研发类型为${state.project.developmentType || "[待补充]"}。处方开发参考${state.reference.name || "[待补充参比/原研名称]"}相关公开资料、参比制剂解析结果及原料药理化性质开展。`,
    `原料药关键性质：${state.api.name || "[待补充API]"}，BCS分类${state.api.bcs || "[待确定]"}，水中溶解性${state.api.solubility || "[待评价]"}，粉体流动性${state.api.flow || "[待评价]"}。${state.api.properties || ""}`,
    `目标产品概况：${state.product.qtpp || "[待补充QTPP]"}`,
    `原研/参比依据：${state.reference.evidence || "[待补充原研信息、审评报告、专利、反向工程或溶出曲线依据]"}`,
    "",
    "二、关键质量属性识别",
    cqaLines || "[待补充CQA表]",
    "",
    "三、初始处方设计",
    `处方型号：${state.formula.model || "[待补充]"}；处方依据：${state.formula.basis || "[待补充]"}。${state.formula.rationale || ""}`,
    formulaLines || "[待补充处方组成]",
    "",
    "四、处方变量风险评估",
    riskLines || "[待补充风险评估矩阵]",
    "",
    "五、处方筛选试验与结果",
    batchLines || "[待补充筛选批次和检测结果]",
    "",
    "六、溶出曲线比较与处方优选",
    dissolutionLines || "[待补充参比和自研批次溶出曲线]",
    evaluation.bestCurve ? `综合当前溶出评价，优先推荐${evaluation.bestCurve.sample}作为后续处方验证批次。` : "当前尚不能形成明确处方优选结论，需补充参比和自研样品溶出曲线及关键质量结果。",
    "",
    "七、最终处方组成（当前建议版）",
    "成分\t每片用量\t处方比例\t作用",
    finalFormula || "[待补充最终处方]",
    "",
    "八、下一步研究建议",
    recLines
  ].join("\n");
}

function options(values, selected) {
  return values.map((value) => `<option value="${escapeHtml(value)}"${String(value) === String(selected) ? " selected" : ""}>${displayOption(value)}</option>`).join("");
}

function displayOption(value) {
  if (value === "true") return "纳入筛选";
  if (value === "false") return "不作重点";
  return value;
}

function roleOptions(selected) {
  return Object.entries(roleLibrary).map(([value, config]) => `<option value="${value}"${value === selected ? " selected" : ""}>${config.label}</option>`).join("");
}

function ingredientList(index, role) {
  const optionsHtml = (roleLibrary[role]?.items || []).map((item) => `<option value="${escapeHtml(item)}"></option>`).join("");
  return `<datalist id="ingredient-${index}">${optionsHtml}</datalist>`;
}

function saveDraft() {
  localStorage.setItem("fangyan-formucore-workspace", JSON.stringify(state));
  alert("草稿已保存到当前浏览器。");
}

function loadDraft() {
  const raw = localStorage.getItem("fangyan-formucore-workspace") || localStorage.getItem("dulang-formulation-workspace");
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    Object.assign(state, parsed);
  } catch {
    localStorage.removeItem("fangyan-formucore-workspace");
  }
}

function loadSample() {
  Object.assign(state, clone(sampleState));
  hydrateInputs();
  render();
}

function exportWorkspace() {
  const evaluation = evaluateWorkspace();
  const payload = {
    exportedAt: new Date().toISOString(),
    state,
    evaluation,
    report: buildReport(evaluation)
  };
  downloadFile(`fangyan-formucore-workspace-${Date.now()}.json`, JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
  downloadFile(`fangyan-formucore-report-${Date.now()}.txt`, payload.report, "text/plain;charset=utf-8");
}

function exportReportText() {
  downloadFile(`fangyan-formucore-report-${Date.now()}.txt`, refs.reportText.textContent, "text/plain;charset=utf-8");
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

async function copyReport() {
  try {
    await navigator.clipboard.writeText(refs.reportText.textContent);
    alert("报告草稿已复制。");
  } catch {
    alert("当前浏览器不允许直接复制，可手动选中报告文本。");
  }
}

function render() {
  ensureDefaults();
  renderCqa();
  renderRisks();
  renderComponents();
  renderBatches();
  renderDissolution();
  const evaluation = evaluateWorkspace();
  renderSummary(evaluation);
  renderStatus(evaluation);
}

setupRefs();
setupTabs();
setupBindings();
setupActions();
loadDraft();
hydrateInputs();
render();
