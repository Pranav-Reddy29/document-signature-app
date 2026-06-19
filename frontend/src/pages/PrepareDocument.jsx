import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import {
  pdfjs,
  Document,
  Page,
} from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

export default function PrepareDocument() {
  const { documentId } = useParams();

  const [pdfUrl, setPdfUrl] =
    useState("");

  const [signers, setSigners] =
    useState([]);

  const [selectedSigner, setSelectedSigner] =
    useState("");

  const [fields, setFields] =
    useState([]);

  const [numPages, setNumPages] =
    useState(null);

  const token =
    localStorage.getItem("token");

  useEffect(() => {
    loadDocument();
    loadSigners();
    loadFields();
  }, []);

  const loadDocument =
    async () => {
      try {
        const res =
          await axios.get(
            `${import.meta.env.VITE_API_URL}/api/documents/public/${documentId}`
          );

        setPdfUrl(
          `${import.meta.env.VITE_API_URL}/uploads/${res.data.fileUrl}`
        );
      } catch (error) {
        console.log(error);
      }
    };

  const loadSigners =
    async () => {
      try {
        const res =
          await axios.get(
            `${import.meta.env.VITE_API_URL}/api/signers/${documentId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setSigners(
          res.data
        );
      } catch (error) {
        console.log(error);
      }
    };

  const loadFields =
    async () => {
      try {
        const res =
          await axios.get(
            `${import.meta.env.VITE_API_URL}/api/signature-fields/document/${documentId}`
          );

        setFields(
          res.data
        );
      } catch (error) {
        console.log(error);
      }
    };

  const onDocumentLoad =
    ({ numPages }) => {
      setNumPages(numPages);
    };

  const createField =
    async (
      e,
      pageNumber
    ) => {
      if (!selectedSigner) {
        alert(
          "Select signer first"
        );
        return;
      }

      const canvas =
        e.currentTarget.querySelector(
          "canvas"
        );

      if (!canvas) return;

      const rect =
        canvas.getBoundingClientRect();

      const x =
        e.clientX - rect.left;

      const y =
        e.clientY - rect.top;

      try {
        await axios.post(
          "${import.meta.env.VITE_API_URL}/api/signature-fields",
          {
            documentId,

            signerId:
              selectedSigner,

            page:
              pageNumber,

            x,

            y,

            width: 180,

            height: 80,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        await loadFields();

        alert(
          "Field created"
        );
      } catch (error) {
        console.log(error);

        alert(
          "Failed to create field"
        );
      }
    };

  const deleteField =
    async (fieldId) => {
      const confirmDelete =
        window.confirm(
          "Delete field?"
        );

      if (!confirmDelete)
        return;

      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/signature-fields/${fieldId}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        await loadFields();
      } catch (error) {
        console.log(error);

        alert(
          "Failed to delete field"
        );
      }
    };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-7xl mx-auto">

        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h1 className="text-3xl font-bold mb-4">
            Prepare Document
          </h1>

          <p className="text-gray-500 mb-4">
            Select a signer and click
            anywhere on the PDF to
            place a signature field.
          </p>

          <select
            value={
              selectedSigner
            }
            onChange={(e) =>
              setSelectedSigner(
                e.target.value
              )
            }
            className="border rounded-lg p-3 w-full"
          >
            <option value="">
              Select Signer
            </option>

            {signers.map(
              (signer) => (
                <option
                  key={
                    signer.id
                  }
                  value={
                    signer.id
                  }
                >
                  {signer.email}
                </option>
              )
            )}
          </select>
        </div>

        {pdfUrl && (
          <Document
            file={pdfUrl}
            onLoadSuccess={
              onDocumentLoad
            }
          >
            {Array.from(
              new Array(
                numPages || 0
              ),
              (_, index) => (
                <div
                  key={index}
                  className="relative mb-10 border bg-white shadow"
                  onClick={(e) =>
                    createField(
                      e,
                      index + 1
                    )
                  }
                >
                  <Page
                    pageNumber={
                      index + 1
                    }
                    width={900}
                  />

                  <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 rounded">
                    Page {index + 1}
                  </div>

                  {fields
                    .filter(
                      (field) =>
                        field.page ===
                        index + 1
                    )
                    .map(
                      (
                        field
                      ) => (
                        <div
                          key={
                            field.id
                          }
                          className="absolute border-2 border-red-500 bg-red-100/50"
                          style={{
                            left:
                              field.x -
                              field.width /
                                2,

                            top:
                              field.y -
                              field.height /
                                2,

                            width:
                              field.width,

                            height:
                              field.height,
                          }}
                        >
                          <div className="absolute -top-6 left-0 bg-red-600 text-white text-xs px-2 rounded">
                            {
                              field
                                .signer
                                ?.email
                            }
                          </div>

                          <button
                            onClick={(
                              e
                            ) => {
                              e.stopPropagation();

                              deleteField(
                                field.id
                              );
                            }}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6"
                          >
                            ×
                          </button>
                        </div>
                      )
                    )}
                </div>
              )
            )}
          </Document>
        )}

        <div className="bg-white p-6 rounded-xl shadow mt-6">
          <h2 className="text-xl font-bold mb-4">
            Signature Fields
          </h2>

          {fields.length ===
          0 ? (
            <p>
              No fields created
            </p>
          ) : (
            <div className="space-y-3">
              {fields.map(
                (field) => (
                  <div
                    key={
                      field.id
                    }
                    className="border rounded-lg p-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">
                        {
                          field
                            .signer
                            ?.email
                        }
                      </p>

                      <p className="text-sm text-gray-500">
                        Page{" "}
                        {
                          field.page
                        }
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        deleteField(
                          field.id
                        )
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}