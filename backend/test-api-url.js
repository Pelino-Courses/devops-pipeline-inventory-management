console.log('Testing API URL resolution:');
console.log('window.ENV:', window.ENV);
console.log('window.ENV.API_URL:', window.ENV && window.ENV.API_URL);
console.log('process.env.REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

// Test what API_URL resolves to
const API_URL = (window.ENV && window.ENV.API_URL) || process.env.REACT_APP_API_URL || 'http://localhost:3000';
console.log('Final API_URL:', API_URL);

// Test a simple fetch
fetch(API_URL + '/health')
  .then(res => res.json())
  .then(data => console.log('Health check:', data))
  .catch(err => console.error('Health check failed:', err));
