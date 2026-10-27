// ---- Estación virtual por idioma (en V2 se reemplaza por IA)
const WK={"s":["SOLEADO","SUNNY"],"c":["DESPEJADO","CLEAR"],"k":["NUBLADO","CLOUDY"],"r":["LLUVIA","RAIN"],"h":["CALOR","HOT"]};
const PR=[{l:0,c:'LU1ABC',n:'CARLOS',q:'CORDOBA',r:'IC7300',w:'100',a:'DIPOLE',x:'s',t:24},{l:0,c:'LW5DKM',n:'MARTIN',q:'MENDOZA',r:'FT991',w:'50',a:'VERTICAL',x:'c',t:19},
{l:0,c:'CX2AQ',n:'GONZALO',q:'MONTEVIDEO',r:'K3',w:'100',a:'YAGI',x:'k',t:17},{l:0,c:'EA1ZX',n:'IÑAKI',q:'A CORUÑA',r:'TS590',w:'100',a:'DIPOLE',x:'r',t:15},
{l:1,c:'W4XYZ',n:'BOB',q:'ATLANTA',r:'IC7300',w:'100',a:'DIPOLE',x:'s',t:26},{l:1,c:'G3ABC',n:'JOHN',q:'LONDON',r:'K3',w:'100',a:'YAGI',x:'r',t:12},{l:1,c:'VK3ZZ',n:'DAVE',q:'MELBOURNE',r:'FT991',w:'100',a:'VERTICAL',x:'k',t:18}];
const W={"thx":["GRACIAS POR LA LLAMADA","TNX FER CALL"],"ur":["SU RST","UR RST"],"name":["NOMBRE","NAME"],"how":["COMO?","HW?"],"info":["GRACIAS POR LA INFO","TNX FER INFO"],"myrig":["MI EQUIPO ES","MY RIG IS"],"pwr":["POT","PWR"],"wx":["CLIMA","WX"],"pse":["POR FAVOR SU NOMBRE OTRA VEZ?","PSE UR NAME AGN?"],"chat":["MUY BIEN {who} GRACIAS POR EL CONTACTO. ALGUNA OTRA PREGUNTA?","R R FB {who} TNX FER NICE CHAT. ANY OTHER QUESTIONS?"],"bye":["R GRACIAS POR EL QSO {who} 73 Y HASTA LUEGO","R TNX FER FB QSO {who} 73 ES HPE CU AGN"],"fin":["R GRACIAS POR EL QSO {who} 73 ES CU AGN <SK> E E","R TNX FER QSO {who} 73 ES CU AGN <SK> E E"]};
const w=k=>W[k][li],pick=a=>a[Math.random()*a.length|0];let st;
const newSt=()=>{st={p:{...pick(pool())},s:'CQ',last:'',slow:0,u:{},ct:0,an:0,pt:0,pq:0,fx:0,off:Math.random()*240-120|0,rst:pick(['579','589','599'])}};
const tail=()=>`${st.uc||call()} DE ${st.p.c}`,greet=()=>{const h=new Date().getHours();return h<12?'GM':h<19?'GA':'GE'};
// Reconocimiento tolerante del indicativo: distancia Morse (B y 6 se parecen: falta un punto)
const SW=['DE','PSE','AGN','QRZ','TNX','UR','RST','NAME','QTH','HW','KN','AR','SK','QRS','RPT','CQ','K','R','NOMBRE'],isCall=x=>/^(?:[A-Z]{1,2}|[0-9][A-Z])[0-9][A-Z0-9]{0,3}[A-Z]$/.test(x),MX=c=>M[c]||'';
function lv(a,b){const D=Array.from({length:a.length+1},(_,i)=>[i]);for(let j=1;j<=b.length;j++)D[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)D[i][j]=Math.min(D[i-1][j]+1,D[i][j-1]+1,D[i-1][j-1]+(a[i-1]==b[j-1]?0:1));return D[a.length][b.length]}
function cdist(a,b){const D=Array.from({length:a.length+1},(_,i)=>[i]);for(let j=1;j<=b.length;j++)D[0][j]=j;
for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++){const x=a[i-1],y=b[j-1],s=x==y?0:lv(MX(x),MX(y))/Math.max(MX(x).length,MX(y).length,1);D[i][j]=Math.min(D[i-1][j]+1,D[i][j-1]+1,D[i-1][j-1]+s)}return D[a.length][b.length]}
const mask=(h,e)=>h.length==e.length?[...h].map((c,i)=>c==e[i]?c:'?').join(''):h+'?';
function heardCall(tk){if(typeof tk==='string')tk=tk.trim().toUpperCase().split(/\s+/).filter(Boolean);else if(tk&&!Array.isArray(tk))tk=Array.from(tk);if(!Array.isArray(tk))tk=[];const p=st.p,exp=$('call').value.trim().toUpperCase(),cs=tk.filter(x=>x!=p.c&&!SW.includes(x)&&x.length>=3&&!/^[0-9]+$/.test(x)),i=tk.indexOf('DE');
let h=i>=0&&tk[i+1]&&tk[i+1]!=p.c&&!SW.includes(tk[i+1])?tk[i+1]:null;
if(exp&&!h)h=cs.map(x=>[cdist(x,exp),x]).sort((a,b)=>a[0]-b[0])[0]?.[1];if(!h)h=cs.find(isCall)||cs[0];
if(!h)return{say:tk.includes(p.c)?`QRZ? ${eos()}`:`QRZ? QRZ? ${eos()}`};
if(exp){const d=cdist(h,exp);if(d==0){st.uc=h;return{ok:1}}
if(d<=1.2){if(md()!='r'||Math.random()<.6){st.uc=exp;return{ok:1}}return{say:`${mask(h,exp)} QRZ? ${eos()}`}}return{say:`${h}? AGN PSE ${eos()}`}}
if(isCall(h)){st.uc=h;$('call').value=h;return{ok:1}}return{say:`${h}? PSE AGN CALL ${eos()}`}}
