// ---- Morse y audio
function enc(text,wpm,sty,eff){const u=1.2/wpm,ta=eff>0&&eff<wpm?(60*wpm-37.2*eff)/(19*wpm*eff):0,o=[],R=(a,b)=>a+Math.random()*(b-a);let f=1,ws=text.toUpperCase().split(/\s+/).filter(Boolean);
if(sty=='s')ws=ws.flatMap(x=>x.length>3&&Math.random()<.05?[x.slice(0,Math.ceil(x.length/2)),'<ERR>',x]:[x]);
const D=s=>{const x=u*f;return sty=='s'?x*(s=='.'?R(.75,1.3):3*R(.8,1.25)):sty=='b'&&s=='-'?x*3*R(.85,1.3):x*(s=='.'?1:3)},
G=n=>{const x=n>1&&ta>0?ta:u*f;return sty=='p'?x*n:sty=='i'?x*(n==1?1:n*R(.9,1.2)):sty=='b'?x*(n==1?1:n*R(.9,1.6)):x*n*(n==1?R(.7,1.5):R(.8,1.6))};
ws.forEach((wd,wi)=>{const ch=(wd.match(/<[A-Z]+>|./g)||[]).filter(c=>M[c]);
ch.forEach((c,ci)=>{if(sty=='s'||sty=='b')f=Math.min(1.12,Math.max(.88,f+R(-.03,.03)));const code=M[c];[...code].forEach((s,ei)=>{o.push([1,D(s)]);if(ei<code.length-1)o.push([0,G(1)])});if(ci<ch.length-1)o.push([0,G(3)])});
if(wi<ws.length-1)o.push([0,G(7)])});return o}
let ac,osc,g,playT=null;
function audio(){if(!ac){ac=new(window.AudioContext||window.webkitAudioContext)();osc=ac.createOscillator();g=ac.createGain();g.gain.value=0;osc.frequency.value=num('tone');osc.connect(g).connect(ac.destination);osc.start()}if(ac.state!='running')ac.resume()}
const gate=on=>{$('ltx').classList.toggle('on',!!on);if(ac)g.gain.setTargetAtTime(on?num('vol')/100:0,ac.currentTime,0.003)};
function stopPlay(){clearTimeout(playT);$('lrx').classList.remove('on');rt.forEach(o=>{try{o.stop()}catch(e){}});rt=[];sgl=[];if(ng)ng.gain.value=0;if(ac){g.gain.cancelScheduledValues(ac.currentTime);g.gain.setValueAtTime(0,ac.currentTime)}}
