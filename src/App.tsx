import { createEffect, createEvent, createStore } from "effector";
import { useStore } from "effector-react";
import { FormEvent, useEffect } from "react";
import { v4 as uuid } from "uuid";
import Player from "./components/Player";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

// Stores
const $todos = createStore<Todo[]>([]);
const $todoInputValue = createStore("");
const $completedTodos = $todos.map((todos) =>
  todos.filter((todo) => todo.completed === true)
);

// Events
const changeTodoInput = createEvent<string>();
const clearTodoInput = createEvent();
const createTodo = createEvent<Todo>();
const removeTodo = createEvent<string>();
const toggleTodo = createEvent<string>();

// Effects
const getTodosFx = createEffect<void, Todo[], Error>(async () => {
  const res = await fetch("http://localhost:8080/todos");
  return res.json();
});

getTodosFx.doneData.watch((payload) => console.log(payload));
getTodosFx.failData.watch((payload) => console.log(payload));

$todoInputValue
  .on(changeTodoInput, (_, payload) => {
    return payload;
  })
  .reset(clearTodoInput);

$todos
  .on(createTodo, (todos, todo) => {
    return [...todos, todo];
  })
  .on(removeTodo, (todos, id) => todos.filter((todo) => todo.id !== id))
  .on(toggleTodo, (todos, id) =>
    todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  )
  .on(getTodosFx.doneData, (todos, newTodos) => {
    return [...todos, ...newTodos];
  });

function App() {
  const todoInputValue = useStore($todoInputValue);
  const todos = useStore($todos);
  const completedTodos = useStore($completedTodos);

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    createTodo({ id: uuid(), title: todoInputValue, completed: false });
    clearTodoInput();
  };

  useEffect(() => {
    getTodosFx();
  }, []);

  return (
    <div>
      <h1>Effector Sandbox</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(evt) => changeTodoInput(evt.target.value)}
          value={todoInputValue}
        />
        <button>Add todo</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li
            style={{
              color: todo.completed ? "green" : "red",
              padding: "0.5rem",
              border: "1px solid gray",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
            key={todo.id}
            onClick={() => toggleTodo(todo.id)}
          >
            <span>{todo.title}</span>
            <button
              style={{ backgroundColor: "red", color: "white" }}
              onClick={() => removeTodo(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <hr />
      {completedTodos.length > 0 && <h2>Completed</h2>}
      {completedTodos.map((todo) => (
        <p key={todo.id}>{todo.title}</p>
      ))}
      <hr />
      <Player />
    </div>
  );
}

export default App;
