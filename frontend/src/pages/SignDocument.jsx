import {
  useParams,
} from "react-router-dom";

export default function SignDocument() {
  const {
    documentId,
    signerId,
  } = useParams();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Sign Document
      </h1>

      <div className="mt-6">
        <p>
          Document ID:
          {" "}
          {documentId}
        </p>

        <p>
          Signer ID:
          {" "}
          {signerId}
        </p>
      </div>
    </div>
  );
}