
const AssignmentDropdown = ({ label, options, value, onChange, displayField = (opt) => opt.companyName || 'Unnamed', valueField = 'id', }) => {
  return (
    <div className="w-full mb-2 px-3 md:w-1/3">
      <label className="block text-base font-medium">
        {label}
      </label>
      <select
        className="w-full border rounded-md p-2 border-active"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">--Select {label}--</option>
        {options.map((opt) => (
          <option key={opt[valueField]} value={opt[valueField]}>
            {/* {opt[displayField] || 'Unnamed'} */}
            {displayField(opt)}
          </option>
        ))}
        {/* {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.companyName}
          </option>
        ))} */}
      </select>
    </div>
  );
};

export default AssignmentDropdown;
