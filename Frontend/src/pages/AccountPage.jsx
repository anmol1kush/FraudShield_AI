import { useEffect, useState } from "react";

import { api } from "../api/api";
import { C } from "../constants/colors";

export default function AccountPage() {

    const [account, setAccount] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadAccount();

    }, []);

    async function loadAccount() {

        try {

            const data = await api("/accounts/me");

            setAccount(data);

        }

        finally {

            setLoading(false);

        }

    }

    if (loading) {

        return <h2>Loading...</h2>;

    }

    return (

        <div>

            <h1
                style={{
                    marginBottom: 8,
                    color: C.text
                }}
            >
                🏦 My Account
            </h1>

            <p
                style={{
                    color: C.textMuted,
                    marginBottom: 30
                }}
            >
                
            </p>

            <div

                style={{

                    display: "grid",

                    gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",

                    gap: 20

                }}

            >

                <InfoCard

                    title="Account Number"

                    value={account.account_number}

                    icon="💳"

                    color="#2563eb"

                />

                <InfoCard

                    title="Available Balance"

                    value={`₹ ${Number(account.balance).toLocaleString()}`}

                    icon="💰"

                    color="#16a34a"

                />

                <InfoCard

                    title="Account Type"

                    value={account.account_type}

                    icon="🏦"

                    color="#9333ea"

                />

                <InfoCard

                    title="Status"

                    value="ACTIVE"

                    icon="✅"

                    color="#22c55e"

                />

            </div>

        </div>

    );

}

function InfoCard({

    title,

    value,

    icon,

    color

}) {

    return (

        <div

            style={{

                background: "#fff",

                padding: 25,

                borderRadius: 18,

                boxShadow: "0 8px 24px rgba(0,0,0,.08)",

                transition: ".2s"

            }}

        >

            <div

                style={{

                    display: "flex",

                    justifyContent: "space-between",

                    alignItems: "center"

                }}

            >

                <div>

                    <p

                        style={{

                            color: "#888",

                            margin: 0

                        }}

                    >

                        {title}

                    </p>

                    <h2

                        style={{

                            marginTop: 10,

                            color: C.text

                        }}

                    >

                        {value}

                    </h2>

                </div>

                <div

                    style={{

                        width: 60,

                        height: 60,

                        borderRadius: "50%",

                        background: color,

                        display: "flex",

                        justifyContent: "center",

                        alignItems: "center",

                        color: "#fff",

                        fontSize: 28

                    }}

                >

                    {icon}

                </div>

            </div>

        </div>

    );

}