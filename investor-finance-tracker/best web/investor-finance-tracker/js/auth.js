/* Simple auth using localStorage. */
(function(){
  const sampleUser = {name:'Demo User',email:'demo@ifts.test',password:'password'};
  const usersKey = 'ifts_users';
  const sessionKey = 'ifts_session';

  function getUsers(){ return JSON.parse(localStorage.getItem(usersKey) || '[]'); }
  function saveUsers(u){ localStorage.setItem(usersKey, JSON.stringify(u)); }
  function setSession(email){ localStorage.setItem(sessionKey, email); }
  function getSession(){ return localStorage.getItem(sessionKey); }

  // ensure sample user exists
  const u = getUsers();
  if(!u.find(x=>x.email===sampleUser.email)){ u.push(sampleUser); saveUsers(u); }

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const showRegister = document.getElementById('showRegister');
  const showLogin = document.getElementById('showLogin');

  showRegister.addEventListener('click', e=>{
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    showRegister.classList.add('hidden');
    showLogin.classList.remove('hidden');
  });
  showLogin.addEventListener('click', e=>{
    e.preventDefault();
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    showRegister.classList.remove('hidden');
    showLogin.classList.add('hidden');
  });

  loginForm.addEventListener('submit', e=>{
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const pass = document.getElementById('loginPassword').value;
    const users = getUsers();
    const found = users.find(x=>x.email===email && x.password===pass);
    if(!found){ alert('Invalid credentials'); return; }
    setSession(found.email);
    window.location.href = 'dashboard.html';
  });

  registerForm.addEventListener('submit', e=>{
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const pass = document.getElementById('regPassword').value;
    const users = getUsers();
    if(users.find(x=>x.email===email)){ alert('Email already used'); return; }
    users.push({name,email,password:pass});
    saveUsers(users);
    setSession(email);
    window.location.href = 'dashboard.html';
  });

  if(getSession()){
    if(location.pathname.endsWith('index.html') || location.pathname.endsWith('/')) {
      window.location.href = 'dashboard.html';
    }
  }
})();