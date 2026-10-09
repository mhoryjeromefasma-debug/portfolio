/* =====================================================
   PROJECTS PAGE — filter + details popup
   ===================================================== */
(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];

const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
let busy=0;
$$('.filter').forEach(b=>b.addEventListener('click',()=>{
  if(b.classList.contains('active'))return;
  $$('.filter').forEach(x=>x.classList.toggle('active',x===b));
  const f=b.dataset.filter,all=$$('.project'),token=++busy;
  const matches=p=>f==='all'||p.dataset.cat===f;
  // the first-load entrance animation would override our transitions, so drop it
  all.forEach(p=>{p.classList.remove('a','z');p.getAnimations().forEach(a=>a.cancel())});
  const leaving=all.filter(p=>!p.hidden&&!matches(p));
  const entering=all.filter(p=>p.hidden&&matches(p));
  const staying=all.filter(p=>!p.hidden&&matches(p));
  if(reduce){leaving.forEach(p=>p.hidden=true);entering.forEach(p=>p.hidden=false);return}

  // 1) cards that don't match fade, shrink and blur away
  const outs=leaving.map((p,i)=>p.animate(
    [{opacity:1,transform:'scale(1)',filter:'blur(0)'},{opacity:0,transform:'scale(.85) translateY(1.5rem)',filter:'blur(6px)'}],
    {duration:380,delay:i*50,easing:'cubic-bezier(.55,0,.8,.3)',fill:'forwards'}).finished.catch(()=>{}));

  Promise.all(outs).then(()=>{
    if(token!==busy)return;
    const first=new Map(staying.map(p=>[p,p.getBoundingClientRect()]));
    leaving.forEach(p=>{p.getAnimations().forEach(a=>a.cancel());p.hidden=true});
    entering.forEach(p=>p.hidden=false);
    // 2) remaining cards glide smoothly into their new spots
    staying.forEach(p=>{
      const r=p.getBoundingClientRect(),o=first.get(p),dx=o.left-r.left,dy=o.top-r.top;
      if(dx||dy)p.animate([{transform:`translate(${dx}px,${dy}px)`},{transform:'none'}],{duration:700,easing:'cubic-bezier(.22,1,.36,1)'});
    });
    // 3) cards that now match rise back in, one after another
    entering.forEach((p,i)=>p.animate(
      [{opacity:0,transform:'scale(.85) translateY(2rem)',filter:'blur(8px)'},{opacity:1,transform:'none',filter:'blur(0)'}],
      {duration:700,delay:120+i*110,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'}));
  });
}));

const modal=$('#modal');
function openModal(p){$('#mTitle').innerHTML=p.dataset.title;$('#mDesc').textContent=p.dataset.desc;modal.classList.add('open');modal.setAttribute('aria-hidden','false')}
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true')}
$$('.project').forEach(p=>{
  p.addEventListener('click',()=>openModal(p));
  p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openModal(p)}});
});
$('#modalX').onclick=closeModal;
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
})();
