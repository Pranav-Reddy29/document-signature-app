import {
  useEffect,
  useState,
} from "react";
import axios from "axios";

export default function Documents() {
  const [documents, setDocuments] =
    useState([]);
  async function fetchDocuments() {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/documents`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDocuments(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const loadDocuments = async () => {
      await fetchDocuments();
    };
    loadDocuments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">
        My Documents
      </h1>

      <div className="grid md:grid-cols-2 gap-4">
        {documents.map(
          (doc) => (
            <div
              key={doc.id}
              className="bg-white p-4 rounded-lg shadow"
            >
              <h2 className="font-semibold text-lg">
                {doc.title}
              </h2>

              <p className="text-gray-500 text-sm mt-2">
                Uploaded:
                {" "}
                {new Date(
                  doc.createdAt
                ).toLocaleDateString()}
              </p>

              <a
                href={`${import.meta.env.VITE_API_URL}/uploads/${doc.fileUrl}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-3 text-blue-600"
              >
                View PDF
              </a>
            </div>
          )
        )}
      </div>
    </div>
  );
}