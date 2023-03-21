import LogSign from './components/logsign/LogSign';
import Home from './components/home/Home';
import Profile from './components/profile/Profile';
import NotFound from './components/NotFound';
import InDevelopment from './components/InDevelopment';
import { Routes, Route} from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LogSign />}></Route>
      <Route path="/home" element={<Home />}></Route>
      <Route path="/profile/:username" element={<Profile />}></Route>
      <Route path="/messages" element={<InDevelopment />}></Route>
      <Route element={<NotFound />}></Route>
    </Routes>
  );
}

export default App;
