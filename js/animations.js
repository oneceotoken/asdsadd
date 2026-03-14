/* Scroll Animations */
(function(){
"use strict";
function init(){
  if(typeof gsap==="undefined"||typeof ScrollTrigger==="undefined"){setTimeout(init,100);return;}
  gsap.registerPlugin(ScrollTrigger);

  // Preloader
  var fill=document.getElementById("preloaderFill");
  var pre=document.getElementById("preloader");
  if(fill){
    gsap.to(fill,{width:"100%",duration:1.2,ease:"power2.inOut",onComplete:function(){
      if(pre)pre.classList.add("done");
      revealHero();
    }});
  } else { revealHero(); }

  function revealHero(){
    gsap.to(".hero .line-inner",{y:0,duration:1,stagger:0.12,ease:"expo.out",delay:0.2});
    gsap.to(".hero-sub",{opacity:1,y:0,duration:0.8,delay:0.6,ease:"power2.out"});
    gsap.to(".hero-actions",{opacity:1,y:0,duration:0.8,delay:0.8,ease:"power2.out"});
  }

  // Set initial states
  gsap.set(".hero-sub",{opacity:0,y:20});
  gsap.set(".hero-actions",{opacity:0,y:20});

  // Section heading reveals
  document.querySelectorAll(".section-heading .line-inner").forEach(function(el){
    ScrollTrigger.create({
      trigger:el.closest(".section"),
      start:"top 80%",
      onEnter:function(){gsap.to(el,{y:0,duration:0.9,ease:"expo.out"});}
    });
  });

  // Reveal-up elements
  document.querySelectorAll(".reveal-up").forEach(function(el){
    ScrollTrigger.create({
      trigger:el,
      start:"top 85%",
      onEnter:function(){gsap.to(el,{opacity:1,y:0,duration:0.8,ease:"power2.out"});}
    });
  });

  // Smooth scroll
  if(typeof Lenis!=="undefined"){
    var lenis=new Lenis({lerp:0.1,smoothWheel:true});
    lenis.on("scroll",ScrollTrigger.update);
    gsap.ticker.add(function(t){lenis.raf(t*1000);});
    gsap.ticker.lagSmoothing(0);
  }
}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}
})();