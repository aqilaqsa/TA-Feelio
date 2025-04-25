import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layouts/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { AuthFormData, UserSegment } from '../types';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();
  const [formData, setFormData] = useState<AuthFormData>({
    name: '',
    email: '',
    password: '',
    segment: '7-9',
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    segment?: string;
    general?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSegmentChange = (segment: UserSegment) => {
    setFormData({ ...formData, segment });
    if (errors.segment) {
      setErrors({ ...errors, segment: undefined });
    }
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.name) {
      newErrors.name = 'Nama diperlukan';
    }
    
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
    
    if (!formData.segment) {
      newErrors.segment = 'Silakan pilih kelompok usia';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      await signup(formData);
      navigate('/dashboard');
    } catch (error) {
      setErrors({
        ...errors,
        general: 'Pendaftaran gagal. Silakan coba lagi.',
      });
    }
  };

  return (
    <AuthLayout 
      title="Daftar ke Feelio" 
      subtitle="Buat akun untuk mulai belajar tentang emosi"
    >
      {errors.general && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {errors.general}
        </div>
      )}
      
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
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Kelompok Usia
          </label>
          
          <div className="flex space-x-4">
            <button
              type="button"
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-colors ${
                formData.segment === '7-9'
                  ? 'border-sky-600 bg-sky-100 text-sky-800'
                  : 'border-gray-300 hover:border-sky-300'
              }`}
              onClick={() => handleSegmentChange('7-9')}
            >
              7-9 Tahun
            </button>
            
            <button
              type="button"
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-colors ${
                formData.segment === '10-12'
                  ? 'border-sky-600 bg-sky-100 text-sky-800'
                  : 'border-gray-300 hover:border-sky-300'
              }`}
              onClick={() => handleSegmentChange('10-12')}
            >
              10-12 Tahun
            </button>
          </div>
          
          {errors.segment && (
            <p className="mt-1 text-red-500 text-sm">{errors.segment}</p>
          )}
        </div>
        
        <Button
          type="submit"
          className="w-full mt-6"
          disabled={loading}
        >
          {loading ? 'Memuat...' : 'Daftar'}
        </Button>
      </form>
      
      <p className="text-center mt-6 text-gray-600">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-sky-600 hover:underline">
          Masuk
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;