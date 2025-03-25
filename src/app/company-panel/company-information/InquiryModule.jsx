// InquiryModule.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
// import Stepper from "./Stepper"; // Assuming you are using the Stepper component
import { CommonService } from "../../service/CommonService";
import Select from "react-select"; // Import react-select for searchable dropdown
import { ICPService } from "../../service/ICPService";
import { toast } from "react-toastify";
import { ca } from "date-fns/locale";
import { motion } from "framer-motion"; // Import framer-motion
import { FaArrowLeft } from "react-icons/fa";
import Stepper from "../../components/Stepper";


const InquiryModule = () => {
  const [formData, setFormData] = useState({
    countryId: [],
    stateId: [],
    cityId: [],
    industries: '',
    companySize: '',
    fundingStage: '',
    revenue: '',
    targetCustomer: '',
    averageDealSize: '',
    mainBusiness: '',
    customerTechFit: '',
    searchKeywords: '',
    customerSearchKeywords: '',
    coreOfferings: '',
    forumsWebsites: '',
    signalCategories: '',
    customIntentCategory: '',
    exclusionCriteria: '',
    accountsToAnalyze: '',
  });

  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const [currentStep, setCurrentStep] = useState(1); // Stepper state
  const [errors, setErrors] = useState({}); // State for storing errors
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch countries
        const countryResult = await CommonService.getCountry();
        setCountryList(countryResult.data);
        // Fetch states and cities if country and state are selected
        if (formData.countryId.length > 0) {
          const stateResult = await CommonService.getMultipleState(formData.countryId);
          setStateList(stateResult.data);

          if (stateResult.data.length > 0) {
            if (formData.stateId.length > 0) {
              const cityResult = await CommonService.getMultipleCity(formData.stateId);
              setCityList(cityResult.data);
              if (cityResult.data.length === 0) {
                setFormData((prev) => ({ ...prev, cityId: [] })); // Set cityId to empty array if no cities are found
              }
            }
          } else {
            setFormData((prev) => ({ ...prev, stateId: [], cityId: [] })); // Set stateId and cityId to empty arrays if no states are found
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [formData.countryId, formData.stateId]); // Trigger fetchData when countryId or stateId changes

  // Fetch countries on component mount
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  
  //       // Fetch countries
  //       const countryResult = await CommonService.getCountry();
  //       setCountryList(countryResult.data);
  //       // Fetch states and cities if country and state are selected
  //       if (formData.countryId) {
  //         const stateResult = await CommonService.getState(formData.countryId);
  //         setStateList(stateResult.data);
  
  //         if (stateResult.data.length > 0) {
  //           if (formData.stateId) {
  //             const cityResult = await CommonService.getCity(formData.stateId);
  //             setCityList(cityResult.data);
  //             if (cityResult.data.length === 0) {
  //               setFormData((prev) => ({ ...prev, cityId: 0 })); // Set cityId to 0 if no cities are found
  //             }
  //           }
  //         } else {
  //           setFormData((prev) => ({ ...prev, stateId: 0, cityId: 0 })); // Set stateId to 0 if no states are found
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching event type list:", error);
  //     }
  //   };
  //   fetchData();
  // }, [formData.countryId, formData.stateId]); // Trigger fetchData when countryId or stateId changes

  const handleSelectChange = (selectedOptions, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selectedOptions ? selectedOptions.map(option => option.value) : [], // Handle multi-selection
    }));

    // Reset state and city when country changes
    if (field === "countryId") {
      setFormData((prev) => ({
        ...prev,
        stateId: [], // Reset states when countries change
        cityId: [], // Reset cities when countries change
      }));
      setStateList([]); // Reset state list when country changes
      setCityList([]);  // Reset city list when country changes
    }

    // Reset city when state changes
    if (field === "stateId") {
      setFormData((prev) => ({
        ...prev,
        cityId: [], // Reset city when state changes
      }));
      setCityList([]); // Reset city list when state changes
    }
  };

  // const handleSelectChange = (selectedOption, field) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [field]: selectedOption ? selectedOption.value : null, // Handle selection
  //   }));
  
  //   // Reset state and city when country changes
  //   if (field === "countryId") {
  //     setFormData((prev) => ({
  //       ...prev,
  //       ["stateId"]: null, // Handle selection
  //       ["cityId"]: null, // Handle selection
  //     }));
  //     setStateList([]); // Reset state list when country changes
  //     setCityList([]);  // Reset city list when country changes
  //   }
  
  //   // Reset city when state changes
  //   if (field === "stateId") {
  //     setFormData((prev) => ({
  //       ...prev,
  //       ["cityId"]: null, // Handle selection
  //     }));
  //     setCityList([]); // Reset city list when state changes
  //   }
  // };

  const countryOptions = countryList.map((country) => ({
    value: country.countryId,
    label: country.name,
  }));

  const stateOptions = stateList.map((state) => ({
    value: state.stateId,
    label: state.name,
  }));

  const cityOptions = cityList.map((city) => ({
    value: city.cityId,
    label: city.name,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation function
  // const validate = () => {
  //   let tempErrors = {};
  //   let isValid = true;

  //   // Required fields validation
  //   if (!formData.countryId) {
  //     tempErrors.countryId = "*Country is required";
  //     isValid = false;
  //   }
  //   if (!formData.industries) {
  //     tempErrors.industries = "*Industries are required";
  //     isValid = false;
  //   }
  //   if (!formData.companySize) {
  //     tempErrors.companySize = "*Company size is required";
  //     isValid = false;
  //   }
  //   if (!formData.targetCustomer) {
  //     tempErrors.targetCustomer = "*Target customer is required";
  //     isValid = false;
  //   }
  //   if (!formData.averageDealSize) {
  //     tempErrors.averageDealSize = "*Average deal size is required";
  //     isValid = false;
  //   }
  //   if (!formData.searchKeywords) {
  //     tempErrors.searchKeywords = "*Search keywords are required";
  //     isValid = false;
  //   }
  //   if (!formData.customerSearchKeywords) {
  //     tempErrors.customerSearchKeywords = "*Customer search keywords are required";
  //     isValid = false;
  //   }
  //   if (!formData.coreOfferings) {
  //     tempErrors.coreOfferings = "*Core offerings are required";
  //     isValid = false;
  //   }
  //   if (!formData.forumsWebsites) {
  //     tempErrors.forumsWebsites = "*Forums/Websites are required";
  //     isValid = false;
  //   }

  //   setErrors(tempErrors);
  //   return isValid;
  // };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const icpData = {
    //   formData,
    // };
    
     try {
      // console.log("Form Data:", formData);
      const response = await ICPService.addICP(formData);
      // console.log("Response:", response);
      if (response.status === 1) {
        toast.success("Ideal Customer Profile added successfully!");
        navigate(-1)
        // navigate(`/company-form/${response.message}`);
      }
    }
    catch (error) {
      console.error("Failed to add Ideal Customer Profile:", error);
      toast.error("Failed to add Ideal Customer Profile");
    }
    // if (validate()) {
      // Proceed with form submission
    // }
  };

  const validateStep = (step) => {
    const newErrors = {};
    switch (step) {
      case 1:
        if (formData.countryId.length === 0) newErrors.countryId = "Country is required.";
        if (!formData.industries) newErrors.industries = "Industries are required.";
        if (!formData.companySize) newErrors.companySize = "Company Size is required.";
        if (!formData.targetCustomer) newErrors.targetCustomer = "Target Customer is required.";
        if (!formData.averageDealSize) newErrors.averageDealSize = "Average Deal Size is required.";
        break;
      case 2:
        if (!formData.searchKeywords) newErrors.searchKeywords = "Search Keywords are required.";
        if (!formData.customerSearchKeywords) newErrors.customerSearchKeywords = "Customer Search Keywords are required.";
        if (!formData.coreOfferings) newErrors.coreOfferings = "Core Offerings are required.";
        if (!formData.forumsWebsites) newErrors.forumsWebsites = "Forums/Websites are required.";
        break;
      case 3:
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Define steps with labels and components
  
  const steps = [
    {
      label: "Segmentation",
      component: (
        <fieldset>
          <legend className="text-xl font-semibold text-gray-700 mb-4">
            Step 1: Segmentation
          </legend>

          {/* Segmentation Fields */}
          <div className="space-y-4">
            {/* Country, State, and City */}
            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
                1. Where are you intending to sell? (Based on Historical, Research,
                Aspirations)
              </label>

              <div className="space-y-2">
                {/* Country */}
                <Select
                  options={countryOptions}
                  isMulti
                  value={countryOptions.filter((option) => formData.countryId.includes(option.value))} // For multi-select, filter selected options
                  // value={
                  //   countryOptions.find(
                  //     (option) => option.value === formData.countryId
                  //   ) || null
                  // } 
                  onChange={(selectedOption) =>
                    handleSelectChange(selectedOption, "countryId")
                  }
                  placeholder="Select Country"
                  />
                  {errors.countryId && <p className="text-red-500 text-sm">{errors.countryId}</p>}

                {/* State */}
                <Select
                  options={stateOptions}
                  isMulti
                  value={stateOptions.filter((option) => formData.stateId.includes(option.value))} // For multi-select, filter selected options
                  // value={
                  //   stateOptions.find(
                  //     (option) => option.value === formData.stateId
                  //   ) || null
                  // } // Use formData.stateId
                  onChange={(selectedOption) =>
                    handleSelectChange(selectedOption, "stateId")
                  }
                  placeholder="Select State"
                />

                {/* City */}
                <Select
                  options={cityOptions}
                  isMulti
                  value={cityOptions.filter((option) => formData.cityId.includes(option.value))} // For multi-select, filter selected options
                  // value={
                  //   cityOptions.find(
                  //     (option) => option.value === formData.cityId
                  //   ) || null
                  // } // Use formData.cityId
                  onChange={(selectedOption) =>
                    handleSelectChange(selectedOption, "cityId")
                  }
                  placeholder="Select City"
                />
              </div>
            </div>

            {/* Industries */}
            <div>
              <label className="block mb-2  text-base font-medium text-gray-600">
                2. Which industries do you want to focus on?
              </label>
              <input
                type="text"
                name="industries"
                placeholder="Industries"
                value={formData.industries}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.industries && <p className="text-red-500 text-sm">{errors.industries}</p>}
            </div>

            {/* Company Size */}
            <div>
              <label className="block mb-2  text-base font-medium text-gray-600">
                3. What is the size of the companies you sell to?
              </label>
              <input
                type="text"
                name="companySize"
                placeholder="Company Size"
                value={formData.companySize}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.companySize && <p className="text-red-500 text-sm">{errors.companySize}</p>}
            </div>

            {/* Funding Stage */}
            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
                4. Which stage of funding are the companies you sell to?
              </label>
              <input
                type="text"
                name="fundingStage"
                placeholder="Funding Stage"
                value={formData.fundingStage}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Revenue */}
            <div>
              <label className="block mb-2  text-base font-medium text-gray-600">
                5. What is the revenue of the company you sell to?
              </label>
              <input
                type="text"
                name="revenue"
                placeholder="Revenue"
                value={formData.revenue}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Target Customer */}
            <div>
              <label className="block mb-2  text-base font-medium text-gray-600">
                6. Who do you usually sell to?
              </label>
              <input
                type="text"
                name="targetCustomer"
                placeholder="Target Customer"
                value={formData.targetCustomer}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.targetCustomer && <p className="text-red-500 text-sm">{errors.targetCustomer}</p>}
            </div>

            {/* Average Deal Size */}
            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
                7. What is your average deal size?
              </label>
              <input
                type="text"
                name="averageDealSize"
                placeholder="Average Deal Size"
                value={formData.averageDealSize}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.averageDealSize && <p className="text-red-500 text-sm">{errors.averageDealSize}</p>}
            </div>
          </div>
        </fieldset>
      ),
    },
    {
      label: "Customer Matching",
      component: (
        <fieldset>
          <legend className="text-xl font-semibold text-gray-700 mb-4">
            Step 2: Customer Matching
          </legend>
          {/* Customer Matching Fields */}
          <div className="space-y-4">
            {/* Main Business */}
            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
                8. What is the main business of your target customer? Can you
                please elaborate?
              </label>
              <textarea
                name="mainBusiness"
                placeholder="Main Business"
                value={formData.mainBusiness}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Technologies/Skills */}
            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
                9. What are the existing technologies/skills/capabilities your
                customers might have where you are a good fit?
              </label>
              <textarea
                name="customerTechFit"
                placeholder="Technologies/Skills"
                value={formData.customerTechFit}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Search Keywords */}
            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
                10. What are the main keywords/search criterion used to search
                for your services or products?
              </label>
              <textarea
                name="searchKeywords"
                placeholder="Search Keywords"
                value={formData.searchKeywords}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.searchKeywords && <p className="text-red-500 text-sm">{errors.searchKeywords}</p>}
            </div>

            {/* Customer Search Keywords */}
            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
                11. What are the main keywords/search criterion that you usually
                use to search for your target customers?
              </label>
              <textarea
                name="customerSearchKeywords"
                placeholder="Customer Search Keywords"
                value={formData.customerSearchKeywords}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.customerSearchKeywords && <p className="text-red-500 text-sm">{errors.customerSearchKeywords}</p>}
            </div>

            {/* Core Offerings */}
            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
                12. What are your core offerings to your customers?
              </label>
              <textarea
                name="coreOfferings"
                placeholder="Core Offerings"
                value={formData.coreOfferings}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.coreOfferings && <p className="text-red-500 text-sm">{errors.coreOfferings}</p>}
            </div>

            {/* Forums/Websites */}
            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
                13. What are the forums / websites / communities that you are
                usually using to search for customers? (multiple)
              </label>
              <textarea
                name="forumsWebsites"
                placeholder="Forums/Websites"
                value={formData.forumsWebsites}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {errors.forumsWebsites && <p className="text-red-500 text-sm">{errors.forumsWebsites}</p>}
          </div>
        </fieldset>
      ),
    },
    {
      label: "Market Signals and Custom Requests",
      component: (
        <fieldset>
          <legend className="text-xl font-semibold text-gray-700 mb-4">
            Step 3: Market Signals and Custom Requests
          </legend>
          {/* Market Signals Fields */}
          <div className="space-y-4">
            {/* Signal Categories */}
            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
                14. List of signal super categories with related descriptions:
              </label>
              <textarea
                name="signalCategories"
                placeholder="Signal Categories"
                value={formData.signalCategories}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Custom Intent Category */}
            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
                15. Add custom/missing intent category:
              </label>
              <textarea
                name="customIntentCategory"
                placeholder="Custom Intent Category"
                value={formData.customIntentCategory}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Exclusion Criteria */}
            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
                16. Are there any specific aspects that you would not like to
                see in the results?
              </label>
              <textarea
                name="exclusionCriteria"
                placeholder="Exclusion Criteria"
                value={formData.exclusionCriteria}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Accounts to Analyze */}
            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
                17. Are there accounts which you want us to analyze? Please add
                if any:
              </label>
              <textarea
                name="accountsToAnalyze"
                placeholder="Accounts to Analyze"
                value={formData.accountsToAnalyze}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </fieldset>
      ),
    },
  ];

  // Check if all required fields are filled to enable the Submit button
  // const isSubmitDisabled = Object.keys(errors).length > 0 || !formData.countryId.length || !formData.industries || !formData.companySize || !formData.targetCustomer || !formData.averageDealSize;

  const handleNextClick = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <>
    <div className="flex flex-wrap justify-between items-center my-3">
      <h1 className="font-semibold text-xl sm:text-2xl">Add Ideal Customer Profile</h1>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Link
          onClick={() => navigate(-1)}
          className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded flex items-center gap-2 hover:no-underline"
        >
          <FaArrowLeft size={16} />
          Back
        </Link>
      </motion.button>
    </div>

    <section className="bg-white rounded-lg shadow-lg m-1 py-8">
    <div className="container px-4 sm:px-6 mx-auto">
      {/* Stepper */}
      <Stepper steps={steps} currentStep={currentStep} />
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        {currentStep > 1 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Previous
          </button>
        )}

        {currentStep < steps.length && (
          <button
            onClick={handleNextClick}
            // onClick={() => setCurrentStep(currentStep + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Next
          </button>
        )}

        {currentStep === steps.length && (
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            // disabled={isSubmitDisabled}
          >
            Submit
          </button>
        )}
       </div>

    </div>
    </section>

    </>
    // <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
    //   <h2 className="text-2xl font-semibold text-center mb-6">Ideal Customer Profile</h2>

    //   {/* Stepper Component */}
    //   <Stepper steps={steps} currentStep={currentStep} />

    //   {/* Navigation Buttons */}
    //   <div className="flex justify-between mt-6">
    //     {currentStep > 1 && (
    //       <button
    //         onClick={() => setCurrentStep(currentStep - 1)}
    //         className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
    //       >
    //         Previous
    //       </button>
    //     )}

    //     {currentStep < steps.length && (
    //       <button
    //         onClick={handleNextClick}
    //         // onClick={() => setCurrentStep(currentStep + 1)}
    //         className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    //       >
    //         Next
    //       </button>
    //     )}

    //     {currentStep === steps.length && (
    //       <button
    //         type="submit"
    //         onClick={handleSubmit}
    //         className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
    //         // disabled={isSubmitDisabled}
    //       >
    //         Submit
    //       </button>
    //     )}
    //   </div>
    // </div>
  );
};

export default InquiryModule;








// // InquiryModule.jsx
// import React, { useEffect, useState } from "react";
// import Stepper from "./Stepper"; // Assuming you are using the Stepper component
// import { CommonService } from "../service/CommonService";
// import Select from "react-select"; // Import react-select for searchable dropdown

// const InquiryModule = () => {
//   const [formData, setFormData] = useState({
//     countryId: [],
//     stateId: [],
//     cityId: [],
//     // countryId: '',
//     // stateId: '',
//     // cityId: '',
//     industries: '',
//     companySize: '',
//     fundingStage: '',
//     revenue: '',
//     targetCustomer: '',
//     averageDealSize: '',
//     mainBusiness: '',
//     customerTechFit: '',
//     searchKeywords: '',
//     customerSearchKeywords: '',
//     coreOfferings: '',
//     forumsWebsites: '',
//     signalCategories: '',
//     customIntentCategory: '',
//     exclusionCriteria: '',
//     accountsToAnalyze: '',
//   });

//   const [countryList, setCountryList] = useState([]);
//   const [stateList, setStateList] = useState([]);
//   const [cityList, setCityList] = useState([]);

//   const [currentStep, setCurrentStep] = useState(1); // Stepper state
//   const [errors, setErrors] = useState({}); // State for storing errors

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch countries
//         const countryResult = await CommonService.getCountry();
//         setCountryList(countryResult.data);
//         // Fetch states and cities if country and state are selected
//         if (formData.countryId.length > 0) {
//           const stateResult = await CommonService.getState(formData.countryId);
//           setStateList(stateResult.data);

//           if (stateResult.data.length > 0) {
//             if (formData.stateId.length > 0) {
//               const cityResult = await CommonService.getCity(formData.stateId);
//               setCityList(cityResult.data);
//               if (cityResult.data.length === 0) {
//                 setFormData((prev) => ({ ...prev, cityId: [] })); // Set cityId to empty array if no cities are found
//               }
//             }
//           } else {
//             setFormData((prev) => ({ ...prev, stateId: [], cityId: [] })); // Set stateId and cityId to empty arrays if no states are found
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     fetchData();
//   }, [formData.countryId, formData.stateId]); // Trigger fetchData when countryId or stateId changes

//   // Fetch countries on component mount
//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     try {
  
//   //       // Fetch countries
//   //       const countryResult = await CommonService.getCountry();
//   //       setCountryList(countryResult.data);
//   //       // Fetch states and cities if country and state are selected
//   //       if (formData.countryId) {
//   //         const stateResult = await CommonService.getState(formData.countryId);
//   //         setStateList(stateResult.data);
  
//   //         if (stateResult.data.length > 0) {
//   //           if (formData.stateId) {
//   //             const cityResult = await CommonService.getCity(formData.stateId);
//   //             setCityList(cityResult.data);
//   //             if (cityResult.data.length === 0) {
//   //               setFormData((prev) => ({ ...prev, cityId: 0 })); // Set cityId to 0 if no cities are found
//   //             }
//   //           }
//   //         } else {
//   //           setFormData((prev) => ({ ...prev, stateId: 0, cityId: 0 })); // Set stateId to 0 if no states are found
//   //         }
//   //       }
//   //     } catch (error) {
//   //       console.error("Error fetching event type list:", error);
//   //     }
//   //   };
//   //   fetchData();
//   // }, [formData.countryId, formData.stateId]); // Trigger fetchData when countryId or stateId changes

//   const handleSelectChange = (selectedOptions, field) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: selectedOptions ? selectedOptions.map(option => option.value) : [], // Handle multi-selection
//     }));

//     // Reset state and city when country changes
//     if (field === "countryId") {
//       setFormData((prev) => ({
//         ...prev,
//         stateId: [], // Reset states when countries change
//         cityId: [], // Reset cities when countries change
//       }));
//       setStateList([]); // Reset state list when country changes
//       setCityList([]);  // Reset city list when country changes
//     }

//     // Reset city when state changes
//     if (field === "stateId") {
//       setFormData((prev) => ({
//         ...prev,
//         cityId: [], // Reset city when state changes
//       }));
//       setCityList([]); // Reset city list when state changes
//     }
//   };

//   // const handleSelectChange = (selectedOption, field) => {
//   //   setFormData((prev) => ({
//   //     ...prev,
//   //     [field]: selectedOption ? selectedOption.value : null, // Handle selection
//   //   }));
  
//   //   // Reset state and city when country changes
//   //   if (field === "countryId") {
//   //     setFormData((prev) => ({
//   //       ...prev,
//   //       ["stateId"]: null, // Handle selection
//   //       ["cityId"]: null, // Handle selection
//   //     }));
//   //     setStateList([]); // Reset state list when country changes
//   //     setCityList([]);  // Reset city list when country changes
//   //   }
  
//   //   // Reset city when state changes
//   //   if (field === "stateId") {
//   //     setFormData((prev) => ({
//   //       ...prev,
//   //       ["cityId"]: null, // Handle selection
//   //     }));
//   //     setCityList([]); // Reset city list when state changes
//   //   }
//   // };

//   const countryOptions = countryList.map((country) => ({
//     value: country.countryId,
//     label: country.name,
//   }));

//   const stateOptions = stateList.map((state) => ({
//     value: state.stateId,
//     label: state.name,
//   }));

//   const cityOptions = cityList.map((city) => ({
//     value: city.cityId,
//     label: city.name,
//   }));

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Validation function
//   // const validate = () => {
//   //   let tempErrors = {};
//   //   let isValid = true;

//   //   // Required fields validation
//   //   if (!formData.countryId) {
//   //     tempErrors.countryId = "*Country is required";
//   //     isValid = false;
//   //   }
//   //   if (!formData.industries) {
//   //     tempErrors.industries = "*Industries are required";
//   //     isValid = false;
//   //   }
//   //   if (!formData.companySize) {
//   //     tempErrors.companySize = "*Company size is required";
//   //     isValid = false;
//   //   }
//   //   if (!formData.targetCustomer) {
//   //     tempErrors.targetCustomer = "*Target customer is required";
//   //     isValid = false;
//   //   }
//   //   if (!formData.averageDealSize) {
//   //     tempErrors.averageDealSize = "*Average deal size is required";
//   //     isValid = false;
//   //   }
//   //   if (!formData.searchKeywords) {
//   //     tempErrors.searchKeywords = "*Search keywords are required";
//   //     isValid = false;
//   //   }
//   //   if (!formData.customerSearchKeywords) {
//   //     tempErrors.customerSearchKeywords = "*Customer search keywords are required";
//   //     isValid = false;
//   //   }
//   //   if (!formData.coreOfferings) {
//   //     tempErrors.coreOfferings = "*Core offerings are required";
//   //     isValid = false;
//   //   }
//   //   if (!formData.forumsWebsites) {
//   //     tempErrors.forumsWebsites = "*Forums/Websites are required";
//   //     isValid = false;
//   //   }

//   //   setErrors(tempErrors);
//   //   return isValid;
//   // };

// //   const handleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value,
// //     });
// //   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // if (validate()) {
//       console.log("Form Data:", formData);
//       // Proceed with form submission
//     // }
//   };

//   const validateStep = (step) => {
//     const newErrors = {};
//     switch (step) {
//       case 1:
//         if (formData.countryId.length === 0) newErrors.countryId = "Country is required.";
//         if (!formData.industries) newErrors.industries = "Industries are required.";
//         if (!formData.companySize) newErrors.companySize = "Company Size is required.";
//         if (!formData.targetCustomer) newErrors.targetCustomer = "Target Customer is required.";
//         if (!formData.averageDealSize) newErrors.averageDealSize = "Average Deal Size is required.";
//         break;
//       case 2:
//         // if (!formData.mainBusiness) newErrors.mainBusiness = "Main Business is required.";
//         // if (!formData.customerTechFit) newErrors.customerTechFit = "Customer Tech Fit is required.";
//         if (!formData.searchKeywords) newErrors.searchKeywords = "Search Keywords are required.";
//         if (!formData.customerSearchKeywords) newErrors.customerSearchKeywords = "Customer Search Keywords are required.";
//         if (!formData.coreOfferings) newErrors.coreOfferings = "Core Offerings are required.";
//         if (!formData.forumsWebsites) newErrors.forumsWebsites = "Forums/Websites are required.";
//         break;
//       // case 3:
//       //   if (!formData.signalCategories) newErrors.signalCategories = "Signal Categories are required.";
//       //   if (!formData.customIntentCategory) newErrors.customIntentCategory = "Custom Intent Category is required.";
//       //   if (!formData.exclusionCriteria) newErrors.exclusionCriteria = "Exclusion Criteria is required.";
//       //   if (!formData.accountsToAnalyze) newErrors.accountsToAnalyze = "Accounts to Analyze is required.";
//       //   break;
//       default:
//         break;
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Define steps with labels and components
//   const steps = [
//     {
//       label: "Segmentation",
//       component: (
//         <fieldset>
//           <legend className="text-xl font-semibold text-gray-700 mb-4">
//             Step 1: Segmentation
//           </legend>

//           {/* Segmentation Fields */}
//           <div className="space-y-4">
//             {/* Country, State, and City */}
//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 1. Where are you intending to sell? (Based on Historical, Research,
//                 Aspirations)
//               </label>

//               <div className="space-y-2">
//                 {/* Country */}
//                 <Select
//                   options={countryOptions}
//                   isMulti
//                   value={countryOptions.filter((option) => formData.countryId.includes(option.value))} // For multi-select, filter selected options
//                   // value={
//                   //   countryOptions.find(
//                   //     (option) => option.value === formData.countryId
//                   //   ) || null
//                   // } 
//                   onChange={(selectedOption) =>
//                     handleSelectChange(selectedOption, "countryId")
//                   }
//                   placeholder="Select Country"
//                 />

//                 {/* State */}
//                 <Select
//                   options={stateOptions}
//                   isMulti
//                   value={stateOptions.filter((option) => formData.stateId.includes(option.value))} // For multi-select, filter selected options
//                   // value={
//                   //   stateOptions.find(
//                   //     (option) => option.value === formData.stateId
//                   //   ) || null
//                   // } // Use formData.stateId
//                   onChange={(selectedOption) =>
//                     handleSelectChange(selectedOption, "stateId")
//                   }
//                   placeholder="Select State"
//                 />

//                 {/* City */}
//                 <Select
//                   options={cityOptions}
//                   isMulti
//                   value={cityOptions.filter((option) => formData.cityId.includes(option.value))} // For multi-select, filter selected options
//                   // value={
//                   //   cityOptions.find(
//                   //     (option) => option.value === formData.cityId
//                   //   ) || null
//                   // } // Use formData.cityId
//                   onChange={(selectedOption) =>
//                     handleSelectChange(selectedOption, "cityId")
//                   }
//                   placeholder="Select City"
//                 />
//               </div>
//             {errors.countryId && <p className="text-red-500 text-sm">{errors.countryId}</p>}
//             </div>

//             {/* Industries */}
//             <div>
//               <label className="block mb-2  text-base font-medium text-gray-600">
//                 2. Which industries do you want to focus on?
//               </label>
//               <input
//                 type="text"
//                 name="industries"
//                 placeholder="Industries"
//                 value={formData.industries}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//               {errors.industries && <p className="text-red-500 text-sm">{errors.industries}</p>}
//             </div>

//             {/* Company Size */}
//             <div>
//               <label className="block mb-2  text-base font-medium text-gray-600">
//                 3. What is the size of the companies you sell to?
//               </label>
//               <input
//                 type="text"
//                 name="companySize"
//                 placeholder="Company Size"
//                 value={formData.companySize}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//               {errors.companySize && <p className="text-red-500 text-sm">{errors.companySize}</p>}
//             </div>

//             {/* Funding Stage */}
//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 4. Which stage of funding are the companies you sell to?
//               </label>
//               <input
//                 type="text"
//                 name="fundingStage"
//                 placeholder="Funding Stage"
//                 value={formData.fundingStage}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             {/* Revenue */}
//             <div>
//               <label className="block mb-2  text-base font-medium text-gray-600">
//                 5. What is the revenue of the company you sell to?
//               </label>
//               <input
//                 type="text"
//                 name="revenue"
//                 placeholder="Revenue"
//                 value={formData.revenue}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             {/* Target Customer */}
//             <div>
//               <label className="block mb-2  text-base font-medium text-gray-600">
//                 6. Who do you usually sell to?
//               </label>
//               <input
//                 type="text"
//                 name="targetCustomer"
//                 placeholder="Target Customer"
//                 value={formData.targetCustomer}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//               {errors.targetCustomer && <p className="text-red-500 text-sm">{errors.targetCustomer}</p>}
//             </div>

//             {/* Average Deal Size */}
//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 7. What is your average deal size?
//               </label>
//               <input
//                 type="text"
//                 name="averageDealSize"
//                 placeholder="Average Deal Size"
//                 value={formData.averageDealSize}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//               {errors.averageDealSize && <p className="text-red-500 text-sm">{errors.averageDealSize}</p>}
//             </div>
//           </div>
//         </fieldset>
//       ),
//     },
//     {
//       label: "Customer Matching",
//       component: (
//         <fieldset>
//           <legend className="text-xl font-semibold text-gray-700 mb-4">
//             Step 2: Customer Matching
//           </legend>
//           {/* Customer Matching Fields */}
//           <div className="space-y-4">
//             {/* Main Business */}
//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 8. What is the main business of your target customer? Can you
//                 please elaborate?
//               </label>
//               <textarea
//                 name="mainBusiness"
//                 placeholder="Main Business"
//                 value={formData.mainBusiness}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             {/* Technologies/Skills */}
//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 9. What are the existing technologies/skills/capabilities your
//                 customers might have where you are a good fit?
//               </label>
//               <textarea
//                 name="customerTechFit"
//                 placeholder="Technologies/Skills"
//                 value={formData.customerTechFit}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             {/* Search Keywords */}
//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 10. What are the main keywords/search criterion used to search
//                 for your services or products?
//               </label>
//               <textarea
//                 name="searchKeywords"
//                 placeholder="Search Keywords"
//                 value={formData.searchKeywords}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//               {errors.searchKeywords && <p className="text-red-500 text-sm">{errors.searchKeywords}</p>}
//             </div>

//             {/* Customer Search Keywords */}
//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 11. What are the main keywords/search criterion that you usually
//                 use to search for your target customers?
//               </label>
//               <textarea
//                 name="customerSearchKeywords"
//                 placeholder="Customer Search Keywords"
//                 value={formData.customerSearchKeywords}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//               {errors.customerSearchKeywords && <p className="text-red-500 text-sm">{errors.customerSearchKeywords}</p>}
//             </div>

//             {/* Core Offerings */}
//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 12. What are your core offerings to your customers?
//               </label>
//               <textarea
//                 name="coreOfferings"
//                 placeholder="Core Offerings"
//                 value={formData.coreOfferings}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//               {errors.coreOfferings && <p className="text-red-500 text-sm">{errors.coreOfferings}</p>}
//             </div>

//             {/* Forums/Websites */}
//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 13. What are the forums / websites / communities that you are
//                 usually using to search for customers? (multiple)
//               </label>
//               <textarea
//                 name="forumsWebsites"
//                 placeholder="Forums/Websites"
//                 value={formData.forumsWebsites}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>
//             {errors.forumsWebsites && <p className="text-red-500 text-sm">{errors.forumsWebsites}</p>}
//           </div>
//         </fieldset>
//       ),
//     },
//     {
//       label: "Market Signals and Custom Requests",
//       component: (
//         <fieldset>
//           <legend className="text-xl font-semibold text-gray-700 mb-4">
//             Step 3: Market Signals and Custom Requests
//           </legend>
//           {/* Market Signals Fields */}
//           <div className="space-y-4">
//             {/* Signal Categories */}
//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 14. List of signal super categories with related descriptions:
//               </label>
//               <textarea
//                 name="signalCategories"
//                 placeholder="Signal Categories"
//                 value={formData.signalCategories}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             {/* Custom Intent Category */}
//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 15. Add custom/missing intent category:
//               </label>
//               <textarea
//                 name="customIntentCategory"
//                 placeholder="Custom Intent Category"
//                 value={formData.customIntentCategory}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             {/* Exclusion Criteria */}
//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 16. Are there any specific aspects that you would not like to
//                 see in the results?
//               </label>
//               <textarea
//                 name="exclusionCriteria"
//                 placeholder="Exclusion Criteria"
//                 value={formData.exclusionCriteria}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             {/* Accounts to Analyze */}
//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 17. Are there accounts which you want us to analyze? Please add
//                 if any:
//               </label>
//               <textarea
//                 name="accountsToAnalyze"
//                 placeholder="Accounts to Analyze"
//                 value={formData.accountsToAnalyze}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>
//           </div>
//         </fieldset>
//       ),
//     },
//   ];

//   // Check if all required fields are filled to enable the Submit button
//   const isSubmitDisabled = Object.keys(errors).length > 0 || !formData.countryId.length || !formData.industries || !formData.companySize || !formData.targetCustomer || !formData.averageDealSize;

//   const handleNextClick = () => {
//     if (validateStep(currentStep)) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
//       <h2 className="text-2xl font-semibold text-center mb-6">Ideal Customer Profile</h2>

//       {/* Stepper Component */}
//       <Stepper steps={steps} currentStep={currentStep} />

//       {/* Navigation Buttons */}
//       <div className="flex justify-between mt-6">
//         {currentStep > 1 && (
//           <button
//             onClick={() => setCurrentStep(currentStep - 1)}
//             className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
//           >
//             Previous
//           </button>
//         )}

//         {currentStep < steps.length && (
//           <button
//             onClick={handleNextClick}
//             // onClick={() => setCurrentStep(currentStep + 1)}
//             className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//           >
//             Next
//           </button>
//         )}

//         {currentStep === steps.length && (
//           <button
//             type="submit"
//             onClick={handleSubmit}
//             className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//             // disabled={isSubmitDisabled}
//           >
//             Submit
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InquiryModule;






