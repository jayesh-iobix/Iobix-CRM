//#region Imports
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AgreementService } from "../../service/AgreementService";
//#endregion 

//#region Component: ViewAgreement
const ViewAgreement = () => {

  //#region State Variables
  const { id } = useParams();
  //   const navigate = useNavigate();

  const [formData, setFormData] = useState({
    gtmClientServiceId: "",
    startDate: "",
    endDate: "",
    renewDate: "",
    amount: "",
    agreementDocument: "",
  });
  //#endregion

  //#region Fetch Agreement Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Inquiry
        const gtmAgreement = await AgreementService.getByIdAgreement(id);
        // console.log(gtmAgreement.data);
        setFormData(gtmAgreement.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);
  //#endregion

  //#region Format the date in DD-MM-YYYY
  // Format the date in DD-MM-YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // handles null, undefined, and empty string
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // 'en-GB' format is DD/MM/YYYY
  };
  //#endregion

  //#region Render
  return (
    <>
      <div className="container mx-auto mb-10">
        <div className="bg-white rounded-lg space-y-6">
          {/* Header Section and Buttons */}
          {/* <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4">
            <h1 className="font-semibold text-2xl">
              Agreement Details
            </h1>
          </div> */}

          {/* Agreement Details Section */}
          <div
            id="card-type-tab-preview"
            role="tabpanel"
            className="mt-7"
            aria-labelledby="card-type-tab-item-1"
          >
            {formData ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    label: "Start Date",
                    name: "startDate",
                    value: formatDate(formData.startDate),
                  },
                  {
                    label: "End Date",
                    name: "endDate",
                    value: formatDate(formData.endDate),
                  },
                  {
                    label: "Renew Date",
                    name: "renewDate",
                    value: formatDate(formData.renewDate),
                  },
                  {
                    label: "Amount",
                    name: "amount",
                    value: formData.amount,
                  },
                  {
                    label: "Agreement Document",
                    value: formData.agreementDocument ? (
                      <a
                        href={formData.agreementDocument}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        Open Agreement Document
                      </a>
                    ) : (
                      "No document available"
                    ),
                  },
                ].map((field, idx) => (
                  <div key={idx} className="w-full px-2">
                    <label className="font-semibold text-gray-700 me-2">
                      {field.label}:
                    </label>
                    <span className="text-gray-600">{field.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              
              <p className="text-center text-gray-500">No data available</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
  //#endregion
};

export default ViewAgreement;
//#endregion
