import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import MainLayout from '../components/layouts/MainLayout';

const API = import.meta.env.VITE_API_BASE;

const PendampingDashboard: React.FC = () => {
  const { user, impersonate } = useAuth();
  const navigate = useNavigate();
  const [children, setChildren] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    segment: '7-9',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChildren = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${API}/pendamping/${user.id}/children`);
        const data = await res.json();
        setChildren(data);
      } catch (err) {
        console.error('❌ Gagal memuat anak:', err);
      }
    };

    fetchChildren();
  }, [user]);

  const handleCreateChild = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const segmentNumber = form.segment === '7-9' ? 1 : 2;
      const res = await fetch(`${API}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          segment: segmentNumber,
          role: 'kid',
          parent_id: user?.id,
        }),
      });

      if (res.ok) {
        alert('✅ Anak berhasil dibuat!');
        setForm({ name: '', email: '', password: '', segment: '7-9' });
        const refreshed = await fetch(`${API}/pendamping/${user?.id}/children`);
        setChildren(await refreshed.json());
      } else {
        const err = await res.json();
        alert(`❌ Gagal membuat akun: ${err.error || 'Terjadi kesalahan'}`);
      }
    } catch (err) {
      console.error('❌ Gagal:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginAsChild = (child: any) => {
    const formattedChild = {
      ...child,
      role: 'kid',
      segment: child.segment === 1 ? '7-9' : '10-12',
      totalScore: 0,
      createdAt: new Date().toISOString(),
    };
    impersonate(formattedChild);
    navigate('/dashboard');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Halo, {user?.name} 👋
        </h1>

        <Card className="mb-8 p-6 bg-sky-50">
          <h2 className="text-2xl font-semibold mb-4 text-sky-800">
            Tambahkan Akun Anak
          </h2>
          <form onSubmit={handleCreateChild} className="grid md:grid-cols-2 gap-4">
            <Input
              label="Nama Anak"
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Email Anak"
              name="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium mb-1 p-1">Kelompok Usia</label>
              <select
                value={form.segment}
                onChange={(e) => setForm({ ...form, segment: e.target.value })}
                className="w-full p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="7-9">7-9 Tahun</option>
                <option value="10-12">10-12 Tahun</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Membuat...' : 'Buat Akun Anak'}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Daftar Anak Anda ({children.length})
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {children.map((child) => (
              <div key={child.id} className="border rounded-xl p-4 shadow bg-white flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold text-sky-700">{child.name}</p>
                  <p className="text-sm text-gray-500">Segment: {child.segment === 1 ? '7-9' : '10-12'}</p>
                  <p className="text-sm text-gray-500">{child.email}</p>
                </div>
                <Button variant="outline" onClick={() => handleLoginAsChild(child)}>
                  Login sebagai Anak Ini
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PendampingDashboard;
