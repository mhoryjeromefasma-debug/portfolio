/* =====================================================
   HOME PAGE — welcome intro (first visit only), typed roles, profile download
   ===================================================== */
(function(){
const $=(s,r=document)=>r.querySelector(s);
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const intro=$('#intro');
let seen=false;try{seen=sessionStorage.getItem('mjaIntro')==='1'}catch(e){}
const fromTransition=document.documentElement.classList.contains('cover');

/* typed roles */
const roles=['Lifelong Learner','Creative Problem Solver','Reliable Team Player','Detail-Oriented Worker','Future Professional'];
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
if(fromTransition||!intro){
  if(intro)intro.remove();
  MJA.ready();typer();
}else{
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
    intro.classList.add('open');
    setTimeout(()=>{MJA.ready();typer()},reduce?0:520);
    setTimeout(()=>{intro.remove();document.body.classList.remove('opening')},reduce?100:2300);
  }
  $('#enter').addEventListener('click',openSite);
  addEventListener('keydown',e=>{if(e.key==='Enter')openSite()});
}

/* download profile */
$('#download').onclick=()=>{
  const t='MHORY JEROME ASMA\nProfessional Profile\n\nAge: 20\nLocation: Philippines\n\nSUMMARY\nDedicated and goal-oriented young professional with a passion for learning, technology and creative problem-solving. Known for discipline, honest communication, adaptability and a strong sense of accountability.\n\nCORE STRENGTHS\n- Communication\n- Problem Solving\n- Creativity\n- Teamwork\n- Adaptability\n- Continuous Learning\n\nNOTE: Add verified education, experience, certifications and project links before using as a formal CV.\nContact: '+SITE.email;
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/plain;charset=utf-8'}));a.download='Mhory-Jerome-Asma-Profile.txt';a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),500);MJA.toast('Profile downloaded');
};
})();
