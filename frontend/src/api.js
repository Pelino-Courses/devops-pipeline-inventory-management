// Use runtime configuration from config.js or fallback to environment variable
const API_URL = (window.ENV && window.ENV.API_URL) || process.env.REACT_APP_API_URL || "http://localhost:3000";

// Get all items
export async function getItems() {
  return fetch(`${API_URL}/items`).then(res => res.json());
}

// Get single item
export async function getItem(id) {
  return fetch(`${API_URL}/items/${id}`).then(res => res.json());
}

// Create item
export async function createItem(data) {
  return fetch(`${API_URL}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

// Update item
export async function updateItem(id, data) {
  return fetch(`${API_URL}/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

// Delete item
export async function deleteItem(id) {
  return fetch(`${API_URL}/items/${id}`, { method: "DELETE" });
}
