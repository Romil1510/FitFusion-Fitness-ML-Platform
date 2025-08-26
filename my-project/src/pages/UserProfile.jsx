// src/pages/UserProfile.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState("Monday");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/me", { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Sample data for demonstration
  const sampleSchedule = {
    Monday: ["Morning: Running (30 mins)", "Evening: Strength Training (45 mins)"],
    Tuesday: ["Swimming (60 mins)", "Evening: Yoga (30 mins)"],
    Wednesday: ["Rest Day", "Evening: Light Walk (20 mins)"],
    Thursday: ["Morning: HIIT (40 mins)", "Evening: Stretching (20 mins)"],
    Friday: ["Weight Training (60 mins)", "Evening: Cardio (30 mins)"],
    Saturday: ["Outdoor Activities (90 mins)"],
    Sunday: ["Rest Day", "Evening: Planning for next week"]
  };

  const userData = user || {
    name: "John Doe",
    email: "john.doe@example.com",
    mlPrediction: {
      schedule: sampleSchedule
    }
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold mr-4">
                {userData.name?.charAt(0) || "U"}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{userData.name}</h1>
                <p className="text-gray-600">{userData.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-6 rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Account Info Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 transition-transform duration-300 hover:shadow-xl">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-blue-100 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Account Information</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Role</span>
                <span className="font-medium">{userData.role || "User"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subscription</span>
                <span className="font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
                  {userData.subscription?.plan || "None"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Verification</span>
                <span className={`font-medium ${userData.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                  {userData.isVerified ? "Verified" : "Pending"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Goal</span>
                <span className="font-medium">{userData.transformationGoal || "Not set"}</span>
              </div>
            </div>
          </div>

          {/* Coach Info Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 transition-transform duration-300 hover:shadow-xl">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-green-100 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Coach Information</h2>
            </div>
            {userData.coach ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name</span>
                  <span className="font-medium">{userData.coach.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{userData.coach.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Coach Code</span>
                  <span className="font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm">
                    {userData.coach.coachCode}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>No coach assigned yet</p>
              </div>
            )}
          </div>

          {/* Health Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 transition-transform duration-300 hover:shadow-xl">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-red-100 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Health Profile</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Injuries</span>
                <span className={`font-medium ${userData.profile?.hasInjuries ? 'text-red-600' : 'text-green-600'}`}>
                  {userData.profile?.hasInjuries ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Workout Duration</span>
                <span className="font-medium">{userData.preferences?.workoutDuration || 0} mins</span>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Specific Goals</p>
                <div className="flex flex-wrap gap-2">
                  {userData.profile?.specificGoals?.length ? (
                    userData.profile.specificGoals.map((goal, index) => (
                      <span key={index} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                        {goal}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">None specified</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Allergies</p>
                <div className="flex flex-wrap gap-2">
                  {userData.preferences?.allergies?.length ? (
                    userData.preferences.allergies.map((allergy, index) => (
                      <span key={index} className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        {allergy}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">None specified</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ML Prediction Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 transition-transform duration-300 hover:shadow-xl md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-purple-100 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">ML Recommendations</h2>
            </div>
            {userData.mlPrediction ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-600">Goal</p>
                    <p className="font-semibold">{userData.mlPrediction.goal}</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-sm text-orange-600">Daily Calories</p>
                    <p className="font-semibold">{Math.round(userData.mlPrediction.calories)} kcal</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 mb-2">Recommended Exercises</p>
                  <div className="flex flex-wrap gap-2">
                    {userData.mlPrediction.sportsExercise?.map((exercise, index) => (
                      <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {exercise}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>No recommendations available yet</p>
              </div>
            )}
          </div>

          {/* Weekly Schedule Card - IMPROVED */}
          <div className="bg-white rounded-2xl shadow-lg p-6 transition-transform duration-300 hover:shadow-xl md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="p-2 rounded-lg bg-indigo-100 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Weekly Schedule</h2>
            </div>
            
            {userData.mlPrediction?.schedule ? (
              <>
                {/* Day Selector */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {daysOfWeek.map(day => (
                    <button
                      key={day}
                      onClick={() => setActiveDay(day)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeDay === day 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day.substring(0, 3)}
                    </button>
                  ))}
                </div>
                
                {/* Schedule for Selected Day */}
                <div className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-gray-50 to-white">
                  <h3 className="font-bold text-xl text-center text-indigo-700 mb-5">{activeDay}</h3>
                  
                  {userData.mlPrediction.schedule[activeDay]?.length ? (
                    <div className="space-y-4">
                      {userData.mlPrediction.schedule[activeDay].map((exercise, index) => {
                        // Parse exercise string to extract time and activity
                        const timeMatch = exercise.match(/(Morning|Evening|Afternoon|.*:)/);
                        const time = timeMatch ? timeMatch[0].replace(':', '') : 'Activity';
                        const activity = exercise.replace(/(Morning|Evening|Afternoon|.*:)/, '').trim();
                        
                        return (
                          <div key={index} className="flex items-start p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                            <div className="flex-shrink-0 w-20 py-1 px-2 bg-indigo-100 text-indigo-700 rounded text-xs font-medium text-center mr-4">
                              {time}
                            </div>
                            <div className="flex-grow">
                              <p className="text-gray-800 font-medium">{activity}</p>
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>No activities scheduled for {activeDay}</p>
                    </div>
                  )}
                </div>
                
                {/* Full Week Overview (Mini Calendar) */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Week at a Glance</h4>
                  <div className="grid grid-cols-7 gap-2">
                    {daysOfWeek.map(day => (
                      <div 
                        key={day} 
                        className={`p-2 rounded-lg text-center cursor-pointer transition-colors ${
                          activeDay === day 
                            ? 'bg-indigo-100 text-indigo-700 font-medium' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        onClick={() => setActiveDay(day)}
                      >
                        <div className="text-xs">{day.substring(0, 3)}</div>
                        <div className={`text-lg font-bold ${userData.mlPrediction.schedule[day]?.length ? 'text-green-600' : 'text-gray-400'}`}>
                          {userData.mlPrediction.schedule[day]?.length || '0'}
                        </div>
                        <div className="text-xs">activities</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>No schedule available yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;