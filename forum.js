// forum.js - designed to work with firebase-compat loaded in foro.html
if(typeof firebase === 'undefined'){
  console.warn('Firebase SDK not loaded. Forum will not work until firebase scripts are available.');
} else {
  // Wait for user to load config file
  if(typeof firebaseConfig === 'undefined'){
    console.warn('firebaseConfig not found. Copy your config to js/firebase-config.js based on firebase-config.example.js');
  }
}

let app, auth, db, storage;
function initFirebase() {
  if(typeof firebase === 'undefined' || typeof firebaseConfig === 'undefined') return;
  app = firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore();
  storage = firebase.storage();
  setupAuthUI();
  loadPosts();
}

function setupAuthUI(){
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const btnSignup = document.getElementById('btnSignup');
  const btnLogin = document.getElementById('btnLogin');
  const btnLogout = document.getElementById('btnLogout');
  const userInfo = document.getElementById('userInfo');
  const newPost = document.getElementById('newPost');

  btnSignup.onclick = ()=>{
    auth.createUserWithEmailAndPassword(email.value, password.value)
      .then(u=>{ userInfo.textContent = 'Cuenta creada: ' + u.user.email; })
      .catch(e=> alert(e.message));
  };
  btnLogin.onclick = ()=>{
    auth.signInWithEmailAndPassword(email.value, password.value)
      .catch(e=> alert(e.message));
  };
  btnLogout.onclick = ()=> auth.signOut();

  auth.onAuthStateChanged(user=>{
    if(user){
      userInfo.textContent = 'Conectado: ' + user.email;
      btnLogout.style.display = 'inline-block';
      btnLogin.style.display = 'none';
      btnSignup.style.display = 'none';
      newPost.style.display = 'block';
    } else {
      userInfo.textContent = 'No estás conectado.';
      btnLogout.style.display = 'none';
      btnLogin.style.display = 'inline-block';
      btnSignup.style.display = 'inline-block';
      newPost.style.display = 'none';
    }
  });

  const btnPost = document.getElementById('btnPost');
  btnPost.onclick = publishPost;
}

async function publishPost(){
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();
  const imgFile = document.getElementById('imgUpload').files[0];
  if(!title || !content){ alert('Escribe título y contenido.'); return; }
  const user = auth.currentUser;
  if(!user){ alert('Debes iniciar sesión.'); return; }

  let imgURL = '';
  try{
    if(imgFile){
      const ref = storage.ref().child('posts/' + Date.now() + '_' + imgFile.name);
      await ref.put(imgFile);
      imgURL = await ref.getDownloadURL();
    }
    await db.collection('posts').add({
      title, content, imgURL, author: user.email, createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
    document.getElementById('imgUpload').value = '';
    loadPosts();
  }catch(e){
    alert('Error publicando: ' + e.message);
  }
}

function loadPosts(){
  const list = document.getElementById('postsList');
  if(!db){ list.innerHTML = '<p class="muted">Foro inactivo — configura Firebase (ver README)</p>'; return; }
  db.collection('posts').orderBy('createdAt','desc').onSnapshot(snapshot=>{
    list.innerHTML = '';
    snapshot.forEach(doc=>{
      const d = doc.data();
      const el = document.createElement('div');
      el.className = 'post-card';
      el.innerHTML = `<strong>${escapeHtml(d.title)}</strong><div class="muted">por ${escapeHtml(d.author||'anónimo')} · ${d.createdAt?d.createdAt.toDate():''}</div>
                      <p>${escapeHtml(d.content)}</p>` + (d.imgURL?`<img src="${d.imgURL}" style="max-width:100%;border-radius:8px;margin-top:8px">`:''); 
      list.appendChild(el);
    });
  }, err=>{ list.innerHTML = '<p class="muted">No se pudieron cargar publicaciones. Revisa configuración de Firestore.</p>'; });
}

function escapeHtml(s){ if(!s) return ''; return s.replace(/[&<>'"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;',\"'\":\"&#39;",'\"':'&quot;'})[c]); }

// Auto init when loaded
document.addEventListener('DOMContentLoaded', ()=>{ initFirebase(); });
