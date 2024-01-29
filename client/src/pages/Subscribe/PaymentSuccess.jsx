import React, { useEffect } from "react";
import "./payment.css";
import { useNavigate } from "react-router-dom";
const PaymentSuccess = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate("/AskQuestion");
    }, 3000);

    return () => clearTimeout(redirectTimer);
  }, [navigate]);
  return (
    <div className="container-success">
      <h1>Payment Success</h1>
      <p>Redirecting to Ask Question page...</p>
    </div>
  );
};

export default PaymentSuccess;
