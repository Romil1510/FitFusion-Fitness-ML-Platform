// src/pages/UserProfile.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md font-poppins">
      <h1 className="text-3xl font-bold mb-6 text-blue-500">👤 User Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Basic Info</h2>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role || "User"}</p>
          <p><strong>Subscription Plan:</strong> {user?.subscription?.plan}</p>
          <p><strong>Transformation Goal:</strong> {user?.transformationGoal}</p>
          <p><strong>Verified:</strong> {user?.isVerified ? "Yes" : "No"}</p>
        </div>

        {/* Coach Info */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700">🏋️‍♂️ Coach</h2>
          {user?.coach ? (
            <>
              <p><strong>Name:</strong> {user.coach.name}</p>
              <p><strong>Email:</strong> {user.coach.email}</p>
              <p><strong>Coach Code:</strong> {user.coach.coachCode}</p>
            </>
          ) : (
            <p>No coach assigned.</p>
          )}
        </div>

        {/* Profile & Preferences */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700">📌 Profile & Preferences</h2>
          <p><strong>Has Injuries:</strong> {user?.profile?.hasInjuries ? "Yes" : "No"}</p>
          <p><strong>Specific Goals:</strong> {user?.profile?.specificGoals?.join(", ") || "None"}</p>
          <p><strong>Workout Duration:</strong> {user?.preferences?.workoutDuration} mins</p>
          <p><strong>Allergies:</strong> {user?.preferences?.allergies?.join(", ") || "None"}</p>
        </div>

        {/* ML Prediction */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700">📊 ML Prediction</h2>
          <p><strong>Goal:</strong> {user?.mlPrediction?.goal}</p>
          <p><strong>Calories:</strong> {Math.round(user?.mlPrediction?.calories)} kcal/day</p>
          <p><strong>Sports Exercises:</strong> {user?.mlPrediction?.sportsExercise?.join(", ")}</p>
        </div>

        {/* Weekly Schedule */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">🗓️ Weekly Schedule</h2>
          {user?.mlPrediction?.schedule ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(user.mlPrediction.schedule).map(([day, workouts]) => (
                <div key={day} className="border rounded-lg p-3 bg-gray-50">
                  <h3 className="font-semibold text-blue-500">{day}</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {workouts.map((exercise, index) => (
                      <li key={index}>{exercise}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p>No schedule available.</p>
          )}
        </div>
      </div>

      {/* Logout Button */}
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded shadow"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
