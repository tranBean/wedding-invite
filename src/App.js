import React, { useEffect, useState } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editing, setEditing] = useState(null); // 记录正在编辑的 id

  const fetchItems = async () => {
    const res = await fetch("http://localhost:8000/api.php");
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async () => {
    await fetch("http://localhost:8000/api.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", description: "" });
    fetchItems();
  };

  const deleteItem = async (id) => {
    await fetch(`http://localhost:8000/api.php?id=${id}`, { method: "DELETE" });
    fetchItems();
  };

  const startEdit = (item) => {
    setEditing(item.id);
    setForm({ name: item.name, description: item.description });
  };

  const updateItem = async () => {
    await fetch(`http://localhost:8000/api.php?id=${editing}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", description: "" });
    setEditing(null);
    fetchItems();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Items</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <b>{item.name}</b>: {item.description}
            <button onClick={() => deleteItem(item.id)}>Delete</button>
            <button onClick={() => startEdit(item)}>Edit</button>
          </li>
        ))}
      </ul>

      <h3>{editing ? "Edit Item" : "Add New Item"}</h3>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      {editing ? (
        <button onClick={updateItem}>Update</button>
      ) : (
        <button onClick={addItem}>Add</button>
      )}
    </div>
  );
}

export default App;
