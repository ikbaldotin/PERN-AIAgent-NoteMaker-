import { Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import RegisterPage from "./pages/registerPage";
import LoginPage from "./pages/loginPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default App;
