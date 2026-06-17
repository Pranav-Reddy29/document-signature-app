import { useState } from "react";
import axios from "axios";

export default function UploadDocument({
  onUploadSuccess,
}) {
  const [file, setFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const uploadDocument =
    async () => {
      if (!file) {
        alert(
          "Please select a PDF"
        );
        return;
      }

      try {
        setLoading(true);

        const formData =
          new FormData();

        formData.append(
          "pdf",
          file
        );

        const token =
          localStorage.getItem(
            "token"
          );

        await axios.post(
          "http://localhost:5000/api/documents/upload",
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        alert(
          "Document uploaded successfully"
        );

        setFile(null);

        onUploadSuccess();
      } catch (error) {
        console.log(error);

        alert(
          "Upload failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-8">

      <h2 className="text-2xl font-bold mb-4">
        Upload PDF
      </h2>

      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">

        <label className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg cursor-pointer transition">

          Select PDF

          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) =>
              setFile(
                e.target.files[0]
              )
            }
          />

        </label>

        <div className="mt-4">

          {file ? (
            <div>

              <p className="font-medium text-gray-800">
                📄 {file.name}
              </p>

              <p className="text-sm text-gray-500">
                {(
                  file.size /
                  1024 /
                  1024
                ).toFixed(2)}{" "}
                MB
              </p>

            </div>
          ) : (
            <p className="text-gray-500">
              No PDF selected
            </p>
          )}

        </div>

      </div>

      <button
        onClick={uploadDocument}
        disabled={loading}
        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
      >
        {loading
          ? "Uploading..."
          : "Upload Document"}
      </button>

    </div>
  );
}