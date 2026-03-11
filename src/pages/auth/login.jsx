import { useState } from "react";
import { loginToMatrix } from "../../utils/login.util";
 import { useAuthenticate } from "../../store/authentication.store";
import { Navigate, useNavigate } from "react-router-dom";

export function Login() {
  const navigaet=useNavigate()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
const authenticate = useAuthenticate((state)=>state.authenticate)
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const errorMessage = await loginToMatrix(username, password);

    if (errorMessage === null) {
    
      await authenticate(username);
      {
        console.log("authenticated")
      }
      navigaet("/")
    } else {
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f7f6",
        fontFamily: "Inter",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2.5rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ color: "#000000", margin: "0 0 0.5rem 0" }}>
            NURSE ASSISTANT
          </h1>
          <p style={{ color: "#666", margin: 0 }}>Secure Ward Authentication</p>
        </div>

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Matrix ID
            </label>
            <input
              type="text"
              placeholder="@username:matrix.org"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.8rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.8rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <div
              style={{
                padding: "0.8rem",
                backgroundColor: "#ffeeba",
                color: "#856404",
                borderRadius: "6px",
                fontSize: "0.9rem",
                borderLeft: "4px solid #ffc107",
              }}
            >
              ⚠️{error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: loading ? "#2F2F2F" : "#000000",
              opacity: loading ? "0.6" : 1,
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Authenticating..." : "Enter Ward"}
          </button>
        </form>
      </div>
    </div>
  );
}
