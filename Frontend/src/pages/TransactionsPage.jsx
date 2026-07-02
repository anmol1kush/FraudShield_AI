import { useEffect, useState } from "react";

import Card from "../components/card";
import { api } from "../api/api";
import { C } from "../constants/colors";

export default function TransactionsPage({ toast }) {

    const [transactions, setTransactions] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadTransactions();

    }, []);

    async function loadTransactions() {

        try {

            const data = await api("/transactions/");

            setTransactions(data.transactions || []);

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
                My Transactions
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

                transactions.length === 0 ?

                <Card>

                    <h3>No Transactions Found</h3>

                    <p>

                        You haven't made any transactions yet.

                    </p>

                </Card>

                :

                transactions.map((transaction) => (

                    <Card

                        key={transaction.transaction_id}

                        style={{
                            marginBottom: 20
                        }}

                    >

                        <h3>

                            Transaction #

                            {transaction.transaction_id}

                        </h3>

                        <p>

                            <b>Receiver :</b>

                            {" "}

                            {transaction.receiver_name}

                        </p>

                        <p>

                            <b>Receiver Account :</b>

                            {" "}

                            {transaction.receiver_account_number}

                        </p>

                        <p>

                            <b>Amount :</b>

                            ₹ {transaction.amount}

                        </p>

                        <p>

                            <b>Risk Level :</b>

                            {transaction.risk_level}

                        </p>

                        <p>

                            <b>Status :</b>

                            {transaction.status}

                        </p>

                        <p>

                            <b>Transaction Time :</b>

                            {" "}

                            {

                                new Date(

                                    transaction.transaction_time

                                ).toLocaleString()

                            }

                        </p>

                    </Card>

                ))

            }

        </div>

    );

}