import * as api from '../api'
import { setCurrentUser } from './currentUser';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export const signup = (authData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signUp(authData);
    // console.log("register: ", data);

    dispatch({ type: "AUTH", data });
    toast.success("Registration Successful!", {
      position: "top-left",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem("Profile"))));

    navigate("/");
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message, {
      position: "top-left",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
};

export const login = (authData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.logIn(authData);
    // console.log("login: ", data);

    console.log(data?.message, data);
    toast.success(data?.message, {
      position: "top-left",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    dispatch({ type: "AUTH", data });
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem("Profile"))));
    navigate("/");
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message, {
      position: "top-left",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
};