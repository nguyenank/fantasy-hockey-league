import Table from "./Table";
import Link from "next/link";
import { default as _ } from "lodash";
import { useMemo } from "react";

export default function PlayerPoolTable(props) {
    const players = useMemo(
        () => _.map(props.players, (p) => ({ ...p, rowId: p.playerId })),
        [props.players]
    );
    const toggleRow = useMemo(() => props.toggleRow, [props.toggleRow]);
    const selectedRowIds = useMemo(() => props.selectedRowIds, [
        props.selectedRowIds,
    ]);
    const columns = [
        {
            id: "selection",
            Header: ({ getToggleAllRowsSelectedProps }) => <div></div>,
            Cell: ({ row }) => (
                <div>
                    <input
                        type="checkbox"
                        {...row.getToggleRowSelectedProps()}
                        indeterminate="false"
                    />
                </div>
            ),
            canSort: true,
            sortType: (rowA, rowB) => {
                if (rowA.isSelected === rowB.isSelected) {
                    return 0;
                } else if (rowA.isSelected) {
                    return -1;
                } else {
                    return 1;
                }
            },
        },
        {
            Header: "Player Name",
            accessor: "name", // accessor is the "key" in the data
            Cell: ({ value, row }) => {
                return (
                    <div className={row.original.not_playing ? "crossed" : ""}>
                        {value}
                    </div>
                );
                // return (
                //     <Link href={`/players/${row.original.playerId}`}>
                //         <a
                //             className={
                //                 row.original.not_playing ? "crossed" : ""
                //             }
                //         >
                //             {value}
                //         </a>
                //     </Link>
                // );
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
    return (
        <Table
            data={players}
            columns={columns}
            rowSelect={toggleRow}
            selectedRowIds={selectedRowIds}
        />
    );
}
