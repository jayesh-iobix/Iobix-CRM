// InquiryModule.jsx
import React, { useEffect, useState } from "react";
import Stepper from "./Stepper"; // Assuming you are using the Stepper component
import { CommonService } from "../service/CommonService";
import Select from "react-select"; // Import react-select for searchable dropdown

const InquiryModule = () => {
  const [formData, setFormData] = useState({
    countryId: '',
    stateId: '',
    cityId: '',
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

  useEffect(() => {
    const fetchData = async () => {
      try {
  
        // Fetch countries
        const countryResult = await CommonService.getCountry();
        setCountryList(countryResult.data);
        // Fetch states and cities if country and state are selected
        if (formData.countryId) {
          const stateResult = await CommonService.getState(formData.countryId);
          setStateList(stateResult.data);
  
          if (stateResult.data.length > 0) {
            if (formData.stateId) {
              const cityResult = await CommonService.getCity(formData.stateId);
              setCityList(cityResult.data);
              if (cityResult.data.length === 0) {
                setFormData((prev) => ({ ...prev, cityId: 0 })); // Set cityId to 0 if no cities are found
              }
            }
          } else {
            setFormData((prev) => ({ ...prev, stateId: 0, cityId: 0 })); // Set stateId to 0 if no states are found
          }
        }
      } catch (error) {
        console.error("Error fetching event type list:", error);
      }
    };
    fetchData();
  }, [formData.countryId, formData.stateId]); // Trigger fetchData when countryId or stateId changes

  const handleSelectChange = (selectedOption, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selectedOption ? selectedOption.value : null, // Handle selection
    }));
  
    // Reset state and city when country changes
    if (field === "countryId") {
      setFormData((prev) => ({
        ...prev,
        ["stateId"]: null, // Handle selection
        ["cityId"]: null, // Handle selection
      }));
      setStateList([]); // Reset state list when country changes
      setCityList([]);  // Reset city list when country changes
    }
  
    // Reset city when state changes
    if (field === "stateId") {
      setFormData((prev) => ({
        ...prev,
        ["cityId"]: null, // Handle selection
      }));
      setCityList([]); // Reset city list when state changes
    }
  };

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

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
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
            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
                Where are you intending to sell? (Based on Historical, Research,
                Aspirations)
              </label>
              <div className="space-y-2">
                <Select
                  options={countryOptions}
                  value={
                    countryOptions.find(
                      (option) => option.value === formData.countryId
                    ) || null
                  } // Use formData.countryId
                  onChange={(selectedOption) =>
                    handleSelectChange(selectedOption, "countryId")
                  }
                  placeholder="Select Country"
                />
                <Select
                  options={stateOptions}
                  value={
                    stateOptions.find(
                      (option) => option.value === formData.stateId
                    ) || null
                  } // Use formData.stateId
                  onChange={(selectedOption) =>
                    handleSelectChange(selectedOption, "stateId")
                  }
                  placeholder="Select State"
                />
                <Select
                  options={cityOptions}
                  value={
                    cityOptions.find(
                      (option) => option.value === formData.cityId
                    ) || null
                  } // Use formData.cityId
                  onChange={(selectedOption) =>
                    handleSelectChange(selectedOption, "cityId")
                  }
                  placeholder="Select City"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2  text-base font-medium text-gray-600">
                Which industries do you want to focus on?
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

            <div>
              <label className="block mb-2  text-base font-medium text-gray-600">
                What is the size of the companies you sell to?
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

            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
                Which stage of funding are the companies you sell to?
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

            <div>
              <label className="block mb-2  text-base font-medium text-gray-600">
                What is the revenue of the company you sell to?
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

            <div>
              <label className="block mb-2  text-base font-medium text-gray-600">
                Who do you usually sell to?
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

            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
                What is your average deal size?
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
            </div>

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
            </div>

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
            </div>

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

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Ideal Customer Profile</h2>

      {/* Stepper Component */}
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
            onClick={() => setCurrentStep(currentStep + 1)}
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
  );
};

export default InquiryModule;







// import React, { useState } from 'react';

// function InquiryModule() {
//   const [formData, setFormData] = useState({
//     country: '',
//     state: '',
//     city: '',
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

//   const [currentStep, setCurrentStep] = useState(1); // Track the current step

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form Data:', formData);
//     // Add your submit logic here (e.g., API call or local storage)
//   };

//   const goToNextStep = () => {
//     if (currentStep < 3) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const goToPrevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
//       <h2 className="text-2xl font-semibold text-center mb-6">Ideal Customer Profile</h2>

//       {/* Stepper Navigation */}
//       <div className="flex justify-between mb-6">
//         <button
//           type="button"
//           onClick={goToPrevStep}
//           className={`py-2 px-4 rounded-md ${currentStep === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
//           disabled={currentStep === 1}
//         >
//           Previous
//         </button>
//         <button
//           type="button"
//           onClick={goToNextStep}
//           className={`py-2 px-4 rounded-md ${currentStep === 3 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
//           disabled={currentStep === 3}
//         >
//           Next
//         </button>
//       </div>

//       {/* Step 1: Segmentation */}
//       {currentStep === 1 && (
//         <fieldset className="mb-6">
//           <legend className="text-xl font-semibold text-gray-700 mb-4">Step 1: Segmentation</legend>

//           <div className="space-y-4">
//             <div>
//               <label className="block text-gray-600">1. Where are you intending to sell? (Based on Historical, Research, Aspirations)</label>
//               <div className="flex gap-4">
//                 <input
//                   type="text"
//                   name="country"
//                   placeholder="Country"
//                   value={formData.country}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 />
//                 <input
//                   type="text"
//                   name="state"
//                   placeholder="State"
//                   value={formData.state}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 />
//                 <input
//                   type="text"
//                   name="city"
//                   placeholder="City"
//                   value={formData.city}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-gray-600">2. Which industries do you want to focus on?</label>
//               <input
//                 type="text"
//                 name="industries"
//                 placeholder="Industries"
//                 value={formData.industries}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-600">3. What is the size of the companies you sell to?</label>
//               <input
//                 type="text"
//                 name="companySize"
//                 placeholder="Company Size"
//                 value={formData.companySize}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-600">4. Which stage of funding are the companies you sell to?</label>
//               <input
//                 type="text"
//                 name="fundingStage"
//                 placeholder="Funding Stage"
//                 value={formData.fundingStage}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-600">5. What is the revenue of the company you sell to?</label>
//               <input
//                 type="text"
//                 name="revenue"
//                 placeholder="Revenue"
//                 value={formData.revenue}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-600">6. Who do you usually sell to?</label>
//               <input
//                 type="text"
//                 name="targetCustomer"
//                 placeholder="Target Customer"
//                 value={formData.targetCustomer}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-600">7. What is your average deal size?</label>
//               <input
//                 type="text"
//                 name="averageDealSize"
//                 placeholder="Average Deal Size"
//                 value={formData.averageDealSize}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>
//           </div>
//         </fieldset>
//       )}

//       {/* Step 2: Customer Matching */}
//       {currentStep === 2 && (
//         <fieldset className="mb-6">
//           <legend className="text-xl font-semibold text-gray-700 mb-4">Step 2: Customer Matching</legend>

//           <div className="space-y-4">
//             <div>
//               <label className="block text-gray-600">8. What is the main business of your target customer? Can you please elaborate?</label>
//               <textarea
//                 name="mainBusiness"
//                 placeholder="Main Business"
//                 value={formData.mainBusiness}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-600">9. What are the existing technologies/skills/capabilities your customers might have where you are a good fit?</label>
//               <textarea
//                 name="customerTechFit"
//                 placeholder="Technologies/Skills"
//                 value={formData.customerTechFit}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-600">10. What are the main keywords/search criteria used to search for your services or products?</label>
//               <textarea
//                 name="searchKeywords"
//                 placeholder="Search Keywords"
//                 value={formData.searchKeywords}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-600">11. What are the main keywords/search criteria that you usually use to search for your target customers?</label>
//               <textarea
//                 name="customerSearchKeywords"
//                 placeholder="Customer Search Keywords"
//                 value={formData.customerSearchKeywords}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-600">12. What are your core offerings to your customers?</label>
//               <textarea
//                 name="coreOfferings"
//                 placeholder="Core Offerings"
//                 value={formData.coreOfferings}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-600">13. What are the forums/websites/communities that you are usually using to search for customers? (multiple)</label>
//               <textarea
//                 name="forumsWebsites"
//                 placeholder="Forums/Websites"
//                 value={formData.forumsWebsites}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>
//           </div>
//         </fieldset>
//       )}

//       {/* Step 3: Market Signals and Custom Requests */}
//       {currentStep === 3 && (
//         <fieldset className="mb-6">
//           <legend className="text-xl font-semibold text-gray-700 mb-4">Step 3: Market Signals and Custom Requests</legend>

//           <div className="space-y-4">
//             <div>
//               <label className="block text-gray-600">14. List of signal super categories with related descriptions:</label>
//               <textarea
//                 name="signalCategories"
//                 placeholder="Signal Categories"
//                 value={formData.signalCategories}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-600">15. Add custom/missing intent category:</label>
//               <textarea
//                 name="customIntentCategory"
//                 placeholder="Custom Intent Category"
//                 value={formData.customIntentCategory}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-600">16. Are there any specific aspects that you would not like to see in the results?</label>
//               <textarea
//                 name="exclusionCriteria"
//                 placeholder="Exclusion Criteria"
//                 value={formData.exclusionCriteria}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-600">17. Are there any accounts you want us to analyze? Please add if any.</label>
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
//       )}

//       {/* Submit Button */}
//       {currentStep === 3 && (
//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           Submit
//         </button>
//       )}
//     </form>
//   );
// }

// export default InquiryModule;










// import React, { useState } from 'react';

// function InquiryModule() {
//   const [formData, setFormData] = useState({
//     country: '',
//     state: '',
//     city: '',
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

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form Data:', formData);
//     // Add your submit logic here (e.g., API call or local storage)
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
//       <h2 className="text-2xl font-semibold text-center mb-6">Ideal Customer Profile</h2>

//       {/* Step 1: Segmentation */}
//       <fieldset className="mb-6">
//         <legend className="text-xl font-semibold text-gray-700 mb-4">Step 1: Segmentation</legend>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-gray-600">1. Where are you intending to sell? (Based on Historical, Research, Aspirations)</label>
//             <div className="flex gap-4">
//               <input
//                 type="text"
//                 name="country"
//                 placeholder="Country"
//                 value={formData.country}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//               <input
//                 type="text"
//                 name="state"
//                 placeholder="State"
//                 value={formData.state}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//               <input
//                 type="text"
//                 name="city"
//                 placeholder="City"
//                 value={formData.city}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-gray-600">2. Which industries do you want to focus on?</label>
//             <input
//               type="text"
//               name="industries"
//               placeholder="Industries"
//               value={formData.industries}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-600">3. What is the size of the companies you sell to?</label>
//             <input
//               type="text"
//               name="companySize"
//               placeholder="Company Size"
//               value={formData.companySize}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-600">4. Which stage of funding are the companies you sell to?</label>
//             <input
//               type="text"
//               name="fundingStage"
//               placeholder="Funding Stage"
//               value={formData.fundingStage}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-600">5. What is the revenue of the company you sell to?</label>
//             <input
//               type="text"
//               name="revenue"
//               placeholder="Revenue"
//               value={formData.revenue}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-600">6. Who do you usually sell to?</label>
//             <input
//               type="text"
//               name="targetCustomer"
//               placeholder="Target Customer"
//               value={formData.targetCustomer}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-600">7. What is your average deal size?</label>
//             <input
//               type="text"
//               name="averageDealSize"
//               placeholder="Average Deal Size"
//               value={formData.averageDealSize}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </div>
//         </div>
//       </fieldset>

//       {/* Step 2: Customer Matching */}
//       <fieldset className="mb-6">
//         <legend className="text-xl font-semibold text-gray-700 mb-4">Step 2: Customer Matching</legend>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-gray-600">8. What is the main business of your target customer? Can you please elaborate?</label>
//             <textarea
//               name="mainBusiness"
//               placeholder="Main Business"
//               value={formData.mainBusiness}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-600">9. What are the existing technologies/skills/capabilities your customers might have where you are a good fit?</label>
//             <textarea
//               name="customerTechFit"
//               placeholder="Technologies/Skills"
//               value={formData.customerTechFit}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-600">10. What are the main keywords/search criteria used to search for your services or products?</label>
//             <textarea
//               name="searchKeywords"
//               placeholder="Search Keywords"
//               value={formData.searchKeywords}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-600">11. What are the main keywords/search criteria that you usually use to search for your target customers?</label>
//             <textarea
//               name="customerSearchKeywords"
//               placeholder="Customer Search Keywords"
//               value={formData.customerSearchKeywords}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-600">12. What are your core offerings to your customers?</label>
//             <textarea
//               name="coreOfferings"
//               placeholder="Core Offerings"
//               value={formData.coreOfferings}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-600">13. What are the forums/websites/communities that you are usually using to search for customers? (multiple)</label>
//             <textarea
//               name="forumsWebsites"
//               placeholder="Forums/Websites"
//               value={formData.forumsWebsites}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </div>
//         </div>
//       </fieldset>

//       {/* Step 3: Market Signals and Custom Requests */}
//       <fieldset className="mb-6">
//         <legend className="text-xl font-semibold text-gray-700 mb-4">Step 3: Market Signals and Custom Requests</legend>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-gray-600">14. List of signal super categories with related descriptions:</label>
//             <textarea
//               name="signalCategories"
//               placeholder="Signal Categories"
//               value={formData.signalCategories}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-600">15. Add custom/missing intent category:</label>
//             <textarea
//               name="customIntentCategory"
//               placeholder="Custom Intent Category"
//               value={formData.customIntentCategory}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-600">16. Are there any specific aspects that you would not like to see in the results?</label>
//             <textarea
//               name="exclusionCriteria"
//               placeholder="Exclusion Criteria"
//               value={formData.exclusionCriteria}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-600">17. Are there any accounts you want us to analyze? Please add if any.</label>
//             <textarea
//               name="accountsToAnalyze"
//               placeholder="Accounts to Analyze"
//               value={formData.accountsToAnalyze}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </div>
//         </div>
//       </fieldset>

//       <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
//         Submit
//       </button>
//     </form>
//   );
// }

// export default InquiryModule;
