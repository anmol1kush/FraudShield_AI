import React from "react";

import { C } from "../constants/colors";

export default function Button({

    children,

    variant="primary",

    size="md",

    disabled,

    onClick,

    style={}

}){

    const sizes={

        sm:"8px 16px",

        md:"10px 18px",

        lg:"12px 22px"

    };

    return(

        <button

            disabled={disabled}

            onClick={onClick}

            style={{

                width:"100%",

                padding:sizes[size],

                background:

                variant==="primary"

                ?C.navy

                :"white",

                color:

                variant==="primary"

                ?"white"

                :C.navy,

                border:

                variant==="primary"

                ?"none"

                :"1px solid "+C.border,

                borderRadius:"8px",

                cursor:"pointer",

                fontWeight:600,

                fontSize:"14px",

                ...style

            }}

        >

            {children}

        </button>

    );

}