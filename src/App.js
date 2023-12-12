import React from 'react';
import Upload from './Upload';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInForm from './Sign-in';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
            <Routes>
              <Route path="/" element={<Upload />} />
              <Route path="/sign-in" element={<SignInForm />} />
            </Routes>
          </BrowserRouter>
    </div>
  );
}

export default App;
