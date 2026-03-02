// ═══════════════════════════════════════
// STATE
// ═══════════════════════════════════════
let applications = JSON.parse(localStorage.getItem('pk_applications') || '[]');
let currentFilter = 'all';
let currentSearchJob = null;

// ═══════════════════════════════════════
// REAL BRAND CAREER PAGE URLS
// ═══════════════════════════════════════
const BRAND_CAREERS = {
  'Ritz-Carlton':   'https://careers.marriott.com/search-jobs?q=general+manager+ritz+carlton',
  'St. Regis':      'https://careers.marriott.com/search-jobs?q=general+manager+st+regis',
  'W Hotels':       'https://careers.marriott.com/search-jobs?q=general+manager+w+hotels',
  'EDITION Hotels': 'https://careers.marriott.com/search-jobs?q=general+manager+edition',
  'JW Marriott':    'https://careers.marriott.com/search-jobs?q=general+manager+jw+marriott',
  'Marriott':       'https://careers.marriott.com/search-jobs?q=general+manager',
  'Waldorf Astoria':'https://jobs.hilton.com/us/en/search-results?keywords=general+manager+waldorf+astoria',
  'Conrad Hotels':  'https://jobs.hilton.com/us/en/search-results?keywords=general+manager+conrad',
  'LXR Hotels':     'https://jobs.hilton.com/us/en/search-results?keywords=general+manager+lxr',
  'Park Hyatt':     'https://careers.hyatt.com/en-US/search?q=general+manager+park+hyatt',
  'Andaz':          'https://careers.hyatt.com/en-US/search?q=general+manager+andaz',
  'Alila':          'https://careers.hyatt.com/en-US/search?q=general+manager+alila',
  'InterContinental':'https://careers.ihg.com/search-jobs?q=general+manager+intercontinental',
  'Six Senses':     'https://careers.ihg.com/search-jobs?q=general+manager+six+senses',
  'Regent Hotels':  'https://careers.ihg.com/search-jobs?q=general+manager+regent',
  'Fairmont':       'https://careers.accor.com/global/en/search-results?keywords=general+manager+fairmont',
  'Raffles':        'https://careers.accor.com/global/en/search-results?keywords=general+manager+raffles',
  'Sofitel':        'https://careers.accor.com/global/en/search-results?keywords=general+manager+sofitel',
  'Banyan Tree':    'https://www.banyantreeglobal.com/careers/',
  'Four Seasons':   'https://jobs.fourseasons.com/search-jobs?q=general+manager',
  'Aman':           'https://www.aman.com/careers',
  'Rosewood':       'https://careers.rosewoodhotels.com/search/?q=general+manager',
  'Independent':    'https://www.hosco.com/en/jobs?query=general+manager+luxury&level=executive',
};

// ═══════════════════════════════════════
// LINKEDIN SEARCH LINKS BY REGION
// ═══════════════════════════════════════
function liUrl(keywords, location) {
  let url = 'https://www.linkedin.com/jobs/search/?keywords=' + encodeURIComponent(keywords);
  if (location) url += '&location=' + encodeURIComponent(location);
  url += '&f_E=5%2C6&f_TPR=r2592000&sortBy=DD'; // Director/Executive level, past 30 days, newest first
  return url;
}

const LINKEDIN_BY_REGION = {
  'European Union': [
    { label: 'General Manager – Luxury Hotel (All EU)',        url: liUrl('General Manager luxury hotel 5-star', 'Europe') },
    { label: 'Ritz-Carlton / St. Regis – Europe',              url: liUrl('General Manager "Ritz-Carlton" OR "St. Regis"', 'Europe') },
    { label: 'Waldorf Astoria / Conrad – Europe',              url: liUrl('General Manager "Waldorf Astoria" OR "Conrad Hotels"', 'Europe') },
    { label: 'Park Hyatt / Andaz – Europe',                    url: liUrl('General Manager "Park Hyatt" OR "Andaz"', 'Europe') },
    { label: 'Fairmont / Raffles / Sofitel – Europe',          url: liUrl('General Manager "Fairmont" OR "Raffles" OR "Sofitel"', 'Europe') },
    { label: 'InterContinental / Six Senses – Europe',         url: liUrl('General Manager "InterContinental" OR "Six Senses"', 'Europe') },
    { label: 'Four Seasons / Rosewood / Aman – Europe',        url: liUrl('General Manager "Four Seasons" OR "Rosewood" OR "Aman"', 'Europe') },
    { label: 'Pre-Opening GM – Europe ⭐',                     url: liUrl('"pre-opening" "General Manager" luxury hotel', 'Europe') },
    { label: 'Cluster GM – Europe ⭐',                         url: liUrl('"Cluster General Manager" OR "Cluster GM" luxury hotel', 'Europe') },
    { label: 'Resort GM – Europe ⭐',                          url: liUrl('General Manager luxury resort', 'Europe') },
  ],
  'Middle East': [
    { label: 'General Manager – Luxury Hotel (UAE)',           url: liUrl('General Manager luxury hotel', 'United Arab Emirates') },
    { label: 'General Manager – Saudi Arabia',                 url: liUrl('General Manager luxury hotel', 'Saudi Arabia') },
    { label: 'General Manager – Qatar',                        url: liUrl('General Manager luxury hotel', 'Qatar') },
    { label: 'Ritz-Carlton / St. Regis – Middle East',         url: liUrl('General Manager "Ritz-Carlton" OR "St. Regis"', 'Middle East') },
    { label: 'Waldorf Astoria / Conrad – Middle East',         url: liUrl('General Manager "Waldorf Astoria" OR "Conrad"', 'Middle East') },
    { label: 'Four Seasons / Rosewood – Middle East',          url: liUrl('General Manager "Four Seasons" OR "Rosewood"', 'Middle East') },
    { label: 'Pre-Opening GM – Middle East ⭐',                url: liUrl('"pre-opening" "General Manager" luxury hotel', 'Middle East') },
    { label: 'Resort GM – UAE / Oman ⭐',                      url: liUrl('General Manager luxury resort', 'United Arab Emirates') },
  ],
  'Southeast Asia': [
    { label: 'General Manager – Thailand',                     url: liUrl('General Manager luxury hotel', 'Thailand') },
    { label: 'General Manager – Singapore',                    url: liUrl('General Manager luxury hotel', 'Singapore') },
    { label: 'General Manager – Vietnam',                      url: liUrl('General Manager luxury hotel', 'Vietnam') },
    { label: 'Six Senses / Alila / Banyan Tree – SE Asia',     url: liUrl('General Manager "Six Senses" OR "Alila" OR "Banyan Tree"', 'Southeast Asia') },
    { label: 'Four Seasons / Rosewood – SE Asia',              url: liUrl('General Manager "Four Seasons" OR "Rosewood"', 'Southeast Asia') },
    { label: 'Resort GM – Thailand / Bali ⭐',                 url: liUrl('General Manager luxury resort', 'Thailand') },
    { label: 'Pre-Opening GM – SE Asia ⭐',                    url: liUrl('"pre-opening" "General Manager" luxury', 'Southeast Asia') },
  ],
  'Greater Asia': [
    { label: 'General Manager – China',                        url: liUrl('General Manager luxury hotel', 'China') },
    { label: 'General Manager – Japan',                        url: liUrl('General Manager luxury hotel', 'Japan') },
    { label: 'Ritz-Carlton / St. Regis – Asia Pacific',        url: liUrl('General Manager "Ritz-Carlton" OR "St. Regis"', 'Asia Pacific') },
    { label: 'Four Seasons / Rosewood – Asia',                 url: liUrl('General Manager "Four Seasons" OR "Rosewood"', 'Asia') },
    { label: 'Pre-Opening GM – Asia ⭐',                       url: liUrl('"pre-opening" "General Manager" luxury hotel', 'Asia') },
  ],
  '': [ // All regions
    { label: 'General Manager – Luxury Hotel (Global)',        url: liUrl('General Manager luxury hotel 5-star', '') },
    { label: 'Ritz-Carlton / St. Regis – Global',              url: liUrl('General Manager "Ritz-Carlton" OR "St. Regis"', '') },
    { label: 'Waldorf Astoria / Conrad – Global',              url: liUrl('General Manager "Waldorf Astoria" OR "Conrad"', '') },
    { label: 'Park Hyatt / Andaz / Alila – Global',            url: liUrl('General Manager "Park Hyatt" OR "Andaz" OR "Alila"', '') },
    { label: 'Six Senses / Regent / InterContinental – Global',url: liUrl('General Manager "Six Senses" OR "Regent" OR "InterContinental"', '') },
    { label: 'Fairmont / Raffles / Sofitel – Global',          url: liUrl('General Manager "Fairmont" OR "Raffles" OR "Sofitel"', '') },
    { label: 'Four Seasons / Rosewood / Aman – Global',        url: liUrl('General Manager "Four Seasons" OR "Rosewood" OR "Aman"', '') },
    { label: 'Pre-Opening GM – Global ⭐',                     url: liUrl('"pre-opening" "General Manager" luxury hotel', '') },
    { label: 'Cluster GM – Global ⭐',                         url: liUrl('"Cluster General Manager" luxury hotel', '') },
    { label: 'Resort GM – Global ⭐',                          url: liUrl('General Manager luxury resort five-star', '') },
  ],
};

const HOSPITALITY_BOARDS = [
  { name: 'HOSCO',              badge: 'Best Overall',  desc: 'Largest luxury hospitality platform', url: 'https://www.hosco.com/en/jobs?query=general+manager+luxury&level=executive' },
  { name: 'CatererGlobal',      badge: 'ME & Asia',     desc: 'Strong Middle East & Asia coverage',  url: 'https://www.catererglobal.com/jobs/general-manager' },
  { name: 'Hospitality Online', badge: 'Global',        desc: 'US & international luxury focus',     url: 'https://www.hospitalityonline.com/jobs?keywords=general+manager+luxury' },
  { name: 'HotelCareer.de',     badge: 'DACH',          desc: 'Germany, Austria, Switzerland',       url: 'https://www.hotelcareer.de/jobs/?q=general+manager' },
  { name: 'Hcareers',           badge: 'Americas',      desc: 'North America & global properties',   url: 'https://www.hcareers.com/jobs?q=general+manager+luxury' },
];

// ═══════════════════════════════════════
// INIT
// ═══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  const key = localStorage.getItem('anthropic_key');
  if (key) document.getElementById('settings-api-key').value = key;
  renderTracker();
  document.getElementById('f-date').value = new Date().toISOString().split('T')[0];
  renderSearchLinks(); // show links immediately on load
});

// ═══════════════════════════════════════
// API KEY
// ═══════════════════════════════════════
function saveApiKey() {
  const val = document.getElementById('api-key-input').value.trim();
  if (!val.startsWith('sk-ant-')) { alert('Please enter a valid Anthropic API key (starts with sk-ant-)'); return; }
  localStorage.setItem('anthropic_key', val);
  document.getElementById('setup-modal').classList.add('hidden');
  document.getElementById('settings-api-key').value = val;
}
function saveApiKeyFromSettings() {
  const val = document.getElementById('settings-api-key').value.trim();
  if (!val.startsWith('sk-ant-')) { document.getElementById('settings-key-status').textContent = '⚠ Invalid key format.'; return; }
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
  document.querySelectorAll('.tab-btn').forEach(b => {
    if (b.getAttribute('onclick')?.includes("'" + id + "'")) b.classList.add('active');
  });
}

// ═══════════════════════════════════════
// SEARCH — renders real live links
// ═══════════════════════════════════════
function searchJobs() { renderSearchLinks(); }

function renderSearchLinks() {
  const groupEl = document.getElementById('filter-group');
  const selectedGroups = [...groupEl.selectedOptions].map(o => o.value);
  const region = document.getElementById('filter-region').value;
  const roleType = document.getElementById('filter-role').value;
  const container = document.getElementById('search-results');

  let linkedInSet = LINKEDIN_BY_REGION[region] || LINKEDIN_BY_REGION[''];

  // Filter by role type keyword if selected
  if (roleType && roleType !== '') {
    const roleKey = roleType.toLowerCase();
    linkedInSet = linkedInSet.filter(s => {
      const lbl = s.label.toLowerCase();
      if (roleKey === 'pre-opening gm') return lbl.includes('pre-opening');
      if (roleKey === 'cluster gm') return lbl.includes('cluster');
      if (roleKey === 'resort gm') return lbl.includes('resort');
      return true; // General Manager shows all
    });
    if (linkedInSet.length === 0) linkedInSet = LINKEDIN_BY_REGION[region] || LINKEDIN_BY_REGION[''];
  }

  // Filter brand career pages
  const brandsToShow = selectedGroups.length > 0
    ? selectedGroups.filter(g => BRAND_CAREERS[g])
    : Object.keys(BRAND_CAREERS);

  let html = `
    <div class="results-section">
      <div class="results-section-header">
        <span class="results-section-icon">🔗</span>
        <div>
          <div class="results-section-title">LinkedIn — Live Job Searches (${linkedInSet.length} searches)</div>
          <div class="results-section-sub">Each link opens LinkedIn filtered to real, current postings · ⭐ = high priority role type</div>
        </div>
      </div>
      <div class="link-grid">
        ${linkedInSet.map(s => `
          <a href="${s.url}" target="_blank" class="job-link-card ${s.label.includes('⭐') ? 'priority-link' : ''}">
            <div class="jlc-label">${escHtml(s.label)}</div>
            <div class="jlc-arrow">Open on LinkedIn →</div>
          </a>`).join('')}
      </div>
    </div>

    <div class="results-section">
      <div class="results-section-header">
        <span class="results-section-icon">🏨</span>
        <div>
          <div class="results-section-title">Brand Career Pages (${brandsToShow.length} brands)</div>
          <div class="results-section-sub">Official pages — roles here often aren't posted on LinkedIn yet</div>
        </div>
      </div>
      <div class="link-grid">
        ${brandsToShow.map(brand => `
          <a href="${BRAND_CAREERS[brand]}" target="_blank" class="job-link-card">
            <div class="jlc-label">${escHtml(brand)}</div>
            <div class="jlc-arrow">Browse open roles →</div>
          </a>`).join('')}
      </div>
    </div>

    <div class="results-section">
      <div class="results-section-header">
        <span class="results-section-icon">🌐</span>
        <div>
          <div class="results-section-title">Specialist Hospitality Job Boards</div>
          <div class="results-section-sub">Highest density of luxury executive roles outside LinkedIn</div>
        </div>
      </div>
      <div class="link-grid">
        ${HOSPITALITY_BOARDS.map(b => `
          <a href="${b.url}" target="_blank" class="job-link-card">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
              <div class="jlc-label">${escHtml(b.name)}</div>
              <span style="font-size:10px;font-weight:600;padding:1px 7px;border-radius:3px;background:#f3f4f6;color:#6b7280">${escHtml(b.badge)}</span>
            </div>
            <div style="font-size:11px;color:#9ca3af;margin-bottom:4px">${escHtml(b.desc)}</div>
            <div class="jlc-arrow">Search now →</div>
          </a>`).join('')}
      </div>
    </div>`;

  container.innerHTML = html;
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
    ['f-property','f-brand','f-location','f-salary','f-url','f-contact','f-notes','f-interview'].forEach(i => document.getElementById(i).value = '');
    document.getElementById('f-status').value = 'Saved';
    document.getElementById('f-role').value = 'General Manager';
    document.getElementById('f-date').value = new Date().toISOString().split('T')[0];
  }
  document.getElementById('app-modal').classList.remove('hidden');
}

function closeModal() { document.getElementById('app-modal').classList.add('hidden'); }
function closeJobDetail() { document.getElementById('job-detail-modal').classList.add('hidden'); currentSearchJob = null; }

function saveApplication() {
  const property = document.getElementById('f-property').value.trim();
  if (!property) { alert('Please enter a property name.'); return; }
  const editId = document.getElementById('edit-id').value;
  const app = {
    id: editId || Date.now().toString(),
    property,
    brand:     document.getElementById('f-brand').value.trim(),
    location:  document.getElementById('f-location').value.trim(),
    role:      document.getElementById('f-role').value,
    status:    document.getElementById('f-status').value,
    date:      document.getElementById('f-date').value,
    salary:    document.getElementById('f-salary').value.trim(),
    url:       document.getElementById('f-url').value.trim(),
    contact:   document.getElementById('f-contact').value.trim(),
    notes:     document.getElementById('f-notes').value.trim(),
    interview: document.getElementById('f-interview').value.trim(),
    updatedAt: new Date().toISOString(),
  };
  if (editId) {
    const idx = applications.findIndex(a => a.id === editId);
    if (idx >= 0) applications[idx] = app; else applications.push(app);
  } else {
    applications.push(app);
  }
  saveApplications(); closeModal(); renderTracker(); showTab('tracker');
}

function deleteApplication(id) {
  if (!confirm('Delete this application?')) return;
  applications = applications.filter(a => a.id !== id);
  saveApplications(); renderTracker();
}

function saveApplications() { localStorage.setItem('pk_applications', JSON.stringify(applications)); }
function filterTracker(status) { currentFilter = status; renderTracker(); }

function renderTracker() {
  const stats = document.getElementById('tracker-stats');
  const list = document.getElementById('tracker-list');
  const counts = { Saved:0, Applied:0, Interview:0, Offer:0, Rejected:0 };
  applications.forEach(a => { if (counts[a.status]!==undefined) counts[a.status]++; });
  const labels = { Saved:'📌 Saved', Applied:'📤 Applied', Interview:'🗓 Interviews', Offer:'🎉 Offers', Rejected:'❌ Rejected' };
  stats.innerHTML = Object.entries(counts).map(([s,c]) =>
    `<div class="stat-pill"><span>${labels[s]}</span><span class="stat-count">${c}</span></div>`).join('');
  const filtered = currentFilter==='all' ? applications : applications.filter(a=>a.status===currentFilter);
  if (!filtered.length) {
    list.innerHTML = `<div class="tracker-empty"><div class="empty-icon">📋</div><p>${applications.length?'No applications match this filter.':'No applications yet. Add your first one above!'}</p></div>`;
    return;
  }
  const order = { Interview:0, Offer:1, Applied:2, Saved:3, Rejected:4 };
  const sorted = [...filtered].sort((a,b)=>(order[a.status]??5)-(order[b.status]??5));
  list.innerHTML = sorted.map(app=>`
    <div class="tracker-card">
      <div class="tc-header">
        <div>
          <div class="tc-property">${escHtml(app.property)}</div>
          <div class="tc-brand-location">${[app.brand,app.location].filter(Boolean).join(' · ')}</div>
        </div>
        <div class="tc-actions">
          <button onclick="openAddModal('${app.id}')">Edit</button>
          <button onclick="deleteApplication('${app.id}')" style="color:#dc2626;border-color:#fecaca">Delete</button>
        </div>
      </div>
      <div class="tc-meta">
        <span class="status-badge status-${app.status}">${app.status}</span>
        ${app.role?`<span class="tc-meta-item">${escHtml(app.role)}</span>`:''}
        ${app.date?`<span class="tc-meta-item"><strong>Applied:</strong> ${app.date}</span>`:''}
        ${app.salary?`<span class="tc-meta-item"><strong>Salary:</strong> ${escHtml(app.salary)}</span>`:''}
        ${app.contact?`<span class="tc-meta-item"><strong>Contact:</strong> ${escHtml(app.contact)}</span>`:''}
        ${app.url?`<span class="tc-meta-item"><a href="${escHtml(app.url)}" target="_blank">Job Posting →</a></span>`:''}
      </div>
      ${app.notes?`<div class="tc-notes-section"><div class="tc-notes-label">Notes</div><div class="tc-notes-text">${escHtml(app.notes)}</div></div>`:''}
      ${app.interview?`<div class="tc-interview-section"><div class="tc-interview-label">🎯 Interview Preparation</div><div class="tc-notes-text">${escHtml(app.interview)}</div></div>`:''}
    </div>`).join('');
}

// ═══════════════════════════════════════
// EXPORT / IMPORT
// ═══════════════════════════════════════
function exportData() {
  const blob = new Blob([JSON.stringify(applications,null,2)],{type:'application/json'});
  const a = document.createElement('a'); a.href=URL.createObjectURL(blob);
  a.download=`pk-applications-${new Date().toISOString().split('T')[0]}.json`; a.click();
}
function importData(e) {
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=ev=>{
    try {
      const data=JSON.parse(ev.target.result);
      if(!Array.isArray(data)) throw new Error('bad');
      applications=data; saveApplications(); renderTracker();
      alert(`Imported ${data.length} applications.`);
    } catch { alert('Failed to import. Invalid JSON file.'); }
  };
  reader.readAsText(file);
}

// ═══════════════════════════════════════
// COPY UTILITIES
// ═══════════════════════════════════════
function copyText(btn, text) {
  navigator.clipboard.writeText(text.replace(/&quot;/g,'"')).then(()=>{
    btn.textContent='Copied!'; setTimeout(()=>btn.textContent='Copy',1500);
  });
}
function copyFromId(boxId) {
  const code=document.querySelector(`#${boxId} code`); if(!code) return;
  navigator.clipboard.writeText(code.textContent).then(()=>{
    const btn=document.querySelector(`#${boxId} .copy-btn`);
    btn.textContent='Copied!'; setTimeout(()=>btn.textContent='Copy',1500);
  });
}

// ═══════════════════════════════════════
// UTILS
// ═══════════════════════════════════════
function escHtml(str) {
  if(!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

document.getElementById('app-modal').addEventListener('click',function(e){if(e.target===this)closeModal();});
document.getElementById('job-detail-modal').addEventListener('click',function(e){if(e.target===this)closeJobDetail();});
