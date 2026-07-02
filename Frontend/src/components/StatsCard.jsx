import { C } from "../constants/colors";

export default function StatsCard({
    title,
    value,
    icon,
    color = C.accent
}) {

    return (

        <div
            style={{
                background: "#fff",
                borderRadius: 18,
                padding: 24,
                boxShadow: "0 10px 30px rgba(0,0,0,.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: ".25s",
                cursor: "pointer"
            }}

            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
            }}

            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
            }}
        >

            <div>

                <p
                    style={{
                        margin: 0,
                        color: "#888",
                        fontSize: 14
                    }}
                >
                    {title}
                </p>

                <h2
                    style={{
                        marginTop: 8,
                        marginBottom: 0,
                        color: C.text
                    }}
                >
                    {value}
                </h2>

            </div>

            <div
                style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: color,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                    fontSize: 28
                }}
            >
                {icon}
            </div>

        </div>

    );

}