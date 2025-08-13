import { Fragment } from 'react';
import './App.css';
import Navbar from './component/layout/Navbar';
import Landing from './component/layout/Landing';
import Login from './component/auth/login';
import Signup from './component/auth/signup';
import Alert from './component/layout/alert';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './component/dashboard/dashboard';
import PrivateRoute from './component/routing/privateroute';
const App = () => {
  return (
    <Fragment>
      <Navbar />
      <Alert />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
       <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

      </Routes>
    </Fragment>
  );
};

export default App;
