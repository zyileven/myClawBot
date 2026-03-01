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
    setMounted(true);
    const saved = localStorage.getItem("todos");
    if (saved) {
      setTodos(JSON.parse(saved));
    }
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

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">📝 Todo List</h1>
          <p className="text-slate-400">
            {totalCount > 0
              ? `${completedCount} / ${totalCount} 已完成`
              : "添加你的第一个任务"}
          </p>
        </div>

        {/* Input */}
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="输入新任务..."
            className="flex-1 px-5 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          <button
            onClick={addTodo}
            className="px-6 py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/30"
          >
            添加
          </button>
        </div>

        {/* Stats Bar */}
        {todos.length > 0 && (
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-sm text-slate-400">
              {todos.length} 个任务
            </span>
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="text-sm text-slate-400 hover:text-red-400 transition-colors"
              >
                清除已完成
              </button>
            )}
          </div>
        )}

        {/* Todo List */}
        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`group flex items-center gap-4 p-4 rounded-2xl backdrop-blur-sm border transition-all ${
                todo.completed
                  ? "bg-white/5 border-white/10"
                  : "bg-white/10 border-white/20 hover:bg-white/15"
              }`}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  todo.completed
                    ? "bg-green-500 border-green-500"
                    : "border-slate-400 hover:border-purple-400"
                }`}
              >
                {todo.completed && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>

              {/* Text */}
              <span
                className={`flex-1 transition-all ${
                  todo.completed
                    ? "text-slate-500 line-through"
                    : "text-white"
                }`}
              >
                {todo.text}
              </span>

              {/* Delete Button */}
              <button
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {todos.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">✨</div>
            <p className="text-slate-400">暂无任务，开始添加吧！</p>
          </div>
        )}
      </div>
    </main>
  );
}
