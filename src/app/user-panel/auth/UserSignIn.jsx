import React, { useEffect, useState } from "react";
import { AuthService } from "../../service/AuthService";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const UserSignIn = ({ onLogin }) => {
  // const [employeeCode, setEmployeeCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (
          decodedToken?.IsSuperAdmin === "0" ||
          decodedToken?.IsAdmin === "0"
        ) {
          navigate("/"); // Redirect to user dashboard if already authenticated
        }
      } catch {
        sessionStorage.clear();
        navigate("/user-sign-in");
      }
    } else {
      navigate("/user-sign-in"); // Redirect to sign-in if no token
    }

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
    const signInData = { email, password };

    try {
      debugger;
      const response = await AuthService.signIn(signInData);
      if (response.status === 1 && response.data !== null) {
        const { token } = response.data;
        sessionStorage.setItem("token", token);
        const decodedToken = jwtDecode(token); // Decode token to check roles

        const userRole = decodedToken?.IsSuperAdmin === "1" || decodedToken?.IsAdmin === "1" ? "admin" : "user";
        sessionStorage.setItem("role", userRole); // Store the role in sessionStorage

        onLogin();
        navigate("/");
      } else {
        alert(response.message || "Sign-in failed.");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert("Failed to sign in. Please try again.");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6] bg-signin">
      <div className="w-full lg:w-auto md:w-auto flex gap-0 lg:gap-40 md:gap-38 flex-col md:flex-row items-center justify-center">
        
        <div className="h-full w-full lg:w-2/3 md:w-1/2 flex flex-col items-center justify-center">
          <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
            <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base bordergray-300 text-gray-600">
              Access your workspace with Employee Code!
            </span>
            <p className="flex flex-col gap-0 md:gap-4 text-4xl lg:text-6xl md:text-5xl 2xl:text-7xl font-black text-center text-blue-700">
              <span>Iobix-CRM</span>
              <span>User Portal</span>
            </p>

            <div className="cell">
              <div className="circle rotate-in-up-left"></div>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className="w-full lg:w-1/3 md:w-1/2 p-4 md:p-1 flex flex-col justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="form-container w-full lg:w-[400px] md:w-[350px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14 rounded-md shadow-xl"
          >

            <div>
              <p className="text-blue-600 text-3xl font-bold text-center">
                User Sign In
              </p>
            </div>

            <div className="flex flex-col gap-y-5">
              <div className="w-full flex flex-col gap-1">
                <label htmlFor="employee code" className="text-slate-700 m-2">
                  Employee Code
                </label>
                <input
                  type="text"
                  value={email}
                  placeholder="Enter Employee Code"
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 w-full rounded-full"
                />
              </div>

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
              </div>

              <span className="text-sm text-gray-500 hover:text-[#0074BD] hover:underline cursor-pointer">
                Forgot Password?
              </span>

              <button
                type="submit"
                className="w-full h-10 bg-blue-700 hover:bg-[#0075bdd4] active:border-[#a8adf4] outline-none active:border-2 focus:ring-2 ring-blue-300 text-white rounded-full"
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

export default UserSignIn;
