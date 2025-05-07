//#region Imports
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import { CommonService } from "../../service/CommonService";
import { ICPService } from "../../service/ICPService";
import Stepper from "../../components/Stepper";
//#endregion

//#region  Component: EditInquiryModule
const EditInquiryModule = () => {
  //#region State Variables
  const [formData, setFormData] = useState({
    countryId: [],
    stateId: [],
    cityId: [],
    countries: [],
    states: [],
    cities: [],
    industries: "",
    companySize: "",
    fundingStage: "",
    revenue: "",
    targetCustomer: "",
    averageDealSize: "",
    mainBusiness: "",
    customerTechFit: "",
    searchKeywords: "",
    customerSearchKeywords: "",
    coreOfferings: "",
    forumsWebsites: "",
    signalCategories: "",
    customIntentCategory: "",
    exclusionCriteria: "",
    accountsToAnalyze: "",
  });

  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [currentStep, setCurrentStep] = useState(1); // Stepper state
  const [errors, setErrors] = useState({}); // State for storing errors

  const { id } = useParams(); // Get the ID from the URL (if applicable)
  const navigate = useNavigate();
  //#endregion

  //#region useEffect for fetching data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ICPService.getByIdICP(id); // Fetch the existing data using the id
        // console.log(response.data);
        setFormData(response.data); // Prepopulate the form with the existing data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);
  //#endregion

  //#region useEffect for fetching country, state, and city data
  useEffect(() => {
    const fetchCountrystatecityData = async () => {
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
                setFormData((prev) => ({ ...prev, cityId: [] }));
              }
            }
          } else {
            setFormData((prev) => ({ ...prev, stateId: [], cityId: [] }));
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCountrystatecityData();
  }, [formData.countryId, formData.stateId]);
  //#endregion

  //#region Handle Select Change
  const handleSelectChange = (selectedOptions, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selectedOptions ? selectedOptions.map(option => option.value) : [], // Handle multi-selection
    }));
  
    if (field === "countryId") {
      setFormData((prev) => ({
        ...prev,
        stateId: [], // Reset states when countries change
        cityId: [],  // Reset cities when countries change
      }));
      setStateList([]); // Reset state list when country changes
      setCityList([]);  // Reset city list when country changes
    }
  
    if (field === "stateId") {
      setFormData((prev) => ({
        ...prev,
        cityId: [], // Reset city when state changes
      }));
      setCityList([]); // Reset city list when state changes
    }
  };
  //#endregion
  
  //#region Country, State,and City Option
  const countryOptions = countryList.map((country) => ({
    value: country.countryId,
    label: country.name,
  }));
  
  const selectedCountryOptions = countryOptions.filter((option) =>
    Array.isArray(formData.countryId) && formData.countryId.includes(option.value)
  );

  const stateOptions = stateList.map((state) => ({
    value: state.stateId,
    label: state.name,
  }));

  const cityOptions = cityList.map((city) => ({
    value: city.cityId,
    label: city.name,
  }));
  //#endregion

  //#region Handle Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  //#endregion

  //#region Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await ICPService.updateICP(id, formData); // Update the data with the given id
      // console.log("Response:", response);
      if (response.status === 1) {
        toast.success("Ideal Customer Profile updated successfully!");
        navigate(-1); // Navigate back to the previous page
        // navigate(/company-form/${response.message});
      }
    } catch (error) {
      console.error("Failed to update Ideal Customer Profile:", error);
      toast.error("Failed to update Ideal Customer Profile");
    }
  };
  //#endregion

  //#region Validation Step
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
  //#endregion

  //#region Steps Configuration
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
                  value={countryOptions.filter((option) => formData.countryId.includes(option.value))}
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
                  value={stateOptions.filter((option) => formData.stateId.includes(option.value))}
                  onChange={(selectedOption) =>
                    handleSelectChange(selectedOption, "stateId")
                  }
                  placeholder="Select State"
                />

                {/* City */}
                <Select
                  options={cityOptions}
                  isMulti
                  value={cityOptions.filter((option) => formData.cityId.includes(option.value))}
                  onChange={(selectedOption) =>
                    handleSelectChange(selectedOption, "cityId")
                  }
                  placeholder="Select City"
                />
              </div>
            </div>

            {/* Industries */}
            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
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
            </div>

            {/* Company Size */}
            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
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
              <label className="block mb-2 text-base font-medium text-gray-600">
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
              <label className="block mb-2 text-base font-medium text-gray-600">
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
    // The rest of the steps (Customer Matching, Market Signals, etc.) will remain the same.
  ];

  const handleNextClick = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };
  //#endregion

  //#region Render
  return (
    <>
      {/* Header Section and Buttons */}
      <div className="flex flex-wrap justify-between items-center my-3">
        <h1 className="font-semibold text-xl sm:text-2xl">Edit Ideal Customer Profile</h1>
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

      {/* Form Section */}
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
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
  //#endregion
};

export default EditInquiryModule;
//#endregion
