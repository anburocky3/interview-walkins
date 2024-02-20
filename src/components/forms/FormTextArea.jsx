import PropTypes from "prop-types";

const FormTextArea = ({
  name,
  type = "text",
  placeholder,
  register,
  error,
}) => {
  return (
    <div>
      <textarea
        name={name}
        type={type}
        placeholder={placeholder}
        className="px-4 py-2 bg-gray-100 outline-none rounded w-full"
        {...register}
      ></textarea>
      {error && <small className="text-red-500">{error.message}</small>}
    </div>
  );
};

FormTextArea.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  register: PropTypes.object.isRequired,
  error: PropTypes.object,
};

export default FormTextArea;
