import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layouts/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { AuthFormData } from "../types";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();

  const [formData, setFormData] = useState<AuthFormData>({
    name: "",
    email: "",
    password: "",
    segment: "7-9", // ✅ Default for pendamping — backend expects a value
  });

  const [errors, setErrors] = useState<{
    name?: string;
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

    if (!formData.name) newErrors.name = "Nama diperlukan";
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
      await signup({ ...formData, role: "pendamping" });
      navigate("/dashboard");
    } catch (error) {
      setErrors({
        ...errors,
        general: "Pendaftaran gagal. Silakan coba lagi.",
      });
    }
  };

  return (
    <AuthLayout title="Daftar ke Feelio" subtitle="Buat akun Pendamping">
      {errors.general && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {errors.general}
        </div>
      )}

      <p className="text-sm text-gray-500 mb-4">
        Halaman ini hanya untuk <strong>pendamping</strong>. Anak akan
        didaftarkan melalui akun pendamping.
      </p>

      <form onSubmit={handleSubmit}>
        <Input
          label="Nama"
          type="text"
          name="name"
          placeholder="Nama lengkapmu"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />

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
          placeholder="Buat password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <Button type="submit" className="w-full mt-6" disabled={loading}>
          {loading ? "Memuat..." : "Daftar"}
        </Button>
      </form>

      <p className="text-center mt-6 text-gray-600">
        Sudah punya akun?{" "}
        <Link to="/login" className="text-sky-600 hover:underline">
          Masuk
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;
