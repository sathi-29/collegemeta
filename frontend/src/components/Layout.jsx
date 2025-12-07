import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  School, 
  BookOpen, 
  TrendingUp, 
  Award, 
  Newspaper,
  Briefcase,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  MessageCircle,
  Phone
} from 'lucide-react'

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={18} /> },
    { 
      label: 'Colleges', 
      icon: <School size={18} />,
      submenu: [
        { path: '/colleges', label: 'Browse Colleges' },
        { path: '/colleges?stream=engineering', label: 'Engineering Colleges' },
        { path: '/colleges?stream=medical', label: 'Medical Colleges' },
        { path: '/colleges?stream=management', label: 'Management Colleges' },
        { path: '/compare', label: 'Compare Colleges' },
        { path: '/colleges?type=government', label: 'Government Colleges' },
        { path: '/colleges?type=private', label: 'Private Colleges' }
      ]
    },
    { 
      label: 'Exams', 
      icon: <BookOpen size={18} />,
      submenu: [
        { path: '/exams', label: 'All Exams' },
        { path: '/exams?category=engineering', label: 'Engineering Exams' },
        { path: '/exams?category=medical', label: 'Medical Exams' },
        { path: '/exams?category=management', label: 'Management Exams' },
        { path: '/exams?exam=jee-main', label: 'JEE Main' },
        { path: '/exams?exam=neet-ug', label: 'NEET UG' },
        { path: '/exams?exam=cat', label: 'CAT' }
      ]
    },
    { path: '/predictor', label: 'Predictor', icon: <TrendingUp size={18} /> },
    { path: '/courses', label: 'Courses', icon: <BookOpen size={18} /> },
    { path: '/scholarships', label: 'Scholarships', icon: <Award size={18} /> },
    { path: '/news', label: 'News', icon: <Newspaper size={18} /> },
    { path: '/career-guidance', label: 'Career', icon: <Briefcase size={18} /> }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-blue-900 text-white text-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span>📞 Helpline: 1800-123-4567</span>
            <span>📧 Email: help@careers360.com</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2">
              <MessageCircle size={16} />
              <span>Live Chat</span>
            </button>
            <Link to="/login" className="hover:text-blue-200">Login</Link>
            <Link to="/register" className="bg-orange-500 hover:bg-orange-600 px-4 py-1 rounded">Sign Up</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <School size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-900">Careers360</h1>
                <p className="text-xs text-gray-600">Explore Your Future</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                item.submenu ? (
                  <div key={item.label} className="relative group">
                    <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">
                      {item.icon}
                      {item.label}
                      <ChevronDown size={16} />
                    </button>
                    <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-xl rounded-lg w-64 py-2">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.path}
                          to={subitem.path}
                          className="block px-4 py-3 hover:bg-blue-50 text-gray-700"
                        >
                          {subitem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                      location.pathname === item.path
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                )
              ))}
            </div>

            {/* Search and User */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Search size={20} />
              </button>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <User size={18} />
                Dashboard
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t py-4">
              <div className="space-y-2">
                {navItems.map((item) => (
                  item.submenu ? (
                    <div key={item.label} className="border-b pb-2">
                      <div className="font-medium px-4 py-2">{item.label}</div>
                      <div className="pl-6 space-y-1">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.path}
                            to={subitem.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="block py-2 text-gray-600 hover:text-blue-600"
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-2 font-medium ${
                        location.pathname === item.path
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4">
            <div className="p-4">
              <div className="flex items-center gap-4">
                <Search className="text-gray-400" size={24} />
                <input
                  type="text"
                  placeholder="Search colleges, exams, courses, news..."
                  className="flex-1 text-lg py-4 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={() => setShowSearch(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <School size={24} className="text-blue-400" />
                <h2 className="text-2xl font-bold">Careers360</h2>
              </div>
              <p className="text-gray-400 mb-6">
                India's most comprehensive education portal. Helping millions of students 
                find colleges, prepare for exams, and build successful careers.
              </p>
              <div className="flex gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg">
                  Download App
                </button>
                <button className="border border-gray-600 hover:bg-gray-800 px-6 py-2 rounded-lg">
                  Subscribe Newsletter
                </button>
              </div>
            </div>

            {[
              {
                title: 'Quick Links',
                links: [
                  { label: 'About Us', path: '/about' },
                  { label: 'Contact Us', path: '/contact' },
                  { label: 'Privacy Policy', path: '/privacy' },
                  { label: 'Terms of Use', path: '/terms' },
                  { label: 'Careers', path: '/careers' }
                ]
              },
              {
                title: 'Popular Exams',
                links: [
                  { label: 'JEE Main', path: '/exams/jee-main' },
                  { label: 'NEET UG', path: '/exams/neet-ug' },
                  { label: 'CAT', path: '/exams/cat' },
                  { label: 'UPSC', path: '/exams/upsc' },
                  { label: 'CLAT', path: '/exams/clat' }
                ]
              },
              {
                title: 'Resources',
                links: [
                  { label: 'College Predictor', path: '/predictor' },
                  { label: 'Scholarships', path: '/scholarships' },
                  { label: 'College Reviews', path: '/colleges/reviews' },
                  { label: 'Cutoff', path: '/cutoff' },
                  { label: 'Admission', path: '/admission' }
                ]
              }
            ].map((section, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link to={link.path} className="text-gray-400 hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400">© 2024 Careers360. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <span className="text-gray-400">Follow us:</span>
                <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
                <a href="#" className="text-gray-400 hover:text-white">YouTube</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chat Button */}
      <button className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 z-40">
        <MessageCircle size={24} />
      </button>
    </div>
  )
}

export default Layout