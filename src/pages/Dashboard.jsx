import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      alert('Failed to log out: ' + error.message);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">Resume Critiquer</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {currentUser?.email}
              </span>
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm px-4 py-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to your Dashboard!
          </h2>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-2">
              ✅ You're logged in as:
            </p>
            <p className="text-lg font-semibold text-blue-600 mb-1">
              {currentUser?.email}
            </p>
            <p className="text-sm text-gray-500">
              User ID: {currentUser?.uid}
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 inline-block">
            🎉 Authentication with routing is working perfectly!
          </div>
          
          <p className="text-gray-500">
            Next: File upload and AI analysis...
          </p>
        </div>
      </div>
    </div>
  );
}