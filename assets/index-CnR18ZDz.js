(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function o(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(e){if(e.ep)return;e.ep=!0;const t=o(e);fetch(e.href,t)}})();let l=document.getElementById("search"),c=document.getElementById("state"),u=document.getElementById("con");const p="https://indian-colleges-list.vercel.app/api";async function f(){try{const r=await fetch(`${p}/institutions/states`);if(!r.ok)throw new Error("Network response was not working");(await r.json()).states.forEach(o=>{let s=document.createElement("option");s.textContent=`${o.name}`,s.value=o.name,c.append(s)})}catch(r){console.error("Error fetching data:",r)}}f();async function d(r){try{const n=`https://indian-colleges-list.vercel.app/api/institutions/states/${r}`,o=await fetch(n);if(!o.ok)throw new Error("Network response was not ok");const e=(await o.json()).data;e.forEach(t=>{console.log(t);let i="";e.forEach(a=>{result+=`
    <div class="bg-blue-300 w-full sm:w-[350px] min-h-[300px] rounded-lg shadow-lg p-5 flex flex-col justify-between border border-white/20">
      <h3 class="font-semibold text-lg text-center ">
        ${a.institute_name}
      </h3>
      <p>Address: <span>${a.address}</span></p>
      <p>District: <span>${a.district}</span></p>
      <p>Institutes Type: <span>${a.institution_type}</span></p>
      <!-- button div  -->
      <div class="flex justify-end ">
      <button class="cursor-pointer active:scale-95 bg-white/50 text-md px-3 py-2 rounded">View course</button>
    </div>
    
  </div>
  `}),u.innerHTML=result})}catch(n){console.error("Error fetching data:",n)}}c.addEventListener("change",function(){d(c.value)});l.addEventListener("input",function(){d()});
