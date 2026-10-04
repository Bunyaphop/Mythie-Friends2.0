
'use strict';
/* Mythie Friends | Offline, VS Code project edition.
   Edit CHARACTERS / FOODS to change content. Original character and food PNG atlases are stored in assets/.
   20 levels per game, randomized balanced targets and increasingly similar distractors.
   Feeding: ALWAYS two stages per level, with disjoint target characters.
   Pointer Events support mouse, pen and touch; tap/keyboard is also available.
*/
const CHARACTERS=[
 {id:'puff',name:'Puff',kind:'Cloud Dragon',food:'star'},
 {id:'lumi',name:'Lumi',kind:'Unicorn',food:'cloud'},
 {id:'mochi',name:'Mochi',kind:'Forest Fox',food:'leaf'},
 {id:'griff',name:'Griff',kind:'Baby Griffin',food:'moon'},
 {id:'hop',name:'Hop',kind:'Antlered Rabbit',food:'heart'},
 {id:'peach',name:'Peach',kind:'Phoenix',food:'flame'},
 {id:'bubble',name:'Bubble',kind:'Sea Dragon',food:'shell'},
 {id:'moon',name:'Moon',kind:'Moon Deer',food:'flower'}
];
// Five original foods plus three matching new illustrations. Each friend has a unique food.
const FOODS={star:{name:'Star Cookie',cell:0},cloud:{name:'Cloud Cake',cell:1},leaf:{name:'Leaf Jelly',cell:2},moon:{name:'Moon Biscuit',cell:3},heart:{name:'Heart Fruit',cell:4},flame:{name:'Flame Cookie',asset:'flame'},shell:{name:'Shell Jelly',asset:'shell'},flower:{name:'Flower Cookie',asset:'flower'}};
const $=s=>document.querySelector(s);
const app=$('#app'),modal=$('#modal');
const LEVELS=20;
const KEY='mythie-match-two-games-v1';
let saved={shadow:[],feed:[],language:'en',music:false,effects:false,audioVersion:1,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches};
try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(d){for(const k of ['shadow','feed'])saved[k]=Array.isArray(d[k])?[...new Set(d[k].filter(n=>Number.isInteger(n)&&n>=1&&n<=LEVELS))]:[];saved.language=d.language==='th'?'th':'en';saved.music=d.audioVersion===1&&d.music===true;saved.effects=d.audioVersion===1&&d.effects===true;saved.reduced=d.reduced===true}}catch(e){}
// Persist exposure counts and previous boards, but never assume stored data is valid.
let randomHistory={usage:{shadow:{},feed:{}},previous:{},last:{}};
try{const d=JSON.parse(localStorage.getItem(KEY)||'null');const h=d?.randomHistory;
 if(h&&typeof h==='object'){
  for(const game of ['shadow','feed'])for(const c of CHARACTERS){const n=h.usage?.[game]?.[c.id];randomHistory.usage[game][c.id]=Number.isSafeInteger(n)&&n>=0?n:0}
  for(const [key,value] of Object.entries(h.previous||{})){if(/^(shadow|feed)-([1-9]|1[0-9]|20)-[12]$/.test(key)&&typeof value==='string')randomHistory.previous[key]=value}
  for(const game of ['shadow','feed'])if(typeof h.last?.[game]==='string')randomHistory.last[game]=h.last[game];
 }
}catch(e){}
let state={screen:'home',game:null,level:1,stage:1,targets:[],choices:[],matched:[],active:0,selectedFood:null,complete:false};
let motionBusy=false;
let storageWorks=true,uid=0,audioContext=null,drag=null,suppressClickUntil=0,returnFocus=null;
function save(){try{localStorage.setItem(KEY,JSON.stringify({...saved,randomHistory}))}catch(e){storageWorks=false}}
function applySettings(){document.body.classList.toggle('reduced',saved.reduced)}
applySettings();
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function animal(id){return CHARACTERS.find(c=>c.id===id)}
// Both minigames use the original transparent 4-by-2 character atlas.
// Shadow is a filter of the same sprite, so all outline details match exactly.
function creature(id,shadow=false){
 const i=CHARACTERS.findIndex(c=>c.id===id);
 return `<span class="sprite-viewport" aria-hidden="true"><span class="original-character ${shadow?'original-shadow':''}" style="background-position:${i%4*100/3}% ${Math.floor(i/4)*100}%"></span></span>`;
}
function food(id){
 if(FOODS[id].asset)return `<span class="sprite-viewport" aria-hidden="true"><span class="new-food food-${FOODS[id].asset}"></span></span>`;
 const i=FOODS[id].cell;
 return `<span class="sprite-viewport" aria-hidden="true"><span class="original-food" style="background-position:${i%3*50}% ${Math.floor(i/3)*100}%"></span></span>`;
}
function announce(s){$('#announcer').textContent=tr(s)}
function brand(){return '<div class="brand"><span class="brand-mark" aria-hidden="true"><span class="sprite-viewport"><span class="original-character" style="background-position:0% 0%"></span></span></span> Mythie Friends</div>'}
function toolbar(){return `<div class="tools"><button class="small" data-act="settings">⚙ Settings</button><button class="small" data-act="mute-all" ${!saved.music&&!saved.effects?'disabled':''}>${saved.music||saved.effects?'Mute all':'All sound off'}</button><button class="small" data-act="pause">Ⅱ Pause</button></div>`}
function homeBase(){cancelDrag();state.screen='home';app.innerHTML=`<header class="topbar">${brand()}<button class="small" data-act="settings">⚙ Settings</button></header><section class="intro"><div class="kicker">Two little adventures</div><h1>Choose a game</h1><p>Meet your friends. Play at your own pace.</p></section><section class="game-grid"><article class="game-card"><span class="pill">20 LEVELS</span><div class="art-row"><div>${creature('puff')}</div><div class="mini-art">${creature('puff',true)}</div></div><h2>Match Shadow</h2><p>Find the matching shadow.</p>${progressCard("shadow")}<button class="primary" data-act="levels" data-game="shadow">Play Match Shadow</button></article><article class="game-card feed"><span class="pill">20 LEVELS · 2 STAGES EACH</span><div class="art-row"><div>${creature('mochi')}</div><div class="mini-art">${food('leaf')}</div></div><h2>Feed a Friend</h2><p>Bring each friend the food they want.</p>${progressCard("feed")}<button class="primary green" data-act="levels" data-game="feed">Play Feed a Friend</button></article></section>${resetBanner()}<div class="home-foot"><span>✓ No time limit</span><span>✓ Try as often as you like</span><span>✓ All characters available</span></div><footer>Made for little moments of discovery.</footer>`}
function title(){return state.game==='shadow'?'Match Shadow':'Feed a Friend'}
function levelsBase(game=state.game){cancelDrag();state.game=game;state.screen='levels';app.innerHTML=`<header class="topbar"><button class="small" data-act="home">⌂ Home</button>${brand()}<button class="small" data-act="settings">⚙ Settings</button></header><section class="intro"><div class="kicker">${title()}</div><h1>Choose a level</h1><p>Start anywhere. Play a level again whenever you like.</p></section><section class="level-wrap"><div class="level-grid">${Array.from({length:LEVELS},(_,i)=>{const l=i+1,n=game==='feed'?feedPlan(l).animals:shadowCount(l);return `<button class="level-btn ${saved[game].includes(l)?'done':''}" data-act="start" data-level="${l}" aria-label="Level ${l}${saved[game].includes(l)?', completed':''}"><strong>${l}</strong></button>`}).join('')}</div><div class="level-help">${game==='shadow'?'<p><strong>How to play:</strong> Look at the picture, then choose its matching shadow.</p><p>On a board with more friends, select a picture first. Match all the friends to finish.</p>':'<p><strong>How to play:</strong> Look at the food your friend asks for. Drag that food to their bowl.</p><p>Each level has 2 stages with different friends and foods. Levels 1–8: 1 friend. Levels 9–16: 2 friends. Levels 17–20: 3 friends. Each friend wants one food. More food choices appear as you progress.</p><p>You can also select a food, then select a bowl.</p>'}</div><footer>✓ means completed. Every level is available.</footer></section>`}
function feedPlan(l){return l<=4?{animals:1,foods:2}:l<=8?{animals:1,foods:3}:l<=12?{animals:2,foods:3}:l<=16?{animals:2,foods:4}:{animals:3,foods:5}}
function shadowPlan(l){return l<=4?{animals:1,choices:3}:l<=8?{animals:2,choices:3}:l<=12?{animals:2,choices:4}:l<=16?{animals:3,choices:4}:{animals:4,choices:5}}
function shadowCount(l){return shadowPlan(l).animals}
function nextUnfinished(game){return Array.from({length:LEVELS},(_,i)=>i+1).find(n=>!saved[game].includes(n))||null}
function allComplete(){return ['shadow','feed'].every(g=>nextUnfinished(g)===null)}
function progressCard(game){return `<div class="progress-card"><span>${saved[game].length} / 20 levels completed</span><progress max="20" value="${saved[game].length}" aria-label="${game==='shadow'?'Match Shadow':'Feed a Friend'}"></progress>${nextUnfinished(game)?`<button data-act="continue-game" data-game="${game}">Continue · Level ${nextUnfinished(game)}</button>`:'<span>All levels completed!</span>'}</div>`}
function resetBanner(){return allComplete()?`<section class="reset-banner"><h2>All 40 levels completed!</h2><p>Your next adventure can have new puzzles.</p><button data-act="reset">Start a new adventure</button></section>`:''}
function start(game,level){if(!['shadow','feed'].includes(game)||!Number.isInteger(level)||level<1||level>LEVELS)return;cancelDrag();state={screen:'game',game,level,stage:1,targets:[],choices:[],matched:[],active:0,selectedFood:null,complete:false,firstStage:[]};prepare();renderGame();focusInstruction()}
const SHAPE_GROUPS=[['puff','bubble'],['lumi','moon','hop'],['griff','peach'],['mochi','hop']];
const FOOD_GROUPS=[['star','moon','flame'],['leaf','heart','flower'],['cloud','shell']];
function similar(a,b,groups){return groups.some(group=>group.includes(a)&&group.includes(b))}
function signature(ids){return [...ids].sort().join(',')}
function randomTargets(n,excluded){
 const game=state.game,key=`${game}-${state.level}-${state.stage}`,usage=randomHistory.usage[game];
 const pool=shuffle(CHARACTERS.map(c=>c.id).filter(id=>!excluded.includes(id))).sort((a,b)=>(usage[a]||0)-(usage[b]||0));
 const targets=pool.slice(0,n);
 // Change the target set itself, not just the order, on a consecutive replay.
 const blocked=[randomHistory.previous[key],randomHistory.last[game]];
 if(blocked.includes(signature(targets))){
  outer:for(let i=n-1;i>=0;i--)for(const other of pool.slice(n)){
   const candidate=[...targets];candidate[i]=other;
   if(!blocked.includes(signature(candidate))){targets.splice(0,n,...candidate);break outer}
  }
 }
 const result=shuffle(targets);for(const id of result)usage[id]=(usage[id]||0)+1;
 randomHistory.previous[key]=signature(result);randomHistory.last[game]=signature(result);return result;
}
function distractors(correct,pool,count,groups){
 let candidates=shuffle(pool.filter(id=>!correct.includes(id)));
 // Later levels prefer visually related silhouettes or foods; correct answers never change.
 if(state.level>=9)candidates.sort((a,b)=>correct.filter(x=>similar(x,b,groups)).length-correct.filter(x=>similar(x,a,groups)).length);
 return candidates.slice(0,count);
}
function prepare(){
 state.matched=[];state.active=0;state.selectedFood=null;state.complete=false;state.hinted=null;
 const feeding=state.game==='feed',plan=feeding?feedPlan(state.level):shadowPlan(state.level);
 state.targets=randomTargets(plan.animals,feeding&&state.stage===2?state.firstStage:[]);
 if(feeding&&state.stage===1)state.firstStage=[...state.targets];
 const correct=feeding?state.targets.map(id=>animal(id).food):state.targets;
 const pool=feeding?Object.keys(FOODS):CHARACTERS.map(c=>c.id);
 const count=(feeding?plan.foods:plan.choices)-correct.length;
 state.choices=shuffle([...correct,...distractors(correct,pool,count,feeding?FOOD_GROUPS:SHAPE_GROUPS)]);
 save();
}
function gameHeader(){return `<header class="topbar"><button class="small" data-act="levels">‹ Levels</button><div class="game-heading"><h1>${title()}</h1><div class="badges"><span class="badge">Level ${state.level} / ${LEVELS}</span>${state.game==='feed'?`<span class="badge">Stage ${state.stage} / 2</span>`:''}</div></div>${toolbar()}</header>`}
function renderGameBase(message='',type=''){cancelDrag();const feed=state.game==='feed',n=state.targets.length;app.innerHTML=`${gameHeader()}<section class="${feed?'feeding':'shadow-game'}"><h2 class="instruction" tabindex="-1">${feed?(n===1?'Drag the food to your friend.':'Drag each food to the right friend.'):(n===1?'Choose the matching shadow.':'Choose a friend, then its shadow.')}</h2><div class="board"><div class="characters ${n>2?'many':''}" style="--count:${n}">${state.targets.map((id,i)=>{const c=animal(id),done=state.matched.includes(id);return `<article class="target ${done?'matched':''} ${!feed&&i===state.active&&!done?'selected':''}" data-target="${id}">${feed?`<div class="request"><div class="food-art">${food(c.food)}</div><span>${FOODS[c.food].name}, please!</span></div><div class="creature">${creature(id)}</div><div class="target-name">${c.name}</div><button class="bowl ${done?'fed':''}" data-act="bowl" data-id="${id}" aria-label="${c.name}'s bowl${done?', fed':''}" ${done?'disabled':''}>${done?`<span class="food-art">${food(c.food)}</span> ✓ Thank you!`:'Drop food here'}</button>`:`<button class="target-btn" data-act="target" data-id="${id}" aria-label="${c.name}${done?', matched':''}" aria-pressed="${i===state.active&&!done}" ${done?'disabled':''}><div class="creature">${creature(id)}</div><div class="target-name">${c.name}</div></button>`}</article>`}).join('')}</div></div><div class="tray"><div class="choices ${state.choices.length===5?'five':state.choices.length===4?'four':''}" style="--count:${state.choices.length}">${state.choices.map((id,i)=>{const done=feed?state.matched.some(c=>animal(c).food===id):state.matched.includes(id);return `<button class="choice ${feed?'food-choice':''} ${done?'correct':''} ${state.selectedFood===id?'chosen':''} ${state.hinted===id?'hinted':''}" data-act="${feed?'food':'shadow'}" data-id="${id}" ${done?'disabled':''} ${feed?`aria-pressed="${state.selectedFood===id}"`:''} aria-label="${feed?FOODS[id].name:`Shadow ${i+1}`}${done?', matched':''}">${feed?`<span class="handle" aria-hidden="true"></span><span class="food-art">${food(id)}</span><span class="label">${FOODS[id].name}</span>`:`<span class="creature">${creature(id,!done)}</span><span class="sr-only">${done?animal(id).name+", matched":"Shadow "+(i+1)}</span>`}</button>`}).join('')}</div></div><div class="feedback-bar"><button class="small hint-btn" data-act="hint" ${state.complete?'disabled':''}>☀ Hint</button><div class="status ${type}" role="status">${message||defaultStatus()}</div><div class="next-slot">${state.complete?`<button class="primary ${feed?'green':''}" data-act="next">${feed&&state.stage===1?'Next stage':'Finish level'} →</button>`:''}</div></div><div class="help-line">${feed?'Mouse or touch: drag to a bowl. Or select a food, then a bowl.':'Use the mouse, touch, or Tab and Enter. Take your time.'}</div></section>`}
function defaultStatus(){return state.game==='feed'?`Fed: ${state.matched.length} / ${state.targets.length}`:`${state.matched.length} / ${state.targets.length} matched${state.targets.length>1?' · Find '+animal(state.targets[state.active]).name+"’s shadow":''}`}
function focusInstruction(){const el=$('.instruction');if(el)el.focus({preventScroll:true})}
function feedback(text,type=''){const el=$('.status');if(el){el.textContent=tr(text);el.className='status '+type}}
function match(id){state.matched.push(id);state.hinted=null;state.selectedFood=null;state.complete=state.matched.length===state.targets.length;if(!state.complete)state.active=state.targets.findIndex(t=>!state.matched.includes(t));sound();renderGame(state.complete?(state.game==='feed'?'Everyone is fed. Well done!':'All shadows matched. Well done!'):(state.game==='feed'?`Thank you! Fed: ${state.matched.length} / ${state.targets.length}`:`Matched! Now find ${animal(state.targets[state.active]).name}’s shadow.`),'success');if(state.complete)$('[data-act="next"]').focus({preventScroll:true});else if(state.game==='shadow')$('.choice:not(:disabled)')?.focus({preventScroll:true});announce(state.complete?'All done. Select the next button to continue.':`${animal(id).name} matched.`)}
async function chooseShadow(id){if(motionBusy||state.complete||state.matched.includes(id))return;if(id===state.targets[state.active]){await moveToShadow(id);match(id);}else{feedback('These shapes are different. Try another shadow.','retry');announce('These shapes are different. Try another shadow.')}}
async function moveToShadow(id){
 if(saved.reduced||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const source=document.querySelector(`[data-act="target"][data-id="${id}"] .creature`);
 const target=document.querySelector(`[data-act="shadow"][data-id="${id}"] .creature`);
 if(!source||!target||typeof source.animate!=='function')return;
 const from=source.getBoundingClientRect(),to=target.getBoundingClientRect();
 if(!from.width||!to.width)return;
 const flyer=document.createElement('div');flyer.className='shadow-flyer';flyer.setAttribute('aria-hidden','true');flyer.innerHTML=creature(id);
 Object.assign(flyer.style,{left:from.left+'px',top:from.top+'px',width:from.width+'px',height:from.height+'px'});
 motionBusy=true;app.inert=true;app.setAttribute('aria-busy','true');source.style.visibility='hidden';document.body.appendChild(flyer);
 feedback(animal(id).name+' is moving to the matching shadow.');
 let movement;const cancel=()=>movement?.cancel();window.addEventListener('resize',cancel,{once:true});
 try{movement=flyer.animate([{transform:'translate(0,0) scale(1,1)'},{transform:`translate(${to.left-from.left}px,${to.top-from.top}px) scale(${to.width/from.width},${to.height/from.height})`}],{duration:700,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});await movement.finished;}catch(e){}finally{window.removeEventListener('resize',cancel);flyer.remove();source.style.visibility='';app.inert=false;app.removeAttribute('aria-busy');motionBusy=false;}
}
function giveFood(foodId,targetId){if(!foodId||state.complete||state.matched.includes(targetId))return;if(state.matched.some(id=>animal(id).food===foodId))return;if(animal(targetId).food===foodId)match(targetId);else{state.selectedFood=null;renderGame(`${animal(targetId).name} wants ${FOODS[animal(targetId).food].name.toLowerCase()}. Try again.`,'retry');announce('Try another food. Look at the food above your friend.')}}
function hint(){if(state.complete)return;const target=state.targets[state.active];state.hinted=state.game==='feed'?animal(target).food:target;renderGame(state.game==='feed'?`Find ${FOODS[animal(target).food].name.toLowerCase()} for ${animal(target).name}.`:'Look at the outlined shadow. Compare its shape.');announce('Hint shown. Look for the outlined choice.')}
function next(){if(!state.complete)return;if(state.game==='feed'&&state.stage===1){state.stage=2;prepare();renderGame();focusInstruction();announce('Stage 2. New friends and new foods.')}else{if(!saved[state.game].includes(state.level))saved[state.game].push(state.level);save();endScreen()}}
function endScreenBase(){state.screen='end';const final=state.level===LEVELS;app.innerHTML=`<header class="topbar"><button class="small" data-act="home">⌂ Home</button>${brand()}<button class="small" data-act="levels">Levels</button></header><section class="round-end fade-in"><div class="check-mark">✓</div><div class="kicker">${title()}</div><h1>Level ${state.level} complete!</h1><div class="creature">${creature(state.targets[0])}</div><p>${final?'You finished the last level. You can play any level again.':'You did it. Ready for another little adventure?'}${!storageWorks?'<br>Progress could not be saved in this browser. You can still play every level.':''}</p><div class="button-row">${!final?'<button class="primary" data-act="advance">Next level →</button>':'<button class="primary" data-act="levels">Choose a level</button>'}<button data-act="replay">Play another set</button><button data-act="home">Choose a game</button></div>${resetBanner()}</section>`;$('.round-end .primary').focus({preventScroll:true})}
function renderCurrent(){
 if(state.screen==='home')home();else if(state.screen==='levels')levels();else if(state.screen==='end')endScreen();else renderGame();
}
function settingsContent(){return `<h2>Settings</h2><p>Make the game comfortable for you.</p>
<div class="setting"><label for="language-setting">Language</label><select id="language-setting"><option value="en" ${saved.language==='en'?'selected':''}>English</option><option value="th" ${saved.language==='th'?'selected':''}>ไทย</option></select></div>
<div class="setting"><label for="music-setting">Background music<small>Soft original melody.</small></label><input id="music-setting" type="checkbox" ${saved.music?'checked':''}></div>
<div class="setting"><label for="effects-setting">Sound effects<small>Click, pick up, drop and correct answers.</small></label><input id="effects-setting" type="checkbox" ${saved.effects?'checked':''}></div>
<button class="mute-button" data-act="mute-all" ${!saved.music&&!saved.effects?'disabled':''}>Mute all</button>
<div class="setting"><label for="motion-setting">Reduce movement<small>Keep screen changes still.</small></label><input id="motion-setting" type="checkbox" ${saved.reduced?'checked':''}></div>
<p class="settings-note">All audio is off by default. You can switch it on here.</p><button class="primary" data-act="close">Done</button>`}
function openModal(kind){
 cancelDrag();returnFocus=document.activeElement;modal.dataset.kind=kind;
 modal.innerHTML=kind==='reset'?resetContent():kind==='settings'?settingsContent():`<h2>Game paused</h2><p>Your friends will wait. Continue when you are ready.</p><button class="primary" data-act="close">Continue playing</button><div class="button-row"><button data-act="settings">⚙ Settings</button><button data-act="replay-modal">Restart level</button><button data-act="home-modal">Choose a game</button></div>`;
 localize(modal);if(!modal.open)modal.showModal();syncAudio();
}
function resetContent(){return `<h2>Start a new adventure?</h2><p>This clears completion marks for both games. Your language, sound and movement settings stay the same.</p><button class="primary" data-act="close">Keep my progress</button><button class="mute-button" data-act="confirm-reset">Reset both games</button>`}
function resetProgress(){
 if(!allComplete())return;
 saved.shadow=[];saved.feed=[];
 // Keep exposure history so the next adventure also avoids recent target sets.
 save();modal.close();home();announce('Progress reset. Choose a game to begin at level 1.');
 app.querySelector('[data-act="continue-game"]')?.focus({preventScroll:true});
}
function closeModal(){modal.close();renderCurrent();syncAudio();const focus=returnFocus?.isConnected?returnFocus:app.querySelector('[data-act="settings"]');focus?.focus({preventScroll:true})}
modal.addEventListener('cancel',e=>{e.preventDefault();closeModal()});
modal.addEventListener('close',syncAudio);
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b||b.disabled||motionBusy)return;if(e.detail>0&&performance.now()<suppressClickUntil&&['food','bowl'].includes(b.dataset.act)){e.preventDefault();return}const a=b.dataset.act,id=b.dataset.id;if(a!=='mute-all')sound('click');
 if(a==='continue-game')start(b.dataset.game,nextUnfinished(b.dataset.game)||1);if(a==='reset'&&allComplete())openModal('reset');if(a==='confirm-reset')resetProgress();if(a==='home')home();if(a==='levels')levels(b.dataset.game||state.game);if(a==='start')start(state.game,+b.dataset.level);if(a==='settings')openModal('settings');if(a==='pause')openModal('pause');if(a==='close')closeModal();if(a==='mute-all'){muteAll();renderCurrent();if(modal.open){modal.innerHTML=settingsContent();localize(modal);$('#effects-setting').focus()}}
 if(a==='target'&&!state.matched.includes(id)){state.active=state.targets.indexOf(id);state.hinted=null;renderGame();document.querySelector(`[data-act="target"][data-id="${id}"]`).focus({preventScroll:true})}if(a==='shadow')chooseShadow(id);if(a==='food'){state.selectedFood=state.selectedFood===id?null:id;renderGame(state.selectedFood?`${FOODS[id].name} selected. Choose a bowl.`:defaultStatus());document.querySelector(`[data-act="food"][data-id="${id}"]`).focus({preventScroll:true})}if(a==='bowl'){if(state.selectedFood){sound('drop');giveFood(state.selectedFood,id)}else feedback('Choose a food first, then choose a bowl.')}if(a==='hint')hint();if(a==='next')next();if(a==='advance')start(state.game,state.level+1);if(a==='replay')start(state.game,state.level);if(a==='replay-modal'){modal.close();start(state.game,state.level)}if(a==='home-modal'){modal.close();home()}});
modal.addEventListener('change',e=>{
 const id=e.target.id;
 if(id==='language-setting'){saved.language=e.target.value;renderCurrent();modal.innerHTML=settingsContent();localize(modal);$('#language-setting').focus()}
 if(id==='music-setting')saved.music=e.target.checked;
 if(id==='effects-setting')saved.effects=e.target.checked;
 if(id==='motion-setting'){saved.reduced=e.target.checked;applySettings()}
 save();syncAudio();
 modal.querySelector('[data-act="mute-all"]').disabled=!saved.music&&!saved.effects;
 if(id==='effects-setting'&&saved.effects)sound('click');
});
// Resume an explicitly saved audio preference only after a user gesture.
document.addEventListener('pointerdown',()=>{if(saved.music||saved.effects)syncAudio()},{once:true});
document.addEventListener('keydown',()=>{if(saved.music||saved.effects)syncAudio()},{once:true});
// Dragging begins after a small movement threshold. Taps use the accessible select-and-place path.
app.addEventListener('pointerdown',e=>{const el=e.target.closest('.food-choice:not(:disabled)');if(!el||modal.open||e.button!==0)return;drag={id:el.dataset.id,el,pointer:e.pointerId,x:e.clientX,y:e.clientY,moved:false,ghost:null,lastX:e.clientX,lastY:e.clientY,frame:null};el.setPointerCapture(e.pointerId)});
app.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.pointer)return;if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>7){drag.moved=true;sound('drag');drag.frame=requestAnimationFrame(scrollDuringDrag);drag.el.classList.add('drag-source');drag.ghost=document.createElement('div');drag.ghost.className='drag-ghost';drag.ghost.setAttribute('aria-hidden','true');drag.ghost.innerHTML=`<div class="food-art">${food(drag.id)}</div><div class="label">${FOODS[drag.id].name}</div>`;localize(drag.ghost);document.body.appendChild(drag.ghost)}drag.lastX=e.clientX;drag.lastY=e.clientY;if(drag.moved){e.preventDefault();drag.ghost.style.left=e.clientX+'px';drag.ghost.style.top=e.clientY+'px';document.querySelectorAll('.bowl.over').forEach(el=>el.classList.remove('over'));const bowl=document.elementFromPoint(e.clientX,e.clientY)?.closest('.bowl:not(:disabled)');bowl?.classList.add('over')}});
app.addEventListener('pointerup',e=>{if(!drag||e.pointerId!==drag.pointer)return;const {id,moved}=drag;const bowl=moved?document.elementFromPoint(e.clientX,e.clientY)?.closest('.bowl:not(:disabled)'):null;if(moved){suppressClickUntil=performance.now()+400;e.preventDefault()}cancelDrag();if(moved){if(bowl){sound('drop');giveFood(id,bowl.dataset.id)}else feedback('Drag the food into a bowl. You can try again.')}});
app.addEventListener('pointercancel',cancelDrag);
function scrollDuringDrag(){
 if(!drag?.moved)return;
 const edge=60,y=drag.lastY,speed=y<edge?-8:y>innerHeight-edge?8:0;
 if(speed){window.scrollBy(0,speed);document.querySelectorAll('.bowl.over').forEach(el=>el.classList.remove('over'));document.elementFromPoint(drag.lastX,y)?.closest('.bowl:not(:disabled)')?.classList.add('over')}
 drag.frame=requestAnimationFrame(scrollDuringDrag);
}
function cancelDrag(){if(drag){cancelAnimationFrame(drag.frame);try{if(drag.el.hasPointerCapture(drag.pointer))drag.el.releasePointerCapture(drag.pointer)}catch(e){}drag.el.classList.remove('drag-source');drag.ghost?.remove();drag=null}document.querySelectorAll('.bowl.over').forEach(el=>el.classList.remove('over'))}
window.addEventListener('blur',cancelDrag);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.open&&!motionBusy){if(drag)cancelDrag();else if(state.screen==='game')openModal('pause')}});
function home(){homeBase();localize(app)}
function levels(game=state.game){levelsBase(game);localize(app)}
function renderGame(message='',type=''){renderGameBase(message,type);localize(app)}
function endScreen(){endScreenBase();localize(app)}
home();
