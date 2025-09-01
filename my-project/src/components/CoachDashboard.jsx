import { useCoachAuth } from "../components/CoachAuthContext";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaIdBadge, FaUsers, FaSignOutAlt, FaCopy, FaCheck, FaCalendar, FaChartLine, FaDumbbell, FaHeart, FaCrown } from "react-icons/fa";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const CoachDashboard = () => {
  const { coach, logout } = useCoachAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPlayer, setExpandedPlayer] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate("/coach/login");
  };

  const copyCoachCode = () => {
    navigator.clipboard.writeText(coach.coachCode);
    setCopied(true);
    toast.success("Coach code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePlayerDetails = (playerId) => {
    if (expandedPlayer === playerId) {
      setExpandedPlayer(null);
    } else {
      setExpandedPlayer(playerId);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Fetch players from backend
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/coach/players", {
          withCredentials: true,
        });
        setPlayers(res.data.players || []);
      } catch (error) {
        console.error("Error fetching players:", error);
        toast.error("Failed to load athletes");
      } finally {
        setLoading(false);
      }
    };

    if (coach) fetchPlayers();
  }, [coach]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 p-6 bg-white rounded-2xl shadow-lg">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Coach Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Manage your athletes and track progress</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md font-medium hover:opacity-90 transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white text-4xl mb-4">
                  <FaUser />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{coach?.name}</h2>
                <p className="text-gray-600">{coach?.email}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center p-3 bg-indigo-50 rounded-lg">
                  <FaIdBadge className="text-indigo-600 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Coach Code</p>
                    <div className="flex items-center justify-between">
                      <p className="font-mono font-semibold">{coach?.coachCode}</p>
                      <button
                        onClick={copyCoachCode}
                        className="text-indigo-600 hover:text-indigo-800 p-1 rounded"
                        title="Copy to clipboard"
                      >
                        {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-indigo-50 rounded-lg">
                  <FaUsers className="text-indigo-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Athletes</p>
                    <p className="font-semibold">{players.length} registered</p>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    Share your coach code with athletes so they can connect with you.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-2xl shadow-lg text-center">
                <p className="text-2xl font-bold text-indigo-600">{players.length}</p>
                <p className="text-gray-600">Total Athletes</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-lg text-center">
                <p className="text-2xl font-bold text-green-600">
                  {players.filter(p => p.subscription?.plan !== 'free').length}
                </p>
                <p className="text-gray-600">Premium Athletes</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-lg text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {players.filter(p => p.mlPrediction?.goal).length}
                </p>
                <p className="text-gray-600">Active Plans</p>
              </div>
            </div>

            {/* Athletes Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Athletes</h3>
                <span className="text-sm text-gray-500">
                  {players.length} registered
                </span>
              </div>
              
              {loading ? (
                <p className="text-center py-8 text-gray-500">Loading athletes...</p>
              ) : players.length > 0 ? (
                <div className="space-y-4">
                  {players.map((player) => (
                    <div key={player._id} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Player Summary */}
                      <div 
                        className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                        onClick={() => togglePlayerDetails(player._id)}
                      >
                        <div>
                          <h4 className="font-medium text-gray-900">{player.name}</h4>
                          <p className="text-sm text-gray-600">{player.email}</p>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-2 py-1 text-xs rounded-full mr-2 ${
                            player.subscription?.plan === 'free' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {player.subscription?.plan === 'free' ? 'Free' : 'Premium'}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            player.isVerified 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {player.isVerified ? 'Verified' : 'Not Verified'}
                          </span>
                          <svg 
                            className={`w-5 h-5 ml-2 transition-transform ${
                              expandedPlayer === player._id ? 'rotate-180' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      {/* Expanded Player Details */}
                      {expandedPlayer === player._id && (
                        <div className="p-4 bg-white border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Basic Info */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                                <FaUser className="mr-2 text-indigo-500" /> Basic Information
                              </h5>
                              <div className="space-y-2 text-sm">
                                <p><span className="font-medium">ID:</span> {player._id}</p>
                                <p><span className="font-medium">Transformation Goal:</span> {player.transformationGoal?.replace('_', ' ') || 'Not set'}</p>
                                <p><span className="font-medium">Last Active:</span> {formatDate(player.lastActive)}</p>
                                <p><span className="font-medium">Joined:</span> {formatDate(player.createdAt)}</p>
                              </div>
                            </div>

                            {/* Profile Info */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                                <FaHeart className="mr-2 text-red-500" /> Profile
                              </h5>
                              <div className="space-y-2 text-sm">
                                <p><span className="font-medium">Has Injuries:</span> {player.profile?.hasInjuries ? 'Yes' : 'No'}</p>
                                <p><span className="font-medium">Specific Goals:</span> {player.profile?.specificGoals?.join(', ') || 'None'}</p>
                                <p><span className="font-medium">Workout Duration:</span> {player.preferences?.workoutDuration} minutes</p>
                                <p><span className="font-medium">Allergies:</span> {player.preferences?.allergies?.join(', ') || 'None'}</p>
                              </div>
                            </div>

                            {/* ML Prediction */}
                            {player.mlPrediction && (
                              <>
                                <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                                  <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                                    <FaChartLine className="mr-2 text-green-500" /> AI Recommendations
                                  </h5>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <p className="font-medium">Goal:</p>
                                      <p className="text-sm capitalize">{player.mlPrediction.goal?.replace('_', ' ')}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Daily Calories:</p>
                                      <p className="text-sm">{Math.round(player.mlPrediction.calories)} kcal</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Sports Exercises:</p>
                                      <p className="text-sm">{player.mlPrediction.sportsExercise?.join(', ')}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Predicted On:</p>
                                      <p className="text-sm">{formatDate(player.mlPrediction.predictedAt)}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Workout Schedule */}
                                {player.mlPrediction.schedule && Object.keys(player.mlPrediction.schedule).length > 0 && (
                                  <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                                    <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                                      <FaCalendar className="mr-2 text-blue-500" /> Workout Schedule
                                    </h5>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                      {Object.entries(player.mlPrediction.schedule).map(([day, exercises]) => (
                                        <div key={day} className="bg-white p-3 rounded border">
                                          <h6 className="font-medium text-gray-900 mb-1">{day}</h6>
                                          <ul className="text-sm list-disc list-inside">
                                            {exercises.map((exercise, idx) => (
                                              <li key={idx}>{exercise}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaUsers className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No athletes yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Share your coach code with athletes to get started.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachDashboard;