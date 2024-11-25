import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Registration = () => {
  const [formData, setFormData] = useState({
    f_name: "",
    f_username: "",
    f_email: "",
    f_mobile: "",
    f_gender: "Male",
    f_designation: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Submit registration form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { f_name, f_username, f_email, f_mobile, f_gender, password, f_designation } = formData;

    if (!f_name ||  !f_email || !f_mobile || !f_designation || !f_gender || !password)  {
      return res.status(400).json({ message: "All required fields are not filled." });
    }
    
    console.log("Form Data:", formData);
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          f_name,
          f_username,
          f_email,
          f_mobile,
          f_gender,
          f_designation,
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Registration failed. Please try again.");
      } else {
        // Registration successful, redirect to login or dashboard
        navigate("/login");
      }
    } catch (err) {
      setError("An error occurred while registering. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">User Registration</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="f_name">
            Full Name
          </label>
          <input
            type="text"
            id="f_name"
            name="f_name"
            value={formData.f_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="f_username">
            Username
          </label>
          <input
            type="text"
            id="f_username"
            name="f_username"
            value={formData.f_username}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="f_email">
            Email
          </label>
          <input
            type="email"
            id="f_email"
            name="f_email"
            value={formData.f_email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="f_mobile">
            Mobile Number
          </label>
          <input
            type="text"
            id="f_mobile"
            name="f_mobile"
            value={formData.f_mobile}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="f_gender">
            Gender
          </label>
          <select
            id="f_gender"
            name="f_gender"
            value={formData.f_gender}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
  <label className="block text-sm font-medium text-gray-700" htmlFor="f_designation">
    Designation
  </label>
  <input
    type="text"
    id="f_designation"
    name="f_designation"
    value={formData.f_designation}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 rounded"
  />
</div>


        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
            Register
          </button>
        </div>
      </form>
      <span className="bg-green-500">
      <Link to="/login">Link to Login</Link>
    </span>
    </div>
  );
};

export default Registration;
