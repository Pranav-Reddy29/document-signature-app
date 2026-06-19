import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
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

  const [pdfUrl, setPdfUrl] =
    useState("");

  const [numPages, setNumPages] =
    useState(null);

  const [signatureImage, setSignatureImage] =
    useState(null);

  const [signedFields, setSignedFields] =
  useState({});

  const [pageSize, setPageSize] =
    useState({
      width: 0,
      height: 0,
    });

  const [fields, setFields] =
    useState([]);

  const [completedFields, setCompletedFields] =
    useState([]);

  const [signerCompleted, setSignerCompleted] =
    useState(false);

  useEffect(() => {
    loadDocument();
    loadFields();
    loadSigner();
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

  const loadFields =
    async () => {
      try {
        const res =
          await axios.get(
            `${import.meta.env.VITE_API_URL}/api/signature-fields/document/${documentId}/signer/${signerId}`
          );

        const signerFields =
          res.data.filter(
            (field) =>
              field.signerId ===
              signerId
          );

        setFields(
          signerFields
        );
      } catch (error) {
        console.log(error);
      }
    };

  const loadSigner =
    async () => {
      try {
        const res =
          await axios.get(
            `${import.meta.env.VITE_API_URL}/api/signers/public/${signerId}`
          );

        if (
          res.data.status ===
          "SIGNED"
        ) {
          setSignerCompleted(
            true
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

  const onDocumentLoad =
    ({ numPages }) => {
      setNumPages(numPages);
    };

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
            canvas.getContext(
              "2d"
            );

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
            const r =
              pixels[i];

            const g =
              pixels[i + 1];

            const b =
              pixels[i + 2];

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

  const signField =
    async (field) => {
      try {
        if (!signatureImage) {
          alert(
            "Please create/upload signature first."
          );
          return;
        }

        if (
          completedFields.includes(
            field.id
          )
        ) {
          return;
        }

        await axios.post(
  "${import.meta.env.VITE_API_URL}/api/signatures",
  {
    fieldId: field.id,

    documentId,
    signerId,

    page: field.page,

    imageData:
      signatureImage,

    x: field.x,
    y: field.y,

    width:
      field.width,

    height:
      field.height,

    pageWidth:
      pageSize.width,

    pageHeight:
      pageSize.height,
  }
);

        setCompletedFields(
          (prev) => [
            ...prev,
            field.id,
          ]
        );

        setSignedFields(
  (prev) => ({
    ...prev,
    [field.id]:
      signatureImage,
  })
);

        alert(
          "Field signed successfully"
        );
      } catch (error) {
        console.log(error);
      }
    };

  const completeSigning = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/signature-fields/document/${documentId}/signer/${signerId}`
    );

    const unsignedFields = res.data.filter(
      (field) => !field.isSigned
    );

    if (unsignedFields.length > 0) {
      alert(
        "Please sign all assigned fields first."
      );
      return;
    }

    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/signers/complete/${signerId}`
    );

    alert(
      "Document completed successfully"
    );

    setSignerCompleted(true);
  } catch (error) {
    console.log(error);

    if (
      error.response?.data?.message
    ) {
      alert(
        error.response.data.message
      );
    } else {
      alert(
        "Failed to complete signing"
      );
    }
  }
};

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">
        Sign Document
      </h1>

      {signerCompleted && (
        <div className="bg-green-100 border border-green-500 text-green-700 p-4 rounded mb-6">
          You have already completed signing this document.
        </div>
      )}

      {!signerCompleted && (
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Create Signature
          </h2>

          <SignaturePad
            onSave={
              setSignatureImage
            }
          />
          {signatureImage && (
  <div className="mt-2 text-green-600 font-bold">
    ✓ Signature Saved Successfully
  </div>
)}

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
          </div>
        </div>
      )}

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
                className="relative mb-10 bg-white border"
              >
                <Page
                  pageNumber={
                    index + 1
                  }
                  width={900}
                  onLoadSuccess={(
                    page
                  ) =>
                    setPageSize({
                      width:
                        page.width,
                      height:
                        page.height,
                    })
                  }
                />

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
                      <button
  key={field.id}
  disabled={signerCompleted}
  onClick={() => {
    console.log(
      "FIELD CLICKED"
    );

    console.log(field);
console.log(
  "signatureImage:",
  signatureImage
);

console.log(
  "pageSize:",
  pageSize
);
    signField(field);
  }}
  className={`absolute border-2 rounded flex items-center justify-center ${
    completedFields.includes(
      field.id
    )
      ? "bg-green-500 border-green-700"
      : "bg-yellow-300 border-yellow-600"
  }`}
  style={{
    left:
      field.x -
      field.width / 2,

    top:
      field.y -
      field.height / 2,

    width:
      field.width,

    height:
      field.height,

    zIndex: 9999,
    cursor: "pointer",
  }}
>
                        {completedFields.includes(
  field.id
) ? (
  <img
    src={
      signedFields[
        field.id
      ]
    }
    alt="signature"
    className="w-full h-full object-contain"
  />
) : (
  "Sign Here"
)}
                      </button>
                    )
                  )}
              </div>
            )
          )}
        </Document>
      )}

      {!signerCompleted && (
  <button
    onClick={completeSigning}
    className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
  >
    Complete Signing
  </button>
)}
    </div>
  );
}