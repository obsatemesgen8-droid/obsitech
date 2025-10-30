// settings.js
(function(){
  const sessionKey = 'ifts_session';
  const usersKey = 'ifts_users';
  const session = localStorage.getItem(sessionKey);
  if(!session){ window.location.href='index.html'; return; }

  const users = JSON.parse(localStorage.getItem(usersKey) || '[]');
  const meIndex = users.findIndex(u=>u.email===session);
  if(meIndex===-1){ localStorage.removeItem(sessionKey); window.location.href='index.html'; return; }
  const me = users[meIndex];

  const nameEl = document.getElementById('settingsName');
  const emailEl = document.getElementById('settingsEmail');
  const passEl = document.getElementById('settingsPassword');
  const saveBtn = document.getElementById('saveSettings');
  const uploadEl = document.getElementById('profileUpload');
  const preview = document.getElementById('profilePreview');
  const smallThumb = document.getElementById('profileImgSmall');

  nameEl.value = me.name;
  emailEl.value = me.email;
  const profileKey = `profile_${me.email}`;
  const imgData = localStorage.getItem(profileKey);
  const defaultImg = 'assets/images/profile-default.svg';
  preview.src = imgData || defaultImg;
  if(smallThumb) smallThumb.src = imgData || defaultImg;

  uploadEl.addEventListener('change', e=>{
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(ev){
      const base64 = ev.target.result;
      preview.src = base64;
      if(smallThumb) smallThumb.src = base64;
      localStorage.setItem(profileKey, base64);
    }
    reader.readAsDataURL(file);
  });

  saveBtn.addEventListener('click', ()=>{
    const newName = nameEl.value.trim();
    const newPass = passEl.value.trim();
    if(!newName) return alert('Name cannot be empty');
    users[meIndex].name = newName;
    if(newPass) users[meIndex].password = newPass;
    localStorage.setItem(usersKey, JSON.stringify(users));
    alert('Profile updated successfully');
    passEl.value='';
  });

  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn) logoutBtn.addEventListener('click', ()=>{ localStorage.removeItem(sessionKey); window.location.href='index.html'; });

})();
