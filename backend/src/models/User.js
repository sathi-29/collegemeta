const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },
  avatar: String,
  
  // Role (like Careers360 user types)
  role: {
    type: String,
    enum: ['student', 'parent', 'counselor', 'college_rep', 'admin'],
    default: 'student'
  },
  
  // Academic Profile (like Careers360 profile)
  academicProfile: {
    currentEducation: {
      level: String,
      stream: String,
      board: String,
      school: String,
      percentage: Number,
      yearOfPassing: Number
    },
    entranceExams: [{
      examName: String,
      score: Number,
      rank: Number,
      percentile: Number,
      year: Number,
      attempt: Number
    }],
    preferredExams: [String]
  },
  
  // Preferences (like Careers360 recommendations)
  preferences: {
    preferredStreams: [String],
    preferredLocations: [{
      state: String,
      city: String
    }],
    budgetRange: {
      min: Number,
      max: Number
    },
    preferredCollegeTypes: [String]
  },
  
  // Saved Items (like Careers360 bookmarks)
  savedColleges: [{
    college: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
    addedAt: { type: Date, default: Date.now }
  }],
  savedExams: [{
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
    addedAt: { type: Date, default: Date.now }
  }],
  savedCourses: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    addedAt: { type: Date, default: Date.now }
  }],
  
  // Applications (like Careers360 application tracker)
  applications: [{
    college: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
    course: String,
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'accepted', 'rejected', 'waitlisted'],
      default: 'draft'
    },
    appliedDate: Date,
    applicationId: String,
    documents: [{
      name: String,
      url: String,
      uploadedAt: Date
    }]
  }],
  
  // Enrolled Courses (like Careers360 learning)
  enrolledCourses: [{
    courseId: String,
    courseName: String,
    provider: String,
    enrolledAt: Date,
    completedAt: Date,
    progress: Number,
    certificateUrl: String
  }],
  
  // Counseling Sessions (like Careers360 counseling)
  counselingSessions: [{
    counselor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: Date,
    duration: Number,
    notes: String,
    rating: Number,
    feedback: String
  }],
  
  // Reviews Given
  reviews: [{
    entityType: { type: String, enum: ['college', 'exam', 'course'] },
    entityId: mongoose.Schema.Types.ObjectId,
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Notifications Preferences
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    categories: [String]
  },
  
  // Subscription (like Careers360 premium)
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    features: [String]
  },
  
  // Analytics
  lastLogin: Date,
  totalLogins: { type: Number, default: 0 },
  searchHistory: [{
    query: String,
    timestamp: { type: Date, default: Date.now }
  }],
  
  // Verification
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  // Profile Completion
  profileCompletion: { type: Number, default: 0 },
  isProfileComplete: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update profile completion
userSchema.methods.updateProfileCompletion = function() {
  let completion = 0;
  const fields = [
    this.name ? 10 : 0,
    this.email ? 10 : 0,
    this.phone ? 10 : 0,
    this.academicProfile?.currentEducation?.level ? 15 : 0,
    this.academicProfile?.currentEducation?.stream ? 15 : 0,
    this.preferences?.preferredStreams?.length > 0 ? 20 : 0,
    this.avatar ? 10 : 0,
    this.academicProfile?.entranceExams?.length > 0 ? 10 : 0
  ];
  
  completion = fields.reduce((sum, val) => sum + val, 0);
  this.profileCompletion = Math.min(100, completion);
  this.isProfileComplete = this.profileCompletion >= 70;
  return this.profileCompletion;
};

module.exports = mongoose.model('User', userSchema);