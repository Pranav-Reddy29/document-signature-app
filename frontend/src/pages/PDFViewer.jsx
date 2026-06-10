import { useState } from "react";
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

  const [signaturePos, setSignaturePos] =
    useState(null);

  function onLoadSuccess({
    numPages,
  }) {
    setNumPages(numPages);
  }

  const handleClick =
    async (e) => {
      const rect =
        e.currentTarget.getBoundingClientRect();

      const x =
        e.clientX - rect.left;

      const y =
        e.clientY - rect.top;

      setSignaturePos({
        x,
        y,
      });

      try {
        await axios.post(
          "http://localhost:5000/api/signatures",
          {
            documentId:
              "6320872f-2ee8-41f2-b955-0659e96a53a5",
            x,
            y,
            page: 1,
          }
        );

        console.log(
          "Signature Saved"
        );
      } catch (error) {
        console.log(
          "Signature Save Error:",
          error
        );
      }
    };

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

        {signaturePos && (
          <div
            className="absolute text-3xl"
            style={{
              left:
                signaturePos.x,
              top:
                signaturePos.y,
            }}
          >
            ✍️
          </div>
        )}
      </div>
    </div>
  );
}