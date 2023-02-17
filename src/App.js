import {Component} from 'react'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      todos: [],
      newTodo: '',
      newTodoStatus: 'Pending',
    }
  }

  componentDidMount() {
    this.fetchTodos()
  }

  fetchTodos = async () => {
    try {
      const response = await fetch(
        'https://todo-application-brainly.onrender.com/todos',
      )
      const data = await response.json()
      this.setState({todos: data})
    } catch (error) {
      console.log(error)
    }
  }

  handleNewTodoChange = event => {
    this.setState({newTodo: event.target.value})
  }

  handleNewTodoStatusChange = event => {
    this.setState({newTodoStatus: event.target.value})
  }

  handleAddTodo = async () => {
    const {newTodo, newTodoStatus} = this.state
    if (newTodo.trim() === '') {
      return
    }
    try {
      const response = await fetch(
        'https://todo-application-brainly.onrender.com/todos',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            todo: newTodo,
            status: newTodoStatus === 'Completed' ? true : 'Pending',
          }),
        },
      )
      if (response.ok) {
        this.fetchTodos()
        this.setState({newTodo: '', newTodoStatus: 'Pending'})
      } else {
        console.log('Error adding todo')
      }
    } catch (error) {
      console.log(error)
    }
  }

  handleStatusChange = async (event, todoId) => {
    const {checked} = event.target
    const newStatus = checked ? 'Completed' : 'Pending'

    try {
      const response = await fetch(
        `https://todo-application-brainly.onrender.com/todos/${todoId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({status: newStatus}),
        },
      )
      if (response.ok) {
        this.fetchTodos()
      } else {
        console.log('Error changing todo status')
      }
    } catch (error) {
      console.log(error)
    }
  }

  handleDeleteTodo = async todoId => {
    try {
      const response = await fetch(
        `https://todo-application-brainly.onrender.com/todos/${todoId}`,
        {
          method: 'DELETE',
        },
      )
      if (response.ok) {
        this.fetchTodos()
      } else {
        console.log('Error deleting todo')
      }
    } catch (error) {
      console.log(error)
    }
  }

  handleEditTodo = async (event, todoId) => {
    const {value} = event.target
    try {
      const response = await fetch(
        `https://todo-application-brainly.onrender.com/todos/${todoId}/update_todo`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({todo: value}),
        },
      )
      if (response.ok) {
        this.fetchTodos()
      } else {
        console.log('Error updating todo')
      }
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const {todos, newTodo} = this.state
    console.log(todos)
    return (
      <div className="main-container">
        <h1 className="heading">Todo App</h1>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter a new todo"
            value={newTodo}
            onChange={this.handleNewTodoChange}
            className="input-bar"
          />

          <button
            className="add-button"
            type="button"
            onClick={this.handleAddTodo}
          >
            Add
          </button>
        </div>
        <ul className="todos-list-container">
          {todos.map(todo => (
            <li key={todo.id} className="todo-item">
              <input
                type="checkbox"
                checked={todo.status === 'Completed'}
                onChange={event => this.handleStatusChange(event, todo.id)}
                className="checkbox"
              />

              <p
                className={
                  todo.status === 'Completed'
                    ? 'status completed'
                    : 'status pending'
                }
              >
                {todo.status}
              </p>
              <input
                type="text"
                value={todo.todo}
                onChange={event => this.handleEditTodo(event, todo.id)}
                className="todos-input-edit"
              />
              <button
                type="button"
                onClick={() => this.handleDeleteTodo(todo.id)}
                className="delete-button"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default App
