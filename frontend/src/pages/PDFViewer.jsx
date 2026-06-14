import { useEffect, useState } from "react";
import axios from "axios";

import {
  pdfjs,
  Document,
  Page,
} from "react-pdf";

import SignaturePad from "../components/SignaturePad";
import SignerManager from "../components/SignerManager";
import SignerList from "../components/SignerList";

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

  const [signatureImage, setSignatureImage] =
    useState(null);

  const documentId =
    "6320872f-2ee8-41f2-b955-0659e96a53a5";

  useEffect(() => {
    fetchSignatures();

    const savedImage =
      localStorage.getItem(
        "signatureImage"
      );

    if (savedImage) {
      setSignatureImage(savedImage);
    }
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
    if (!signatureImage) {
      alert(
        "Please save a signature first"
      );
      return;
    }

    const rect =
      e.currentTarget.getBoundingClientRect();

    const xPercent =
      ((e.clientX - rect.left) /
        rect.width) *
      100;

    const yPercent =
      ((e.clientY - rect.top) /
        rect.height) *
      100;

    try {
      await axios.post(
        "http://localhost:5000/api/signatures",
        {
          documentId,
          xPercent,
          yPercent,
          page: 1,
          imageData: signatureImage,
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

  const saveSignature =
    (imageData) => {
      localStorage.setItem(
        "signatureImage",
        imageData
      );

      setSignatureImage(
        imageData
      );

      console.log(
        "Signature Image Saved"
      );
    };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        PDF Viewer
      </h1>

      {/* Add Signers */}
      <SignerManager
        documentId={documentId}
      />

      {/* List Signers */}
      <SignerList
        documentId={documentId}
      />

      {/* Signature Pad */}
      <SignaturePad
        onSave={saveSignature}
      />

      {/* PDF */}
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
            <img
              key={signature.id}
              src={
                signature.imageData
              }
              alt="signature"
              className="absolute w-32"
              style={{
                left: `${signature.xPercent}%`,
                top: `${signature.yPercent}%`,
                transform:
                  "translate(-50%, -50%)",
              }}
            />
          )
        )}
      </div>
    </div>
  );
}