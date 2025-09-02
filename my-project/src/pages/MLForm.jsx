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

  // Generate complete weekly schedule based on training frequency
  const generateCompleteSchedule = (partialSchedule, frequency) => {
    const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const newSchedule = {};
    
    // Initialize all days
    allDays.forEach(day => {
      newSchedule[day] = [];
    });

    // Get training days from partial schedule
    const trainingDaysFromAPI = Object.keys(partialSchedule || {});
    
    // Define training day patterns based on frequency
    const getTrainingDayPattern = (freq) => {
      const patterns = {
        1: ["Monday"],
        2: ["Monday", "Thursday"],
        3: ["Monday", "Wednesday", "Friday"],
        4: ["Monday", "Tuesday", "Thursday", "Friday"],
        5: ["Monday", "Tuesday", "Wednesday", "Friday", "Saturday"],
        6: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        7: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
      };
      return patterns[freq] || patterns[3];
    };

    const targetTrainingDays = getTrainingDayPattern(parseInt(frequency));

    // Fill in training days
    if (trainingDaysFromAPI.length > 0) {
      // Use exercises from API response for training days
      targetTrainingDays.forEach((day, index) => {
        const apiDay = trainingDaysFromAPI[index % trainingDaysFromAPI.length];
        if (partialSchedule[apiDay]) {
          newSchedule[day] = [...partialSchedule[apiDay]];
        }
      });
    } else {
      // Create default exercises if no schedule from API
      const defaultExercises = {
        "muscle_gain": ["Weight Training: 45 minutes", "Compound Exercises: 30 minutes", "Isolation Work: 15 minutes"],
        "fat_loss_program": ["Cardio: 30 minutes", "Strength Training: 20 minutes", "Core Work: 10 minutes"],
        "athlete_performance": ["Sport-Specific Training: 60 minutes", "Conditioning: 30 minutes", "Flexibility: 15 minutes"]
      };
      
      const exercises = defaultExercises[formData.goal] || defaultExercises["muscle_gain"];
      targetTrainingDays.forEach(day => {
        newSchedule[day] = [...exercises];
      });
    }

    // Set rest days
    allDays.forEach(day => {
      if (!targetTrainingDays.includes(day)) {
        newSchedule[day] = ["Rest Day"];
      }
    });

    return newSchedule;
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

      const res = await axios.post("http://127.0.0.1:5000/predictionModel", apiData);
      
      let prediction = res.data;
      
      // Process the response to match expected format
      const processedResult = {
        calories: Array.isArray(prediction["according to your goal calories you should take"]) 
          ? prediction["according to your goal calories you should take"][0]
          : prediction["according to your goal calories you should take"],
        goal: Array.isArray(prediction.goal) ? prediction.goal[0] : prediction.goal,
        schedule: generateCompleteSchedule(prediction.schedule_general_fitness, formData.trainingFrequency),
        sportsExercise: prediction.special_sports_exercise || [],
        originalResponse: prediction // Keep original for reference
      };
      
      setResult(processedResult);
      
      // Set active day to first training day
      const trainingDays = Object.keys(processedResult.schedule).filter(day => 
        processedResult.schedule[day] && 
        processedResult.schedule[day].length > 0 &&
        !processedResult.schedule[day].some(exercise => exercise.toLowerCase().includes('rest'))
      );
      if (trainingDays.length > 0) {
        setActiveDay(trainingDays[0]);
      }
      
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  // Save to Profile Function
  const saveToProfile = async () => {
    if (!result) {
      alert("Please generate a fitness plan first!");
      return;
    }

    setSaving(true);
    setSaveSuccess(false);

    try {
      // Get current user data first
      const userRes = await axios.get("http://localhost:5000/api/auth/me", { withCredentials: true });
      const currentUser = userRes.data.user;

      // Prepare the complete data to save
      const profileData = {
        ...currentUser,
        mlPrediction: {
          ...result,
          formData: formData, // Include original form data
          generatedAt: new Date().toISOString(),
          trainingFrequency: parseInt(formData.trainingFrequency),
          apiResponse: result.originalResponse // Keep original API response
        }
      };

      // Save back to user profile
      const response = await axios.post(
        "http://localhost:5000/api/auth/update", 
        profileData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSaveSuccess(true);
        setTimeout(() => {
          alert("Your fitness plan has been saved to your profile successfully!");
          setSaveSuccess(false);
        }, 100);
      }

    } catch (error) {
      console.error("Save to profile error:", error);
      
      // Try alternative approach - localStorage as backup
      try {
        const backupData = {
          mlPrediction: {
            ...result,
            formData: formData,
            generatedAt: new Date().toISOString(),
            trainingFrequency: parseInt(formData.trainingFrequency)
          }
        };
        localStorage.setItem('fitnessPlan', JSON.stringify(backupData));
        setSaveSuccess(true);
        alert("Your fitness plan has been saved locally! Backend endpoint may need setup for permanent storage.");
      } catch (localError) {
        alert("Failed to save to profile. Please try again.");
      }
    }
    setSaving(false);
  };

  // Save and Navigate to Profile Function
  const saveAndViewProfile = async () => {
    await saveToProfile();
    if (saveSuccess) {
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    }
  };

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
                    <p className="font-semibold text-gray-800 capitalize">{result.goal?.replace(/_/g, ' ')}</p>
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
                    {formData.trainingFrequency} {formData.trainingFrequency === 1 ? 'day' : 'days'} per week
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

                {/* Weekly Schedule */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Weekly Schedule</h3>
                  
                  {/* Day Selector */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {result.schedule && Object.keys(result.schedule).map(day => (
                      <button
                        key={day}
                        onClick={() => setActiveDay(day)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          activeDay === day 
                            ? 'bg-indigo-600 text-white' 
                            : result.schedule[day] && result.schedule[day].length > 0 && 
                              !result.schedule[day].some(ex => ex.toLowerCase().includes('rest'))
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {day.substring(0, 3)}
                        {result.schedule[day] && result.schedule[day].length > 0 && 
                         !result.schedule[day].some(ex => ex.toLowerCase().includes('rest')) && (
                          <span className="ml-1 text-xs">•</span>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {/* Day Schedule */}
                  {result.schedule && result.schedule[activeDay] && (
                    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                      <h4 className="font-semibold text-center text-indigo-700 mb-3">{activeDay}</h4>
                      <ul className="space-y-2">
                        {result.schedule[activeDay].map((exercise, index) => (
                          <li key={index} className={`flex items-start p-2 rounded-lg ${
                            exercise.toLowerCase().includes('rest') 
                              ? 'bg-gray-100 border border-gray-200' 
                              : 'bg-white border border-green-200'
                          }`}>
                            <svg className={`w-4 h-4 mt-1 mr-2 flex-shrink-0 ${
                              exercise.toLowerCase().includes('rest') 
                                ? 'text-gray-400' 
                                : 'text-green-500'
                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm text-gray-700">{exercise}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Training Summary */}
                  {result.schedule && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700">Training Days:</span>
                        <span className="font-semibold text-blue-800">
                          {Object.values(result.schedule).filter(dayEx => 
                            dayEx && dayEx.length > 0 && !dayEx.some(ex => ex.toLowerCase().includes('rest'))
                          ).length} days
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-blue-700">Rest Days:</span>
                        <span className="font-semibold text-blue-800">
                          {7 - Object.values(result.schedule).filter(dayEx => 
                            dayEx && dayEx.length > 0 && !dayEx.some(ex => ex.toLowerCase().includes('rest'))
                          ).length} days
                        </span>
                      </div>
                    </div>
                  )}
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
