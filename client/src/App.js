import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import AllRoutes from './AllRoutes';
import Navbar from './components/Navbar/Navbar';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllQuestions } from './actions/question';
import { fetchAllUsers } from './actions/users';
// import { Toaster } from 'react-hot-toast';
// import BotComp from './pages/Bot/BotComp';
import { ToastContainer } from 'react-toastify';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllQuestions());
    dispatch(fetchAllUsers());
  }, [dispatch])
  return (
    <>
      <Router>
        <Navbar />
        <AllRoutes />
        <ToastContainer />
        {/* <BotComp/> */}
      </Router>
    </>
  );
}

export default App;
