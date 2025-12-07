import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Search, 
  TrendingUp, 
  Star, 
  Award, 
  Users, 
  BookOpen, 
  Building,
  ChevronRight,
  Target,
  BarChart3,
  CheckCircle
} from 'lucide-react'

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStream, setSelectedStream] = useState('')

  const streams = [
    { name: 'Engineering', icon: '⚙️', color: 'bg-blue-100 text-blue-800' },
    { name: 'Medical', icon: '⚕️', color: 'bg-green-100 text-green-800' },
    { name: 'Management', icon: '📊', color: 'bg-purple-100 text-purple-800' },
    { name: 'Law', icon: '⚖️', color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Arts', icon: '🎨', color: 'bg-pink-100 text-pink-800' },
    { name: 'Science', icon: '🔬', color: 'bg-indigo-100 text-indigo-800' },
    { name: 'Commerce', icon: '💰', color: 'bg-red-100 text-red-800' },
    { name: 'Design', icon: '🎨', color: 'bg-orange-100 text-orange-800' }
  ]

  const stats = [
    { number: '50,000+', label: 'Colleges Listed', icon: <Building size={24} /> },
    { number: '100+', label: 'Exams Covered', icon: <BookOpen size={24} /> },
    { number: '10M+', label: 'Students Helped', icon: <Users size={24} /> },
    { number: '95%', label: 'Accuracy Rate', icon: <Target size={24} /> }
  ]

  const features = [
    {
      icon: <TrendingUp className="w-12 h-12 text-blue-600" />,
      title: 'College Predictor',
      description: 'Get accurate admission chances based on your rank',
      color: 'bg-blue-50'
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-green-600" />,
      title: 'Compare Colleges',
      description: 'Side-by-side comparison of top institutions',
      color: 'bg-green-50'
    },
    {
      icon: <Star className="w-12 h-12 text-yellow-600" />,
      title: 'Expert Reviews',
      description: 'Authentic reviews from students and alumni',
      color: 'bg-yellow-50'
    },
    {
      icon: <Award className="w-12 h-12 text-purple-600" />,
      title: 'Scholarship Finder',
      description: 'Discover scholarships matching your profile',
      color: 'bg-purple-50'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Your Complete Guide to
                <span className="block text-blue-300">Higher Education in India</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto mb-10">
                Discover colleges, prepare for exams, and make informed decisions for your career
              </p>
            </div>

            {/* Main Search */}
            <div className="max-w-4xl mx-auto mb-16">
              <div className="bg-white rounded-2xl shadow-2xl p-2">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1">
                    <div className="flex items-center px-4">
                      <Search className="text-gray-400 mr-3" size={24} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for colleges, exams, courses..."
                        className="w-full py-5 text-gray-900 text-lg focus:outline-none"
                      />
                    </div>
                  </div>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-5 rounded-xl md:rounded-r-xl text-lg flex items-center justify-center gap-2">
                    <Search size={20} />
                    Search
                  </button>
                </div>
              </div>
              
              {/* Quick Filters */}
              <div className="mt-6">
                <p className="text-blue-200 text-center mb-4">Popular Searches:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {['IIT Bombay', 'NEET UG', 'MBA Colleges', 'NIT Trichy', 'JEE Main'].map((tag) => (
                    <button
                      key={tag}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white"
                      onClick={() => setSearchQuery(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Stream Selection */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-center mb-8">Browse by Stream</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {streams.map((stream) => (
                  <button
                    key={stream.name}
                    onClick={() => setSelectedStream(stream.name)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${
                      selectedStream === stream.name
                        ? 'bg-white text-blue-900 transform scale-105'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <span className="text-2xl mb-2">{stream.icon}</span>
                    <span className="text-sm font-medium">{stream.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Careers360?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and resources to help you make the right education choices
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`${feature.color} rounded-2xl p-8 hover:shadow-xl transition-shadow`}
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <Link
                  to="/predictor"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Explore <ChevronRight size={16} className="ml-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Your Education Journey Today
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Join millions of students who found their perfect college through Careers360
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-700 hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              Create Free Account
            </Link>
            <Link
              to="/colleges"
              className="bg-transparent border-2 border-white hover:bg-white/10 font-bold py-4 px-8 rounded-full text-lg transition-colors"
            >
              Browse Colleges
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Latest News</h3>
              <ul className="space-y-3">
                {[
                  'JEE Main 2024 Registration Begins',
                  'NEET UG Syllabus Revised for 2024',
                  'Top 10 Engineering Colleges in India 2024',
                  'CAT 2023 Results Declared'
                ].map((news, index) => (
                  <li key={index} className="flex items-start">
                    <ChevronRight size={16} className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 hover:text-blue-600 cursor-pointer">{news}</span>
                  </li>
                ))}
              </ul>
              <Link to="/news" className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium">
                Read All News →
              </Link>
            </div>

            <div className="bg-green-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Popular Exams</h3>
              <div className="space-y-4">
                {[
                  { name: 'JEE Main', date: 'Jan 24, 2024' },
                  { name: 'NEET UG', date: 'May 5, 2024' },
                  { name: 'CAT', date: 'Nov 26, 2023' },
                  { name: 'UPSC', date: 'May 26, 2024' }
                ].map((exam, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="font-medium">{exam.name}</span>
                    <span className="text-sm text-gray-600">{exam.date}</span>
                  </div>
                ))}
              </div>
              <Link to="/exams" className="inline-block mt-4 text-green-600 hover:text-green-700 font-medium">
                View All Exams →
              </Link>
            </div>

            <div className="bg-purple-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Quick Tools</h3>
              <div className="space-y-3">
                {[
                  { name: 'College Predictor', path: '/predictor' },
                  { name: 'Scholarship Finder', path: '/scholarships' },
                  { name: 'College Compare', path: '/compare' },
                  { name: 'Career Assessment', path: '/career-guidance' }
                ].map((tool, index) => (
                  <Link
                    key={index}
                    to={tool.path}
                    className="block p-3 bg-white rounded-lg hover:shadow transition-shadow"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">{tool.name}</span>
                      <ChevronRight size={16} className="text-purple-600" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home