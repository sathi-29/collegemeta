import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'

// Pages
import Home from './pages/Home'
import Colleges from './pages/Colleges'
import CollegeDetail from './pages/CollegeDetail'
import CollegeCompare from './pages/CollegeCompare'
import Exams from './pages/Exams'
import ExamDetail from './pages/ExamDetail'
import Courses from './pages/Courses'
import Predictor from './pages/Predictor'
import Scholarships from './pages/Scholarships'
import News from './pages/News'
import CareerGuidance from './pages/CareerGuidance'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/colleges" element={<Colleges />} />
            <Route path="/colleges/:id" element={<CollegeDetail />} />
            <Route path="/compare" element={<CollegeCompare />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/exams/:id" element={<ExamDetail />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/predictor" element={<Predictor />} />
            <Route path="/scholarships" element={<Scholarships />} />
            <Route path="/news" element={<News />} />
            <Route path="/career-guidance" element={<CareerGuidance />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Layout>
        <Toaster position="top-right" />
      </Router>
    </QueryClientProvider>
  )
}

export default App