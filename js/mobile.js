/* =====================================================
   MOBILE SCROLL — reveal on scroll, active menu item,
   avatar shows only after you leave Home, menu -> scroll
   ===================================================== */
(function(){
const m=document.querySelector('.m-sections');if(!m)return;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const mq=matchMedia('(max-width:900px)');
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
if(!('IntersectionObserver' in window)){$$('.m-sections .a').forEach(e=>e.classList.add('in'));return}

/* reveal blocks + count-up numbers when they scroll into view */
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  const el=e.target;io.unobserve(el);
  if(el.hasAttribute('data-count')){if(window.MJA&&MJA.countUp)MJA.countUp(el)}
  else el.classList.add('in');
}),{rootMargin:'0px 0px -8% 0px',threshold:.08});
$$('.m-sections .a,.m-sections [data-count]').forEach(el=>{
  if(reduce&&!el.hasAttribute('data-count'))el.classList.add('in');else io.observe(el);
});

/* avatar in the top bar appears only after you scroll past Home */
const home=$('#sec-home');
if(home)new IntersectionObserver(es=>{
  document.body.classList.toggle('scrolled',!es[0].isIntersecting);
},{rootMargin:'-72px 0px 0px 0px',threshold:0}).observe(home);

/* highlight the current section in the menu */
const links={};
$$('.nav-list a').forEach(a=>{links[a.getAttribute('href')]=a});
const map={'sec-home':'index.html','sec-about':'about.html','sec-strengths':'strengths.html','sec-projects':'projects.html','sec-approach':'approach.html','sec-contact':'contact.html'};
const so=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting||!mq.matches)return;
  $$('.nav-list a').forEach(a=>{a.classList.remove('active');a.removeAttribute('aria-current')});
  const a=links[map[e.target.id]];if(a){a.classList.add('active');a.setAttribute('aria-current','page')}
}),{rootMargin:'-40% 0px -55% 0px',threshold:0});
Object.keys(map).forEach(id=>{const s=document.getElementById(id);if(s)so.observe(s)});

/* arriving from about.html etc. on a phone: jump to that section */
addEventListener('load',()=>{
  if(!mq.matches||!location.hash)return;
  const t=document.getElementById(location.hash.slice(1));
  if(t&&t.id!=='sec-home')setTimeout(()=>t.scrollIntoView(),60);
});
})();
