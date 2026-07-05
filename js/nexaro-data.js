// ─── Nexaroitech – Shared Data Layer ───
// Front-end PROTOTYPE: all student/task/certificate data lives in the browser's
// localStorage. There is no server or shared database — data created in one
// browser is only visible in that same browser. See README-DASHBOARD.md.

const NEXARO_ADMIN_PASSWORD = 'admin123'; // demo only — change before real use
const NEXARO_PROGRAM_DAYS = 30;

// Every domain is a fixed, fully-mapped 30-day program:
// Days 1-10 = Week 1 theme, Days 11-20 = Week 2 theme, Days 21-30 = Final Project.
const NEXARO_DOMAINS = {
  'Web Development': [
    'HTML boilerplate & semantic structure', 'CSS box model & typography basics', 'Flexbox layout practice',
    'CSS Grid layout practice', 'Build landing page header & nav', 'Build landing page hero section',
    'Build features/services section', 'Build footer & contact section', 'Make landing page responsive (mobile-first)',
    'Polish & submit HTML/CSS Landing Page',
    'JavaScript basics: variables, functions, DOM', 'Handling form events & input values',
    'Client-side validation rules (required, email, length)', 'Real-time validation feedback UI',
    'Regex for phone/email validation', 'Custom error messages & styling', 'Handling multi-step forms',
    'LocalStorage to persist form drafts', 'Accessibility for forms (labels, ARIA)',
    'Finalize & submit validated contact form',
    'Plan sitemap & wireframe for company website', 'Build homepage layout', 'Build About/Team page',
    'Build Services page', 'Build responsive navigation (mobile menu)', 'Add animations & interactions',
    'Cross-browser & device testing', 'Performance & accessibility audit', 'Final polish & deployment prep',
    'Submit final Responsive Company Website',
  ],
  'Frontend': [
    'Pick a real website/app UI to clone', 'Set up project (React/Vite or plain HTML)', 'Build layout structure & grid',
    'Match typography & color system', 'Build reusable components (buttons, cards)', 'Build navigation/header clone',
    'Build main content sections', 'Add responsive breakpoints', 'Add hover/interaction states',
    'Finalize & submit UI clone',
    'Understand REST APIs & fetch/axios', 'Connect to a public API (GET requests)',
    'Render API data into UI components', 'Handle loading & error states', 'Implement search/filter with API data',
    'POST/PUT requests & form submission to API', 'Handle pagination/infinite scroll',
    'Add authentication headers (API key/token)', 'Cache & optimize API calls',
    'Finalize & submit API-integrated app',
    'Plan portfolio structure & content', 'Design & build homepage/hero', 'Build projects showcase section',
    'Build about/skills section', 'Build contact section with working form', 'Add animations & micro-interactions',
    'Make fully responsive', 'SEO basics (meta tags, performance)', 'Deploy to hosting (Netlify/Vercel)',
    'Submit final Portfolio Website',
  ],
  'Backend': [
    'Set up Node.js/Express (or chosen stack) project', 'Design database schema for a resource',
    'Build Create (POST) endpoint', 'Build Read (GET list & single) endpoints', 'Build Update (PUT/PATCH) endpoint',
    'Build Delete endpoint', 'Add input validation', 'Add error handling middleware', 'Test endpoints with Postman',
    'Finalize & submit CRUD API',
    'Understand auth concepts (sessions vs JWT)', 'Build user registration endpoint (hash passwords)',
    'Build login endpoint (issue JWT)', 'Build auth middleware to protect routes',
    'Implement role-based access control', 'Add password reset flow', 'Add refresh token handling',
    'Secure against common attacks (rate limiting, CORS)', 'Write auth tests',
    'Finalize & submit Authentication module',
    'Design full API architecture & routes', 'Build remaining resource endpoints',
    'Connect authentication to all protected routes', 'Add filtering, sorting & pagination',
    'Add file upload handling (if relevant)', 'Write API documentation (Swagger/Postman)',
    'Add automated tests for all endpoints', 'Optimize queries & add error logging',
    'Deploy API to a hosting service', 'Submit final Complete REST API',
  ],
  'Full Stack': [
    'Plan full stack app idea & architecture', 'Set up frontend project structure', 'Set up backend project & server',
    'Connect frontend to backend (basic API call)', 'Build core UI components', 'Build core backend endpoints',
    'Wire up forms to backend', 'Handle loading/error states end-to-end', 'Basic styling pass',
    'Finalize & submit connected Frontend+Backend',
    'Choose & set up database (SQL/NoSQL)', 'Design schema/models for the app',
    'Connect backend to database (ORM/driver)', 'Implement CRUD against real database',
    'Add relationships between models', 'Add data validation at DB level', 'Seed sample data',
    'Add search/query features', 'Backup & migration basics', 'Finalize & submit database-integrated backend',
    'Finalize feature list for capstone project', 'Build remaining frontend screens',
    'Build remaining backend endpoints', 'Integrate authentication end-to-end',
    'Connect all frontend screens to live data', 'Testing & bug fixing pass', 'Polish UI/UX',
    'Deploy frontend & backend', 'Write project documentation/README', 'Submit final Full Stack Project',
  ],
  'UI/UX': [
    'Research: competitor & user analysis', 'Define user personas & user flows',
    'Sketch low-fidelity wireframes (paper/digital)', 'Build wireframes in Figma — screens 1-3',
    'Build wireframes — screens 4-6', 'Information architecture & navigation flow',
    'Usability review of wireframes', 'Iterate wireframes based on feedback',
    'Prepare wireframe presentation', 'Finalize & submit Wireframes',
    'Define design system (colors, type, spacing)', 'Build UI component library in Figma',
    'Design high-fidelity screens — set 1', 'Design high-fidelity screens — set 2',
    'Add micro-interactions & states (hover/active)', 'Design for dark mode/light mode',
    'Accessibility check (contrast, sizing)', 'Prototype key user flow in Figma',
    'Get feedback & iterate designs', 'Finalize & submit High-fidelity Designs',
    'Define mobile app concept & user flows', 'Design onboarding screens',
    'Design core app screens (home/list/detail)', 'Design forms & input screens',
    'Design navigation (tab bar/drawer)', 'Build interactive prototype',
    'Usability test prototype with peers', 'Iterate based on test feedback',
    'Prepare final design handoff file', 'Submit final Mobile App Design in Figma',
  ],
  'Graphic Design': [
    'Study design principles (layout, hierarchy, color)', 'Research poster references & mood board',
    'Sketch poster concept & layout', 'Build poster draft in design tool', 'Typography selection & pairing',
    'Color palette application', 'Add imagery/illustration elements', 'Peer feedback & revisions',
    'Final polish & export formats', 'Finalize & submit Poster',
    'Study platform sizing & best practices', 'Create content calendar concept (5 post ideas)',
    'Design post 1 (Instagram feed)', 'Design post 2 (Instagram story)',
    'Design post 3 (Facebook/LinkedIn post)', 'Design post 4 (carousel/multi-slide post)',
    'Design post 5 (promotional/sale post)', 'Ensure brand consistency across posts', 'Feedback & revisions',
    'Finalize & submit Social Media Post set',
    'Define brand strategy (mission, tone, audience)', 'Design logo concepts', 'Finalize logo & variations',
    'Define color palette & typography system', 'Build brand guideline document',
    'Design 3 marketing designs using brand kit', 'Design 4 more marketing designs',
    'Design final 3 designs (total 10)', 'Compile brand kit + all 10 designs',
    'Submit final Brand Kit + 10 Designs',
  ],
  'Digital Marketing': [
    'SEO fundamentals & search intent', 'Keyword research for a sample business',
    'On-page SEO audit (titles, meta, headers)', 'Technical SEO basics (sitemap, speed, mobile)',
    'Content optimization for target keywords', 'Backlink & off-page SEO basics',
    'Local SEO basics (Google Business Profile)', 'Set up Google Search Console/Analytics',
    'Build SEO audit report', 'Finalize & submit SEO Audit Report',
    'Define campaign goal & target audience', 'Competitor & platform research',
    'Build content calendar for campaign', 'Design/write 3 campaign posts', 'Plan a paid ad (Meta/Google Ads) mock',
    'Set up ad targeting & budget plan', 'Write ad copy variations & A/B test plan',
    'Plan engagement/community strategy', 'Define KPIs & tracking plan',
    'Finalize & submit Social Media Campaign Plan',
    'Market & competitor research', 'Define marketing goals & KPIs', 'Build customer persona & journey map',
    'Plan content strategy (SEO+social+email)', 'Plan paid advertising strategy & budget',
    'Plan email marketing sequence', 'Build campaign timeline/calendar', 'Define analytics & reporting plan',
    'Compile full marketing plan document', 'Submit final Complete Marketing Plan',
  ],
  'Content Writing': [
    'Content writing fundamentals & tone', 'Topic research & outline for a blog',
    'Write blog draft — intro & structure', 'Write blog draft — body sections', 'Write blog draft — conclusion & CTA',
    'Edit for clarity & grammar', 'Add headings, formatting & readability pass',
    'Add relevant links/images references', 'Proofread & final polish', 'Finalize & submit Blog Post',
    'Keyword research for target article', 'Analyze top-ranking competitor articles',
    'Build SEO-optimized outline', 'Write SEO article — intro & sections', 'Write SEO article — remaining sections',
    'Optimize meta title & description', 'Add internal/external linking strategy',
    'Optimize headers & keyword density', 'Edit & readability check', 'Finalize & submit SEO Article',
    'Plan 10 blog topics with keyword research', 'Write blogs 1-2', 'Write blogs 3-4', 'Write blogs 5-6',
    'Write blogs 7-8', 'Write blogs 9-10', 'SEO-optimize all 10 blogs (meta/headers)',
    'Edit & proofread all blogs', 'Compile blogs into final submission format',
    'Submit final set of 10 SEO Blogs',
  ],
  'HR': [
    'HR fundamentals & recruitment lifecycle', 'Define job description for a sample role',
    'Learn resume screening criteria & red flags', 'Screen batch of 10 sample resumes',
    'Screen batch of 10 more sample resumes', 'Shortlist candidates & document reasoning',
    'Learn ATS basics & keyword matching', 'Build a resume screening checklist/template',
    'Practice screening with feedback', 'Finalize & submit Resume Screening Report',
    'Interview process fundamentals', 'Learn behavioral interview techniques (STAR)',
    'Draft technical/role-specific questions', 'Draft behavioral & culture-fit questions',
    'Build a structured interview scorecard', 'Practice mock interview (as interviewer)',
    'Learn how to evaluate & rate candidates', 'Draft rejection/feedback templates',
    'Review & refine question bank', 'Finalize & submit Interview Question Bank',
    'Define hiring criteria for sample role', 'Screen & shortlist candidate pool',
    'Conduct mock interviews — candidates 1-3', 'Conduct mock interviews — candidates 4-6',
    'Conduct mock interviews — candidates 7-10', 'Score & compare all candidates',
    'Make hiring decisions & document rationale', 'Draft offer communication for selected 10',
    'Compile full hiring process report', 'Submit final Hiring Report (10 Candidates)',
  ],
  'Python': [
    'Python setup & syntax basics', 'Variables, data types & operators', 'Conditionals & loops practice',
    'Functions & scope', 'Lists, tuples & dictionaries', 'String manipulation practice',
    'Error handling (try/except)', 'Modules & basic OOP intro (classes)', 'Mini practice exercises/problems',
    'Finalize & submit Basics exercises',
    'Reading & writing text files', 'Working with CSV files', 'Working with JSON files',
    'Exception handling in file operations', 'Building a simple file-based data store',
    'Parsing & processing file data', 'Working with directories (os module)', 'Logging to files',
    'Practice: build a file-based to-do app', 'Finalize & submit File Handling project',
    'Plan features & data model for the system', 'Build add student functionality',
    'Build view/list students functionality', 'Build update student functionality',
    'Build delete student functionality', 'Add search/filter students',
    'Persist data using file/JSON storage', 'Add input validation & error handling',
    'Testing & bug fixing', 'Submit final Student Management System',
  ],
  'Java': [
    'Java setup & syntax basics', 'Classes & objects', 'Constructors & encapsulation', 'Inheritance practice',
    'Polymorphism practice', 'Abstraction (abstract classes/interfaces)', 'Exception handling',
    'Collections framework basics', 'Mini OOP practice project', 'Finalize & submit OOP exercises',
    'JDBC fundamentals & setup', 'Connecting Java to a database', 'Executing SELECT queries',
    'Executing INSERT/UPDATE/DELETE queries', 'Using PreparedStatement (SQL injection safety)',
    'Handling ResultSets & mapping to objects', 'Transaction management basics', 'Connection pooling basics',
    'Practice: build a simple CRUD console app', 'Finalize & submit JDBC CRUD project',
    'Plan features & database schema', 'Build add book/member functionality',
    'Build issue/return book functionality', 'Build search book/member functionality',
    'Build fine/overdue calculation logic', 'Add data validation & error handling',
    'Build simple console/UI interface', 'Testing & bug fixing', 'Documentation & code cleanup',
    'Submit final Library Management System',
  ],
  'Data Analytics': [
    'Excel fundamentals & data entry', 'Formulas & functions (VLOOKUP, IF, etc.)', 'Data cleaning techniques',
    'PivotTables basics', 'PivotCharts & visualization basics', 'Conditional formatting for insights',
    'Working with large datasets', 'Building a summary dashboard in Excel', 'Data analysis practice exercise',
    'Finalize & submit Excel Analysis',
    'SQL fundamentals & SELECT basics', 'Filtering & sorting data (WHERE, ORDER BY)',
    'Aggregate functions & GROUP BY', 'JOINs (INNER, LEFT, RIGHT)', 'Subqueries & nested queries',
    'Views & basic query optimization', 'Practice: write 10 analysis queries',
    'Working with a sample business database', 'Building reports from SQL queries',
    'Finalize & submit SQL Analysis project',
    'Power BI setup & data import', 'Data cleaning & transformation (Power Query)',
    'Build data model & relationships', 'Create core visualizations — set 1', 'Create core visualizations — set 2',
    'Add filters & slicers for interactivity', 'Build KPI cards & summary view',
    'Design & polish dashboard layout', 'Testing & refining dashboard', 'Submit final Power BI Dashboard',
  ],
};

function nexaroPhaseForDay(day) {
  if (day <= 10) return 'Week 1';
  if (day <= 20) return 'Week 2';
  return 'Final Project';
}

// Build the full ordered list of 30 daily tasks for a domain.
function nexaroGenerateTasks(domain) {
  const titles = NEXARO_DOMAINS[domain];
  if (!titles) return [];
  return titles.map((title, i) => {
    const day = i + 1;
    return {
      day, phase: nexaroPhaseForDay(day), title,
      detail: `Day ${day} deliverable: ${title}`,
      isFinal: day === NEXARO_PROGRAM_DAYS,
      status: 'pending', submission: null, feedback: '', custom: false,
    };
  });
}

// ── localStorage helpers ──
function nexaroGetStudents() {
  try { return JSON.parse(localStorage.getItem('nexaro_students') || '{}'); }
  catch { return {}; }
}
function nexaroSaveStudents(students) {
  localStorage.setItem('nexaro_students', JSON.stringify(students));
}
function nexaroGetCertificates() {
  try { return JSON.parse(localStorage.getItem('nexaro_certificates') || '{}'); }
  catch { return {}; }
}
function nexaroSaveCertificates(certs) {
  localStorage.setItem('nexaro_certificates', JSON.stringify(certs));
}
function nexaroCurrentEmail() {
  return localStorage.getItem('nexaro_current_student') || '';
}
function nexaroSetCurrentEmail(email) {
  localStorage.setItem('nexaro_current_student', email);
}
function nexaroLogoutStudent() {
  localStorage.removeItem('nexaro_current_student');
}

function nexaroRegisterStudent({ name, email, password, domain }) {
  const students = nexaroGetStudents();
  if (students[email]) return { ok: false, error: 'An account with this email already exists. Please login instead.' };
  if (!NEXARO_DOMAINS[domain]) return { ok: false, error: 'Please select a valid domain.' };
  students[email] = {
    name, email, password, domain, duration: NEXARO_PROGRAM_DAYS,
    registeredAt: new Date().toISOString(),
    tasks: nexaroGenerateTasks(domain),
    finalApproved: false,
    certificateId: null,
  };
  nexaroSaveStudents(students);
  nexaroSetCurrentEmail(email);
  return { ok: true, student: students[email] };
}

function nexaroLoginStudent(email, password) {
  const students = nexaroGetStudents();
  const student = students[email];
  if (!student || student.password !== password) return { ok: false, error: 'Invalid email or password.' };
  nexaroSetCurrentEmail(email);
  return { ok: true, student };
}

function nexaroSubmitTask(email, day, submissionText) {
  const students = nexaroGetStudents();
  const student = students[email];
  if (!student) return { ok: false };
  const task = student.tasks.find(t => t.day === day);
  if (!task) return { ok: false };
  task.submission = submissionText;
  task.status = 'submitted';
  task.submittedAt = new Date().toISOString();
  nexaroSaveStudents(students);
  return { ok: true, student };
}

function nexaroRecomputeCompletion(student) {
  const allApproved = student.tasks.length > 0 && student.tasks.every(t => t.status === 'approved');
  student.finalApproved = allApproved;
  return allApproved;
}

function nexaroReviewTask(email, day, decision, feedback) {
  // decision: 'approved' | 'rejected'
  const students = nexaroGetStudents();
  const student = students[email];
  if (!student) return { ok: false };
  const task = student.tasks.find(t => t.day === day);
  if (!task) return { ok: false };
  task.status = decision;
  task.feedback = feedback || '';
  const justCompleted = nexaroRecomputeCompletion(student);
  nexaroSaveStudents(students);
  if (justCompleted && !student.certificateId) {
    nexaroIssueCertificate(email);
  }
  return { ok: true, student };
}

// ── Admin task management ("admin handles everything") ──
function nexaroAddCustomTask(email, title, detail) {
  const students = nexaroGetStudents();
  const student = students[email];
  if (!student) return { ok: false };
  const nextDay = Math.max(...student.tasks.map(t => t.day), 0) + 1;
  student.tasks.push({
    day: nextDay, phase: 'Bonus Task', title, detail: detail || title,
    isFinal: false, status: 'pending', submission: null, feedback: '', custom: true,
  });
  nexaroRecomputeCompletion(student);
  nexaroSaveStudents(students);
  return { ok: true, student };
}

function nexaroEditTask(email, day, { title, detail }) {
  const students = nexaroGetStudents();
  const student = students[email];
  if (!student) return { ok: false };
  const task = student.tasks.find(t => t.day === day);
  if (!task) return { ok: false };
  if (title) task.title = title;
  if (detail) task.detail = detail;
  nexaroSaveStudents(students);
  return { ok: true, student };
}

function nexaroRemoveTask(email, day) {
  const students = nexaroGetStudents();
  const student = students[email];
  if (!student) return { ok: false };
  student.tasks = student.tasks.filter(t => t.day !== day);
  nexaroRecomputeCompletion(student);
  nexaroSaveStudents(students);
  return { ok: true, student };
}

function nexaroDeleteStudent(email) {
  const students = nexaroGetStudents();
  delete students[email];
  nexaroSaveStudents(students);
}

function nexaroGenerateCertificateId() {
  const year = new Date().getFullYear();
  const certs = nexaroGetCertificates();
  let n = Object.keys(certs).filter(id => id.includes(String(year))).length + 1;
  let id;
  do {
    id = `NEXARO-${year}-${String(n).padStart(3, '0')}`;
    n++;
  } while (certs[id]);
  return id;
}

function nexaroIssueCertificate(email) {
  const students = nexaroGetStudents();
  const student = students[email];
  if (!student) return { ok: false, error: 'Student not found.' };
  if (!student.finalApproved) return { ok: false, error: 'All tasks must be approved before issuing a certificate.' };
  if (student.certificateId) return { ok: true, certId: student.certificateId, alreadyIssued: true };

  const certId = nexaroGenerateCertificateId();
  const certs = nexaroGetCertificates();
  certs[certId] = {
    certId, name: student.name, domain: student.domain,
    duration: `${NEXARO_PROGRAM_DAYS} days`, year: new Date().getFullYear(),
    issuedAt: new Date().toISOString(),
  };
  nexaroSaveCertificates(certs);

  student.certificateId = certId;
  nexaroSaveStudents(students);

  return { ok: true, certId };
}

function nexaroRevokeCertificate(email) {
  const students = nexaroGetStudents();
  const student = students[email];
  if (!student || !student.certificateId) return { ok: false };
  const certs = nexaroGetCertificates();
  delete certs[student.certificateId];
  nexaroSaveCertificates(certs);
  student.certificateId = null;
  nexaroSaveStudents(students);
  return { ok: true };
}
