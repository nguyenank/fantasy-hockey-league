import Table from "./Table";
import Link from "next/link";

export default function MyTable({ teams }) {
    const columns = [
        {
            Header: "Rank",
            accessor: "rankings.overall",
        },
        {
            Header: "Team Name",
            accessor: "teamName", // accessor is the "key" in the data
            Cell: ({ value, row }) => {
                return (
                    <Link href={`/teams/${row.original.userId}`}>
                        <a>{value}</a>
                    </Link>
                );
            },
        },

        {
            Header: "Points",
            accessor: "points",
            Cell: ({ value }) => parseFloat(value).toFixed(2),
        },
        {
            Header: "Id",
            accessor: "userId",
            id: "id",
        },
    ];

    return <Table data={teams} columns={columns} />;
}
