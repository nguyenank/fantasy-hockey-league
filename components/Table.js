import { useTable, useSortBy } from "react-table";
import { useMemo } from "react";
import styles from "./styles/Table.module.scss";

export default function MyTable(props) {
    const data = useMemo(() => props.data, [props.data]);
    const columns = useMemo(() => props.columns, [props.columns]);
    const tableInstance = useTable(
        {
            columns,
            data,
            initialState: { hiddenColumns: ["id", "not_playing"] },
        },
        useSortBy
    );
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance;

    return (
        <div className={styles.overflow}>
            <table {...getTableProps()} className={styles.tablestyle}>
                <thead>
                    {
                        // Loop over the header rows
                        headerGroups.map((headerGroup) => (
                            // Apply the header row props
                            <tr
                                key={"header"}
                                {...headerGroup.getHeaderGroupProps()}
                            >
                                {
                                    // Loop over the headers in each row
                                    headerGroup.headers.map((column) => (
                                        // Apply the header cell props
                                        <th
                                            className={
                                                column.render("Header") === "#"
                                                    ? styles.noHover
                                                    : undefined
                                            }
                                            key={column.render("Header")}
                                            {...column.getHeaderProps(
                                                column.render("Header") !== "#"
                                                    ? column.getSortByToggleProps()
                                                    : undefined
                                            )}
                                        >
                                            {
                                                // Cell the header
                                                column.render("Header")
                                            }

                                            {column.render("Header") === "#" ? (
                                                ""
                                            ) : column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <span
                                                        className={
                                                            styles.isSorted
                                                        }
                                                    >
                                                        {" ▼"}
                                                    </span>
                                                ) : (
                                                    <span
                                                        className={
                                                            styles.isSortedDesc
                                                        }
                                                    >
                                                        {" ▲"}
                                                    </span>
                                                )
                                            ) : (
                                                <span
                                                    className={
                                                        styles.isNotSorted
                                                    }
                                                >
                                                    {" ▽"}
                                                </span>
                                            )}
                                        </th>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </thead>
                <tbody {...getTableBodyProps()}>
                    {
                        // Loop over the table rows
                        rows.map((row, index) => {
                            // Prepare the row for display
                            prepareRow(row);
                            return (
                                // Apply the row props
                                <tr
                                    key={index}
                                    {...row.getRowProps()}
                                    className={
                                        row.original.not_playing
                                            ? styles.strikeout
                                            : ""
                                    }
                                >
                                    {
                                        // Loop over the rows cells
                                        row.cells.map((cell) => {
                                            // Apply the cell props
                                            return (
                                                <td
                                                    className={
                                                        cell.column.id ===
                                                        "points"
                                                            ? styles.boldish
                                                            : undefined
                                                    }
                                                    key={cell.render("Cell")}
                                                    {...cell.getCellProps()}
                                                >
                                                    {
                                                        // Cell the cell contents
                                                        cell.render("Cell")
                                                    }
                                                </td>
                                            );
                                        })
                                    }
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}
