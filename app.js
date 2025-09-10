// Simple School Demo using localStorage
(function(){
  // Utilities
  const qs = sel => document.querySelector(sel);
  const qsa = sel => Array.from(document.querySelectorAll(sel));

  // Simulated users (for role switching/login simulation)
  const SIM_USERS = {
    admin: {id:'u_admin', role:'admin', name:'Administrator'},
    teacher: {id:'u_teacher', role:'teacher', name:'Mr. Hasan'},
    student: {id:'u_student', role:'student', name:'Rana'}
  };

  // LocalStorage keys
  const LS = {
    students: 'school_students_v1',
    teachers: 'school_teachers_v1',
    attendance: 'school_attendance_v1',
    exams: 'school_exams_v1'
  };

  // State
  let currentUser = null;

  // Init - seed sample data if empty
  function seedIfEmpty(){
    if(!localStorage.getItem(LS.students)){
      const sampleStudents = [
        {adm:'S1001', name:'Tuhin Ahmed', cls:'6'},
        {adm:'S1002', name:'Nusrat Jahan', cls:'7'},
        {adm:'S1003', name:'Riya Khan', cls:'8'}
      ];
      localStorage.setItem(LS.students, JSON.stringify(sampleStudents));
    }
    if(!localStorage.getItem(LS.teachers)){
      const sampleTeachers = [ {emp:'T2001', name:'Mr. Hasan'}, {emp:'T2002', name:'Ms. Farida'} ];
      localStorage.setItem(LS.teachers, JSON.stringify(sampleTeachers));
    }
    if(!localStorage.getItem(LS.exams)) localStorage.setItem(LS.exams, JSON.stringify([]));
    if(!localStorage.getItem(LS.attendance)) localStorage.setItem(LS.attendance, JSON.stringify({}));
  }

  // Data helpers
  function getStudents(){ return JSON.parse(localStorage.getItem(LS.students) || '[]'); }
  function saveStudents(list){ localStorage.setItem(LS.students, JSON.stringify(list)); }

  function getTeachers(){ return JSON.parse(localStorage.getItem(LS.teachers) || '[]'); }
  function saveTeachers(list){ localStorage.setItem(LS.teachers, JSON.stringify(list)); }

  function getExams(){ return JSON.parse(localStorage.getItem(LS.exams) || '[]'); }
  function saveExams(list){ localStorage.setItem(LS.exams, JSON.stringify(list)); }

  function getAttendance(){ return JSON.parse(localStorage.getItem(LS.attendance) || '{}'); }
  function saveAttendance(obj){ localStorage.setItem(LS.attendance, JSON.stringify(obj)); }

  // Render functions
  function renderCounts(){
    qs('#countStudents').textContent = getStudents().length;
    qs('#countTeachers').textContent = getTeachers().length;
    const today = new Date().toISOString().slice(0,10);
    const att = getAttendance();
    const absentList = (att[today] || []).filter(a => a.status === 'absent');
    qs('#countAbsent').textContent = absentList.length;
  }

  function renderStudents(){
    const tbody = qs('#studentsTable tbody'); tbody.innerHTML = '';
    getStudents().forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${s.adm}</td><td>${s.name}</td><td>${s.cls}</td><td>
        <button data-adm="${s.adm}" class="editStudent">Edit</button>
        <button data-adm="${s.adm}" class="delStudent">Del</button>
      </td>`;
      tbody.appendChild(tr);
    });
  }

  function renderTeachers(){
    const tbody = qs('#teachersTable tbody'); tbody.innerHTML = '';
    getTeachers().forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${t.emp}</td><td>${t.name}</td><td>
        <button data-emp="${t.emp}" class="delTeacher">Del</button>
      </td>`;
      tbody.appendChild(tr);
    });
  }

  function renderAttendance(){
    const tbody = qs('#attendanceTable tbody'); tbody.innerHTML = '';
    const students = getStudents();
    const today = new Date().toISOString().slice(0,10);
    const att = getAttendance();
    const todayList = att[today] || [];
    students.forEach(s => {
      const found = todayList.find(x => x.adm === s.adm);
      const status = found ? found.status : 'absent';
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${s.adm}</td><td>${s.name}</td><td>
        <select data-adm="${s.adm}" class="attSel">
          <option value="present" ${status==='present'?'selected':''}>Present</option>
          <option value="absent" ${status==='absent'?'selected':''}>Absent</option>
        </select>
      </td>`;
      tbody.appendChild(tr);
    });
  }

  function renderExams(){
    const ul = qs('#examsList'); ul.innerHTML = '';
    getExams().forEach((e, idx) => {
      const li = document.createElement('li');
      li.textContent = `${e.name} — ${e.date || 'N/A'}`;
      ul.appendChild(li);
    });
  }

  function renderAll(){
    renderCounts(); renderStudents(); renderTeachers(); renderAttendance(); renderExams();
  }

  // Actions / Events
  function bindEvents(){
    // Tabs
    qsa('.tab-btn').forEach(b => {
      b.addEventListener('click', () => {
        qsa('.tab-btn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        qsa('.tab').forEach(t => t.classList.remove('active'));
        qs('#' + b.dataset.tab).classList.add('active');
      });
    });

    // Role simulate / login
    qs('#loginBtn').addEventListener('click', () => {
      const sel = qs('#roleSelect').value;
      currentUser = SIM_USERS[sel] || null;
      alert(currentUser ? `Logged in as: ${currentUser.name} (${currentUser.role})` : 'No user');
    });

    // Student form
    qs('#studentForm').addEventListener('submit', e => {
      e.preventDefault();
      const adm = qs('#s_adm').value.trim();
      const name = qs('#s_name').value.trim();
      const cls = qs('#s_class').value;
      if(!adm || !name) return alert('Admission and name required');
      const students = getStudents();
      const existing = students.find(s => s.adm === adm);
      if(existing){
        existing.name = name; existing.cls = cls;
      } else {
        students.push({adm, name, cls});
      }
      saveStudents(students);
      qs('#studentForm').reset();
      renderAll();
    });

    // Clear students
    qs('#clearStudents').addEventListener('click', () => {
      if(confirm('Clear all students?')){ localStorage.removeItem(LS.students); renderAll(); }
    });

    // Delegate student table buttons
    qs('#studentsTable').addEventListener('click', (ev) => {
      const btn = ev.target;
      if(btn.classList.contains('delStudent')){
        const adm = btn.dataset.adm;
        if(confirm(`Delete student ${adm}?`)){
          const students = getStudents().filter(s => s.adm !== adm);
          saveStudents(students);
          renderAll();
        }
      } else if(btn.classList.contains('editStudent')){
        const adm = btn.dataset.adm;
        const s = getStudents().find(x => x.adm === adm);
        if(s){
          qs('#s_adm').value = s.adm;
          qs('#s_name').value = s.name;
          qs('#s_class').value = s.cls;
        }
      }
    });

    // Teacher form
    qs('#teacherForm').addEventListener('submit', e => {
      e.preventDefault();
      const emp = qs('#t_emp').value.trim();
      const name = qs('#t_name').value.trim();
      if(!emp || !name) return alert('Employee and name required');
      const teachers = getTeachers();
      const existing = teachers.find(t => t.emp === emp);
      if(existing){
        existing.name = name;
      } else {
        teachers.push({emp, name});
      }
      saveTeachers(teachers);
      qs('#teacherForm').reset();
      renderAll();
    });

    qs('#clearTeachers').addEventListener('click', () => {
      if(confirm('Clear all teachers?')){ localStorage.removeItem(LS.teachers); renderAll(); }
    });

    qs('#teachersTable').addEventListener('click', (ev) => {
      const btn = ev.target;
      if(btn.classList.contains('delTeacher')){
        const emp = btn.dataset.emp;
        if(confirm(`Delete teacher ${emp}?`)){
          const teachers = getTeachers().filter(t => t.emp !== emp);
          saveTeachers(teachers);
          renderAll();
        }
      }
    });

    // Attendance interactions (live select change)
    qs('#attendanceTable').addEventListener('change', (ev) => {
      if(ev.target.classList.contains('attSel')){
        // no immediate save; user may press Save Attendance
        // Optionally we can autosave here — but keep manual save for clarity
      }
    });

    qs('#markAllPresent').addEventListener('click', () => {
      const tbody = qs('#attendanceTable tbody');
      qsa('#attendanceTable tbody select').forEach(sel => sel.value = 'present');
    });

    qs('#saveAttendance').addEventListener('click', () => {
      const today = new Date().toISOString().slice(0,10);
      const rows = qsa('#attendanceTable tbody tr');
      const list = rows.map(row => {
        const adm = row.querySelector('select').dataset.adm;
        const status = row.querySelector('select').value;
        return {adm, status};
      });
      const att = getAttendance();
      att[today] = list;
      saveAttendance(att);
      alert('Attendance saved for ' + today);
      renderCounts();
    });

    qs('#exportAttendance').addEventListener('click', () => {
      const today = new Date().toISOString().slice(0,10);
      const att = getAttendance();
      const list = att[today] || [];
      if(list.length === 0){ alert('No attendance for today to export'); return; }
      // build CSV
      const students = getStudents();
      const rows = [['Admission','Name','Status']];
      list.forEach(item => {
        const s = students.find(x => x.adm === item.adm);
        rows.push([item.adm, s ? s.name : '', item.status]);
      });
      const csv = rows.map(r => r.map(cell => `"${(cell+'').replace(/"/g,'""')}"`).join(',')).join('\\n');
      const blob = new Blob([csv], {type: 'text/csv'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `attendance_${today}.csv`; document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    });

    // Exams
    qs('#examForm').addEventListener('submit', e => {
      e.preventDefault();
      const name = qs('#e_name').value.trim();
      const date = qs('#e_date').value;
      if(!name) return alert('Exam name required');
      const exams = getExams();
      exams.push({name, date});
      saveExams(exams);
      qs('#examForm').reset();
      renderExams();
    });

    qs('#clearExams').addEventListener('click', () => {
      if(confirm('Clear all exams?')){ localStorage.removeItem(LS.exams); renderExams(); }
    });
  }

  // Init
  function init(){
    seedIfEmpty();
    bindEvents();
    renderAll();
  }

  // Run
  init();

})();
