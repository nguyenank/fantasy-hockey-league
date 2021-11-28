import Table from "./Table";
import Link from "next/link";

export default function MyTable({ players }) {
    const columns = [
        {
            Header: "#",
            accessor: "index",
        },
        {
            Header: "Player Name",
            accessor: "name", // accessor is the "key" in the data
            Cell: ({ value, row }) => {
                return (
                    <Link href={`/players/${row.original.playerId}`}>
                        <a>{value}</a>
                    </Link>
                );
            },
        },
        {
            Header: "Team",
            accessor: "team", // accessor is the "key" in the data
        },
        {
            Header: "Position",
            accessor: "position",
        },
        {
            Header: "Points",
            accessor: "points",
            Cell: ({ value }) => parseFloat(value).toFixed(2),
        },
        {
            Header: "Id",
            accessor: "playerId",
            id: "id",
        },
    ];

    return <Table data={players} columns={columns} />;
}
