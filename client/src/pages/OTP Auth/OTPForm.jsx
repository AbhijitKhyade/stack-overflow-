// Import necessary modules
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
// import Chat from "../Chatbot/Chat";

// OTPForm component
const OTPForm = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to send OTP to the user's email
  const sendOtpToEmail = async () => {
    try {
      setLoading(true);
      const response = await axios.post("https://stack-overflow-2024.onrender.com/user/send-otp", {
        email,
      });
      setLoading(false);
      console.log(response.data);

      if (response.data.success) {
        setIsOtpSent(true);
        // alert("OTP sent success");
        return true;
      } else {
        // Handle unsuccessful OTP sending
        console.error("OTP sending failed");
        // alert("OTP sending failed");
        // Optionally, show an error message to the user
        return false;
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      // Handle OTP sending error
      return false;
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!isOtpSent) {
        // Send OTP to email
        const otpSent = await sendOtpToEmail();

        if (otpSent) {
          console.log("OTP Sent successfully");
          toast.success("OTP Sent successfully to email");
        } else {
          console.error("Error sending OTP");
          toast.success("Failed to send OTP");
          // Optionally, show an error message to the user
        }
      } else {
        const response = await axios.post(
          "https://stack-overflow-2024.onrender.com/user/verify-otp",
          { email, otp }
        );
        console.log(response.data);
        if (response.data.success) {
          // If OTP verification is successful, navigate to the home page
          toast.success("OTP verified Successfully");
          navigate("/");
        } else {
          // Handle unsuccessful verification
          // console.error("OTP verification failed");
          console.log(response.data.message);
          toast.error(response.data.message);
          // Optionally, show an error message to the user
        }
      }
    } catch (error) {
      console.error(error);
      // Handle registration or OTP verification error
      alert("Error while doing authentication");
    }
  };

  // JSX for the OTPForm component
  return (
    <section className="auth-section">
      <div className="auth-container-2">
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">
            <h4>Email</h4>
            <input
              type="email"
              name="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          {!isOtpSent ? (
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          ) : (
            <label htmlFor="otp">
              <h4>Enter OTP</h4>
              <input
                type="text"
                name="otp"
                id="otp"
                onChange={(e) => setOtp(e.target.value)}
              />

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </label>
          )}
        </form>
        <div>{/* <Chat /> */}</div>
      </div>
    </section>
  );
};

// Export the OTPForm component
export default OTPForm;
