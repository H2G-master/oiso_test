let currentStatusBadge = null;

function navigateTo(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
function switchTab(t){
  const m={home:'screen-home',records:'screen-records',settings:'screen-settings'};
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(m[t]).classList.add('active');
}
function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2000);
}
function showAlert(title,msg,cancel,confirm){
  document.getElementById('alert-title').textContent=title;
  document.getElementById('alert-msg').textContent=msg;
  document.getElementById('alert-cancel').textContent=cancel;
  document.getElementById('alert-confirm').textContent=confirm;
  document.getElementById('alert-overlay').classList.add('active');
}
function closeAlert(){document.getElementById('alert-overlay').classList.remove('active');}

function togglePurpose(btn) {
  btn.parentElement.querySelectorAll('.purpose-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
}

function toggleLabTest(btn) {
  btn.classList.toggle('active');
}

function addMedicineRow() {
  const list = document.getElementById('medicine-list');
  if(!list) return;
  const row = document.createElement('div');
  row.className = 'medicine-row';
  row.innerHTML = '<input placeholder="약품명" style="flex:2;"><input placeholder="용량" style="flex:1;"><input placeholder="용법" style="flex:1;"><button class="medicine-remove" onclick="this.parentElement.remove()">✕</button>';
  list.appendChild(row);
}

function openStatusSheet(badgeEl, currentStatus) {
  currentStatusBadge = badgeEl;
  const overlay = document.getElementById('status-sheet-overlay');
  overlay.querySelectorAll('.bottom-sheet-option').forEach(opt => { opt.classList.remove('selected'); if (opt.dataset.status === currentStatus) opt.classList.add('selected'); });
  overlay.classList.add('active');
}
function closeStatusSheet() { document.getElementById('status-sheet-overlay').classList.remove('active'); }
function selectStatus(status) {
  if (!currentStatusBadge) return;
  const labels = { settled: '✓ 정산완료', unsettled: '✕ 미정산', pending: '⏳ 정산대기' };
  currentStatusBadge.classList.remove('settled', 'unsettled', 'pending');
  currentStatusBadge.classList.add(status);
  currentStatusBadge.textContent = labels[status];
  currentStatusBadge.setAttribute('onclick', "event.stopPropagation(); openStatusSheet(this, '" + status + "')");
  closeStatusSheet();
  showToast('정산 상태가 변경되었습니다');
}

function switchTreatmentType(type) {
  document.querySelectorAll('#treatment-tabs .treatment-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('animal-cards-castration').style.display = 'none';
  document.getElementById('animal-cards-blood').style.display = 'none';
  document.getElementById('animal-cards-general').style.display = 'none';
  const map = { castration: 'animal-cards-castration', blood: 'animal-cards-blood', general: 'animal-cards-general' };
  document.getElementById(map[type]).style.display = 'block';
}

function handleSearch(val){
  const results=document.getElementById('search-results');
  if(!results) return;
  if(!val){results.innerHTML='<div style="text-align:center; padding:60px 40px; color:var(--gray-400); font-size:14px;">농장주의 이름, 주소, 개체 정보를 찾거나<br>직접 이표번호를 입력하여 진료기록을 입력할 수 있습니다</div>';return;}
  const isNum=/^\d+$/.test(val);
  if(isNum&&val.length>=3){
    results.innerHTML='<div class="patient-card" onclick="navigateTo(\'screen-record-input\')" style="margin:4px 20px;"><div class="patient-card-top"><span class="patient-id">4324-'+val+'-3</span></div><div class="patient-tags"><span class="tag">한우</span><span class="tag">암컷</span><span class="tag">5세</span></div><div class="patient-owner">주현우 | 경상남도 양산시 물금읍 증산리 84-9</div></div>';
  }else if(!isNum&&val.length>=1){
    results.innerHTML='<div class="patient-card" onclick="navigateTo(\'screen-record-input\')" style="margin:4px 20px;"><div class="patient-card-top"><span class="patient-id">1742-2421-0</span></div><div class="patient-tags"><span class="tag">한우</span><span class="tag">수컷</span><span class="tag">3세</span></div><div class="patient-owner">김형만 | 경상남도 양산시 물금읍 증산리 ...</div></div>';
  }else{
    results.innerHTML='<div style="text-align:center; padding:60px 40px; color:var(--gray-400); font-size:14px;">검색 결과가 없습니다</div>';
  }
}
function showFarmerPopup() {
  document.getElementById('farmer-popup').classList.add('active');
}
function closeFarmerPopup() {
  document.getElementById('farmer-popup').classList.remove('active');
}
function selectFarmer(name) {
  closeFarmerPopup();
  navigateTo('screen-group-record-input');
}

function toggleGroupNextBtn() {
  var textarea = document.getElementById('group-textarea');
  var btn = document.getElementById('group-next-btn');
  if (!textarea || !btn) return;
  if (textarea.value.trim().length > 0) {
    btn.classList.remove('disabled');
  } else {
    btn.classList.add('disabled');
  }
}

function checkCardFilled(el) {
  var card = el.closest('.group-animal-card');
  if (!card) return;
  var select = card.querySelector('select');
  var input = card.querySelector('input');
  var idx = card.querySelector('.group-animal-idx');
  if (!select || !input) return;
  var isFilled = select.value !== '' && input.value.trim() !== '';
  if (isFilled) {
    card.classList.add('filled');
    if (idx) idx.style.background = '';
  } else {
    card.classList.remove('filled');
    if (idx) idx.style.background = 'var(--gray-300)';
  }
  updateFilledCount();
}

function updateFilledCount() {
  var container = document.getElementById('animal-cards-castration');
  var counter = document.getElementById('filled-count');
  if (!container || !counter) return;
  var cards = container.querySelectorAll('.group-animal-card');
  var filled = container.querySelectorAll('.group-animal-card.filled').length;
  var total = cards.length;
  counter.textContent = '완료 ' + filled + '/' + total;
}
