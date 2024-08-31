import { useState } from "react";

export default function Todo(props) {
  const { todo, setTodos } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(todo.todo);

  const updateTodoStatus = async (todoId, todoStatus) => {
    const res = await fetch(`/api/todos/${todoId}`, {
      method: "PUT",
      body: JSON.stringify({ status: todoStatus }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();
    if (json.acknowledged) {
      setTodos((currentTodos) => {
        return currentTodos.map((currentTodo) => {
          if (currentTodo._id === todoId) {
            return { ...currentTodo, status: !currentTodo.status };
          }
          return currentTodo;
        });
      });
    }
  };

  const updateTodoContent = async (todoId) => {
    const res = await fetch(`/api/todos/${todoId}`, {
      method: "PUT",
      body: JSON.stringify({ todo: editedContent }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();
    if (json.acknowledged) {
      setTodos((currentTodos) => {
        return currentTodos.map((currentTodo) => {
          if (currentTodo._id === todoId) {
            return { ...currentTodo, todo: editedContent };
          }
          return currentTodo;
        });
      });
      setIsEditing(false);
    }
  };

  const deleteTodo = async (todoId) => {
    const res = await fetch(`/api/todos/${todoId}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (json.acknowledged) {
      setTodos((currentTodos) => {
        return currentTodos.filter((currentTodo) => currentTodo._id !== todoId);
      });
    }
  };

  return (
    <div className="todo">
      <div
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onClick={() => setIsEditing(true)}
        onInput={(e) => setEditedContent(e.target.textContent)}
        onBlur={() => {
          updateTodoContent(todo._id);
          setIsEditing(false);
        }}
        className={`todo__text ${isEditing ? "editing" : ""}`}
      >
        {todo.todo}
      </div>
      <div className="mutations">
        <button
          className="todo__status"
          onClick={() => updateTodoStatus(todo._id, todo.status)}
        >
          {todo.status ? "☑" : "☐"}
        </button>
        <button className="todo__delete" onClick={() => deleteTodo(todo._id)}>
          🗑️
        </button>
      </div>
    </div>
  );
}
