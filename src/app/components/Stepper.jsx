import React from "react";

const Stepper = ({ steps = [], currentStep = 1 }) => {
  return (
    <div className="w-full">
      {/* Stepper Header */}
      <div className="flex justify-between items-center mb-6">
        {steps.map((step, index) => {
          const isActive = currentStep === index + 1;
          const isCompleted = currentStep > index + 1;

          return (
            <div key={index} className="flex items-center w-full">
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all ease-in-out duration-300 ${
                    isCompleted
                      ? "bg-gradient-to-r from-green-400 to-green-600 border-green-600 text-white"
                      : isActive
                      ? "bg-gradient-to-r from-blue-400 to-blue-600 border-blue-600 text-white"
                      : "bg-gray-300 border-gray-400 text-gray-700"
                  }`}
                >
                  {isCompleted ? (
                    <span className="text-lg">✓</span>
                  ) : (
                    <span className="text-lg font-semibold">{index + 1}</span>
                  )}
                </div>
                {/* Label */}
                <span
                  className={`mt-2 text-sm font-medium transition-all duration-300 ${
                    isCompleted || isActive ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {/* Connector */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 rounded-full transition-all mb-6 ease-in-out duration-300 ${
                    isCompleted ? "bg-green-600" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="mt-6">
        {steps[currentStep - 1]?.component}
      </div>
    </div>
  );
};

export default Stepper;