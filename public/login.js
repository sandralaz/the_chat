document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  console.log('Datos enviados:', { username, password }); // Verifica lo que se está enviando

  const response = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  console.log('Respuesta del servidor:', response); // Verifica lo que devuelve el servidor

  if (response.ok) {
      alert('Inicio de sesión exitoso');
      window.location.href = '/chat.html'; // Redirigir al chat
  } else {
      alert('Error en el inicio de sesión');
  }
});

