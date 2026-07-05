// ─── Nexaroitech – Admin Panel Logic ───
document.addEventListener('DOMContentLoaded', () => {

  const authSection = document.getElementById('adminAuthSection');
  const dashSection = document.getElementById('adminDashSection');
  const loginForm = document.getElementById('adminLoginForm');
  if (!authSection) return; // not on this page

  let searchQuery = '';

  function isAdminLoggedIn() {
    return sessionStorage.getItem('nexaro_admin_logged_in') === '1';
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pass = document.getElementById('adminPassword').value;
    const err = document.getElementById('adminLoginError');
    if (pass !== NEXARO_ADMIN_PASSWORD) { err.textContent = 'Incorrect password.'; return; }
    err.textContent = '';
    sessionStorage.setItem('nexaro_admin_logged_in', '1');
    showDashboard();
  });

  document.getElementById('adminLogoutBtn')?.addEventListener('click', () => {
    sessionStorage.removeItem('nexaro_admin_logged_in');
    dashSection.style.display = 'none';
    authSection.style.display = 'block';
  });

  document.getElementById('studentSearch')?.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderStudents();
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

  function showDashboard() {
    authSection.style.display = 'none';
    dashSection.style.display = 'block';
    renderStudents();
  }

  function renderStats() {
    const students = nexaroGetStudents();
    const list = Object.values(students);
    const certs = nexaroGetCertificates();
    const pending = list.reduce((sum, s) => sum + s.tasks.filter(t => t.status === 'submitted').length, 0);

    const stats = [
      { label: 'Total Students', value: list.length, icon: '👥' },
      { label: 'Awaiting Review', value: pending, icon: '⏳' },
      { label: 'Certificates Issued', value: Object.keys(certs).length, icon: '🎓' },
      { label: 'Domains Offered', value: Object.keys(NEXARO_DOMAINS).length, icon: '📚' },
    ];

    document.getElementById('adminStatsRow').innerHTML = stats.map(s => `
      <div class="admin-stat-card">
        <span class="admin-stat-icon">${s.icon}</span>
        <div><strong>${s.value}</strong><span>${s.label}</span></div>
      </div>`).join('');
  }

  function renderStudents() {
    renderStats();
    const students = nexaroGetStudents();
    let emails = Object.keys(students);

    if (searchQuery) {
      emails = emails.filter(email => {
        const s = students[email];
        return s.name.toLowerCase().includes(searchQuery) ||
               email.toLowerCase().includes(searchQuery) ||
               s.domain.toLowerCase().includes(searchQuery);
      });
    }

    const list = document.getElementById('studentsList');
    list.innerHTML = '';

    if (Object.keys(students).length === 0) {
      list.innerHTML = `<p style="color:var(--gray-400);">No students have registered yet on this browser.</p>`;
      return;
    }
    if (emails.length === 0) {
      list.innerHTML = `<p style="color:var(--gray-400);">No students match "${searchQuery}".</p>`;
      return;
    }

    emails.forEach(email => {
      const student = students[email];
      const total = student.tasks.length;
      const approved = student.tasks.filter(t => t.status === 'approved').length;
      const submittedCount = student.tasks.filter(t => t.status === 'submitted').length;

      const wrap = document.createElement('div');
      wrap.className = 'admin-student-card';
      wrap.innerHTML = `
        <div class="admin-student-top" data-email="${email}">
          <div>
            <h4>${student.name} <span style="color:var(--gray-400);font-weight:400;">(${email})</span></h4>
            <p style="font-size:0.82rem;color:var(--gray-600);">${student.domain} · 30-Day Program · ${approved}/${total} approved${submittedCount ? ` · <strong style="color:var(--accent)">${submittedCount} awaiting review</strong>` : ''}</p>
          </div>
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
            ${student.certificateId ? `<span class="task-badge badge-approved">Certified: ${student.certificateId}</span>` : (student.finalApproved ? `<span class="task-badge badge-submitted">Ready to Certify</span>` : '')}
            <button type="button" class="btn-secondary btn-sm admin-toggle">View Tasks</button>
            <button type="button" class="btn-secondary btn-sm admin-delete-student" title="Remove student">Delete</button>
          </div>
        </div>
        <div class="admin-student-tasks" style="display:none;"></div>
      `;
      list.appendChild(wrap);

      wrap.querySelector('.admin-toggle').addEventListener('click', () => {
        const tasksDiv = wrap.querySelector('.admin-student-tasks');
        const open = tasksDiv.style.display !== 'none';
        tasksDiv.style.display = open ? 'none' : 'block';
        wrap.querySelector('.admin-toggle').textContent = open ? 'View Tasks' : 'Hide Tasks';
        if (!open) renderTasksForStudent(email, tasksDiv);
      });

      wrap.querySelector('.admin-delete-student').addEventListener('click', () => {
        if (confirm(`Remove ${student.name} (${email}) and all their data? This cannot be undone.`)) {
          nexaroDeleteStudent(email);
          renderStudents();
        }
      });
    });
  }

  function renderTasksForStudent(email, container) {
    const students = nexaroGetStudents();
    const student = students[email];
    container.innerHTML = '';

    student.tasks.forEach(task => {
      const row = document.createElement('div');
      row.className = 'admin-task-row';
      let actions = '';
      if (task.status === 'submitted') {
        actions = `
          <div class="admin-task-actions">
            <input type="text" class="admin-feedback-input" placeholder="Optional feedback...">
            <button type="button" class="btn-primary btn-sm admin-approve">Approve</button>
            <button type="button" class="btn-secondary btn-sm admin-reject">Reject</button>
          </div>`;
      }
      row.innerHTML = `
        <div class="admin-task-row-top">
          <span class="task-day">Day ${task.day}${task.isFinal ? ' · Final' : ''}${task.custom ? ' · Custom' : ''} — ${task.title}</span>
          <div style="display:flex;gap:8px;align-items:center;">
            ${statusBadge(task.status)}
            <button type="button" class="admin-icon-btn admin-edit-task" title="Edit task">✎</button>
            <button type="button" class="admin-icon-btn admin-remove-task" title="Remove task">✕</button>
          </div>
        </div>
        <p class="admin-task-detail-text">${task.detail}</p>
        ${task.submission ? `<p class="task-submission-preview">"${task.submission}"</p>` : `<p style="color:var(--gray-400);font-size:0.82rem;">Not submitted yet.</p>`}
        ${task.feedback ? `<p class="task-feedback">✎ ${task.feedback}</p>` : ''}
        <div class="admin-edit-form" style="display:none;">
          <input type="text" class="admin-edit-title" value="${task.title.replace(/"/g,'&quot;')}" placeholder="Task title">
          <input type="text" class="admin-edit-detail" value="${task.detail.replace(/"/g,'&quot;')}" placeholder="Task detail">
          <button type="button" class="btn-primary btn-sm admin-save-edit">Save</button>
        </div>
        ${actions}
      `;
      container.appendChild(row);

      row.querySelector('.admin-approve')?.addEventListener('click', () => {
        const feedback = row.querySelector('.admin-feedback-input').value.trim();
        nexaroReviewTask(email, task.day, 'approved', feedback);
        renderStudents();
      });
      row.querySelector('.admin-reject')?.addEventListener('click', () => {
        const feedback = row.querySelector('.admin-feedback-input').value.trim() || 'Please revise and resubmit.';
        nexaroReviewTask(email, task.day, 'rejected', feedback);
        renderStudents();
      });
      row.querySelector('.admin-edit-task').addEventListener('click', () => {
        const form = row.querySelector('.admin-edit-form');
        form.style.display = form.style.display === 'none' ? 'flex' : 'none';
      });
      row.querySelector('.admin-save-edit').addEventListener('click', () => {
        const title = row.querySelector('.admin-edit-title').value.trim();
        const detail = row.querySelector('.admin-edit-detail').value.trim();
        nexaroEditTask(email, task.day, { title, detail });
        renderStudents();
      });
      row.querySelector('.admin-remove-task').addEventListener('click', () => {
        if (confirm(`Remove Day ${task.day} — "${task.title}" for this student?`)) {
          nexaroRemoveTask(email, task.day);
          renderStudents();
        }
      });
    });

    // Add custom task form
    const addForm = document.createElement('div');
    addForm.className = 'admin-add-task-form';
    addForm.innerHTML = `
      <h5>Add Custom Task</h5>
      <div class="admin-edit-form" style="display:flex;">
        <input type="text" class="admin-new-title" placeholder="Task title">
        <input type="text" class="admin-new-detail" placeholder="Task detail (optional)">
        <button type="button" class="btn-primary btn-sm admin-add-task-btn">Add Task</button>
      </div>`;
    container.appendChild(addForm);
    addForm.querySelector('.admin-add-task-btn').addEventListener('click', () => {
      const title = addForm.querySelector('.admin-new-title').value.trim();
      const detail = addForm.querySelector('.admin-new-detail').value.trim();
      if (!title) return;
      nexaroAddCustomTask(email, title, detail);
      renderStudents();
      const tasksDiv = document.querySelector(`.admin-student-top[data-email="${email}"]`).parentElement.querySelector('.admin-student-tasks');
      tasksDiv.style.display = 'block';
      renderTasksForStudent(email, tasksDiv);
    });

    // Manual certificate controls
    if (student.finalApproved) {
      const certRow = document.createElement('div');
      certRow.className = 'admin-cert-controls';
      certRow.innerHTML = student.certificateId
        ? `<p>🎓 Certificate <strong>${student.certificateId}</strong> issued.</p><button type="button" class="btn-secondary btn-sm admin-revoke-cert">Revoke Certificate</button>`
        : `<button type="button" class="btn-primary btn-sm admin-issue-cert">Issue Certificate Now</button>`;
      container.appendChild(certRow);
      certRow.querySelector('.admin-issue-cert')?.addEventListener('click', () => {
        nexaroIssueCertificate(email);
        renderStudents();
        const tasksDiv = document.querySelector(`.admin-student-top[data-email="${email}"]`).parentElement.querySelector('.admin-student-tasks');
        tasksDiv.style.display = 'block';
        renderTasksForStudent(email, tasksDiv);
      });
      certRow.querySelector('.admin-revoke-cert')?.addEventListener('click', () => {
        if (confirm('Revoke this certificate? The student will need it re-issued.')) {
          nexaroRevokeCertificate(email);
          renderStudents();
          const tasksDiv = document.querySelector(`.admin-student-top[data-email="${email}"]`).parentElement.querySelector('.admin-student-tasks');
          tasksDiv.style.display = 'block';
          renderTasksForStudent(email, tasksDiv);
        }
      });
    }
  }

  if (isAdminLoggedIn()) showDashboard();
});
