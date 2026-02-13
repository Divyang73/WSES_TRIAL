import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProblemList from './pages/ProblemList';
import ProblemDetail from './pages/ProblemDetail';
import Submissions from './pages/Submissions';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <ProblemList />
              </PrivateRoute>
            }
          />
          <Route
            path="/problems/:slug"
            element={
              <PrivateRoute>
                <ProblemDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/submissions"
            element={
              <PrivateRoute>
                <Submissions />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
