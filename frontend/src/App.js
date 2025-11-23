import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import ListPage from "./ListPage";
import FormPage from "./FormPage";
import Navbar from "./Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/items" element={<ListPage />} />
        <Route path="/items/new" element={<FormPage />} />
        <Route path="/items/edit/:id" element={<FormPage />} />
      </Routes>
    </BrowserRouter>
  );
}
