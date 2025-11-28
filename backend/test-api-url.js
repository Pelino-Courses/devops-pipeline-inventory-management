const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('Testing API URL resolution:');

const configPath = path.join(__dirname, '..', 'frontend', 'public', 'config.js');
let runtimeConfig;

if (fs.existsSync(configPath)) {
  try {
    const code = fs.readFileSync(configPath, 'utf8');
    const sandbox = { window: {} };
    vm.runInNewContext(code, sandbox);
    runtimeConfig = sandbox.window.ENV;
    console.log('config.js API_URL:', runtimeConfig && runtimeConfig.API_URL);
  } catch (err) {
    console.error('Failed to load runtime config:', err.message);
  }
} else {
  console.warn('config.js not found at', configPath);
}

console.log('process.env.API_URL:', process.env.API_URL);
console.log('process.env.REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

const API_URL = (runtimeConfig && runtimeConfig.API_URL)
  || process.env.API_URL
  || process.env.REACT_APP_API_URL
  || 'http://localhost:3000';

console.log('Final API_URL:', API_URL);

async function runHealthCheck() {
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    console.log('Health check:', data);
  } catch (err) {
    console.error('Health check failed:', err.message);
  }
}

runHealthCheck();
