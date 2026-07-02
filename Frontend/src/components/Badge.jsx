export default function Badge({ text, type }) {

    let bg = "#22c55e";

    if (type === "HIGH") bg = "#ef4444";

    if (type === "MEDIUM") bg = "#f59e0b";

    if (type === "FLAGGED") bg = "#dc2626";

    if (type === "SUCCESS") bg = "#16a34a";

    return (

        <span
            style={{
                background: bg,
                color: "#fff",
                padding: "6px 12px",
                borderRadius: 30,
                fontSize: 12,
                fontWeight: 600
            }}
        >
            {text}
        </span>

    );

}