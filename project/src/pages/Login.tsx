import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layouts/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { AuthFormData } from "../types";
import axios from "axios";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, user } = useAuth();

  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
  });

  const [isMentor, setIsMentor] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!formData.email) {
      newErrors.email = "Email diperlukan";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.password) {
      newErrors.password = "Password diperlukan";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password harus minimal 6 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await login({ ...formData, role: isMentor ? "pendamping" : "kid" });
    } catch (error: any) {
      console.error("Login gagal:", error);

      if (axios.isAxiosError(error) && error.response?.data?.error) {
        setErrors({
          ...errors,
          general: error.response.data.error,
        });
      } else {
        setErrors({
          ...errors,
          general: "Login gagal. Silakan coba lagi.",
        });
      }
    }
  };

  // ✅ Redirect user after login based on role
  useEffect(() => {
    if (user) {
      const destination =
        user.role === "pendamping" ? "/pendamping" : "/dashboard";
      navigate(destination);
    }
  }, [user, navigate]);

  return (
    <AuthLayout
      title="Selamat Datang Kembali!"
    >
      {errors.general && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {errors.general}
        </div>
      )}

      <p className="text-center text-gray-700 mb-2 mt-4 font-medium">
        Masuk sebagai:
      </p>

      <div className="relative flex justify-center mb-6">
        <div className="relative inline-flex w-64 bg-sky-100 rounded-md p-2 transition-all duration-300">
          <div
            className={`absolute top-1 left-1 h-10 w-32 rounded-md bg-white shadow transition-all duration-300 ${
              isMentor ? "translate-x-[121px]" : "translate-x-0"
            }`}
          />
          <button
            type="button"
            onClick={() => setIsMentor(false)}
            className={`relative z-10 w-36 h-8 rounded-sm text-md transition-colors duration-200 ${
              !isMentor ? "text-sky-800 font-bold" : "text-sky-300"
            }`}
          >
            Anak
          </button>
          <button
            type="button"
            onClick={() => setIsMentor(true)}
            className={`relative z-10 w-36 h-8 rounded-sm text-md transition-colors duration-200 ${
              isMentor ? "text-sky-800 font-bold" : "text-sky-300"
            }`}
          >
            Pendamping
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="emailmu@contoh.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Masukkan password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <Button type="submit" className="w-full mt-8" disabled={loading}>
          {loading ? "Memuat..." : "Masuk"}
        </Button>
      </form>

      <p className="text-center mt-6 text-gray-600">
        Belum punya akun?{" "}
        <Link to="/signup" className="text-sky-600 hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
