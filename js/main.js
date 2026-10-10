/* =====================================================
   SHARED SCRIPT — page transitions, menu, effects
   ===================================================== */
(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const root=document.documentElement,body=document.body;
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
  setTimeout(()=>$$('[data-count]').filter(e=>!e.closest('.m-sections')).forEach(countUp),500);
}

/* ---------- called by each page when it is ready to animate in ---------- */
let isReady=false;
const MJA=window.MJA={
  toast,countUp,
  ready(){
    if(isReady)return;isReady=true;
    if(root.classList.contains('cover')){
      // coming from another page: fade the new page in, then play its entrance animations
      store('mjaTrans',null);
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        root.classList.remove('cover');
        setTimeout(start,reduce?0:140);
      }));
    }else start();
  }
};
// Pages with the welcome intro (home) call MJA.ready() themselves.
if(!$('#intro'))MJA.ready();

/* ---------- page transition ---------- */
function go(url){
  if(navigating)return;navigating=true;
  if(reduce){location.href=url;return}
  store('mjaTrans','1');
  if(body.classList.contains('nav-show'))store('mjaNav','1');   // keep the menu bar open on the next page
  body.classList.add('leaving');            // CSS fades the page out (opacity only = smooth)
  setTimeout(()=>{location.href=url},340);
}
function closeMenu(){body.classList.remove('menu-open')}
const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();

document.addEventListener('click',e=>{
  const a=e.target.closest('a[href]');
  if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==='_blank')return;
  const href=a.getAttribute('href');
  if(!/^[\w\-]+\.html$/i.test(href))return;           // only our own pages
  e.preventDefault();closeMenu();
  const mapId={'index.html':'sec-home','about.html':'sec-about','strengths.html':'sec-strengths','projects.html':'sec-projects','approach.html':'sec-approach','contact.html':'sec-contact'};
  if($('.m-sections')&&matchMedia('(max-width:900px)').matches&&mapId[href.toLowerCase()]){
    const id=mapId[href.toLowerCase()];
    if(id==='sec-home')scrollTo({top:0,behavior:reduce?'auto':'smooth'});
    else document.getElementById(id).scrollIntoView({behavior:reduce?'auto':'smooth'});
    return;
  }
  if(href.toLowerCase()===current)return;              // already here
  go(href);
});
// restore state if the user comes back with the browser Back button
addEventListener('pageshow',e=>{
  if(e.persisted){navigating=false;body.classList.remove('leaving');root.classList.remove('cover');body.classList.add('ready')}
});

/* ---------- prefetch pages on hover so the next page opens instantly ---------- */
const pf=new Set();
function prefetch(href){
  if(pf.has(href))return;pf.add(href);
  const l=document.createElement('link');l.rel='prefetch';l.href=href;document.head.appendChild(l);
}
document.addEventListener('pointerover',e=>{const a=e.target.closest&&e.target.closest('a[href]');if(!a)return;const h=a.getAttribute('href');if(/^[\w\-]+\.html$/i.test(h))prefetch(h)},{passive:true});
$$('.nav-list a,.pg').forEach(a=>{const h=a.getAttribute('href');if(h&&/^[\w\-]+\.html$/i.test(h))setTimeout(()=>prefetch(h),1200)});

/* ---------- keyboard: ← → to change page ---------- */
addEventListener('keydown',e=>{
  if(e.altKey||e.ctrlKey||e.metaKey||$('#intro')||$('.modal.open'))return;
  if(/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;
  const t=e.key==='ArrowRight'?body.dataset.next:e.key==='ArrowLeft'?body.dataset.prev:null;
  if(t){go(t.split('|')[0])}
});

/* ---------- auto-hide menu bar: opens when the pointer touches the top / the bar, closes when it leaves ---------- */
if(fine&&matchMedia('(min-width:901px)').matches){
  const bar=$('#side');
  // came from another page while the pointer was on the bar: keep it open until the pointer moves down
  if(store('mjaNav')){store('mjaNav',null);body.classList.add('nav-show')}
  addEventListener('mousemove',e=>{
    if(!bar||$('#intro'))return;
    if(e.clientY<=28)body.classList.add('nav-show');
    else if(body.classList.contains('nav-show')&&e.clientY>bar.offsetHeight+16)body.classList.remove('nav-show');
  },{passive:true});
  document.documentElement.addEventListener('mouseleave',()=>body.classList.remove('nav-show'));
  addEventListener('blur',()=>body.classList.remove('nav-show'));
}

/* ---------- mobile menu ---------- */
const burger=$('#burger');
if(burger)burger.addEventListener('click',()=>{const o=body.classList.toggle('menu-open');burger.setAttribute('aria-expanded',o)});

/* ---------- cursor glow, card spotlight, 3D tilt, magnetic buttons ---------- */
if(fine&&!reduce){
  const g=$('#glow');let gx=innerWidth/2,gy=innerHeight/2,tx=gx,ty=gy;
  addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;g.classList.add('on')},{passive:true});
  let raf=0;(function loop(){gx+=(tx-gx)*.12;gy+=(ty-gy)*.12;g.style.transform='translate3d('+gx+'px,'+gy+'px,0)';if(Math.abs(tx-gx)>.5||Math.abs(ty-gy)>.5)raf=requestAnimationFrame(loop);else raf=0})();
  addEventListener('mousemove',()=>{if(!raf)raf=requestAnimationFrame(function l(){gx+=(tx-gx)*.12;gy+=(ty-gy)*.12;g.style.transform='translate3d('+gx+'px,'+gy+'px,0)';if(Math.abs(tx-gx)>.5||Math.abs(ty-gy)>.5)raf=requestAnimationFrame(l);else raf=0})},{passive:true});
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
