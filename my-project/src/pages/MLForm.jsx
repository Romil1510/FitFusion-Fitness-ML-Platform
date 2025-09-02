import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaRulerVertical, FaWeight, FaVenusMars, FaBullseye, FaGraduationCap, FaCalendarAlt, FaRunning, FaFirstAid, FaSpinner, FaSave, FaUserCheck } from "react-icons/fa";

function MLForm() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
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
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeDay, setActiveDay] = useState("Monday");

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "hasInjuries") {
      setFormData((prev) => ({ ...prev, [name]: value === "Yes" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // FIXED: Find first training day helper
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

  // FIXED: Check if a day is a training day
  const isTrainingDay = (daySchedule) => {
    if (!Array.isArray(daySchedule) || daySchedule.length === 0) return false;
    
    return daySchedule.some(exercise => 
      exercise && 
      typeof exercise === 'string' && 
      !exercise.toLowerCase().includes('rest') &&
      exercise.trim() !== ''
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);
    
    try {
      // Prepare data for your API format
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

      // FIXED: Better schedule processing
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

      // Process the response to match expected format
      const processedResult = {
        calories: Array.isArray(prediction["according to your goal calories you should take"]) 
          ? prediction["according to your goal calories you should take"][0]
          : prediction["according to your goal calories you should take"],
        goal: Array.isArray(prediction.goal) ? prediction.goal[0] : prediction.goal,
        schedule: scheduleData, // Use the schedule directly from API
        sportsExercise: prediction.special_sports_exercise || [],
        originalResponse: prediction, // Keep original for reference
        formData: formData,
        generatedAt: new Date().toISOString(),
        trainingFrequency: parseInt(formData.trainingFrequency)
      };
      
      console.log('Final processed result:', processedResult);
      
      setResult(processedResult);
      
      // Set active day to first training day
      if (processedResult.schedule && Object.keys(processedResult.schedule).length > 0) {
        const firstTrainingDay = findFirstTrainingDay(processedResult.schedule);
        setActiveDay(firstTrainingDay);
        console.log('Set active day to:', firstTrainingDay);
      }
      
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  // FIXED: Enhanced save to profile function
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
          savedAt: new Date().toISOString()
        }
      };

      // CRITICAL: Save to localStorage first (immediate persistence)
      localStorage.setItem('userFitnessPlan', JSON.stringify(profileData));
      console.log('Saved to localStorage:', profileData);
      
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

  // Save and Navigate to Profile Function
  const saveAndViewProfile = async () => {
    await saveToProfile();
    // Navigate after a short delay to ensure save completes
    setTimeout(() => {
      navigate("/profile");
    }, 1000);
  };

  // FIXED: Format goal function
  const formatGoal = (goal) => {
    if (Array.isArray(goal)) return goal.join(", ");
    if (typeof goal === 'string') return goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return goal || "Not specified";
  };

  // FIXED: Get training stats
  const getTrainingStats = () => {
    if (!result?.schedule) return { training: 0, rest: 7 };
    
    const trainingDays = Object.keys(result.schedule).filter(day => {
      const daySchedule = result.schedule[day];
      return isTrainingDay(daySchedule);
    });
    
    return {
      training: trainingDays.length,
      rest: 7 - trainingDays.length
    };
  };

  const trainingStats = getTrainingStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-24 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              AI Fitness Plan Generator
            </h1>
            <p className="text-gray-600">
              Get personalized workout and nutrition recommendations based on your profile
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <FaUser className="text-blue-500" />
              </div>
              Your Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Age */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
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
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaRulerVertical className="text-gray-400" />
                    </div>
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
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaWeight className="text-gray-400" />
                    </div>
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
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaVenusMars className="text-gray-400" />
                    </div>
                    <select 
                      name="gender" 
                      value={formData.gender} 
                      onChange={handleChange} 
                      className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Goal */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fitness Goal</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBullseye className="text-gray-400" />
                    </div>
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
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Experience */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaGraduationCap className="text-gray-400" />
                    </div>
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
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
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
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="text-gray-400" />
                    </div>
                    <input 
                      type="number" 
                      name="trainingFrequency" 
                      placeholder="Training Days" 
                      value={formData.trainingFrequency} 
                      onChange={handleChange} 
                      className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      min="1"
                      max="7"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Choose between 1-7 training days per week</p>
                </div>

                {/* Sport */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Sport</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaRunning className="text-gray-400" />
                    </div>
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
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaFirstAid className="text-gray-400" />
                    </div>
                    <select 
                      name="hasInjuries" 
                      value={formData.hasInjuries ? "Yes" : "No"} 
                      onChange={handleChange} 
                      className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-md transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center disabled:opacity-75 disabled:transform-none"
              >
                {loading ? (
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

          {/* Result Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Your Personalized Plan
            </h2>

            {result ? (
              <div className="space-y-6">
                {/* Success Banner */}
                {saveSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-green-800 font-medium">Successfully saved to your profile!</span>
                    </div>
                  </div>
                )}

                {/* Save to Profile Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
                  <button
                    onClick={saveToProfile}
                    disabled={saving}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 rounded-lg font-medium shadow-md transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center disabled:opacity-75 disabled:transform-none"
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

                  <button
                    onClick={saveAndViewProfile}
                    disabled={saving}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-2.5 rounded-lg font-medium shadow-md transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center disabled:opacity-75 disabled:transform-none"
                  >
                    {saving ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaUserCheck className="mr-2" />
                        Save & View Profile
                      </>
                    )}
                  </button>
                </div>

                {/* Goal and Calories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-sm text-blue-600 font-medium">Goal</p>
                    <p className="font-semibold text-gray-800 capitalize">{formatGoal(result.goal)}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-xl">
                    <p className="text-sm text-orange-600 font-medium">Daily Calories</p>
                    <p className="font-semibold text-gray-800">{Math.round(result.calories)} kcal</p>
                  </div>
                </div>

                {/* Training Frequency Display */}
                <div className="bg-indigo-50 p-4 rounded-xl">
                  <p className="text-sm text-indigo-600 font-medium">Training Schedule</p>
                  <p className="font-semibold text-gray-800">
                    {trainingStats.training} training days, {trainingStats.rest} rest days per week
                  </p>
                </div>

                {/* Recommended Exercises */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Special Sports Exercises</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.sportsExercise?.map((exercise, index) => (
                      <span key={index} className="bg-green-100 text-green-800 text-xs px-3 py-1.5 rounded-full">
                        {exercise}
                      </span>
                    ))}
                  </div>
                </div>

                {/* FIXED: Weekly Schedule */}
                {result.schedule && Object.keys(result.schedule).length > 0 ? (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-3">Weekly Schedule</h3>
                    
                    {/* Day Selector */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Object.keys(result.schedule).map(day => {
                        const daySchedule = result.schedule[day] || [];
                        const dayIsTraining = isTrainingDay(daySchedule);
                        
                        return (
                          <button
                            key={day}
                            onClick={() => setActiveDay(day)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors relative ${
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
                    
                    {/* Day Schedule */}
                    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                      <h4 className="font-semibold text-center text-indigo-700 mb-3">{activeDay}</h4>
                      
                      {result.schedule[activeDay] && Array.isArray(result.schedule[activeDay]) && result.schedule[activeDay].length > 0 ? (
                        <ul className="space-y-2">
                          {result.schedule[activeDay].map((exercise, index) => {
                            // Handle empty or rest exercises
                            if (!exercise || exercise.trim() === '' || exercise.toLowerCase().includes('rest')) {
                              return (
                                <li key={index} className="flex items-center justify-center p-3 bg-gray-100 border border-gray-200 rounded-lg">
                                  <div className="text-gray-600 font-medium flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 718.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                    Rest Day
                                  </div>
                                </li>
                              );
                            }
                            
                            return (
                              <li key={index} className="flex items-start p-3 bg-white border border-green-200 rounded-lg">
                                <svg className="w-4 h-4 mt-1 mr-3 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm text-gray-700 font-medium">{exercise}</span>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          <svg className="h-8 w-8 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 718.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                          <p>Rest Day - No exercises scheduled for {activeDay}</p>
                        </div>
                      )}
                    </div>

                    {/* Training Summary */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Training Days:</span>
                          <span className="font-semibold text-blue-800">{trainingStats.training}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Rest Days:</span>
                          <span className="font-semibold text-blue-800">{trainingStats.rest}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No weekly schedule available</p>
                  </div>
                )}

                {/* DEBUG: Schedule Data */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Debug: Schedule Data</h4>
                  <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                    {JSON.stringify(result.schedule, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>Submit your information to generate a personalized fitness plan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MLForm;
