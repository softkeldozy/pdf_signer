import { useState } from "react";

export default function SignatureToolbar({ onClear, onSign, onColorChange }) {
  const [isSigning, setIsSigning] = useState(false);

  return (
    <div className="flex gap-4 p-4 bg-gray-100 rounded-lg mb-4">
      <button
        onClick={() => {
          setIsSigning(true);
          onSign();
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={isSigning}
      >
        {isSigning ? "Signing..." : "Place Signature"}
      </button>

      <button
        onClick={() => {
          setIsSigning(false);
          onClear();
        }}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Clear
      </button>

      <div className="flex items-center gap-2">
        <label>Color:</label>
        <input
          type="color"
          onChange={(e) => onColorChange(e.target.value)}
          className="w-8 h-8 cursor-pointer"
          defaultValue="#000000"
        />
      </div>
    </div>
  );
}
