import React, { useEffect, useState } from "react";
import { AuthService } from "../service/AuthService";
import { Link, useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Logo from "../../assets/iobix-technolabs.png"
import { toast } from "react-toastify";

const ResetPassowrd = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {token} = useParams();

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm Password is required";
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Confirm password did not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const signInData = { password, token };
    
    try {
      setIsSubmitting(true); // Set submitting to true when starting the request
      const response = await AuthService.resetPassword(signInData);
      if (response.status === 1 && response.data !== null) {
        toast.success(response.message); // Toast on success           
       
        navigate("/sign-in"); // Redirect to dashboard after successful login

      } else {
        alert(response.message || "Reset Password failed.");
      }
    } catch (error) {
      console.error("Error during reset password:", error);
      alert("Failed to reset password. Please try again.");
    }
    finally {
      setIsSubmitting(false);
      setTimeout(() => {
      }, 1000); // 1.5 seconds delay before redirect
    }
  };


  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6] bg-signin">
      <div className="w-full lg:w-auto md:w-auto flex gap-0 lg:gap-40 md:gap-38 flex-col md:flex-row items-center justify-center">
        {/* left side */}
        <div className="h-full w-full lg:w-2/3 md:w-1/2 flex flex-col items-center justify-center">
          <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
            <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base bordergray-300 text-gray-600">
              Manage all your task in one place!
            </span>
            <p className="flex flex-col gap-0 md:gap-4 text-4xl font-semibold lg:text-6xl md:text-5xl 2xl:text-7xl text-center text-[#0074BD]">
              <span>Iobix-CRM</span>
              <span>Management</span>
            </p>

            <div className="cell">
              <div className="circle rotate-in-up-left"></div>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className="w-full lg:w-1/3 md:w-1/2 p-4 flex flex-col justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="form-container w-full lg:w-[400px] md:w-[350px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14 shadow-lg rounded-md"
          >
            <div className="flex justify-center">
                <img src={Logo} alt="Logo" className="w-[60%] align-middle" />
            </div>

            <div>
              <p className="text-[#F9A01B] text-2xl font-bold text-center flex justify-center">
                Create Password
              </p>
            </div>

            <div className="flex flex-col gap-y-5">

              <div className="w-full flex flex-col gap-1">
                <label htmlFor="password" className="text-slate-700 m-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  placeholder="Enter Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 w-full rounded-full"
                />
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              </div>

              <div className="w-full flex flex-col gap-1">
                <label htmlFor="password" className="text-slate-700 m-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  placeholder="Enter Confirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 w-full rounded-full"
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
              </div>
              
              <button
                type="submit"
                className={`w-full h-10 bg-[#0074BD] hover:bg-[#0075bdd4] active:border-[#a8adf4] outline-none active:border-2 focus:ring-2 ring-blue-300 text-white rounded-full ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassowrd;