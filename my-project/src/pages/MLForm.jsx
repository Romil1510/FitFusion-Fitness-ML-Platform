import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      alert("Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md font-poppins">
      <h1 className="text-2xl font-bold text-blue-500 mb-6">🏋️ ML Fitness Prediction</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required className="input" />
        <input type="number" name="height" placeholder="Height (cm)" value={formData.height} onChange={handleChange} required className="input" />
        <input type="number" name="weight" placeholder="Weight (kg)" value={formData.weight} onChange={handleChange} required className="input" />
        <select name="gender" value={formData.gender} onChange={handleChange} className="input">
          <option>Male</option>
          <option>Female</option>
        </select>
        <select name="goal" value={formData.goal} onChange={handleChange} className="input">
          <option value="fat_loss_program">Fat Loss</option>
          <option value="muscle_gain">Muscle Gain</option>
          <option value="athlete_performance">Athlete Performance</option>
        </select>
        <select name="experience" value={formData.experience} onChange={handleChange} className="input">
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
        <input type="number" name="trainingFrequency" placeholder="Training Days/Week" value={formData.trainingFrequency} onChange={handleChange} className="input" />
        <input type="text" name="sport" placeholder="Sport (e.g., football)" value={formData.sport} onChange={handleChange} className="input" />
        <select name="hasInjuries" value={formData.hasInjuries} onChange={handleChange} className="input">
          <option>No</option>
          <option>Yes</option>
        </select>

        <button
          type="submit"
          className="md:col-span-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold transition"
        >
          {loading ? "Predicting..." : "Submit"}
        </button>
      </form>

      {/* Result Display */}
      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-green-500 mb-4">✅ Prediction Result</h2>
          <p><strong>Goal:</strong> {result.goal}</p>
          <p><strong>Calories:</strong> {Math.round(result.calories)} kcal/day</p>
          <p><strong>Sports Exercises:</strong> {result.sportsExercise?.join(", ")}</p>

          {/* Schedule */}
          <h3 className="font-semibold mt-4 mb-2 text-blue-600">Weekly Schedule:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(result.schedule).map(([day, workouts]) => (
              <div key={day} className="bg-gray-100 p-3 rounded">
                <p className="font-medium text-blue-500">{day}</p>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {workouts.map((ex, i) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MLForm;
