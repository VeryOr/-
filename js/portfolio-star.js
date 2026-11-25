(function(){
  const id=new URLSearchParams(location.search).get("record");
  const record=window.StorageAPI.getRecords().find(item=>item.id===id);
  const container=document.getElementById("portfolioRecord");
  if(!record){
    container.textContent="요청한 경험 기록을 찾을 수 없습니다.";
    return;
  }

  const title=document.createElement("h2");
  title.textContent=record.title||"제목 없는 기록";
  const meta=document.createElement("p");
  meta.className="muted";
  meta.textContent=[record.date,record.result,record.role].filter(Boolean).join(" · ");
  const content=document.createElement("p");
  content.style.whiteSpace="pre-line";
  content.textContent=record.content||"기록된 내용이 없습니다.";
  const tags=document.createElement("div");
  tags.className="tag-row";
  (Array.isArray(record.tags)?record.tags:[]).forEach(value=>{
    const tag=document.createElement("span");
    tag.className="tag";
    tag.textContent=value;
    tags.appendChild(tag);
  });
  container.replaceChildren(title,meta,content,tags);

  const contest=window.RecommendAPI.getContest(record.contestId);
  if(contest){
    const link=document.createElement("a");
    link.className="secondary-btn";
    link.href=`fill-detail.html?id=${encodeURIComponent(contest.id)}`;
    link.textContent="공고 상세 보기";
    container.appendChild(link);
  }
})();
