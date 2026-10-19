// Small, progressive enhancement. Native scrolling and reduced-motion preference are preserved.
(()=>{
 const dialog=document.getElementById('navigation'),open=document.getElementById('openMenu'),close=document.getElementById('closeMenu');
 open.addEventListener('click',()=>{dialog.showModal();document.body.classList.add('menu-open')});
 close.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{document.body.classList.remove('menu-open');open.focus()});
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
 dialog.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>dialog.close()));
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');let observer;
 function observe(){observer?.disconnect();if(reduce.matches){document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in-view'));return}observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));}
 window.addEventListener('portfolio-render',observe);reduce.addEventListener('change',observe);observe();
 let ticking=false;function progress(){const range=document.documentElement.scrollHeight-innerHeight;document.getElementById('scrollProgress').style.height=(range>0?100*scrollY/range:0)+'%';ticking=false}
 addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(progress)}},{passive:true});addEventListener('resize',progress);progress();
})();
