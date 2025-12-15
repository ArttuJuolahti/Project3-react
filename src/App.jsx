import { useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useApi } from './hooks/useApi';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const API = import.meta.env.VITE_API_URL;

// ======================
// Login form
// ======================
function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isRegister ? '/api/register' : '/api/login';

    try {
      const res = await axios.post(`${API}${endpoint}`, { email, password });

      if (!isRegister) {
        // Login: save token
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
      } else {
        // Register: switch to login mode
        setIsRegister(false);
        alert('Registration successful! Please log in.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <div className="card shadow">
        <div className="card-body">
          <h2 className="text-center mb-4">
            {isRegister ? 'Register' : 'Login'}
          </h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                className="form-control"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <input
                className="form-control"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-primary w-100" type="submit">
              {isRegister ? 'Sign up' : 'Sign in'}
            </button>
          </form>

          <button
            className="btn btn-link w-100 mt-2"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================
// Dashboard = Snippet Knowledge Base
// ======================
function Dashboard({ handleLogout }) {
  // Ladataan snippetit Project 2 backendistä
  const {
    data: snippets,
    loading,
    error,
    create,
    remove,
  } = useApi('/api/snippets'); // token ei pakollinen snippeteille

  // Lomakkeen tilat
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');

  // Filtterit
  const [search, setSearch] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');

  const handleAddSnippet = async (e) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    await create({
      title,
      language,
      code,
      description,
    });

    setTitle('');
    setCode('');
    setDescription('');
  };

  const handleCopy = (snippet) => {
    navigator.clipboard.writeText(snippet.code);
  };

  // Apply filters
  const filteredSnippets = snippets.filter((snippet) => {
    const matchesLang =
      languageFilter === 'all' || snippet.language === languageFilter;
    const text =
      (snippet.title || '') +
      ' ' +
      (snippet.description || '');
    const matchesSearch = text
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesLang && matchesSearch;
  });

  return (
    <div>
      {/* Top navbar */}
      <nav className="navbar navbar-dark bg-dark px-3 mb-4">
        <span className="navbar-brand">Developer Knowledge Base</span>
        <button
          className="btn btn-outline-light btn-sm"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>

      <div className="container">
        <div className="row">
          {/* LEFT: Add new snippet + preview */}
          <div className="col-md-4 mb-4">
            <div className="card p-3">
              <h4 className="mb-3">Add New Snippet</h4>
              <form onSubmit={handleAddSnippet}>
                <div className="mb-2">
                  <input
                    className="form-control"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="mb-2">
                  <select
                    className="form-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="css">CSS</option>
                    <option value="html">HTML</option>
                    <option value="bash">Bash</option>
                  </select>
                </div>

                <div className="mb-2">
                  <textarea
                    className="form-control"
                    rows={6}
                    placeholder="Paste your code here..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>

                <div className="mb-2">
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <button
                  className="btn btn-primary w-100"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Snippet'}
                </button>
              </form>

              {/* Live preview */}
              {code && (
                <>
                  <hr />
                  <h5>Preview</h5>
                  <SyntaxHighlighter
                    language={language}
                    style={oneDark}
                    wrapLongLines
                  >
                    {code}
                  </SyntaxHighlighter>
                </>
              )}
            </div>
          </div>

          {/* RIGHT: Filter + list of snippets */}
          <div className="col-md-8 mb-8">
            <div className="d-flex flex-wrap gap-2 mb-3">
              <select
                className="form-select"
                style={{ maxWidth: '200px' }}
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
              >
                <option value="all">All languages</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="css">CSS</option>
                <option value="html">HTML</option>
                <option value="bash">Bash</option>
              </select>

              <input
                className="form-control"
                placeholder="Search by title or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {loading && (
              <div className="alert alert-info">Loading snippets...</div>
            )}
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            {!loading && filteredSnippets.length === 0 && (
              <div className="alert alert-secondary">
                No snippets found.
              </div>
            )}

            <div className="list-group">
              {filteredSnippets.map((snippet) => (
                <div
                  key={snippet._id}
                  className="list-group-item mb-3"
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="mb-1">{snippet.title}</h5>
                      <span className="badge bg-secondary me-2">
                        {snippet.language}
                      </span>
                      {snippet.description && (
                        <small className="text-muted d-block">
                          {snippet.description}
                        </small>
                      )}
                    </div>
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => handleCopy(snippet)}
                      >
                        Copy
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => remove(snippet._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <SyntaxHighlighter
                    language={snippet.language || 'javascript'}
                    style={oneDark}
                    wrapLongLines
                    customStyle={{ borderRadius: '8px' }}
                  >
                    {snippet.code}
                  </SyntaxHighlighter>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ======================
// Router + auth wrapper
// ======================
function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  // Vite täyttää tämän arvoksi base-konfigin, esim. "/Project3-react/"
  const basename = import.meta.env.BASE_URL || '/';

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        {/* Public route: login */}
        <Route
          path="/login"
          element={
            token ? <Navigate to="/" /> : <Login setToken={setToken} />
          }
        />

        {/* Protected route: dashboard (root) */}
        <Route
          path="/"
          element={
            !token ? (
              <Navigate to="/login" />
            ) : (
              <Dashboard handleLogout={handleLogout} />
            )
          }
        />

        {/* Catch-all: ohjaa aina oikeaan paikkaan */}
        <Route
          path="*"
          element={
            <Navigate to={token ? "/" : "/login"} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;