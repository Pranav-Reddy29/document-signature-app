import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import UploadDocument from "../components/UploadDocument";
import DocumentsList from "../components/DocumentsList";

export default function Dashboard() {
  const navigate = useNavigate();

  const [documents, setDocuments] =
    useState([]);

  const fetchDocuments =
    useCallback(async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await axios.get(
            "http://localhost:5000/api/documents",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setDocuments(
          res.data
        );
      } catch (error) {
        console.log(error);
      }
    }, []);

  useEffect(() => {
    const loadDocuments = async () => {
      await fetchDocuments();
    };
    loadDocuments();
  }, [fetchDocuments]);

  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    navigate("/login");
  };

  const totalDocuments =
    documents.length;

  const pendingDocuments =
    documents.filter(
      (doc) =>
        doc.status ===
        "PENDING"
    ).length;

  const completedDocuments =
    documents.filter(
      (doc) =>
        doc.status ===
        "SIGNED"
    ).length;

  const totalSigners =
    documents.reduce(
      (count, doc) =>
        count +
        (doc.signers?.length || 0),
      0
    );

  return (
    <div className="min-h-screen bg-slate-100">

      <div className="bg-white shadow p-4 flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold">
            DocuSign Clone
          </h1>

          <p className="text-sm text-gray-500">
            Secure Digital Signatures
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>

      </div>

      <div className="max-w-7xl mx-auto p-8">

        <h2 className="text-3xl font-bold mb-6">
          Welcome Back 👋
        </h2>

        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">
              Documents
            </h3>

            <p className="text-4xl font-bold">
              {totalDocuments}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">
              Pending
            </h3>

            <p className="text-4xl font-bold text-yellow-500">
              {pendingDocuments}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">
              Completed
            </h3>

            <p className="text-4xl font-bold text-green-600">
              {completedDocuments}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">
              Signers
            </h3>

            <p className="text-4xl font-bold text-blue-600">
              {totalSigners}
            </p>
          </div>

        </div>

        <UploadDocument
          onUploadSuccess={
            fetchDocuments
          }
        />

        <DocumentsList
          documents={documents}
          refreshDocuments={
            fetchDocuments
          }
        />

      </div>

    </div>
  );
}