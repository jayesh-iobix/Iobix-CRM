//#region Imports
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Logo from "../../assets/iobix-technolabs.png";
import { toast } from "react-toastify";
import FingerprintJS from "@fingerprintjs/fingerprintjs"; // For fingerprinting
import { UAParser } from "ua-parser-js";
import { getToken } from "firebase/messaging";
import 'react-toastify/dist/ReactToastify.css';
import { messaging } from "../../firebase/firebase";
import { AuthService } from "../service/AuthService";
//#endregion

//#region Component: SignIn
const SignIn = ({ onLogin, setLoading }) => {
  //#region State Variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [deviceId, setDeviceId] = useState(null); // State to store the device ID
  const [deviceToken, setDeviceToken] = useState(null);
  const navigate = useNavigate();
  //#endregion

  //#region useEffect: Device Token and Device ID
  useEffect(() => {
    // Check for stored device token
    const storedDeviceToken = sessionStorage.getItem("deviceToken");
    if (storedDeviceToken) {
      setDeviceToken(storedDeviceToken);
    } else {
      // Get the device token if not stored
      const getDeviceToken = async () => {
        try {
          const currentToken = await getToken(messaging, { vapidKey: "BMJdBmT_HG1NcRtaygZg71bqZoRQCsLhkjXGks726bNTGkVsYAEwBCAiM7CVtFZZjGAtLMGiBw1pzhbG-B01TdE" });
          if (currentToken) {
            setDeviceToken(currentToken);
            sessionStorage.setItem("deviceToken", currentToken);
          } else {
            console.log("No device token available.");
          }
        } catch (error) {
          console.error("Error fetching device token:", error);
        }
      };
      getDeviceToken();
    }

    // Get the device ID using FingerprintJS
    const getDeviceId = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setDeviceId(result.visitorId);
    };
    getDeviceId();
  }, []);
  //#endregion

  //#region useEffect: Redirect If Authenticated
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (
          decodedToken?.Admin === "IsAdmin" ||
          decodedToken?.Admin === "IsAdminIT" ||
          decodedToken?.Admin === "IsAdminBD"
        ) {
          navigate("/"); // Redirect to dashboard if already authenticated
        } else if (decodedToken?.Employee === "IsEmployee") {
          navigate("/user");
        } else if (decodedToken?.Partner === "IsPartner") {
          navigate("/partner");
        } else if (decodedToken?.Client === "IsClient") {
          navigate("/company");
        } else if (decodedToken?.Vendor === "IsVendor") {
          navigate("/vendor");
        }
      } catch (err) {
        sessionStorage.clear();
        navigate("/sign-in");
      }
    }

    // Prevent going back to the previous page for all logged-in users (admin, user, partner, company)
    const handleBackButton = (event) => {
      event.preventDefault();
      window.history.pushState(null, null, window.location.href); // Push to the current URL to prevent back navigation
    };

    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton); // Clean up the event listener on component unmount
    };
  }, [navigate]);
  //#endregion

  //#region Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "User name is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  //#endregion

  //#region Role Extraction
  const getRoleFromToken = (decodedToken) => {
    if (decodedToken?.Admin) {
      return "admin";
    } else if (decodedToken?.Employee) {
      return "user";
    } else if (decodedToken?.Partner) {
      return "partner";
    } else if (decodedToken?.Client) {
      return "company";
    } else if (decodedToken?.Vendor) {
      return "vendor";
    }
    return "user"; // Default to user
  };
  //#endregion

  //#region Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true); // Start loading spinner

    // Initialize UAParser to get device information
    const parser = new UAParser();
    const result = parser.getResult();
    const { device, os } = result;

    // Collect device information
    const deviceInfoVM = {
      deviceId: deviceId || "Unknown Device ID", // Include the device ID
      deviceToken: deviceToken || "Unknown Device Token",
      deviceName: device.model || "Unknown Device",
      deviceType: device.type || "Unknown Type",
      deviceOSName: os.name || "Unknown OS",
      deviceOSVersion: os.version || "Unknown Version",
    };

    // console.log(deviceInfoVM);

    const signInData = {
      email,
      password,
      deviceInfoVM,
    };

    try {
      const response = await AuthService.signIn(signInData);
      if (response.status === 1 && response.data !== null) {
        toast.success(response.message || "Login successful!");

        const { token } = response.data;
        sessionStorage.setItem("token", token); // Store token

        try {
          const decodedToken = jwtDecode(token);
          const role = getRoleFromToken(decodedToken);

          // console.log(decodedToken)
          sessionStorage.setItem("role", role);
          onLogin(role);

          // Store user data in session
          const userDetails = await AuthService.getBasicDetail();
          if (userDetails.data) {
            sessionStorage.setItem("LoginUserId", userDetails.data.loginUserId);
            sessionStorage.setItem("UserName", userDetails.data.userName);
            sessionStorage.setItem("DepartmentName", userDetails.data.departmentName);
          }

          // Navigate based on role
          if (role === "admin") {
            navigate("/");  // Redirect to the admin dashboard ("/")
          } else if (role === "user") {
            navigate("/user");  // Redirect to the user page
          } else if (role === "partner") {
            navigate("/partner");  // Redirect to the partner page
          } else if (role === "company") {
            navigate("/company");  // Redirect to the company page
          } else if (role === "vendor") {
            navigate("/vendor");  // Redirect to the vendor page
          }
        } catch (err) {
          toast.error("Error decoding token");
          sessionStorage.clear();
          navigate("/sign-in");
        }
      } else {
        toast.error(response.message || "Sign-in failed.");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      toast.error("Failed to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
      setLoading(false); // Stop loading spinner
    }
  };
  //#endregion

  //#region JSX
  return (
    <>
      <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6] bg-signin">
        <div className="w-full lg:w-auto md:w-auto flex gap-0 lg:gap-40 md:gap-38 flex-col md:flex-row items-center justify-center">
          {/* left side */}
          <div className="h-full w-full lg:w-2/3 md:w-1/2 flex flex-col items-center justify-center">
            <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
              <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base bordergray-300 text-gray-600">
                Manage all your tasks in one place!
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
                  Sign In
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

                <Link to='/forgot-password'>
                  <span className="text-sm text-gray-500 hover:text-[#0074BD] hover:underline cursor-pointer">
                    Forget Password?
                  </span>
                </Link>

                <button
                  type="submit"
                  className={`w-full h-10 bg-[#0074BD] hover:bg-[#0075bdd4] active:border-[#a8adf4] outline-none active:border-2 focus:ring-2 ring-blue-300 text-white rounded-full ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Log In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
  //#endregion
};

export default SignIn;
//#endregion