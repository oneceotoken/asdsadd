/* WebGL Shader — aurora */
(function(){
"use strict";
var surfaces=document.querySelectorAll(".webgl-bg");
if(!surfaces.length||!window.THREE)return;
var mouse={x:0.5,y:0.5},target={x:0.5,y:0.5};
document.addEventListener("mousemove",function(e){
  target.x=e.clientX/window.innerWidth;
  target.y=1.0-e.clientY/window.innerHeight;
},{passive:true});

var vertSrc="varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}";

var fragSrc="precision mediump float;\n"+
"uniform float uTime;\n"+
"uniform vec2 uMouse;\n"+
"varying vec2 vUv;\n"+
"vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}\n"+
"vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}\n"+
"vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}\n"+
"vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}\n"+
"float snoise(vec3 v){\n"+
"  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);\n"+
"  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);\n"+
"  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;\n"+
"  vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);\n"+
"  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;\n"+
"  i=mod289(i);\n"+
"  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));\n"+
"  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;\n"+
"  vec4 j=p-49.0*floor(p*ns.z*ns.z);\n"+
"  vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);\n"+
"  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;\n"+
"  vec4 h=1.0-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);\n"+
"  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;\n"+
"  vec4 sh=-step(h,vec4(0.0));\n"+
"  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;\n"+
"  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);\n"+
"  vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);\n"+
"  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));\n"+
"  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;\n"+
"  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);\n"+
"  m=m*m;return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));\n"+
"}\n"+
"void main(){\n"+
"vec2 uv = vUv;\n"+
"float t = uTime * 0.25;\n"+
"float wave = sin(uv.x * 6.0 + t) * cos(uv.y * 4.0 + t * 0.7) * 0.5;\n"+
"float n = snoise(vec3(uv * 3.0 + wave, t)) * 0.6;\n"+
"n += snoise(vec3(uv * 6.0, t * 1.5)) * 0.3;\n"+
"vec3 c1 = vec3(0.0, 0.8, 0.65);\n"+
"vec3 c2 = vec3(0.1, 0.3, 0.9);\n"+
"vec3 c3 = vec3(0.4, 0.0, 0.8);\n"+
"vec3 col = mix(vec3(0.01, 0.02, 0.05), mix(c1, mix(c2, c3, uv.x), n * 0.5 + 0.5), smoothstep(-0.2, 0.8, n));\n"+
"float mx = smoothstep(0.0, 0.5, 1.0 - length(vUv - uMouse));\n"+
"col += vec3(0.0, 0.15, 0.1) * mx;\n"+
"gl_FragColor = vec4(col * 0.6, 1.0);\n"+
"}";

surfaces.forEach(function(el){
  var w=el.offsetWidth,h=el.offsetHeight;
  var renderer=new THREE.WebGLRenderer({alpha:true,antialias:false});
  renderer.setSize(w,h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  el.appendChild(renderer.domElement);
  var scene=new THREE.Scene();
  var camera=new THREE.OrthographicCamera(-0.5,0.5,0.5,-0.5,0.1,10);
  camera.position.z=1;
  var uniforms={uTime:{value:0},uMouse:{value:new THREE.Vector2(0.5,0.5)}};
  var mat=new THREE.ShaderMaterial({vertexShader:vertSrc,fragmentShader:fragSrc,uniforms:uniforms});
  var mesh=new THREE.Mesh(new THREE.PlaneGeometry(1,1),mat);
  scene.add(mesh);
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){el._vis=e.isIntersecting;});
  },{threshold:0});
  obs.observe(el);el._vis=true;
  function tick(t){
    requestAnimationFrame(tick);
    if(!el._vis)return;
    mouse.x+=(target.x-mouse.x)*0.05;
    mouse.y+=(target.y-mouse.y)*0.05;
    uniforms.uTime.value=t*0.001;
    uniforms.uMouse.value.set(mouse.x,mouse.y);
    renderer.render(scene,camera);
  }
  requestAnimationFrame(tick);
  window.addEventListener("resize",function(){
    var nw=el.offsetWidth,nh=el.offsetHeight;
    renderer.setSize(nw,nh);
  });
});
})();