import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DocumentsList({
  documents,
  refreshDocuments,
}) {
  const navigate =
    useNavigate();

  const deleteDocument =
    async (id) => {
      const confirmed =
        window.confirm(
          "Delete document?"
        );

      if (!confirmed) return;

      try {
        const token =
          localStorage.getItem(
            "token"
          );

        await axios.delete(
          `http://localhost:5000/api/documents/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        refreshDocuments();
      } catch (error) {
        console.log(error);
      }
    };

  const copySigningLink =
    (documentId) => {
      const link =
        `${window.location.origin}/manage-signers/${documentId}`;

      navigator.clipboard.writeText(
        link
      );

      alert(
        "Manage Signers link copied!"
      );
    };

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-3xl font-bold mb-6">
        My Documents
      </h2>

      {documents.length ===
      0 ? (
        <div className="text-center py-10">

          <h3 className="text-xl font-semibold">
            📄 No Documents Yet
          </h3>

          <p className="text-gray-500 mt-2">
            Upload your first PDF
            to start collecting
            signatures.
          </p>

        </div>
      ) : (
        documents.map((doc) => (
          <div
            key={doc.id}
            className="border rounded-xl p-5 mb-4 hover:shadow-md transition"
          >
            <h3 className="text-xl font-bold mb-2">
              📄 {doc.title}
            </h3>

            <p className="mb-2">
              Status:

              <span
                className={`ml-2 font-semibold ${
                  doc.status ===
                  "SIGNED"
                    ? "text-green-600"
                    : "text-yellow-500"
                }`}
              >
                {doc.status}
              </span>
            </p>

            <p className="text-gray-500 mb-4">
              {new Date(
                doc.createdAt
              ).toLocaleString()}
            </p>

            <div className="flex flex-wrap gap-3">

              <a
                href={`http://localhost:5000/uploads/${doc.fileUrl}`}
                target="_blank"
                rel="noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                View
              </a>

              <button
                onClick={() =>
                  navigate(
                    `/manage-signers/${doc.id}`
                  )
                }
                className="bg-purple-600 text-white px-4 py-2 rounded-lg"
              >
                Signers
              </button>

              <button
                onClick={() =>
                  copySigningLink(
                    doc.id
                  )
                }
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Copy Link
              </button>

              <button
                onClick={() =>
                  deleteDocument(
                    doc.id
                  )
                }
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>

            </div>

          </div>
        ))
      )}

    </div>
  );
}