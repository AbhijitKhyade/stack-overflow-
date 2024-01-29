import React, { useEffect } from "react";
import "./payment.css";
import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate("/subscribe");
    }, 3000);

    return () => clearTimeout(redirectTimer);
  }, [navigate]);
  return (
    <div className="container-cancel">
      <h1>Payment Failed</h1>
      <p>Redirecting to subscriptions plans...</p>
    </div>
  );
};

export default PaymentCancel;
