import { useCoachAuth } from "../components/CoachAuthContext";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaIdBadge, FaUsers, FaSignOutAlt, FaCopy, FaCheck, FaCalendar, FaChartLine, FaDumbbell, FaHeart, FaCrown, FaWeight, FaRulerVertical, FaBullseye, FaSync } from "react-icons/fa";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const CoachDashboard = () => {
  const { coach, logout } = useCoachAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedPlayer, setExpandedPlayer] = useState(null);
  const [activePlayerDay, setActivePlayerDay] = useState("Monday");

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
      setActivePlayerDay("Monday");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format goal text
  const formatGoal = (goal) => {
    if (Array.isArray(goal)) return goal.join(", ");
    if (typeof goal === 'string') return goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return goal || "Not specified";
  };

  // Get training stats
  const getTrainingStats = (schedule) => {
    if (!schedule) return { training: 0, rest: 7 };
    
    const trainingDays = Object.keys(schedule).filter(day => {
      const daySchedule = schedule[day];
      return daySchedule && daySchedule.length > 0 && 
             !daySchedule.some(ex => ex.toLowerCase().includes('rest'));
    });
    
    return {
      training: trainingDays.length,
      rest: 7 - trainingDays.length,
      trainingDays: trainingDays
    };
  };

  // Fetch players with complete profile data
  const fetchPlayersWithProfiles = async () => {
    try {
      setRefreshing(true);
      
      // First, get the list of players
      const playersRes = await axios.get("http://localhost:5000/api/coach/players", {
        withCredentials: true,
      });
      
      const playersList = playersRes.data.players || [];
      
      // Then, fetch detailed profile data for each player
      const playersWithProfiles = await Promise.all(
        playersList.map(async (player) => {
          try {
            // Fetch individual player profile data
            const profileRes = await axios.get(`http://localhost:5000/api/coach/player/${player._id}/profile`, {
              withCredentials: true,
            });
            
            // Merge player data with profile data
            return {
              ...player,
              ...profileRes.data,
              profileFetched: true
            };
          } catch (error) {
            console.error(`Failed to fetch profile for player ${player._id}:`, error);
            // Return player with existing data if profile fetch fails
            return {
              ...player,
              profileFetched: false
            };
          }
        })
      );
      
      setPlayers(playersWithProfiles);
      
    } catch (error) {
      console.error("Error fetching players:", error);
      toast.error("Failed to load athletes");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh player data
  const handleRefreshPlayers = async () => {
    await fetchPlayersWithProfiles();
    toast.success("Player data refreshed!");
  };

  // Fetch players on component mount
  useEffect(() => {
    if (coach) {
      fetchPlayersWithProfiles();
    }
  }, [coach]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 p-6 bg-white rounded-2xl shadow-lg">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Coach Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Manage your athletes and track their fitness progress</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={handleRefreshPlayers}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              <FaSync className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md font-medium hover:opacity-90 transition"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
          <div className="lg:col-span-3">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
              <div className="bg-white p-4 rounded-2xl shadow-lg text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {players.filter(p => p.mlPrediction?.schedule).length}
                </p>
                <p className="text-gray-600">With Schedules</p>
              </div>
            </div>

            {/* Athletes Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Athletes</h3>
                <span className="text-sm text-gray-500">
                  {players.length} registered
                </span>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading athletes...</p>
                </div>
              ) : players.length > 0 ? (
                <div className="space-y-4">
                  {players.map((player) => {
                    const trainingStats = getTrainingStats(player.mlPrediction?.schedule);
                    
                    return (
                      <div key={player._id} className="border border-gray-200 rounded-lg overflow-hidden">
                        {/* Player Summary */}
                        <div 
                          className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => togglePlayerDetails(player._id)}
                        >
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold mr-4">
                              {player.name?.charAt(0) || "U"}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{player.name}</h4>
                              <p className="text-sm text-gray-600">{player.email}</p>
                              {player.mlPrediction?.goal && (
                                <p className="text-xs text-indigo-600 capitalize">
                                  Goal: {formatGoal(player.mlPrediction.goal)}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center">
                            {player.mlPrediction?.schedule && (
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 mr-2">
                                {trainingStats.training} training days
                              </span>
                            )}
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
                          <div className="p-6 bg-white border-t border-gray-200">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              
                              {/* Basic Info */}
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                                  <FaUser className="mr-2 text-indigo-500" /> Basic Information
                                </h5>
                                <div className="space-y-2 text-sm">
                                  <p><span className="font-medium">ID:</span> {player._id}</p>
                                  <p><span className="font-medium">Transformation Goal:</span> {formatGoal(player.transformationGoal) || 'Not set'}</p>
                                  <p><span className="font-medium">Last Active:</span> {formatDate(player.lastActive)}</p>
                                  <p><span className="font-medium">Joined:</span> {formatDate(player.createdAt)}</p>
                                  <p><span className="font-medium">Profile Status:</span> 
                                    <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                                      player.profileFetched ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {player.profileFetched ? 'Complete' : 'Basic'}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              {/* Health Profile */}
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                                  <FaHeart className="mr-2 text-red-500" /> Health Profile
                                </h5>
                                <div className="space-y-2 text-sm">
                                  <p><span className="font-medium">Has Injuries:</span> 
                                    <span className={`ml-1 ${
                                      player.mlPrediction?.formData?.hasInjuries || player.profile?.hasInjuries 
                                        ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                      {player.mlPrediction?.formData?.hasInjuries || player.profile?.hasInjuries ? 'Yes' : 'No'}
                                    </span>
                                  </p>
                                  
                                  {/* Physical Stats */}
                                  <div className="grid grid-cols-3 gap-2 mt-3">
                                    <div className="bg-white p-2 rounded text-center">
                                      <p className="text-xs text-green-600">Age</p>
                                      <p className="font-semibold">{player.mlPrediction?.formData?.age || 'N/A'}</p>
                                    </div>
                                    <div className="bg-white p-2 rounded text-center">
                                      <p className="text-xs text-blue-600">Weight</p>
                                      <p className="font-semibold">{player.mlPrediction?.formData?.weight || 'N/A'}kg</p>
                                    </div>
                                    <div className="bg-white p-2 rounded text-center">
                                      <p className="text-xs text-purple-600">Height</p>
                                      <p className="font-semibold">{player.mlPrediction?.formData?.height || 'N/A'}cm</p>
                                    </div>
                                  </div>
                                  
                                  <p><span className="font-medium">Gender:</span> 
                                    <span className="ml-1 capitalize">{player.mlPrediction?.formData?.gender || 'Not specified'}</span>
                                  </p>
                                  <p><span className="font-medium">Sport:</span> 
                                    <span className="ml-1 capitalize">{player.mlPrediction?.formData?.sport || 'General fitness'}</span>
                                  </p>
                                  <p><span className="font-medium">Experience:</span> 
                                    <span className="ml-1">{player.mlPrediction?.formData?.experience || 'Not specified'}</span>
                                  </p>
                                </div>
                              </div>

                              {/* ML Prediction */}
                              {player.mlPrediction && (
                                <div className="bg-gray-50 p-4 rounded-lg lg:col-span-2">
                                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                                    <FaChartLine className="mr-2 text-green-500" /> AI Fitness Recommendations
                                  </h5>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-blue-50 p-3 rounded">
                                      <p className="font-medium text-blue-700">Goal</p>
                                      <p className="text-sm capitalize">{formatGoal(player.mlPrediction.goal)}</p>
                                    </div>
                                    <div className="bg-orange-50 p-3 rounded">
                                      <p className="font-medium text-orange-700">Daily Calories</p>
                                      <p className="text-sm">{Math.round(player.mlPrediction.calories)} kcal</p>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded">
                                      <p className="font-medium text-green-700">Training Days</p>
                                      <p className="text-sm">{player.mlPrediction.trainingFrequency || trainingStats.training} days/week</p>
                                    </div>
                                  </div>
                                  
                                  {player.mlPrediction.sportsExercise && player.mlPrediction.sportsExercise.length > 0 && (
                                    <div className="mt-4">
                                      <p className="font-medium text-gray-700 mb-2">Special Sports Exercises</p>
                                      <div className="flex flex-wrap gap-2">
                                        {player.mlPrediction.sportsExercise.map((exercise, idx) => (
                                          <span key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                            {exercise}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {player.mlPrediction.generatedAt && (
                                    <div className="mt-4 text-xs text-gray-500">
                                      <p>Plan generated: {formatDate(player.mlPrediction.generatedAt)}</p>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Weekly Schedule */}
                              {player.mlPrediction?.schedule && Object.keys(player.mlPrediction.schedule).length > 0 && (
                                <div className="bg-gray-50 p-4 rounded-lg lg:col-span-2">
                                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                                    <FaCalendar className="mr-2 text-blue-500" /> Weekly Training Schedule
                                  </h5>
                                  
                                  {/* Day Selector */}
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {Object.keys(player.mlPrediction.schedule).map(day => {
                                      const daySchedule = player.mlPrediction.schedule[day] || [];
                                      const isTrainingDay = daySchedule.length > 0 && !daySchedule.some(ex => ex.toLowerCase().includes('rest'));
                                      
                                      return (
                                        <button
                                          key={day}
                                          onClick={() => setActivePlayerDay(day)}
                                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                            activePlayerDay === day 
                                              ? 'bg-indigo-600 text-white' 
                                              : isTrainingDay
                                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                          }`}
                                        >
                                          {day.substring(0, 3)}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  
                                  {/* Selected Day Schedule */}
                                  <div className="bg-white p-4 rounded border">
                                    <h6 className="font-medium text-gray-900 mb-2">{activePlayerDay}</h6>
                                    {player.mlPrediction.schedule[activePlayerDay]?.length > 0 ? (
                                      <ul className="space-y-2">
                                        {player.mlPrediction.schedule[activePlayerDay].map((exercise, idx) => (
                                          <li key={idx} className="flex items-start">
                                            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5">
                                              {idx + 1}
                                            </span>
                                            <span className="text-sm text-gray-700">{exercise}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-sm text-gray-500 italic">No exercises scheduled for {activePlayerDay}</p>
                                    )}
                                  </div>
                                  
                                  {/* Training Summary */}
                                  <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                                    <div className="bg-green-100 p-2 rounded">
                                      <p className="text-sm font-medium text-green-800">{trainingStats.training} Training Days</p>
                                    </div>
                                    <div className="bg-gray-100 p-2 rounded">
                                      <p className="text-sm font-medium text-gray-800">{trainingStats.rest} Rest Days</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
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
