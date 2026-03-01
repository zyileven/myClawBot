"use client";

import { useState, useEffect } from "react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [mounted, setMounted] = useState(false);

  // 从 localStorage 加载
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      try {
        setTodos(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse todos:", e);
      }
    }
    setMounted(true);
  }, []);

  // 保存到 localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos, mounted]);

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

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)" }}>
      <div style={{ maxWidth: "42rem", margin: "0 auto", padding: "3rem 1rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "white", marginBottom: "0.5rem" }}>
            📝 Todo List
          </h1>
          <p style={{ color: "#94a3b8" }}>
            {totalCount > 0
              ? `${completedCount} / ${totalCount} 已完成`
              : "添加你的第一个任务"}
          </p>
        </div>

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
              background: "#9333ea",
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
                  border: `2px solid ${todo.completed ? "#22c55e" : "#94a3b8"}`,
                  background: todo.completed ? "#22c55e" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
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
