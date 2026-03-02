"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  username: string;
  password: string;
  createdAt: number;
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

type View = "login" | "register" | "todos";

export default function Home() {
  const [view, setView] = useState<View>("login");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [mounted, setMounted] = useState(false);

  // 表单状态
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  // 初始化：检查是否已登录
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setView("todos");
        // 加载该用户的 todos
        const savedTodos = localStorage.getItem(`todos_${user.id}`);
        if (savedTodos) {
          setTodos(JSON.parse(savedTodos));
        }
      } catch (e) {
        console.error("Failed to parse user:", e);
      }
    }
    setMounted(true);
  }, []);

  // 保存 todos
  useEffect(() => {
    if (mounted && currentUser) {
      localStorage.setItem(`todos_${currentUser.id}`, JSON.stringify(todos));
    }
  }, [todos, currentUser, mounted]);

  // 获取所有用户
  const getUsers = (): User[] => {
    const saved = localStorage.getItem("users");
    return saved ? JSON.parse(saved) : [];
  };

  // 保存用户列表
  const saveUsers = (users: User[]) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  // 注册
  const handleRegister = () => {
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("用户名和密码不能为空");
      return;
    }
    if (password !== confirmPassword) {
      setError("两次密码不一致");
      return;
    }
    if (password.length < 4) {
      setError("密码至少4位");
      return;
    }

    const users = getUsers();
    if (users.find(u => u.username === username.trim())) {
      setError("用户名已存在");
      return;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      username: username.trim(),
      password: password,
      createdAt: Date.now(),
    };

    users.push(newUser);
    saveUsers(users);

    // 自动登录
    setCurrentUser(newUser);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    setTodos([]);
    setView("todos");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  // 登录
  const handleLogin = () => {
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("用户名和密码不能为空");
      return;
    }

    const users = getUsers();
    const user = users.find(u => u.username === username.trim() && u.password === password);

    if (!user) {
      setError("用户名或密码错误");
      return;
    }

    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));

    // 加载该用户的 todos
    const savedTodos = localStorage.getItem(`todos_${user.id}`);
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    } else {
      setTodos([]);
    }

    setView("todos");
    setUsername("");
    setPassword("");
  };

  // 退出登录
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setTodos([]);
    setView("login");
  };

  // Todo 操作
  const addTodo = () => {
    if (input.trim() === "") return;
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: input.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    setTodos([newTodo, ...todos]);
    setInput("");
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  if (!mounted) return null;

  // 登录/注册页面样式
  const inputStyle = {
    width: "100%",
    padding: "1rem 1.25rem",
    borderRadius: "0.75rem",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "white",
    outline: "none",
    fontSize: "1rem",
  };

  const buttonStyle = {
    width: "100%",
    padding: "1rem",
    borderRadius: "0.75rem",
    background: "#42b883",
    color: "white",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
  };

  const linkButtonStyle = {
    background: "none",
    border: "none",
    color: "#42b883",
    cursor: "pointer",
    fontSize: "0.875rem",
    padding: 0,
  };

  // 登录页面
  if (view === "login") {
    return (
      <main style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "24rem", padding: "2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "white", marginBottom: "0.5rem" }}>
              📝 Todo List
            </h1>
            <p style={{ color: "#94a3b8" }}>登录以管理你的任务</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
              type="text"
              placeholder="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={inputStyle}
            />

            {error && (
              <p style={{ color: "#ef4444", fontSize: "0.875rem", margin: 0 }}>{error}</p>
            )}

            <button onClick={handleLogin} style={buttonStyle}>
              登录
            </button>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <span style={{ color: "#94a3b8" }}>没有账号？</span>
              <button onClick={() => { setView("register"); setError(""); }} style={linkButtonStyle}>
                立即注册
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // 注册页面
  if (view === "register") {
    return (
      <main style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "24rem", padding: "2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "white", marginBottom: "0.5rem" }}>
              📝 创建账号
            </h1>
            <p style={{ color: "#94a3b8" }}>注册以开始使用</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
              type="text"
              placeholder="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="确认密码"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              style={inputStyle}
            />

            {error && (
              <p style={{ color: "#ef4444", fontSize: "0.875rem", margin: 0 }}>{error}</p>
            )}

            <button onClick={handleRegister} style={buttonStyle}>
              注册
            </button>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <span style={{ color: "#94a3b8" }}>已有账号？</span>
              <button onClick={() => { setView("login"); setError(""); }} style={linkButtonStyle}>
                立即登录
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Todo 列表页面
  return (
    <main style={{ minHeight: "100vh", background: "#0f172a" }}>
      <div style={{ maxWidth: "42rem", margin: "0 auto", padding: "3rem 1rem" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
          <div>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "white", marginBottom: "0.25rem" }}>
              📝 Todo List
            </h1>
            <p style={{ color: "#94a3b8", margin: 0 }}>
              欢迎，{currentUser?.username}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              background: "rgba(255,255,255,0.1)",
              color: "#94a3b8",
              border: "none",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            退出
          </button>
        </div>

        {/* 进度 */}
        <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
          {totalCount > 0
            ? `${completedCount} / ${totalCount} 已完成`
            : "添加你的第一个任务"}
        </p>

        {/* Input */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="输入新任务..."
            style={{
              flex: 1,
              padding: "1rem 1.25rem",
              borderRadius: "1rem",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              outline: "none",
            }}
          />
          <button
            onClick={addTodo}
            style={{
              padding: "1rem 1.5rem",
              borderRadius: "1rem",
              background: "#42b883",
              color: "white",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
            }}
          >
            添加
          </button>
        </div>

        {/* Stats Bar */}
        {todos.length > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", padding: "0 0.5rem" }}>
            <span style={{ fontSize: "0.875rem", color: "#94a3b8" }}>
              {todos.length} 个任务
            </span>
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                style={{ fontSize: "0.875rem", color: "#94a3b8", background: "none", border: "none", cursor: "pointer" }}
              >
                清除已完成
              </button>
            )}
          </div>
        )}

        {/* Todo List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {todos.map((todo) => (
            <div
              key={todo.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem",
                borderRadius: "1rem",
                background: todo.completed ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)",
                border: `1px solid ${todo.completed ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)"}`,
              }}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleTodo(todo.id)}
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                  borderRadius: "50%",
                  border: `2px solid ${todo.completed ? "#42b883" : "#94a3b8"}`,
                  background: todo.completed ? "#42b883" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                {todo.completed && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {/* Text */}
              <span style={{
                flex: 1,
                color: todo.completed ? "#64748b" : "white",
                textDecoration: todo.completed ? "line-through" : "none",
              }}>
                {todo.text}
              </span>

              {/* Delete Button */}
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{
                  padding: "0.5rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                  flexShrink: 0,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {todos.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✨</div>
            <p style={{ color: "#94a3b8" }}>暂无任务，开始添加吧！</p>
          </div>
        )}
      </div>
    </main>
  );
}
