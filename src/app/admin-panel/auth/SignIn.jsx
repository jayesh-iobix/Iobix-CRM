import React, { useEffect, useState } from "react";
import { AuthService } from "../../service/AuthService";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Logo from "../../../assets/iobix-technolabs.png"
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



const SignIn = ({onLogin, setLoading}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (
          decodedToken?.IsSuperAdmin === "1" ||
          decodedToken?.IsAdmin === "1"
        ) {
          navigate("/"); // Redirect to dashboard if already authenticated
        }
      } catch {
        sessionStorage.clear();
        navigate("/sign-in");
      }
    } else {
      navigate("/sign-in"); // Redirect to sign-in if no token
    }
    //  Prevent going back to the previous page
    const handleBackButton = (event) => {
      event.preventDefault();
      window.history.pushState(null, null, window.location.href);
    };

    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton); // Clean up the event listener
    };
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "User name is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);  // Start loading spinner
    
    const signInData = { email, password };
    
    // setIsSubmitting(true);
    try {
      const response = await AuthService.signIn(signInData);
      if (response.status === 1 && response.data !== null) {
        toast.success(response.message || "Login successful!"); // Toast on success
        const { token } = response.data;
        sessionStorage.setItem("token", token); // Store token

        //debugger;
        // Decode token to get the role
        const decodedToken = jwtDecode(token);
        const role = decodedToken.IsSuperAdmin === "1" || decodedToken.IsAdmin === "1" ? "admin" : "user";
        sessionStorage.setItem("role", role); // Store role
        onLogin(role); // Update authentication state
       
        //#region Store Login User OR Admin Data in Session
        const res = await AuthService.getBasicDetail();
        //console.log(res.data);
        if(res.data)
        {
          sessionStorage.setItem("LoginUserId",res.data.loginUserId)
          sessionStorage.setItem("UserName",res.data.userName)
        }
        //#endregion
      
       
        // navigate("/"); // Redirect to dashboard after successful login
        navigate(role === "admin" ? "/" : "/user"); // Redirect based on role

      } else {
        alert(response.message || "Sign-in failed.");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert("Failed to sign in. Please try again.");
    }
    finally {
      setIsSubmitting(false);
      // setLoading(false); // Stop loading spinner after request
      setTimeout(() => {
        setLoading(false);  // Stop loading spinner after request
      }, 1000); // 1.5 seconds delay before redirect
    }
  };


  return (
    <>
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
              

              {/* <button
                type="submit"
                className="w-full h-10 bg-[#0074BD] hover:bg-[#0075bdd4] active:border-[#a8adf4] outline-none active:border-2 focus:ring-2 ring-blue-300 text-white rounded-full"
              >
                Submit
              </button> */}
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
};

export default SignIn;










    // useEffect(()=>{
      
  //     const token = sessionStorage.getItem("token");
  //     if (token) {
  //     try {
  //       const decodedToken = jwtDecode(token);
  //       // sessionStorage.clear();
  //       if (
  //         decodedToken?.IsSuperAdmin === "1" ||
  //         decodedToken?.IsAdmin === "1"
  //       ) {
  //         navigate("/");
  //       } 
        
  //     } catch {
  //       sessionStorage.clear();
  //       navigate("/sign-in")
  //       // alert("Token is not decoded");
  //     }
  //   }
  //   else{
  //    navigate("/sign-in")
  //   }
  // }, [])

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const signInData = {
  //     email,
  //     password,
  //   };

  //   try {
  //     const response = await AuthService.signInAdmin(signInData);
  //     if (response.status === 1 && response.data !== null) {
        
  //       const { token } = response.data;

  //       sessionStorage.setItem("token", token);

  //       // alert(response.message);
  //       navigate("/");
  //     }

  //     // Reset the form
  //     // setDepartmentName('');
  //   } catch (error) {
  //     console.error("Error adding department:", error);
  //     alert("Failed to add department.");
  //   }
  // };




  // const signInAuth = () => {

  //   const token = sessionStorage.getItem("token");

  //   if (token) {
  //     try {
  //       const decodedToken = jwtDecode(token);
  //       if (decodedToken?.IsSuperAdmin === "1" || decodedToken?.IsAdmin === "1") {
  //         navigate("/"); // Navigate if valid token found
  //       } else {
  //         sessionStorage.clear();
  //         // navigate("/sign-in"); // Clear session and navigate to sign-in
  //       }
  //     } catch {
  //       sessionStorage.clear();
  //       // navigate("/sign-in"); // If decoding fails, clear session and navigate to sign-in
  //     }
  //   }
  //   // else {
  //   //   navigate("/sign-in"); // No token, go to sign-in
  //   // }

  // }

  // useEffect(() => {

  //   signInAuth();

  //   // Prevent going back to the previous page
  //   // const handleBackButton = (event) => {
  //   //   event.preventDefault();
  //   //   window.history.pushState(null, null, window.location.href);
  //   // };

  //   // window.history.pushState(null, null, window.location.href);
  //   // window.addEventListener("popstate", handleBackButton);

  //   // return () => {
  //   //   window.removeEventListener("popstate", handleBackButton); // Clean up the event listener
  //   // };
  // }, [signInAuth]); // Only rerun this effect when 'navigate' changes (it generally shouldn't)





 // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const signInData = { email, password };

  //   try {
  //     const response = await AuthService.signInAdmin(signInData);
  //     if (response.status === 1 && response.data !== null) {
  //       const { token } = response.data;
  //       sessionStorage.setItem("token", token); // Store token
  //       navigate("/"); // Navigate to dashboard after successful sign-in
  //     } else {
  //       alert(response.message || "Sign-in failed.");
  //     }
  //   } catch (error) {
  //     console.error("Error during sign-in:", error);
  //     alert("Failed to sign in. Please try again.");
  //   }
  // };