import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion"; // Import framer-motion
import { ICPService } from "../../service/ICPService";


const ViewIquiryModule = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [icpDetails, setIcpDetails] = useState({});

    useEffect(() => {
      const fetchData = async () => {
        try {
          // First try to fetch task data from TaskService
          const icpResult = await ICPService.getByIdICP(id);
            setIcpDetails(icpResult.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    }, [id]);

  const getStatusColor = (status) => {
    const statusColors = {
      Pending: "text-red-500 bg-red-100",
      Completed: "text-green-500 bg-green-100",
      InProgress: "text-yellow-500 bg-yellow-100",
    };
    return statusColors[status] || "text-gray-500 bg-gray-100";
  };

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // You can customize the date format as needed
  };
  

  return (
    <>
      <div className="container mx-auto mb-10">
        <div className="bg-white px-10 p-8 rounded-lg shadow-lg space-y-8">
          <div className="flex justify-between items-center border-b pb-4">
            <h1 className="font-semibold text-3xl">Ideal Cutomer Details</h1>
            <div className="flex">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link
                  to={`/company/edit-icp/${id}`}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 text-center text-white font-medium py-2 px-4 me-2 rounded hover:no-underline"
                >
                  Edit Ideal Cutomer Details
                  <FaEdit size={20} />
                </Link>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link
                  onClick={() => navigate(-1)} // Navigate back to previous page
                  className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded flex items-center gap-2 hover:no-underline"
                >
                  <FaArrowLeft size={16} />
                  Back
                </Link>
              </motion.button>
            </div>
          </div>
          <div className="space-y-5">
            {/* Segmentation */}
            <div className="mb-6">
              <span className="text-2xl font-semibold mb-4">
                Step 1: Segmentation
              </span>
              <div>
                <p className="mt-4">
                  <strong className="mr-1 block text-gray-700">
                    1. Where are you intending to sell? (Based on Historical,
                    Research, Aspirations)
                  </strong>{" "}
                  <div className="mt-2">
                    <span className="me-2 text-red-600">Ans:</span>
                    <b className="me-1 text-gray-700">Country :</b>
                    {icpDetails.countryName} ||
                    <b className="me-1 text-gray-700"> State:</b>{" "}
                    {icpDetails.stateName} ||
                    <b className="me-1 text-gray-700"> City:</b>{" "}
                    {icpDetails.cityName}
                  </div>
                </p>

                {/* Industry */}
                <p className="mt-6">
                  <strong className="mr-1 block text-gray-700">
                    2. Which industries do you want to focus on?
                  </strong>{" "}
                  <div className="mt-2">
                    <span className="me-2 text-red-600">Ans:</span>{" "}
                    {icpDetails.industries}
                  </div>
                </p>

                {/* Company Size */}
                <p className="mt-6">
                  <strong className="mr-1 block text-gray-700">
                    3. What is the size of the companies you sell to?:
                  </strong>{" "}
                  <div className="mt-2">
                    <span className="me-2 text-red-600">Ans:</span>{" "}
                    {icpDetails.companySize}
                  </div>
                </p>

                {/* Funding Stage */}
                <p className="mt-6">
                  <strong className="mr-1 block text-gray-700">
                    4. Which stage of funding are the companies you sell to?:
                  </strong>{" "}
                  <div className="mt-2">
                    <span className="me-2 text-red-600">Ans:</span>{" "}
                    {icpDetails.fundingStage}
                  </div>
                </p>

                {/* Revenue */}
                <p className="mt-6">
                  <strong className="mr-1 block text-gray-700">
                    5. What is the revenue of the company you sell to?:
                  </strong>{" "}
                  <div className="mt-2">
                    <span className="me-2 text-red-600">Ans:</span>{" "}
                    {icpDetails.revenue}
                  </div>
                </p>

                {/* Target Customer */}
                <p className="mt-6">
                  <strong className="mr-1 block text-gray-700">
                    6. Who do you usually sell to?:
                  </strong>{" "}
                  <div className="mt-2">
                    <span className="me-2 text-red-600">Ans:</span>{" "}
                    {icpDetails.targetCustomer}
                  </div>
                </p>

                {/* Average Deal Size */}
                <p className="mt-6">
                  <strong className="mr-1 block text-gray-700">
                    7. What is your average deal size?:
                  </strong>{" "}
                  <div className="mt-2">
                    <span className="me-2 text-red-600">Ans:</span>{" "}
                    {icpDetails.averageDealSize}
                  </div>
                </p>
              </div>
            </div>

            {/* Step 2: Customer Matching */}
            <div className="mb-6">
              <span className="text-2xl font-semibold mb-4">
                Step 2: Customer Matching
              </span>
              <div>
                {/* mainBusiness */}
                <p className="mt-6">
                  <strong className="mr-1 block text-gray-700">
                    {" "}
                    8. What is the main business of your target customer? Can
                    you please elaborate?:
                  </strong>{" "}
                  <div className="mt-2">
                    <span className="me-2 text-red-600">Ans:</span>{" "}
                    {icpDetails.mainBusiness}
                  </div>
                </p>

                {/* customerTechFit */}
                <p className="mt-6">
                  <strong className="mr-1 block text-gray-700">
                    {" "}
                    9. What are the existing technologies/skills/capabilities
                    your customers might have where you are a good fit?:
                  </strong>{" "}
                  <div className="mt-2">
                    <span className="me-2 text-red-600">Ans:</span>{" "}
                    {icpDetails.customerTechFit}
                  </div>
                </p>

                {/* searchKeywords */}
                <p className="mt-6">
                  <strong className="mr-1 block text-gray-700">
                    {" "}
                    10. What are the main keywords/search criterion used to
                    search for your services or products?:
                  </strong>{" "}
                  <div className="mt-2">
                    <span className="me-2 text-red-600">Ans:</span>{" "}
                    {icpDetails.searchKeywords}
                  </div>
                </p>

                {/* customerSearchKeywords */}
                <p className="mt-6">
                  <strong className="mr-1 block text-gray-700">
                    {" "}
                    11. What are the main keywords/search criterion that you
                    usually use to search for your target customers?:
                  </strong>{" "}
                  <div className="mt-2">
                    <span className="me-2 text-red-600">Ans:</span>{" "}
                    {icpDetails.customerSearchKeywords}
                  </div>
                </p>

                {/* coreOfferings */}
                <p className="mt-6">
                  <strong className="mr-1 block text-gray-700">
                    {" "}
                    12. What are your core offerings to your customers?:
                  </strong>{" "}
                  <div className="mt-2">
                    <span className="me-2 text-red-600">Ans:</span>{" "}
                    {icpDetails.coreOfferings}
                  </div>
                </p>

                {/* forumsWebsites */}
                <p className="mt-6">
                  <strong className="mr-1 block text-gray-700">
                    {" "}
                    13. What are the forums / websites / communities that you
                    are usually using to search for customers? (multiple):
                  </strong>{" "}
                  <div className="mt-2">
                    <span className="me-2 text-red-600">Ans:</span>{" "}
                    {icpDetails.forumsWebsites}
                  </div>
                </p>
              </div>
            </div>

            {/* Step 3: Market Signals and Custom Requests */}
            <div className="mb-2">
              <span className="text-2xl font-semibold mb-4">
                Step 3: Market Signals and Custom Requests
              </span>
              <div>
                {/* signalCategories */}
                <p className="mt-6">
                  <strong className="mr-1 block text-gray-700">
                    {" "}
                    14. List of signal super categories with related
                    descriptions:
                  </strong>{" "}
                  <div className="mt-2">
                    <span className="me-2 text-red-600">Ans:</span>{" "}
                    {icpDetails.signalCategories}
                  </div>
                </p>

                {/* Custom Intent Category */}
                <p className="mt-6">
                  <strong className="mr-1 block text-gray-700">
                    15. Add custom/missing intent category:
                  </strong>{" "}
                  <div className="mt-2">
                    <span className="me-2 text-red-600">Ans:</span>{" "}
                    {icpDetails.customIntentCategory}
                  </div>
                </p>

                {/* Exclusion Criteria */}
                <p className="mt-6">
                  <strong className="mr-1 block text-gray-700">
                    16. Are there any specific aspects that you would not like
                    to see in the results?:
                  </strong>{" "}
                  <div className="mt-2">
                    <span className="me-2 text-red-600">Ans:</span>{" "}
                    {icpDetails.exclusionCriteria}
                  </div>
                </p>

                {/* Accounts to Analyze */}
                <p className="mt-6">
                  <strong className="mr-1 block text-gray-700">
                    17. Are there accounts which you want us to analyze? Please
                    add if any:
                  </strong>{" "}
                  <div className="mt-2">
                    <span className="me-2 text-red-600">Ans:</span>{" "}
                    {icpDetails.accountsToAnalyze}
                  </div>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewIquiryModule;
