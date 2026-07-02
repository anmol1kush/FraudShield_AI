import { useEffect, useMemo, useState } from "react";

import { api } from "../api/api";

import { C } from "../constants/colors";

import StatsCard from "../components/StatsCard";
import TransactionCard from "../components/TransactionCard";

export default function DashboardPage({ user, toast }) {

    const [transactions, setTransactions] = useState([]);

    const [account, setAccount] = useState(null);

    const [alerts, setAlerts] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadDashboard();

    }, []);

    async function loadDashboard() {

        setLoading(true);

        try {

            const [

                transactionRes,

                accountRes,

                alertRes

            ] = await Promise.all([

                api("/transactions/"),

                api("/accounts/me"),

                api("/alerts/")

            ]);

            setTransactions(

                transactionRes.transactions || []

            );

            setAccount(accountRes);

            setAlerts(

                alertRes.alerts || []

            );

        }

        catch (err) {

            toast(err.message, "error");

        }

        finally {

            setLoading(false);

        }

    }

    const successfulTransactions = useMemo(() =>

        transactions.filter(

            t => t.status === "SUCCESS"

        ).length,

        [transactions]

    );

    const flaggedTransactions = useMemo(() =>

        transactions.filter(

            t => t.status === "FLAGGED"

        ).length,

        [transactions]

    );

    const recentTransactions = useMemo(() =>

        [...transactions]

            .sort(

                (a, b) =>

                    new Date(b.transaction_time) -

                    new Date(a.transaction_time)

            )

            .slice(0, 5),

        [transactions]

    );

    if (loading) {

        return (

            <div

                style={{

                    minHeight: "100vh",

                    display: "flex",

                    justifyContent: "center",

                    alignItems: "center",

                    fontSize: 22,

                    color: C.text

                }}

            >

                Loading Dashboard...

            </div>

        );

    }

    return (

        <div>

            {/* HEADER */}

            <div

                style={{

                    display: "flex",

                    justifyContent: "space-between",

                    alignItems: "center",

                    marginBottom: 35

                }}

            >

                <div>

                    <h1

                        style={{

                            margin: 0,

                            fontSize: 34,

                            color: C.text

                        }}

                    >

                        Welcome,

                        {" "}

                        {user?.full_name}

                        👋

                    </h1>

                    <p

                        style={{

                            color: C.textMuted,

                            marginTop: 8

                        }}

                    >

                        Monitor your banking activities and fraud alerts.

                    </p>

                </div>

                <div

                    style={{

                        background: "#fff",

                        padding: "18px 25px",

                        borderRadius: 18,

                        boxShadow: "0 10px 30px rgba(0,0,0,.08)"

                    }}

                >

                    <div

                        style={{

                            fontSize: 13,

                            color: "#888"

                        }}

                    >

                        Account Number

                    </div>

                    <h3

                        style={{

                            margin: "6px 0"

                        }}

                    >

                        {account?.account_number}

                    </h3>

                </div>

            </div>

            {/* STATS */}

            <div

                style={{

                    display: "grid",

                    gridTemplateColumns:

                        "repeat(auto-fit,minmax(230px,1fr))",

                    gap: 22,

                    marginBottom: 40

                }}

            >

                <StatsCard

                    title="Current Balance"

                    value={`₹ ${Number(

                        account?.balance || 0

                    ).toLocaleString()}`}

                    icon="💰"

                    color="#2563eb"

                />

                <StatsCard

                    title="Transactions"

                    value={transactions.length}

                    icon="💳"

                    color="#16a34a"

                />

                <StatsCard

                    title="Successful"

                    value={successfulTransactions}

                    icon="✅"

                    color="#22c55e"

                />

                <StatsCard

                    title="Fraud Alerts"

                    value={alerts.length}

                    icon="🚨"

                    color="#dc2626"

                />

            </div>
                        {/* MAIN CONTENT */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: "28px",
                    alignItems: "start",
                }}
            >

                {/* LEFT COLUMN */}

                <div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "18px",
                        }}
                    >

                        <h2
                            style={{
                                margin: 0,
                                color: C.text,
                            }}
                        >
                            Recent Transactions
                        </h2>

                        <span
                            style={{
                                color: C.textMuted,
                                fontSize: "14px",
                            }}
                        >
                            Showing latest 5
                        </span>

                    </div>

                    {

                        recentTransactions.length === 0

                        ?

                        <div
                            style={{
                                background: "#fff",
                                padding: "40px",
                                borderRadius: "18px",
                                textAlign: "center",
                                boxShadow: "0 10px 25px rgba(0,0,0,.08)"
                            }}
                        >

                            <h2
                                style={{
                                    marginTop: 0,
                                }}
                            >
                                💳 No Transactions Yet
                            </h2>

                            <p
                                style={{
                                    color: C.textMuted,
                                }}
                            >
                                Your recent transactions will appear here.
                            </p>

                        </div>

                        :

                        recentTransactions.map(transaction => (

                            <TransactionCard

                                key={transaction.transaction_id}

                                transaction={transaction}

                            />

                        ))

                    }

                </div>

                {/* RIGHT COLUMN */}

                <div>

                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "18px",
                            padding: "25px",
                            marginBottom: "25px",
                            boxShadow: "0 10px 25px rgba(0,0,0,.08)",
                        }}
                    >

                        <h2
                            style={{
                                marginTop: 0,
                            }}
                        >
                            🚨 Fraud Summary
                        </h2>

                        <hr />

                        <div
                            style={{
                                marginTop: "18px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "18px",
                            }}
                        >

                            <div>

                                <small
                                    style={{
                                        color: "#888",
                                    }}
                                >
                                    Total Fraud Alerts
                                </small>

                                <h2
                                    style={{
                                        margin: 0,
                                        color: "#dc2626",
                                    }}
                                >
                                    {alerts.length}
                                </h2>

                            </div>

                            <div>

                                <small
                                    style={{
                                        color: "#888",
                                    }}
                                >
                                    Flagged Transactions
                                </small>

                                <h2
                                    style={{
                                        margin: 0,
                                        color: "#ef4444",
                                    }}
                                >
                                    {flaggedTransactions}
                                </h2>

                            </div>

                            <div>

                                <small
                                    style={{
                                        color: "#888",
                                    }}
                                >
                                    Successful Transfers
                                </small>

                                <h2
                                    style={{
                                        margin: 0,
                                        color: "#16a34a",
                                    }}
                                >
                                    {successfulTransactions}
                                </h2>

                            </div>

                        </div>

                    </div>

                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "18px",
                            padding: "25px",
                            boxShadow: "0 10px 25px rgba(0,0,0,.08)",
                        }}
                    >

                        <h2
                            style={{
                                marginTop: 0,
                            }}
                        >
                            🛡 Account Information
                        </h2>

                        <hr />

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "18px",
                                marginTop: "20px",
                            }}
                        >

                            <div>

                                <small
                                    style={{
                                        color: "#888",
                                    }}
                                >
                                    Name
                                </small>

                                <h3
                                    style={{
                                        margin: 0,
                                    }}
                                >
                                    {user?.full_name}
                                </h3>

                            </div>

                            <div>

                                <small
                                    style={{
                                        color: "#888",
                                    }}
                                >
                                    Email
                                </small>

                                <h3
                                    style={{
                                        margin: 0,
                                        fontSize: "16px",
                                    }}
                                >
                                    {user?.email}
                                </h3>

                            </div>

                            <div>

                                <small
                                    style={{
                                        color: "#888",
                                    }}
                                >
                                    Account Type
                                </small>

                                <h3
                                    style={{
                                        margin: 0,
                                    }}
                                >
                                    {account?.account_type}
                                </h3>

                            </div>

                            <div>

                                <small
                                    style={{
                                        color: "#888",
                                    }}
                                >
                                    Current Balance
                                </small>

                                <h2
                                    style={{
                                        color: "#2563eb",
                                        margin: 0,
                                    }}
                                >
                                    ₹ {Number(account?.balance || 0).toLocaleString()}
                                </h2>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* FOOTER */}

            <div
                style={{
                    marginTop: "50px",
                    textAlign: "center",
                    color: "#888",
                    fontSize: "14px",
                }}
            >

                Powered by FraudShield AI • Secure Banking Dashboard

            </div>

        </div>

    );

}