//#region Imports
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AgreementService } from "../../service/AgreementService";
import { GtmConnectionService } from "../../service/GtmConnectionService";
//#endregion 

//#region Component: ViewInvoice
const ViewInvoice = () => {

  //#region State Variables
  const { id } = useParams();
//   const navigate = useNavigate();

  const [formData, setFormData] = useState({
    gtmClientServiceId: "",
    invoiceDetailId: "",
    description : "",
    quantity : "",
    unit : "",
    taxDetailId: "",
    taxName: "",
    issuedByName: "",
    gtmClientServiceName: "",
    allProducts: [{ description: "", quantity: "", unit: "", unitPrice: "" }],
  });
  //#endregion

  //#region Fetch Invoice Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Inquiry
        const invoice = await GtmConnectionService.getByIdGtmConnection(id);
        console.log(invoice.data);
        setFormData(invoice.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);
  //#endregion

  //#region Render
  return (
    <>
      <div className="container mx-auto mb-10">
        <div className="bg-white rounded-lg space-y-6">
          
          {/* Header Section and Buttons */}
          {/* <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4">
            <h1 className="font-semibold text-2xl md:text-3xl">
              Invoice Details
            </h1>
          </div> */}

          {/* Invoice Details Section */}
          <div
            id="card-type-tab-preview"
            role="tabpanel"
            className="mt-7"
            aria-labelledby="card-type-tab-item-1"
          >
            {formData ? (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      label: "GTM Client",
                      name: "gtmClientServiceName",
                      value: formData.gtmClientServiceName,
                    },
                    {
                      label: "IssuedByCompany",
                      name: "issuedByName",
                      value: formData.issuedByName,
                    },
                    {
                      label: "Tax",
                      name: "taxName",
                      value: formData.taxName,
                    },
                    // {
                    //   label: "Description",
                    //   name: "description",
                    //   value: formData.description,
                    // },
                    // {
                    //   label: "Quantity",
                    //   name: "quantity",
                    //   value: formData.quantity,
                    // },
                    // {
                    //   label: "Unit",
                    //   name: "unit",
                    //   value: formData.unit,
                    // },

                  ].map((field, idx) => (
                    <div key={idx} className="w-full px-2">
                      <label className="font-semibold text-gray-700 me-2">
                        {field.label}:
                      </label>
                      <span className="text-gray-600">{field.value}</span>
                    </div>
                  ))}
                </div>
                {/* Products List */}
                <div className="mt-6 grid overflow-auto">
                  <p className="text-lg font-semibold mb-3 text-gray-700">Products</p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2 border text-gray-700 text-left">Description</th>
                          <th className="p-2 border text-gray-700 text-right">Quantity</th>
                          <th className="p-2 border text-gray-700 text-right">Unit</th>
                          <th className="p-2 border text-gray-700 text-right">Unit Price</th>
                          {/* <th className="p-2 border text-right">Total</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {(formData.allProducts || []).map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="p-2 border">{item.description}</td>
                            <td className="p-2 border text-right">{item.quantity}</td>
                            <td className="p-2 border text-right">{item.unit}</td>
                            <td className="p-2 border text-right">{item.unitPrice}</td>
                            {/* <td className="p-2 border text-right">
                              {(item.quantity * item.unitPrice).toFixed(2)}
                            </td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
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

export default ViewInvoice;
//#endregion
