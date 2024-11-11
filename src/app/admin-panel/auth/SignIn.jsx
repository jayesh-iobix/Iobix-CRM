import React, { useEffect, useState } from "react";
import { AuthService } from "../../service/AuthService";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(()=>{
    //   debugger;
      const token = sessionStorage.getItem("token");
      if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // sessionStorage.clear();
        if (
          decodedToken?.IsSuperAdmin === "1" ||
          decodedToken?.IsAdmin === "1"
        ) {
          navigate("/");
        } 
        // else navigate("/")
      } catch {
        sessionStorage.clear();
        navigate("/sign-in")
        // alert("Token is not decoded");
      }
    }
    else {
        navigate("/sign-in")
    }
   // Prevent navigation back
   const handleBackButton = (event) => {
    event.preventDefault();
    window.history.pushState(null, null, window.location.href);
  };

  window.history.pushState(null, null, window.location.href);
  window.addEventListener("popstate", handleBackButton);

  return () => {
    window.removeEventListener("popstate", handleBackButton);
  };
}, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const signInData = {
      email,
      password,
    };

    try {
      const response = await AuthService.signInAdmin(signInData);
      if (response.status === 1 && response.data !== null) {
        debugger;
        const { token } = response.data;

        sessionStorage.setItem("token", token);
        // alert(response.message);
        navigate("/");
      }
      else {
        alert(response.message || "Sign-in failed.");
      }

      // Reset the form
      // setDepartmentName('');
    } catch (error) {
        console.error("Error during sign-in:", error);
        alert("Failed to sign in. Please try again.");
      }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]">
      <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
        {/* left side */}
        <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
          <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
            <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base bordergray-300 text-gray-600">
              Manage all your task in one place!
            </span>
            <p className="flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700">
              <span>Iobix-CRM</span>
              <span>Management</span>
            </p>

            <div className="cell">
              <div className="circle rotate-in-up-left"></div>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14"
          >
            <div className="">
              <p className="text-blue-600 text-3xl font-bold text-center">
                Welcome back!
              </p>
              <p className="text-center text-base text-gray-700 ">
                Keep all your credential safge.
              </p>
            </div>

            <div className="flex flex-col gap-y-5">
              <div className="w-full flex flex-col gap-1">
                <label htmlFor="email" className="text-slate-700 m-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  placeholder="Enter Email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 w-full rounded-full"
                />
              </div>

              <div className="w-full flex flex-col gap-1">
                <label htmlFor="email" className="text-slate-700 m-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  placeholder="Enter Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 w-full rounded-full"
                />
              </div>

              <span className="text-sm text-gray-500 hover:text-blue-600 hover:underline cursor-pointer">
                Forget Password?
              </span>

              <button
                type="submit"
                className="w-full h-10 bg-blue-700 text-white rounded-full"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
