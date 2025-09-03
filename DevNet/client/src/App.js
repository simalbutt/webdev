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
import CreateProfile from './component/profile-form/createprofile';
import EditProfile from './component/profile-form/Editprofile';
import AddExperience from './component/profile-form/Addexperience';
import AddEducation from './component/profile-form/Addeducation';
import Profiles from './component/profile/Profiles';
import Profile from './component/profile/Profile';
import Posts from './component/post/post';
import Post from './component/post/Singlepost';
import Postform from './component/post/Postform';
import Myprofile from './component/profile/myprofile';
import Myposts from './component/post/Myposts'

const App = () => {
  return (
    <Fragment>
      <Navbar />
      <Alert />
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route
          path='/dashboard'
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path='/createprofile'
          element={
            <PrivateRoute>
              <CreateProfile />
            </PrivateRoute>
          }
        />
        <Route
          path='/editprofile'
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />
        <Route
          path='/addexperience'
          element={
            <PrivateRoute>
              <AddExperience />
            </PrivateRoute>
          }
        />
        <Route
          path='/addeducation'
          element={
            <PrivateRoute>
              <AddEducation />
            </PrivateRoute>
          }
        />
        <Route
          path='/posts'
          element={
            <PrivateRoute>
              <Posts />
            </PrivateRoute>
          }
        />
        <Route
          path='/post/:id'
          element={
            <PrivateRoute>
              <Post />
            </PrivateRoute>
          }
        />
        <Route
          path='/create-post'
          element={
            <PrivateRoute>
              <Postform />
            </PrivateRoute>
          }
        />
        <Route
          path='/myprofile'
          element={
            <PrivateRoute>
              <Myprofile />
            </PrivateRoute>
          }
        />
        <Route
          path='/myposts'
          element={
            <PrivateRoute>
              <Myposts />
            </PrivateRoute>
          }
        />

        <Route path='/profiles' element={<Profiles />} />
        <Route path='/profile/:id' element={<Profile />} />
      </Routes>
    </Fragment>
  );
};

export default App;
