document.getElementById('userBox').addEventListener('click', function () {
    // For prototyping: store the selected role and navigate
    localStorage.setItem('role', 'user');
    window.location.href = 'UserSelect/userNew.html';
  });
  
  document.getElementById('adminBox').addEventListener('click', function () {
    localStorage.setItem('role', 'admin');
    window.location.href = 'AdminSelect/adminLogin.html';
  });
  