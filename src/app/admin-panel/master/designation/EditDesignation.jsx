import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DesignationService } from "../../../service/DesignationService";
import { DepartmentService } from "../../../service/DepartmentService";

const EditDesignation = () => {
  
  const [departmentId, setDepartmentId] = useState("");
  const [designationName, setDesignationName] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const [departmentList, setDepartmentList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartmentData = async () => {
      //#region Fetch DepartmentList
      const departmentResult = await DepartmentService.getDepartments();
      setDepartmentList(departmentResult.data);
      //#endregion Fetch DepartmentList
    };

    const fetchData = async () => {
      //#region Fetch DepartmentList
      const designation = await DesignationService.getByIdDesignation(id);
      //console.log(department);
      setDepartmentId(designation.data.departmentId);
      setDesignationName(designation.data.designationName);
      //#endregion Fetch DepartmentList
    };
    fetchData();
    fetchDepartmentData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!departmentId) newErrors.departmentId = "Department Name is required";
    if (!designationName) newErrors.designationName = "Designation is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate API call or form submission logic
      setTimeout(() => {
        setDesignationName("");
        setIsSubmitting(false);
      }, 1000); // Simulate a delay for submission
    }
    // Logic for form submission goes here
    const designationData = {
      departmentId,
      designationName,
    };

    console.log("Submitted Data:", designationData);

    if (validateForm()) {
      try {
        // setAdminId("3FA85F64-5717-4562-B3FC-2C963F66AFA6");
        const response = await DesignationService.updateDesignation(
          id,
          designationData
        );
        if (response.status === 1) {
          navigate("/master/designation-list");
          alert(response.message);
        }
        // Reset the form
        // setDesignationName('');
        // setDepartmentId('');
      } catch (error) {
        console.error("Error editing designation:", error);
        alert("Failed to edit designation.");
      }
    }
  };

  return (
    <>
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Add Designation</h1>
        <Link
          to="/master/designation-list"
          className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded flex items-center gap-2 hover:no-underline"
        >
          <FaArrowLeft size={16} />
          Back
        </Link>
      </div>

      <section className="bg-white shadow-sm m-1 py-8 pt-">
        <form onSubmit={handleSubmit} className="container">
          <div className="-mx-4 px-10 mt- flex flex-wrap">
            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/2">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Department
              </label>
              <div className="relative z-20">
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
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
                      No Departments available
                    </option>
                  )}
                </select>
                <span className="absolute right-4 top-1/2 z-10 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2 border-body-color"></span>
              </div>

              {errors.departmentId && (
                <p className="text-red-500 text-xs">{errors.departmentId}</p>
              )}
            </div>

            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/2">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Designation Name
              </label>
              <input
                type="text"
                placeholder="Designation Name"
                value={designationName}
                onChange={(e) => setDesignationName(e.target.value)}
                className="w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 outline-none transition"
              />
              {errors.designationName && (
                <p className="text-red-500 text-xs">{errors.designationName}</p>
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
                {isSubmitting ? "Submitting..." : "Edit"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default EditDesignation;