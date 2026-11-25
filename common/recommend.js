window.RecommendAPI = (() => {
  function getRecommendBasis() {
    const s = window.StorageAPI;
    const user = s.getUser();
    const counts = s.getTagCounts();
    let targetJob = null;
    if (user.targetJob) targetJob = JOBS.find(j => j.id === user.targetJob || j.name === user.targetJob) || null;
    if (targetJob) {
      const gaps = Object.entries(targetJob.skills)
        .map(([tag, needed]) => ({ tag, needed, level: counts[tag] || 0 }))
        .sort((a,b) => (a.level/a.needed) - (b.level/b.needed));
      const gapTags = gaps.filter(x => x.level < x.needed).slice(0, 3).map(x => x.tag);
      return { targetJob, tags: gapTags, gaps, source:"job", isInterest:false };
    }
    const interestTags = user.testResult?.tempTags?.filter(Boolean) || [];
    if (interestTags.length) return { targetJob:null, tags:interestTags, gaps:[], source:"interest", isInterest:true };
    const recordTags = [...new Set(window.StorageAPI.getRecords().flatMap(r => r.tags || []).filter(Boolean))];
    return { targetJob:null, tags:recordTags, gaps:[], source:recordTags.length ? "records" : "none", isInterest:false };
  }

  function recommendContests(limit = 6) {
    const basis = getRecommendBasis();
    return CONTESTS.map(contest => {
      const overlap = basis.tags.filter(tag => contest.tags.includes(tag));
      let reason;
      if (basis.source === "interest") reason = overlap.length ? `관심 있는 ${overlap[0]}와 관련 있어요` : "새로운 분야의 경험을 탐색해 보세요";
      else if (basis.source === "records") reason = overlap.length ? `기록한 ${overlap[0]} 역량을 넓혀보세요` : "기록한 역량을 바탕으로 경험을 넓혀보세요";
      else if (basis.source === "job") reason = overlap.length ? `${overlap[0]} 경험이 없어서 추천했어요` : "목표 직무와 관련된 경험을 넓혀보세요";
      else reason = "새로운 분야의 경험을 탐색해 보세요";
      return { ...contest, overlapCount: overlap.length, reason };
    }).filter(c => c.deadline && dayjs(c.deadline).endOf("day").isAfter(dayjs()))
      .sort((a,b) => b.overlapCount - a.overlapCount || dayjs(a.deadline).diff(dayjs(b.deadline))).slice(0, limit);
  }

  function getContest(id) { return CONTESTS.find(c => c.id === id) || null; }

  function getDday(deadline) {
    const diff = dayjs(deadline).endOf("day").diff(dayjs().startOf("day"), "day");
    if (diff < 0) return "마감";
    if (diff === 0) return "D-DAY";
    return `D-${diff}`;
  }
  return { getRecommendBasis, recommendContests, getContest, getDday };
})();
