/* =====================================================
   SHARED SCRIPT — page transitions, menu, effects
   ===================================================== */
(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const root=document.documentElement,body=document.body;
const curtain=$('#curtain'),label=$('#curtainLabel');
let navigating=false;

function store(k,v){try{if(v===undefined)return sessionStorage.getItem(k);if(v===null)sessionStorage.removeItem(k);else sessionStorage.setItem(k,v)}catch(e){return null}}

/* ---------- Gmail icon uses the email from js/config.js ---------- */
$$('[data-mail]').forEach(a=>{if(window.SITE&&SITE.email)a.href='mailto:'+SITE.email});

/* ---------- toast ---------- */
let tt;
function toast(t){const e=$('#toast');if(!e)return;e.textContent=t;e.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('show'),2600)}

/* ---------- count-up numbers ---------- */
function countUp(el){
  const to=+el.dataset.count,suf=el.dataset.suffix||'';
  if(reduce){el.textContent=to+suf;return}
  const t0=performance.now(),dur=1600;
  (function f(t){const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,4);el.textContent=Math.round(to*e)+suf;if(p<1)requestAnimationFrame(f)})(t0);
}
function start(){
  body.classList.add('ready');
  setTimeout(()=>$$('[data-count]').forEach(countUp),500);
}

/* ---------- called by each page when it is ready to animate in ---------- */
let isReady=false;
const MJA=window.MJA={
  toast,
  ready(){
    if(isReady)return;isReady=true;
    if(root.classList.contains('cover')){
      label.textContent=store('mjaTrans')||'';
      void curtain.offsetWidth;
      setTimeout(()=>{
        curtain.classList.add('out');
        root.classList.remove('cover');
        store('mjaTrans',null);
        setTimeout(start,420);
        setTimeout(()=>{curtain.classList.remove('out');label.textContent=''},1400);
      },reduce?0:420);
    }else start();
  }
};
// Pages with the welcome intro (home) call MJA.ready() themselves.
if(!$('#intro'))MJA.ready();

/* ---------- page transition ---------- */
function go(url,text){
  if(navigating)return;navigating=true;
  if(reduce){location.href=url;return}
  label.textContent=text||'';
  store('mjaTrans',text||'');
  body.classList.add('leaving');
  curtain.classList.add('on');
  setTimeout(()=>{location.href=url},820);
}
function closeMenu(){body.classList.remove('menu-open')}
const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();

document.addEventListener('click',e=>{
  const a=e.target.closest('a[href]');
  if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==='_blank')return;
  const href=a.getAttribute('href');
  if(!/^[\w\-]+\.html$/i.test(href))return;           // only our own pages
  e.preventDefault();closeMenu();
  if(href.toLowerCase()===current)return;              // already here
  go(href,a.dataset.label||a.textContent.replace(/[0-9↗↘←→]/g,'').trim());
});
// restore state if the user comes back with the browser Back button
addEventListener('pageshow',e=>{
  if(e.persisted){navigating=false;curtain.classList.remove('on','out');body.classList.remove('leaving');root.classList.remove('cover');label.textContent='';body.classList.add('ready')}
});

/* ---------- keyboard: ← → to change page ---------- */
addEventListener('keydown',e=>{
  if(e.altKey||e.ctrlKey||e.metaKey||$('#intro')||$('.modal.open'))return;
  if(/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;
  const t=e.key==='ArrowRight'?body.dataset.next:e.key==='ArrowLeft'?body.dataset.prev:null;
  if(t){const [u,l]=t.split('|');go(u,l)}
});

/* ---------- mobile menu ---------- */
const burger=$('#burger');
if(burger)burger.addEventListener('click',()=>{const o=body.classList.toggle('menu-open');burger.setAttribute('aria-expanded',o)});

/* ---------- auto-hide sidebar: open while the mouse is on the left side ---------- */
(function(){
  const side=$('.side');
  if(!side||!matchMedia('(hover:hover) and (pointer:fine) and (min-width:901px)').matches)return;
  let t;
  const open=()=>{clearTimeout(t);root.classList.add('side-open')};
  const close=()=>{clearTimeout(t);t=setTimeout(()=>{if(!side.matches(':hover')&&!side.contains(document.activeElement))root.classList.remove('side-open')},180)};
  side.addEventListener('mouseenter',open);
  side.addEventListener('mouseleave',close);
  side.addEventListener('focusin',open);
  side.addEventListener('focusout',close);
})();

/* ---------- cursor glow, card spotlight, 3D tilt, magnetic buttons ---------- */
if(fine&&!reduce){
  const g=$('#glow');let gx=innerWidth/2,gy=innerHeight/2,tx=gx,ty=gy;
  addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;g.classList.add('on')},{passive:true});
  (function loop(){gx+=(tx-gx)*.12;gy+=(ty-gy)*.12;g.style.transform='translate('+gx+'px,'+gy+'px)';requestAnimationFrame(loop)})();
  $$('.card,.project,[data-tilt]').forEach(c=>{
    c.addEventListener('mousemove',e=>{
      const r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
      c.style.setProperty('--mx',x+'px');c.style.setProperty('--my',y+'px');
      if(c.hasAttribute('data-tilt')){
        c.style.transform='rotateX('+(((y/r.height)-.5)*-12)+'deg) rotateY('+(((x/r.width)-.5)*12)+'deg)';
      }
    });
    c.addEventListener('mouseleave',()=>{if(c.hasAttribute('data-tilt'))c.style.transform=''});
  });
  $$('.mag').forEach(b=>{
    b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18)+'px,'+((e.clientY-r.top-r.height/2)*.25)+'px)'});
    b.addEventListener('mouseleave',()=>b.style.transform='');
  });
}
})();
