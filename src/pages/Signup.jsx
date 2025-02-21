import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    dateOfBirth: "",
    photo: null,
  });
  const [errors, setErrors] = useState({});
  const [signupSuccess, setSignupSuccess] = useState(false);

  const validateInputs = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name) tempErrors.name = "Name is required";
    if (!formData.email) tempErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) tempErrors.email = "Invalid email format";
    if (!formData.password) tempErrors.password = "Password is required";
    if (!formData.confirmPassword) tempErrors.confirmPassword = "Confirm password is required";
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.companyName) tempErrors.companyName = "Company name is required";
    if (!formData.dateOfBirth) tempErrors.dateOfBirth = "Date of Birth is required";
    if (!formData.photo) tempErrors.photo = "Profile image is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSignup = async () => {
    if (validateInputs()) {
      try {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
          formDataToSend.append(key, formData[key]);
        });

        await axios.post("https://nxt-backend.onrender.com/api/auth/signup", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSignupSuccess(true);
      } catch (error) {
        setErrors({ general: error.response?.data?.error || "Signup failed" });
      }
    }
  };

  return (
    <motion.div 
      className="flex h-screen bg-gray-900 text-white justify-center items-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      {signupSuccess ? (
        <motion.div 
          className="w-full max-w-lg bg-gray-800 p-8 rounded-xl shadow-lg text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold">Signup Successful!</h2>
          <p className="text-lg mt-4">Your account has been created successfully.</p>
          <button 
            onClick={() => navigate("/login")}
            className="mt-6 bg-purple-600 hover:bg-purple-700 transition p-3 rounded"
          >
            Go to Login Page
          </button>
        </motion.div>
      ) : (
        <motion.div 
          className="w-full max-w-lg bg-gray-800 p-8 rounded-xl shadow-lg space-y-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold text-center">Create Account</h2>
          <div className="space-y-4">
            {Object.entries(formData).map(([key, value]) => (
              key !== "photo" && (
                <div key={key} className="flex flex-col space-y-1">
                  <input 
                    type={key.includes("password") ? "password" : key === "dateOfBirth" ? "date" : "text"} 
                    placeholder={
                      key === "email" ? "✉ Email" :
                      key === "password" ? "🔒 Password" :
                      key === "confirmPassword" ? "🔄 Confirm Password" :
                      key === "companyName" ? "🏢 Company Name" :
                      key === "dateOfBirth" ? "📅 Date of Birth" :
                      "🔤 " + key.charAt(0).toUpperCase() + key.slice(1)
                    }
                    className={`w-full p-3 bg-gray-700 rounded border ${errors[key] ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:ring-2 focus:ring-purple-500`} 
                    value={value} 
                    onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))} 
                  />
                  {errors[key] && <p className="text-red-500 text-sm">{errors[key]}</p>}
                </div>
              )
            ))}

            <div className="flex flex-col space-y-1">
              <input 
                type="file" 
                accept="image/png, image/jpg, image/jpeg" 
                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(e) => setFormData((prev) => ({ ...prev, photo: e.target.files[0] }))} 
              />
              {errors.photo && <p className="text-red-500 text-sm">{errors.photo}</p>}
            </div>

            <button 
              onClick={handleSignup} 
              className="w-full bg-purple-600 hover:bg-purple-700 transition p-3 rounded"
            >
              Sign Up
            </button>
            {errors.general && <p className="text-red-500 text-sm text-center">{errors.general}</p>}
          </div>
          <p className="text-center">Already have an account? <span className="text-purple-400 cursor-pointer" onClick={() => navigate("/login")}>Login</span></p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Signup;
