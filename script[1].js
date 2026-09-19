const form = document.getElementById('applicationForm');
const progressFill = document.getElementById('progressFill');
const percentage = document.getElementById('percentage');
const reviewCard = document.getElementById('reviewCard');
const reviewContent = document.getElementById('reviewContent');

function calcPercentage(){
  const max = Number(form.maxmarks.value);
  const marks = Number(form.marks.value);
  percentage.value = max > 0 && marks >= 0 ? ((marks/max)*100).toFixed(2) + '%' : '';
}
form.maxmarks.addEventListener('input', calcPercentage);
form.marks.addEventListener('input', calcPercentage);

function updateProgress(){
  const required = [...form.querySelectorAll('[required]')];
  const done = required.filter(el => el.type === 'checkbox' ? el.checked : el.value.trim() !== '').length;
  progressFill.style.width = Math.max(5, Math.round(done/required.length*100)) + '%';
}
form.addEventListener('input', updateProgress);
form.addEventListener('change', updateProgress);

document.getElementById('saveDraft').addEventListener('click', () => {
  const data = {};
  [...form.elements].forEach(el => {
    if (el.name && el.type !== 'file') data[el.name] = el.type === 'checkbox' ? el.checked : el.value;
  });
  localStorage.setItem('clerkApplicationDraft', JSON.stringify(data));
  alert('Draft saved on this browser.');
});

window.addEventListener('load', () => {
  const saved = localStorage.getItem('clerkApplicationDraft');
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    Object.entries(data).forEach(([name,value]) => {
      const el = form.elements[name];
      if (!el) return;
      if (el.type === 'checkbox') el.checked = value;
      else el.value = value;
    });
    calcPercentage();
    updateProgress();
  } catch(e){}
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const labels = {
    name:'Candidate Name', father:"Father's / Guardian's Name", dob:'Date of Birth',
    mobile:'Mobile Number', email:'Email Address', category:'Category',
    qualification:'Qualification', board:'Board / Council', year:'Passing Year',
    roll:'Roll / Enrollment No.', maxmarks:'Maximum Marks', marks:'Marks Obtained',
    state:'State', district:'District', pin:'PIN Code'
  };
  reviewContent.innerHTML = '';
  Object.entries(labels).forEach(([name,label]) => {
    const value = form.elements[name]?.value || '';
    const item = document.createElement('div');
    item.className = 'review-item';
    item.innerHTML = `<b>${label}</b>${escapeHtml(value)}`;
    reviewContent.appendChild(item);
  });
  reviewCard.classList.remove('hidden');
  reviewCard.scrollIntoView({behavior:'smooth', block:'start'});
});

document.getElementById('editApplication').addEventListener('click', () => {
  reviewCard.classList.add('hidden');
  document.getElementById('application').scrollIntoView({behavior:'smooth'});
});

document.getElementById('finalSubmit').addEventListener('click', () => {
  alert('Demo submission complete. Connect this button to your backend/API for a real recruitment portal.');
});

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}
updateProgress();
