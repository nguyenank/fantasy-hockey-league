import styles from "./styles/IndividualTable.module.scss";
import { default as _ } from "lodash";

export default function Table({ data, position }) {
    const statMap = {
        skater: [
            ["ppg", "Points per Game"],
            ["gp", "Games Played"],
            ["sog", "Shots on Goal"],
            ["g", "Goals"],
            ["a1", "Primary Assists"],
            ["a2", "Secondary Assists"],
            ["pim", "Penalty Minutes"],
            ["pend", "Penalties Drawn"],
            ["bks", "Blocks"],
            ["hattys", "Hat Tricks"],
        ],
        goalie: [
            ["ppg", "Points per Game"],
            ["gp", "Games Played"],
            ["start", "Starts"],
            ["w", "Wins"],
            ["svs", "Saves"],
            ["ga", "Goals Against"],
            ["so", "Shutouts"],
            ["a1", "Primary Assists"],
            ["a2", "Secondary Assists"],
            ["ps_sv", "Penalty Shots Saved"],
        ],
    };
    return (
        <table className={styles.tablestyle}>
            <tbody>
                {_.map(statMap[position], ([accessor, name]) => (
                    <tr key={accessor}>
                        <th>{name}</th>
                        <td
                            className={
                                accessor === "points" ? styles.bold : undefined
                            }
                        >
                            {accessor === "ppg"
                                ? data[accessor].toFixed(2)
                                : data[accessor]}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
