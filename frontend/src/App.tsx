import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RoomCreatePage from "./pages/RoomCreatePage";
import RoomEditor3DPage from "./pages/RoomEditor3DPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import KakaoCallbackPage from "./pages/KakaoCallbackPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<RoomCreatePage />} />
        <Route path="/editor" element={<RoomEditor3DPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/kakao/callback" element={<KakaoCallbackPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
