"use client";

import { useEffect, useState } from "react";
import { API_BASE, GET_USERS } from "../../lib/config";

interface User {
  id: number;
  username: string;
  createdAt: string;
}

export default function LoginPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch(`${API_BASE}${GET_USERS}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
        setError("");
      })
      .catch((error) => {
        console.error(error);
        const errorMsg = error.message.includes("fetch")
          ? "Cannot connect to API. Please check if the server is running."
          : `API Error: ${error.message}`;
        setError(errorMsg);
        alert(errorMsg);
        setLoading(false);
      });
  }, []);

  function handleLogin() {
    if (selectedUser) {
      const user = users.find((u) => u.id.toString() === selectedUser);
      if (user) {
        localStorage.setItem("userId", user.id.toString());
        localStorage.setItem("username", user.username);
        window.location.href = "/properties";
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Select User
        </h1>
        
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <div className="text-red-600">
            <p className="mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full p-3 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <div>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choose a user --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
            
            <button
              onClick={handleLogin}
              disabled={!selectedUser}
              className="w-full mt-4 p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
