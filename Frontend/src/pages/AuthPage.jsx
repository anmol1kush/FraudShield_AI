import { useState } from "react";

import Card from "../components/card";
import Input from "../components/Input";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import Toast from "../components/Toast";

import { useToast } from "../hooks/UseToast";
import { api } from "../api/api";
import { C } from "../constants/colors";

export default function AuthPage({ onLogin }) {

  const [view, setView] = useState("login");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    role: "USER",
  });

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const { toasts, add, remove } = useToast();

  function set(key) {
    return (e) => {
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));
    };
  }

  function validate() {

    const err = {};

    if (view === "signup") {

      if (form.full_name.trim().length < 2)
        err.full_name = "At least 2 characters";

      if (
        !/^(\+91)?[6-9]\d{9}$/.test(
          form.phone_number.replace(/[\s\-()]/g, "")
        )
      ) {
        err.phone_number = "Valid 10-digit Indian number";
      }
    }

    if (!form.email.includes("@")) {
      err.email = "Enter a valid email";
    }

    if (form.password.length < 8) {
      err.password = "Minimum 8 characters";
    }

    return err;
  }

  async function handleSubmit(e) {

    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {

      if (view === "login") {

        const data = await api("/auth/login", {
          method: "POST",
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        });

        localStorage.setItem(
          "token",
          data.access_token
        );

        onLogin(data.access_token);

      } else {

        await api("/auth/signup", {
          method: "POST",
          body: JSON.stringify(form),
        });

        add(
          "Account created successfully!",
          "success"
        );

        setTimeout(() => {
          setView("login");
        }, 1500);

      }

    } catch (error) {

      add(error.message, "error");

    } finally {

      setLoading(false);

    }
  }

  return (
    <>
      <Toast
        toasts={toasts}
        remove={remove}
      ></Toast>
            <div
        style={{
          minHeight: "100vh",
          display: "flex",
          fontFamily: "'Inter', sans-serif",
          background: C.bg,
        }}
      >

        {/* Left Panel */}

        <div
          style={{
            width: "42%",
            background: C.navy,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "48px",
            position: "relative",
            overflow: "hidden",
          }}
        >

          <div
            style={{
              position: "absolute",
              bottom: "-100px",
              right: "-100px",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              border: "1px solid rgba(245,158,11,0.12)",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "-60px",
              left: "-60px",
              width: "260px",
              height: "260px",
              borderRadius: "50%",
              border: "1px solid rgba(245,158,11,0.07)",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                background: C.accent,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}
            >
              🛡
            </div>

            <span
              style={{
                color: "#fff",
                fontSize: "17px",
                fontWeight: 800,
              }}
            >
              FraudGuard
            </span>
          </div>

          <div>

            <p
              style={{
                color: C.accent,
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "14px",
              }}
            >
              Banking Security Platform
            </p>

            <h1
              style={{
                color: "#fff",
                fontSize: "36px",
                fontWeight: 800,
                lineHeight: 1.18,
                margin: "0 0 18px",
              }}
            >
              Real-time fraud
              <br />
              detection for
              <br />
              your bank.
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "14px",
                lineHeight: 1.7,
              }}
            >
              Every transaction monitored.
              Alerts raised instantly.
              Admins act fast.
            </p>

          </div>

          <div
            style={{
              display: "flex",
              gap: "32px",
            }}
          >

            {[
              ["🔍", "Live alerts"],
              ["🔒", "Audit trail"],
              ["⚡", "Instant block"],
            ].map(([icon, label]) => (

              <div key={label}>

                <p
                  style={{
                    margin: "0 0 2px",
                    fontSize: "18px",
                  }}
                >
                  {icon}
                </p>

                <p
                  style={{
                    margin: 0,
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.35)",
                    fontWeight: 600,
                  }}
                >
                  {label}
                </p>

              </div>

            ))}

          </div>

        </div>

        {/* Right Panel */}

        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px 24px",
          }}
        >

          <div
            style={{
              width: "100%",
              maxWidth: "400px",
            }}
          >

            {/* Tabs */}

            <div
              style={{
                display: "flex",
                background: "#fff",
                border: `1.5px solid ${C.border}`,
                borderRadius: "10px",
                padding: "4px",
                marginBottom: "28px",
              }}
            >

              {["login", "signup"].map((tab) => (

                <button
                  key={tab}
                  onClick={() => {
                    setView(tab);
                    setErrors({});
                  }}
                  style={{
                    flex: 1,
                    padding: "9px",
                    border: "none",
                    borderRadius: "7px",
                    cursor: "pointer",
                    background:
                      view === tab
                        ? C.navy
                        : "transparent",
                    color:
                      view === tab
                        ? "#fff"
                        : C.textMuted,
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  {tab === "login"
                    ? "Sign In"
                    : "Create Account"}
                </button>

              ))}

            </div>

            <div style={{ marginBottom: "24px" }}>

              <h2
                style={{
                  margin: "0 0 5px",
                  fontSize: "22px",
                  fontWeight: 800,
                  color: C.text,
                }}
              >
                {view === "login"
                  ? "Welcome back"
                  : "Open your account"}
              </h2>

              <p
                style={{
                  margin: 0,
                  color: C.textMuted,
                  fontSize: "13px",
                }}
              >
                {view === "login"
                  ? "Sign in to access your dashboard."
                  : "Takes less than a minute. No paperwork."}
              </p>

            </div>

            <Card
              style={{
                padding: "28px 26px",
              }}
            >

              <form
                onSubmit={handleSubmit}
                noValidate
              >                {view === "signup" && (
                  <>
                    <Input
                      label="Full name"
                      type="text"
                      placeholder="Abhik Sharma"
                      value={form.full_name}
                      onChange={set("full_name")}
                      error={errors.full_name}
                      autoComplete="name"
                    />

                    <Input
                      label="Mobile number"
                      type="tel"
                      placeholder="9876543210"
                      value={form.phone_number}
                      onChange={set("phone_number")}
                      error={errors.phone_number}
                      hint="10-digit Indian number"
                    />
                  </>
                )}

                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set("email")}
                  error={errors.email}
                  autoComplete="email"
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder={
                    view === "signup"
                      ? "Min. 8 characters"
                      : "Your password"
                  }
                  value={form.password}
                  onChange={set("password")}
                  error={errors.password}
                  autoComplete={
                    view === "login"
                      ? "current-password"
                      : "new-password"
                  }
                />

                {view === "signup" && (
                  <div style={{ marginBottom: "18px" }}>
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
                      Account Type
                    </label>

                    <select
                      value={form.role}
                      onChange={set("role")}
                      style={{
                        width: "100%",
                        padding: "10px 13px",
                        fontSize: "14px",
                        fontFamily: "inherit",
                        background: "#f8fafc",
                        border: `1.5px solid ${C.border}`,
                        borderRadius: "8px",
                        outline: "none",
                        color: C.text,
                        boxSizing: "border-box",
                      }}
                    >
                      <option value="USER">
                        User — Personal Banking
                      </option>

                      <option value="ADMIN">
                        Admin — Platform Management
                      </option>
                    </select>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  style={{
                    width: "100%",
                    marginTop: "4px",
                  }}
                >
                  {loading ? (
                    <Spinner />
                  ) : view === "login" ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
              