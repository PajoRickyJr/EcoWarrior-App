document.addEventListener('DOMContentLoaded', () => {
  const mainboard = document.getElementById('mainboard');
  const expandedView = document.getElementById('expandedView');
  const backToMainboard = document.getElementById('backToMainboard');
  const expandedHeader = document.querySelector('.expanded-header');
  const expandedTips = document.getElementById('expandedTips');
  const searchInput = document.getElementById('searchInput');
  const feedbackForm = document.getElementById('feedbackForm');
  const messageContainer = document.createElement('div'); // For success/error messages
  feedbackForm.parentNode.appendChild(messageContainer);
  messageContainer.className = 'message-container';

  const waterContainer = document.querySelector('.waterPart-container');
  const energyContainer = document.querySelector('.energyPart-container');
  const wasteContainer = document.querySelector('.wastePart-container');

  let currentSection = '';
  let allTips = [];

  // Enhanced message display function
  const showMessage = (text, type) => {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    messageContainer.innerHTML = '';
    messageContainer.appendChild(message);

    setTimeout(() => {
      messageContainer.innerHTML = '';
    }, 3000);
  };

  // Helper Function: Safely parse JSON
  const safeParseJSON = (item) => {
    try {
      return JSON.parse(item) || [];
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      return [];
    }
  };

  // Load tips from localStorage
  const loadTips = (key) => {
    const formattedKey = `current${key.charAt(0).toUpperCase() + key.slice(1)}Tips`;
    return safeParseJSON(localStorage.getItem(formattedKey));
  };

  // Save updated current tips
  const saveTips = (key, tips) => {
    const formattedKey = `current${key.charAt(0).toUpperCase() + key.slice(1)}Tips`;
    localStorage.setItem(formattedKey, JSON.stringify(tips));
  };

  // Render tips in the user interface
  const renderTips = (tips = allTips) => {
    expandedTips.innerHTML = '';
    const filteredTips = tips.filter((tip) => tip.enabled);

    if (filteredTips.length === 0) {
      expandedTips.innerHTML = '<li class="empty-state">No tips available</li>';
    } else {
      filteredTips.forEach((tip) => {
        const tipCard = document.createElement('li');
        tipCard.className = 'tip-card';
        tipCard.innerHTML = `<h3>${tip.title}</h3><p>${tip.description}</p>`;
        expandedTips.appendChild(tipCard);
      });
    }
  };

  // Sync latest tips with current tips
  const syncLatestToCurrent = () => {
    const keys = ['water', 'energy', 'waste'];
    keys.forEach((key) => {
      const latestKey = `latest${key.charAt(0).toUpperCase() + key.slice(1)}Tips`;
      const currentKey = `current${key.charAt(0).toUpperCase() + key.slice(1)}Tips`;

      const latestTips = safeParseJSON(localStorage.getItem(latestKey));
      if (latestTips.length > 0) {
        localStorage.setItem(currentKey, JSON.stringify(latestTips));
        console.log(`Synced ${latestKey} to ${currentKey}`);
      }
    });

    localStorage.setItem('userCheckedVersion', localStorage.getItem('contentVersion'));
    if (currentSection) {
      allTips = loadTips(currentSection);
      renderTips();
    }
  };

  // Check for updates and sync if necessary
  const checkForUpdates = () => {
    const lastCheckedVersion = localStorage.getItem('userCheckedVersion') || '0';
    const currentVersion = localStorage.getItem('contentVersion') || '0';

    if (currentVersion !== lastCheckedVersion) {
      if (confirm('New updates are available. Would you like to sync tips now?')) {
        syncLatestToCurrent();
        showMessage('Latest tips synced successfully!', 'success');
      }
    }
  };

  // Set periodic checks for updates
  setInterval(checkForUpdates, 5000);

  // Event listeners for navigation
  waterContainer.addEventListener('click', () => {
    showExpandedView('water');
  });
  energyContainer.addEventListener('click', () => {
    showExpandedView('energy');
  });
  wasteContainer.addEventListener('click', () => {
    showExpandedView('waste');
  });
  backToMainboard.addEventListener('click', () => {
    expandedView.style.display = 'none';
    mainboard.style.display = 'flex';
    searchInput.value = '';
    feedbackForm.classList.remove('hidden');
  });

  // Show expanded view for a specific section
  const showExpandedView = (section) => {
    currentSection = section;
    mainboard.style.display = 'none';
    expandedView.style.display = 'block';
    feedbackForm.classList.add('hidden');
    expandedView.className = `expanded-view ${section}-view`;

    const sectionTitles = {
      water: '💧 Water Conservation',
      energy: '⚡ Electricity Conservation',
      waste: '♻️ Waste Management',
    };

    expandedHeader.innerText = sectionTitles[section];
    allTips = loadTips(section);
    renderTips();
  };

  // Greet the user
  const storednameUser = localStorage.getItem('nameUser');
  const nameGreetElement = document.getElementById('nameGreet');

  if (storednameUser) {
    nameGreetElement.innerText = `Hi, ${storednameUser}`;
  } else {
    nameGreetElement.innerText = 'Hi, Guest';
  }

  // Feedback form submission
  feedbackForm.classList.remove('hidden');

  feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const feedback = document.getElementById('feedback').value.trim();

    if (!feedback) {
      showMessage('Please provide feedback before submitting.', 'error');
      return;
    }

    showMessage('Thank you for your feedback!', 'success');
    feedbackForm.reset();
  });
});
