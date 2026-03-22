/**
 * EXERCICE 3 - Systeme de tournoi et classement
 *
 * Contexte :
 * Vous developpez le module de gestion des resultats d'une ligue de football
 * regionale. Le systeme doit calculer automatiquement les classements selon
 * les regles officielles.
 *
 * Regles de calcul :
 * - Victoire : 3 points
 * - Match nul : 1 point
 * - Defaite : 0 points
 * - Egalite de points : departager par difference de buts, puis buts marques,
 *   puis confrontation directe, puis ordre alphabetique
 *
 * Travail demande :
 *
 * 1. calculerClassement(matchs)
 *    A partir du tableau de matchs joues, retourner le classement complet.
 *    Chaque entree du classement contient :
 *    { rang, equipe, joues, victoires, nuls, defaites, bpour, bcontre, diff, points }
 *
 * 2. meilleureAttaque(classement)
 *    Retourner l'equipe ayant marque le plus de buts (objet complet du classement).
 *
 * 3. meilleureDefense(classement)
 *    Retourner l'equipe ayant encaisse le moins de buts.
 *
 * 4. serieInvaincue(matchs, equipe)
 *    Retourner le nombre de matchs consecutifs sans defaite (en partant du match le plus recent).
 */

const matchs = [
    { journee: 1, domicile: "FUS Rabat", bDomicile: 2, bExterieur: 1, exterieur: "WAC" },
    { journee: 1, domicile: "Raja", bDomicile: 1, bExterieur: 1, exterieur: "MAS" },
    { journee: 1, domicile: "FAR", bDomicile: 3, bExterieur: 0, exterieur: "HUSA" },
    { journee: 2, domicile: "WAC", bDomicile: 2, bExterieur: 2, exterieur: "Raja" },
    { journee: 2, domicile: "MAS", bDomicile: 1, bExterieur: 0, exterieur: "FAR" },
    { journee: 2, domicile: "HUSA", bDomicile: 1, bExterieur: 3, exterieur: "FUS Rabat" },
    { journee: 3, domicile: "Raja", bDomicile: 2, bExterieur: 0, exterieur: "FAR" },
    { journee: 3, domicile: "FUS Rabat", bDomicile: 1, bExterieur: 1, exterieur: "MAS" },
    { journee: 3, domicile: "WAC", bDomicile: 4, bExterieur: 1, exterieur: "HUSA" },
    { journee: 4, domicile: "FAR", bDomicile: 2, bExterieur: 2, exterieur: "WAC" },
    { journee: 4, domicile: "MAS", bDomicile: 0, bExterieur: 1, exterieur: "FUS Rabat" },
    { journee: 4, domicile: "HUSA", bDomicile: 2, bExterieur: 3, exterieur: "Raja" },
];

/**
 * @param {Array<Object>} matchs
 * @returns {Array<Object>}
 */
function calculerClassement(matchs) {
    // TODO
    const holder = {};
    const confrontationsScores = {};
    let rank = 1;
    matchs.forEach((match) => {
        let domicileValue = match.domicile;
        let exterieurValue = match.exterieur;

        if (!holder[domicileValue]) {
            holder[domicileValue] = { equipe: domicileValue };
            holder[domicileValue].joues = 1;
            holder[domicileValue].bpour = match.bDomicile;
            holder[domicileValue].bcontre = match.bExterieur;
            holder[domicileValue].victoires = Number(match.bDomicile > match.bExterieur);
            holder[domicileValue].defaites = Number(match.bDomicile < match.bExterieur);
            holder[domicileValue].nuls = Number(match.bDomicile == match.bExterieur);
            holder[domicileValue].points = Number(match.bDomicile > match.bExterieur) * 3 + Number(match.bDomicile == match.bExterieur);
        } else {
            holder[domicileValue].joues += 1;
            holder[domicileValue].bpour += match.bDomicile;
            holder[domicileValue].bcontre += match.bExterieur;
            holder[domicileValue].victoires += Number(match.bDomicile > match.bExterieur);
            holder[domicileValue].defaites += Number(match.bDomicile < match.bExterieur);
            holder[domicileValue].nuls += Number(match.bDomicile == match.bExterieur);
            holder[domicileValue].points += Number(match.bDomicile > match.bExterieur) * 3 + Number(match.bDomicile == match.bExterieur);
        }
        holder[domicileValue].diff = holder[domicileValue].bpour - holder[domicileValue].bcontre;

        if (!holder[exterieurValue]) {
            holder[exterieurValue] = { equipe: exterieurValue };
            holder[exterieurValue].joues = 1;
            holder[exterieurValue].bpour = match.bExterieur;
            holder[exterieurValue].bcontre = match.bDomicile;
            holder[exterieurValue].victoires = Number(match.bDomicile < match.bExterieur);
            holder[exterieurValue].defaites = Number(match.bDomicile > match.bExterieur);
            holder[exterieurValue].nuls = Number(match.bDomicile == match.bExterieur);
            holder[exterieurValue].points = Number(match.bDomicile < match.bExterieur) * 3 + Number(match.bDomicile == match.bExterieur);
        } else {
            holder[exterieurValue].joues += 1;
            holder[exterieurValue].bpour += match.bExterieur;
            holder[exterieurValue].bcontre += match.bDomicile;
            holder[exterieurValue].victoires += Number(match.bDomicile < match.bExterieur);
            holder[exterieurValue].defaites += Number(match.bDomicile > match.bExterieur);
            holder[exterieurValue].nuls += Number(match.bDomicile == match.bExterieur);
            holder[exterieurValue].points += Number(match.bDomicile < match.bExterieur) * 3 + Number(match.bDomicile == match.bExterieur);
        }
        holder[exterieurValue].diff = holder[exterieurValue].bpour - holder[exterieurValue].bcontre;

        let [team1, team2] = [domicileValue, exterieurValue].sort();
        confrontationsScores[domicileValue] = match.bDomicile;
        confrontationsScores[exterieurValue] = match.bExterieur;
        if (!confrontationsScores[[team1, team2]]) {
            confrontationsScores[[team1, team2]] = confrontationsScores[team1] - confrontationsScores[team2];
        } else {
            confrontationsScores[[team1, team2]] += confrontationsScores[team1] - confrontationsScores[team2];
        }
    });

    return Object.values(holder)
        .sort((currTeam, nextTeam) => {
            if (currTeam.points == nextTeam.points) {
                if (currTeam.diff == nextTeam.diff) {
                    if (currTeam.bpour == nextTeam.bpour) {
                        let confrontation = [currTeam.equipe, nextTeam.equipe].sort();
                        if (confrontationsScores[confrontation] == 0) {
                            return nextTeam.equipe - currTeam.equipe;
                        }
                        return confrontation[1] == currTeam.equipe ? confrontationsScores[confrontation] : -confrontationsScores[confrontation];
                    }
                    return nextTeam.bpour - currTeam.bpour;
                }
                return nextTeam.diff - currTeam.diff;
            }
            return nextTeam.points - currTeam.points;
        })
        .map((team) => ({ rang: rank++, ...team }));
}

/**
 * @param {Array<Object>} classement
 * @returns {Object}
 */
function meilleureAttaque(classement) {
    // TODO
    // return classement.find((team) => team.bpour == Math.max(...classement.map((team) => team.bpour)));
    /**
     * I can do it that way,
     * but I didn't like the fact that I used 3 loops
     * to achieve such a simple goal, hence:
     */

    let best = classement[0];
    for (let team of classement) if (team.bpour > best.bpour) best = team;
    return best;
}

/**
 * @param {Array<Object>} classement
 * @returns {Object}
 */
function meilleureDefense(classement) {
    // TODO
    let best = classement[0];
    for (let team of classement) if (team.bcontre < best.bcontre) best = team;
    return best;
}

/**
 * @param {Array<Object>} matchs
 * @param {String} equipe
 * @returns {Number}
 */
function serieInvaincue(matchs, equipe) {
    // TODO
    const equipeMatchs = matchs.filter((match) => [match.domicile, match.exterieur].includes(equipe)).sort((currMatch, nextMatch) => nextMatch.journee - currMatch.journee);
    let streak = 0;
    for (let match of equipeMatchs)
        if (match.domicile == equipe) {
            if (match.bDomicile < match.bExterieur) return streak;
            streak++;
        } else {
            if (match.bExterieur < match.bDomicile) return streak;
            streak++;
        }
    return streak;
}

const classement = calculerClassement(matchs);
console.log("--- Classement ---");
classement.forEach((e) => console.log(`${e.rang}. ${e.equipe.padEnd(12)} | J:${e.joues} V:${e.victoires} N:${e.nuls} D:${e.defaites} | ${e.bpour}:${e.bcontre} (${e.diff > 0 ? "+" : ""}${e.diff}) | ${e.points} pts`));
console.log("Meilleure attaque:", meilleureAttaque(classement).equipe);
console.log("Meilleure defense:", meilleureDefense(classement).equipe);
console.log("Serie WAC:", serieInvaincue(matchs, "WAC"));
