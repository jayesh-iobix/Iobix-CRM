import React, { useState } from "react";
import { BiPlusCircle, BiSolidPlusCircle, BiSolidXCircle } from "react-icons/bi";

const CompanyForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    businessOverview: '',
    coreTechStacks: '',
    consultingServices: '',
    targetIndustries: '',
    keyProjects: '',
    // useCase1: '',
    // useCase2: '',
    // useCase3: '',
    targetClients: '',
    customSolutions: '',
    useCaseSolutions: '',
    // product1: '',
    // product2: '',
    // product3: '',
    // product4: '',
    // partnership1: '',
    // partnership2: '',
    // partnership3: '',
    // partnership4: '',
    whyHire: '',
  });

  const [useCases, setUseCases] = useState([{ id: 1, value: '' }]);
  const [products, setProducts] = useState([{ id: 1, value: '' }]);
  const [partnerships, setPartnerships] = useState([{ id: 1, value: '' }]);

  // Handle Use Case Change
  const handleUseCaseChange = (id, value) => {
    setUseCases((prev) => prev.map((useCase) => (useCase.id === id ? { ...useCase, value } : useCase)));
  };

  // Handle Product Change
  const handleProductChange = (id, value) => {
    setProducts((prev) => prev.map((product) => (product.id === id ? { ...product, value } : product)));
  };

  // Handle Partnership Change
  const handlePartnershipChange = (id, value) => {
    setPartnerships((prev) => prev.map((partnership) => (partnership.id === id ? { ...partnership, value } : partnership)));
  };

  // Handle Add New Use Case
  const addUseCase = () => {
    const newId = useCases.length + 1;
    setUseCases((prev) => [...prev, { id: newId, value: '' }]);
  };

   // Handle Add New Product
   const addProduct = () => {
    const newId = products.length + 1;
    setProducts((prev) => [...prev, { id: newId, value: '' }]);
  };

  // Handle Add New Partnership
  const addPartnership = () => {
    const newId = partnerships.length + 1;
    setPartnerships((prev) => [...prev, { id: newId, value: '' }]);
  };

  // Handle Remove Use Case
  const removeUseCase = (id) => {
    setUseCases((prev) => prev.filter((useCase) => useCase.id !== id));
  };

   // Handle Remove Product
   const removeProduct = (id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  // Handle Remove Partnership
  const removePartnership = (id) => {
    setPartnerships((prev) => prev.filter((partnership) => partnership.id !== id));
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Company Profile Data:', formData);
    console.log('Use Cases:', useCases);
    console.log('Products:', products);
    console.log('Partnerships:', partnerships);
  };

  return (
    <div className="max-w-4xl mx-auto item-center shadow-lg rounded-lg p-4 bg-white">
      <h2 className="text-2xl font-semibold item-center text-center mb-6">
        Profile
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Company Information */}
        <fieldset className="mb-6">
          <legend className="text-xl font-semibold text-gray-700 mb-4">
            Company Information
          </legend>
          <div className="space-y-4">
            {/* Company Name */}
            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
                Company Name:
              </label>
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Overall Business Overview */}
            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
                Overall Business Overview (8 to 10 Lines):
              </label>
              <textarea
                name="businessOverview"
                placeholder="Business Overview"
                value={formData.businessOverview}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Core Technology Stacks */}
            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
                Core Technology Stacks:
              </label>
              <input
                type="text"
                name="coreTechStacks"
                placeholder="Core Technology Stacks"
                value={formData.coreTechStacks}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </fieldset>

        {/* Services Offered */}
        <fieldset className="mb-6">
          <legend className="text-xl font-semibold text-gray-700 mb-4">
            Services Offered
          </legend>
          <div className="space-y-4">
            {/* Consulting / Development Services */}
            <div className="relative">
              <label className="block mb-2 text-base font-medium text-gray-600 group">
                Consulting / Development Services:
                {/* Tooltip element */}
                <span className="absolute w-full top-0 ml-2 text-xs text-gray-700 bg-gray-200 p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
                  Provide a brief description of your consulting services (e.g.,
                  digital transformation, IT strategy, cloud migration, etc.).
                </span>
              </label>
              <input
                type="text"
                name="consultingServices"
                placeholder="Provide a brief description of your consulting services (e.g., digital transformation, IT strategy, etc.)."
                value={formData.consultingServices}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Target Industries */}
            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
                Target Industries:
              </label>
              <input
                type="text"
                name="targetIndustries"
                placeholder="Which industries or sectors do you serve with these services?"
                value={formData.targetIndustries}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Key Projects */}
            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
                Key Projects:
              </label>
              <textarea
                name="keyProjects"
                placeholder="Share any notable projects"
                value={formData.keyProjects}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Use Case */}
            <div className="space-y-4">
              {useCases.map((useCase) => (
                <div key={useCase.id} className="flex items-center space-x-4">
                  <div className="w-full">
                    <label className="block mb-2 text-base font-medium text-gray-600">
                      Use Case {useCase.id}:
                    </label>
                    <textarea
                      value={useCase.value}
                      onChange={(e) =>
                        handleUseCaseChange(useCase.id, e.target.value)
                      }
                      placeholder={`Use Case ${useCase.id}`}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  {useCase.id === 1 ? (
                    <BiSolidPlusCircle
                      onClick={addUseCase}
                      size={30}
                      className="me-2 mt-5 text-blue-600 cursor-pointer"
                    />
                  ) : (
                    <BiSolidXCircle
                      onClick={() => removeUseCase(useCase.id)}
                      size={30}
                      className="me-2 mt-5 text-red-600 cursor-pointer"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Target Clients */}
            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
                Target Clients:
              </label>
              <input
                type="text"
                name="targetClients"
                placeholder="Describe the type of clients who use these services"
                value={formData.targetClients}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </fieldset>

        {/* Solutions and Products */}
        <fieldset className="mb-6">
          <legend className="text-xl font-semibold text-gray-700 mb-4">
            Solutions and Products
          </legend>
          <div className="space-y-4">
            {/* Custom Solutions */}
            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
                Custom Solutions (Cloud/Automation/AI/Data Analytics/BI Etc.):
              </label>
              <textarea
                name="customSolutions"
                placeholder="Describe custom or semi-customizable solutions you offer (e.g., CRM systems, ERP platforms, etc.)."
                value={formData.customSolutions}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Use Case Solutions */}
            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
                Use Cases
              </label>
              <textarea
                name="useCaseSolutions"
                placeholder="Industries or business cases where these solutions have been successfully implemented."
                value={formData.useCaseSolutions}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Products */}
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="flex items-center space-x-4">
                  <div className="w-full">
                    <label className="block mb-2 text-base font-medium text-gray-600">
                      Product {product.id}:
                    </label>
                    <input
                      type="text"
                      value={product.value}
                      onChange={(e) =>
                        handleProductChange(product.id, e.target.value)
                      }
                      placeholder={`Product ${product.id}`}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  {product.id === 1 ? (
                    <BiSolidPlusCircle
                      onClick={addProduct}
                      size={30}
                      className="me-2 mt-5 text-blue-600 cursor-pointer"
                    />
                  ) : (
                    <BiSolidXCircle
                      onClick={() => removeProduct(product.id)}
                      size={30}
                      className="me-2 mt-5 text-red-600 cursor-pointer"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </fieldset>

        {/* Partnerships and Hiring Reasons */}
        <fieldset className="mb-6">
          <legend className="text-xl font-semibold text-gray-700 mb-4">
            Partnerships and Hiring Reasons
          </legend>
          <div className="space-y-4">
            {/* Partnerships */}
            <div className="space-y-4 relative">
              {partnerships.map((partnership) => (
                <div
                  key={partnership.id}
                  className="flex items-center space-x-4"
                >
                  <div className="w-full">
                    <label className="block mb-2 text-base font-medium text-gray-600 group">
                      Partnership {partnership.id}:{/* Tooltip element */}
                      <span className="absolute w-full top-0 ml-2 text-xs text-gray-700 bg-gray-200 p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
                        List any key technology or business partnerships that
                        enhance your offerings (e.g., partnerships with
                        Microsoft, AWS, Salesforce, etc.).
                      </span>
                    </label>
                    <input
                      type="text"
                      value={partnership.value}
                      onChange={(e) =>
                        handlePartnershipChange(partnership.id, e.target.value)
                      }
                      placeholder={`Partnership ${partnership.id}`}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  {partnership.id === 1 ? (
                    <BiSolidPlusCircle
                      onClick={addPartnership}
                      size={30}
                      className="me-2 mt-5 text-blue-600 cursor-pointer"
                    />
                  ) : (
                    <BiSolidXCircle
                      onClick={() => removePartnership(partnership.id)}
                      size={30}
                      className="me-2 mt-5 text-red-600 cursor-pointer"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Why companies should hire you? */}
            <div>
              <label className="block mb-2 text-base font-medium text-gray-600">
                Why companies should hire you?:
              </label>
              <textarea
                name="whyHire"
                placeholder="Why hire you?"
                value={formData.whyHire}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </fieldset>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CompanyForm;








// import React, { useState } from "react";
// import Stepper from "./Stepper"; // Assuming you are using the Stepper component
// import { CommonService } from "../service/CommonService";
// import Select from "react-select"; // Import react-select for searchable dropdown

// const CompanyForm = () => {
//   const [formData, setFormData] = useState({
//     companyName: '',
//     businessOverview: '',
//     coreTechStacks: '',
//     consultingServices: '',
//     targetIndustries: '',
//     keyProjects: '',
//     useCase1: '',
//     useCase2: '',
//     useCase3: '',
//     targetClients: '',
//     customSolutions: '',
//     product1: '',
//     product2: '',
//     product3: '',
//     product4: '',
//     partnership1: '',
//     partnership2: '',
//     partnership3: '',
//     partnership4: '',
//     whyHire: '',
//   });

//   const [currentStep, setCurrentStep] = useState(1); // Stepper state

//   // Handle Input Change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle Submit
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Company Profile Data:', formData);
//   };

//   // Define steps with labels and components
//   const steps = [
//     {
//       label: "Company Information",
//       component: (
//         <fieldset>
//           <legend className="text-xl font-semibold text-gray-700 mb-4">
//             Step 1: Company Information
//           </legend>
//           {/* Company Information Fields */}
//           <div className="space-y-4">
//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 Company Name:
//               </label>
//               <input
//                 type="text"
//                 name="companyName"
//                 placeholder="Company Name"
//                 value={formData.companyName}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 Overall Business Overview (8 to 10 Lines):
//               </label>
//               <textarea
//                 name="businessOverview"
//                 placeholder="Business Overview"
//                 value={formData.businessOverview}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 Core Technology Stacks:
//               </label>
//               <input
//                 type="text"
//                 name="coreTechStacks"
//                 placeholder="Core Technology Stacks"
//                 value={formData.coreTechStacks}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>
//           </div>
//         </fieldset>
//       ),
//     },
//     {
//       label: "Services Offered",
//       component: (
//         <fieldset>
//           <legend className="text-xl font-semibold text-gray-700 mb-4">
//             Step 2: Services Offered
//           </legend>
//           {/* Services Offered Fields */}
//           <div className="space-y-4">
//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 Consulting / Development Services:
//               </label>
//               <input
//                 type="text"
//                 name="consultingServices"
//                 placeholder="Consulting/Development Services"
//                 value={formData.consultingServices}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 Target Industries:
//               </label>
//               <input
//                 type="text"
//                 name="targetIndustries"
//                 placeholder="Target Industries"
//                 value={formData.targetIndustries}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 Key Projects:
//               </label>
//               <textarea
//                 name="keyProjects"
//                 placeholder="Key Projects"
//                 value={formData.keyProjects}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 Use Case 1:
//               </label>
//               <textarea
//                 name="useCase1"
//                 placeholder="Use Case 1"
//                 value={formData.useCase1}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 Use Case 2:
//               </label>
//               <textarea
//                 name="useCase2"
//                 placeholder="Use Case 2"
//                 value={formData.useCase2}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 Use Case 3:
//               </label>
//               <textarea
//                 name="useCase3"
//                 placeholder="Use Case 3"
//                 value={formData.useCase3}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 Target Clients:
//               </label>
//               <input
//                 type="text"
//                 name="targetClients"
//                 placeholder="Target Clients"
//                 value={formData.targetClients}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>
//           </div>
//         </fieldset>
//       ),
//     },
//     {
//       label: "Solutions and Products",
//       component: (
//         <fieldset>
//           <legend className="text-xl font-semibold text-gray-700 mb-4">
//             Step 3: Solutions and Products
//           </legend>
//           {/* Solutions and Products Fields */}
//           <div className="space-y-4">
//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 Custom Solutions (Cloud/Automation/AI/Data Analytics/BI Etc.):
//               </label>
//               <textarea
//                 name="customSolutions"
//                 placeholder="Custom Solutions"
//                 value={formData.customSolutions}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 Product 1:
//               </label>
//               <input
//                 type="text"
//                 name="product1"
//                 placeholder="Product 1"
//                 value={formData.product1}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 Product 2:
//               </label>
//               <input
//                 type="text"
//                 name="product2"
//                 placeholder="Product 2"
//                 value={formData.product2}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 Product 3:
//               </label>
//               <input
//                 type="text"
//                 name="product3"
//                 placeholder="Product 3"
//                 value={formData.product3}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 Product 4:
//               </label>
//               <input
//                 type="text"
//                 name="product4"
//                 placeholder="Product 4"
//                 value={formData.product4}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>
//           </div>
//         </fieldset>
//       ),
//     },
//     {
//       label: "Partnerships and Hiring Reasons",
//       component: (
//         <fieldset>
//           <legend className="text-xl font-semibold text-gray-700 mb-4">
//             Step 4: Partnerships and Hiring Reasons
//           </legend>
//           {/* Partnerships Fields */}
//           <div className="space-y-4">
//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 Partnership 1:
//               </label>
//               <input
//                 type="text"
//                 name="partnership1"
//                 placeholder="Partnership 1"
//                 value={formData.partnership1}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 Partnership 2:
//               </label>
//               <input
//                 type="text"
//                 name="partnership2"
//                 placeholder="Partnership 2"
//                 value={formData.partnership2}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 Partnership 3:
//               </label>
//               <input
//                 type="text"
//                 name="partnership3"
//                 placeholder="Partnership 3"
//                 value={formData.partnership3}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 Partnership 4:
//               </label>
//               <input
//                 type="text"
//                 name="partnership4"
//                 placeholder="Partnership 4"
//                 value={formData.partnership4}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block mb-2 text-base font-medium text-gray-600">
//                 Why companies should hire you?:
//               </label>
//               <textarea
//                 name="whyHire"
//                 placeholder="Why hire you?"
//                 value={formData.whyHire}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>
//           </div>
//         </fieldset>
//       ),
//     },
//   ];

//   return (
//     <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
//       <h2 className="text-2xl font-semibold text-center mb-6">Company Profile</h2>

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
//             onClick={() => setCurrentStep(currentStep + 1)}
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
//           >
//             Submit
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CompanyForm;















// import React, { useState } from "react";

// const CompanyForm = () => {
//   const [formData, setFormData] = useState({
//     companyName: "",
//     overview: "",
//     coreTechStacks: "",
//     consultingServices: "",
//     targetIndustries: "",
//     keyProjects: "",
//     useCase1: "",
//     useCase2: "",
//     useCase3: "",
//     targetClients: "",
//     customSolutions: "",
//     product1: "",
//     product2: "",
//     product3: "",
//     product4: "",
//     partnership1: "",
//     partnership2: "",
//     partnership3: "",
//     partnership4: "",
//     whyHireUs: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle form submission logic here (e.g., API call, form processing)
//     console.log(formData);
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="space-y-4">
//           <div>
//             <label className="block font-medium text-gray-700">Company Name:</label>
//             <input
//               type="text"
//               name="companyName"
//               value={formData.companyName}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
//             />
//           </div>

//           <div>
//             <label className="block font-medium text-gray-700">Overall Business Overview:</label>
//             <textarea
//               name="overview"
//               value={formData.overview}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
//               rows="4"
//             />
//           </div>

//           <div>
//             <label className="block font-medium text-gray-700">Core Technology Stacks:</label>
//             <input
//               type="text"
//               name="coreTechStacks"
//               value={formData.coreTechStacks}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
//             />
//           </div>

//           <div>
//             <label className="block font-medium text-gray-700">Consulting / Development Services:</label>
//             <input
//               type="text"
//               name="consultingServices"
//               value={formData.consultingServices}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
//             />
//           </div>

//           <div>
//             <label className="block font-medium text-gray-700">Target Industries:</label>
//             <input
//               type="text"
//               name="targetIndustries"
//               value={formData.targetIndustries}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
//             />
//           </div>

//           <div>
//             <label className="block font-medium text-gray-700">Key Projects:</label>
//             <input
//               type="text"
//               name="keyProjects"
//               value={formData.keyProjects}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
//             />
//           </div>

//           <div>
//             <label className="block font-medium text-gray-700">Use Case 1:</label>
//             <input
//               type="text"
//               name="useCase1"
//               value={formData.useCase1}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
//             />
//           </div>

//           <div>
//             <label className="block font-medium text-gray-700">Use Case 2:</label>
//             <input
//               type="text"
//               name="useCase2"
//               value={formData.useCase2}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
//             />
//           </div>

//           <div>
//             <label className="block font-medium text-gray-700">Use Case 3:</label>
//             <input
//               type="text"
//               name="useCase3"
//               value={formData.useCase3}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
//             />
//           </div>

//           <div>
//             <label className="block font-medium text-gray-700">Target Clients:</label>
//             <input
//               type="text"
//               name="targetClients"
//               value={formData.targetClients}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
//             />
//           </div>

//           <div>
//             <label className="block font-medium text-gray-700">Custom Solutions:</label>
//             <textarea
//               name="customSolutions"
//               value={formData.customSolutions}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
//               rows="4"
//             />
//           </div>

//           <div>
//             <label className="block font-medium text-gray-700">Product 1:</label>
//             <input
//               type="text"
//               name="product1"
//               value={formData.product1}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
//             />
//           </div>

//           <div>
//             <label className="block font-medium text-gray-700">Product 2:</label>
//             <input
//               type="text"
//               name="product2"
//               value={formData.product2}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
//             />
//           </div>

//           <div>
//             <label className="block font-medium text-gray-700">Product 3:</label>
//             <input
//               type="text"
//               name="product3"
//               value={formData.product3}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
//             />
//           </div>

//           <div>
//             <label className="block font-medium text-gray-700">Product 4:</label>
//             <input
//               type="text"
//               name="product4"
//               value={formData.product4}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
//             />
//           </div>

//           <div>
//             <label className="block font-medium text-gray-700">Partnership 1:</label>
//             <input
//               type="text"
//               name="partnership1"
//               value={formData.partnership1}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
//             />
//           </div>

//           <div>
//             <label className="block font-medium text-gray-700">Partnership 2:</label>
//             <input
//               type="text"
//               name="partnership2"
//               value={formData.partnership2}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
//             />
//           </div>

//           <div>
//             <label className="block font-medium text-gray-700">Partnership 3:</label>
//             <input
//               type="text"
//               name="partnership3"
//               value={formData.partnership3}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
//             />
//           </div>

//           <div>
//             <label className="block font-medium text-gray-700">Partnership 4:</label>
//             <input
//               type="text"
//               name="partnership4"
//               value={formData.partnership4}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
//             />
//           </div>

//           <div>
//             <label className="block font-medium text-gray-700">Why companies should hire you?</label>
//             <textarea
//               name="whyHireUs"
//               value={formData.whyHireUs}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
//               rows="4"
//             />
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="w-full py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
//         >
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CompanyForm;
