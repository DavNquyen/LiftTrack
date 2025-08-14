import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import AuthContainer from './components/AuthContainer';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import WorkoutsPage from './pages/WorkoutsPage';
import ExercisesPage from './pages/ExercisesPage';
import TemplatesPage from './pages/TemplatesPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route element={<AuthContainer />}>
            <Route path="/" element={
              <>
                <Navbar />
                <DashboardPage />
              </>
            } />
            <Route path="/workouts" element={
              <>
                <Navbar />
                <WorkoutsPage />
              </>
            } />
            <Route path="/exercises" element={
              <>
                <Navbar />
                <ExercisesPage />
              </>
            } />
            <Route path="/templates" element={
              <>
                <Navbar />
                <TemplatesPage />
              </>
            } />
            <Route path="/profile" element={
              <>
                <Navbar />
                <ProfilePage />
              </>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;