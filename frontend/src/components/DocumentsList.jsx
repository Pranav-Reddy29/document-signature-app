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
      const confirmDelete =
        window.confirm(
          "Delete this document?"
        );

      if (!confirmDelete)
        return;

      try {
        const token =
          localStorage.getItem(
            "token"
          );

        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/documents/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
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
        "Link copied to clipboard"
      );
    };

  const downloadSignedDocument =
    async (documentId) => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await axios.get(
            `${import.meta.env.VITE_API_URL}/api/documents/signed/download/${documentId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
              responseType:
                "blob",
            }
          );

        const url =
          window.URL.createObjectURL(
            new Blob([
              response.data,
            ])
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = url;

        link.setAttribute(
          "download",
          "signed-document.pdf"
        );

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

        window.URL.revokeObjectURL(
          url
        );
      } catch (error) {
        console.log(error);

        alert(
          "Failed to download document"
        );
      }
    };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-3xl font-bold mb-6">
        My Documents
      </h2>

      {documents.length ===
      0 ? (
        <p>
          No documents uploaded
        </p>
      ) : (
        documents.map(
          (doc) => (
            <div
              key={doc.id}
              className="border rounded-xl p-5 mb-4 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">
                    📄 {doc.title}
                  </h3>

                  <p className="mt-2">
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

                  <p className="text-gray-500 text-sm mt-1">
                    {new Date(
                      doc.createdAt
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-5">

                <a
                  href={`${import.meta.env.VITE_API_URL}/uploads/${doc.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  View PDF
                </a>

                <button
                  onClick={() =>
                    navigate(
                      `/prepare/${doc.id}`
                    )
                  }
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
                >
                  Prepare Document
                </button>

                <button
                  onClick={() =>
                    navigate(
                      `/manage-signers/${doc.id}`
                    )
                  }
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                >
                  Signers
                </button>

                <button
                  onClick={() =>
                    copySigningLink(
                      doc.id
                    )
                  }
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                >
                  Copy Link
                </button>

                {doc.signedFileUrl && (
                  <>
                    <a
                      href={`${import.meta.env.VITE_API_URL}/signed/${doc.signedFileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                      View Signed
                    </a>

                    <button
                      onClick={() =>
                        downloadSignedDocument(
                          doc.id
                        )
                      }
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                    >
                      Download Signed
                    </button>
                  </>
                )}

                <button
                  onClick={() =>
                    deleteDocument(
                      doc.id
                    )
                  }
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>

              </div>
            </div>
          )
        )
      )}
    </div>
  );
}