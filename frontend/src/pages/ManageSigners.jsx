import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ManageSigners() {
  const { documentId } = useParams();

  const [email, setEmail] = useState("");
  const [signers, setSigners] = useState([]);

  const token = localStorage.getItem("token");

  const getSigners = useCallback(async () => {
    const { data } = await axios.get(
      `http://localhost:5000/api/signers/${documentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  }, [documentId, token]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await getSigners();
        if (mounted) setSigners(data);
      } catch (error) {
        console.log(error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [getSigners]);

  const addSigner = async () => {
    if (!email) {
      alert("Please enter signer email");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/signers",
        {
          email,
          documentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEmail("");

      const data = await getSigners();
      setSigners(data);

      alert("Signer added successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to add signer");
    }
  };

  const copySigningLink = (signerId) => {
    const link =
      `${window.location.origin}/sign/${documentId}/${signerId}`;

    navigator.clipboard.writeText(link);

    alert("Signing link copied!");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow">
          <h1 className="text-3xl font-bold mb-6">
            Manage Signers
          </h1>

          <div className="flex gap-4 mb-6">
            <input
              type="email"
              placeholder="Signer Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="flex-1 border rounded-lg p-3"
            />

            <button
              onClick={addSigner}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg"
            >
              Add Signer
            </button>
          </div>

          <div className="space-y-4">
            {signers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No signers added yet
              </div>
            ) : (
              signers.map((signer) => (
                <div
                  key={signer.id}
                  className="border rounded-xl p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-lg">
                      {signer.email}
                    </h3>

                    <p
                      className={`font-medium ${
                        signer.status === "SIGNED"
                          ? "text-green-600"
                          : "text-yellow-500"
                      }`}
                    >
                      {signer.status}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`/sign/${documentId}/${signer.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                    >
                      Open
                    </a>

                    <button
                      onClick={() =>
                        copySigningLink(
                          signer.id
                        )
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}