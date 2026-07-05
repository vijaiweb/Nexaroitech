// ─── Nexaroitech – Student Dashboard Logic ───
document.addEventListener('DOMContentLoaded', () => {

  const authSection = document.getElementById('authSection');
  const dashboardSection = document.getElementById('dashboardSection');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const tabs = document.querySelectorAll('.auth-tab');

  if (!authSection) return; // not on this page

  // Populate domain select
  const regDomain = document.getElementById('regDomain');
  Object.keys(NEXARO_DOMAINS).forEach(d => {
    const opt = document.createElement('option');
    opt.value = d; opt.textContent = d;
    regDomain.appendChild(opt);
  });

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const which = tab.dataset.tab;
      loginForm.style.display = which === 'login' ? 'block' : 'none';
      registerForm.style.display = which === 'register' ? 'block' : 'none';
    });
  });

  // Login
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const res = nexaroLoginStudent(email, password);
    const err = document.getElementById('loginError');
    if (!res.ok) { err.textContent = res.error; return; }
    err.textContent = '';
    renderDashboard();
  });

  // Register
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const password = document.getElementById('regPassword').value;
    const domain = document.getElementById('regDomain').value;
    const err = document.getElementById('registerError');
    if (password.length < 4) { err.textContent = 'Password must be at least 4 characters.'; return; }
    const res = nexaroRegisterStudent({ name, email, password, domain });
    if (!res.ok) { err.textContent = res.error; return; }
    err.textContent = '';
    renderDashboard();
  });

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    nexaroLogoutStudent();
    dashboardSection.style.display = 'none';
    authSection.style.display = 'block';
  });

  function statusBadge(status) {
    const map = {
      pending: ['Pending', 'badge-pending'],
      submitted: ['Awaiting Review', 'badge-submitted'],
      approved: ['Approved', 'badge-approved'],
      rejected: ['Needs Revision', 'badge-rejected'],
    };
    const [label, cls] = map[status] || map.pending;
    return `<span class="task-badge ${cls}">${label}</span>`;
  }

  function renderDashboard() {
    const email = nexaroCurrentEmail();
    const students = nexaroGetStudents();
    const student = students[email];
    if (!student) { authSection.style.display = 'block'; dashboardSection.style.display = 'none'; return; }

    authSection.style.display = 'none';
    dashboardSection.style.display = 'block';

    document.getElementById('dashName').textContent = `Welcome, ${student.name}`;
    document.getElementById('dashMeta').textContent = `${student.domain} · 30-Day Internship Program`;

    const total = student.tasks.length;
    const approved = student.tasks.filter(t => t.status === 'approved').length;
    const pct = total ? Math.round((approved / total) * 100) : 0;
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressLabel').textContent = `${approved} / ${total} tasks approved (${pct}%)`;

    // Day grid (visual overview)
    const dayGrid = document.getElementById('dayGrid');
    dayGrid.innerHTML = '';
    student.tasks.forEach(task => {
      const cell = document.createElement('div');
      cell.className = `day-cell day-${task.status}`;
      cell.textContent = task.day;
      cell.title = `Day ${task.day}: ${task.title} — ${task.status}`;
      dayGrid.appendChild(cell);
    });

    // Certificate banner
    const certBanner = document.getElementById('certBanner');
    if (student.certificateId) {
      const certs = nexaroGetCertificates();
      const cert = certs[student.certificateId];
      certBanner.style.display = 'block';
      certBanner.innerHTML = `
        <div class="cert-banner-inner">
          <div>
            <h3>🎓 Certificate Issued!</h3>
            <p>Certificate ID: <strong>${student.certificateId}</strong></p>
            <p style="font-size:0.82rem;color:var(--gray-400);">Issued to ${cert?.name || student.name} for ${cert?.domain || student.domain} (${cert?.duration || student.duration + ' days'})</p>
            <a href="verify.html?id=${encodeURIComponent(student.certificateId)}" class="btn-primary" style="margin-top:10px;display:inline-flex;">Verify Online →</a>
          </div>
          <div id="qrHolder" class="qr-holder"></div>
        </div>`;
      const qrDiv = document.getElementById('qrHolder');
      if (window.QRCode && qrDiv) {
        const verifyUrl = `${window.location.origin}${window.location.pathname.replace('student-dashboard.html','')}verify.html?id=${encodeURIComponent(student.certificateId)}`;
        new QRCode(qrDiv, { text: verifyUrl, width: 120, height: 120 });
      }
    } else if (student.finalApproved) {
      certBanner.style.display = 'block';
      certBanner.innerHTML = `<p>✅ Your final project has been approved! Your certificate is being generated — refresh in a moment.</p>`;
    } else {
      certBanner.style.display = 'none';
    }

    // Task list
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    let currentPhase = '';
    student.tasks.forEach(task => {
      if (task.phase !== currentPhase) {
        currentPhase = task.phase;
        const heading = document.createElement('h3');
        heading.className = 'task-phase-heading';
        heading.textContent = currentPhase;
        taskList.appendChild(heading);
      }

      const card = document.createElement('div');
      card.className = 'task-card';
      let submissionArea = '';
      if (task.status === 'pending' || task.status === 'rejected') {
        submissionArea = `
          <form class="task-submit-form" data-day="${task.day}">
            <textarea rows="2" placeholder="Paste your work summary or link (e.g. GitHub, Figma, Drive)..." required>${task.submission || ''}</textarea>
            <button type="submit" class="btn-primary btn-sm">Submit Task</button>
          </form>`;
        if (task.status === 'rejected' && task.feedback) {
          submissionArea = `<p class="task-feedback">✎ Admin feedback: ${task.feedback}</p>` + submissionArea;
        }
      } else if (task.status === 'submitted') {
        submissionArea = `<p class="task-submission-preview">Submitted: "${task.submission}"</p>`;
      } else if (task.status === 'approved') {
        submissionArea = `<p class="task-submission-preview">Submitted: "${task.submission}"</p>`;
        if (task.feedback) submissionArea += `<p class="task-feedback">✎ ${task.feedback}</p>`;
      }

      card.innerHTML = `
        <div class="task-card-top">
          <span class="task-day">Day ${task.day}${task.isFinal ? ' · Final' : ''}</span>
          ${statusBadge(task.status)}
        </div>
        <h4>${task.title}</h4>
        <p class="task-detail">${task.detail}</p>
        ${submissionArea}
      `;
      taskList.appendChild(card);
    });

    // Wire up submit forms
    taskList.querySelectorAll('.task-submit-form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const day = Number(form.dataset.day);
        const text = form.querySelector('textarea').value.trim();
        if (!text) return;
        nexaroSubmitTask(email, day, text);
        renderDashboard();
      });
    });
  }

  // If already logged in, jump straight to dashboard
  if (nexaroCurrentEmail()) renderDashboard();
});
