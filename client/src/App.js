import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Fragment } from 'react';
import './App.css';
import Navbar from './component/layout/Navbar';
import Landing from './component/layout/Landing';
import Login from './component/auth/login';
import Signup from './component/auth/signup';
import Alert from './component/layout/alert';
//redux
import { Provider } from 'react-redux';
import store from './store';

const App = () => {
  return (
    <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Alert/>
        <Routes>
          {/* Landing page */}
          <Route path='/' element={<Landing />} />

          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </Fragment>
    </Router>
    </Provider>
  );
};

export default App;
