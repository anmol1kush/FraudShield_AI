import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import Card from "../../components/card";
import Button from "../../components/Button";

import { api } from "../../api/api";

export default function AdminAlertsPage({ user, toast }) {

    const [alerts, setAlerts] = useState([]);

    const [loading, setLoading] = useState(true);

    async function fetchAlerts() {

        try {

           api(`/admin/alerts/${id}/resolve`, {
    method: "PATCH"
});

            setAlerts(data);

        }

        catch (err) {

            toast(err.message, "error");

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        fetchAlerts();

    }, []);

    async function approveAlert(id) {

        try {

            await api(`/admin/alerts/${id}/approve`, {

                method: "PATCH"

            });

            fetchAlerts();

            toast("Alert Approved", "success");

        }

        catch (err) {

            toast(err.message, "error");

        }

    }

    return (

        <>

            <Navbar user={user} />

            <div style={{ padding: "30px" }}>

                <h1>Manage Alerts</h1>

                {

                    loading ?

                    <p>Loading...</p>

                    :

                    alerts.map(alert=>(

                        <Card

                            key={alert.id}

                            style={{marginBottom:"20px"}}

                        >

                            <h3>{alert.alert_type}</h3>

                            <p>User : {alert.user_email}</p>

                            <p>Amount : ₹{alert.amount}</p>

                            <p>Status : {alert.status}</p>

                            <Button

                                onClick={()=>approveAlert(alert.id)}

                            >

                                Approve

                            </Button>

                        </Card>

                    ))

                }

            </div>

        </>

    );

}