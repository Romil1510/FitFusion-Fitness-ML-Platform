import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import { useDataSync } from "../components/DataSyncContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser, FaRulerVertical, FaWeight, FaVenusMars, FaBullseye, FaGraduationCap, FaCalendarAlt, FaRunning, FaFirstAid, FaSpinner, FaSave } from "react-icons/fa";

function UserProfile() {
  const { user, logout, isLoggedIn } = useAuth();
  const { triggerRefresh } = useDataSync();
  const navigate = useNavigate();
  
  // User data state
  const [userData, setUserData] = useState(null);
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

  // Helper functions to get display data
  const getDisplaySchedule = () => {
    return result?.schedule || userData?.mlPrediction?.schedule || null;
  };

  const getCurrentPredictionData = () => {
    return result || userData?.mlPrediction || null;
  };

  // Initialize state from localStorage
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

  // Enhanced data fetching that merges all sources
  const fetchCompleteUserData = async () => {
    try {
      setRefreshing(true);
      
      // Get stored data first
      const storedData = initializeFromStorage();
      
      // Try to fetch from backend
      let backendData = null;
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", { 
          withCredentials: true,
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        backendData = res.data.user;
      } catch (backendError) {
        console.log("Backend fetch failed, using stored data only");
      }
      
      // Merge backend data with stored data (stored data takes precedence for ML predictions)
      let mergedData = backendData || user || { name: "User", email: "user@example.com" };
      
      if (storedData && storedData.mlPrediction) {
        const storedTimestamp = new Date(storedData.mlPrediction.generatedAt || 0);
        const backendTimestamp = new Date(backendData?.mlPrediction?.generatedAt || 0);
        
        if (storedTimestamp > backendTimestamp || !backendData?.mlPrediction) {
          mergedData = { ...mergedData, ...storedData };
          console.log('Using newer localStorage data');
        }
      }
      
      setUserData(mergedData);
      
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
        setUserData(storedData);
        return storedData;
      } else if (!isLoggedIn) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initialize on component mount
  useEffect(() => {
    if (isLoggedIn) {
      fetchCompleteUserData();
    } else {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // Find first training day helper
  const findFirstTrainingDay = (schedule) => {
    if (!schedule) return "Monday";
    
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    for (const day of days) {
      const daySchedule = schedule[day];
      if (daySchedule && Array.isArray(daySchedule) && daySchedule.length > 0) {
        // Check if it's not just rest exercises
        const hasActualExercises = daySchedule.some(exercise => 
          exercise && 
          typeof exercise === 'string' && 
          !exercise.toLowerCase().includes('rest') &&
          exercise.trim() !== ''
        );
        if (hasActualExercises) {
          return day;
        }
      }
    }
    return "Monday";
  };

  // Enhanced refresh that shows latest data
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

  // ML Prediction submission with immediate schedule display
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
      console.log('Raw schedule data:', prediction.schedule_general_fitness);

      // Better schedule processing
      let scheduleData = {};
      
      // Try different possible schedule keys from the API response
      if (prediction.schedule_general_fitness) {
        scheduleData = prediction.schedule_general_fitness;
      } else if (prediction.schedule) {
        scheduleData = prediction.schedule;
      } else if (prediction['weekly_schedule']) {
        scheduleData = prediction['weekly_schedule'];
      }

      console.log('Processed schedule data:', scheduleData);
      
      // Ensure schedule has proper structure
      if (!scheduleData || typeof scheduleData !== 'object') {
        console.warn('No valid schedule data found');
        scheduleData = {};
      }

      // Process the response
      const processedResult = {
        calories: Array.isArray(prediction["according to your goal calories you should take"]) 
          ? prediction["according to your goal calories you should take"][0]
          : prediction["according to your goal calories you should take"],
        goal: Array.isArray(prediction.goal) ? prediction.goal[0] : prediction.goal,
        schedule: scheduleData,
        sportsExercise: prediction.special_sports_exercise || [],
        originalResponse: prediction,
        formData: formData,
        generatedAt: new Date().toISOString(),
        trainingFrequency: parseInt(formData.trainingFrequency)
      };
      
      console.log('Final processed result:', processedResult);
      
      setResult(processedResult);
      
      // Immediately update the active day to show the first training day
      if (processedResult.schedule && Object.keys(processedResult.schedule).length > 0) {
        const firstTrainingDay = findFirstTrainingDay(processedResult.schedule);
        setActiveDay(firstTrainingDay);
        console.log('Set active day to:', firstTrainingDay);
      }
      
    } catch (error) {
      console.error("Prediction error:", error);
      toast.error("Something went wrong. Please try again.");
    }
    setPredicting(false);
  };

  // Enhanced save function that ensures persistence
  const saveToProfile = async () => {
    if (!result) {
      toast.error("Please generate a fitness plan first!");
      return;
    }

    setSaving(true);
    setSaveSuccess(false);

    try {
      const profileData = { 
        mlPrediction: {
          ...result,
          savedAt: new Date().toISOString()
        }
      };

      // Save to localStorage first (immediate persistence)
      localStorage.setItem('userFitnessPlan', JSON.stringify(profileData));
      console.log('Saved to localStorage:', profileData);
      
      // Update local state immediately
      setUserData(prev => ({ ...prev, ...profileData }));
      
      // Try backend save
      try {
        const backendResponse = await axios.post(
          "http://localhost:5000/api/auth/update", 
          profileData, 
          { 
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }
        );
        
        if (backendResponse.status === 200) {
          console.log('Saved to backend successfully:', backendResponse.data);
          
          // Notify CoachDashboard to refresh data
          triggerRefresh('coachDashboard', {
            userId: user?._id,
            action: 'profileUpdate',
            timestamp: new Date().toISOString()
          });

          // Emit window event for cross-tab sync
          window.dispatchEvent(new CustomEvent('userDataUpdated', {
            detail: {
              userId: user?._id,
              timestamp: new Date().toISOString()
            }
          }));
          
          toast.success("Fitness plan saved successfully!");
        }
      } catch (backendError) {
        console.log("Backend save failed, but localStorage save succeeded");
        toast.warning("Plan saved locally. Backend sync may take a moment.");
      }

      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);

    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save to profile. Please try again.");
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
    const schedule = getDisplaySchedule();
    if (!schedule) return { training: 0, rest: 7 };
    
    const trainingDays = Object.keys(schedule).filter(day => {
      const daySchedule = schedule[day];
      return daySchedule && Array.isArray(daySchedule) && daySchedule.length > 0 && 
             daySchedule.some(exercise => 
               exercise && 
               typeof exercise === 'string' && 
               !exercise.toLowerCase().includes('rest') &&
               exercise.trim() !== ''
             );
    });
    
    return {
      training: trainingDays.length,
      rest: 7 - trainingDays.length
    };
  };

  // Function to check if a day is a training day
  const isTrainingDay = (daySchedule) => {
    if (!Array.isArray(daySchedule) || daySchedule.length === 0) return false;
    
    return daySchedule.some(exercise => 
      exercise && 
      typeof exercise === 'string' && 
      !exercise.toLowerCase().includes('rest') &&
      exercise.trim() !== ''
    );
  };

  // Loading screen
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const currentUser = userData || user || { name: "User", email: "user@example.com" };
  const trainingStats = getTrainingStats();
  const currentPrediction = getCurrentPredictionData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-20 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold mr-4">
                {currentUser.name?.charAt(0) || "U"}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{currentUser.name}</h1>
                <p className="text-gray-600">{currentUser.email}</p>
                {currentUser.mlPrediction?.savedAt && (
                  <p className="text-xs text-green-600">
                    Last saved: {new Date(currentUser.mlPrediction.savedAt).toLocaleString()}
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
                      {trainingStats.training} training days, {trainingStats.rest} rest days per week
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

        {/* WEEKLY SCHEDULE - COMPLETELY FIXED */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-indigo-100 mr-3">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Weekly Schedule</h2>
              {result && !currentUser?.mlPrediction && (
                <span className="ml-3 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  Unsaved Plan
                </span>
              )}
            </div>
            
            {getDisplaySchedule() && (
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
          
          {getDisplaySchedule() ? (
            <>
              {/* Day Selector */}
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.keys(getDisplaySchedule()).map(day => {
                  const daySchedule = getDisplaySchedule()[day] || [];
                  const dayIsTraining = isTrainingDay(daySchedule);
                  
                  return (
                    <button
                      key={day}
                      onClick={() => setActiveDay(day)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors relative ${
                        activeDay === day 
                          ? 'bg-indigo-600 text-white' 
                          : dayIsTraining
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day.substring(0, 3)}
                      {dayIsTraining && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
                      )}
                    </button>
                  );
                })}
              </div>
              
              {/* Schedule for Selected Day */}
              <div className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-gray-50 to-white">
                <h3 className="font-bold text-xl text-center text-indigo-700 mb-5">{activeDay}</h3>
                
                {getDisplaySchedule()[activeDay] && Array.isArray(getDisplaySchedule()[activeDay]) && getDisplaySchedule()[activeDay].length > 0 ? (
                  <div className="space-y-4">
                    {getDisplaySchedule()[activeDay].map((exercise, index) => {
                      // Handle empty or rest exercises
                      if (!exercise || exercise.trim() === '' || exercise.toLowerCase().includes('rest')) {
                        return (
                          <div key={index} className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="text-gray-600 font-medium flex items-center">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 718.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                              </svg>
                              Rest Day
                            </div>
                          </div>
                        );
                      }
                      
                      return (
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
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 718.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <p>Rest Day - No exercises scheduled for {activeDay}</p>
                  </div>
                )}
              </div>
              
              {/* Week Overview */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-700 mb-3">Week Overview</h4>
                <div className="grid gap-2" style={{gridTemplateColumns: `repeat(${Object.keys(getDisplaySchedule()).length}, 1fr)`}}>
                  {Object.keys(getDisplaySchedule()).map(day => {
                    const daySchedule = getDisplaySchedule()[day] || [];
                    const exerciseCount = Array.isArray(daySchedule) ? daySchedule.filter(ex => 
                      ex && 
                      typeof ex === 'string' && 
                      ex.trim() !== '' && 
                      !ex.toLowerCase().includes('rest')
                    ).length : 0;
                    const dayIsTraining = exerciseCount > 0;
                    
                    return (
                      <div 
                        key={day} 
                        className={`p-2 rounded-lg text-center cursor-pointer transition-colors ${
                          activeDay === day 
                            ? 'bg-indigo-100 text-indigo-700 font-medium' 
                            : dayIsTraining
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        onClick={() => setActiveDay(day)}
                      >
                        <div className="text-xs">{day.substring(0, 3)}</div>
                        <div className={`text-lg font-bold ${
                          dayIsTraining ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          {exerciseCount}
                        </div>
                        <div className="text-xs">
                          {dayIsTraining ? 'exercises' : 'rest'}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 515.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
