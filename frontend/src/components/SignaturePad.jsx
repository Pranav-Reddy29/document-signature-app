import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function SignaturePad({
  onSave,
}) {
  const sigRef = useRef();

  const clearSignature = () => {
    sigRef.current.clear();
  };

  const saveSignature = () => {
    const image =
      sigRef.current.toDataURL(
        "image/png"
      );

    onSave(image);
  };

  return (
    <div className="mb-6">
      <div className="border w-fit">
        <SignatureCanvas
          ref={sigRef}
          penColor="black"
          canvasProps={{
            width: 500,
            height: 200,
            className:
              "border bg-white",
          }}
        />
      </div>

      <div className="mt-3 flex gap-3">
        <button
          onClick={clearSignature}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Clear
        </button>

        <button
          onClick={saveSignature}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save Signature
        </button>
      </div>
    </div>
  );
}