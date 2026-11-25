(function(){
  const id=new URLSearchParams(location.search).get("contest"), c=window.RecommendAPI.getContest(id), S=window.StorageAPI;
  if(c)document.getElementById("contestName").textContent=`공모전: ${c.title}`;
  else document.getElementById("contestName").textContent="공모전 참여 기록";
  const tags=["기획","디자인","개발","영상","글쓰기","협업","사용자 리서치","데이터 분석","발표"];
  document.getElementById("tagOptions").innerHTML=tags.map(t=>`<label><input type="checkbox" name="tag" value="${t}" ${c&&c.tags.includes(t)?"checked":""}> ${t}</label>`).join("");
  document.querySelectorAll('input[name="tag"]').forEach(input=>{
    input.addEventListener("change",()=>document.querySelector(".tag-options").removeAttribute("aria-invalid"));
  });
  document.getElementById("recordForm").addEventListener("submit",e=>{
    e.preventDefault();
    const selected=[...e.currentTarget.querySelectorAll('input[name="tag"]:checked')].map(x=>x.value);
    if(!selected.length){
      document.querySelector('.tag-options').setAttribute("aria-invalid","true");
      alert("역량 태그를 1개 이상 선택해주세요.");
      return;
    }
    const record=S.saveRecord({
      source:"공모전",
      contestId:id,
      result:document.getElementById("result").value,
      role:document.getElementById("role").value.trim(),
      title:c?c.title:"공모전 참여",
      content:`무엇을 배웠나요?\n${document.getElementById("learned").value.trim()}\n\n다음엔 뭘 다르게 할까요?\n${document.getElementById("next").value.trim()}`,
      tags:selected
    });
    const matches=typeof window.calcJobMatches==="function"?window.calcJobMatches():[];
    document.getElementById("saved").style.display="block";
    document.getElementById("matchText").textContent=matches[0]?`바뀐 매칭률: ${matches[0].job.name} ${matches[0].rate}%`:"매칭률을 다시 계산했어요.";
    document.getElementById("portfolioLink").href=`portfolio-star.html?record=${encodeURIComponent(record.id)}`;
  });
})();
