'use strict';
// All visible text and accessible labels pass through this dictionary.
const TH = {
'Play another set':'เล่นอีกชุด','All levels completed!':'ผ่านครบทุกเลเวลแล้ว!',
'All 40 levels completed!':'ผ่านครบทั้ง 40 เลเวลแล้ว!',
'Your next adventure can have new puzzles.':'เริ่มการผจญภัยครั้งใหม่กับโจทย์ชุดใหม่ได้เลย',
'Start a new adventure':'เริ่มการผจญภัยใหม่','Start a new adventure?':'เริ่มการผจญภัยใหม่ไหม?',
'This clears completion marks for both games. Your language, sound and movement settings stay the same.':'เครื่องหมายผ่านของทั้งสองเกมจะถูกล้าง โดยเก็บค่าภาษา เสียง และการเคลื่อนไหวไว้เหมือนเดิม',
'Keep my progress':'เก็บความคืบหน้าไว้','Reset both games':'รีเซ็ตทั้งสองเกม',
'Progress reset. Choose a game to begin at level 1.':'รีเซ็ตแล้ว เลือกเกมเพื่อเริ่มที่เลเวล 1',

'Settings':'ตั้งค่า','⚙ Settings':'⚙ ตั้งค่า','Two little adventures':'สองเกมสนุกกับเพื่อนตัวน้อย',
'Choose a game':'เลือกเกม','Meet your friends. Play at your own pace.':'พบกับเพื่อน ๆ และเล่นตามจังหวะของคุณ',
'20 LEVELS':'20 เลเวล','20 LEVELS · 2 STAGES EACH':'20 เลเวล · เลเวลละ 2 ด่าน',
'Match Shadow':'จับคู่เงา','Feed a Friend':'ให้อาหารเพื่อน','Find the matching shadow.':'ค้นหาเงาที่ตรงกับตัวละคร',
'Play Match Shadow':'เล่นเกมจับคู่เงา','Play Feed a Friend':'เล่นเกมให้อาหารเพื่อน',
'Bring each friend the food they want.':'นำอาหารที่เพื่อนแต่ละตัวต้องการไปให้',
'✓ No time limit':'✓ ไม่จำกัดเวลา','✓ Try as often as you like':'✓ ลองใหม่ได้เสมอ','✓ All characters available':'✓ เล่นได้ครบทุกตัวละคร',
'Made for little moments of discovery.':'เรียนรู้และค้นพบสิ่งใหม่ไปด้วยกัน',
'⌂ Home':'⌂ หน้าหลัก','Choose a level':'เลือกเลเวล','Start anywhere. Play a level again whenever you like.':'เริ่มที่เลเวลไหนก็ได้ และกลับมาเล่นซ้ำได้ทุกเมื่อ',
'How to play:':'วิธีเล่น:','Look at the picture, then choose its matching shadow.':'ดูภาพ แล้วเลือกเงาที่ตรงกัน',
'On a board with more friends, select a picture first. Match all the friends to finish.':'เมื่อมีเพื่อนหลายตัว ให้เลือกภาพก่อน แล้วจับคู่ให้ครบทุกตัว',
'Look at the food your friend asks for. Drag that food to their bowl.':'ดูอาหารที่เพื่อนต้องการ แล้วลากอาหารนั้นไปใส่ชาม',
'Each level has 2 stages with different friends and foods. Levels 1–8: 1 friend. Levels 9–16: 2 friends. Levels 17–20: 3 friends. Each friend wants one food. More food choices appear as you progress.':'ทุกเลเวลมี 2 ด่าน โดยเปลี่ยนเพื่อนและอาหาร เลเวล 1–8 มีเพื่อน 1 ตัว เลเวล 9–16 มี 2 ตัว เลเวล 17–20 มี 3 ตัว แต่ละตัวต้องการอาหาร 1 อย่าง ตัวเลือกอาหารจะเพิ่มขึ้นตามเลเวล',
'You can also select a food, then select a bowl.':'หรือแตะเลือกอาหาร แล้วแตะชามก็ได้',
'✓ means completed. Every level is available.':'✓ หมายถึงเล่นผ่านแล้ว เลือกเล่นได้ทุกเลเวล',
'‹ Levels':'‹ เลเวล','Levels':'เลเวล','Ⅱ Pause':'Ⅱ พักเกม','Mute all':'ปิดเสียงทั้งหมด',
'All sound off':'ปิดเสียงอยู่','Drag the food to your friend.':'ลากอาหารไปให้เพื่อน',
'Drag each food to the right friend.':'ลากอาหารไปให้เพื่อนที่ต้องการ',
'Choose the matching shadow.':'เลือกเงาที่ตรงกัน','Choose a friend, then its shadow.':'เลือกเพื่อน แล้วเลือกเงาที่ตรงกัน',
'Drop food here':'วางอาหารที่นี่','✓ Thank you!':'✓ ขอบคุณ!','☀ Hint':'☀ คำใบ้','Next stage':'ด่านถัดไป','Finish level':'จบเลเวล',
'Mouse or touch: drag to a bowl. Or select a food, then a bowl.':'ลากอาหารไปใส่ชาม หรือแตะอาหารแล้วแตะชาม',
'Use the mouse, touch, or Tab and Enter. Take your time.':'ใช้เมาส์ นิ้วสัมผัส หรือปุ่ม Tab และ Enter เล่นได้ตามสบาย',
'Everyone is fed. Well done!':'เพื่อนทุกตัวได้อาหารแล้ว เก่งมาก!','All shadows matched. Well done!':'จับคู่เงาครบแล้ว เก่งมาก!',
'All done. Select the next button to continue.':'เสร็จแล้ว เลือกปุ่มถัดไปเพื่อเล่นต่อ',
'These shapes are different. Try another shadow.':'รูปร่างยังไม่ตรงกัน ลองเลือกเงาอื่นนะ',
'Try another food. Look at the food above your friend.':'ลองอาหารอื่นนะ ดูอาหารที่อยู่เหนือเพื่อน',
'Look at the outlined shadow. Compare its shape.':'ดูเงาที่มีเส้นกรอบ แล้วเปรียบเทียบรูปร่าง',
'Hint shown. Look for the outlined choice.':'แสดงคำใบ้แล้ว มองหาตัวเลือกที่มีเส้นกรอบ',
'Stage 2. New friends and new foods.':'ด่านที่ 2 พบกับเพื่อนและอาหารชุดใหม่',
'You finished the last level. You can play any level again.':'คุณผ่านเลเวลสุดท้ายแล้ว กลับไปเล่นเลเวลไหนอีกก็ได้',
'You did it. Ready for another little adventure?':'ทำได้แล้ว พร้อมไปสนุกกันต่อไหม',
'Progress could not be saved in this browser. You can still play every level.':'เบราว์เซอร์นี้บันทึกความคืบหน้าไม่ได้ แต่คุณยังเล่นได้ทุกเลเวล',
'Next level →':'เลเวลถัดไป →','Play again':'เล่นอีกครั้ง','Make the game comfortable for you.':'ปรับเกมให้เล่นได้สบายในแบบของคุณ',
'Language':'ภาษา','Background music':'เพลงพื้นหลัง','Soft original melody.':'ทำนองเบา ๆ ที่แต่งขึ้นสำหรับเกม',
'Sound effects':'เสียงเอฟเฟกต์','Click, pick up, drop and correct answers.':'เสียงคลิก หยิบ วาง และตอบถูก',
'All audio is off by default. You can switch it on here.':'เริ่มต้นปิดเสียงทั้งหมด คุณเลือกเปิดเสียงได้ที่นี่',
'Reduce movement':'ลดการเคลื่อนไหว','Keep screen changes still.':'ลดแอนิเมชันและการเลื่อนภาพ',
'Done':'เสร็จสิ้น','Game paused':'พักเกมแล้ว','Your friends will wait. Continue when you are ready.':'เพื่อน ๆ จะรอคุณ พร้อมเมื่อไรค่อยเล่นต่อ',
'Continue playing':'เล่นต่อ','Restart level':'เริ่มเลเวลใหม่','Choose a food first, then choose a bowl.':'เลือกอาหารก่อน แล้วเลือกชาม',
'Drag the food into a bowl. You can try again.':'ลากอาหารไปใส่ชาม ลองใหม่ได้เลย',
'Star Cookie':'คุกกี้ดาว','Cloud Cake':'เค้กก้อนเมฆ','Leaf Jelly':'เยลลี่ใบไม้','Moon Biscuit':'บิสกิตพระจันทร์',
'Heart Fruit':'ผลไม้หัวใจ','Flame Cookie':'คุกกี้เปลวไฟ','Shell Jelly':'เยลลี่เปลือกหอย','Flower Cookie':'คุกกี้ดอกไม้'
};
function tr(raw){
 if(saved.language!=='th')return raw;
 const s=raw.trim();let translated=TH[s];
 const foodName=n=>TH[Object.keys(FOODS).map(k=>FOODS[k].name).find(x=>x.toLowerCase()===n.toLowerCase())]||n;
 const rules=[
 [/^(\d+) \/ 20 levels completed$/,(_,n)=>`ผ่านแล้ว ${n} / 20 เลเวล`],
 [/^Continue · Level (\d+)$/,(_,n)=>`เล่นต่อ · เลเวล ${n}`],
 [/^Level (\d+) \/ 20$/,(_,n)=>`เลเวล ${n} / 20`], [/^Stage (\d+) \/ 2$/,(_,n)=>`ด่าน ${n} / 2`],
 [/^Level (\d+)(, completed)?$/,(_,n,c)=>`เลเวล ${n}${c?' ผ่านแล้ว':''}`],
 [/^(\d+) friends? · (\d+) foods$/,(_,n,f)=>`เพื่อน ${n} ตัว · อาหาร ${f} อย่าง`],
 [/^(\d+) match(?:es)?$/,(_,n)=>`${n} คู่`], [/^Level (\d+) complete!$/,(_,n)=>`ผ่านเลเวล ${n} แล้ว!`],
 [/^Shadow (\d+)(, matched)?$/,(_,n,c)=>`เงาที่ ${n}${c?' จับคู่แล้ว':''}`],
 [/^(.+)'s bowl(, fed)?$/,(_,n,c)=>`ชามของ ${n}${c?' ได้อาหารแล้ว':''}`],
 [/^(.+), please!$/,(_,n)=>`ขอ${foodName(n)}นะ`],
 [/^(.+), matched$/,(_,n)=>`${foodName(n)} จับคู่แล้ว`],
 [/^Fed: (\d+) \/ (\d+)$/,(_,n,a)=>`ให้อาหารแล้ว ${n} / ${a}`],
 [/^(\d+) \/ (\d+) matched(?: · Find (.+)’s shadow)?$/,(_,n,a,c)=>`จับคู่แล้ว ${n} / ${a}${c?' · หาเงาของ '+c:''}`],
 [/^Thank you! Fed: (\d+) \/ (\d+)$/,(_,n,a)=>`ขอบคุณ! ให้อาหารแล้ว ${n} / ${a}`],
 [/^Matched! Now find (.+)’s shadow\.$/,(_,n)=>`จับคู่แล้ว! ต่อไปหาเงาของ ${n}`],
 [/^(.+) matched\.$/,(_,n)=>`จับคู่ ${n} แล้ว`],
 [/^(.+) is moving to the matching shadow\.$/,(_,n)=>`${n} กำลังเลื่อนไปยังเงาที่ตรงกัน`],
 [/^(.+) wants (.+)\. Try again\.$/,(_,n,f)=>`${n} ต้องการ${foodName(f)} ลองอีกครั้งนะ`],
 [/^Find (.+) for (.+)\.$/,(_,f,n)=>`หา${foodName(f)}ให้ ${n}`],
 [/^(.+) selected\. Choose a bowl\.$/,(_,n)=>`เลือก${foodName(n)}แล้ว เลือกชามได้เลย`],
 [/^(Next stage|Finish level) →$/,(_,n)=>`${TH[n]} →`]
 ];
 if(!translated){for(const [re,fn] of rules){if(re.test(s)){translated=s.replace(re,fn);break}}}
 return translated?raw.replace(s,translated):raw;
}
function localize(root){
 document.documentElement.lang=saved.language;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
 while((node=walker.nextNode()))node.nodeValue=tr(node.nodeValue);
 root.querySelectorAll('[aria-label]').forEach(el=>el.setAttribute('aria-label',tr(el.getAttribute('aria-label'))));
}
