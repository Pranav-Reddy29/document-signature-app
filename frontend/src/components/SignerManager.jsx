import { useState } from "react";
import axios from "axios";

export default function SignerManager({
  documentId,
}) {
  const [email, setEmail] =
    useState("");

  async function addSigner() {
    try {
      await axios.post(
        "http://localhost:5000/api/signers",
        {
          email,
          documentId,
        }
      );

      alert("Signer Added");

      setEmail("");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-3">
        Add Signer
      </h2>

      <input
        type="email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        placeholder="Signer Email"
        className="border p-2 mr-3"
      />

      <button
        onClick={addSigner}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add
      </button>
    </div>
  );
}