import React from "react";
import { C } from "../constants/colors";

export default function Input({
  label,
  hint,
  error,
  style = {},
  ...props
}) {
  return (
    <div style={{ marginBottom: "18px" }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: C.textMuted,
            marginBottom: "6px",
          }}
        >
          {label}
        </label>
      )}

      <input
        {...props}
        style={{
          width: "100%",
          padding: "10px 13px",
          fontSize: "14px",
          fontFamily: "inherit",
          background: "#f8fafc",
          border: `1.5px solid ${error ? C.danger : C.border}`,
          borderRadius: "8px",
          outline: "none",
          color: C.text,
          boxSizing: "border-box",
          ...style,
        }}
      />

      {hint && !error && (
        <p
          style={{
            marginTop: "5px",
            marginBottom: 0,
            fontSize: "11px",
            color: C.textMuted,
          }}
        >
          {hint}
        </p>
      )}

      {error && (
        <p
          style={{
            marginTop: "5px",
            marginBottom: 0,
            fontSize: "11px",
            color: C.danger,
            fontWeight: 600,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}