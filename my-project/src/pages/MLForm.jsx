import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaRulerVertical, FaWeight, FaVenusMars, FaBullseye, FaGraduationCap, FaCalendarAlt, FaRunning, FaFirstAid, FaSpinner } from "react-icons/fa";

function MLForm() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    gender: "Male",
    goal: "fat_loss_program",
    experience: "Beginner",
    trainingFrequency: 3,
    sport: "",
    hasInjuries: "No",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeDay, setActiveDay] = useState("Monday");

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/ml/predict", 
        formData,
        { withCredentials: true }
      );
      setResult(res.data.prediction); 
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
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
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
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
                      <option value="fat_loss_program">Fat Loss</option>
                      <option value="muscle_gain">Muscle Gain</option>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Training Days/Week</label>
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
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Any Injuries?</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaFirstAid className="text-gray-400" />
                    </div>
                    <select 
                      name="hasInjuries" 
                      value={formData.hasInjuries} 
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
                {/* Goal and Calories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-sm text-blue-600 font-medium">Goal</p>
                    <p className="font-semibold text-gray-800">{result.goal}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-xl">
                    <p className="text-sm text-orange-600 font-medium">Daily Calories</p>
                    <p className="font-semibold text-gray-800">{Math.round(result.calories)} kcal</p>
                  </div>
                </div>

                {/* Recommended Exercises */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Recommended Exercises</h3>
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
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {day.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                  
                  {/* Day Schedule */}
                  {result.schedule && result.schedule[activeDay] && (
                    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                      <h4 className="font-semibold text-center text-indigo-700 mb-3">{activeDay}</h4>
                      <ul className="space-y-2">
                        {result.schedule[activeDay].map((exercise, index) => (
                          <li key={index} className="flex items-start p-2 bg-white rounded-lg">
                            <svg className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm text-gray-700">{exercise}</span>
                          </li>
                        ))}
                      </ul>
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