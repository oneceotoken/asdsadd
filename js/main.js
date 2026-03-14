/* Main Interactions */
(function(){
"use strict";

// Custom cursor
var cursor=document.getElementById("cursor");
if(cursor && window.matchMedia("(pointer:fine)").matches){
  var cx=0,cy=0,tx=0,ty=0;
  document.addEventListener("mousemove",function(e){tx=e.clientX;ty=e.clientY;},{passive:true});
  (function loop(){
    cx+=(tx-cx)*0.15;cy+=(ty-cy)*0.15;
    cursor.style.transform="translate("+cx+"px,"+cy+"px)";
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll("a,button,.cursor-hover").forEach(function(el){
    el.addEventListener("mouseenter",function(){cursor.classList.add("hover");});
    el.addEventListener("mouseleave",function(){cursor.classList.remove("hover");});
  });
  cursor.style.opacity="1";
} else if(cursor){ cursor.style.display="none"; }

// Magnetic buttons
document.querySelectorAll(".magnetic").forEach(function(btn){
  btn.addEventListener("mousemove",function(e){
    var r=btn.getBoundingClientRect();
    var x=(e.clientX-r.left-r.width/2)*0.2;
    var y=(e.clientY-r.top-r.height/2)*0.2;
    btn.style.transform="translate("+x+"px,"+y+"px)";
  });
  btn.addEventListener("mouseleave",function(){
    btn.style.transform="";
    btn.style.transition="transform 0.4s cubic-bezier(0.16,1,0.3,1)";
  });
});

// Mobile menu
var menuBtn=document.getElementById("menuBtn");
var nav=document.getElementById("nav");
if(menuBtn&&nav){
  menuBtn.addEventListener("click",function(){nav.classList.toggle("open");});
  nav.querySelectorAll(".nav-link").forEach(function(link){
    link.addEventListener("click",function(){nav.classList.remove("open");});
  });
}

// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener("click",function(e){
    var target=document.querySelector(a.getAttribute("href"));
    if(target){e.preventDefault();target.scrollIntoView({behavior:"smooth"});}
  });
});

// Section spotlight
document.querySelectorAll(".section").forEach(function(sec){
  sec.addEventListener("mousemove",function(e){
    var r=sec.getBoundingClientRect();
    sec.style.setProperty("--mx",((e.clientX-r.left)/r.width*100)+"%");
    sec.style.setProperty("--my",((e.clientY-r.top)/r.height*100)+"%");
  },{passive:true});
});

})();