import Table from "./Table";
import Link from "next/link";
import { default as _ } from "lodash";

export default function PlayerPoolTable({ players, index, toggleRow }) {
    const columns = [
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
            Header: "Team",
            accessor: "team", // accessor is the "key" in the data
        },
        {
            Header: "Position",
            accessor: "position",
        },
        {
            Header: "Age",
            accessor: "age",
        },
        {
            Header: "Fantasy Value",
            accessor: "fantasy_value",
        },
        {
            Header: "PHF",
            accessor: "league_scoring_rates.phf",
        },
        {
            Header: "NCAA",
            accessor: "league_scoring_rates.ncaa",
        },
        {
            Header: "U Sports",
            accessor: "league_scoring_rates.usports",
        },
        {
            Header: "NCAA DIII",
            accessor: "league_scoring_rates.ncaa_diii",
        },
        {
            Header: "SDHL",
            accessor: "league_scoring_rates.sdhl",
        },
        {
            Header: "Id",
            accessor: "playerId",
            id: "id",
        },
    ];
    return <Table data={players} columns={columns} rowSelect={toggleRow} />;
}
