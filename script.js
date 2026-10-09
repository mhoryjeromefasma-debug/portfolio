(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const EMAIL='add-your-email@example.com'; // <-- palitan ng totoong email mo

/* ---------- Intro ---------- */
const nameEl=$('#introName');
'MHORY JEROME ASMA'.split(' ').forEach((w,wi)=>{
  const word=document.createElement('span');word.className='word';
  [...w].forEach((c,i)=>{const s=document.createElement('span');s.className='ch';s.textContent=c;s.style.animationDelay=(.7+wi*.28+i*.045)+'s';word.appendChild(s)});
  nameEl.appendChild(word);
});
const intro=$('#intro');let opened=false;
function openSite(){
  if(opened)return;opened=true;
  intro.classList.add('open');
  setTimeout(()=>{document.body.classList.remove('locked');document.body.classList.add('ready');startHero();},700);
  setTimeout(()=>intro.remove(),1500);
}
$('#enter').addEventListener('click',openSite);
addEventListener('keydown',e=>{if((e.key==='Escape'||e.key==='Enter')&&!opened&&document.activeElement.id!=='name')openSite()});
setTimeout(openSite,9000);

/* ---------- Hero entrance ---------- */
function startHero(){
  $$('.hero-a').forEach(el=>{el.style.transition='opacity 1s var(--ease) '+(el.style.getPropertyValue('--d')||'0s')+',transform 1.1s var(--ease) '+(el.style.getPropertyValue('--d')||'0s');el.style.opacity=1;el.style.transform='none'});
  $$('.hero-s').forEach(el=>el.style.transform='none');
  typer();
}
$$('.hero-a').forEach(el=>{el.style.opacity=0;el.style.transform='translateY(30px)'});
$$('.hero-s').forEach(el=>{el.style.transition='transform 1.2s var(--ease) '+el.style.getPropertyValue('--d')});

/* ---------- Typed roles ---------- */
const roles=['Lifelong Learner','Creative Problem Solver','Reliable Team Player','Detail-Oriented Worker','Future Professional'];
let started=false;
function typer(){
  if(started)return;started=true;const el=$('#typed');
  if(reduce){el.textContent=roles[0];return}
  let r=0,c=0,del=false;
  (function tick(){
    const w=roles[r];
    el.textContent=w.slice(0,c);
    if(!del&&c===w.length){del=true;return setTimeout(tick,1700)}
    if(del&&c===0){del=false;r=(r+1)%roles.length}
    c+=del?-1:1;
    setTimeout(tick,del?32:70);
  })();
}

/* ---------- Marquee ---------- */
const words=['Communication','Problem Solving','Creativity','Teamwork','Adaptability','Continuous Learning','Integrity','Professionalism'];
const row='<span>'+words.map(w=>w+' <b>✦</b>').join(' ')+'</span>';
$('#mq').innerHTML=row+row;

/* ---------- Nav ---------- */
const nav=$('#nav'),topBtn=$('#top'),prog=$('#progress');let lastY=0;
function onScroll(){
  const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
  prog.style.transform='scaleX('+(h>0?y/h:0)+')';
  nav.classList.toggle('scrolled',y>30);
  nav.classList.toggle('hide',y>lastY&&y>400&&!$('#links').classList.contains('open'));
  topBtn.classList.toggle('show',y>600);
  lastY=y;
  // timeline fill
  const st=$('#steps');if(st){const r=st.getBoundingClientRect();const p=Math.min(1,Math.max(0,(innerHeight*.6-r.top)/r.height));$('#lineFill').style.height=(p*(r.height-20))+'px'}
  // orb parallax
  if(!reduce)$$('.orb').forEach(o=>o.style.transform='translateY('+(y*parseFloat(o.dataset.speed))+'px)');
}
addEventListener('scroll',onScroll,{passive:true});onScroll();
topBtn.onclick=()=>scrollTo({top:0,behavior:'smooth'});
const menu=$('#menu'),links=$('#links');
function closeMenu(){links.classList.remove('open');menu.classList.remove('open');menu.setAttribute('aria-expanded','false')}
menu.onclick=()=>{const o=links.classList.toggle('open');menu.classList.toggle('open',o);menu.setAttribute('aria-expanded',o)};
$$('#links a').forEach(a=>a.addEventListener('click',closeMenu));

/* ---------- Reveal on scroll ---------- */
const counted=new WeakSet();
function countUp(el){
  if(counted.has(el))return;counted.add(el);
  const to=+el.dataset.count,suf=el.dataset.suffix||'';
  if(reduce){el.textContent=to+suf;return}
  const t0=performance.now(),dur=1600;
  (function f(t){const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,4);el.textContent=Math.round(to*e)+suf;if(p<1)requestAnimationFrame(f)})(t0);
}
if('IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return;
    e.target.classList.add('in');
    $$('[data-count]',e.target).forEach(countUp);
    if(e.target.id==='bars')$$('.fill',e.target).forEach(f=>f.style.width=f.dataset.w+'%');
    io.unobserve(e.target);
  }),{threshold:.14,rootMargin:'0px 0px -6% 0px'});
  $$('.rv').forEach(el=>io.observe(el));
  const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)$$('#links a').forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id))}),{rootMargin:'-40% 0px -55% 0px'});
  $$('main section[id]').forEach(s=>so.observe(s));
}else{
  $$('.rv').forEach(el=>el.classList.add('in'));
  $$('[data-count]').forEach(countUp);
  $$('.fill').forEach(f=>f.style.width=f.dataset.w+'%');
}

/* ---------- Cursor glow + card spotlight + tilt ---------- */
if(fine&&!reduce){
  const g=$('#glow');let gx=0,gy=0,tx=0,ty=0;
  addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;g.classList.add('on')},{passive:true});
  (function loop(){gx+=(tx-gx)*.12;gy+=(ty-gy)*.12;g.style.transform='translate('+gx+'px,'+gy+'px)';requestAnimationFrame(loop)})();
  $$('.tilt-spot,.id-card').forEach(c=>{
    c.addEventListener('mousemove',e=>{
      const r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
      c.style.setProperty('--mx',x+'px');c.style.setProperty('--my',y+'px');
      if(c.classList.contains('id-card')){
        const rx=((y/r.height)-.5)*-12,ry=((x/r.width)-.5)*12;
        c.style.transform='rotateX('+rx+'deg) rotateY('+ry+'deg)';
      }
    });
    c.addEventListener('mouseleave',()=>{if(c.classList.contains('id-card'))c.style.transform=''});
  });
  // magnetic buttons
  $$('.mag').forEach(b=>{
    b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18)+'px,'+((e.clientY-r.top-r.height/2)*.25)+'px)'});
    b.addEventListener('mouseleave',()=>b.style.transform='');
  });
}

/* ---------- Project filter + modal ---------- */
$$('.filter').forEach(b=>b.addEventListener('click',()=>{
  $$('.filter').forEach(x=>x.classList.toggle('active',x===b));
  const f=b.dataset.filter;
  $$('.project').forEach(p=>{
    const show=f==='all'||p.dataset.cat===f;
    if(show){p.hidden=false;requestAnimationFrame(()=>p.classList.remove('out'))}
    else{p.classList.add('out');setTimeout(()=>{if(p.classList.contains('out'))p.hidden=true},400)}
  });
}));
const modal=$('#modal');
function openModal(p){$('#mTitle').innerHTML=p.dataset.title;$('#mDesc').textContent=p.dataset.desc;modal.classList.add('open');modal.setAttribute('aria-hidden','false')}
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true')}
$$('.project').forEach(p=>{p.addEventListener('click',()=>openModal(p));p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openModal(p)}})});
$('#modalX').onclick=closeModal;modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

/* ---------- Utilities ---------- */
let tt;function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('show'),2600)}
$('#year').textContent=new Date().getFullYear();
$('#emailShow').textContent=EMAIL;
async function copy(t,l){try{await navigator.clipboard.writeText(t)}catch(e){const x=document.createElement('textarea');x.value=t;document.body.append(x);x.select();document.execCommand('copy');x.remove()}toast(l+' copied!')}
$('#copyEmail').onclick=()=>copy(EMAIL,'Email');
$('#form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.currentTarget);location.href='mailto:'+EMAIL+'?subject='+encodeURIComponent(f.get('subject'))+'&body='+encodeURIComponent('Name: '+f.get('name')+'\nEmail: '+f.get('email')+'\n\n'+f.get('message'));toast('Opening your email app…')};
$('#download').onclick=()=>{
  const t='MHORY JEROME ASMA\nProfessional Profile\n\nAge: 20\nLocation: Philippines\n\nSUMMARY\nDedicated and goal-oriented young professional with a passion for learning, technology and creative problem-solving. Known for discipline, honest communication, adaptability and a strong sense of accountability.\n\nCORE STRENGTHS\n- Communication\n- Problem Solving\n- Creativity\n- Teamwork\n- Adaptability\n- Continuous Learning\n\nNOTE: Add verified education, experience, certifications and project links before using as a formal CV.\nContact: '+EMAIL;
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/plain;charset=utf-8'}));a.download='Mhory-Jerome-Asma-Profile.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);toast('Profile downloaded');
};
})();
