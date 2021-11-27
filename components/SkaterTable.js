import Table from "./Table";
import Link from "next/link";

export default function SkaterTable({ players }) {
    const columns = [
        {
            Header: "#",
            accessor: "index",
        },
        {
            Header: "Name",
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
            Header: "Shots on Goal",
            accessor: "sog",
        },
        {
            Header: "Goals",
            accessor: "g",
        },
        {
            Header: "Primary Assists",
            accessor: "a1",
        },
        {
            Header: "Secondary Assists",
            accessor: "a2",
        },
        {
            Header: "Penalty Minutes",
            accessor: "pim",
        },
        {
            Header: "Penalties Drawn",
            accessor: "pend",
        },
        { Header: "Blocks", accessor: "bks" },
        { Header: "Hat Tricks", accessor: "hattys" },
        {
            Header: "Points",
            accessor: "points",
        },
        {
            Header: "Id",
            accessor: "playerId",
            id: "id",
        },
    ];

    return <Table data={players} columns={columns} />;
}
