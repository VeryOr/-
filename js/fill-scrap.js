(function(){
  const S=window.StorageAPI,R=window.RecommendAPI;
  const statuses=["관심","준비 중","제출 완료","결과"];
  document.getElementById("scrapBoard").innerHTML=statuses.map(status=>`<section class="kanban-col" data-status="${status}"><h3>${status}</h3><div class="scrap-items"></div></section>`).join("");
  let states={};
  try {
    const stored=JSON.parse(localStorage.getItem("scrapStatus")||"{}");
    if(stored&&typeof stored==="object"&&!Array.isArray(stored))states=stored;
  } catch (error) {
    console.warn("스크랩 상태를 불러오지 못했습니다. 기본 상태로 표시합니다.",error);
  }
  const scraps=S.getScraps();
  scraps.forEach(id=>{
    const c=R.getContest(id);
    if(!c)return;
    const status=statuses.includes(states[id])?states[id]:"관심";
    const col=document.querySelector(`[data-status="${status}"] .scrap-items`);
    const el=document.createElement("article");
    el.className="contest-card";
    el.style.marginBottom="8px";
    const title=document.createElement("strong");
    title.textContent=c.title;
    const deadline=document.createElement("p");
    deadline.className="muted";
    deadline.textContent=R.getDday(c.deadline);
    const statusLabel=document.createElement("label");
    statusLabel.textContent="진행 상태 ";
    const select=document.createElement("select");
    select.setAttribute("aria-label",`${c.title} 진행 상태`);
    statuses.forEach(value=>{
      const option=document.createElement("option");
      option.value=value;
      option.textContent=value;
      option.selected=value===status;
      select.appendChild(option);
    });
    select.addEventListener("change",()=>{
      states[id]=select.value;
      localStorage.setItem("scrapStatus",JSON.stringify(states));
      document.querySelector(`[data-status="${select.value}"] .scrap-items`).appendChild(el);
    });
    statusLabel.appendChild(select);
    const detail=document.createElement("a");
    detail.className="scrap-btn";
    detail.href=`fill-detail.html?id=${encodeURIComponent(c.id)}`;
    detail.textContent="상세 보기";
    const remove=document.createElement("button");
    remove.className="scrap-btn";
    remove.type="button";
    remove.dataset.remove=c.id;
    remove.textContent="삭제";
    el.append(title,deadline,statusLabel,detail,remove);
    col.appendChild(el);
  });
  document.addEventListener("click",e=>{
    const remove=e.target.closest("[data-remove]");
    if(remove){S.toggleScrap(remove.dataset.remove);location.reload()}
  });
})();
