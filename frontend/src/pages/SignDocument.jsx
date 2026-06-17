import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import SignaturePad from "../components/SignaturePad";

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

export default function SignDocument() {
  const { documentId, signerId } =
    useParams();

  const [signatureImage, setSignatureImage] =
    useState(null);

  const [numPages, setNumPages] =
    useState(null);

  const [position, setPosition] =
    useState(null);

  function onLoadSuccess({
    numPages,
  }) {
    setNumPages(numPages);
  }

  const makeTransparent = (
    imageSrc
  ) => {
    return new Promise(
      (resolve) => {
        const img = new Image();

        img.onload = () => {
          const canvas =
            document.createElement(
              "canvas"
            );

          canvas.width =
            img.width;

          canvas.height =
            img.height;

          const ctx =
            canvas.getContext("2d");

          ctx.drawImage(
            img,
            0,
            0
          );

          const imageData =
            ctx.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );

          const pixels =
            imageData.data;

          for (
            let i = 0;
            i < pixels.length;
            i += 4
          ) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            if (
              r > 240 &&
              g > 240 &&
              b > 240
            ) {
              pixels[i + 3] = 0;
            }
          }

          ctx.putImageData(
            imageData,
            0,
            0
          );

          resolve(
            canvas.toDataURL(
              "image/png"
            )
          );
        };

        img.src = imageSrc;
      }
    );
  };

  const handleSignatureUpload =
    (e) => {
      const file =
        e.target.files?.[0];

      if (!file) return;

      const reader =
        new FileReader();

      reader.onload =
        async () => {
          const transparentImage =
            await makeTransparent(
              reader.result
            );

          setSignatureImage(
            transparentImage
          );
        };

      reader.readAsDataURL(
        file
      );
    };

  const handlePDFClick = (
    e
  ) => {
    if (!signatureImage) {
      alert(
        "Please create or upload a signature first."
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

    setPosition({
      xPercent,
      yPercent,
    });
  };

  const completeSigning =
    async () => {
      try {
        if (!signatureImage) {
          alert(
            "Please provide a signature."
          );
          return;
        }

        if (!position) {
          alert(
            "Please select a location on the PDF."
          );
          return;
        }

        await axios.post(
          "http://localhost:5000/api/signatures",
          {
            documentId,
            signerId,
            xPercent:
              position.xPercent,
            yPercent:
              position.yPercent,
            page: 1,
            imageData:
              signatureImage,
          }
        );

        await axios.put(
          `http://localhost:5000/api/signers/complete/${signerId}`
        );

        alert(
          "Document signed successfully"
        );
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">
        Sign Document
      </h1>

      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-bold mb-4">
          Create Signature
        </h2>

        <SignaturePad
          onSave={
            setSignatureImage
          }
        />

        <div className="mt-6">
          <p className="font-semibold mb-2">
            Or Upload Signature Image
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={
              handleSignatureUpload
            }
          />

          {signatureImage && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">
                Signature Preview
              </p>

              <img
                src={
                  signatureImage
                }
                alt="preview"
                className="h-24 border rounded bg-gray-100 p-2"
              />
            </div>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">
        Click on PDF to place signature
      </h2>

      <div
        className="relative inline-block border bg-white"
        onClick={
          handlePDFClick
        }
      >
        <Document
          file="http://localhost:5000/uploads/1780840363361.pdf"
          onLoadSuccess={
            onLoadSuccess
          }
        >
          {Array.from(
            new Array(
              numPages
            ),
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

        {signatureImage &&
          position && (
            <img
              src={
                signatureImage
              }
              alt="signature"
              className="absolute w-32"
              style={{
                left: `${position.xPercent}%`,
                top: `${position.yPercent}%`,
                transform:
                  "translate(-50%, -50%)",
              }}
            />
          )}
      </div>

      <button
        onClick={
          completeSigning
        }
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
      >
        Complete Signing
      </button>
    </div>
  );
}
