'use strict';
(() => {
  const key='hff-manager-auth-v1', admin=document.body.classList.contains('admin-page');
  const isSignedIn=()=>{try{return localStorage.getItem(key)==='signed-in'}catch{return false}};
  let pending=null, dialog=null;
  function announce(){window.dispatchEvent(new Event('hff-auth-change'))}
  function requireSignIn(){
    if(isSignedIn())return Promise.resolve(true);
    if(pending)return pending;
    pending=new Promise(resolve=>{
      dialog=document.createElement('dialog');dialog.className='dialog signin-dialog';
      dialog.setAttribute('aria-labelledby','signin-heading');
      dialog.innerHTML='<form><h2 id="signin-heading">Sign in</h2><label for="signin-password">Password</label><input id="signin-password" type="password" autocomplete="current-password" required><p class="signin-error" role="alert"></p><div class="actions"><button class="pill active" type="submit">Sign in</button><button class="pill" type="button" data-cancel>Cancel</button></div></form>';
      document.body.append(dialog);
      const input=dialog.querySelector('input');
      const finish=ok=>{input.value='';dialog.remove();dialog=null;pending=null;resolve(ok);if(!ok&&admin)location.replace('index.html')};
      dialog.querySelector('form').onsubmit=e=>{e.preventDefault();if(input.value!=='happyfailing'){dialog.querySelector('.signin-error').textContent='Incorrect password.';input.value='';input.focus();return}try{localStorage.setItem(key,'signed-in')}catch{dialog.querySelector('.signin-error').textContent='Browser storage is unavailable. Enable it to stay signed in.';return}finish(true);announce()};
      dialog.querySelector('[data-cancel]').onclick=()=>finish(false);
      dialog.addEventListener('cancel',e=>{e.preventDefault();finish(false)});
      dialog.showModal();input.focus();
    });
    return pending;
  }
  function logout(){localStorage.removeItem(key);announce();if(admin)location.replace('index.html')}
  const manage=document.querySelector('#manage'), signin=document.createElement('button'), out=document.createElement('button');
  signin.id='signin';signin.className='manage-trigger';signin.textContent='Sign in';signin.onclick=requireSignIn;
  out.id='logout';out.className='manage-trigger';out.textContent='Log out';out.onclick=logout;
  manage.after(signin,out);
  if(admin)document.querySelector('.back-link')?.after(out);
  function update(){signin.hidden=isSignedIn();out.hidden=!isSignedIn()}
  window.addEventListener('hff-auth-change',update);
  window.addEventListener('storage',e=>{if(e.key===key||e.key===null){announce();if(admin&&!isSignedIn())location.replace('index.html')}});
  update();
  window.HFFAuth={isSignedIn,requireSignIn,logout};
  // Unhide only the manager chrome after authentication; its script waits for this promise.
  if(admin){document.body.classList.add('auth-locked');document.body.hidden=false}
  window.HFFAuth.ready=admin?requireSignIn().then(ok=>{if(ok)document.body.classList.remove('auth-locked');return ok}):Promise.resolve(true);
})();
