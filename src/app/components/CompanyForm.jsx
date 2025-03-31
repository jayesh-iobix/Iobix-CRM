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
    targetClients: '',
    customSolutions: '',
    useCaseSolutions: '',
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