(function(){
  const id=new URLSearchParams(location.search).get("id"), c=window.RecommendAPI.getContest(id), S=window.StorageAPI;
  if(!c){document.getElementById("title").textContent="공고를 찾을 수 없습니다.";return}
  document.getElementById("title").textContent=c.title;
  const dday=window.RecommendAPI.getDday(c.deadline);
  const ddayNumber=parseInt(dday.replace("D-",""),10);
  document.getElementById("dday").innerHTML=`<span class="${dday==="마감"||dday==="D-DAY"||ddayNumber<=3?"badge-danger":"badge-normal"}">${dday}</span>`;
  document.getElementById("summary").innerHTML=`<dt>주최</dt><dd>${c.host}</dd><dt>접수 기간</dt><dd>${c.period}</dd><dt>대상</dt><dd>${c.target}</dd><dt>시상</dt><dd>${c.prize}</dd><dt>제출물</dt><dd>${c.submission}</dd><dt>팀/개인</dt><dd>${c.type}</dd><dt>분야</dt><dd>${c.field}</dd>`;
  document.getElementById("skills").innerHTML=c.tags.map(t=>`<span class="tag">${t}</span>`).join("");
  const basis=window.RecommendAPI.getRecommendBasis();
  const counts=S.getTagCounts();
  const matchingBasisTags=c.tags.filter(t=>basis.tags.includes(t));
  const matchingRecordTags=c.tags.filter(t=>counts[t]);
  const fitTags=[...new Set([...matchingBasisTags,...matchingRecordTags])];
  const fitRate=basis.tags.length
    ? Math.round(matchingBasisTags.length/basis.tags.length*100)
    : (matchingRecordTags.length ? Math.round(matchingRecordTags.length/c.tags.length*100) : 0);
  document.getElementById("fit").innerHTML=`
    <strong style="font-size:24px">${fitRate}% 적합</strong>
    <p class="muted">${basis.targetJob?"목표 직무와 겹치는 역량":basis.source==="records"?"기록한 역량과 겹치는 태그":"관심 태그와 겹치는 역량"} · ${fitTags.join(", ")||"아직 겹치는 역량이 없어요"}</p>
  `;
  const records=S.getRecords().filter(r=>(r.tags||[]).some(t=>c.tags.includes(t)));
  document.getElementById("records").innerHTML=records.length?records.slice(0,5).map(r=>{
    const overlap=(r.tags||[]).filter(t=>c.tags.includes(t));
    return `<div class="record-item"><strong>${r.title||"제목 없음"}</strong><p class="muted" style="margin:4px 0 0">겹치는 태그: ${overlap.join(", ")}</p></div>`;
  }).join(""):`<p class="muted">겹치는 기록이 아직 없어요. 이 공모전을 참여한 경험을 남기면 여기에 표시됩니다.</p>`;
  const scrap=S.getScraps().includes(c.id);
  document.getElementById("actions").innerHTML=`<button class="scrap-btn" id="scrap">${scrap?"스크랩 해제":"스크랩"}</button><a class="secondary-btn" href="${c.url}" target="_blank" rel="noopener noreferrer">공식 페이지</a><a class="primary-btn" href="fill-participate.html?contest=${encodeURIComponent(c.id)}">참여했어요</a>`;
  document.getElementById("scrap").addEventListener("click",e=>{const active=S.toggleScrap(c.id);e.currentTarget.textContent=active?"스크랩 해제":"스크랩"});
})();
