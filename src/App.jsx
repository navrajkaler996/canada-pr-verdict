import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import PathSelector from "./pages/PathSelector";
import CrsQuestionnaire from "./pages/CrsQuestionnaire.jsx";

// import Questionnaire from "./pages/Questionnaire"; // add this when ready

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/select-path" element={<PathSelector />} />
        <Route path="/crs-questionnaire" element={<CrsQuestionnaire />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
