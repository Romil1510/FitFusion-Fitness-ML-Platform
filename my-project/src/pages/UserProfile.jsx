import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaRulerVertical, FaWeight, FaVenusMars, FaBullseye, FaGraduationCap, FaCalendarAlt, FaRunning, FaFirstAid, FaSpinner, FaSave } from "react-icons/fa";

function UserProfile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  // User data state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // ML Form state
  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    gender: "male",
    goal: "muscle_gain",
    experience: "Intermediate",
    trainingFrequency: 3,
    sport: "",
    hasInjuries: false,
  });
  
  // Prediction state
  const [result, setResult] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Display state
  const [activeDay, setActiveDay] = useState("Monday");

  // FIXED: Initialize state from localStorage on mount
  const initializeFromStorage = () => {
    try {
      const storedData = localStorage.getItem('userFitnessPlan');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (parsed.mlPrediction) {
          // Pre-fill form data if available
          if (parsed.mlPrediction.formData) {
            setFormData(parsed.mlPrediction.formData);
          }
          
          // Set active day to first training day
          if (parsed.mlPrediction.schedule) {
            const firstTrainingDay = findFirstTrainingDay(parsed.mlPrediction.schedule);
            setActiveDay(firstTrainingDay);
          }
          
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return null;
  };

  // FIXED: Enhanced data fetching that merges all sources
  const fetchCompleteUserData = async () => {
    try {
      setRefreshing(true);
      
      // Get stored data first
      const storedData = initializeFromStorage();
      
      // Try to fetch from backend
      let backendData = null;
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", { withCredentials: true });
        backendData = res.data.user;
      } catch (backendError) {
        console.log("Backend fetch failed, using stored data only");
      }
      
      // Merge backend data with stored data (stored data takes precedence for ML predictions)
      let mergedData = backendData || { name: "User", email: "user@example.com" };
      
      if (storedData && storedData.mlPrediction) {
        // If we have newer stored ML data, use it
        const storedTimestamp = new Date(storedData.mlPrediction.generatedAt || 0);
        const backendTimestamp = new Date(backendData?.mlPrediction?.generatedAt || 0);
        
        if (storedTimestamp > backendTimestamp || !backendData?.mlPrediction) {
          mergedData = { ...mergedData, ...storedData };
          console.log('Using newer localStorage data');
        }
      }
      
      setUser(mergedData);
      
      // Update form data and active day if ML prediction exists
      if (mergedData.mlPrediction) {
        if (mergedData.mlPrediction.formData) {
          setFormData(mergedData.mlPrediction.formData);
        }
        if (mergedData.mlPrediction.schedule) {
          const firstTrainingDay = findFirstTrainingDay(mergedData.mlPrediction.schedule);
          setActiveDay(firstTrainingDay);
        }
      }
      
      return mergedData;
      
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      
      // Fallback to stored data only
      const storedData = initializeFromStorage();
      if (storedData) {
        setUser(storedData);
        return storedData;
      } else {
        navigate("/login");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // FIXED: Initialize on component mount
  useEffect(() => {
    fetchCompleteUserData();
  }, [navigate]);

  // Find first training day helper
  const findFirstTrainingDay = (schedule) => {
    if (!schedule) return "Monday";
    
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    for (const day of days) {
      const daySchedule = schedule[day];
      if (daySchedule && daySchedule.length > 0 && 
          !daySchedule.some(ex => ex.toLowerCase().includes('rest'))) {
        return day;
      }
    }
    return "Monday";
  };

  // FIXED: Enhanced refresh that shows latest data
  const handleRefresh = async () => {
    console.log('Refreshing data...');
    await fetchCompleteUserData();
  };

  // Logout handler
  const handleLogout = async () => {
    localStorage.removeItem('userFitnessPlan');
    await logout();
    navigate("/");
  };

  // Form change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "hasInjuries") {
      setFormData(prev => ({ ...prev, [name]: value === "Yes" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // ML Prediction submission
  const handleMLSubmit = async (e) => {
    e.preventDefault();
    setPredicting(true);
    setSaveSuccess(false);
    
    try {
      const apiData = {
        age: parseInt(formData.age),
        height: parseInt(formData.height),
        weight: parseInt(formData.weight),
        gender: formData.gender.toLowerCase(),
        sport: formData.sport || "general",
        hasInjuries: formData.hasInjuries,
        experience: formData.experience,
        trainingFrequency: parseInt(formData.trainingFrequency),
        goal: formData.goal
      };

      console.log('Sending to Flask API:', apiData);

      const res = await axios.post("http://127.0.0.1:5000/predictionModel", apiData);
      const prediction = res.data;
      
      console.log('Flask API Response:', prediction);
      
      // Process the response
      const processedResult = {
        calories: Array.isArray(prediction["according to your goal calories you should take"]) 
          ? prediction["according to your goal calories you should take"][0]
          : prediction["according to your goal calories you should take"],
        goal: Array.isArray(prediction.goal) ? prediction.goal[0] : prediction.goal,
        schedule: prediction.schedule_general_fitness || {},
        sportsExercise: prediction.special_sports_exercise || [],
        originalResponse: prediction,
        formData: formData,
        generatedAt: new Date().toISOString(),
        trainingFrequency: parseInt(formData.trainingFrequency)
      };
      
      setResult(processedResult);
      
      // Set active day to first training day
      const firstTrainingDay = findFirstTrainingDay(processedResult.schedule);
      setActiveDay(firstTrainingDay);
      
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Something went wrong. Please try again.");
    }
    setPredicting(false);
  };

  // FIXED: Enhanced save function that ensures persistence
  const saveToProfile = async () => {
    if (!result) {
      alert("Please generate a fitness plan first!");
      return;
    }

    setSaving(true);
    setSaveSuccess(false);

    try {
      const profileData = { 
        mlPrediction: {
          ...result,
          savedAt: new Date().toISOString() // Add save timestamp
        }
      };

      // CRITICAL: Save to localStorage first (immediate persistence)
      localStorage.setItem('userFitnessPlan', JSON.stringify(profileData));
      console.log('Saved to localStorage:', profileData);
      
      // Update local state immediately
      setUser(prev => ({ ...prev, ...profileData }));
      
      // Try backend save (optional, but recommended)
      try {
        const backendResponse = await axios.post(
          "http://localhost:5000/api/auth/update", 
          profileData, 
          { withCredentials: true }
        );
        console.log('Saved to backend successfully:', backendResponse.data);
      } catch (backendError) {
        console.log("Backend save failed, but localStorage save succeeded");
      }

      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);

    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save to profile. Please try again.");
    }
    setSaving(false);
  };

  // Helper functions
  const formatGoal = (goal) => {
    if (Array.isArray(goal)) return goal.join(", ");
    if (typeof goal === 'string') return goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return goal || "Not specified";
  };

  const getTrainingStats = () => {
    if (!user?.mlPrediction?.schedule) return { training: 0, rest: 7 };
    
    const trainingDays = Object.keys(user.mlPrediction.schedule).filter(day => {
      const daySchedule = user.mlPrediction.schedule[day];
      return daySchedule && daySchedule.length > 0 && 
             !daySchedule.some(ex => ex.toLowerCase().includes('rest'));
    });
    
    return {
      training: trainingDays.length,
      rest: 7 - trainingDays.length
    };
  };

  // Loading screen
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const userData = user || { name: "User", email: "user@example.com" };
  const trainingStats = getTrainingStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold mr-4">
                {userData.name?.charAt(0) || "U"}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{userData.name}</h1>
                <p className="text-gray-600">{userData.email}</p>
                {/* Show data freshness indicator */}
                {userData.mlPrediction?.savedAt && (
                  <p className="text-xs text-green-600">
                    Last saved: {new Date(userData.mlPrediction.savedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-4 rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-center disabled:opacity-50"
              >
                <svg 
                  className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {refreshing ? 'Refreshing...' : 'Refresh Data'}
              </button>
              
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-6 rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-center"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* ML PREDICTION FORM */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              AI Fitness Plan Generator
            </h2>
            <p className="text-gray-600">
              Get personalized workout and nutrition recommendations based on your profile
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <FaUser className="text-blue-500" />
                </div>
                Your Information
              </h3>

              <form onSubmit={handleMLSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Age */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        type="number" 
                        name="age" 
                        placeholder="Age" 
                        value={formData.age} 
                        onChange={handleChange} 
                        required 
                        className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        min="15"
                        max="100"
                      />
                    </div>
                  </div>

                  {/* Height */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                    <div className="relative">
                      <FaRulerVertical className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        type="number" 
                        name="height" 
                        placeholder="Height" 
                        value={formData.height} 
                        onChange={handleChange} 
                        required 
                        className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        min="100"
                        max="250"
                      />
                    </div>
                  </div>

                  {/* Weight */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                    <div className="relative">
                      <FaWeight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        type="number" 
                        name="weight" 
                        placeholder="Weight" 
                        value={formData.weight} 
                        onChange={handleChange} 
                        required 
                        className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        min="30"
                        max="200"
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <div className="relative">
                      <FaVenusMars className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleChange} 
                        className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>

                  {/* Goal */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fitness Goal</label>
                    <div className="relative">
                      <FaBullseye className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select 
                        name="goal" 
                        value={formData.goal} 
                        onChange={handleChange} 
                        className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                      >
                        <option value="muscle_gain">Muscle Gain</option>
                        <option value="fat_loss_program">Fat Loss</option>
                        <option value="athlete_performance">Athlete Performance</option>
                      </select>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                    <div className="relative">
                      <FaGraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select 
                        name="experience" 
                        value={formData.experience} 
                        onChange={handleChange} 
                        className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  {/* Training Frequency */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Training Days/Week
                      <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {formData.trainingFrequency} {formData.trainingFrequency === 1 ? 'day' : 'days'}
                      </span>
                    </label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        type="number" 
                        name="trainingFrequency" 
                        placeholder="Training Days" 
                        value={formData.trainingFrequency} 
                        onChange={handleChange} 
                        className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        min="2"
                        max="7"
                      />
                    </div>
                  </div>

                  {/* Sport */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Sport</label>
                    <div className="relative">
                      <FaRunning className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        name="sport" 
                        placeholder="Sport (e.g., football)" 
                        value={formData.sport} 
                        onChange={handleChange} 
                        className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  {/* Injuries */}
                  <div className="relative md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Any Injuries?</label>
                    <div className="relative">
                      <FaFirstAid className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select 
                        name="hasInjuries" 
                        value={formData.hasInjuries ? "Yes" : "No"} 
                        onChange={handleChange} 
                        className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={predicting}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-md transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center disabled:opacity-75 disabled:transform-none"
                >
                  {predicting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Generating Your Plan...
                    </>
                  ) : (
                    "Generate Fitness Plan"
                  )}
                </button>
              </form>
            </div>

            {/* Prediction Result Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Latest Prediction
              </h3>

              {result ? (
                <div className="space-y-6">
                  {/* Success Banner */}
                  {saveSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-green-800 font-medium">Successfully saved to profile!</span>
                      </div>
                    </div>
                  )}

                  {/* Save Button */}
                  <button
                    onClick={saveToProfile}
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-medium shadow-md transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center disabled:opacity-75"
                  >
                    {saving ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2" />
                        Save to Profile
                      </>
                    )}
                  </button>

                  {/* Results Display */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <p className="text-sm text-blue-600 font-medium">Goal</p>
                      <p className="font-semibold text-gray-800 capitalize">{formatGoal(result.goal)}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl">
                      <p className="text-sm text-orange-600 font-medium">Daily Calories</p>
                      <p className="font-semibold text-gray-800">{Math.round(result.calories)} kcal</p>
                    </div>
                  </div>

                  {/* Training Schedule Info */}
                  <div className="bg-indigo-50 p-4 rounded-xl">
                    <p className="text-sm text-indigo-600 font-medium">Training Schedule</p>
                    <p className="font-semibold text-gray-800">
                      {Object.keys(result.schedule).length} training days per week
                    </p>
                    <p className="text-xs text-indigo-700 mt-1">
                      Days: {Object.keys(result.schedule).join(', ')}
                    </p>
                  </div>

                  {/* Special Exercises */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Special Sports Exercises</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.sportsExercise?.map((exercise, index) => (
                        <span key={index} className="bg-green-100 text-green-800 text-xs px-3 py-1.5 rounded-full">
                          {exercise}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>Generate a fitness plan to see results</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PROFILE INFORMATION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Account Info Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-blue-100 mr-3">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Account Info</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Role</span>
                <span className="font-medium">{userData.role || "User"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Training Days</span>
                <span className="font-medium text-indigo-600">
                  {trainingStats.training} days/week
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Experience</span>
                <span className="font-medium text-blue-600">
                  {userData.mlPrediction?.formData?.experience || "Not set"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Goal</span>
                <span className="font-medium">{formatGoal(userData.mlPrediction?.goal) || "Not set"}</span>
              </div>
            </div>
          </div>

          {/* Health Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-red-100 mr-3">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Health Profile</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Injuries</span>
                <span className={`font-medium ${
                  userData.mlPrediction?.formData?.hasInjuries ? 'text-red-600' : 'text-green-600'
                }`}>
                  {userData.mlPrediction?.formData?.hasInjuries ? "Yes" : "No"}
                </span>
              </div>

              {/* Physical Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-green-50 p-2 rounded-lg text-center">
                  <p className="text-xs text-green-600">Age</p>
                  <p className="font-semibold text-sm">{userData.mlPrediction?.formData?.age || 'N/A'}</p>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg text-center">
                  <p className="text-xs text-blue-600">Weight</p>
                  <p className="font-semibold text-sm">{userData.mlPrediction?.formData?.weight || 'N/A'}kg</p>
                </div>
                <div className="bg-purple-50 p-2 rounded-lg text-center">
                  <p className="text-xs text-purple-600">Height</p>
                  <p className="font-semibold text-sm">{userData.mlPrediction?.formData?.height || 'N/A'}cm</p>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Gender</span>
                <span className="font-medium capitalize">
                  {userData.mlPrediction?.formData?.gender || "Not set"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sport</span>
                <span className="font-medium capitalize">
                  {userData.mlPrediction?.formData?.sport || "General"}
                </span>
              </div>
            </div>
          </div>

          {/* ML Predictions Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-purple-100 mr-3">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">ML Predictions</h2>
            </div>
            {userData.mlPrediction ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-600">Goal</p>
                    <p className="font-semibold text-sm">{formatGoal(userData.mlPrediction.goal)}</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-sm text-orange-600">Calories</p>
                    <p className="font-semibold">{Math.round(userData.mlPrediction.calories)} kcal</p>
                  </div>
                </div>

                {userData.mlPrediction.savedAt && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Last Saved</p>
                    <p className="font-semibold text-sm">
                      {new Date(userData.mlPrediction.savedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-gray-600 mb-2">Special Exercises</p>
                  <div className="flex flex-wrap gap-2">
                    {userData.mlPrediction.sportsExercise?.length > 0 ? (
                      userData.mlPrediction.sportsExercise.map((exercise, index) => (
                        <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          {exercise}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">No exercises saved</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <svg className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>No saved predictions</p>
                <p className="text-xs mt-1">Generate a plan above</p>
              </div>
            )}
          </div>
        </div>

        {/* WEEKLY SCHEDULE */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-indigo-100 mr-3">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Weekly Schedule</h2>
            </div>
            
            {userData.mlPrediction?.schedule && (
              <div className="flex gap-4 text-sm">
                <div className="bg-green-100 px-3 py-1 rounded-full">
                  <span className="text-green-700 font-medium">{trainingStats.training} Training</span>
                </div>
                <div className="bg-gray-100 px-3 py-1 rounded-full">
                  <span className="text-gray-700 font-medium">{trainingStats.rest} Rest</span>
                </div>
              </div>
            )}
          </div>
          
          {userData.mlPrediction?.schedule ? (
            <>
              {/* Debug Info */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Schedule Days:</strong> {Object.keys(userData.mlPrediction.schedule).length} days - {Object.keys(userData.mlPrediction.schedule).join(', ')}
                </p>
              </div>

              {/* Day Selector */}
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.keys(userData.mlPrediction.schedule).map(day => {
                  const daySchedule = userData.mlPrediction.schedule[day] || [];
                  const isTrainingDay = daySchedule.length > 0;
                  
                  return (
                    <button
                      key={day}
                      onClick={() => setActiveDay(day)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors relative ${
                        activeDay === day 
                          ? 'bg-indigo-600 text-white' 
                          : isTrainingDay
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day.substring(0, 3)}
                      {isTrainingDay && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
                      )}
                    </button>
                  );
                })}
              </div>
              
              {/* Schedule for Selected Day */}
              <div className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-gray-50 to-white">
                <h3 className="font-bold text-xl text-center text-indigo-700 mb-5">{activeDay}</h3>
                
                {userData.mlPrediction.schedule[activeDay] && userData.mlPrediction.schedule[activeDay].length > 0 ? (
                  <div className="space-y-4">
                    {userData.mlPrediction.schedule[activeDay].map((exercise, index) => (
                      <div key={index} className="flex items-start p-3 bg-white rounded-lg shadow-sm border border-green-200">
                        <div className="flex-shrink-0 w-20 py-1 px-2 bg-indigo-100 text-indigo-700 rounded text-xs font-medium text-center mr-4">
                          #{index + 1}
                        </div>
                        <div className="flex-grow">
                          <p className="text-gray-800 font-medium">{exercise}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
                    </svg>
                    <p>No exercises scheduled for {activeDay}</p>
                  </div>
                )}
              </div>
              
              {/* Week Overview */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-700 mb-3">Week Overview</h4>
                <div className="grid gap-2" style={{gridTemplateColumns: `repeat(${Object.keys(userData.mlPrediction.schedule).length}, 1fr)`}}>
                  {Object.keys(userData.mlPrediction.schedule).map(day => {
                    const daySchedule = userData.mlPrediction.schedule[day] || [];
                    const exerciseCount = daySchedule.length;
                    const isTrainingDay = exerciseCount > 0;
                    
                    return (
                      <div 
                        key={day} 
                        className={`p-2 rounded-lg text-center cursor-pointer transition-colors ${
                          activeDay === day 
                            ? 'bg-indigo-100 text-indigo-700 font-medium' 
                            : isTrainingDay
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        onClick={() => setActiveDay(day)}
                      >
                        <div className="text-xs">{day.substring(0, 3)}</div>
                        <div className={`text-lg font-bold ${
                          isTrainingDay ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          {exerciseCount || '0'}
                        </div>
                        <div className="text-xs">
                          {isTrainingDay ? 'exercises' : 'rest'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 715.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No schedule available</p>
              <p className="text-sm mt-2">Generate a fitness plan above to see your weekly schedule</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default UserProfile;
