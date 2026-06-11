import { useEffect, useState } from "react";
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

export default function PDFViewer() {
  const [numPages, setNumPages] =
    useState(null);

  const [signatures, setSignatures] =
    useState([]);

  const documentId =
    "6320872f-2ee8-41f2-b955-0659e96a53a5";

  useEffect(() => {
    fetchSignatures();
  }, []);

  async function fetchSignatures() {
    try {
      const res =
        await axios.get(
          `http://localhost:5000/api/signatures/${documentId}`
        );

      setSignatures(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  function onLoadSuccess({
    numPages,
  }) {
    setNumPages(numPages);
  }

  async function handleClick(e) {
    const rect =
      e.currentTarget.getBoundingClientRect();

    const x =
      e.clientX - rect.left;

    const y =
      e.clientY - rect.top;

    try {
      await axios.post(
        "http://localhost:5000/api/signatures",
        {
          documentId,
          x,
          y,
          page: 1,
        }
      );

      fetchSignatures();

      console.log(
        "Signature Saved"
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        PDF Viewer
      </h1>

      <div
        className="relative inline-block border"
        onClick={handleClick}
      >
        <Document
          file="http://localhost:5000/uploads/1780840363361.pdf"
          onLoadSuccess={
            onLoadSuccess
          }
        >
          {Array.from(
            new Array(numPages),
            (_, index) => (
              <Page
                key={index}
                pageNumber={
                  index + 1
                }
                width={900}
              />
            )
          )}
        </Document>

        {signatures.map(
          (signature) => (
            <div
              key={signature.id}
              className="absolute text-3xl"
              style={{
                left:
                  signature.x,
                top:
                  signature.y,
              }}
            >
              ✍️
            </div>
          )
        )}
      </div>
    </div>
  );
}