import { createEvent, createStore } from "effector";
import { useStore } from "effector-react";
import { FormEvent, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

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

$todoInputValue
  .on(changeTodoInput, (_, payload) => {
    return payload;
  })
  .reset(clearTodoInput);

$todos
  .on(createTodo, (todos, todo) => {
    return [...todos, todo];
  })
  .on(removeTodo, (todos, id) => {
    const index = todos.findIndex((todo) => todo.id === id);
    if (index > -1) {
      todos.splice(index, 1);
      return [...todos];
    } else {
      return todos;
    }
  })
  .on(toggleTodo, (todos, id) =>
    todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  );

function App() {
  const todoInputValue = useStore($todoInputValue);
  const todos = useStore($todos);
  const completedTodos = useStore($completedTodos);
  const [audio] = useState(new Audio());
  const [audioSource, setAudioSource] = useState("/music.mp3");
  const [play, setIsPlay] = useState(false);
  const [playNext, setPlayNext] = useState(false);
  const [sourceChanged, setSourceIsChanged] = useState(false);

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    createTodo({ id: uuid(), title: todoInputValue, completed: false });
    clearTodoInput();
  };

  useEffect(() => {
    if (playNext) {
      setSourceIsChanged(true);
    }
    audio.setAttribute("src", audioSource);
  }, [audio, audioSource, playNext, setSourceIsChanged]);

  useEffect(() => {
    if (play) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [play, audio]);

  useEffect(() => {
    if (playNext && sourceChanged) {
      setIsPlay(true);
    }
  }, [playNext, sourceChanged]);

  return (
    <div>
      <h1>Effector Sandbox</h1>
      <h2>Current time</h2>
      <button onClick={() => setIsPlay(true)}>PLAY</button>
      <button onClick={() => setIsPlay(false)}>PAUSE</button>
      <button
        onClick={() => {
          setIsPlay(false);
          setAudioSource("/music2.mp3");
          setPlayNext(true);
        }}
      >
        NEXT
      </button>
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
    </div>
  );
}

export default App;
