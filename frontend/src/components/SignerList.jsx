import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

export default function SignerList({
  documentId,
}) {
  const [signers, setSigners] =
    useState([]);

  useEffect(() => {
    async function fetchSigners() {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/signers/${documentId}`
      );

      setSigners(res.data);
    }

    fetchSigners();
  }, [documentId]);

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-3">
        Signers
      </h2>

      {signers.map((signer) => (
        <div
          key={signer.id}
          className="border p-2 mb-2"
        >
          <p>{signer.email}</p>

          <p>
            Status:
            <strong>
              {signer.status}
            </strong>
          </p>
        </div>
      ))}
    </div>
  );
}