import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function DocumentSignatures() {
  const { documentId } = useParams();

  const [signatures, setSignatures] =
    useState([]);

  const fetchSignatures =
    async () => {
      try {
        const res =
          await axios.get(
            `${import.meta.env.VITE_API_URL}/api/signatures/${documentId}`
          );

        setSignatures(
          res.data
        );
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    fetchSignatures();
  }, []);

  const removeSignature =
    async (signatureId) => {
      const confirmDelete =
        window.confirm(
          "Remove this signature?"
        );

      if (!confirmDelete)
        return;

      try {
        const token =
          localStorage.getItem(
            "token"
          );

        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/signatures/${signatureId}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        alert(
          "Signature removed successfully"
        );

        fetchSignatures();
      } catch (error) {
        console.log(error);

        alert(
          "Failed to remove signature"
        );
      }
    };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold mb-6">
          Document Signatures
        </h1>

        {signatures.length ===
        0 ? (
          <p>
            No signatures found
          </p>
        ) : (
          signatures.map(
            (signature) => (
              <div
                key={
                  signature.id
                }
                className="border rounded-lg p-4 mb-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p>
                      <strong>
                        Page:
                      </strong>{" "}
                      {
                        signature.page
                      }
                    </p>

                    <p>
                      <strong>
                        Created:
                      </strong>{" "}
                      {new Date(
                        signature.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      removeSignature(
                        signature.id
                      )
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Remove Signature
                  </button>
                </div>

                {signature.imageData && (
                  <img
                    src={
                      signature.imageData
                    }
                    alt="signature"
                    className="h-24 mt-4 border rounded"
                  />
                )}
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}