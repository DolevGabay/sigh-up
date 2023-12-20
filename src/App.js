import React from 'react';
import Upload from './Upload';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInForm from './Sign-in';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
            <Routes>
              <Route path="/" element={<SignInForm />} />
              <Route path="/upload" element={<Upload />} />
            </Routes>
          </BrowserRouter>
    </div>
  );
}

export default App;
