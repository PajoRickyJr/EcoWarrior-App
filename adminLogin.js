/*/ Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhl63E8726pIofdFIFivXFktCZasdTShQ",
  authDomain: "ecowarrior-app.firebaseapp.com",
  projectId: "ecowarrior-app",
  storageBucket: "ecowarrior-app.firebasestorage.app",
  messagingSenderId: "18277438577",
  appId: "1:18277438577:web:76a10c2281f85f896db7d0",
  measurementId: "G-CTKKXW5F1Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// admin-auth.js
// Login.js
import { auth } from 'firebase_config.js';
import { signInWithEmailAndPassword } from 'firebase/auth';

function handleLogin(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Successful login
            const user = userCredential.user;
            console.log("User logged in:", user);
        })
        .catch((error) => {
            // Handle errors
            console.error("Login error:", error);
        });
}

// Get elements
const adminLoginForm = document.getElementById('admin-login-form');

// Login
if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('admin-login-email').value;
        const password = document.getElementById('admin-login-password').value;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log('Admin logged in:', userCredential.user);
                window.location.href = 'adminManage.html'; // Redirect to admin dashboard after login
            })
            .catch((error) => {
                console.error('Error logging in admin:', error);
                alert('error');
            });
    });
}
*/

document.getElementById('admin-login-form').addEventListener('submit', function (e) {
  e.preventDefault();  

  const email = document.getElementById('admin-login-email').value.trim();
  const password = document.getElementById('admin-login-password').value.trim();

  if (email == "rickypajojr@gmail.com" && password == "ricky"){
     alert('Login Successfully!')
     window.location.href = "AdminContent/adminManage.html";
  }

  else {
    alert('Login Failed');
  }
});
