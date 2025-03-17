document.addEventListener('DOMContentLoaded', () => {
  const saveChangesButton = document.getElementById('saveChanges');
  const discardChangesButton = document.getElementById('discardChanges');
  const waterForm = document.getElementById('tipWaterForm');
  const energyForm = document.getElementById('tipEnergyForm');
  const wasteForm = document.getElementById('wasteForm');
  const waterTipList = document.getElementById('waterTipList');
  const energyTipList = document.getElementById('energyTipList');
  const wasteTipList = document.getElementById('wasteTipList');

  let pendingTips = {
    water: [],
    energy: [],
    waste: []
  };

  let pendingChanges = false;

  // Helper Function: Safely parse JSON
  const safeParseJSON = (item) => {
    try {
      return JSON.parse(item) || [];
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      return [];
    }
  };

  // Initialize localStorage for all keys if they don't exist
  const initializeLocalStorage = () => {
    ['water', 'energy', 'waste'].forEach((key) => {
      const formattedKey = `${key}Tips`;
      if (!localStorage.getItem(formattedKey)) {
        localStorage.setItem(formattedKey, JSON.stringify([]));
      }
      // Initialize 'latestTips' for user-side synchronization
      const latestFormattedKey = `latest${key.charAt(0).toUpperCase() + key.slice(1)}Tips`;
      if (!localStorage.getItem(latestFormattedKey)) {
        localStorage.setItem(latestFormattedKey, JSON.stringify([]));
      }
    });
  };

  // Load tips from localStorage
  const loadTips = (key) => {
    const formattedKey = `${key}Tips`;
    return safeParseJSON(localStorage.getItem(formattedKey));
  };

  // Save tips to localStorage and update 'latestTips'
  const saveTips = (key, tips) => {
    const formattedKey = `${key}Tips`;
    localStorage.setItem(formattedKey, JSON.stringify(tips));

    // Update 'latestTips' for user-side synchronization
    const latestFormattedKey = `latest${key.charAt(0).toUpperCase() + key.slice(1)}Tips`;
    localStorage.setItem(latestFormattedKey, JSON.stringify(tips));
    console.log(`Updated latestTips: ${latestFormattedKey}`);
  };

  // Update content version to notify users
  const updateContentVersion = () => {
    const newVersion = Date.now().toString();
    localStorage.setItem('contentVersion', newVersion);
    console.log(`Content version updated: ${newVersion}`);
  };

  // Render tips in a list
  const renderTips = (tips, listElement, key) => {
    listElement.innerHTML = '';
    const currentTips = pendingTips[key].length > 0 ? pendingTips[key] : loadTips(key);

    currentTips.forEach((tip, index) => {
      const li = document.createElement('li');
      li.className = tip.enabled ? 'enabled' : 'disabled';
      li.innerHTML = `
        <div>
          <h3>${tip.title}</h3>
          <p>${tip.description}</p>
        </div>
        <div class="tip-actions">
          <button class="edit-button">✏️ Edit</button>
          <button class="toggle-button">${tip.enabled ? 'Disable' : 'Enable'}</button>
        </div>
      `;

      li.querySelector('.toggle-button').addEventListener('click', () => {
        if (confirm(`Are you sure you want to ${tip.enabled ? 'disable' : 'enable'} this tip?`)) {
          currentTips[index].enabled = !currentTips[index].enabled;
          pendingTips[key] = [...currentTips];
          pendingChanges = true;
          saveChangesButton.disabled = false;
          renderTips(currentTips, listElement, key);
        }
      });

      li.querySelector('.edit-button').addEventListener('click', () => {
        openEditModal(key, index, tip.title, tip.description);
      });

      listElement.appendChild(li);
    });
  };

  // Add a new tip
  const addTip = (key, title, description) => {
    const newTip = { title, description, enabled: true };
    const existingTips = loadTips(key);
    pendingTips[key] = [...existingTips, newTip];
    pendingChanges = true;
    saveChangesButton.disabled = false;
    renderTips(pendingTips[key], document.getElementById(`${key}TipList`), key);
  };

  // Save all changes
  saveChangesButton.addEventListener('click', () => {
    Object.keys(pendingTips).forEach((key) => {
      if (pendingTips[key].length > 0) {
        saveTips(key, pendingTips[key]);
      }
    });

    updateContentVersion();

    pendingTips = { water: [], energy: [], waste: [] };
    pendingChanges = false;
    saveChangesButton.disabled = true;
    alert('Changes saved successfully!');
  });

  // Discard changes
  discardChangesButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to discard all changes?')) {
      pendingTips = { water: [], energy: [], waste: [] };
      renderTips(loadTips('water'), waterTipList, 'water');
      renderTips(loadTips('energy'), energyTipList, 'energy');
      renderTips(loadTips('waste'), wasteTipList, 'waste');
      pendingChanges = false;
      saveChangesButton.disabled = true;
    }
  });
  // Open Edit Modal
const openEditModal = (key, index, currentTitle, currentDescription) => {
  const modal = document.getElementById('editModal');
  const titleInput = document.getElementById('editTitle');
  const descriptionInput = document.getElementById('editDescription');
  const saveEditButton = document.getElementById('saveEdit');

  // Pre-fill the form with current tip details
  titleInput.value = currentTitle;
  descriptionInput.value = currentDescription;
  modal.style.display = 'block'; // Show the modal

  saveEditButton.onclick = () => {
    const updatedTitle = titleInput.value;
    const updatedDescription = descriptionInput.value;

    pendingTips[key] = loadTips(key); // Load existing tips into pendingTips
    pendingTips[key][index] = {
      ...pendingTips[key][index],
      title: updatedTitle,
      description: updatedDescription,
    }; // Update the specific tip
    pendingChanges = true; // Mark changes as pending
    saveChangesButton.disabled = false; // Enable "Save Changes" button

    renderTips(pendingTips[key], document.getElementById(`${key}TipList`), key); // Re-render tips
    modal.style.display = 'none'; // Hide the modal
  };
};


  // Initialize localStorage and render tips
  initializeLocalStorage();
  renderTips(loadTips('water'), waterTipList, 'water');
  renderTips(loadTips('energy'), energyTipList, 'energy');
  renderTips(loadTips('waste'), wasteTipList, 'waste');
});
