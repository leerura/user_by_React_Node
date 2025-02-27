import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Resgister from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home'


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/register' element= {<Resgister />}/>
        <Route path='/login' element= {<Login />}/>
        <Route path='/home' element= {<Home />}/>
      </Routes>
    </Router>
    
  );
}

export default App;
