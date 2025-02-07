document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
  
    if (response.ok) {
      alert('Registro exitoso');
      window.location.href = '/login.html'; // Redirigir al login
    } else {
      alert('Error en el registro');
    }
    
  });
  