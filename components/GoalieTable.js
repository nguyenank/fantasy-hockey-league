import Table from "./Table";
import Link from "next/link";

export default function GoalieTable({ players, individual, team }) {
    const columns = [
        {
            Header: team ? "Rank (Overall)" : "Rank",
            accessor: team ? "rankings.overall" : "rankings.goalie",
        },
        {
            Header: "Name",
            accessor: "name", // accessor is the "key" in the data
            Cell: ({ value, row }) => {
                return (
                    <Link href={`/players/${row.original.playerId}`}>
                        <a className={row.not_playing ? "crossed" : ""}>
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
            accessor: "position", // accessor is the "key" in the data
        },
        {
            Header: "Starts",
            accessor: "start",
        },
        {
            Header: "Wins",
            accessor: "w",
        },
        {
            Header: "Saves",
            accessor: "svs",
        },
        {
            Header: "Goals Against",
            accessor: "ga",
        },
        {
            Header: "Shutouts",
            accessor: "so",
        },
        {
            Header: "Primary Assists",
            accessor: "a1",
        },
        { Header: "Secondary Assists", accessor: "a2" },
        { Header: "Penalty Shots Saved", accessor: "ps_sv" },
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
            columns={individual ? columns.slice(3) : columns}
        />
    );
}
