window.StorageAPI = (() => {
  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (_) { return fallback; }
  };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const getUser = () => read("user", { nickname:"", userType:null, testResult:{ type:"", tempTags:[] }, targetJob:null });
  const saveUser = user => write("user", user);
  const getRecords = () => read("record", []);
  const saveRecord = record => { const records = getRecords(); record.id ||= `record-${Date.now()}-${Math.random().toString(36).slice(2,7)}`; record.date ||= new Date().toISOString().slice(0,10); records.unshift(record); write("record", records); return record; };
  const getProjects = () => read("project", []);
  const saveProject = project => { const projects = getProjects(); const i = projects.findIndex(p => p.id === project.id); i >= 0 ? projects[i] = project : projects.push(project); write("project", projects); return project; };
  const getScraps = () => read("scrap", []);
  const toggleScrap = id => { const scraps = getScraps(); const next = scraps.includes(id) ? scraps.filter(x => x !== id) : [...scraps, id]; write("scrap", next); return next.includes(id); };
  const getTagCounts = () => { const counts = {}; getRecords().forEach(r => (r.tags || []).forEach(tag => counts[tag] = (counts[tag] || 0) + 1)); return counts; };
  return { getUser, saveUser, getRecords, saveRecord, getProjects, saveProject, getScraps, toggleScrap, getTagCounts };
})();
