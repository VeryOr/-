window.calcJobMatches = function () {
  const s = window.StorageAPI;
  const counts = s.getTagCounts();
  const user = s.getUser();
  const tempTags = user.testResult?.tempTags || [];
  const recordCount = s.getRecords().length;
  const tempWeight = recordCount < 3 ? 0.4 : recordCount < 7 ? 0.2 : 0;

  return JOBS.map(job => {
    let score = 0;
    Object.entries(job.skills).forEach(([tag, needed]) => {
      const recordLevel = counts[tag] || 0;
      const tempLevel = tempTags.includes(tag) ? 1 : 0;
      const combined = recordLevel + tempWeight * tempLevel;
      score += Math.min(combined / needed, 1);
    });
    const rate = Math.round(score / Object.keys(job.skills).length * 100);
    return { job, rate };
  }).sort((a,b) => b.rate - a.rate);
};
