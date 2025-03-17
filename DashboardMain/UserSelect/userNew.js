document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('ecowarriorForm');
    const nameUser = document.getElementById('nameUser');
    const confirmCheckbox = document.getElementById('confirmEcowarrior');
    const ecowarriorID = document.getElementById('ecowarriorID');
    const generatedID = document.getElementById('generatedID');
    const loadingSpinner = document.getElementById('loadingSpinner');
   

    // Check if localStorage is available
    const isLocalStorageAvailable = () => {
        try {
            const testKey = 'test';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    };

    if (!isLocalStorageAvailable()) {
        showMessage('Your browser does not support localStorage. Please enable it to use this app.', 'error');
    }

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent form submission

        // Validate form inputs
        if (!nameUser.value.trim()) {
            showMessage('Please enter your name.', 'error');
            return;
        }

        if (!confirmCheckbox.checked) {
            showMessage('Please confirm your commitment to become an EcoWarrior.', 'error');
            return;
        }

        // Show loading spinner
        loadingSpinner.style.display = 'block';

        // Simulate form submission (e.g., API call)
        setTimeout(() => {
            // Generate a unique EcoWarrior ID
            const uniqueID = generateEcoWarriorID(nameUser.value.trim());

            // Display the ID
            generatedID.textContent = uniqueID;
            ecowarriorID.classList.remove('hidden');

            // Store the nameUser in localStorage
            localStorage.setItem('nameUser', nameUser.value.trim());

            // Store the ID in localStorage
            localStorage.setItem('ecowarriorID', uniqueID);

            // Show success message
            showMessage(`Thank you, ${nameUser.value.trim()}! You are now part of the EcoWarrior community.`, 'success');

            // Hide loading spinner
            loadingSpinner.style.display = 'none';
            
            // Redirect to the mainboard page after 3 seconds
            setTimeout(() => {
                window.location.href = 'UserContent/userMainboard.html';
            }, 3000);
           
        }, 2000); // Simulate a 2-second delay
    });  

    // Function to generate a unique EcoWarrior ID
    const generateEcoWarriorID = (name) => {
        const randomNum = Math.floor(Math.random() * 10000); // Random 4-digit number
        return `${name.replace(/\s+/g, '').toLowerCase()}-${randomNum}`;
    };

    // Function to show messages
    const showMessage = (message, type) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        form.prepend(messageDiv);

        // Remove the message after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 4000);
    };
});

