import { useTable, useSortBy, useRowSelect } from "react-table";
import { useRef, useMemo, Component } from "react";
import styles from "./styles/Table.module.scss";

export default function Table(props) {
    console.log("rerender table");
    const data = useMemo(() => props.data, [props.data]);
    const columns = useMemo(() => props.columns, [props.columns]);
    let tableArguments = [
        {
            columns,
            data,
            initialState: { hiddenColumns: ["id", "not_playing"] },
        },
        useSortBy,
    ];
    if (props.rowSelect) {
        tableArguments = [
            {
                columns,
                data,
                initialState: {
                    hiddenColumns: ["id", "not_playing"],
                    selectedRowIds: props.selectedRowIds,
                },
                autoResetSelectedRows: false,
            },
            useSortBy,
            useRowSelect,
        ];
    }

    const tableInstance = useTable(...tableArguments);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance;
    return (
        <div className={styles.overflow}>
            <div className={styles.multiselect_text}>
                Hold <span className={styles.shift}>Shift</span> to sort by
                multiple columns at once.
            </div>
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
                                    headerGroup.headers.map((column) => {
                                        const staticHeader =
                                            column.render("Header") === "#";
                                        // const staticHeader =
                                        //     column.render("Header") === "#" ||
                                        //     column.id === "selection";

                                        // Apply the header cell props
                                        return (
                                            <th
                                                className={
                                                    staticHeader
                                                        ? styles.noHover
                                                        : undefined
                                                }
                                                key={column.render("Header")}
                                                {...column.getHeaderProps(
                                                    staticHeader
                                                        ? undefined
                                                        : column.getSortByToggleProps()
                                                )}
                                            >
                                                {
                                                    // Cell the header
                                                    column.render("Header")
                                                }

                                                {staticHeader ? (
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
                                        );
                                    })
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
                                    id={row.original.playerId}
                                    {...row.getRowProps()}
                                    className={
                                        row.original.not_playing
                                            ? styles.strikeout
                                            : !props.rowSelect
                                            ? ""
                                            : row.isSelected
                                            ? styles.selected
                                            : styles.unselected
                                    }
                                    onClick={
                                        props.rowSelect
                                            ? () => {
                                                  row.toggleRowSelected();
                                                  props.rowSelect(
                                                      row.original.playerId
                                                  );
                                              }
                                            : undefined
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
                                                            "points" ||
                                                        cell.column.id ===
                                                            "fantasy_value"
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
