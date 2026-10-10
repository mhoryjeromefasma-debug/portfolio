/* =====================================================
   HOME PAGE — welcome intro (first visit only), typed roles, profile download
   ===================================================== */
(function(){
const $=(s,r=document)=>r.querySelector(s);
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const intro=$('#intro');
const seen=false; // welcome plays on every load / reload of the Home page
const fromTransition=document.documentElement.classList.contains('cover');

/* typed roles */
const roles=['Full Stack Developer','Programmer','Front-End Developer','Back-End Developer','Problem Solver'];
let started=false;
function typer(){
  if(started)return;started=true;const el=$('#typed');
  if(reduce){el.textContent=roles[0];return}
  let r=0,c=0,del=false;
  (function tick(){
    const w=roles[r];el.textContent=w.slice(0,c);
    if(!del&&c===w.length){del=true;return setTimeout(tick,1700)}
    if(del&&c===0){del=false;r=(r+1)%roles.length}
    c+=del?-1:1;setTimeout(tick,del?32:70);
  })();
}

/* intro — HELLO / WELCOME, then wait for the click */
if(fromTransition||seen||!intro){
  if(intro)intro.remove();
  MJA.ready();typer();
}else{
  document.body.classList.add('welcome');   // bar entrance animation only plays after the welcome screen
  function letters(el,text,base,step,extra){
    [...text].forEach((c,i)=>{
      const s=document.createElement('span');s.className='lt'+(extra&&c==='.'?' dot':'');
      s.textContent=c;s.style.animationDelay=(base+i*step)+'s'+(extra?'':',');
      el.appendChild(s);
    });
  }
  const wb=$('#welcomeBig');
  letters(wb,'WELCOME',.5,.1,false);
  // shimmer wave on WELCOME (delay applied to 2nd animation)
  [...wb.children].forEach((s,i)=>{s.style.animationDelay=(.5+i*.1)+'s,'+(2+i*.12)+'s'});
  let opened=false;
  function openSite(){
    if(opened)return;opened=true;
    document.body.classList.add('opening');
    requestAnimationFrame(()=>requestAnimationFrame(()=>intro.classList.add('open')));
    setTimeout(()=>{MJA.ready();typer()},reduce?0:900);
    setTimeout(()=>document.body.classList.remove('opening'),reduce?100:1500);
    setTimeout(()=>intro.remove(),reduce?100:2300);
  }
  $('#enter').addEventListener('click',openSite);
  addEventListener('keydown',e=>{if(e.key==='Enter')openSite()});
}

/* download profile */
$('#download').onclick=()=>{
  const t='MHORY JEROME ASMA'+'\n'+'Web Developer · Programmer · Full Stack'+'\n'+''+'\n'+'Age: 20'+'\n'+'Location: Misamis Oriental, Philippines'+'\n'+''+'\n'+'SUMMARY'+'\n'+'Full Stack web developer who builds fast, responsive websites and web applications, from clean interfaces to reliable back ends and databases. Known for discipline, honest communication, adaptability and a strong sense of accountability.'+'\n'+''+'\n'+'CORE STRENGTHS'+'\n'+'- Front-End Development'+'\n'+'- Back-End Development'+'\n'+'- Databases'+'\n'+'- APIs & Integration'+'\n'+'- Version Control & Tools'+'\n'+'- Continuous Learning'+'\n'+''+'\n'+'NOTE: Add verified education, experience, certifications and project links before using as a formal CV.'+'\n'+'Contact: '+SITE.email;
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/plain;charset=utf-8'}));a.download='Mhory-Jerome-Asma-Profile.txt';a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),500);MJA.toast('Profile downloaded');
};
})();
