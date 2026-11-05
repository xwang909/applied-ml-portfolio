'use strict';
const slides=[...document.querySelectorAll('.slide')];
let current=0;
const prev=document.getElementById('prev'),next=document.getElementById('next');
function showSlide(index){
  current=Math.min(slides.length-1,Math.max(0,index));
  slides.forEach((s,i)=>{s.hidden=i!==current;s.classList.toggle('is-active',i===current)});
  document.getElementById('slide-label').textContent=`${String(current+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
  document.getElementById('slide-topic').textContent=slides[current].dataset.title;
  document.getElementById('track-fill').style.width=`${(current+1)/slides.length*100}%`;
  prev.disabled=current===0;next.textContent=current===slides.length-1?'Start again ↺':'Next →';
  if(history.replaceState) history.replaceState(null,'',`#slide-${current+1}`);
}
prev.addEventListener('click',()=>showSlide(current-1));
next.addEventListener('click',()=>showSlide(current===slides.length-1?0:current+1));
document.addEventListener('keydown',e=>{
  if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
  if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();showSlide(current+1)}
  if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();showSlide(current-1)}
});
const start=location.hash.match(/^#slide-(\d+)$/);showSlide(start?Number(start[1])-1:0);
function number(id){return Number(document.getElementById(id).value)}
function display(id,value){document.getElementById(id).textContent=value}
function neuron(){
  for(const id of ['x1','w1','x2','w2','bias'])display(`${id}-out`,number(id).toFixed(1));
  const z=number('w1')*number('x1')+number('w2')*number('x2')+number('bias');
  display('weighted-z',z.toFixed(2));display('activated-a',Math.max(0,z).toFixed(2));display('neuron-output',Math.max(0,z).toFixed(2));
}
for(const id of ['x1','w1','x2','w2','bias'])document.getElementById(id).addEventListener('input',neuron);neuron();
let activation='relu';
const activationInfo={relu:['f(x) = max(0, x)','ReLU outputs zero for negative inputs and passes positive values through unchanged.'],sigmoid:['f(x) = 1 / (1 + e⁻ˣ)','Sigmoid squashes real-valued inputs into a value strictly between 0 and 1.'],tanh:['f(x) = tanh(x)','Tanh maps inputs to a value strictly between −1 and 1, centered around zero.']};
function act(x){return activation==='relu'?Math.max(0,x):activation==='sigmoid'?1/(1+Math.exp(-x)):Math.tanh(x)}
function toXY(x,y){return [(x+3)*60+60,132-y*53]}
function plot(){
  const pts=[];for(let i=-300;i<=300;i+=3){const xy=toXY(i/100,act(i/100));pts.push(`${i===-300?'M':'L'}${xy[0].toFixed(1)},${xy[1].toFixed(1)}`)}
  document.getElementById('activation-path').setAttribute('d',pts.join(' '));
  const x=number('activation-input'),y=act(x),pt=toXY(x,y);
  document.getElementById('activation-point').setAttribute('cx',pt[0]);document.getElementById('activation-point').setAttribute('cy',pt[1]);
  display('activation-input-out',x.toFixed(1));display('activation-formula',activationInfo[activation][0]);display('activation-result',y.toFixed(2));display('activation-description',activationInfo[activation][1]);
}
for(const tab of document.querySelectorAll('[data-function]'))tab.addEventListener('click',()=>{
  activation=tab.dataset.function;for(const b of document.querySelectorAll('[data-function]')){const active=b===tab;b.classList.toggle('is-selected',active);b.setAttribute('aria-pressed',String(active))}plot()
});
document.getElementById('activation-input').addEventListener('input',plot);plot();
function loss(){const p=number('prediction');display('prediction-out',p.toFixed(2));display('pred-text',p.toFixed(2));display('loss-value',((p-.8)**2).toFixed(4));document.getElementById('pred-meter').style.width=`${p*100}%`}
document.getElementById('prediction').addEventListener('input',loss);loss();
function optimizer(){const rate=number('learn-rate');display('learn-rate-out',rate.toFixed(2));display('new-weight',(1-rate*.8).toFixed(2))}
document.getElementById('learn-rate').addEventListener('input',optimizer);optimizer();
