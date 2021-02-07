const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser");

const todos = [
  { id: "asdasd", title: "Todo 1", completed: true },
  { id: "asdasdasd", title: "Todo 2", completed: true },
  { id: "asdasddfgdfd", title: "Todo 3", completed: false },
  { id: "asdasddfgdf", title: "Todo 4", completed: true },
];

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/todos', (req, res) => {
  res.json(todos)
})

app.listen(8080, () => {
  console.log(`Server start on http://localhost:8080`)
})