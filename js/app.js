// ═══════════════════════════
// SEARCH DATA
// ═══════════════════════════

function liUrl(keywords, location) {
  let url = 'https://www.linkedin.com/jobs/search/?keywords=' + encodeURIComponent(keywords);
  if (location) url += '&location=' + encodeURIComponent(location);
  url += '&f_E=5%2C6&f_TPR=r2592000&sortBy=DD';
  return url;
}

// All searches: { label, region, role, url, priority }
const ALL_SEARCHES = [
  // Europe — GM
  { label: 'General Manager — Luxury Hotel (All Europe)',           region: 'europe',  role: 'gm',         url: liUrl('General Manager luxury hotel 5-star', 'Europe'), priority: false },
  { label: 'Ritz-Carlton / St. Regis — Europe',                    region: 'europe',  role: 'gm',         url: liUrl('General Manager "Ritz-Carlton" OR "St. Regis"', 'Europe'), priority: false },
  { label: 'Waldorf Astoria / Conrad — Europe',                    region: 'europe',  role: 'gm',         url: liUrl('General Manager "Waldorf Astoria" OR "Conrad Hotels"', 'Europe'), priority: false },
  { label: 'Park Hyatt / Andaz — Europe',                          region: 'europe',  role: 'gm',         url: liUrl('General Manager "Park Hyatt" OR "Andaz"', 'Europe'), priority: false },
  { label: 'Fairmont / Raffles / Sofitel — Europe',                region: 'europe',  role: 'gm',         url: liUrl('General Manager "Fairmont" OR "Raffles" OR "Sofitel"', 'Europe'), priority: false },
  { label: 'InterContinental / Six Senses — Europe',               region: 'europe',  role: 'gm',         url: liUrl('General Manager "InterContinental" OR "Six Senses"', 'Europe'), priority: false },
  { label: 'Four Seasons / Rosewood / Aman — Europe',              region: 'europe',  role: 'gm',         url: liUrl('General Manager "Four Seasons" OR "Rosewood" OR "Aman"', 'Europe'), priority: false },
  // Europe — special roles
  { label: '⭐ Pre-Opening GM — Europe',                            region: 'europe',  role: 'preopening', url: liUrl('"pre-opening" "General Manager" luxury hotel', 'Europe'), priority: true },
  { label: '⭐ Cluster GM — Europe',                                region: 'europe',  role: 'cluster',    url: liUrl('"Cluster General Manager" OR "Cluster GM" luxury', 'Europe'), priority: true },
  { label: '⭐ Resort GM — Europe',                                 region: 'europe',  role: 'resort',     url: liUrl('General Manager luxury resort', 'Europe'), priority: true },

  // Middle East — GM
  { label: 'General Manager — Luxury Hotel (UAE)',                  region: 'me',      role: 'gm',         url: liUrl('General Manager luxury hotel', 'United Arab Emirates'), priority: false },
  { label: 'General Manager — Saudi Arabia',                        region: 'me',      role: 'gm',         url: liUrl('General Manager luxury hotel', 'Saudi Arabia'), priority: false },
  { label: 'General Manager — Qatar',                               region: 'me',      role: 'gm',         url: liUrl('General Manager luxury hotel', 'Qatar'), priority: false },
  { label: 'Ritz-Carlton / St. Regis — Middle East',                region: 'me',      role: 'gm',         url: liUrl('General Manager "Ritz-Carlton" OR "St. Regis"', 'Middle East'), priority: false },
  { label: 'Waldorf Astoria / Conrad — Middle East',                region: 'me',      role: 'gm',         url: liUrl('General Manager "Waldorf Astoria" OR "Conrad"', 'Middle East'), priority: false },
  { label: 'Four Seasons / Rosewood — Middle East',                 region: 'me',      role: 'gm',         url: liUrl('General Manager "Four Seasons" OR "Rosewood"', 'Middle East'), priority: false },
  { label: '⭐ Pre-Opening GM — Middle East',                       region: 'me',      role: 'preopening', url: liUrl('"pre-opening" "General Manager" luxury hotel', 'Middle East'), priority: true },
  { label: '⭐ Resort GM — UAE / Oman',                             region: 'me',      role: 'resort',     url: liUrl('General Manager luxury resort', 'United Arab Emirates'), priority: true },

  // Southeast Asia
  { label: 'General Manager — Thailand',                            region: 'sea',     role: 'gm',         url: liUrl('General Manager luxury hotel', 'Thailand'), priority: false },
  { label: 'General Manager — Singapore',                           region: 'sea',     role: 'gm',         url: liUrl('General Manager luxury hotel', 'Singapore'), priority: false },
  { label: 'General Manager — Vietnam',                             region: 'sea',     role: 'gm',         url: liUrl('General Manager luxury hotel', 'Vietnam'), priority: false },
  { label: 'Six Senses / Alila / Banyan Tree — SE Asia',            region: 'sea',     role: 'gm',         url: liUrl('General Manager "Six Senses" OR "Alila" OR "Banyan Tree"', 'Southeast Asia'), priority: false },
  { label: 'Four Seasons / Rosewood — SE Asia',                     region: 'sea',     role: 'gm',         url: liUrl('General Manager "Four Seasons" OR "Rosewood"', 'Southeast Asia'), priority: false },
  { label: '⭐ Resort GM — Thailand / Bali',                        region: 'sea',     role: 'resort',     url: liUrl('General Manager luxury resort', 'Thailand'), priority: true },
  { label: '⭐ Pre-Opening GM — SE Asia',                           region: 'sea',     role: 'preopening', url: liUrl('"pre-opening" "General Manager" luxury', 'Southeast Asia'), priority: true },

  // Greater Asia
  { label: 'General Manager — China',                               region: 'asia',    role: 'gm',         url: liUrl('General Manager luxury hotel', 'China'), priority: false },
  { label: 'General Manager — Japan',                               region: 'asia',    role: 'gm',         url: liUrl('General Manager luxury hotel', 'Japan'), priority: false },
  { label: 'Ritz-Carlton / St. Regis — Asia Pacific',               region: 'asia',    role: 'gm',         url: liUrl('General Manager "Ritz-Carlton" OR "St. Regis"', 'Asia Pacific'), priority: false },
  { label: 'Four Seasons / Rosewood — Asia',                        region: 'asia',    role: 'gm',         url: liUrl('General Manager "Four Seasons" OR "Rosewood"', 'Asia'), priority: false },
  { label: '⭐ Pre-Opening GM — Asia',                              region: 'asia',    role: 'preopening', url: liUrl('"pre-opening" "General Manager" luxury hotel', 'Asia'), priority: true },
];

const BRAND_CAREER_PAGES = {
  'Marriott': [
    { label: 'Ritz-Carlton',   url: 'https://careers.marriott.com/search-jobs?q=general+manager+ritz+carlton' },
    { label: 'St. Regis',      url: 'https://careers.marriott.com/search-jobs?q=general+manager+st+regis' },
    { label: 'W Hotels',       url: 'https://careers.marriott.com/search-jobs?q=general+manager+w+hotels' },
    { label: 'EDITION Hotels', url: 'https://careers.marriott.com/search-jobs?q=general+manager+edition' },
    { label: 'JW Marriott',    url: 'https://careers.marriott.com/search-jobs?q=general+manager+jw+marriott' },
  ],
  'Hilton': [
    { label: 'Waldorf Astoria', url: 'https://jobs.hilton.com/us/en/search-results?keywords=general+manager+waldorf+astoria' },
    { label: 'Conrad Hotels',   url: 'https://jobs.hilton.com/us/en/search-results?keywords=general+manager+conrad' },
    { label: 'LXR Hotels',      url: 'https://jobs.hilton.com/us/en/search-results?keywords=general+manager+lxr' },
  ],
  'Hyatt': [
    { label: 'Park Hyatt', url: 'https://careers.hyatt.com/en-US/search?q=general+manager+park+hyatt' },
    { label: 'Andaz',      url: 'https://careers.hyatt.com/en-US/search?q=general+manager+andaz' },
    { label: 'Alila',      url: 'https://careers.hyatt.com/en-US/search?q=general+manager+alila' },
  ],
  'IHG': [
    { label: 'InterContinental', url: 'https://careers.ihg.com/search-jobs?q=general+manager+intercontinental' },
    { label: 'Six Senses',       url: 'https://careers.ihg.com/search-jobs?q=general+manager+six+senses' },
    { label: 'Regent Hotels',    url: 'https://careers.ihg.com/search-jobs?q=general+manager+regent' },
  ],
  'Accor': [
    { label: 'Fairmont', url: 'https://careers.accor.com/global/en/search-results?keywords=general+manager+fairmont' },
    { label: 'Raffles',  url: 'https://careers.accor.com/global/en/search-results?keywords=general+manager+raffles' },
    { label: 'Sofitel',  url: 'https://careers.accor.com/global/en/search-results?keywords=general+manager+sofitel' },
  ],
  'Independent': [
    { label: 'Four Seasons', url: 'https://jobs.fourseasons.com/search-jobs?q=general+manager' },
    { label: 'Rosewood',     url: 'https://careers.rosewoodhotels.com/search/?q=general+manager' },
    { label: 'Aman',         url: 'https://www.aman.com/careers' },
    { label: 'Banyan Tree',  url: 'https://www.banyantreeglobal.com/careers/' },
    { label: 'HOSCO',        url: 'https://www.hosco.com/en/jobs?query=general+manager+luxury&level=executive' },
  ],
};

// Map filter values to brand keys
const BRAND_FILTER_MAP = {
  'all': ['Marriott', 'Hilton', 'Hyatt', 'IHG', 'Accor', 'Independent'],
  'marriott': ['Marriott'],
  'hilton': ['Hilton'],
  'hyatt': ['Hyatt'],
  'ihg': ['IHG'],
  'accor': ['Accor'],
  'independent': ['Independent'],
};

// ═══════════════════════════
// INIT
// ═══════════════════════════
let applications = JSON.parse(localStorage.getItem('pk_applications') || '[]');
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  renderTracker();
  renderSearch();
  document.getElementById('f-date').value = new Date().toISOString().split('T')[0];
});

// ═══════════════════════════
// TABS
// ═══════════════════════════
function showTab(id) {
  document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  document.querySelectorAll('.tab-btn').forEach(b => {
    if (b.getAttribute('onclick') === "showTab('" + id + "')") b.classList.add('active');
  });
}

// ═══════════════════════════
// SEARCH
// ═══════════════════════════
function renderSearch() {
  const region = document.getElementById('filter-region').value;
  const role   = document.getElementById('filter-role').value;
  const brand  = document.getElementById('filter-brand').value;
  const container = document.getElementById('search-results');

  // Filter LinkedIn searches
  let searches = ALL_SEARCHES.filter(s => {
    if (region !== 'all' && s.region !== region) return false;
    if (role !== 'all' && s.role !== role) return false;
    return true;
  });

  // Filter brand pages
  const brandKeys = BRAND_FILTER_MAP[brand] || BRAND_FILTER_MAP['all'];

  let html = '';

  // LinkedIn section
  html += `<div class="search-section">
    <div class="search-section-title">LinkedIn — Live Searches (${searches.length} searches · click to open on LinkedIn)</div>
    <div class="search-btn-grid">
      ${searches.map(s => `
        <a href="${s.url}" target="_blank" class="search-link-btn ${s.priority ? 'priority' : ''}">
          <span>${escHtml(s.label)}</span>
          <span class="arrow">Open →</span>
        </a>`).join('')}
    </div>
  </div>`;

  // Brand career pages section
  let brandHtml = '';
  for (const key of brandKeys) {
    const pages = BRAND_CAREER_PAGES[key] || [];
    pages.forEach(p => {
      brandHtml += `<a href="${p.url}" target="_blank" class="search-link-btn">
        <span><strong>${escHtml(key)}</strong> · ${escHtml(p.label)}</span>
        <span class="arrow">Open →</span>
      </a>`;
    });
  }
  html += `<div class="search-section">
    <div class="search-section-title">Brand Career Pages — Official job boards (roles often posted here before LinkedIn)</div>
    <div class="search-btn-grid">${brandHtml}</div>
  </div>`;

  container.innerHTML = html;
}

// ═══════════════════════════
// ALERTS TAB — LinkedIn opener
// ═══════════════════════════
function openLI(keywords, location) {
  const url = liUrl(keywords, location);
  window.open(url, '_blank');
}

function copyBox(boxId) {
  const code = document.querySelector('#' + boxId + ' code');
  if (!code) return;
  navigator.clipboard.writeText(code.textContent).then(() => {
    const btn = document.querySelector('#' + boxId + ' .copy-btn');
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = orig, 1500);
  });
}

// ═══════════════════════════
// TRACKER
// ═══════════════════════════
function openAddModal(id) {
  document.getElementById('modal-title').textContent = id ? 'Edit Application' : 'Add Application';
  document.getElementById('edit-id').value = id || '';
  if (id) {
    const app = applications.find(a => a.id === id);
    if (app) {
      document.getElementById('f-property').value = app.property || '';
      document.getElementById('f-brand').value    = app.brand    || '';
      document.getElementById('f-location').value = app.location || '';
      document.getElementById('f-role').value     = app.role     || 'General Manager';
      document.getElementById('f-status').value   = app.status   || 'Saved';
      document.getElementById('f-date').value     = app.date     || '';
      document.getElementById('f-salary').value   = app.salary   || '';
      document.getElementById('f-url').value      = app.url      || '';
      document.getElementById('f-contact').value  = app.contact  || '';
      document.getElementById('f-notes').value    = app.notes    || '';
      document.getElementById('f-interview').value= app.interview|| '';
    }
  } else {
    ['f-property','f-brand','f-location','f-salary','f-url','f-contact','f-notes','f-interview']
      .forEach(i => document.getElementById(i).value = '');
    document.getElementById('f-status').value = 'Saved';
    document.getElementById('f-role').value   = 'General Manager';
    document.getElementById('f-date').value   = new Date().toISOString().split('T')[0];
  }
  document.getElementById('app-modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('app-modal').style.display = 'none';
}

function saveApplication() {
  const property = document.getElementById('f-property').value.trim();
  if (!property) { alert('Please enter a property name.'); return; }
  const editId = document.getElementById('edit-id').value;
  const app = {
    id:        editId || Date.now().toString(),
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
  localStorage.setItem('pk_applications', JSON.stringify(applications));
  closeModal();
  renderTracker();
  showTab('tracker');
}

function deleteApplication(id) {
  if (!confirm('Delete this application?')) return;
  applications = applications.filter(a => a.id !== id);
  localStorage.setItem('pk_applications', JSON.stringify(applications));
  renderTracker();
}

function filterTracker(status) {
  currentFilter = status;
  renderTracker();
}

function renderTracker() {
  const stats  = document.getElementById('tracker-stats');
  const list   = document.getElementById('tracker-list');
  const counts = { Saved:0, Applied:0, Interview:0, Offer:0, Rejected:0 };
  applications.forEach(a => { if (counts[a.status] !== undefined) counts[a.status]++; });
  const icons  = { Saved:'📌', Applied:'📤', Interview:'🗓', Offer:'🎉', Rejected:'❌' };
  stats.innerHTML = Object.entries(counts).map(([s,c]) =>
    `<div class="stat-pill">${icons[s]} ${s} <span class="stat-count">${c}</span></div>`
  ).join('');

  const filtered = currentFilter === 'all' ? applications : applications.filter(a => a.status === currentFilter);
  if (!filtered.length) {
    list.innerHTML = `<div class="tracker-empty"><div class="empty-icon">📋</div><p>${applications.length ? 'No applications match this filter.' : 'No applications yet. Add your first one above!'}</p></div>`;
    return;
  }
  const order = { Interview:0, Offer:1, Applied:2, Saved:3, Rejected:4 };
  const sorted = [...filtered].sort((a,b) => (order[a.status]??5) - (order[b.status]??5));
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
        ${app.role    ? `<span class="tc-meta-item">${escHtml(app.role)}</span>` : ''}
        ${app.date    ? `<span class="tc-meta-item"><strong>Applied:</strong> ${app.date}</span>` : ''}
        ${app.salary  ? `<span class="tc-meta-item"><strong>Salary:</strong> ${escHtml(app.salary)}</span>` : ''}
        ${app.contact ? `<span class="tc-meta-item"><strong>Contact:</strong> ${escHtml(app.contact)}</span>` : ''}
        ${app.url     ? `<span class="tc-meta-item"><a href="${escHtml(app.url)}" target="_blank">Job Posting →</a></span>` : ''}
      </div>
      ${app.notes     ? `<div class="tc-notes-section"><div class="tc-notes-label">Notes</div><div class="tc-notes-text">${escHtml(app.notes)}</div></div>` : ''}
      ${app.interview ? `<div class="tc-interview-section"><div class="tc-interview-label">🎯 Interview Preparation</div><div class="tc-notes-text">${escHtml(app.interview)}</div></div>` : ''}
    </div>`).join('');
}

// ═══════════════════════════
// EXPORT / IMPORT
// ═══════════════════════════
function exportData() {
  const blob = new Blob([JSON.stringify(applications, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'pk-applications-' + new Date().toISOString().split('T')[0] + '.json';
  a.click();
}
function importData(e) {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (!Array.isArray(data)) throw new Error();
      applications = data;
      localStorage.setItem('pk_applications', JSON.stringify(applications));
      renderTracker();
      alert('Imported ' + data.length + ' applications.');
    } catch { alert('Invalid file.'); }
  };
  reader.readAsText(file);
}

// ═══════════════════════════
// UTILS
// ═══════════════════════════
function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

document.getElementById('app-modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
