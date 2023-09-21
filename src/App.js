import { Route, Routes, useNavigate } from 'react-router-dom'

import logo from './logo.svg';

import './App.css';
import { Home } from './pages/Home';
import Test from './pages/Test';

function App() {
  return (
    <div className="App">

      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/test' element={<Test />} />
      </Routes>
    </div>
  );
}

export default App;
