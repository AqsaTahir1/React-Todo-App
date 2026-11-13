
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // Load saved tasks
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })

  const [task, setTask] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [filter, setFilter] = useState('All')

  // Save tasks in Local Storage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  // Add task
  const addTask = () => {
    if (task.trim() === '') return

    const newTask = {
      id: Date.now(),
      text: task.trim(),
      completed: false
    }

    setTasks([...tasks, newTask])
    setTask('')
  }

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter(item => item.id !== id))
  }

  // Complete task
  const completeTask = (id) => {
    setTasks(tasks.map(item =>
      item.id === id
        ? { ...item, completed: !item.completed }
        : item
    ))
  }

  // Start editing
  const startEditing = (item) => {
    setEditingId(item.id)
    setEditText(item.text)
  }

  // Save edited task
  const saveEdit = (id) => {
    if (editText.trim() === '') return

    setTasks(tasks.map(item =>
      item.id === id
        ? { ...item, text: editText.trim() }
        : item
    ))

    setEditingId(null)
    setEditText('')
  }

  // Filter tasks
  const filteredTasks = tasks.filter(item => {
    if (filter === 'Pending') return !item.completed
    if (filter === 'Completed') return item.completed
    return true
  })

  // Task counter
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(item => item.completed).length
  const pendingTasks = totalTasks - completedTasks

  // Press Enter to add task
  const handleAddKey = (e) => {
    if (e.key === 'Enter') addTask()
  }

  // Press Enter to save edited task
  const handleEditKey = (e, id) => {
    if (e.key === 'Enter') saveEdit(id)
  }

  return (
    <div className="container">

      <div className="header">
        <h1>My To-Do List</h1>
        <p>Organize your day, one task at a time!</p>
      </div>

      {/* Task Counter */}
      <div className="stats">
        <div className="stat-box">
          <h2>{totalTasks}</h2>
          <p>Total Tasks</p>
        </div>

        <div className="stat-box">
          <h2>{pendingTasks}</h2>
          <p>Pending</p>
        </div>

        <div className="stat-box">
          <h2>{completedTasks}</h2>
          <p>Completed</p>
        </div>
      </div>

      {/* Add Task */}
      <div className="input-area">
        <input
          type="text"
          placeholder="Enter your task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={handleAddKey}
        />

        <button className="add-btn" onClick={addTask}>
          + Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        {['All', 'Pending', 'Completed'].map(option => (
          <button
            key={option}
            className={filter === option ? 'active-filter' : ''}
            onClick={() => setFilter(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="task-list">

        {filteredTasks.length === 0 ? (
          <p className="empty-message">
            {tasks.length === 0
              ? 'No tasks yet. Add your first task!'
              : 'No tasks found in this category.'}
          </p>
        ) : (

          filteredTasks.map(item => (
            <div className="task" key={item.id}>

              {editingId === item.id ? (

                <div className="edit-area">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => handleEditKey(e, item.id)}
                    autoFocus
                  />

                  <button
                    className="save-btn"
                    onClick={() => saveEdit(item.id)}
                  >
                    Save
                  </button>

                  <button
                    className="cancel-btn"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </div>

              ) : (

                <>
                  <div className="task-content">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => completeTask(item.id)}
                    />

                    <span className={item.completed ? 'completed' : ''}>
                      {item.text}
                    </span>
                  </div>

                  <div className="task-actions">
                    <button
                      className="edit-btn"
                      onClick={() => startEditing(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>

              )}

            </div>
          ))

        )}

      </div>

    </div>
  )
}

export default App
