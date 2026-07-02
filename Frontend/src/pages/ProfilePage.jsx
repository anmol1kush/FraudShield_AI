import { useState } from "react";

import Navbar from "../components/Navbar";
import Card from "../components/card";
import Input from "../components/Input";
import Button from "../components/Button";

import { api } from "../api/api";
import { C } from "../constants/colors";

export default function ProfilePage({ user, toast }) {

    const [fullName, setFullName] = useState(user?.full_name || "");

    const [phone, setPhone] = useState(user?.phone_number || "");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    async function updateProfile(e) {

        e.preventDefault();

        setLoading(true);

        try {

            await api("/users/me", {

                method: "PATCH",

                body: JSON.stringify({

                    full_name: fullName,

                    phone_number: phone

                })

            });

            toast("Profile updated successfully", "success");

        }

        catch (err) {

            toast(err.message, "error");

        }

        finally {

            setLoading(false);

        }

    }

    async function changePassword() {

        if (!password) return;

        try {

            await api("/users/change-password", {

                method: "PATCH",

                body: JSON.stringify({

                    password

                })

            });

            setPassword("");

            toast("Password changed", "success");

        }

        catch (err) {

            toast(err.message, "error");

        }

    }

    return (

        <>

            <Navbar user={user} />

            <div style={{ padding: "30px" }}>

                <h1 >My Profile</h1>

                <Card style={{ marginTop: "25px" }}>

                    <form onSubmit={updateProfile}>

                        <Input

                            label="Full Name"

                            value={fullName}

                            onChange={(e)=>setFullName(e.target.value)}

                        />

                        <Input

                            label="Phone Number"

                            value={phone}

                            onChange={(e)=>setPhone(e.target.value)}

                        />

                        <Input

                            label="Email"

                            value={user?.email}

                            disabled

                        />

                        <Button

                            type="submit"

                            disabled={loading}

                        >

                            {

                                loading

                                ?

                                "Updating..."

                                :

                                "Update Profile"

                            }

                        </Button>

                    </form>

                </Card>

                <Card style={{ marginTop: "25px" }}>

                    <h3>Change Password</h3>

                    <Input

                        type="password"

                        label="New Password"

                        value={password}

                        onChange={(e)=>setPassword(e.target.value)}

                    />

                    <Button

                        onClick={changePassword}

                    >

                        Change Password

                    </Button>

                </Card>

            </div>

        </>

    );

}