import React, { useState } from "react";
import "./Auth.css";
import icon from "C:/Users/Dell/OneDrive/Desktop/stackoverflow/client/src/assets/icon.png";
import AboutAuth from "./AboutAuth";
import { signup, login } from "../../actions/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Auth = () => {
  const [isSignUp, setSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSwitch = () => {
    setSignUp(!isSignUp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email && !password) {
      // toast.error("Enter email and password");
    }
    if (isSignUp) {
      if (!name) {
        alert("Enter name please")
        // toast.error("Enter your name", {
        //   position: "top-left",
        //   autoClose: 1500,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        //   theme: "light",
        // });
      }
      try {
        const response = dispatch(signup({ name, email, password }, navigate));
        console.log("response: ",response);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      try {
        const response =  dispatch(login({ email, password }, navigate));
        console.log("response: ",response);
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!email && !password) {
  //     toast.error("Enter email and password");
  //     return;
  //   } else if (!password) {
  //     toast.error("Enter your password");
  //     return;
  //   } else if (!email) {
  //     toast.error("Enter your email");
  //     return;
  //   }

  //   try {
  //     if (isSignUp) {
  //       if (!name) {
  //         toast.error("Enter your name to continue");
  //       } else {
  //         const response = await dispatch(
  //           signup({ name, email, password }, navigate)
  //         );

  //         if (response && response.success) {
  //           toast.error("Registration failed");
  //         } else {
  //           toast.success("Registration successful");
  //         }
  //       }
  //     } else {
  //       const response = await dispatch(login({ email, password }, navigate));
  //       if (response && response.success) {
  //         toast.error("Login failed");
  //       } else {
  //         toast.success("Login successful");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error during authentication:", error);
  //     toast.error("An error occurred during authentication");
  //   }
  // };

  return (
    <section className="auth-section">
      {isSignUp && <AboutAuth />}
      <div className="auth-container-2 ">
        {!isSignUp && (
          <img src={icon} alt="stack-overflow" className="login-logo" />
        )}
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <label htmlFor="name">
              <h4>Display Name</h4>
              <input
                type="text"
                name="name"
                id="name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </label>
          )}
          <label htmlFor="email">
            <h4>Email</h4>
            <input
              type="email"
              name="email"
              id="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </label>
          <label htmlFor="password">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4>Password</h4>
              {!isSignUp && (
                <h4
                  className="h4"
                  style={{
                    color: "#007ac6",
                    fontSize: "13px",
                    marginTop: "13px",
                  }}
                >
                  Forgot Password?
                </h4>
              )}
            </div>
            <input
              type="password"
              name="password"
              id="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            {isSignUp && (
              <p style={{ color: "#666767", fontSize: "13px" }}>
                Passwords must contain at least eight
                <br /> characters, including at least 1 letter and 1<br />{" "}
                number
              </p>
            )}
          </label>
          {isSignUp && (
            <label htmlFor="check">
              <input type="checkbox" id="check" />
              <p style={{ fontSize: "13px" }}>
                Opt-in to receive occasional product <br /> updates, user
                research invitations,
                <br />
                company announcements, and digests.
              </p>
            </label>
          )}
          <button type="submit" className="auth-btn">
            {isSignUp ? "Sign Up" : "Log In"}
          </button>
          {isSignUp && (
            <p style={{ color: "#666767", fontSize: "13px" }}>
              By clicking "Sign up", you agree to{" "}
              <span style={{ color: "#007ac6" }}>
                our terms of
                <br /> service
              </span>
              , <span style={{ color: "#007ac6" }}>
                privacy policy
              </span> and{" "}
              <span style={{ color: "#007ac6" }}>cookie policy</span>
            </p>
          )}
        </form>
        <p>
          {isSignUp ? "Already have an account ? " : "Don't have an account?"}
          <button
            type="button"
            className="handle-switch-btn"
            onClick={handleSwitch}
          >
            {isSignUp ? "Log in" : "Sign up"}
          </button>
        </p>
      </div>
    </section>
  );
};

export default Auth;
