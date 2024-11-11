import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CommonService } from "../../service/CommonService";
import Department from "../master/department/Department";
import { DepartmentService } from "../../service/DepartmentService";
import { DesignationService } from "../../service/DesignationService";

const AddEmployee = () => {

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [employeecode, setEmloyeecode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [gender, setGender] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [bloodgroup, setBloodgroup] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [departmentList, setDepartmentList] = useState([]);
  const [designationtList, setDesignationtList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch countries first
        const depatmentResult = await DepartmentService.getDepartments();
        setDepartmentList(depatmentResult.data);

        // const designationResult = await DesignationService.getDesignation();
        // setDepartmentList(designationResult.data);

        const countryResult = await CommonService.getCountry();
        setCountryList(countryResult.data);

        // If a country is selected, fetch states
        if (country) {
          const stateResult = await CommonService.getState(country);
          setStateList(stateResult.data);

          // If a state is selected, fetch cities
          if (state) {
            const cityResult = await CommonService.getCity(state);
            setCityList(cityResult.data);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the function to fetch data
  }, [department, designation, country, state]); // Dependency array watches both country and state

  const validateForm = () => {
    const newErrors = {};
    if (!firstName) newErrors.firstName = "First Name is required";
    if (!middleName) newErrors.middleName = "Middle Name is required";
    if (!lastName) newErrors.lastName = "Last Name is required";
    if (!employeecode) newErrors.employeecode = "Employecode is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (!department) newErrors.department = "Department is required";
    if (!designation) newErrors.designation = "Designation is required";
    if (!gender) newErrors.gender = "Gender is required";
    if (!mobileNumber) newErrors.mobileNumber = "MobileNumber is required";
    if (!birthDate) newErrors.birthDate = "Date of Birth is required";
    if (!dateOfJoining) newErrors.doj = "Date of Joining is required";
    if (!country) newErrors.country = "Country is required";
    if (!state) newErrors.state = "State is required";
    if (!city) newErrors.city = "City is required";
    if (!bloodgroup) newErrors.bloodgroup = "Blood Group is required";
    if (!address) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate API call or form submission logic
      setTimeout(() => {
        // Reset form and errors after submission
        alert("Employee added successfully!");
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setEmloyeecode("");
        setEmail("");
        setPassword("");
        setMobileNumber("");
        setDepartment("");
        setDesignation("");
        setBirthDate("");
        setDateOfJoining("");
        setCountry("");
        setState("");
        setCity("");
        setBloodgroup("");
        setAddress("");
        setErrors({});
        setIsSubmitting(false);
      }, 1000); // Simulate a delay for submission
    }
    // Logic for form submission goes here
    const employeeData = {
      firstName,
      middleName,
      lastName,
      employeecode,
      email,
      password,
      department,
      designation,
      gender,
      mobileNumber,
      birthDate,
      dateOfJoining,
      country,
      state,
      city,
      bloodgroup,
      address,
    };
    console.log("Submitted Data:", employeeData);
  };

  return (
    <>
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Add Employee</h1>
        <Link
          to="/employee-list"
          className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded flex items-center gap-2 hover:no-underline"
        >
          <FaArrowLeft size={16} />
          Back
        </Link>
      </div>

      <section className="bg-white shadow-sm m-1 py-8 pt-4 dark:bg-dark">
        <form onSubmit={handleSubmit} className="container">
          <div className="-mx-4 px-10 mt- flex flex-wrap">
            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                FirstName
              </label>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 outline-none transition"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs">{errors.firstName}</p>
              )}
            </div>

            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                MiddleName
              </label>
              <input
                type="text"
                placeholder="Middle Name"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                className="w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 outline-none transition"
              />
              {errors.middleName && (
                <p className="text-red-500 text-xs">{errors.middleName}</p>
              )}
            </div>

            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                LastName
              </label>
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 outline-none transition"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs">{errors.lastName}</p>
              )}
            </div>

            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Employee Code
              </label>
              <input
                type="text"
                placeholder="Employee Code"
                value={employeecode}
                onChange={(e) => setEmloyeecode(e.target.value)}
                className="w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 outline-none transition"
              />
              {errors.employeecode && (
                <p className="text-red-500 text-xs">{errors.employeecode}</p>
              )}
            </div>

            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 outline-none transition"
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>

            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 outline-none transition"
              />
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
            </div>

            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Department
              </label>
              <div className="relative z-20">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="relative z-20 w-full mb-2 appearance-none rounded-lg border border-stroke bg-transparent py-[10px] px-4 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
                >
                  <option value="" className="text-gray-400">
                    --Select Department--
                  </option>
                  {departmentList.length > 0 ? (
                    departmentList.map((departmentItem) => (
                      <option
                        key={departmentItem.departmentId}
                        value={departmentItem.departmentId}
                      >
                        {departmentItem.departmentName}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No Department available
                    </option>
                  )}
                </select>
                <span className="absolute right-4 top-1/2 z-10 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2 border-body-color"></span>
              </div>
              {errors.department && (
                <p className="text-red-500 text-xs">{errors.department}</p>
              )}
            </div>

            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Designation
              </label>
              <div className="relative z-20">
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="relative z-20 w-full mb-2 appearance-none rounded-lg border border-stroke bg-transparent py-[10px] px-4 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
                >
                  <option value="" className="text-gray-400">
                    --Select Designation--
                  </option>
                  {designationtList.length > 0 ? (
                    departmentList.map((designationItem) => (
                      <option
                        key={designationItem.designationId}
                        value={designationItem.departmentId}
                      >
                        {designationItem.designationName}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No Designation available
                    </option>
                    // <option value="Male">IT</option>
                    // <option value="Female">Female</option>
                    // <option value="Other">Other</option>
                  )}
                </select>
                <span className="absolute right-4 top-1/2 z-10 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2 border-body-color"></span>
              </div>
              {errors.designation && (
                <p className="text-red-500 text-xs">{errors.designation}</p>
              )}
            </div>

            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Gender
              </label>
              <div className="relative z-20">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="relative z-20 w-full mb-2 appearance-none rounded-lg border border-stroke bg-transparent py-[10px] px-4 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
                >
                  <option value="" className="text-gray-400">
                    --Select Gender--
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <span className="absolute right-4 top-1/2 z-10 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2 border-body-color"></span>
              </div>
              {errors.gender && (
                <p className="text-red-500 text-xs">{errors.gender}</p>
              )}
            </div>

            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Contact Number
              </label>
              <input
                type="number"
                placeholder="Contact Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 outline-none transition"
              />
              {errors.mobileNumber && (
                <p className="text-red-500 text-xs">{errors.mobileNumber}</p>
              )}
            </div>

            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Date of Birth
              </label>
              <input
                type="date"
                placeholder="Date of Birth"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 outline-none transition"
              />
              {errors.birthDate && (
                <p className="text-red-500 text-xs">{errors.birthDate}</p>
              )}
            </div>

            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Date of Joining
              </label>
              <input
                type="date"
                placeholder="Date of Joining"
                value={dateOfJoining}
                onChange={(e) => setDateOfJoining(e.target.value)}
                className="w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 outline-none transition"
              />
              {errors.dateOfJoining && (
                <p className="text-red-500 text-xs">{errors.dateOfJoining}</p>
              )}
            </div>

            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Country
              </label>
              <div className="relative z-20">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="relative z-20 w-full mb-2 appearance-none rounded-lg border border-stroke bg-transparent py-[10px] px-4 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
                >
                  <option value="" className="text-gray-400">
                    --Select Country--
                  </option>
                  {countryList.length > 0 ? (
                    countryList.map((countryItem) => (
                      <option
                        key={countryItem.countryId}
                        value={countryItem.countryId}
                      >
                        {countryItem.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No countries available
                    </option>
                  )}
                </select>
                <span className="absolute right-4 top-1/2 z-10 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2 border-body-color"></span>
              </div>
              {errors.country && (
                <p className="text-red-500 text-xs">{errors.country}</p>
              )}
            </div>

            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                State
              </label>
              <div className="relative z-20">
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="relative z-20 w-full mb-2 appearance-none rounded-lg border border-stroke bg-transparent py-[10px] px-4 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
                  disabled={!country} // Disable state dropdown if no country is selected
                >
                  <option value="" className="text-gray-400">
                    --Select State--
                  </option>
                  {/* Map over the state list */}
                  {stateList.length > 0 ? (
                    stateList.map((stateItem) => (
                      <option key={stateItem.stateId} value={stateItem.stateId}>
                        {stateItem.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No states available
                    </option>
                  )}
                </select>
                <span className="absolute right-4 top-1/2 z-10 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2 border-body-color"></span>
              </div>
              {errors.state && (
                <p className="text-red-500 text-xs">{errors.state}</p>
              )}
            </div>

            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                City
              </label>
              <div className="relative z-20">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="relative z-20 w-full mb-2 appearance-none rounded-lg border border-stroke bg-transparent py-[10px] px-4 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
                  disabled={!state} // Disable city dropdown if no state is selected
                >
                  <option value="" className="text-gray-400">
                    --Select City--
                  </option>
                  {cityList.length > 0 ? (
                    cityList.map((cityItem) => (
                      <option key={cityItem.cityId} value={cityItem.cityId}>
                        {cityItem.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No cities available
                    </option>
                  )}
                </select>
                <span className="absolute right-4 top-1/2 z-10 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2 border-body-color"></span>
              </div>
              {errors.city && (
                <p className="text-red-500 text-xs">{errors.city}</p>
              )}
            </div>

            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/2">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Blood Group
              </label>
              <input
                type="text"
                placeholder="Blood Group"
                value={bloodgroup}
                onChange={(e) => setBloodgroup(e.target.value)}
                className="w-full h-[48px] mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 outline-none transition"
              />
              {errors.bloodgroup && (
                <p className="text-red-500 text-xs">{errors.bloodgroup}</p>
              )}
            </div>

            <div className="w-full mb-3 px-3 md:w-1/2 lg:w-1/2">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Address
              </label>
              <textarea
                rows="1"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 px-3 p-3 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
              />
              {errors.address && (
                <p className="text-red-500 text-xs">{errors.address}</p>
              )}
            </div>
            <div className="w-full flex px-3">
              <button
                type="submit"
                className={`px-5 py-3 bg-blue-600 text-white font-medium rounded-md ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Add"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default AddEmployee;
