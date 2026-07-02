import { C } from "../constants/colors";

const menu = [

  {
    key: "dashboard",
    title: "Dashboard",
    icon: "📊",
  },

  {
    key: "transfer",
    title: "Transfer Money",
    icon: "💸",
  },

  {
    key: "transactions",
    title: "Transactions",
    icon: "💰",
  },

  {
    key: "alerts",
    title: "My Alerts",
    icon: "🚨",
  },

  {
    key: "account",
    title: "My Account",
    icon: "🏦",
  },

  {
    key: "profile",
    title: "Profile",
    icon: "👤",
  },

];

const adminMenu = [

  {
    key: "admin-alerts",
    title: "Fraud Alerts",
    icon: "⚠️",
  },

  {
    key: "admin-users",
    title: "Manage Users",
    icon: "👥",
  },

  {
    key: "admin-auditlogs",
    title: "Audit Logs",
    icon: "📜",
  },

];

export default function Sidebar({
  user,
  active,
  setActive,
  onLogout,
}) {
  return (
    <aside
      style={{
        width: "260px",
        minHeight: "100vh",
        background: C.navy,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div
          style={{
            padding: "28px 24px",
            borderBottom: "1px solid rgba(255,255,255,.08)",
          }}
        >
          <h2 style={{ margin: 0 }}>🛡 FraudShield</h2>
          <small style={{ color: "rgba(255,255,255,.5)" }}>
            AI Platform
          </small>
        </div>

        <div style={{ padding: 20 }}>
          {menu.map((item) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 14,
                marginBottom: 10,
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
                background:
                  active === item.key
                    ? C.accent
                    : "transparent",
                color: "#fff",
                fontSize: 15,
                textAlign: "left",
              }}
            >
              <span>{item.icon}</span>
              {item.title}
            </button>
          ))}

          {user?.role === "ADMIN" && (
            <>
              <p
                style={{
                  marginTop: 30,
                  color: "rgba(255,255,255,.5)",
                }}
              >
                ADMIN
              </p>

              {adminMenu.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActive(item.key)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 14,
                    marginBottom: 10,
                    border: "none",
                    borderRadius: 10,
                    cursor: "pointer",
                    background:
                      active === item.key
                        ? C.accent
                        : "transparent",
                    color: "#fff",
                    textAlign: "left",
                    fontSize: 15,
                  }}
                >
                  <span>{item.icon}</span>
                  {item.title}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            padding: 12,
            border: "none",
            borderRadius: 10,
            background: "#dc2626",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}