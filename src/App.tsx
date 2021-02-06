import { createEvent, createStore } from "effector";
import { useStore } from "effector-react";
import { FormEvent, useEffect, useRef, useState } from "react";
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
  .on(removeTodo, (todos, id) => todos.filter((todo) => todo.id !== id))
  .on(toggleTodo, (todos, id) =>
    todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  );

function App() {
  const todoInputValue = useStore($todoInputValue);
  const todos = useStore($todos);
  const completedTodos = useStore($completedTodos);
  const [audioSource, setAudioSource] = useState("/music.mp3");
  const [audio] = useState(new Audio(audioSource));
  const [audioIsPlaying, setAudioIsPlaying] = useState(false);
  const [audioSourceIsChanged, setAudioSourceIsChanged] = useState(false);
  const prevAudioSource = useRef(audioSource);

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    createTodo({ id: uuid(), title: todoInputValue, completed: false });
    clearTodoInput();
  };

  useEffect(() => {
    audio.addEventListener("ended", () => setAudioIsPlaying(false));
    return () =>
      audio.removeEventListener("ended", () => setAudioIsPlaying(false));
  }, [audio]);

  useEffect(() => {
    if (audioIsPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [audioIsPlaying, audio]);

  useEffect(() => {
    if (audioSourceIsChanged) {
      setAudioIsPlaying(true);
      setAudioSourceIsChanged(false);
    }
  }, [audioSourceIsChanged]);

  useEffect(() => {
    if (audioSource !== prevAudioSource.current) {
      setAudioIsPlaying(false);
      audio.setAttribute("src", audioSource);
      setAudioSourceIsChanged(true);
    }
  }, [audio, audioSource]);

  const handleAudioPlay = () => {
    setAudioIsPlaying(true);
  };

  const handleAudioPaused = () => {
    setAudioIsPlaying(false);
  };

  const handlePlayNext = () => {
    prevAudioSource.current = audioSource;
    setAudioSource("/music2.mp3");
  };

  const handlePlayPrev = () => {
    let prev = audioSource;
    setAudioSource(prevAudioSource.current);
    prevAudioSource.current = prev;
  };

  return (
    <div>
      <h1>Effector Sandbox</h1>

      <h2>Audio is {audioIsPlaying ? "PLAY" : "PAUSED"}</h2>

      <h2>Current time</h2>
      <button onClick={handlePlayPrev}>PREV</button>
      <button onClick={handleAudioPlay}>PLAY</button>
      <button onClick={handleAudioPaused}>PAUSE</button>
      <button onClick={handlePlayNext}>NEXT</button>
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
