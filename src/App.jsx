import "./App.css";
import { useState } from "react";
import Home from "./pages/Home";
import PathSelector from "./pages/PathSelector";

function App() {
  const [page, setPage] = useState("home");
  const [path, setPath] = useState(null);

  const handlePathSelect = (selectedPath) => {
    setPath(selectedPath);
    // navigate to question flow — swap this for your router later
    console.log("Selected path:", selectedPath);
  };

  if (page === "select") {
    return <PathSelector onSelect={handlePathSelect} />;
  }

  return <Home onStart={() => setPage("select")} />;
}

export default App;
