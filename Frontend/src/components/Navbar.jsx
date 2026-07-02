import { C } from "../constants/colors";

export default function Navbar({ user }) {
  return (
    <header
      style={{
        height: "80px",
        background: "#fff",
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
        boxSizing: "border-box",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            color: C.text,
            fontWeight: 700,
          }}
        >
          FraudShield Dashboard
        </h2>

        <p
          style={{
            margin: "5px 0 0",
            color: C.textMuted,
            fontSize: "14px",
          }}
        >
          AI Powered Fraud Detection System
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <div
          style={{
            textAlign: "right",
          }}
        >
          <h4
            style={{
              margin: 0,
              color: C.text,
            }}
          >
            {user?.full_name || "Guest"}
          </h4>

          <small
            style={{
              color: C.textMuted,
            }}
          >
            {user?.email}
          </small>
        </div>

        <div
          style={{
            width: "45px",
            height: "45px",
            borderRadius: "50%",
            background: C.accent,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          {user?.full_name
            ? user.full_name.charAt(0).toUpperCase()
            : "G"}
        </div>
      </div>
    </header>
  );
}