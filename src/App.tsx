import { createEffect, createEvent, createStore } from "effector";
import { useStore } from "effector-react";
import { FormEvent, useEffect } from "react";
import { v4 as uuid } from "uuid";
import Player from "./components/Player";
import useAudio from "./components/useAudio";

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
  // const todoInputValue = useStore($todoInputValue);
  // const todos = useStore($todos);
  // const completedTodos = useStore($completedTodos);

  // const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
  //   evt.preventDefault();
  //   createTodo({ id: uuid(), title: todoInputValue, completed: false });
  //   clearTodoInput();
  // };

  // useEffect(() => {
  //   getTodosFx();
  // }, []);

  const {
    isPlaying,
    ref,
    currentTime,
    duration,
    source,
    volume,
    changeSource,
    changeVolume,
    play,
    pause,
    seekTo,
  } = useAudio();

  return (
    <div>
      <div>
        <h1>Player</h1>
        <h2>Audio is {isPlaying ? "PLAY" : "PAUSED"}</h2>
        <h2>Source {source}</h2>

        <h2>
          Current time {currentTime} / {duration}
        </h2>
        <audio ref={ref} autoPlay />
        <button
          onClick={() =>
            changeSource(
              "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp31"
            )
          }
        >
          Set Track
        </button>
        <button
          onClick={() =>
            changeSource(
              "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_5MG.mp3"
            )
          }
        >
          Set NEW Track
        </button>
        <button onClick={() => play()}>PLAY</button>
        <button onClick={() => pause()}>PAUSE</button>
        <button
          onClick={() =>
            changeSource(
              "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_5MG.mp3"
            )
          }
        >
          CHANGE IMPERATIVE
        </button>
        <input
          type="range"
          min={0}
          max={duration}
          step={1}
          value={currentTime}
          onChange={(evt) => seekTo(+evt.target.value)}
        />
        <div>
          <span>Volume:</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={volume}
            onChange={(evt) => changeVolume(+evt.target.value)}
          />
        </div>

        {/* <div
        style={{
          width: "500px",
          height: "20px",
          backgroundColor: "gray",
          border: "1px solid black",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            height: "100%",
            backgroundColor: "red",
            width: `${Math.round((currentTime * 100) / duration)}%`,
          }}
        ></div>
      </div> */}
      </div>

      {/* <h1>Effector Sandbox</h1>

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
      <hr /> */}
    </div>
  );
}

export default App;
