import {
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import axios from "axios";

import SignaturePad from "../components/SignaturePad";

export default function SignDocument() {
  const {
    documentId,
    signerId,
  } = useParams();

  const [
    signatureImage,
    setSignatureImage,
  ] = useState(null);

  const saveSignature =
    async () => {
      try {
        if (!signatureImage) {
          alert(
            "Please save your signature first"
          );
          return;
        }

        await axios.post(
          "http://localhost:5000/api/signatures",
          {
            documentId,

            imageData:
              signatureImage,

            page: 1,
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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">
        Sign Document
      </h1>

      <div className="mb-6">
        <p>
          <strong>
            Document ID:
          </strong>{" "}
          {documentId}
        </p>

        <p>
          <strong>
            Signer ID:
          </strong>{" "}
          {signerId}
        </p>
      </div>

      <SignaturePad
        onSave={
          setSignatureImage
        }
      />

      <button
        onClick={
          saveSignature
        }
        className="bg-blue-500 text-white px-6 py-3 rounded"
      >
        Complete Signing
      </button>
    </div>
  );
}