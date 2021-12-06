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
                !row.rankings
                    ? ""
                    : row.rankings.skater
                    ? row.rankings.skater
                    : row.rankings.goalie,
        },
        {
            Header: "Player Name",
            accessor: "name", // accessor is the "key" in the data
            Cell: ({ value, row }) => {
                return (
                    <Link href={`/players/${row.original.playerId}`}>
                        <a
                            className={
                                row.original.not_playing ? "crossed" : ""
                            }
                        >
                            {value}
                        </a>
                    </Link>
                );
            },
        },
        {
            Header: "Points",
            accessor: "points",
            Cell: ({ value }) => (value ? parseFloat(value).toFixed(2) : ""),
        },
        {
            Header: "Games Played",
            accessor: "gp",
        },
        {
            Header: "Points Per Game",
            accessor: "ppg",
            Cell: ({ value }) => (value ? parseFloat(value).toFixed(2) : ""),
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
            Header: "Id",
            accessor: "playerId",
            id: "id",
        },
        {
            Header: "Not Playing",
            accessor: "not_playing",
            id: "not_playing",
        },
    ];

    return (
        <Table
            data={players}
            columns={index ? _.concat(columns[0], columns.slice(2)) : columns}
        />
    );
}
