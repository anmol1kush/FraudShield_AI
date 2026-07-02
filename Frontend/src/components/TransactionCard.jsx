import Badge from "./Badge";

export default function TransactionCard({ transaction }) {

    return (

        <div

            style={{

                background: "#fff",

                borderRadius: 18,

                padding: 22,

                marginBottom: 18,

                boxShadow: "0 5px 18px rgba(0,0,0,.08)"

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

                    <h3
                        style={{
                            margin: 0
                        }}
                    >
                        {transaction.receiver_name}
                    </h3>

                    <p
                        style={{
                            color: "#888",
                            marginTop: 5
                        }}
                    >
                        {transaction.receiver_account_number}
                    </p>

                </div>

                <h2>

                    ₹{transaction.amount}

                </h2>

            </div>

            <hr />

            <div

                style={{

                    display: "flex",

                    justifyContent: "space-between",

                    marginTop: 18,

                    flexWrap: "wrap",

                    gap: 15

                }}

            >

                <div>

                    <small>Risk Level</small>

                    <br />

                    <Badge

                        text={transaction.risk_level}

                        type={transaction.risk_level}

                    />

                </div>

                <div>

                    <small>Status</small>

                    <br />

                    <Badge

                        text={transaction.status}

                        type={transaction.status}

                    />

                </div>

                <div>

                    <small>Date</small>

                    <br />

                    {

                        transaction.transaction_time

                        ?

                        new Date(

                            transaction.transaction_time

                        ).toLocaleString()

                        :

                        "N/A"

                    }

                </div>

            </div>

        </div>

    );

}