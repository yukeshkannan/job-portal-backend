import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateJob from './pages/CreateJob';
import JobCandidates from './pages/JobCandidates';
import JobDetails from './pages/JobDetails';
import ScheduleInterview from './pages/ScheduleInterview';
import InterviewsList from './pages/InterviewsList';
import MyApplications from './pages/MyApplications';
import Dashboard from './pages/Dashboard';
import JobApplication from './pages/JobApplication';
import AdminPanel from './pages/AdminPanel';

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>; // You can replace this with a nice spinner
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="app-container" style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/jobs" 
                element={<Dashboard />} 
              />
              <Route 
                path="/create-job" 
                element={
                  <PrivateRoute>
                    <CreateJob />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/edit-job/:id" 
                element={
                  <PrivateRoute>
                    <CreateJob />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/jobs/:jobId/candidates" 
                element={
                  <PrivateRoute>
                    <JobCandidates />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/jobs/:id" 
                element={<JobDetails />} 
              />
              <Route 
                path="/jobs/:id/apply" 
                element={<JobApplication />} 
              />
              <Route 
                path="/interviews" 
                element={
                  <PrivateRoute>
                    <InterviewsList />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/interviews/schedule/:candidateId" 
                element={
                  <PrivateRoute>
                    <ScheduleInterview />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/my-applications" 
                element={
                  <PrivateRoute>
                    <MyApplications />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <PrivateRoute>
                    <AdminPanel />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
