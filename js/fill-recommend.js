(function(){
  const R=window.RecommendAPI,S=window.StorageAPI;
  const basis=R.getRecommendBasis();
  document.getElementById("basis").innerHTML=basis.targetJob
    ? `<strong>목표 직무</strong> · ${basis.targetJob.name}<br><strong>채울 역량</strong> · ${basis.tags.join(", ") || "부족한 역량이 없어요"}`
    : basis.source==="interest"
      ? `<strong>목표 직무가 없습니다.</strong> 관심 태그 기준으로 추천합니다.<br><strong>관심 태그</strong> · ${basis.tags.join(", ")}`
      : basis.source==="records"
        ? `<strong>목표 직무가 없습니다.</strong> 기록한 역량을 기준으로 추천합니다.<br><strong>기록한 역량</strong> · ${basis.tags.join(", ")}`
        : `<strong>목표 직무가 없습니다.</strong> 새로운 경험을 탐색해 보세요.<br><strong>관심 태그</strong> · 아직 설정되지 않았어요`;

  function badge(c){const d=R.getDday(c.deadline);const n=parseInt(d.replace("D-",""),10);return `<span class="${d==="마감"||d==="D-DAY"||n<=3?"badge-danger":"badge-normal"}">${d}</span>`}
  function card(c){const scraped=S.getScraps().includes(c.id);return `<article class="contest-card" data-id="${c.id}"><div class="card-head"><h3>${c.title}</h3>${badge(c)}</div><p class="muted">${c.host} · ${c.field}</p><div class="tag-row">${c.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div>${c.reason?`<p class="reason">${c.reason}</p>`:""}<button class="scrap-btn" data-scrap="${c.id}">${scraped?"스크랩 해제":"스크랩"}</button></article>`}
  document.getElementById("recommended").innerHTML=R.recommendContests(6).map(card).join("");

  const fields=["전체",...new Set(CONTESTS.map(c=>c.field))];
  let active="전체";
  document.getElementById("filters").innerHTML=fields.map(f=>`<button class="chip-outline ${f==="전체"?"active":""}" data-field="${f}">${f}</button>`).join("");
  function renderAll(){
    let list=CONTESTS.filter(c=>active==="전체"||c.field===active);
    const q=document.getElementById("search").value.trim();
    if(q){const fuse=new Fuse(list,{keys:["title","host","field","tags"],threshold:.35});list=fuse.search(q).map(r=>r.item)}
    if(document.getElementById("sort").value==="deadline")list=[...list].sort((a,b)=>dayjs(a.deadline)-dayjs(b.deadline));else list=[...list].sort((a,b)=>a.title.localeCompare(b.title,"ko"));
    document.getElementById("allContests").innerHTML=list.map(card).join("");
  }
  renderAll();
  document.getElementById("filters").addEventListener("click",e=>{const b=e.target.closest("[data-field]");if(!b)return;active=b.dataset.field;document.querySelectorAll("[data-field]").forEach(x=>x.classList.toggle("active",x===b));renderAll()});
  document.getElementById("search").addEventListener("input",renderAll);
  document.getElementById("sort").addEventListener("change",renderAll);
  document.addEventListener("click",e=>{const s=e.target.closest("[data-scrap]");if(s){e.stopPropagation();S.toggleScrap(s.dataset.scrap);renderAll();document.getElementById("recommended").innerHTML=R.recommendContests(6).map(card).join("");return}const cardEl=e.target.closest(".contest-card");if(cardEl)location.href=`fill-detail.html?id=${encodeURIComponent(cardEl.dataset.id)}`});
})();
