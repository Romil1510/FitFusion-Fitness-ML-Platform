from flask import Flask, request, jsonify
import joblib
import pandas as pd
import random
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/predictionModel', methods=['POST'])
def predictionModel():
    get_data = request.json
    print(f"Received data: {get_data}")  # Debug log
    
    dataFrame = pd.DataFrame([get_data])
    datadummies = pd.get_dummies(dataFrame.drop('goal', axis=1))                               
    dataFrame_index = datadummies.reindex(columns=col_name, fill_value=0)
    dataFrame_index = dataFrame_index[sorted(dataFrame_index.columns)]
    predicted_data = model.predict(dataFrame_index)

    exercise_df = dataFrame[['age', 'weight', 'height', 'gender', 'sport', 'hasInjuries']]
    exercise_dummies = pd.get_dummies(exercise_df)
    exercise_index = exercise_dummies.reindex(columns=exercise_col, fill_value=0)
    exercise_predicted = exercise_model.predict(exercise_index)

    calories_df = dataFrame[['age', 'height', 'weight', 'gender', 'goal']]
    calories_dummies = pd.get_dummies(calories_df)
    calories_index = calories_dummies.reindex(columns=cal_col, fill_value=0)
    calories_index = calories_index[sorted(calories_index.columns)]
    cal_predicted = cal_model.predict(calories_index)

    # FIXED: Consistent experience levels (all use "Advanced" instead of "Advance")
    strength_training = {
        "Advanced": ["Barbell Deadlifts (heavy)", "Barbell Bench Press", "Clean & Press", "Front Squats", "Turkish Get-Ups", "Snatch", "Clean and Jerk", "Weighted Pull-ups", "Single-leg Deadlifts", "Tempo or Pause Squats"],
        "Intermediate": ["Barbell Squats", "Push-ups", "Romanian Deadlifts", "Overhead Press", "Bent-over Rows", "Goblet Squats", "Pull-ups", "Kettlebell Swings"],
        "Beginner": ["Bodyweight Squats", "Wall Push-ups", "Glute Bridges", "Step-Ups", "Resistance Band Rows", "Dumbbell Deadlifts (light)", "Lunges (bodyweight)", "Plank Hold"]
    }

    cardio_endurance = {
        "Advanced": [  # FIXED: Changed from "Advance" to "Advanced"
            "HIIT Sprints", "Stair Running", "Burpees (high reps)", "Battle Ropes", "Mountain Climbers (fast pace)", 
            "Jump Rope (double unders)", "Tuck Jumps", "Running 10k+", "Cycling (intense uphill)", "Rowing Machine Intervals"
        ],
        "Intermediate": [
            "Jogging (5k)", "Elliptical Trainer (moderate resistance)", "Cycling (moderate pace)", "Jump Rope (basic)", 
            "Mountain Climbers", "Jumping Jacks (long sets)", "Rowing (moderate pace)", "Bodyweight Circuit Training", 
            "Zumba / Cardio Dance", "Swimming Laps"
        ],
        "Beginner": [
            "Brisk Walking", "Slow Jogging", "Marching in Place", "Basic Step Touch", "Low-impact Aerobics", 
            "Cycling (low resistance)", "Jumping Jacks (low reps)", "Elliptical (light)", "Dancing (easy routine)", "Light Swimming"
        ]
    }

    mobility_flexibility = {
        "Advanced": [  # FIXED: Changed from "Advance" to "Advanced"
            "Pigeon Pose", "Overhead Squat Hold", "Wall Handstand Hold", "Full Lotus Pose", "Front Splits", 
            "Bridge to Wheel Pose", "Jefferson Curl", "Scorpion Stretch", "Backbend Kickovers", "Standing Scale Pose"
        ],
        "Intermediate": [
            "World's Greatest Stretch", "Hip Flexor Stretch", "Dynamic Lunges with Twist", "Deep Squat Hold", 
            "Bridge Pose", "Standing Hamstring Stretch", "Shoulder Dislocations (with band)", "Thread the Needle", 
            "Butterfly Stretch", "Lying Spinal Twist"
        ],
        "Beginner": [
            "Neck Rolls", "Shoulder Circles", "Cat-Cow Stretch", "Ankle Circles", "Seated Forward Fold", 
            "Child's Pose", "Wrist Mobility Rolls", "Standing Side Stretch", "Knee Hugs", "Toe Touches"
        ]
    }

    athlete_performance = {
        "Advanced": [  # FIXED: Changed from "Advance" to "Advanced"
            "Olympic Lifts (Clean & Jerk, Snatch)", "Resisted Sprints (sled/pulls)", "Reactive Agility Drills", 
            "Depth to Broad Jump Combos", "Single-Leg Box Jumps", "Weighted Plyometrics", 
            "Speed Ladder + Cone Reaction Drill", "Trap Bar Jumps", "Complex Training (Strength + Plyo)", 
            "Sprint Starts with Overspeed Training"
        ],
        "Intermediate": [
            "Box Jumps", "Sprint Intervals", "Power Push-ups", "Depth Jumps", "Broad Jumps", "Medicine Ball Slams", 
            "Agility Ladder (complex drills)", "Single-Leg Hops", "Plyometric Lunges", "Tuck Jumps"
        ],
        "Beginner": [
            "Lateral Bounds", "High Knees", "Bodyweight Lunges", "Medicine Ball Chest Pass", "Jump Rope (basic)", 
            "Wall Throws", "Agility Ladder (basic drills)", "Skater Steps", "Bear Crawls", "Sprint Technique Drills"
        ]
    }

    fat_loss_program = {
        "Advanced": [  # FIXED: Changed from "Advance" to "Advanced"
            "HIIT Sprints", "Battle Ropes", "Box Jumps", "Plyometric Push-ups", "Tabata Circuits", 
            "Thrusters (Dumbbell/Barbell)", "Man Makers", "Clean and Press", "Tuck Jumps", "Burpee to Pull-up"
        ],
        "Intermediate": [
            "Jump Squats", "Burpees", "Jumping Jacks (high reps)", "Kettlebell Swings", "High Knees", 
            "Lunges with Twists", "Push-ups", "Plank to Push-up", "Mountain Climbers", "Bodyweight Circuits"
        ],
        "Beginner": [
            "Brisk Walking", "Bodyweight Squats", "Step Touches", "Wall Push-ups", "Seated Knee Raises", 
            "Marching in Place", "Light Jumping Jacks", "Modified Burpees", "Slow Mountain Climbers", "Standing Side Crunches"
        ]
    }

    recovery_focus = {
        "Advanced": [  # FIXED: Changed from "Advance" to "Advanced"
            "Advanced Yin Yoga Poses", "Trigger Point Therapy (ball work)", "Fascial Stretch Therapy", 
            "Active Release Techniques (ART)", "Mobility Flow Sessions", "Contrast Therapy (Hot-Cold)", 
            "Advanced Myofascial Release", "Diaphragmatic Breathing Drills", "Guided Meditation + Stretch", 
            "Compression Therapy"
        ],
        "Intermediate": [
            "Dynamic Stretching Routine", "Sun Salutations (Yoga)", "Resistance Band Stretching", 
            "Full-Body Foam Rolling", "Pelvic Tilts", "Hip Flexor Stretch", "Thread the Needle", 
            "PNF Stretching", "Lying Spinal Twists", "Controlled Deep Breathing + Stretch"
        ],
        "Beginner": [
            "Walking", "Child's Pose", "Neck Rolls", "Legs Up the Wall", "Cat-Cow Stretch", 
            "Light Foam Rolling", "Breathing Exercises", "Gentle Seated Twists", 
            "Standing Hamstring Stretch", "Supine Knee Hugs"
        ]
    }

    exercise_list = {
        "strength_training": strength_training,
        "cardio_endurance": cardio_endurance,
        "mobility_flexibility": mobility_flexibility,
        "athlete_performance": athlete_performance,
        "fat_loss_program": fat_loss_program,
        "recovery_focus": recovery_focus,
        # ADDED: Additional mappings for common goal variations
        "muscle_gain": strength_training,
        "weight_loss": fat_loss_program,
        "endurance": cardio_endurance,
        "flexibility": mobility_flexibility,
        "performance": athlete_performance
    }

    days_workout = {
        2: ["Monday", "Thursday"],
        3: ["Monday", "Wednesday", "Friday"],
        4: ["Monday", "Tuesday", "Thursday", "Friday"],  # FIXED: Better 4-day split
        5: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        6: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        7: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    }
    
    # Get data with error handling
    level = get_data.get('experience', 'Intermediate')
    frequency = get_data.get("trainingFrequency", 3)
    primaryGoal = predicted_data.tolist()[0] if len(predicted_data) > 0 else 'muscle_gain'
    
    # Debug logs
    print(f"Level: {level}")
    print(f"Frequency: {frequency}")
    print(f"Primary Goal: {primaryGoal}")
    
    # FIXED: Better goal matching with fallbacks
    exercise_category = exercise_list.get(primaryGoal)
    if not exercise_category:
        # Try common variations
        goal_mappings = {
            'muscle_gain': 'strength_training',
            'fat_loss': 'fat_loss_program', 
            'weight_loss': 'fat_loss_program',
            'cardio': 'cardio_endurance',
            'strength': 'strength_training',
            'flexibility': 'mobility_flexibility',
            'recovery': 'recovery_focus'
        }
        mapped_goal = goal_mappings.get(primaryGoal, 'strength_training')
        exercise_category = exercise_list.get(mapped_goal, strength_training)
        print(f"Mapped goal '{primaryGoal}' to '{mapped_goal}'")
    
    # Get exercises with fallback
    exercises = exercise_category.get(level)
    if not exercises:
        # Try fallback levels
        exercises = exercise_category.get('Intermediate') or exercise_category.get('Beginner') or []
        print(f"Fallback exercises used for level: {level}")
    
    print(f"Available exercises: {exercises[:5]}...")  # Show first 5 exercises
    
    # Get training days
    exercise_days = days_workout.get(frequency, ["Monday", "Wednesday", "Friday"])
    print(f"Training days: {exercise_days}")
    
    # FIXED: Generate schedule with better logic
    schedule = {}
    all_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    
    for day in all_days:
        if day in exercise_days and len(exercises) > 0:
            # Select 3-5 random exercises for training days
            num_exercises = min(random.randint(3, 5), len(exercises))
            schedule[day] = random.sample(exercises, num_exercises)
        else:
            # Rest day
            schedule[day] = []
    
    # Final debug log
    print(f"Generated schedule: {schedule}")
    
    # Ensure we have exercises for training days
    training_day_count = sum(1 for day in exercise_days if len(schedule.get(day, [])) > 0)
    print(f"Training days with exercises: {training_day_count}/{len(exercise_days)}")

    return jsonify({
        "goal": predicted_data.tolist(),
        "schedule_general_fitness": schedule,
        "special_sports_exercise": exercise_predicted.tolist(),
        "according to your goal calories you should take": cal_predicted.tolist()
    })

if __name__ == '__main__':
    model = joblib.load('./final_model.pkl')
    col_name = joblib.load("./columns.pkl")
    exercise_model = joblib.load("./exercise_predict.pkl")
    exercise_col = joblib.load("./exercise_col.pkl")
    cal_model = joblib.load("./cal_model.pkl")
    cal_col = joblib.load("./cal_col.pkl")
    app.run(debug=True)
