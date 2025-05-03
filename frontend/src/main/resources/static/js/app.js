console.log("Hello from app.js!");

// Можно добавить простой fetch для проверки API позже
fetch('/api/hello')
  .then(response => response.json())
  .then(data => console.log('API response:', data))
  .catch(error => console.error('API error:', error));