// === Disable Right-Click ===
document.addEventListener('contextmenu', e => e.preventDefault());

window.addEventListener('DOMContentLoaded', () => {

  // === 1. Check for Mobile Device ===
  const mainContent = document.querySelector('.center-container');
  const deviceWarning = document.getElementById('deviceWarning');
  const lanthFooter = document.getElementById('lanthFooter');
  
  function isMobileDevice() {
    // A simple check for mobile/tablet
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1) || (window.innerWidth < 768);
  }

  // If mobile, show warning and stop the rest of the script
  if (isMobileDevice()) {
    if (mainContent) mainContent.classList.add('hidden'); // Hide the main app
    if (lanthFooter) lanthFooter.classList.add('hidden'); // Hide the footer
    if (deviceWarning) deviceWarning.classList.remove('hidden'); // Show the warning
    return; // Stop script execution for mobile
  }

  // === 2. Load Saved Theme ===
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }

  // === 3. Elements ===
  const input = document.getElementById('userInput');
  const button = document.getElementById('enterBtn');
  const snackbar = document.getElementById('snackbar');
  const popup = document.getElementById('customPopup');
  const popupClose = popup.querySelector('.close-btn');
  const lanthPopup = document.getElementById('lanthPopup');
  const lanthClose = lanthPopup.querySelector('.close-btn');
  const passwordTitle = document.getElementById('passwordTitle');

  // === 4. Snackbar functions ===
  function showSnackbar(message) {
    snackbar.textContent = message;
    snackbar.classList.remove("hide");
    snackbar.classList.add("show");
    setTimeout(() => snackbar.classList.add("hide"), 1500);
    setTimeout(() => {
      snackbar.classList.remove("show","hide");
    }, 2300);
  }

  // Beta Snackbar (no changes, kept as-is)
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

  // === 5. Popup helpers ===
  function showPopup(p) { p.classList.add("show"); }
  function hidePopup(p) { p.classList.remove("show"); }
  popupClose.addEventListener('click', () => hidePopup(popup));
  lanthClose.addEventListener('click', () => hidePopup(lanthPopup));

  // ADDED: Close popups with Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
      hidePopup(popup);
      hidePopup(lanthPopup);
    }
  });


  // === 6. REFACTORED: Handle password actions ===

  // Keep track of "secret" states
  let isButtonRed = false;
  let isTitleClickable = false;
  // Set initial state from DOM (in case dark mode was loaded)
  if (localStorage.getItem('theme') === 'dark') {
    // You can add logic here if needed
  }
  
  // This "command map" is much cleaner than a long if/else chain
  const commands = {
    // Theme
    "1811": () => {
      document.body.classList.add("dark-mode");
      localStorage.setItem('theme', 'dark'); // Save preference
      showSnackbar("Dark mode enabled");
    },
    "0811": () => {
      document.body.classList.remove("dark-mode");
      localStorage.setItem('theme', 'light'); // Save preference
      showSnackbar("Light mode enabled");
    },
    
    // Button Color
    "619": () => {
      button.style.backgroundColor = "red";
      isButtonRed = true;
      showSnackbar("Button color changed");
    },
    "619a": () => {
      button.style.backgroundColor = "#007bff"; // Reset to default blue
      isButtonRed = false;
      showSnackbar("Button color reset");
    },
    
    // Title
    "22192": () => {
      passwordTitle.classList.add('clickable');
      isTitleClickable = true;
      showSnackbar("Title is now clickable");
    },
    
    // Popups & Links
    "111": () => showPopup(popup),
    "50": () => window.open("https://www.google.com", "_blank"),
    
    // Dev Navigation
    "dev": () => window.location.href = "index-dev.html",
    "backdev": () => window.location.href = "index.html",

    // Beta Command
    "ss >> int ins beta 013 from w1b": () => installBeta(true), // Pass flag to indicate command call

    // Conditional commands
    "5191": () => {
      if (isButtonRed) {
        window.open("https://www.google.com", "_blank");
      } else {
        showSnackbar("Wrong password");
      }
    },
    "28": () => {
      if (isButtonRed && isTitleClickable) {
        window.open("https://www.youtube.com", "_blank");
      } else {
        showSnackbar("Wrong password");
      }
    }
  };

  // This is the new, simple function that runs commands
  function handleEnter(value) {
    value = value.trim();
    if (commands[value]) {
      commands[value](); // Execute the function from the map
      input.value = ""; // Clear input on success
    } else {
      showSnackbar("Wrong password");
    }
  }

  // input box triggers (no change)
  button.addEventListener('click', () => handleEnter(input.value));
  input.addEventListener('keydown', e => { if (e.key === "Enter") handleEnter(input.value); });

  // === 7. Lanth popup + Beta button (Updated) ===
  lanthFooter.addEventListener('click', () => {
    showPopup(lanthPopup);
    // Use the state variables, which is faster than checking the DOM
    if (isButtonRed && isTitleClickable) {
      let betaBtn = document.getElementById('betaBtn');
      if (!betaBtn) {
        betaBtn = document.createElement('button');
        betaBtn.id = "betaBtn";
        betaBtn.textContent = "Beta v0.13";
        betaBtn.style.cssText = "margin-top:10px;padding:5px 10px;cursor:pointer;";
        // Append to the popup's content area
        lanthPopup.querySelector('.popup-content').appendChild(betaBtn);
      }
      // Note: The click handler does *not* pass 'true'
      betaBtn.onclick = installBeta; 
    }
  });

  // installBeta function (FIXED: Added parameter 'isCommandCall' and conditional creation)
  function installBeta(isCommandCall = false) {
    let betaBtn = document.getElementById('betaBtn');
    
    // If the function is called via the command and the button hasn't been created yet,
    // we need to temporarily create it to handle the logic.
    if (isCommandCall && !betaBtn) {
        // Create a temporary, invisible button just to hold the dataset property logic
        betaBtn = document.createElement('button');
        betaBtn.id = "betaBtn";
        // Append to body momentarily just to be in the DOM, then remove. 
        // This is a cleaner way to manage persistent state than local storage 
        // if the state is only relevant to a temporary element's history.
        document.body.appendChild(betaBtn);
        // We don't actually need to show the button if it was triggered by a command 
        // before the user opened the popup.
        
        // After this block, betaBtn is guaranteed to not be null.
    }
    
    // If the button still doesn't exist (i.e., not a command call, and conditions weren't met),
    // we shouldn't proceed. This handles the case where someone manually calls installBeta()
    // but the button doesn't exist for UI reasons.
    if (!betaBtn) {
        console.error("Attempted to install beta, but beta button was not initialized.");
        return; 
    }

    // Actual logic
    if (!betaBtn.dataset.clicked) {
      showBetaSnackbar("A new password has been added!");
      betaBtn.dataset.clicked = "true";
    } else {
      showBetaSnackbar("You've already installed v0.13!");
    }
    
    // Clean up temporary button if it was created for command execution
    if (isCommandCall && betaBtn.parentNode === document.body) {
        document.body.removeChild(betaBtn);
    }
  }

  // === 8. FIXED: Only show dev mod menu on index-dev.html ===
  const currentPage = window.location.pathname.split("/").pop() || "index.html"; // Default to index.html if path is "/"
  
  // The logic is now MOVED INSIDE this 'if' block
  if (currentPage === "index-dev.html") {
    
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

    // Updated list to include more commands for testing
    const passwords = [
      "1811", "0811", "619", "619a", "22192", "5191", "28", "111", "50", 
      "ss >> int ins beta 013 from w1b", "backdev"
    ];
    
    passwords.forEach(pw => {
      const btn = document.createElement('button');
      btn.textContent = pw;
      btn.style.cssText = `
        padding: 8px 12px; /* Adjusted padding */
        text-align: left;
        cursor: pointer;
        border-radius: 5px;
        border: 1px solid #007bff;
        background: #007bff;
        color: #fff;
        font-weight: bold;
        user-select: none;
        word-break: break-all; /* For the long beta command */
      `;
      // Updated click handler to be more useful
      btn.addEventListener('click', () => {
         input.value = pw; // Put text in input
         handleEnter(pw);  // Run the command
      });
      pwMenu.appendChild(btn);
    });

    // draggable logic (no change)
    let isDragging = false, offsetX, offsetY;
    pwMenu.addEventListener('mousedown', e => {
      // Prevent button clicks from starting a drag
      if (e.target.tagName === 'BUTTON') return;
      isDragging = true;
      offsetX = e.clientX - pwMenu.offsetLeft;
      offsetY = e.clientY - pwMenu.offsetTop;
      pwMenu.style.transition = 'none';
    });
    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      pwMenu.style.left = `${e.clientX - offsetX}px`;
      pwMenu.style.top = `${e.clientY - offsetY}px`;
    });
    document.addEventListener('mouseup', () => { 
      if (isDragging) { 
        isDragging = false; 
        pwMenu.style.transition = ''; // Reset transition
      } 
    });
  }
  
  // ===================================================
  // === CALCULATOR LOGIC (333 Command) ===
  // ===================================================
  let currentOperand = '';
  let previousOperand = '';
  let operation = undefined;

  function clear() {
    currentOperand = '';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
  }

  function deleteDigit() {
    currentOperand = currentOperand.toString().slice(0, -1);
    updateDisplay();
  }

  function appendNumber(number) {
    if (number === '.' && currentOperand.includes('.')) return;
    if (currentOperand === '0' && number !== '.') {
      currentOperand = number.toString();
    } else {
      currentOperand = currentOperand.toString() + number.toString();
    }
    updateDisplay();
  }

  function chooseOperation(op) {
    if (currentOperand === '') return;
    if (previousOperand !== '') {
      compute();
    }
    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
    updateDisplay();
  }

  function compute() { 
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '×':
        computation = prev * current;
        break;
      case '÷':
        computation = prev / current;
        break;
      default:
        return;
    }
    
    // Fix for floating point errors and limit to 8 decimal places
    computation = parseFloat(computation.toFixed(8));

    currentOperand = computation.toString();
    operation = undefined;
    previousOperand = '';
  }

  function updateDisplay() {
    // Current Operand Display
    display.textContent = currentOperand === '' ? '0' : currentOperand;

    // Previous Operand Preview (using innerHTML for multi-line)
    if (operation != null && previousOperand !== '') {
        const previewColor = document.body.classList.contains('dark-mode') ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)';
        const previewHTML = `<div style="font-size: 0.4em; color: ${previewColor};">${previousOperand} ${operation}</div>`;
        
        // Use innerHTML to stack the preview and current value
        display.innerHTML = previewHTML + `<span style="font-size: 1em; color: inherit;">${currentOperand}</span>`;
    } else {
        display.textContent = currentOperand === '' ? '0' : currentOperand;
    }
  }

  // Attach Calculator Event Listeners
  numberButtons.forEach(button => {
    button.addEventListener('click', () => {
      appendNumber(button.textContent);
    });
  });

  operationButtons.forEach(button => {
    button.addEventListener('click', () => {
      chooseOperation(button.getAttribute('data-operation'));
    });
  });

  equalsButton.addEventListener('click', () => {
    compute();
    updateDisplay();
    // After calculation, clear operation state
    operation = undefined;
    previousOperand = '';
  });

  clearButton.addEventListener('click', clear);
  deleteButton.addEventListener('click', deleteDigit);
  
  // Initial display setup
  updateDisplay();

}); // End of DOMContentLoaded
