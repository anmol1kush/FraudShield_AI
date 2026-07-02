import React from "react";

export default function Card({

    children,

    style={}

}){

    return(

        <div

            style={{

                background:"#fff",

                borderRadius:"14px",

                border:"1px solid #E5E7EB",

                boxShadow:"0 2px 8px rgba(0,0,0,0.06)",

                ...style

            }}

        >

            {children}

        </div>

    );

}