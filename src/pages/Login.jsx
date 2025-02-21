import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [otpMode, setOtpMode] = useState(false); // State to toggle OTP mode

    const navigate = useNavigate();

    const validateInputs = () => {
        let tempErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            tempErrors.email = "Email is required";
        } else if (!emailRegex.test(email)) {
            tempErrors.email = "Please enter a valid email address";
        }

        if (!password && !otpMode) tempErrors.password = "Password is required";
        if (!otp && otpMode) tempErrors.otp = "OTP is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleLogin = async () => {
        if (validateInputs()) {
            setLoading(true);
            try {
                const response = await axios.post("https://nxt-backend.onrender.com/api/auth/login", { email, password });

                console.log("Login successful, waiting for OTP...");
                setOtpMode(true); // Switch to OTP mode
            } catch (error) {
                setErrors({ general: error.response?.data?.error || "Login failed" });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleVerifyOtp = async () => {
        if (validateInputs()) {
            setLoading(true);
            try {
                const response = await axios.post(
                    "https://nxt-backend.onrender.com/api/auth/verify-otp",
                    { otp },
                    { headers: { email } }
                );
                console.log(response);
                localStorage.setItem("token", response.data.token);
                console.log(response.data.token);
                console.log("OTP verified successfully, user logged in.");
                navigate("/thank-you"); // Redirect after success
            } catch (error) {
                setErrors({ general: "Invalid OTP, please try again." });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <motion.div
            className="flex h-screen bg-gray-900 text-white items-center justify-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-96 text-center">
                <h2 className="text-3xl font-semibold">{otpMode ? "Enter OTP" : "Login"}</h2>
                <p className="text-gray-400 mt-2">
                    {otpMode ? `We've sent an OTP to ${email}` : "Enter your credentials"}
                </p>

                <div className="mt-6 space-y-4">
                    {/* Email Input */}
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 bg-gray-700 rounded border focus:ring-2 focus:ring-purple-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={otpMode || loading}
                    />
                    <p className="text-red-500 text-sm">{errors.email}</p>

                    {/* Password Input (Shown in login mode) */}
                    {!otpMode && (
                        <>
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full p-3 bg-gray-700 rounded border focus:ring-2 focus:ring-purple-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                            <p className="text-red-500 text-sm">{errors.password}</p>
                        </>
                    )}

                    {/* OTP Input (Shown in OTP mode) */}
                    {otpMode && (
                        <>
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                className="w-full p-3 bg-gray-700 rounded border text-center text-lg tracking-widest focus:ring-2 focus:ring-purple-500"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                disabled={loading}
                            />
                            <p className="text-red-500 text-sm">{errors.otp}</p>
                        </>
                    )}

                    {/* Login / Verify OTP Button */}
                    <button
                        onClick={otpMode ? handleVerifyOtp : handleLogin}
                        className="w-full bg-purple-600 hover:bg-purple-700 transition p-3 rounded text-lg flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                        ) : otpMode ? (
                            "Verify OTP"
                        ) : (
                            "Login"
                        )}
                    </button>

                    <p className="text-red-500 text-sm mt-2">{errors.general}</p>
                </div>

                {!otpMode && (
                    <p className="mt-4">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-purple-400">Sign up</Link>
                    </p>
                )}
            </div>
        </motion.div>
    );
};

export default Login;
