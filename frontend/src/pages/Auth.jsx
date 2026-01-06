import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (Cookies.get('token')) navigate('/dashboard');
  }, [navigate]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(url, formData);
      Cookies.set('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        
        {/* Header Section */}
        <h2 className="text-3xl font-bold mb-3 text-center text-gray-800">
          {isLogin ? 'Welcome Back' : 'Join Us'}
        </h2>
        <p className="text-center text-gray-500 mb-10">
          {isLogin ? 'Sign in to your account' : 'Create your account now'}
        </p>

        {/* Main Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input 
                type="text" name="username" placeholder="johndoe" onChange={onChange} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" 
                required 
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" name="email" placeholder="you@example.com" onChange={onChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              type="password" name="password" placeholder="••••••••" onChange={onChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold p-3 rounded-lg hover:bg-blue-700 transition shadow-lg"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle Section with MORE SPACE (mt-8, pt-6) */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <br className="sm:hidden" /> {/* Line break on small screens for spacing */}
            <span className="inline-block w-2"></span> {/* Horizontal spacer */}
            <button 
              className="text-blue-600 font-bold hover:underline mt-2 sm:mt-0" 
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Create an account' : 'Log in here'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}