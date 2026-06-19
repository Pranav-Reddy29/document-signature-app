import {
  useEffect,
  useState,
} from "react";
import axios from "axios";

export default function AuditLogs({
  documentId,
}) {
  const [logs, setLogs] =
    useState([]);

  useEffect(() => {
    const fetchLogs =
      async () => {
        const token =
          localStorage.getItem(
            "token"
          );

        const { data } =
          await axios.get(
            `${import.meta.env.VITE_API_URL}/api/documents/audit/${documentId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setLogs(data);
      };

    fetchLogs();
  }, [documentId]);

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-6">
      <h3 className="text-xl font-bold mb-4">
        Audit Trail
      </h3>

      {logs.map((log) => (
        <div
          key={log.id}
          className="border-b py-2"
        >
          <p>
            <strong>
              {log.action}
            </strong>
          </p>

          <p>
            {log.userEmail}
          </p>

          <p className="text-sm text-gray-500">
            {new Date(
              log.createdAt
            ).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}