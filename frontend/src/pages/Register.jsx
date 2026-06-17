import { useState } from "react";
import axios from "axios";
import {
  useNavigate,
  Link,
} from "react-router-dom";

export default function Register() {
  const navigate =
    useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        const { data } =
          await axios.post(
            "http://localhost:5000/api/auth/register",
            formData
          );

        localStorage.setItem(
          "token",
          data.token
        );

        navigate(
          "/dashboard"
        );
      } catch (error) {
        alert(
          error.response?.data
            ?.message ||
            "Registration failed"
        );
      }
    };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">

        <h1 className="text-4xl font-bold text-center mb-2">
          Register
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Create your account
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}