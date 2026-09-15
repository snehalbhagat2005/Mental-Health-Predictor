🧠 Mental Health Predictor

A Machine Learning based web application that predicts a student's mental health score using lifestyle habits, academic information, stress levels, physical activity, sleep patterns, and social media usage.

🚀 Live Demo

https://mental-health-predictor-o0au.onrender.com/

📌 Project Overview

Mental Health Predictor is a machine learning web application designed to estimate a student's mental health score based on various academic, lifestyle, and social-media-related factors.

The application provides a simple and user-friendly interface where users can enter their information and receive a predicted mental health score.

The project demonstrates how Machine Learning can be integrated with a web application using FastAPI as the backend and HTML, CSS, and JavaScript as the frontend.

✨ Features
🧠 Machine Learning based mental health score prediction
👨‍🎓 Student-focused prediction system
📊 Uses academic, lifestyle, stress, and social media factors
🌐 Interactive web-based interface
⚡ FastAPI REST API backend
🔒 Input validation using Pydantic
📱 Responsive frontend design
☁️ Deployed online using Render

## 📸 Project Demo

### 🏠 Home Page

<img width="1894" height="739" alt="Screenshot 2026-09-16 002140" src="https://github.com/user-attachments/assets/a288dc1a-32ea-4b0c-b2cd-8a8906d2a219" />


### 📝 Input Form

<img width="609" height="734" alt="Screenshot 2026-09-16 003416" src="https://github.com/user-attachments/assets/828bb9ef-6e4f-4dfd-8fa8-500d23bef76a" />


### 📊 Prediction Result

<img width="1475" height="740" alt="Screenshot 2026-09-16 002210" src="https://github.com/user-attachments/assets/f208271b-a60c-413b-848f-6b469ba2800a" />


🛠️ Technologies Used
Machine Learning
Python
Pandas
Scikit-learn
Joblib
Trained Machine Learning Model
Backend
FastAPI
Pydantic
Uvicorn
REST API
CORS Middleware
Frontend
HTML5
CSS3
JavaScript
Deployment
Render
GitHub

📋 Input Features

The model uses the following information for prediction:

Age
Gender
Country
Academic Level
Most Used Social Media Platform
Purpose of Social Media Usage
Average Daily Usage Hours
Daily Unlocks
Study Hours
Physical Activity Hours
Sleep Hours Per Night
Stress Level

🔄 How It Works
The user enters their personal, academic, lifestyle, and social media information.
The frontend validates the entered data.
The data is sent to the FastAPI backend through a REST API.
FastAPI validates the request using Pydantic.
The trained Machine Learning model processes the input data.
The model predicts a mental health score.
The predicted score is returned to the frontend.
The result is displayed to the user in an easy-to-understand format.

🏗️ Project Architecture
User
  │
  ▼
HTML / CSS / JavaScript
  │
  │  HTTP POST Request
  ▼
FastAPI Backend
  ->
Input Validation
  ->
Trained ML Model
  ->
Predicted Mental Health Score
  ->
Frontend Result

📊 Machine Learning

The project uses a trained Machine Learning model saved as:

Mental_Health_Predictor.pkl

The model takes both numerical and categorical features as input and predicts a student's mental health score.

Categorical information such as gender, academic level, social media platform, purpose of use, stress level, and country is processed according to the format expected by the trained model.

🔌 API
Prediction Endpoint
POST /predict

Example request:

{
  "age": 21,
  "gender": "Male",
  "country": "India",
  "academic_Level": "Undergraduate",
  "most_Used_Platform": "Instagram",
  "purpose_Of_Use": "Entertainment",
  "avg_Daily_Usage_Hours": 4.5,
  "daily_Unlocks": 50,
  "study_Hours": 5,
  "physical_Activity_Hours": 1,
  "sleep_Hours_Per_Night": 7,
  "stress_Level": "Medium"
}

Example response:

{
  "predicted_mental_health_score": 6.42
}


🌐 Deployment

The application is deployed using Render and the source code is maintained on GitHub.

Live application:

https://mental-health-predictor-o0au.onrender.com/

💻 Running the Project Locally
1. Clone the repository
git clone <your-repository-url>
cd <your-project-folder>
2. Install dependencies
pip install -r requirements.txt
3. Start the FastAPI server
uvicorn main:app --reload

The backend will run at:

http://127.0.0.1:8000
4. Open the frontend

Open the frontend index.html file in your browser.

Make sure the frontend API URL points to the running FastAPI backend.

📁 Project Structure
Mental-Health-Predictor/
│
├── main.py
├── Mental_Health_Predictor.pkl
├── requirements.txt
│
├── index.html
├── style.css
├── script.js
│
└── README.md
🔮 Future Enhancements
Add more mental health indicators
Improve model accuracy with larger datasets
Add multiple Machine Learning models for comparison
Add data visualization and analytics
Add personalized lifestyle recommendations
Add user history and prediction tracking
Improve model explainability
Develop a dedicated mobile application
🎯 Learning Outcomes

Through this project, we learned:

Machine Learning model development and deployment
Data preprocessing and feature handling
Building REST APIs using FastAPI
Connecting frontend applications with ML backends
Input validation using Pydantic
Model serialization using Joblib
Git and GitHub
Cloud deployment using Render
⚠️ Disclaimer

This project is developed for educational and demonstration purposes only.

The predicted score is generated by a Machine Learning model and should not be considered a medical diagnosis, psychological assessment, or substitute for professional mental-health advice.

If someone is experiencing mental-health difficulties, they should seek help from a qualified healthcare or mental-health professional.

👨‍💻 Author

Snehal Bhagat
