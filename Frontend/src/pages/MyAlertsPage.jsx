import { useEffect, useState } from "react";

import Card from "../components/card";
import { api } from "../api/api";
import { C } from "../constants/colors";

export default function MyAlertsPage({ toast }) {

    const [alerts, setAlerts] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadAlerts();

    }, []);

    async function loadAlerts() {

        try {

            const [alertRes, transactionRes] = await Promise.all([

                api("/alerts/"),

                api("/transactions/")

            ]);

            const merged = (alertRes.alerts || []).map(alert => {

                const tx = (transactionRes.transactions || []).find(

                    t => t.transaction_id === alert.transaction_id

                );

                return {

                    ...alert,

                    transaction: tx

                };

            });

            setAlerts(merged);

        }

        catch (err) {

            toast(err.message, "error");

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div>

            <h1
                style={{
                    color: C.text,
                    marginBottom: 10
                }}
            >
                My Fraud Alerts
            </h1>

            <p
                style={{
                    color: C.textMuted,
                    marginBottom: 25
                }}
            >
               
            </p>

            {

                loading ?

                <h3>Loading...</h3>

                :

                alerts.length === 0 ?

                <Card>

                    <div
                        style={{
                            textAlign: "center",
                            padding: 20
                        }}
                    >

                        <h2>🛡 No Fraud Alerts</h2>

                        <p>


                        </p>

                    </div>

                </Card>

                :

                alerts.map(alert => (

                    <Card

                        key={alert.alert_id}

                        style={{

                            marginBottom: 20,

                            borderLeft:

                                alert.transaction?.risk_level === "HIGH"

                                    ? "6px solid red"

                                    : "6px solid orange"

                        }}

                    >

                        <h2>

                            🚨 Fraud Alert

                        </h2>

                        <hr />

                        <p>

                            <b>Transaction ID :</b>

                            {" "}

                            {alert.transaction_id}

                        </p>

                        <p>

                            <b>Receiver :</b>

                            {" "}

                            {alert.transaction?.receiver_name || "-"}

                        </p>

                        <p>

                            <b>Receiver Account :</b>

                            {" "}

                            {alert.transaction?.receiver_account_number || "-"}

                        </p>

                        <p>

                            <b>Amount :</b>

                            ₹ {alert.transaction?.amount || "-"}

                        </p>

                        <p>

                            <b>Risk Level :</b>

                            {" "}

                            {alert.transaction?.risk_level || "-"}

                        </p>

                        <p>

                            <b>Transaction Status :</b>

                            {" "}

                            {alert.transaction?.status || "-"}

                        </p>

                        <p>

                            <b>Alert Message :</b>

                            {" "}

                            {alert.alert_message}

                        </p>

                        <p>

                            <b>Alert Time :</b>

                            {" "}

                            {

                                new Date(

                                    alert.alert_time

                                ).toLocaleString()

                            }

                        </p>

                        <p>

                            <b>Resolved :</b>

                            {" "}

                            {

                                alert.is_resolved

                                    ? "✅ Yes"

                                    : "❌ No"

                            }

                        </p>

                    </Card>

                ))

            }

        </div>

    );

}