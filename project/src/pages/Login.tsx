import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layouts/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { AuthFormData } from '../types';
import axios from 'axios';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
  });

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
      newErrors.email = 'Email diperlukan';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password diperlukan';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password harus minimal 6 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login gagal:', error);

      if (axios.isAxiosError(error) && error.response?.data?.error) {
        setErrors({
          ...errors,
          general: error.response.data.error,
        });
      } else {
        setErrors({
          ...errors,
          general: 'Login gagal. Silakan coba lagi.',
        });
      }
    }
  };

  return (
    <AuthLayout
      title="Selamat Datang Kembali!"
      subtitle="Masuk untuk melanjutkan petualanganmu di Feelio"
    >
      {errors.general && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {errors.general}
        </div>
      )}

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

        <Button type="submit" className="w-full mt-6" disabled={loading}>
          {loading ? 'Memuat...' : 'Masuk'}
        </Button>
      </form>

      <p className="text-center mt-6 text-gray-600">
        Belum punya akun?{' '}
        <Link to="/signup" className="text-sky-600 hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
