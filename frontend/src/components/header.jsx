import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Header() {
  return (
    <header>
      <h1>Welcome to Invictus!</h1>
    </header>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);

  // GET Request (Read)
  useEffect(() => {
    axios.get('/api/tasks/')
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));
  }, []);

  // POST Request (Create - secure via CSRF automatically)
  const addTask = (title) => {
    axios.post('/api/tasks/', { title, description: '', completed: false })
      .then(res => setTasks([...tasks, res.data]));
  };

  return (
    <div>
      {tasks.map(task => <p key={task.id}>{task.title}</p>)}
    </div>
  );
}