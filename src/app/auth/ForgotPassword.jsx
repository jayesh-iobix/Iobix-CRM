//#region Imports
import React, { useEffect, useState } from "react";
import { AuthService } from "../service/AuthService";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/iobix-technolabs.png"
import { toast } from "react-toastify";
//#endregion

//#region Component: ForgotPassword
const ForgotPassword = () => {
  //#region State Variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  //#region State Variables

  //#region Form Validation and Submission
  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "User name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
        
    const signInData = { email };
    
    try {
      const response = await AuthService.forgotPassword(signInData);
      if (response.status === 1) {
        toast.success(response.message); // Toast on success
      } else {
        toast.error(response.message || "Sign-in failed.");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert("Failed to sign in. Please try again.");
    }

  };
  //#endregion

  //#region Render
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
                Forgot Password
              </p>
            </div>

            <div className="flex flex-col gap-y-5">
              <div className="w-full flex flex-col gap-1">
                <label htmlFor="user name" className="text-slate-700 m-2">
                  User Name
                </label>
                <input
                  type="text"
                  value={email}
                  placeholder="Enter User Name"
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 w-full rounded-full"
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>

              <span onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-[#0074BD] hover:underline cursor-pointer">
                Back to SignIn?
              </span>

              <button
                type="submit"
                className={`w-full h-10 bg-[#0074BD] hover:bg-[#0075bdd4] active:border-[#a8adf4] outline-none active:border-2 focus:ring-2 ring-blue-300 text-white rounded-full ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  //#endregion
};

export default ForgotPassword;
//#endregion


