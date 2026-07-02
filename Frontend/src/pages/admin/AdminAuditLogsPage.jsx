import { useEffect,useState } from "react";

import Navbar from "../../components/Navbar";

import Card from "../../components/card";

import { api } from "../../api/api";

export default function AdminAuditLogsPage({user,toast}){

    const [logs,setLogs]=useState([]);

    useEffect(()=>{

        loadLogs();

    },[]);

    async function loadLogs(){

        try{

            const data=await api("/admin/audit-logs");

            setLogs(data);

        }

        catch(err){

            toast(err.message,"error");

        }

    }

    return(

        <>

        <Navbar user={user}/>

        <div style={{padding:"30px"}}>

        <h1>Audit Logs</h1>

        {

            logs.map(log=>(

                <Card

                key={log.id}

                style={{marginBottom:"15px"}}

                >

                    <h3>{log.action}</h3>

                    <p>User : {log.user_email}</p>

                    <p>{log.timestamp}</p>

                </Card>

            ))

        }

        </div>

        </>

    );

}