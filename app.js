const TOTAL_DAYS = 80;
const KEY = 'eighty-days-of-bok-records';
const encouragements = [
  ['첫 걸음을<br/>응원해요','완벽하지 않아도 괜찮아요.<br/>시작한 마음 자체가 이미 복입니다.'],
  ['오늘의 정성이<br/>빛나고 있어요','짧은 시간도 괜찮아요.<br/>쌓인 마음은 분명 나를 바꿔요.'],
  ['참 잘하고<br/>있어요','어제보다 한 걸음 더 나아간 오늘,<br/>그 자체로 충분히 대단해요.'],
  ['복은 이미<br/>자라고 있어요','눈에 보이지 않는 날에도<br/>당신의 정성은 조용히 자랍니다.']
];
const records = JSON.parse(localStorage.getItem(KEY) || '{}');
const dayGrid = document.querySelector('#dayGrid');
const hasRecord = record => record && (Number(record.sin || record.hours) > 0 || Number(record.hak) > 0 || String(record.haeng || '').trim().length > 0);
const getDoneDays = () => Object.keys(records).filter(k => hasRecord(records[k])).map(Number).sort((a,b)=>a-b);
function renderGrid(){
  dayGrid.innerHTML='';
  for(let i=1;i<=TOTAL_DAYS;i++){
    const el=document.createElement('div'); el.className='day-cell';
    if(hasRecord(records[i])) el.classList.add('done');
    if(i===getCurrentDay()) el.classList.add('today');
    el.innerHTML=`<strong>${String(i).padStart(2,'0')}</strong><span>${hasRecord(records[i])?'완료':'-'}</span>`;
    dayGrid.appendChild(el);
  }
}
function getCurrentDay(){
  return Math.min(getDoneDays().length + 1, TOTAL_DAYS);
}
function todayKey(){return new Date().toISOString().slice(0,10)}
function updateStats(){
  const done=getDoneDays(), total=done.reduce((sum,d)=>sum+Number(records[d].hours||0),0);
  const pct=Math.round(done.length/TOTAL_DAYS*100);
  document.querySelector('#daysDone').textContent=done.length; document.querySelector('#totalHours').textContent=total%1?total.toFixed(1):total;
  document.querySelector('#progressPercent').textContent=pct; document.querySelector('#progressBar').style.width=pct+'%'; document.querySelector('#completedLabel').textContent=`${done.length} / 80일 완료`; document.querySelector('#sealCount').textContent=`${done.length}개 모음`;
  let streak=0, expected=done.length?done[done.length-1]:0; for(let i=done.length-1;i>=0&&done[i]===expected;i--){streak++;expected--;} document.querySelector('#streakDays').textContent=streak;
  const day=getCurrentDay(); document.querySelector('#heroDay').textContent=String(day).padStart(2,'0'); document.querySelector('#encouragementDay').textContent='DAY '+String(day).padStart(2,'0');
  const msg=encouragements[Math.min(Math.floor(done.length/20),3)]; document.querySelector('#encouragementTitle').innerHTML=msg[0];document.querySelector('#encouragementText').innerHTML=msg[1];
  const checkpoints=document.querySelectorAll('.milestone'); checkpoints.forEach((el,i)=>el.classList.toggle('reached',done.length>=(i+1)*20));
  const finalTitle=document.querySelector('#final h2'), finalText=document.querySelector('#final p');
  if(done.length>=TOTAL_DAYS){ finalTitle.innerHTML='80일의 여정이<br/><em>완성되었어요.</em>'; finalText.innerHTML=`총 ${total%1?total.toFixed(1):total}시간의 신행학과 ${done.length}일의 실천을 만들었어요.<br/>이 기록은 앞으로의 나를 비추는 복이 됩니다.`; }
}
function renderMilestones(){
  const items=[['20일','습관의 씨앗','꾸준함이 습관으로 자리 잡기 시작해요.'],['40일','마음의 변화','반환점이에요. 내가 달라진 순간을 찾아보세요.'],['60일','깊어지는 정성','여기까지 온 나를 마음껏 칭찬해주세요.'],['80일','나만의 결과','80일의 기록이 나만의 변화로 완성돼요.']];
  document.querySelector('#milestoneList').innerHTML=items.map(x=>`<div class="milestone"><div class="milestone-day">DAY ${x[0]}</div><p><b>${x[1]}</b><br>${x[2]}</p></div>`).join('');
}
function setDate(){const d=new Date();document.querySelector('#todayDate').textContent=`${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`}
document.querySelector('#recordForm').addEventListener('submit',e=>{e.preventDefault();const day=getCurrentDay();const sin=Number(document.querySelector('#practiceSin').value)||0;const haeng=document.querySelector('#practiceHaeng').value.trim();const hak=Number(document.querySelector('#practiceHak').value)||0;if(!sin&&!haeng&&!hak){showToast('신·행·학 중 하나 이상 기록해 주세요.');return}records[day]={hours:sin,sin,haeng,hak,note:document.querySelector('#practiceNote').value,date:todayKey()};localStorage.setItem(KEY,JSON.stringify(records));document.querySelector('#savedState').hidden=false;document.querySelector('#recordForm').reset();renderGrid();updateStats();showToast(`DAY ${String(day).padStart(2,'0')} 복운도장이 찍혔어요 ✦`);});
document.querySelector('#resetBtn').addEventListener('click',()=>{if(confirm('모든 기록을 지우고 새로 시작할까요?')){localStorage.removeItem(KEY);location.reload()}});
function showToast(t){const el=document.querySelector('#toast');el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2800)}
renderMilestones();setDate();renderGrid();updateStats();
