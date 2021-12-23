import styles from "./styles/ModifyTeamStatus.module.scss";
import { default as _ } from "lodash";

export default function ModifyTeamStatus({ selectedPlayers }) {
    const posCounts =
        selectedPlayers.length === 0
            ? { F: 0, D: 0, G: 0 }
            : _.countBy(selectedPlayers, "position");
    const teamCount = _.uniqBy(selectedPlayers, "team").length;
    const fantasyValue = _.sumBy(selectedPlayers, "fantasy_value");
    const spans = [
        {
            key: "forwards",
            goodCond: posCounts.F === 6,
            text: `Forwards: ${posCounts.F ? posCounts.F : 0}/6`,
        },
        {
            key: "defenders",
            goodCond: posCounts.D === 4,
            text: `Defenders: ${posCounts.D ? posCounts.D : 0}/4`,
        },
        {
            key: "goalies",
            goodCond: posCounts.G === 2,
            text: `Goalies: ${posCounts.G ? posCounts.G : 0}/2`,
        },
        {
            key: "teams",
            goodCond: teamCount >= 3,
            text: `PHF Teams: ${teamCount}/3`,
        },
        {
            key: "fantasy_value",
            goodCond: fantasyValue <= 1000,
            text: `Fantasy Value: ${fantasyValue}/1000`,
        },
    ];
    return (
        <div className={styles.status}>
            <div>
                {spans.map((s) => (
                    <StatusSpan {...s} />
                ))}
            </div>
            {_.reduce(
                spans,
                (result, span) => result && span.goodCond,
                true
            ) && (
                <span className={styles.submit}>
                    <a>Submit Team</a>
                </span>
            )}
        </div>
    );
}

function StatusSpan({ goodCond, text }) {
    return <span className={goodCond ? styles.good : styles.bad}>{text}</span>;
}
