// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare_platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

// ==================== SCHEMAS ====================

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'doctor', 'user'], default: 'user' },
  
  // Basic Info
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: String,
  dateOfBirth: Date,
  gender: { type: String, enum: ['male', 'female', 'other'] },
  
  // User Specific
  isPremium: { type: Boolean, default: false },
  premiumExpiry: Date,
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Health Profile
  healthProfile: {
    age: Number,
    height_cm: Number,
    weight_kg: Number,
    bmi: Number,
    conditions: [String], // ['diabetes', 'hypertension', etc.]
    allergies: [String],
    medications: [String],
    bloodGroup: String,
    emergencyContact: {
      name: String,
      phone: String,
      relation: String
    }
  },
  
  // Vitals History
  vitalsHistory: [{
    date: { type: Date, default: Date.now },
    systolic_bp: Number,
    diastolic_bp: Number,
    sugar_level: Number,
    heart_rate: Number,
    weight_kg: Number,
    notes: String
  }],
  
  // Doctor Specific
  doctorProfile: {
    specialization: String,
    licenseNumber: String,
    yearsOfExperience: Number,
    qualifications: [String],
    consultationFee: Number,
    availableSlots: [{
      day: String,
      startTime: String,
      endTime: String
    }],
    rating: { type: Number, default: 0 },
    totalConsultations: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false }
  },
  
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Health Triage Schema
const triageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Input Data
  inputData: {
    age: Number,
    weight_kg: Number,
    height_cm: Number,
    bmi: Number,
    conditions: [String],
    symptoms: [String],
    lifestyle: {
      smoking: Boolean,
      alcohol: Boolean,
      exercise_frequency: String,
      sleep_hours: Number,
      stress_level: Number
    }
  },
  
  // Triage Result
  pathway: { type: String, enum: ['wellness', 'expert'], required: true },
  riskLevel: { type: String, enum: ['low', 'moderate', 'high', 'critical'] },
  recommendations: [String],
  requiresDoctor: { type: Boolean, default: false },
  
  triageDate: { type: Date, default: Date.now },
  aiConfidence: Number
});

// Meal Plan Schema
const mealPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Input Parameters
  inputParams: {
    age: Number,
    height_cm: Number,
    weight_kg: Number,
    gender: String,
    meals_per_day: Number,
    has_diabetes: Boolean,
    has_hypertension: Boolean,
    sugar_level: Number,
    sleep_hours: Number,
    stress_level: Number,
    bmr: Number,
    tdee: Number,
    systolic_bp: Number,
    diastolic_bp: Number,
    fitness_goal: String,
    activity_level: String,
    diet_type: String,
    preferred_cuisine: String
  },
  
  // Generated Plan
  plan: {
    daily_calories: Number,
    macros: {
      protein_g: Number,
      carbs_g: Number,
      fats_g: Number
    },
    meals: [{
      meal_type: String, // breakfast, lunch, dinner, snack
      name: String,
      calories: Number,
      protein_g: Number,
      carbs_g: Number,
      fats_g: Number,
      ingredients: [String],
      instructions: String,
      time: String
    }],
    hydration_liters: Number,
    supplements: [String],
    restrictions: [String]
  },
  
  generatedBy: String, // 'ml_model' or 'doctor'
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  createdAt: { type: Date, default: Date.now }
});

// Exercise Plan Schema
const exercisePlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Input Parameters
  inputParams: {
    age: Number,
    gender: String,
    weight_kg: Number,
    height_cm: Number,
    bmi: Number,
    fitness_goal: String,
    experience_level: String,
    days_per_week: Number,
    time_per_session_min: Number,
    preferred_workout_type: String,
    workout_location: String,
    conditions: [String],
    bp_level: String,
    sugar_level_mg_dL: Number,
    available_equipment: [String]
  },
  
  // Generated Plan
  plan: {
    weekly_schedule: [{
      day: String,
      exercises: [{
        name: String,
        type: String, // cardio, strength, flexibility, mobility
        sets: Number,
        reps: Number,
        duration: String,
        intensity: String, // low, moderate, high
        rest_seconds: Number,
        instructions: String,
        precautions: [String]
      }],
      total_duration_min: Number,
      calories_burned: Number
    }],
    warm_up: [String],
    cool_down: [String],
    weekly_goal: String,
    safety_notes: [String]
  },
  
  generatedBy: String, // 'ml_model' or 'doctor'
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  createdAt: { type: Date, default: Date.now }
});

// Progress Log Schema
const progressLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  date: { type: Date, default: Date.now },
  
  // Daily Metrics
  vitals: {
    systolic_bp: Number,
    diastolic_bp: Number,
    sugar_level: Number,
    heart_rate: Number,
    weight_kg: Number,
    body_temp: Number
  },
  
  // Activity
  activity: {
    steps: Number,
    calories_burned: Number,
    active_minutes: Number,
    distance_km: Number,
    workout_completed: Boolean,
    workout_duration_min: Number
  },
  
  // Nutrition
  nutrition: {
    calories_consumed: Number,
    protein_g: Number,
    carbs_g: Number,
    fats_g: Number,
    water_liters: Number,
    meals_logged: [String]
  },
  
  // Wellness
  wellness: {
    sleep_hours: Number,
    sleep_quality: String, // poor, fair, good, excellent
    stress_level: Number, // 1-10
    mood: String, // anxious, sad, neutral, happy, energetic
    symptoms: [String]
  },
  
  notes: String,
  photos: [String], // URLs or base64
  
  createdAt: { type: Date, default: Date.now }
});

// Consultation Schema
const consultationSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  type: { type: String, enum: ['scheduled', 'emergency', 'followup'], default: 'scheduled' },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  
  scheduledDate: Date,
  scheduledTime: String,
  duration_min: Number,
  
  // Chief Complaint
  complaint: String,
  symptoms: [String],
  duration: String,
  
  // Consultation Notes
  notes: {
    subjective: String, // Patient's description
    objective: String, // Doctor's observations
    assessment: String, // Diagnosis
    plan: String // Treatment plan
  },
  
  // Vitals during consultation
  vitals: {
    systolic_bp: Number,
    diastolic_bp: Number,
    sugar_level: Number,
    heart_rate: Number,
    weight_kg: Number,
    temperature: Number
  },
  
  diagnosis: [String],
  prescriptions: [{
    medicine: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  
  labTests: [{
    test_name: String,
    reason: String,
    status: String,
    results: String,
    date: Date
  }],
  
  followUpDate: Date,
  followUpNotes: String,
  
  documents: [{
    name: String,
    type: String,
    url: String,
    uploadedAt: Date
  }],
  
  rating: Number,
  feedback: String,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Messages Schema (Doctor-Patient Chat)
const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  consultationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' },
  
  message: { type: String, required: true },
  attachments: [{
    name: String,
    type: String,
    url: String
  }],
  
  isRead: { type: Boolean, default: false },
  readAt: Date,
  
  createdAt: { type: Date, default: Date.now }
});

// Notifications Schema
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  type: { 
    type: String, 
    enum: ['reminder', 'consultation', 'message', 'health_alert', 'system'], 
    required: true 
  },
  
  title: { type: String, required: true },
  message: { type: String, required: true },
  
  data: mongoose.Schema.Types.Mixed, // Additional data
  
  isRead: { type: Boolean, default: false },
  readAt: Date,
  
  createdAt: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Triage = mongoose.model('Triage', triageSchema);
const MealPlan = mongoose.model('MealPlan', mealPlanSchema);
const ExercisePlan = mongoose.model('ExercisePlan', exercisePlanSchema);
const ProgressLog = mongoose.model('ProgressLog', progressLogSchema);
const Consultation = mongoose.model('Consultation', consultationSchema);
const Message = mongoose.model('Message', messageSchema);
const Notification = mongoose.model('Notification', notificationSchema);

// ==================== MIDDLEWARE ====================

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Role Check Middleware
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

// Premium Check Middleware
const checkPremium = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user.isPremium || (user.premiumExpiry && user.premiumExpiry < new Date())) {
      return res.status(403).json({ error: 'Premium subscription required' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== HELPER FUNCTIONS ====================

// Calculate BMI
function calculateBMI(weight_kg, height_cm) {
  const height_m = height_cm / 100;
  return parseFloat((weight_kg / (height_m * height_m)).toFixed(2));
}

// Calculate BMR (Basal Metabolic Rate)
function calculateBMR(weight_kg, height_cm, age, gender) {
  if (gender === 'male') {
    return 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
  } else {
    return 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
  }
}

// Calculate TDEE (Total Daily Energy Expenditure)
function calculateTDEE(bmr, activityLevel) {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.2));
}

// Generate JWT Token
function generateToken(user) {
  return jwt.sign(
    { 
      userId: user._id, 
      email: user.email, 
      role: user.role,
      isPremium: user.isPremium
    },
    process.env.JWT_SECRET || 'your_jwt_secret_key',
    { expiresIn: '7d' }
  );
}

// Create Notification
async function createNotification(userId, type, title, message, data = {}) {
  await Notification.create({
    userId,
    type,
    title,
    message,
    data
  });
}

// ==================== ROUTES ====================

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    service: 'Healthcare Platform API'
  });
});

// ==================== AUTH ROUTES ====================

// Register User
app.post('/api/auth/register', async (req, res) => {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      role = 'user',
      dateOfBirth,
      gender
    } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role: role === 'admin' ? 'user' : role, // Prevent direct admin registration
      dateOfBirth,
      gender,
      healthProfile: {}
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isPremium: user.isPremium
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isPremium: user.isPremium,
        healthProfile: user.healthProfile,
        doctorProfile: user.doctorProfile
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Current User
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password')
      .populate('assignedDoctor', 'firstName lastName doctorProfile');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== USER PROFILE ROUTES ====================

// Update Profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      phone, 
      dateOfBirth, 
      gender,
      healthProfile 
    } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update basic info
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (gender) user.gender = gender;

    // Update health profile
    if (healthProfile) {
      user.healthProfile = { ...user.healthProfile, ...healthProfile };
      
      // Calculate BMI if height and weight provided
      if (healthProfile.height_cm && healthProfile.weight_kg) {
        user.healthProfile.bmi = calculateBMI(
          healthProfile.weight_kg, 
          healthProfile.height_cm
        );
      }
    }

    user.updatedAt = new Date();
    await user.save();

    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: user 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Vitals
app.post('/api/user/vitals', authenticateToken, async (req, res) => {
  try {
    const { systolic_bp, diastolic_bp, sugar_level, heart_rate, weight_kg, notes } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.vitalsHistory.push({
      date: new Date(),
      systolic_bp,
      diastolic_bp,
      sugar_level,
      heart_rate,
      weight_kg,
      notes
    });

    // Update current weight in health profile
    if (weight_kg) {
      user.healthProfile.weight_kg = weight_kg;
      if (user.healthProfile.height_cm) {
        user.healthProfile.bmi = calculateBMI(weight_kg, user.healthProfile.height_cm);
      }
    }

    await user.save();

    // Check for alerts
    if (systolic_bp > 140 || diastolic_bp > 90) {
      await createNotification(
        user._id,
        'health_alert',
        'High Blood Pressure Detected',
        `Your BP reading is ${systolic_bp}/${diastolic_bp}. Please consult your doctor.`
      );
    }

    if (sugar_level > 180) {
      await createNotification(
        user._id,
        'health_alert',
        'High Blood Sugar Detected',
        `Your blood sugar is ${sugar_level} mg/dL. Please monitor closely.`
      );
    }

    res.json({ 
      success: true, 
      message: 'Vitals recorded successfully',
      vitals: user.vitalsHistory[user.vitalsHistory.length - 1]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Vitals History
app.get('/api/user/vitals', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate, limit = 30 } = req.query;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let vitals = user.vitalsHistory;

    // Filter by date range
    if (startDate || endDate) {
      vitals = vitals.filter(v => {
        const vDate = new Date(v.date);
        if (startDate && vDate < new Date(startDate)) return false;
        if (endDate && vDate > new Date(endDate)) return false;
        return true;
      });
    }

    // Limit results
    vitals = vitals.slice(-parseInt(limit));

    res.json({ success: true, vitals, count: vitals.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== HEALTH TRIAGE ROUTES ====================

// Create/Update Triage
app.post('/api/triage', authenticateToken, async (req, res) => {
  try {
    const { inputData } = req.body;

    if (!inputData) {
      return res.status(400).json({ error: 'Input data required' });
    }

    // Simple triage logic (you can replace with ML model call)
    let pathway = 'wellness';
    let riskLevel = 'low';
    let requiresDoctor = false;
    const recommendations = [];

    // Check for chronic conditions
    const hasChronicCondition = inputData.conditions?.some(c => 
      ['diabetes', 'hypertension', 'heart_disease', 'copd', 'asthma'].includes(c.toLowerCase())
    );

    // Check vitals and lifestyle
    const highBMI = inputData.bmi > 30;
    const highStress = inputData.lifestyle?.stress_level > 7;
    const poorSleep = inputData.lifestyle?.sleep_hours < 6;

    // Determine pathway
    if (hasChronicCondition) {
      pathway = 'expert';
      riskLevel = 'moderate';
      requiresDoctor = true;
      recommendations.push('Consult with a specialist for your chronic condition');
      recommendations.push('Regular monitoring of vitals is essential');
    }

    if (highBMI) {
      riskLevel = riskLevel === 'low' ? 'moderate' : 'high';
      recommendations.push('Weight management program recommended');
      recommendations.push('Consult nutritionist for personalized diet plan');
    }

    if (highStress || poorSleep) {
      recommendations.push('Stress management techniques recommended');
      recommendations.push('Improve sleep hygiene - aim for 7-8 hours');
    }

    // Create triage record
    const triage = await Triage.create({
      userId: req.user.userId,
      inputData,
      pathway,
      riskLevel,
      recommendations,
      requiresDoctor,
      aiConfidence: 0.85
    });

    // Update user's health profile
    const user = await User.findById(req.user.userId);
    user.healthProfile = { ...user.healthProfile, ...inputData };
    await user.save();

    // Create notification
    await createNotification(
      req.user.userId,
      'system',
      'Health Assessment Complete',
      `Your health pathway is: ${pathway.toUpperCase()}. ${requiresDoctor ? 'Expert consultation recommended.' : 'Follow personalized wellness plan.'}`
    );

    res.json({
      success: true,
      triage,
      message: requiresDoctor 
        ? 'Expert pathway recommended. Please consult with a doctor.' 
        : 'Wellness pathway assigned. Follow your personalized plan.'
    });
  } catch (error) {
    console.error('Triage Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Latest Triage
app.get('/api/triage/latest', authenticateToken, async (req, res) => {
  try {
    const triage = await Triage.findOne({ userId: req.user.userId })
      .sort({ triageDate: -1 });

    if (!triage) {
      return res.status(404).json({ error: 'No triage found' });
    }

    res.json({ success: true, triage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== MEAL PLAN ROUTES ====================

// Generate Meal Plan (ML Model Integration)
app.post('/api/meal-plan/generate', authenticateToken, async (req, res) => {
  try {
    const { inputParams } = req.body;

    if (!inputParams) {
      return res.status(400).json({ error: 'Input parameters required' });
    }

    // Call your ML model API
    const mlModelUrl = process.env.MEAL_PLAN_ML_URL || 'http://localhost:8000/predict';
    
    let mlResponse;
    try {
      mlResponse = await axios.post(mlModelUrl, inputParams);
    } catch (mlError) {
      console.error('ML Model Error:', mlError.message);
      // Fallback to rule-based plan
      mlResponse = { data: generateFallbackMealPlan(inputParams) };
    }

    // Save meal plan
    const mealPlan = await MealPlan.create({
      userId: req.user.userId,
      inputParams,
      plan: mlResponse.data,
      generatedBy: 'ml_model',
      isActive: true,
      startDate: new Date()
    });

    // Deactivate old plans
    await MealPlan.updateMany(
      { userId: req.user.userId, _id: { $ne: mealPlan._id } },
      { isActive: false }
    );

    await createNotification(
      req.user.userId,
      'system',
      'New Meal Plan Generated',
      'Your personalized meal plan is ready!'
    );

    res.json({ 
      success: true, 
      mealPlan,
      message: 'Meal plan generated successfully'
    });
  } catch (error) {
    console.error('Meal Plan Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Active Meal Plan
app.get('/api/meal-plan/active', authenticateToken, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOne({ 
      userId: req.user.userId, 
      isActive: true 
    }).sort({ createdAt: -1 });

    if (!mealPlan) {
      return res.status(404).json({ error: 'No active meal plan found' });
    }

    res.json({ success: true, mealPlan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Meal Plans
app.get('/api/meal-plan/history', authenticateToken, async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, mealPlans, count: mealPlans.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== EXERCISE PLAN ROUTES ====================

// Generate Exercise Plan (ML Model Integration)
app.post('/api/exercise-plan/generate', authenticateToken, async (req, res) => {
  try {
    const { inputParams } = req.body;

    if (!inputParams) {
      return res.status(400).json({ error: 'Input parameters required' });
    }

    // Call your ML model API
    const mlModelUrl = process.env.EXERCISE_PLAN_ML_URL || 'http://localhost:8001/predict';
    
    let mlResponse;
    try {
      mlResponse = await axios.post(mlModelUrl, inputParams);
    } catch (mlError) {
      console.error('ML Model Error:', mlError.message);
      // Fallback to rule-based plan
      mlResponse = { data: generateFallbackExercisePlan(inputParams) };
    }

    // Save exercise plan
    const exercisePlan = await ExercisePlan.create({
      userId: req.user.userId,
      inputParams,
      plan: mlResponse.data,
      generatedBy: 'ml_model',
      isActive: true,
      startDate: new Date()
    });

    // Deactivate old plans
    await ExercisePlan.updateMany(
      { userId: req.user.userId, _id: { $ne: exercisePlan._id } },
      { isActive: false }
    );

    await createNotification(
      req.user.userId,
      'system',
      'New Exercise Plan Generated',
      'Your personalized workout plan is ready!'
    );

    res.json({ 
      success: true, 
      exercisePlan,
      message: 'Exercise plan generated successfully'
    });
  } catch (error) {
    console.error('Exercise Plan Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Active Exercise Plan
app.get('/api/exercise-plan/active', authenticateToken, async (req, res) => {
  try {
    const exercisePlan = await ExercisePlan.findOne({ 
      userId: req.user.userId, 
      isActive: true 
    }).sort({ createdAt: -1 });

    if (!exercisePlan) {
      return res.status(404).json({ error: 'No active exercise plan found' });
    }

    res.json({ success: true, exercisePlan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Exercise Plans
app.get('/api/exercise-plan/history', authenticateToken, async (req, res) => {
  try {
    const exercisePlans = await ExercisePlan.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, exercisePlans, count: exercisePlans.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PROGRESS LOG ROUTES ====================

// Create Progress Log
app.post('/api/progress', authenticateToken, async (req, res) => {
  try {
    const { vitals, activity, nutrition, wellness, notes, photos } = req.body;

    const progressLog = await ProgressLog.create({
      userId: req.user.userId,
      date: new Date(),
      vitals,
      activity,
      nutrition,
      wellness,
      notes,
      photos
    });

    // Check if goals met
    if (activity?.workout_completed) {
      await createNotification(
        req.user.userId,
        'reminder',
        'Great Job!',
        'You completed your workout today. Keep it up!'
      );
    }

    res.json({ 
      success: true, 
      progressLog,
      message: 'Progress logged successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Progress Logs
app.get('/api/progress', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate, limit = 30 } = req.query;

    const query = { userId: req.user.userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const logs = await ProgressLog.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json({ success: true, logs, count: logs.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Progress Statistics
app.get('/api/progress/stats', authenticateToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const logs = await ProgressLog.find({
      userId: req.user.userId,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    // Calculate statistics
    const stats = {
      totalLogs: logs.length,
      averages: {
        weight_kg: 0,
        steps: 0,
        calories_consumed: 0,
        calories_burned: 0,
        sleep_hours: 0,
        water_liters: 0,
        stress_level: 0
      },
      trends: {
        weight: [],
        steps: [],
        sleep: []
      },
      workoutCompletion: 0
    };

    let totalWeight = 0, totalSteps = 0, totalCaloriesIn = 0, totalCaloriesOut = 0;
    let totalSleep = 0, totalWater = 0, totalStress = 0;
    let workoutsCompleted = 0;
    let countWeight = 0, countSteps = 0, countCaloriesIn = 0, countCaloriesOut = 0;
    let countSleep = 0, countWater = 0, countStress = 0;

    logs.forEach(log => {
      if (log.vitals?.weight_kg) {
        totalWeight += log.vitals.weight_kg;
        countWeight++;
        stats.trends.weight.push({ date: log.date, value: log.vitals.weight_kg });
      }
      if (log.activity?.steps) {
        totalSteps += log.activity.steps;
        countSteps++;
        stats.trends.steps.push({ date: log.date, value: log.activity.steps });
      }
      if (log.nutrition?.calories_consumed) {
        totalCaloriesIn += log.nutrition.calories_consumed;
        countCaloriesIn++;
      }
      if (log.activity?.calories_burned) {
        totalCaloriesOut += log.activity.calories_burned;
        countCaloriesOut++;
      }
      if (log.wellness?.sleep_hours) {
        totalSleep += log.wellness.sleep_hours;
        countSleep++;
        stats.trends.sleep.push({ date: log.date, value: log.wellness.sleep_hours });
      }
      if (log.nutrition?.water_liters) {
        totalWater += log.nutrition.water_liters;
        countWater++;
      }
      if (log.wellness?.stress_level) {
        totalStress += log.wellness.stress_level;
        countStress++;
      }
      if (log.activity?.workout_completed) {
        workoutsCompleted++;
      }
    });

    stats.averages.weight_kg = countWeight ? (totalWeight / countWeight).toFixed(1) : 0;
    stats.averages.steps = countSteps ? Math.round(totalSteps / countSteps) : 0;
    stats.averages.calories_consumed = countCaloriesIn ? Math.round(totalCaloriesIn / countCaloriesIn) : 0;
    stats.averages.calories_burned = countCaloriesOut ? Math.round(totalCaloriesOut / countCaloriesOut) : 0;
    stats.averages.sleep_hours = countSleep ? (totalSleep / countSleep).toFixed(1) : 0;
    stats.averages.water_liters = countWater ? (totalWater / countWater).toFixed(1) : 0;
    stats.averages.stress_level = countStress ? (totalStress / countStress).toFixed(1) : 0;
    stats.workoutCompletion = logs.length ? ((workoutsCompleted / logs.length) * 100).toFixed(1) : 0;

    res.json({ success: true, stats, period: `${days} days` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== DOCTOR ROUTES ====================

// Get All Doctors
app.get('/api/doctors', authenticateToken, async (req, res) => {
  try {
    const { specialization, verified } = req.query;

    const query = { role: 'doctor', isActive: true };
    
    if (specialization) {
      query['doctorProfile.specialization'] = new RegExp(specialization, 'i');
    }
    
    if (verified !== undefined) {
      query['doctorProfile.isVerified'] = verified === 'true';
    }

    const doctors = await Doctor.find(query)
      .select('-password')
      .sort({ 'doctorProfile.rating': -1 });

    res.json({ success: true, doctors, count: doctors.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Doctor Profile
app.get('/api/doctor/:doctorId', authenticateToken, async (req, res) => {
  try {
    const doctor = await User.findOne({ 
      _id: req.params.doctorId, 
      role: 'doctor' 
    }).select('-password');

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Get total consultations
    const totalConsultations = await Consultation.countDocuments({
      doctorId: doctor._id,
      status: 'completed'
    });

    res.json({ 
      success: true, 
      doctor,
      stats: { totalConsultations }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Doctor Profile
app.put('/api/doctor/profile', authenticateToken, checkRole('doctor'), async (req, res) => {
  try {
    const { doctorProfile } = req.body;

    const doctor = await User.findById(req.user.userId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    doctor.doctorProfile = { ...doctor.doctorProfile, ...doctorProfile };
    doctor.updatedAt = new Date();
    await doctor.save();

    res.json({ 
      success: true, 
      message: 'Doctor profile updated successfully',
      doctor 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Doctor's Patients (Premium Users Assigned)
app.get('/api/doctor/patients', authenticateToken, checkRole('doctor'), async (req, res) => {
  try {
    const patients = await User.find({ 
      assignedDoctor: req.user.userId,
      role: 'user'
    }).select('-password');

    res.json({ success: true, patients, count: patients.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Patient Health Summary (For Doctor)
app.get('/api/doctor/patient/:patientId/summary', authenticateToken, checkRole('doctor'), async (req, res) => {
  try {
    const { patientId } = req.params;

    // Verify patient is assigned to this doctor
    const patient = await User.findOne({
      _id: patientId,
      assignedDoctor: req.user.userId
    }).select('-password');

    if (!patient) {
      return res.status(403).json({ error: 'Access denied or patient not found' });
    }

    // Get recent vitals
    const recentVitals = patient.vitalsHistory.slice(-10).reverse();

    // Get recent progress logs
    const recentLogs = await ProgressLog.find({ userId: patientId })
      .sort({ date: -1 })
      .limit(7);

    // Get active plans
    const activeMealPlan = await MealPlan.findOne({ 
      userId: patientId, 
      isActive: true 
    });

    const activeExercisePlan = await ExercisePlan.findOne({ 
      userId: patientId, 
      isActive: true 
    });

    // Get consultations history
    const consultations = await Consultation.find({
      patientId,
      doctorId: req.user.userId
    }).sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      patient,
      recentVitals,
      recentLogs,
      activeMealPlan,
      activeExercisePlan,
      consultations
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CONSULTATION ROUTES ====================

// Create Consultation Request
app.post('/api/consultation/request', authenticateToken, checkRole('user'), async (req, res) => {
  try {
    const { doctorId, scheduledDate, scheduledTime, complaint, symptoms, duration } = req.body;

    if (!doctorId || !scheduledDate || !complaint) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user is premium
    const user = await User.findById(req.user.userId);
    if (!user.isPremium || (user.premiumExpiry && user.premiumExpiry < new Date())) {
      return res.status(403).json({ error: 'Premium subscription required for consultations' });
    }

    // Verify doctor exists
    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const consultation = await Consultation.create({
      patientId: req.user.userId,
      doctorId,
      scheduledDate,
      scheduledTime,
      duration_min: duration || 30,
      complaint,
      symptoms,
      type: 'scheduled',
      status: 'pending'
    });

    // Create notifications
    await createNotification(
      doctorId,
      'consultation',
      'New Consultation Request',
      `New consultation request from ${user.firstName} ${user.lastName}`,
      { consultationId: consultation._id }
    );

    await createNotification(
      req.user.userId,
      'consultation',
      'Consultation Requested',
      `Your consultation with Dr. ${doctor.firstName} ${doctor.lastName} has been requested`,
      { consultationId: consultation._id }
    );

    res.json({ 
      success: true, 
      consultation,
      message: 'Consultation request sent successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User's Consultations
app.get('/api/consultation/my', authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;

    const query = {};
    
    if (req.user.role === 'user') {
      query.patientId = req.user.userId;
    } else if (req.user.role === 'doctor') {
      query.doctorId = req.user.userId;
    }

    if (status) {
      query.status = status;
    }

    const consultations = await Consultation.find(query)
      .populate('patientId', 'firstName lastName email healthProfile')
      .populate('doctorId', 'firstName lastName doctorProfile')
      .sort({ scheduledDate: -1 });

    res.json({ success: true, consultations, count: consultations.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Consultation Details
app.get('/api/consultation/:consultationId', authenticateToken, async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.consultationId)
      .populate('patientId', 'firstName lastName email phone healthProfile vitalsHistory')
      .populate('doctorId', 'firstName lastName doctorProfile');

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    // Check access
    if (req.user.role === 'user' && consultation.patientId._id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    if (req.user.role === 'doctor' && consultation.doctorId._id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ success: true, consultation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Consultation Status (Doctor)
app.put('/api/consultation/:consultationId/status', authenticateToken, checkRole('doctor'), async (req, res) => {
  try {
    const { status } = req.body;

    const consultation = await Consultation.findOne({
      _id: req.params.consultationId,
      doctorId: req.user.userId
    });

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    consultation.status = status;
    consultation.updatedAt = new Date();
    await consultation.save();

    // Notify patient
    await createNotification(
      consultation.patientId,
      'consultation',
      'Consultation Updated',
      `Your consultation status has been updated to: ${status}`,
      { consultationId: consultation._id }
    );

    res.json({ 
      success: true, 
      consultation,
      message: 'Consultation status updated'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Consultation Notes (Doctor)
app.put('/api/consultation/:consultationId/notes', authenticateToken, checkRole('doctor'), async (req, res) => {
  try {
    const { notes, vitals, diagnosis, prescriptions, labTests, followUpDate, followUpNotes } = req.body;

    const consultation = await Consultation.findOne({
      _id: req.params.consultationId,
      doctorId: req.user.userId
    });

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    if (notes) consultation.notes = { ...consultation.notes, ...notes };
    if (vitals) consultation.vitals = vitals;
    if (diagnosis) consultation.diagnosis = diagnosis;
    if (prescriptions) consultation.prescriptions = prescriptions;
    if (labTests) consultation.labTests = labTests;
    if (followUpDate) consultation.followUpDate = followUpDate;
    if (followUpNotes) consultation.followUpNotes = followUpNotes;

    consultation.status = 'completed';
    consultation.updatedAt = new Date();
    await consultation.save();

    // Update doctor stats
    const doctor = await User.findById(req.user.userId);
    doctor.doctorProfile.totalConsultations += 1;
    await doctor.save();

    // Notify patient
    await createNotification(
      consultation.patientId,
      'consultation',
      'Consultation Completed',
      'Your consultation notes and prescription are ready',
      { consultationId: consultation._id }
    );

    res.json({ 
      success: true, 
      consultation,
      message: 'Consultation notes added successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rate Consultation (Patient)
app.put('/api/consultation/:consultationId/rate', authenticateToken, checkRole('user'), async (req, res) => {
  try {
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const consultation = await Consultation.findOne({
      _id: req.params.consultationId,
      patientId: req.user.userId,
      status: 'completed'
    });

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found or not completed' });
    }

    consultation.rating = rating;
    consultation.feedback = feedback;
    await consultation.save();

    // Update doctor's average rating
    const doctor = await User.findById(consultation.doctorId);
    const allRatings = await Consultation.find({
      doctorId: consultation.doctorId,
      rating: { $exists: true }
    });

    const avgRating = allRatings.reduce((sum, c) => sum + c.rating, 0) / allRatings.length;
    doctor.doctorProfile.rating = parseFloat(avgRating.toFixed(2));
    await doctor.save();

    res.json({ 
      success: true, 
      consultation,
      message: 'Thank you for your feedback!'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== MESSAGING ROUTES ====================

// Send Message
app.post('/api/messages/send', authenticateToken, async (req, res) => {
  try {
    const { receiverId, message, consultationId, attachments } = req.body;

    if (!receiverId || !message) {
      return res.status(400).json({ error: 'Receiver and message required' });
    }

    // Verify receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    // Check if messaging is allowed (premium users with assigned doctor)
    if (req.user.role === 'user') {
      const user = await User.findById(req.user.userId);
      if (!user.isPremium) {
        return res.status(403).json({ error: 'Premium subscription required for messaging' });
      }
      if (user.assignedDoctor?.toString() !== receiverId) {
        return res.status(403).json({ error: 'Can only message your assigned doctor' });
      }
    }

    const newMessage = await Message.create({
      senderId: req.user.userId,
      receiverId,
      message,
      consultationId,
      attachments
    });

    // Notify receiver
    const sender = await User.findById(req.user.userId);
    await createNotification(
      receiverId,
      'message',
      'New Message',
      `New message from ${sender.firstName} ${sender.lastName}`,
      { messageId: newMessage._id }
    );

    res.json({ 
      success: true, 
      message: newMessage
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Messages with User
app.get('/api/messages/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    const messages = await Message.find({
      $or: [
        { senderId: req.user.userId, receiverId: userId },
        { senderId: userId, receiverId: req.user.userId }
      ]
    })
    .sort({ createdAt: 1 })
    .limit(parseInt(limit))
    .populate('senderId', 'firstName lastName role')
    .populate('receiverId', 'firstName lastName role');

    // Mark messages as read
    await Message.updateMany(
      { senderId: userId, receiverId: req.user.userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({ success: true, messages, count: messages.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Message Threads
app.get('/api/messages/threads', authenticateToken, async (req, res) => {
  try {
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: new mongoose.Types.ObjectId(req.user.userId) },
            { receiverId: new mongoose.Types.ObjectId(req.user.userId) }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', new mongoose.Types.ObjectId(req.user.userId)] },
              '$receiverId',
              '$senderId'
            ]
          },
          lastMessage: { $first: '$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiverId', new mongoose.Types.ObjectId(req.user.userId)] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Populate user details
    await User.populate(messages, { 
      path: 'lastMessage.senderId lastMessage.receiverId _id',
      select: 'firstName lastName role doctorProfile'
    });

    res.json({ success: true, threads: messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== NOTIFICATION ROUTES ====================

// Get User Notifications
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const { unreadOnly, limit = 50 } = req.query;

    const query = { userId: req.user.userId };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const unreadCount = await Notification.countDocuments({
      userId: req.user.userId,
      isRead: false
    });

    res.json({ 
      success: true, 
      notifications, 
      unreadCount,
      count: notifications.length 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark Notification as Read
app.put('/api/notifications/:notificationId/read', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.notificationId, userId: req.user.userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark All Notifications as Read
app.put('/api/notifications/read-all', authenticateToken, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ADMIN ROUTES ====================

// Get All Users (Admin)
app.get('/api/admin/users', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    const { role, isPremium, page = 1, limit = 50 } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isPremium !== undefined) query.isPremium = isPremium === 'true';

    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({ 
      success: true, 
      users, 
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User Premium Status (Admin)
app.put('/api/admin/user/:userId/premium', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    const { isPremium, premiumDuration } = req.body;

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isPremium = isPremium;
    
    if (isPremium && premiumDuration) {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + parseInt(premiumDuration));
      user.premiumExpiry = expiry;
    }

    await user.save();

    await createNotification(
      user._id,
      'system',
      'Premium Status Updated',
      isPremium ? 'Your account has been upgraded to Premium!' : 'Your premium subscription has expired'
    );

    res.json({ 
      success: true, 
      user,
      message: 'Premium status updated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Assign Doctor to User (Admin)
app.put('/api/admin/user/:userId/assign-doctor', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    const { doctorId } = req.body;

    const user = await User.findById(req.params.userId);
    if (!user || user.role !== 'user') {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.isPremium) {
      return res.status(400).json({ error: 'User must have premium subscription' });
    }

    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    user.assignedDoctor = doctorId;
    await user.save();

    await createNotification(
      user._id,
      'system',
      'Doctor Assigned',
      `Dr. ${doctor.firstName} ${doctor.lastName} has been assigned to you`
    );

    await createNotification(
      doctorId,
      'system',
      'New Patient Assigned',
      `${user.firstName} ${user.lastName} has been assigned to you`
    );

    res.json({ 
      success: true, 
      user,
      message: 'Doctor assigned successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify Doctor (Admin)
app.put('/api/admin/doctor/:doctorId/verify', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    const { isVerified } = req.body;

    const doctor = await User.findOne({ 
      _id: req.params.doctorId, 
      role: 'doctor' 
    });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    doctor.doctorProfile.isVerified = isVerified;
    await doctor.save();

    await createNotification(
      doctor._id,
      'system',
      'Verification Status Updated',
      isVerified ? 'Your profile has been verified!' : 'Your verification has been revoked'
    );

    res.json({ 
      success: true, 
      doctor,
      message: 'Doctor verification status updated'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Platform Statistics (Admin)
app.get('/api/admin/stats', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const premiumUsers = await User.countDocuments({ role: 'user', isPremium: true });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const verifiedDoctors = await User.countDocuments({ 
      role: 'doctor', 
      'doctorProfile.isVerified': true 
    });
    const totalConsultations = await Consultation.countDocuments();
    const pendingConsultations = await Consultation.countDocuments({ status: 'pending' });
    const completedConsultations = await Consultation.countDocuments({ status: 'completed' });
    const activeMealPlans = await MealPlan.countDocuments({ isActive: true });
    const activeExercisePlans = await ExercisePlan.countDocuments({ isActive: true });

    // Recent activity
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentConsultations = await Consultation.find()
      .populate('patientId', 'firstName lastName')
      .populate('doctorId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          premium: premiumUsers,
          regular: totalUsers - premiumUsers
        },
        doctors: {
          total: totalDoctors,
          verified: verifiedDoctors,
          unverified: totalDoctors - verifiedDoctors
        },
        consultations: {
          total: totalConsultations,
          pending: pendingConsultations,
          completed: completedConsultations
        },
        plans: {
          activeMealPlans,
          activeExercisePlans
        }
      },
      recentActivity: {
        users: recentUsers,
        consultations: recentConsultations
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deactivate User (Admin)
app.put('/api/admin/user/:userId/deactivate', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isActive = isActive;
    await user.save();

    res.json({ 
      success: true, 
      user,
      message: isActive ? 'User activated' : 'User deactivated'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PREMIUM SUBSCRIPTION ROUTES ====================

// Upgrade to Premium
app.post('/api/subscription/upgrade', authenticateToken, checkRole('user'), async (req, res) => {
  try {
    const { plan, paymentMethod } = req.body; // plan: monthly, quarterly, yearly

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate expiry date
    const durations = {
      monthly: 30,
      quarterly: 90,
      yearly: 365
    };

    const duration = durations[plan] || 30;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + duration);

    user.isPremium = true;
    user.premiumExpiry = expiry;
    await user.save();

    await createNotification(
      user._id,
      'system',
      'Premium Upgrade Successful',
      `Your ${plan} premium subscription is now active!`
    );

    res.json({
      success: true,
      message: 'Premium subscription activated',
      premiumExpiry: expiry,
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel Premium
app.post('/api/subscription/cancel', authenticateToken, checkRole('user'), async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isPremium = false;
    user.premiumExpiry = null;
    user.assignedDoctor = null;
    await user.save();

    await createNotification(
      user._id,
      'system',
      'Premium Subscription Cancelled',
      'Your premium subscription has been cancelled'
    );

    res.json({
      success: true,
      message: 'Premium subscription cancelled',
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== DOCTOR CREATED PLANS ====================

// Doctor Creates Meal Plan for Patient
app.post('/api/doctor/meal-plan/:patientId', authenticateToken, checkRole('doctor'), async (req, res) => {
  try {
    const { patientId } = req.params;
    const { plan } = req.body;

    // Verify patient is assigned to doctor
    const patient = await User.findOne({
      _id: patientId,
      assignedDoctor: req.user.userId
    });

    if (!patient) {
      return res.status(403).json({ error: 'Patient not assigned to you' });
    }

    // Get patient's health profile as input params
    const inputParams = {
      age: patient.healthProfile.age,
      height_cm: patient.healthProfile.height_cm,
      weight_kg: patient.healthProfile.weight_kg,
      conditions: patient.healthProfile.conditions
    };

    const mealPlan = await MealPlan.create({
      userId: patientId,
      inputParams,
      plan,
      generatedBy: 'doctor',
      doctorId: req.user.userId,
      isActive: true,
      startDate: new Date()
    });

    // Deactivate old plans
    await MealPlan.updateMany(
      { userId: patientId, _id: { $ne: mealPlan._id } },
      { isActive: false }
    );

    await createNotification(
      patientId,
      'system',
      'New Meal Plan from Doctor',
      `Dr. ${(await User.findById(req.user.userId)).firstName} has created a new meal plan for you`
    );

    res.json({
      success: true,
      mealPlan,
      message: 'Meal plan created successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Doctor Creates Exercise Plan for Patient
app.post('/api/doctor/exercise-plan/:patientId', authenticateToken, checkRole('doctor'), async (req, res) => {
  try {
    const { patientId } = req.params;
    const { plan } = req.body;

    // Verify patient is assigned to doctor
    const patient = await User.findOne({
      _id: patientId,
      assignedDoctor: req.user.userId
    });

    if (!patient) {
      return res.status(403).json({ error: 'Patient not assigned to you' });
    }

    // Get patient's health profile as input params
    const inputParams = {
      age: patient.healthProfile.age,
      weight_kg: patient.healthProfile.weight_kg,
      height_cm: patient.healthProfile.height_cm,
      bmi: patient.healthProfile.bmi,
      conditions: patient.healthProfile.conditions
    };

    const exercisePlan = await ExercisePlan.create({
      userId: patientId,
      inputParams,
      plan,
      generatedBy: 'doctor',
      doctorId: req.user.userId,
      isActive: true,
      startDate: new Date()
    });

    // Deactivate old plans
    await ExercisePlan.updateMany(
      { userId: patientId, _id: { $ne: exercisePlan._id } },
      { isActive: false }
    );

    await createNotification(
      patientId,
      'system',
      'New Exercise Plan from Doctor',
      `Dr. ${(await User.findById(req.user.userId)).firstName} has created a new exercise plan for you`
    );

    res.json({
      success: true,
      exercisePlan,
      message: 'Exercise plan created successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== FALLBACK FUNCTIONS ====================

function generateFallbackMealPlan(params) {
  const { fitness_goal, has_diabetes, has_hypertension, tdee } = params;
  
  let targetCalories = tdee;
  if (fitness_goal === 'weight_loss') targetCalories = tdee - 500;
  if (fitness_goal === 'weight_gain') targetCalories = tdee + 500;

  return {
    daily_calories: targetCalories,
    macros: {
      protein_g: Math.round(targetCalories * 0.3 / 4),
      carbs_g: Math.round(targetCalories * 0.4 / 4),
      fats_g: Math.round(targetCalories * 0.3 / 9)
    },
    meals: [
      {
        meal_type: 'breakfast',
        name: 'Healthy Breakfast',
        calories: Math.round(targetCalories * 0.25),
        protein_g: 20,
        carbs_g: 40,
        fats_g: 10,
        ingredients: ['Oats', 'Milk', 'Banana', 'Almonds'],
        instructions: 'Cook oats with milk, top with banana and almonds',
        time: '08:00'
      },
      {
        meal_type: 'lunch',
        name: 'Balanced Lunch',
        calories: Math.round(targetCalories * 0.35),
        protein_g: 30,
        carbs_g: 50,
        fats_g: 15,
        ingredients: ['Chicken', 'Rice', 'Vegetables', 'Olive Oil'],
        instructions: 'Grilled chicken with brown rice and steamed vegetables',
        time: '13:00'
      },
      {
        meal_type: 'dinner',
        name: 'Light Dinner',
        calories: Math.round(targetCalories * 0.3),
        protein_g: 25,
        carbs_g: 35,
        fats_g: 12,
        ingredients: ['Fish', 'Quinoa', 'Salad'],
        instructions: 'Baked fish with quinoa and fresh salad',
        time: '19:00'
      }
    ],
    hydration_liters: 2.5,
    supplements: has_diabetes ? ['Vitamin D', 'Omega-3'] : ['Multivitamin'],
    restrictions: [
      has_diabetes ? 'Low sugar, complex carbs only' : '',
      has_hypertension ? 'Low sodium' : ''
    ].filter(Boolean)
  };
}

function generateFallbackExercisePlan(params) {
  const { fitness_goal, experience_level, days_per_week, conditions } = params;
  
  const hasCondition = conditions && conditions.length > 0;
  const intensity = hasCondition ? 'low' : (experience_level === 'beginner' ? 'moderate' : 'high');

  return {
    weekly_schedule: Array.from({ length: days_per_week }, (_, i) => ({
      day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i],
      exercises: [
        {
          name: 'Brisk Walk',
          type: 'cardio',
          sets: null,
          reps: null,
          duration: '20 min',
          intensity: 'low',
          rest_seconds: null,
          instructions: 'Walk at a comfortable but brisk pace',
          precautions: hasCondition ? ['Monitor heart rate', 'Stop if dizzy'] : []
        },
        {
          name: 'Bodyweight Squats',
          type: 'strength',
          sets: 3,
          reps: 12,
          duration: null,
          intensity: intensity,
          rest_seconds: 60,
          instructions: 'Keep back straight, knees behind toes',
          precautions: []
        },
        {
          name: 'Stretching',
          type: 'flexibility',
          sets: null,
          reps: null,
          duration: '10 min',
          intensity: 'low',
          rest_seconds: null,
          instructions: 'Hold each stretch for 30 seconds',
          precautions: []
        }
      ],
      total_duration_min: 45,
      calories_burned: 250
    })),
    warm_up: ['Light jogging in place - 3 min', 'Arm circles - 1 min', 'Leg swings - 2 min'],
    cool_down: ['Walking - 3 min', 'Full body stretching - 5 min'],
    weekly_goal: fitness_goal === 'weight_loss' ? 'Burn 1500 calories' : 'Build strength and endurance',
    safety_notes: hasCondition 
      ? ['Consult doctor before starting', 'Monitor vitals', 'Start slow', 'Stay hydrated']
      : ['Stay hydrated', 'Listen to your body', 'Rest when needed']
  };
}

// ==================== ERROR HANDLING ====================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path 
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ==================== SERVER START ====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Healthcare Platform Server`);
  console.log(`📍 Running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Documentation:`);
  console.log(`   - Auth: /api/auth/*`);
  console.log(`   - Users: /api/user/*`);
  console.log(`   - Doctors: /api/doctor/*`);
  console.log(`   - Triage: /api/triage/*`);
  console.log(`   - Plans: /api/meal-plan/*, /api/exercise-plan/*`);
  console.log(`   - Progress: /api/progress/*`);
  console.log(`   - Consultations: /api/consultation/*`);
  console.log(`   - Messages: /api/messages/*`);
  console.log(`   - Admin: /api/admin/*\n`);
});