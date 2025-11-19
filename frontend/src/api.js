const API = "http://localhost:4000";

export async function getItems() {
  return fetch(`${API}/items`).then(res => res.json());
}

export async function getItem(id) {
  return fetch(`${API}/items/${id}`).then(res => res.json());
}

export async function createItem(data) {
  return fetch(`${API}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

export async function updateItem(id, data) {
  return fetch(`${API}/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

export async function deleteItem(id) {
  return fetch(`${API}/items/${id}`, { method: "DELETE" });
}
