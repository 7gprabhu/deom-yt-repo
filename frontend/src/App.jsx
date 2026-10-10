import { useEffect, useState } from 'react';

// Same-origin by default: the Vite dev proxy handles it locally,
// and vercel.json routes /api/* to the backend in production.
const API = '/api/todos';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await fetch(API);
      setTodos(await res.json());
    } catch {
      setError('Could not reach the API');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addTodo(e) {
    e.preventDefault();
    if (!title.trim()) return;
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Could not create todo');
      return;
    }
    setError('');
    setTitle('');
    setTodos([await res.json(), ...todos]);
  }

  async function toggle(todo) {
    const res = await fetch(`${API}/${todo._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed })
    });
    setTodos(todos.map((t) => (t._id === todo._id ? await res.json() : t)));
  }

  async function remove(id) {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    setTodos(todos.filter((t) => t._id !== id));
  }

  return (
    <main className="app">
      <h1>Todo</h1>

      <form onSubmit={addTodo}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading…</p>}

      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className={todo.completed ? 'done' : ''}>
            <label>
              <input type="checkbox" checked={todo.completed} onChange={() => toggle(todo)} />
              <span>{todo.title}</span>
            </label>
            <button className="delete" onClick={() => remove(todo._id)} aria-label="Delete">
              ✕
            </button>
          </li>
        ))}
      </ul>

      {!loading && todos.length === 0 && <p>Nothing yet — add your first todo.</p>}
    </main>
  );
}
