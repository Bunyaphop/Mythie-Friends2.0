'use strict';
// Original synthesized melody: offline, no audio downloads or autoplay.
const gameAudio={context:null,effectsBus:null,musicBus:null,timer:null,notes:new Map(),musicPlaying:false};
function initAudio(){
 try{
  if(!gameAudio.context){
   const C=window.AudioContext||window.webkitAudioContext;if(!C)return false;
   gameAudio.context=new C();
   for(const key of ['effectsBus','musicBus']){gameAudio[key]=gameAudio.context.createGain();gameAudio[key].connect(gameAudio.context.destination)}
  }
  gameAudio.context.resume().catch(()=>{});return true;
 }catch(e){return false}
}
function tone(frequency,delay,duration,volume,bus){
 const ctx=gameAudio.context;if(!ctx)return;
 const now=ctx.currentTime+delay,o=ctx.createOscillator(),gain=ctx.createGain();
 o.type='sine';o.frequency.value=frequency;
 gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(volume,now+.025);
 gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
 o.connect(gain).connect(bus);gameAudio.notes.set(o,bus);
 o.onended=()=>{gameAudio.notes.delete(o);o.disconnect();gain.disconnect()};
 o.start(now);o.stop(now+duration+.03);
}
function sound(kind='correct'){
 if(!saved.effects||document.hidden||!initAudio())return;
 gameAudio.effectsBus.gain.value=1;
 const notes={click:[[440,0,.07,.025]],drag:[[330,0,.12,.03]],drop:[[392,0,.12,.03]],correct:[[523.25,0,.18,.045],[659.25,.15,.24,.04]]};
 for(const n of notes[kind]||[])tone(...n,gameAudio.effectsBus);
}
function stopMusic(){
 clearTimeout(gameAudio.timer);gameAudio.timer=null;gameAudio.musicPlaying=false;
 if(gameAudio.musicBus)gameAudio.musicBus.gain.value=0;
 // Scheduled notes are stopped, so reopening a tab cannot replay old notes.
 for(const [n,bus] of gameAudio.notes){if(bus===gameAudio.musicBus){try{n.stop()}catch(e){}}}
}
function syncAudio(){
 const paused=modal.open&&modal.dataset.kind==='pause';
 if(gameAudio.effectsBus)gameAudio.effectsBus.gain.value=saved.effects&&!document.hidden?1:0;
 if(!saved.music||document.hidden||paused){stopMusic();return}
 if(gameAudio.musicPlaying)return;
 if(!initAudio())return;
 gameAudio.musicBus.gain.value=1;gameAudio.musicPlaying=true;
 const phrase=()=>{
  if(!gameAudio.musicPlaying)return;
  [261.63,329.63,392,329.63,293.66,349.23,440,349.23].forEach((f,i)=>tone(f,i*.7,.6,.018,gameAudio.musicBus));
  gameAudio.timer=setTimeout(phrase,5600);
 };phrase();
}
function muteAll(){saved.music=false;saved.effects=false;save();if(gameAudio.effectsBus)gameAudio.effectsBus.gain.value=0;stopMusic()}
document.addEventListener('visibilitychange',()=>{cancelDrag();syncAudio()});
window.addEventListener('pagehide',stopMusic);
window.addEventListener('pageshow',()=>{if(gameAudio.context)syncAudio()});
