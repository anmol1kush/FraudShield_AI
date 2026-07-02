import React from "react";
import { C } from "../constants/colors";

export default function Toast({ toasts, remove }) {
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            minWidth: "300px",
            maxWidth: "400px",
            padding: "14px 18px",
            borderRadius: "10px",
            background:
              toast.type === "success"
                ? C.success
                : toast.type === "error"
                ? C.danger
                : toast.type === "warning"
                ? C.warning
                : C.info,
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: C.shadow,
            animation: "slideIn 0.3s ease",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {toast.message}
          </span>

          <button
            onClick={() => remove(toast.id)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              fontSize: "18px",
              marginLeft: "15px",
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}