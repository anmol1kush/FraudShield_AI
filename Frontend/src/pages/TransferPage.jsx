import { useState } from "react";

import "./TransferPage.css";

import { api } from "../api/api";

export default function TransferPage({ toast }) {

    const [receiverAccount, setReceiverAccount] = useState("");

    const [receiverName, setReceiverName] = useState("");

    const [amount, setAmount] = useState("");

    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const [result, setResult] = useState(null);

    async function transferMoney(e) {

        e.preventDefault();

        if (!receiverAccount) {

            toast("Receiver account number required", "error");

            return;

        }

        if (!receiverName) {

            toast("Receiver name required", "error");

            return;

        }

        if (!amount || Number(amount) <= 0) {

            toast("Enter a valid amount", "error");

            return;

        }

        setLoading(true);

        try {

            const response = await api(
                "/transactions/transfer",
                {
                    method: "POST",

                    body: JSON.stringify({

                        receiver_account_number: receiverAccount,

                        receiver_name: receiverName,

                        amount: Number(amount)

                    })
                }
            );

            /*
                Backend returns

                {
                    success:true,
                    message:"",
                    data:{...}
                }

            */

            setResult(response.data);

            setShowModal(true);

            setReceiverAccount("");

            setReceiverName("");

            setAmount("");

        }

        catch(err){

            toast(err.message,"error");

        }

        finally{

            setLoading(false);

        }

    }

    return(

        <div className="transfer-page">

            <div className="transfer-card">

                <h1>

                    Transfer Money

                </h1>

                <p>

                    Send money securely to another bank account.

                </p>

                <form onSubmit={transferMoney}>

                    <div className="form-group">

                        <label>

                            Receiver Account Number

                        </label>

                        <input

                            value={receiverAccount}

                            onChange={(e)=>

                                setReceiverAccount(

                                    e.target.value

                                )

                            }

                            placeholder="ACC100002"

                        />

                    </div>

                    <div className="form-group">

                        <label>

                            Receiver Name

                        </label>

                        <input

                            value={receiverName}

                            onChange={(e)=>

                                setReceiverName(

                                    e.target.value

                                )

                            }

                            placeholder="Rahul Sharma"

                        />

                    </div>

                    <div className="form-group">

                        <label>

                            Amount

                        </label>

                        <input

                            type="number"

                            value={amount}

                            onChange={(e)=>

                                setAmount(

                                    e.target.value

                                )

                            }

                            placeholder="5000"

                        />

                    </div>

                    <button

                        className="transfer-btn"

                        disabled={loading}

                    >

                        {

                            loading

                            ?

                            "Processing..."

                            :

                            "Send Money"

                        }

                    </button>

                </form>
                                {/* ===========================
                    TRANSACTION RESULT MODAL
                ============================ */}

                {

                    showModal && result && (

                        <div className="modal-overlay">

                            <div className="result-modal">

                                {

                                    result.alert_generated ||

                                    result.risk_level === "HIGH"

                                    ?

                                    <>

                                        <div className="danger-icon">

                                            ✕

                                        </div>

                                        <h2>

                                            Transaction Blocked

                                        </h2>

                                        <p className="danger-text">

                                            Fraud detected by FraudShield AI

                                        </p>

                                    </>

                                    :

                                    <>

                                        <div className="success-icon">

                                            ✓

                                        </div>

                                        <h2>

                                            Transaction Successful

                                        </h2>

                                        <p className="success-text">

                                            Money transferred successfully

                                        </p>

                                    </>

                                }

                                <div className="transaction-summary">

                                    <div className="summary-row">

                                        <span>

                                            Transaction ID

                                        </span>

                                        <strong>

                                            #{result.transaction_id}

                                        </strong>

                                    </div>

                                    <div className="summary-row">

                                        <span>

                                            Receiver

                                        </span>

                                        <strong>

                                            {result.receiver_name}

                                        </strong>

                                    </div>

                                    <div className="summary-row">

                                        <span>

                                            Account

                                        </span>

                                        <strong>

                                            {result.receiver_account_number}

                                        </strong>

                                    </div>

                                    <div className="summary-row">

                                        <span>

                                            Amount

                                        </span>

                                        <strong>

                                            ₹ {result.amount}

                                        </strong>

                                    </div>

                                    <div className="summary-row">

                                        <span>

                                            Risk Level

                                        </span>

                                        <span

                                            className={`risk ${result.risk_level?.toLowerCase()}`}

                                        >

                                            {result.risk_level}

                                        </span>

                                    </div>

                                </div>

                                {

                                    (

                                        result.reasons &&

                                        result.reasons.length > 0

                                    )

                                    &&

                                    <div className="reason-box">

                                        <h3>

                                            Fraud Detection Reason

                                        </h3>
                                        <ul>

                                            {

                                                result.reasons.map(

                                                    (reason,index)=>

                                                    (

                                                        <li

                                                            key={index}

                                                        >

                                                            {reason}

                                                        </li>

                                                    )

                                                )

                                            }

                                        </ul>

                                    </div>

                                }

                                {

                                    (

                                        result.triggered_rules &&

                                        result.triggered_rules.length>0

                                    )

                                    &&

                                    <div className="rule-box">

                                        <h3>

                                            Triggered Rules

                                        </h3>

                                        <div className="rule-container">

                                            {

                                                result.triggered_rules.map(

                                                    (rule,index)=>

                                                    (

                                                        <span

                                                            className="rule-chip"

                                                            key={index}

                                                        >

                                                            {rule}

                                                        </span>

                                                    )

                                                )

                                            }

                                        </div>

                                    </div>

                                }

                                <button

                                    className="close-btn"

                                    onClick={()=>

                                        setShowModal(false)

                                    }

                                >

                                    Close

                                </button>

                            </div>

                        </div>

                    )

                }

            </div>

        </div>

    );

}