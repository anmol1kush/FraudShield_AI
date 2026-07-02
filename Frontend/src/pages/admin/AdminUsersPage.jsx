import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import Card from "../../components/card";
import Button from "../../components/Button";

import { api } from "../../api/api";

export default function AdminUsersPage({ user, toast }) {

    const [users,setUsers]=useState([]);

    useEffect(()=>{

        loadUsers();

    },[]);

    async function loadUsers(){

        try{

            const data=await api("/admin/users");

            setUsers(data);

        }

        catch(err){

            toast(err.message,"error");

        }

    }

    async function blockUser(id){

        try{

            await api(`/admin/users/${id}/block`,{

                method:"PATCH"

            });

            loadUsers();

            toast("User Updated","success");

        }

        catch(err){

            toast(err.message,"error");

        }

    }

    return(

        <>

        <Navbar user={user}/>

        <div style={{padding:"30px"}}>

        <h1>Users</h1>

        {

            users.map(u=>(

                <Card

                key={u.id}

                style={{marginBottom:"20px"}}

                >

                    <h3>{u.full_name}</h3>

                    <p>{u.email}</p>

                    <p>Status : {u.status}</p>

                    <Button

                    variant="danger"

                    onClick={()=>blockUser(u.id)}

                    >

                        Block User

                    </Button>

                </Card>

            ))

        }

        </div>

        </>

    );

}