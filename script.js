// === FORCE WHOLE SITE UNSELECTABLE ===
document.documentElement.style.userSelect = 'none';
document.documentElement.style.webkitUserSelect = 'none';
document.documentElement.style.mozUserSelect = 'none';
document.documentElement.style.msUserSelect = 'none';
document.addEventListener('contextmenu', e => e.preventDefault());

// Detect non-computer devices
const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile|webOS/i.test(navigator.userAgent);

window.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('mainContent');
  const deviceWarning = document.getElementById('deviceWarning');

  if (isMobile) {
    mainContent.style.display = 'none';
    deviceWarning.classList.remove('hidden');
    return;
  }

  // Elements
  const input = document.getElementById('userInput');
  const button = document.getElementById('enterBtn');
  const snackbar = document.getElementById('snackbar');
  const popup = document.getElementById('customPopup');
  const popupClose = popup.querySelector('.close-btn');
  const lanthFooter = document.getElementById('lanthFooter');
  const lanthPopup = document.getElementById('lanthPopup');
  const lanthClose = lanthPopup.querySelector('.close-btn');
  const passwordTitle = document.getElementById('passwordTitle');

  // === Snackbar functions ===
  function showSnackbar(message) {
    snackbar.textContent = message;
    snackbar.classList.remove("hide");
    snackbar.classList.add("show");
    setTimeout(() => snackbar.classList.add("hide"), 1500);
    setTimeout(() => {
      snackbar.classList.remove("show","hide");
      snackbar.style.visibility = "hidden";
    }, 2300);
  }

  const betaSnackbar = document.createElement('div');
  betaSnackbar.id = "betaSnackbar";
  betaSnackbar.style.cssText = `
    visibility: hidden;
    min-width: 200px;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 4px;
    padding: 8px;
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1001;
    opacity: 0;
    transition: opacity 0.5s ease;
  `;
  document.body.appendChild(betaSnackbar);

  function showBetaSnackbar(message) {
    betaSnackbar.textContent = message;
    betaSnackbar.style.visibility = "visible";
    betaSnackbar.style.opacity = 1;
    setTimeout(() => {
      betaSnackbar.style.opacity = 0;
      setTimeout(() => betaSnackbar.style.visibility = "hidden", 500);
    }, 2000);
  }

  // === Popup helpers ===
  function showPopup(p) { p.classList.add("show"); }
  function hidePopup(p) { p.classList.remove("show"); }
  popupClose.addEventListener('click', () => hidePopup(popup));
  lanthClose.addEventListener('click', () => hidePopup(lanthPopup));

  // === Handle password actions ===
  function handleEnter(value) {
    value = value.trim();

    // Dark / Light mode
    if (value === "1811") { document.body.classList.add("dark-mode"); return; }
    if (value === "0811") { document.body.classList.remove("dark-mode"); return; }

    // Button color
    if (value === "619") { button.style.backgroundColor = "red"; return; }
    if (value === "619a") { button.style.backgroundColor = "#007bff"; return; }

    // inside handleEnter()
    if (value === "dev") {
      window.location.href = "index-dev.html";
      return;
    }

    if (value === "backdev") {
      window.location.href = "index.html";
      return;
    }


    // Conditional passwords
    if (value === "5191") {
      if(getComputedStyle(button).backgroundColor==="rgb(255, 0, 0)"){ window.open("https://www.google.com","_blank"); }
      else{ showSnackbar("Wrong password"); }
      return;
    }

    if(value==="28"){
      if(getComputedStyle(button).backgroundColor==="rgb(255, 0, 0)" && passwordTitle.classList.contains('clickable')){
        window.open("https://www.youtube.com","_blank");
      } else { showSnackbar("Wrong password"); }
      return;
    }

    if(value==="22192"){ passwordTitle.classList.add('clickable'); return; }
    if(value==="50"){ window.open("https://www.google.com","_blank"); return; }
    if(value==="111"){ showPopup(popup); return; }

    // Beta v0.13 command
    if(value==="ss >> int ins beta 013 from w1b"){ installBeta(); return; }

    showSnackbar("Wrong password");
  }

  // input box triggers
  button.addEventListener('click', ()=>handleEnter(input.value));
  input.addEventListener('keydown', e=>{ if(e.key==="Enter") handleEnter(input.value); });

  // === Lanth popup + Beta button ===
  lanthFooter.addEventListener('click', () => {
    showPopup(lanthPopup);
    const btnColor = getComputedStyle(button).backgroundColor;
    if(btnColor==="rgb(255, 0, 0)" && passwordTitle.classList.contains('clickable')){
      let betaBtn = document.getElementById('betaBtn');
      if(!betaBtn){
        betaBtn = document.createElement('button');
        betaBtn.id = "betaBtn";
        betaBtn.textContent = "Beta v0.13";
        betaBtn.style.cssText = "margin-top:10px;padding:5px 10px;cursor:pointer;";
        lanthPopup.appendChild(betaBtn);
      }
      betaBtn.onclick = installBeta;
    }
  });

  function installBeta(){
    let betaBtn = document.getElementById('betaBtn');
    if(!betaBtn.dataset.clicked){
      showBetaSnackbar("A new password has been added!");
      betaBtn.dataset.clicked = "true";
    } else { showBetaSnackbar("You've already installed v0.13!"); }
  }

  // === Only show dev mod menu on index-dev.html ===
  const currentPage = window.location.pathname.split("/").pop();
  if (currentPage !== "index-dev.html") {
    return; // Stop here, don't create the dev menu for normal users
  }


  // === Dev draggable password menu ===
  const pwMenu = document.createElement('div');
  pwMenu.id = 'pwMenu';
  pwMenu.style.cssText = `
    position: fixed;
    top: 50px;
    left: 50px;
    background: #fff;
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    cursor: move;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 8px;
    user-select: none;
  `;
  document.body.appendChild(pwMenu);

  const passwords = ["1811","0811","619","619a","22192","5191","28","scm","ss"];
  passwords.forEach(pw=>{
    const btn = document.createElement('button');
    btn.textContent = pw;
    btn.style.cssText = `
      padding: 8px 60px;
      cursor: pointer;
      border-radius: 5px;
      border: 1px solid #007bff;
      background: #007bff;
      color: #fff;
      font-weight: bold;
      user-select: none;
    `;
    btn.addEventListener('click', ()=>handleEnter(pw));
    pwMenu.appendChild(btn);
  });

  // draggable
  let isDragging=false,offsetX,offsetY;
  pwMenu.addEventListener('mousedown', e=>{
    isDragging=true;
    offsetX=e.clientX-pwMenu.offsetLeft;
    offsetY=e.clientY-pwMenu.offsetTop;
    pwMenu.style.transition='none';
  });
  document.addEventListener('mousemove', e=>{
    if(!isDragging) return;
    pwMenu.style.left=`${e.clientX-offsetX}px`;
    pwMenu.style.top=`${e.clientY-offsetY}px`;
  });
  document.addEventListener('mouseup', ()=>{ if(isDragging){ isDragging=false; pwMenu.style.transition='all 0.3s'; } });

});
