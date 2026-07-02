import { useState, useEffect } from "react";

import AuthPage from "./pages/AuthPage";
import TransactionsPage from "./pages/TransactionsPage";
import DashboardPage from "./pages/DashboardPage";
import AccountPage from "./pages/AccountPage";
import MyAlertsPage from "./pages/MyAlertsPage";
import ProfilePage from "./pages/ProfilePage";
import TransferPage from "./pages/TransferPage";
import AdminAlertsPage from "./pages/admin/AdminAlertsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminAuditLogsPage from "./pages/admin/AdminAuditLogsPage";

import Sidebar from "./components/Sidebar";
import Spinner from "./components/Spinner";
import Toast from "./components/Toast";

import { useToast } from "./hooks/UseToast";

import { api } from "./api/api";

import { C } from "./constants/colors";

export default function App() {

    const [token, setToken] = useState(
        () => localStorage.getItem("token")
    );

    const [user, setUser] = useState(null);

    const [active, setActive] = useState("dashboard");

    const [loading, setLoading] = useState(false);

    const { toasts, add, remove } = useToast();

    useEffect(() => {

        if (!token) return;

        async function loadUser() {

            setLoading(true);

            try {

                const data = await api("/users/me");

                setUser(data);

            } catch {

                localStorage.removeItem("token");

                setToken(null);

            } finally {

                setLoading(false);

            }

        }

        loadUser();

    }, [token]);

    function handleLogin(token) {

        setToken(token);

    }

    function handleLogout() {

        localStorage.removeItem("token");

        setToken(null);

        setUser(null);

        setActive("dashboard");

    }

    if (!token) {

        return <AuthPage onLogin={handleLogin} />;

    }

    if (loading || !user) {

        return (

            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: C.bg,
                    fontFamily: "'Inter',sans-serif"
                }}
            >

                <div style={{ textAlign: "center" }}>

                    <Spinner />

                    <p
                        style={{
                            marginTop: "15px",
                            color: C.textMuted
                        }}
                    >
                        Loading your account...
                    </p>

                </div>

            </div>

        );

    }

    const pages = {

        dashboard:
            <DashboardPage
                user={user}
                toast={add}
            />,

        account:
            <AccountPage />,

        alerts:
            <MyAlertsPage />,

        profile:
            <ProfilePage
                user={user}
                setUser={setUser}
                toast={add}
            />,
        transfer:
    <TransferPage
        toast={add}
    />,
    transactions: (
    <TransactionsPage toast={add} />
),
        "admin-alerts":
            <AdminAlertsPage
                toast={add}
            />,

        "admin-users":
            <AdminUsersPage
                toast={add}
            />,

        "admin-auditlogs":
            <AdminAuditLogsPage
                toast={add}
            />

    };

    return (

        <>

            <Toast
                toasts={toasts}
                remove={remove}
            />

            <div
                style={{
                    display: "flex",
                    minHeight: "100vh",
                    background: C.bg,
                    fontFamily: "'Inter',sans-serif"
                }}
            >

                <Sidebar

                    user={user}

                    active={active}

                    setActive={setActive}

                    onLogout={handleLogout}

                />

                <main

                    style={{
                        flex: 1,
                        padding: "36px 40px",
                        overflowY: "auto"
                    }}

                >

                    {pages[active]}

                </main>

            </div>

        </>

    );

}