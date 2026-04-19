import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [appVersion, setAppVersion] = useState('');

  const fetchVersion = async () => {
    try {
      const res = await fetch('/api/version');
      const data = await res.json();
      setAppVersion(data.version);
    } catch (err) {
      console.log('Version fetch failed:', err);
    }
  };

  const fetchTodos = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/todos');
      if (!res.ok) throw new Error('Failed to fetch todos');
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchVersion();
      await fetchTodos();
    })();
  }, []);

  const addTodo = async () => {
    if (!input.trim()) return;

    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: input })
      });

      if (!res.ok) throw new Error('Failed to add todo');

      const newTodo = await res.json();
      setTodos(prev => [...prev, newTodo]);
      setInput('');
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`/api/todos/${id}`, { method: 'DELETE' });
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
      <div className="App">
        <div className="container">
          <h1>📝 My Todo App</h1>

          {appVersion && <p className="version">BE Version: {appVersion}</p>}

          {error && <div className="error">{error}</div>}

          <div className="input-group">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                placeholder="Add a new todo..."
            />
            <button onClick={addTodo}>Add</button>
          </div>

          {loading && <p>Loading...</p>}

          <ul className="todos">
            {todos.map(todo => (
                <li key={todo.id}>
                  <span>{todo.title}</span>
                  <button
                      className="delete-btn"
                      onClick={() => deleteTodo(todo.id)}
                  >
                    ✕
                  </button>
                </li>
            ))}
          </ul>

          {todos.length === 0 && !loading && (
              <p className="empty">No todos yet. Add one!</p>
          )}
        </div>
      </div>
  );
}

export default App;