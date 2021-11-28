import Table from "./Table";
import Link from "next/link";
import { default as _ } from "lodash";

export default function MyTable({ players, index }) {
    const columns = [
        {
            Header: index ? "Rank" : "Rank (Overall)",
            accessor: "rankings.overall",
        },
        {
            Header: "Rank (Skaters / Goalies)",
            accessor: (row) =>
                row.rankings.skater ? row.rankings.skater : row.rankings.goalie,
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

    return (
        <Table
            data={players}
            columns={index ? _.concat(columns[0], columns.slice(2)) : columns}
        />
    );
}
