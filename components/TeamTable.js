import Table from "./Table";

export default function MyTable({ teams }) {
    const columns = [
        {
            Header: "#",
            accessor: "index",
        },
        {
            Header: "Team Name",
            accessor: "teamName", // accessor is the "key" in the data
        },
        {
            Header: "Points",
            accessor: "points",
        },
    ];

    return <Table data={teams} columns={columns} />;
}
