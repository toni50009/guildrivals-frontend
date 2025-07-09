import React, { useEffect, useRef } from "react";

export default function LogBatalha({ logs }) {
  const logEndRef = useRef(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <div className="d-flex w-100 justify-content-center">
      <div
        className="bg-dark text-light p-3 rounded shadow text-center"
        style={{ maxHeight: "100px", overflowY: "auto" }}
      >
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
