// ═══════════════════════════════════════
// CANDIDATE PROFILE (used in AI prompts)
// ═══════════════════════════════════════
const PROFILE = `
Patrick Krüger — General Manager, Radisson RED Vienna (179 rooms, 11.5M EUR budget)
Achievements: 700% EBITA increase in 2 years, transformed property from negative EBITDA to top-performer
Previous: Cluster GM Seminaris Hotels Berlin & Leipzig (386 rooms, 14M EUR P&L), GM Lüneburg (210 rooms, 6.5M EUR), GM Potsdam (87 rooms)
Earlier: Group E-Commerce Manager, CEO own jewelry brand, International Sales Manager NH Hotels (pre-opening), Rocco Forte Hotels
Awards: 2022 HR Innovation Award, 2025 AI Hotel Innovation Award
Skills: Turnaround specialist, full P&L owner, luxury & lifestyle brand positioning, MICE/conference strategy, F&B concept development, pre-opening experience, revenue & yield management, AI-driven guest systems
Languages: German (Native), English (Fluent)
Open to: Global relocation
`;

const SYSTEM_PROMPT = `You are a luxury hotel executive career intelligence agent helping Patrick Krüger find his next General Manager role.

Candidate: ${PROFILE}

Target: GM, Cluster GM, Pre-Opening GM, or Resort GM roles at 5-star / luxury properties.
Preferred brands: Ritz-Carlton, St. Regis, W Hotels, EDITION, JW Marriott, Waldorf Astoria, Conrad, LXR, Park Hyatt, Andaz, Alila, InterContinental, Six Senses, Regent, Fairmont, Raffles, Sofitel, Banyan Tree, Aman, Four Seasons, Rosewood, Mandarin Oriental.
Preferred regions: EU, UAE, Saudi Arabia, Qatar, Thailand, Singapore, Vietnam, China.
Exclude: 3-star, select/limited service, assistant GM.

When generating job listings respond ONLY with a valid JSON array (no markdown, no extra text). Each object must have:
id (string), brand (string), property (string), location (string), country (string), region (one of: "European Union","Middle East","Southeast Asia","Greater Asia","Global"), roomCount (number), salaryRange (string), fitScore (number 1-10), priority ("high" or "medium"), roleType (string), keyRequirements (array of 3 strings), strategicRelevance (string, 1-2 sentences), applicationUrl (string, use real brand careers pages), recruiterNote (string).`;

// ═══════════════════════════════════════
// STATE
// ═══════════════════════════════════════
let applications = JSON.parse(localStorage.getItem('pk_applications') || '[]');
let currentFilter = 'all';
let currentSearchJob = null; // job being viewed in detail modal

// ═══════════════════════════════════════
// INIT
// ═══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  const key = localStorage.getItem('anthropic_key');
  if (!key) {
    document.getElementById('setup-modal').classList.remove('hidden');
  } else {
    document.getElementById('settings-api-key').value = key;
  }
  renderTracker();
  // default today's date in modal
  document.getElementById('f-date').value = new Date().toISOString().split('T')[0];
});

// ═══════════════════════════════════════
// API KEY
// ═══════════════════════════════════════
function saveApiKey() {
  const val = document.getElementById('api-key-input').value.trim();
  if (!val.startsWith('sk-ant-')) {
    alert('Please enter a valid Anthropic API key (starts with sk-ant-)');
    return;
  }
  localStorage.setItem('anthropic_key', val);
  document.getElementById('setup-modal').classList.add('hidden');
  document.getElementById('settings-api-key').value = val;
}

function saveApiKeyFromSettings() {
  const val = document.getElementById('settings-api-key').value.trim();
  if (!val.startsWith('sk-ant-')) {
    document.getElementById('settings-key-status').textContent = '⚠ Invalid key format.';
    return;
  }
  localStorage.setItem('anthropic_key', val);
  document.getElementById('settings-key-status').textContent = '✓ Saved!';
  setTimeout(() => document.getElementById('settings-key-status').textContent = '', 2000);
}

// ═══════════════════════════════════════
// TABS
// ═══════════════════════════════════════
function showTab(id) {
  document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  const btns = document.querySelectorAll('.tab-btn');
  btns.forEach(b => { if (b.getAttribute('onclick')?.includes(id)) b.classList.add('active'); });
}

// ═══════════════════════════════════════
// JOB SEARCH
// ═══════════════════════════════════════
async function searchJobs() {
  const key = localStorage.getItem('anthropic_key');
  if (!key) { document.getElementById('setup-modal').classList.remove('hidden'); return; }

  // Build filter description
  const groupEl = document.getElementById('filter-group');
  const selectedGroups = [...groupEl.selectedOptions].map(o => o.value);
  const region = document.getElementById('filter-region').value;
  const roleType = document.getElementById('filter-role').value;
  const size = document.getElementById('filter-size').value;

  let prompt = 'Generate 6 realistic luxury hotel GM job opportunities available in March 2026.';
  if (selectedGroups.length > 0) prompt += ` Focus on these brands: ${selectedGroups.join(', ')}.`;
  if (region) prompt += ` Region: ${region} only.`;
  if (roleType) prompt += ` Role type: ${roleType} only.`;
  if (size === 'boutique') prompt += ` Properties under 100 rooms.`;
  if (size === 'midsize') prompt += ` Properties 100-250 rooms.`;
  if (size === 'large') prompt += ` Properties 250+ rooms.`;
  prompt += ' Return ONLY a valid JSON array, no markdown, no preamble.';

  const btn = document.getElementById('search-btn-text');
  const status = document.getElementById('search-status');
  btn.textContent = 'Searching…';
  document.querySelector('button[onclick="searchJobs()"]').disabled = true;
  status.className = 'status-msg loading';
  status.classList.remove('hidden');
  status.textContent = '⏳ Scanning global luxury markets… this takes about 10 seconds.';
  document.getElementById('search-results').innerHTML = '';

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    const raw = data.content?.map(b => b.text || '').join('') || '[]';
    const clean = raw.replace(/```json|```/g, '').trim();
    const jobs = JSON.parse(clean);
    renderResults(jobs);
    status.classList.add('hidden');
  } catch (e) {
    status.className = 'status-msg error';
    status.textContent = '⚠ Error: ' + e.message + '. Check your API key in Settings.';
  }

  btn.textContent = 'Search with AI';
  document.querySelector('button[onclick="searchJobs()"]').disabled = false;
}

function renderResults(jobs) {
  const container = document.getElementById('search-results');
  if (!jobs.length) {
    container.innerHTML = '<p style="color:#6b7280;font-size:13px">No results found. Try different filters.</p>';
    return;
  }
  container.innerHTML = jobs.map(job => {
    const scoreClass = job.fitScore >= 8 ? 'high' : job.fitScore >= 6 ? 'mid' : 'low';
    const pct = (job.fitScore / 10) * 100;
    const isHigh = job.priority === 'high';
    return `
      <div class="result-card ${isHigh ? 'priority-high' : ''}" onclick="showJobDetail(${JSON.stringify(job).replace(/"/g, '&quot;')})">
        <div class="rc-badge ${isHigh ? 'high' : 'medium'}">${isHigh ? '⭐ Priority' : job.roleType}</div>
        <div class="rc-brand">${escHtml(job.brand)}</div>
        <div class="rc-property">${escHtml(job.property)}</div>
        <div class="rc-location">📍 ${escHtml(job.location)}</div>
        <div class="rc-meta">
          <span>${escHtml(job.roleType)}</span>
          <span>${job.roomCount} rooms</span>
          <span>${escHtml(job.salaryRange || '')}</span>
        </div>
        <div class="score-row">
          <span class="score-label">Fit score</span>
          <div class="score-bar"><div class="score-fill ${scoreClass}" style="width:${pct}%"></div></div>
          <span class="score-num">${job.fitScore}/10</span>
        </div>
        <div class="rc-footer">
          <button onclick="event.stopPropagation(); showJobDetail(${JSON.stringify(job).replace(/"/g, '&quot;')})" style="background:#f3f4f6;border:1px solid #e5e7eb;color:#374151">View Details</button>
          <button onclick="event.stopPropagation(); addToTrackerDirect(${JSON.stringify(job).replace(/"/g, '&quot;')})" style="background:#1e40af;border:none;color:#fff">+ Track</button>
        </div>
      </div>`;
  }).join('');
}

// ═══════════════════════════════════════
// JOB DETAIL MODAL
// ═══════════════════════════════════════
function showJobDetail(job) {
  if (typeof job === 'string') job = JSON.parse(job.replace(/&quot;/g, '"'));
  currentSearchJob = job;
  document.getElementById('jd-title').textContent = job.property;
  document.getElementById('jd-body').innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px">
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <div style="flex:1;min-width:200px">
          <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;font-weight:600;margin-bottom:4px">Brand</div>
          <div style="font-weight:500">${escHtml(job.brand)}</div>
        </div>
        <div style="flex:1;min-width:200px">
          <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;font-weight:600;margin-bottom:4px">Location</div>
          <div>${escHtml(job.location)}</div>
        </div>
        <div style="flex:1;min-width:120px">
          <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;font-weight:600;margin-bottom:4px">Role Type</div>
          <div>${escHtml(job.roleType)}</div>
        </div>
        <div style="flex:1;min-width:120px">
          <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;font-weight:600;margin-bottom:4px">Rooms</div>
          <div>${job.roomCount}</div>
        </div>
        <div style="flex:1;min-width:120px">
          <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;font-weight:600;margin-bottom:4px">Salary</div>
          <div>${escHtml(job.salaryRange || 'N/A')}</div>
        </div>
        <div style="flex:1;min-width:80px">
          <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;font-weight:600;margin-bottom:4px">Fit Score</div>
          <div style="font-weight:700;color:${job.fitScore>=8?'#16a34a':job.fitScore>=6?'#d97706':'#dc2626'}">${job.fitScore}/10</div>
        </div>
      </div>
      <div>
        <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;font-weight:600;margin-bottom:6px">Strategic Relevance</div>
        <div style="font-size:13px;color:#374151;line-height:1.6">${escHtml(job.strategicRelevance)}</div>
      </div>
      <div>
        <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;font-weight:600;margin-bottom:6px">Key Requirements</div>
        <ul style="padding-left:18px;font-size:13px;color:#374151;line-height:1.9">
          ${(job.keyRequirements||[]).map(r => `<li>${escHtml(r)}</li>`).join('')}
        </ul>
      </div>
      ${job.recruiterNote ? `<div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:7px;padding:12px;font-size:12px;color:#6b7280;font-style:italic">${escHtml(job.recruiterNote)}</div>` : ''}
      <div>
        <a href="${escHtml(job.applicationUrl)}" target="_blank" style="font-size:13px">Apply → ${escHtml(job.applicationUrl)}</a>
      </div>
    </div>`;
  document.getElementById('job-detail-modal').classList.remove('hidden');
}

function closeJobDetail() {
  document.getElementById('job-detail-modal').classList.add('hidden');
  currentSearchJob = null;
}

function addToTrackerFromSearch() {
  if (!currentSearchJob) return;
  addToTrackerDirect(currentSearchJob);
  closeJobDetail();
}

function addToTrackerDirect(job) {
  if (typeof job === 'string') job = JSON.parse(job.replace(/&quot;/g, '"'));
  // pre-fill modal
  openAddModal();
  document.getElementById('f-property').value = job.property || '';
  document.getElementById('f-brand').value = job.brand || '';
  document.getElementById('f-location').value = job.location || '';
  document.getElementById('f-role').value = job.roleType || 'General Manager';
  document.getElementById('f-salary').value = job.salaryRange || '';
  document.getElementById('f-url').value = job.applicationUrl || '';
  document.getElementById('f-notes').value = job.strategicRelevance || '';
}

// ═══════════════════════════════════════
// APPLICATION TRACKER
// ═══════════════════════════════════════
function openAddModal(id) {
  document.getElementById('modal-title').textContent = id ? 'Edit Application' : 'Add Application';
  document.getElementById('edit-id').value = id || '';

  if (id) {
    const app = applications.find(a => a.id === id);
    if (app) {
      document.getElementById('f-property').value = app.property || '';
      document.getElementById('f-brand').value = app.brand || '';
      document.getElementById('f-location').value = app.location || '';
      document.getElementById('f-role').value = app.role || 'General Manager';
      document.getElementById('f-status').value = app.status || 'Saved';
      document.getElementById('f-date').value = app.date || '';
      document.getElementById('f-salary').value = app.salary || '';
      document.getElementById('f-url').value = app.url || '';
      document.getElementById('f-contact').value = app.contact || '';
      document.getElementById('f-notes').value = app.notes || '';
      document.getElementById('f-interview').value = app.interview || '';
    }
  } else {
    // Clear form
    ['f-property','f-brand','f-location','f-salary','f-url','f-contact','f-notes','f-interview'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('f-status').value = 'Saved';
    document.getElementById('f-role').value = 'General Manager';
    document.getElementById('f-date').value = new Date().toISOString().split('T')[0];
  }

  document.getElementById('app-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('app-modal').classList.add('hidden');
}

function saveApplication() {
  const property = document.getElementById('f-property').value.trim();
  if (!property) { alert('Please enter a property name.'); return; }

  const editId = document.getElementById('edit-id').value;
  const app = {
    id: editId || Date.now().toString(),
    property,
    brand: document.getElementById('f-brand').value.trim(),
    location: document.getElementById('f-location').value.trim(),
    role: document.getElementById('f-role').value,
    status: document.getElementById('f-status').value,
    date: document.getElementById('f-date').value,
    salary: document.getElementById('f-salary').value.trim(),
    url: document.getElementById('f-url').value.trim(),
    contact: document.getElementById('f-contact').value.trim(),
    notes: document.getElementById('f-notes').value.trim(),
    interview: document.getElementById('f-interview').value.trim(),
    updatedAt: new Date().toISOString(),
  };

  if (editId) {
    const idx = applications.findIndex(a => a.id === editId);
    if (idx >= 0) applications[idx] = app; else applications.push(app);
  } else {
    applications.push(app);
  }

  saveApplications();
  closeModal();
  renderTracker();
  showTab('tracker');
}

function deleteApplication(id) {
  if (!confirm('Delete this application?')) return;
  applications = applications.filter(a => a.id !== id);
  saveApplications();
  renderTracker();
}

function saveApplications() {
  localStorage.setItem('pk_applications', JSON.stringify(applications));
}

function filterTracker(status) {
  currentFilter = status;
  renderTracker();
}

function renderTracker() {
  const stats = document.getElementById('tracker-stats');
  const list = document.getElementById('tracker-list');

  // Stats
  const statusCounts = { Saved: 0, Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
  applications.forEach(a => { if (statusCounts[a.status] !== undefined) statusCounts[a.status]++; });
  const labels = { Saved: '📌 Saved', Applied: '📤 Applied', Interview: '🗓 Interviews', Offer: '🎉 Offers', Rejected: '❌ Rejected' };
  stats.innerHTML = Object.entries(statusCounts).map(([s, c]) =>
    `<div class="stat-pill"><span>${labels[s]}</span><span class="stat-count">${c}</span></div>`
  ).join('');

  // List
  const filtered = currentFilter === 'all' ? applications : applications.filter(a => a.status === currentFilter);
  if (!filtered.length) {
    list.innerHTML = `<div class="tracker-empty"><div class="empty-icon">📋</div><p>${applications.length ? 'No applications match this filter.' : 'No applications yet. Add your first one above!'}</p></div>`;
    return;
  }

  // Sort: Interview > Offer > Applied > Saved > Rejected
  const order = { Interview: 0, Offer: 1, Applied: 2, Saved: 3, Rejected: 4 };
  const sorted = [...filtered].sort((a, b) => (order[a.status] ?? 5) - (order[b.status] ?? 5));

  list.innerHTML = sorted.map(app => `
    <div class="tracker-card">
      <div class="tc-header">
        <div>
          <div class="tc-property">${escHtml(app.property)}</div>
          <div class="tc-brand-location">${[app.brand, app.location].filter(Boolean).join(' · ')}</div>
        </div>
        <div class="tc-actions">
          <button onclick="openAddModal('${app.id}')">Edit</button>
          <button onclick="deleteApplication('${app.id}')" style="color:#dc2626;border-color:#fecaca">Delete</button>
        </div>
      </div>
      <div class="tc-meta">
        <span class="status-badge status-${app.status}">${app.status}</span>
        ${app.role ? `<span class="tc-meta-item">${escHtml(app.role)}</span>` : ''}
        ${app.date ? `<span class="tc-meta-item"><strong>Applied:</strong> ${app.date}</span>` : ''}
        ${app.salary ? `<span class="tc-meta-item"><strong>Salary:</strong> ${escHtml(app.salary)}</span>` : ''}
        ${app.contact ? `<span class="tc-meta-item"><strong>Contact:</strong> ${escHtml(app.contact)}</span>` : ''}
        ${app.url ? `<span class="tc-meta-item"><a href="${escHtml(app.url)}" target="_blank">Job Posting →</a></span>` : ''}
      </div>
      ${app.notes ? `<div class="tc-notes-section"><div class="tc-notes-label">Notes</div><div class="tc-notes-text">${escHtml(app.notes)}</div></div>` : ''}
      ${app.interview ? `<div class="tc-interview-section"><div class="tc-interview-label">🎯 Interview Preparation</div><div class="tc-notes-text">${escHtml(app.interview)}</div></div>` : ''}
    </div>`).join('');
}

// ═══════════════════════════════════════
// EXPORT / IMPORT
// ═══════════════════════════════════════
function exportData() {
  const blob = new Blob([JSON.stringify(applications, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = `pk-applications-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
}

function importData(e) {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (!Array.isArray(data)) throw new Error('Invalid format');
      applications = data;
      saveApplications(); renderTracker();
      alert(`Imported ${data.length} applications.`);
    } catch { alert('Failed to import. Invalid JSON file.'); }
  };
  reader.readAsText(file);
}

// ═══════════════════════════════════════
// COPY UTILITIES
// ═══════════════════════════════════════
function copyText(btn, text) {
  navigator.clipboard.writeText(text.replace(/&quot;/g, '"')).then(() => {
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 1500);
  });
}

function copyFromId(boxId) {
  const code = document.querySelector(`#${boxId} code`);
  if (!code) return;
  navigator.clipboard.writeText(code.textContent).then(() => {
    const btn = document.querySelector(`#${boxId} .copy-btn`);
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 1500);
  });
}

// ═══════════════════════════════════════
// UTILS
// ═══════════════════════════════════════
function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Close modals on overlay click
document.getElementById('app-modal').addEventListener('click', function(e) { if (e.target === this) closeModal(); });
document.getElementById('job-detail-modal').addEventListener('click', function(e) { if (e.target === this) closeJobDetail(); });
document.getElementById('setup-modal').addEventListener('click', function(e) { if (e.target === this && localStorage.getItem('anthropic_key')) this.classList.add('hidden'); });
