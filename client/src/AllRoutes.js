import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Auth from './pages/Auth/Auth';
import Questions from './pages/Questions/Questions';
import AskQuestion from './pages/AskQuestion/AskQuestion';
import DisplayQuestions from './pages/Questions/DisplayQuestions';
import Tags from './pages/Tags/Tags';
import Users from './pages/Users/Users';
import UserProfile from './pages/UserProfile/UserProfile';
import OTPForm from './pages/OTP Auth/OTPForm';
import Subscribe from './pages/Subscribe/Subscribe';
import PaymentSuccess from './pages/Subscribe/PaymentSuccess';
import PaymentCancel from './pages/Subscribe/PaymentCancel';
import About from './pages/About/About';



const AllRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/Auth' element={<Auth />} />
            <Route path='/Questions' element={<Questions />} />
            <Route path='/AskQuestion' element={<AskQuestion />} />
            <Route path='/Questions/:id' element={<DisplayQuestions />} />
            <Route path='/Tags' element={<Tags />} />
            <Route path='/Users' element={<Users />} />
            <Route path='/Users/:id' element={<UserProfile />} />
            <Route path='/user/auth-otp' element={<OTPForm />} />
            <Route path='/subscribe' element={<Subscribe />} />
            <Route path='/payment-success' element={<PaymentSuccess />} />
            <Route path='/payment-cancel' element={<PaymentCancel />} />
        </Routes>
    )
}

export default AllRoutes
