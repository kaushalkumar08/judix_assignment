import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('');
  const token = Cookies.get('token');

  useEffect(() => {
    if (!token) navigate('/');
    else { fetchUser(); fetchTasks(); }
  }, [token, navigate]);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/auth/profile', { headers: { 'x-auth-token': token } });
      setUser(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/tasks', { headers: { 'x-auth-token': token } });
      setTasks(res.data);
    } catch (err) { console.error(err); }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    try {
      const res = await axios.post('/api/tasks', newTask, { headers: { 'x-auth-token': token } });
      setTasks([res.data, ...tasks]);
      setNewTask({ title: '', description: '' });
    } catch (err) { alert('Error adding task'); }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`, { headers: { 'x-auth-token': token } });
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) { alert('Error deleting task'); }
  };

  const logout = () => { Cookies.remove('token'); navigate('/'); };

  const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-blue-600 tracking-tight">Judix<span className="text-gray-800">Tasks</span></h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 text-sm hidden sm:block">Hello, <b>{user?.username}</b></span>
              <button 
                onClick={logout} 
                className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Add Task Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Create New Task</h2>
          <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Task Title" 
              value={newTask.title} 
              onChange={(e) => setNewTask({...newTask, title: e.target.value})} 
              className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
              required 
            />
            <input 
              type="text" 
              placeholder="Description (Optional)" 
              value={newTask.description} 
              onChange={(e) => setNewTask({...newTask, description: e.target.value})} 
              className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
            />
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm hover:shadow-md"
            >
              Add Task
            </button>
          </form>
        </div>

        {/* Search & Filter */}
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-bold text-gray-800">Your Tasks</h2>
          <div className="w-full max-w-xs">
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="w-full p-2 pl-4 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Task Grid */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No tasks found. Start by adding one!</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map(task => (
              <div key={task._id} className="group bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between h-48">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800 text-lg truncate pr-2">{task.title}</h3>
                    <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider">
                      Active
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
                    {task.description || "No description provided."}
                  </p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => deleteTask(task._id)} 
                    className="text-sm text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}