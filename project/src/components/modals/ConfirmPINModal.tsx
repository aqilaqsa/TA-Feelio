import React, { useState } from "react";
import Button from "../ui/Button";

interface Props {
  onSubmit: (pin: string) => void;
  onCancel: () => void;
  error?: string;
}

const ConfirmPINModal: React.FC<Props> = ({ onSubmit, onCancel, error }) => {
  const [pin, setPin] = useState("");

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Masukkan Password Akun Anak untuk Konfirmasi Aksi</h2>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit(pin)}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-400"
          placeholder="Password"
        />
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Batal
          </Button>
          <Button onClick={() => onSubmit(pin)}>Konfirmasi</Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPINModal;
