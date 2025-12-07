const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careers360')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Import Models
const College = require('./models/College');
const Exam = require('./models/Exam');
const Course = require('./models/Course');
const User = require('./models/User');

// ==================== ROUTES ====================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ==================== COLLEGE ROUTES ====================

// Get all colleges with filters (like Careers360)
app.get('/api/colleges', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      location = '',
      stream = '',
      exam = '',
      ownership = '',
      ratings = '',
      sort = '-ratings.overall'
    } = req.query;

    let query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortName: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'courses.name': { $regex: search, $options: 'i' } }
      ];
    }

    // Location filter
    if (location) {
      query['location.state'] = new RegExp(location, 'i');
    }

    // Stream filter
    if (stream) {
      query['courses.name'] = new RegExp(stream, 'i');
    }

    // Exam filter
    if (exam) {
      query['admission.exams'] = new RegExp(exam, 'i');
    }

    // Ownership filter
    if (ownership) {
      query.type = ownership;
    }

    // Ratings filter
    if (ratings) {
      const minRating = parseFloat(ratings);
      query['ratings.overall'] = { $gte: minRating };
    }

    const skip = (page - 1) * limit;
    
    const colleges = await College.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('name shortName type location ratings admission courses images');

    const total = await College.countDocuments(query);

    res.json({
      success: true,
      data: colleges,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get college by ID with detailed info
app.get('/api/colleges/:id', async (req, res) => {
  try {
    const college = await College.findById(req.params.id)
      .populate('reviews')
      .populate('similarColleges');

    if (!college) {
      return res.status(404).json({ success: false, error: 'College not found' });
    }

    // Increment view count
    college.views = (college.views || 0) + 1;
    await college.save();

    res.json({ success: true, data: college });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Compare colleges (like Careers360 compare feature)
app.post('/api/colleges/compare', async (req, res) => {
  try {
    const { collegeIds } = req.body;
    
    if (!collegeIds || !Array.isArray(collegeIds) || collegeIds.length < 2) {
      return res.status(400).json({ success: false, error: 'Please select at least 2 colleges to compare' });
    }

    const colleges = await College.find({ _id: { $in: collegeIds } })
      .select('name type location establishedYear accreditation rankings courses admission placement facilities ratings');

    // Generate comparison matrix
    const comparison = {
      basicInfo: colleges.map(c => ({
        name: c.name,
        type: c.type,
        location: `${c.location.city}, ${c.location.state}`,
        established: c.establishedYear,
        accreditation: c.accreditation?.naacGrade || 'N/A'
      })),
      rankings: colleges.map(c => ({
        nirf: c.rankings?.nirf?.overall || 'N/A',
        outlook: c.rankings?.outlook || 'N/A',
        indiaToday: c.rankings?.indiaToday || 'N/A'
      })),
      fees: colleges.map(c => 
        c.courses?.[0]?.fees?.total ? `₹${(c.courses[0].fees.total/100000).toFixed(1)}L` : 'N/A'
      ),
      placement: colleges.map(c => ({
        average: c.placement?.averagePackage ? `₹${(c.placement.averagePackage/100000).toFixed(1)}L` : 'N/A',
        highest: c.placement?.highestPackage ? `₹${(c.placement.highestPackage/100000).toFixed(1)}L` : 'N/A',
        percentage: c.placement?.placementPercentage ? `${c.placement.placementPercentage}%` : 'N/A'
      })),
      ratings: colleges.map(c => ({
        overall: c.ratings?.overall || 'N/A',
        academics: c.ratings?.academics || 'N/A',
        placement: c.ratings?.placement || 'N/A',
        infrastructure: c.ratings?.infrastructure || 'N/A'
      }))
    };

    res.json({ success: true, data: { colleges, comparison } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get college cutoffs
app.get('/api/colleges/:id/cutoffs', async (req, res) => {
  try {
    const { exam, category, year } = req.query;
    const college = await College.findById(req.params.id).select('cutoffs');
    
    if (!college) {
      return res.status(404).json({ success: false, error: 'College not found' });
    }

    let cutoffs = college.cutoffs || [];
    
    // Apply filters
    if (exam) {
      cutoffs = cutoffs.filter(c => c.exam === exam);
    }
    
    if (category) {
      cutoffs = cutoffs.map(c => ({
        ...c,
        openingRank: c.openingRank[category] || c.openingRank.general,
        closingRank: c.closingRank[category] || c.closingRank.general
      }));
    }
    
    if (year) {
      cutoffs = cutoffs.filter(c => c.year === parseInt(year));
    }

    // Sort by year
    cutoffs.sort((a, b) => b.year - a.year);

    res.json({ success: true, data: cutoffs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== EXAM ROUTES ====================

// Get all exams (like Careers360 exams section)
app.get('/api/exams', async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const exams = await Exam.find(query)
      .sort({ importance: -1 })
      .select('name fullName category level conductingBody registrationDate examDate');

    res.json({ success: true, data: exams });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get exam details with resources
app.get('/api/exams/:id', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('colleges')
      .populate('preparationResources');

    if (!exam) {
      return res.status(404).json({ success: false, error: 'Exam not found' });
    }

    res.json({ success: true, data: exam });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get exam syllabus
app.get('/api/exams/:id/syllabus', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).select('syllabus');
    res.json({ success: true, data: exam?.syllabus || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get previous year papers
app.get('/api/exams/:id/papers', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).select('previousYearPapers');
    res.json({ success: true, data: exam?.previousYearPapers || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== COURSE ROUTES ====================

// Get all courses
app.get('/api/courses', async (req, res) => {
  try {
    const { stream, degree, duration, search } = req.query;
    let query = {};

    if (stream) query.stream = stream;
    if (degree) query.degree = degree;
    if (duration) query.duration = duration;
    if (search) query.name = { $regex: search, $options: 'i' };

    const courses = await Course.find(query)
      .populate('colleges')
      .sort({ popularity: -1 });

    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== USER ROUTES ====================

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, role = 'student' } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role
    });

    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save college (like Careers360 bookmark)
app.post('/api/users/save-college/:collegeId', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const collegeId = req.params.collegeId;
    
    // Check if already saved
    if (user.savedColleges.includes(collegeId)) {
      return res.status(400).json({ success: false, error: 'College already saved' });
    }

    user.savedColleges.push(collegeId);
    await user.save();

    res.json({ success: true, data: user.savedColleges });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ADMISSION PREDICTOR ====================

app.post('/api/predict-admission', async (req, res) => {
  try {
    const { exam, rank, category, state, preferredCourses } = req.body;

    // Find colleges based on criteria
    let query = {
      'admission.exams': exam,
      'courses.name': { $in: preferredCourses }
    };

    if (state) {
      query['location.state'] = state;
    }

    const colleges = await College.find(query)
      .select('name location courses admission cutoffs placement ratings')
      .limit(50);

    // Calculate predictions for each college
    const predictions = colleges.map(college => {
      let chance = 0;
      let confidence = 70;
      let factors = [];

      // Find relevant cutoff
      const cutoff = college.cutoffs?.find(c => 
        c.exam === exam && 
        preferredCourses.some(pc => college.courses.some(course => course.name === pc))
      );

      if (cutoff) {
        const categoryCutoff = cutoff.closingRank[category] || cutoff.closingRank.general;
        
        if (categoryCutoff) {
          if (rank <= categoryCutoff * 0.5) chance = 95;
          else if (rank <= categoryCutoff * 0.75) chance = 80;
          else if (rank <= categoryCutoff) chance = 60;
          else if (rank <= categoryCutoff * 1.2) chance = 40;
          else chance = 20;

          factors.push(`Rank ${rank} vs cutoff ${categoryCutoff}`);
        }
      }

      // Consider college ratings
      if (college.ratings?.overall > 4) {
        confidence += 10;
        factors.push('High college rating');
      }

      // Consider placement
      if (college.placement?.placementPercentage > 90) {
        confidence += 5;
        factors.push('Excellent placement record');
      }

      return {
        college: {
          id: college._id,
          name: college.name,
          location: college.location
        },
        prediction: {
          chance,
          confidence: Math.min(confidence, 95),
          factors,
          recommendation: chance >= 80 ? 'Safe' : chance >= 60 ? 'Moderate' : 'Reach'
        }
      };
    });

    // Sort by chance
    predictions.sort((a, b) => b.prediction.chance - a.prediction.chance);

    res.json({ success: true, data: predictions.slice(0, 20) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== NEWS & ARTICLES ====================

app.get('/api/articles', async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;
    let query = { published: true };

    if (category) {
      query.category = category;
    }

    // Mock articles data (in real app, this would come from database)
    const articles = [
      {
        id: '1',
        title: 'JEE Main 2024: Important Dates, Syllabus, Preparation Tips',
        excerpt: 'Complete guide for JEE Main 2024 preparation',
        category: 'exams',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
        publishedAt: '2024-01-15',
        readTime: '5 min'
      },
      {
        id: '2',
        title: 'Top 10 Engineering Colleges in India 2024',
        excerpt: 'NIRF ranked engineering colleges with placement details',
        category: 'colleges',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
        publishedAt: '2024-01-14',
        readTime: '7 min'
      }
    ];

    res.json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== SCHOLARSHIPS ====================

app.get('/api/scholarships', async (req, res) => {
  try {
    const { category, deadline } = req.query;
    
    // Mock scholarships data
    const scholarships = [
      {
        id: '1',
        name: 'National Scholarship Portal',
        provider: 'Government of India',
        amount: 'Up to ₹20,000/month',
        deadline: '2024-03-31',
        eligibility: '10th/12th passed students',
        category: 'merit-cum-means'
      }
    ];

    res.json({ success: true, data: scholarships });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== CAREER GUIDANCE ====================

app.post('/api/career-assessment', async (req, res) => {
  try {
    const { interests, skills, academics, personality } = req.body;
    
    // Simple career recommendation algorithm
    const careers = [];
    
    if (interests.includes('technology') || skills.includes('programming')) {
      careers.push({
        field: 'Computer Science',
        careers: ['Software Engineer', 'Data Scientist', 'Cybersecurity Analyst'],
        recommendedCourses: ['B.Tech CSE', 'B.Sc Computer Science'],
        growth: 'High'
      });
    }
    
    if (interests.includes('medicine') || academics.includes('biology')) {
      careers.push({
        field: 'Medical',
        careers: ['Doctor', 'Medical Researcher', 'Healthcare Administrator'],
        recommendedCourses: ['MBBS', 'BDS', 'B.Sc Nursing'],
        growth: 'High'
      });
    }

    res.json({ success: true, data: careers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== STATISTICS ====================

app.get('/api/stats', async (req, res) => {
  try {
    const stats = {
      totalColleges: await College.countDocuments(),
      totalExams: await Exam.countDocuments(),
      totalCourses: await Course.countDocuments(),
      totalUsers: await User.countDocuments(),
      featuredColleges: await College.countDocuments({ isFeatured: true }),
      premiumColleges: await College.countDocuments({ type: 'Institute of National Importance' })
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ERROR HANDLING ====================

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Resource not found'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Careers360 Clone Backend running on port ${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🎓 College API: http://localhost:${PORT}/api/colleges`);
  console.log(`📚 Exam API: http://localhost:${PORT}/api/exams`);
});