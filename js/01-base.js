const M={A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',
0:'-----',1:'.----',2:'..---',3:'...--',4:'....-',5:'.....',6:'-....',7:'--...',8:'---..',9:'----.','.':'.-.-.-',',':'--..--','?':'..--..','/':'-..-.','<AR>':'.-.-.','<SK>':'...-.-','<KN>':'-.--.','<BT>':'-...-','<ERR>':'........','Ñ':'--.--','Ä':'.-.-','Ö':'---.','Ü':'..--','É':'..-..','Ç':'-.-..','À':'.--.-'};
const REV={};for(const k in M)REV[M[k]]=k;
const $=i=>document.getElementById(i),num=i=>+$(i).value,call=()=>($('call').value.trim().toUpperCase()||'N0CALL');
const END=['K','KN','<KN>','<AR>','<SK>','SK'],CL=['73','SK','<SK>','TU','GB','CUL','CUAGN'];
// guardar ajustes (solo comodidad del navegador)
try{if(!localStorage.getItem('cwb_lang')){const n=(navigator.language||'es').slice(0,2);if(n=='en')$('lang').value=n}}catch(e){}
const IDS=['call','wpm','swpm','tone','vol','lang','km','sm','md','pm','qt','fw','mine','tc','tlen','qsb','qr','nz','bw','qrm','pile','err'];
try{IDS.forEach(i=>{const v=localStorage.getItem('cwb_'+i);if(v)$(i).value=v})}catch(e){}
IDS.forEach(i=>$(i).addEventListener('change',()=>{try{localStorage.setItem('cwb_'+i,$(i).value)}catch(e){}}));
