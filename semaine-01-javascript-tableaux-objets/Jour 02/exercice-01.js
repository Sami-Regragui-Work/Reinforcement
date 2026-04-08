/**
 * EXERCICE 1 - Rapport de facturation mensuel
 *
 * Contexte :
 * Vous travaillez sur le module de reporting d'une plateforme SaaS.
 * Le service comptabilite a besoin d'un rapport mensuel automatique
 * genere a partir du journal des transactions.
 *
 * Travail demande :
 *
 * 1. rapportMensuel(transactions)
 *    Retourner un tableau trie par mois (format 'YYYY-MM') contenant pour chaque mois :
 *    { mois, nombreTransactions, totalHT, totalTVA, totalTTC, transactionMax }
 *    - totalTVA = totalHT * 0.20
 *    - totalTTC = totalHT + totalTVA
 *    - transactionMax : le montant le plus eleve du mois
 *
 * 2. top3Clients(transactions)
 *    Retourner les 3 clients ayant depense le plus au total (sur toute la periode).
 *    Format : [{ clientId, nom, total, nombreAchats }]
 *
 * 3. evolutionMensuelle(transactions)
 *    Retourner un tableau indiquant pour chaque mois (sauf le premier)
 *    le pourcentage d'evolution du CA vs le mois precedent.
 *    Format : [{ mois, totalHT, evolution }]
 *    evolution est un nombre arrondi a 1 decimale (ex: +12.3 ou -5.7)
 *
 * 4. detecterAnomalies(transactions)
 *    Une transaction est consideree anormale si son montant depasse
 *    2.5 fois la moyenne generale. Retourner ces transactions avec un champ
 *    `ecartMoyenne` indiquant le pourcentage de depassement (arrondi).
 */

const transactions = [
    { id: "T001", clientId: "C01", nom: "Alami SA", montant: 1200, date: "2024-01-08" },
    { id: "T002", clientId: "C02", nom: "Benali SARL", montant: 450, date: "2024-01-15" },
    { id: "T003", clientId: "C03", nom: "Chraibi Corp", montant: 8900, date: "2024-01-22" },
    { id: "T004", clientId: "C01", nom: "Alami SA", montant: 2300, date: "2024-02-05" },
    { id: "T005", clientId: "C04", nom: "Drissi SARL", montant: 670, date: "2024-02-14" },
    { id: "T006", clientId: "C02", nom: "Benali SARL", montant: 3100, date: "2024-02-20" },
    { id: "T007", clientId: "C05", nom: "El Fassi Ltd", montant: 980, date: "2024-02-28" },
    { id: "T008", clientId: "C03", nom: "Chraibi Corp", montant: 15000, date: "2024-03-03" },
    { id: "T009", clientId: "C01", nom: "Alami SA", montant: 4200, date: "2024-03-11" },
    { id: "T010", clientId: "C04", nom: "Drissi SARL", montant: 890, date: "2024-03-19" },
    { id: "T011", clientId: "C02", nom: "Benali SARL", montant: 1750, date: "2024-03-25" },
    { id: "T012", clientId: "C05", nom: "El Fassi Ltd", montant: 630, date: "2024-03-30" },
];

/**
 * @param {Array<Object>} transactions
 * @returns {Array<Object>}
 */
function rapportMensuel(transactions) {
    // TODO
    const holder = {};
    transactions.forEach((transaction) => {
        const moisValue = transaction.date.slice(0, -3);
        if (!holder[moisValue]) {
            holder[moisValue] = { mois: moisValue };
            holder[moisValue].nombreTransactions = 1;
            holder[moisValue].totalHT = transaction.montant;
            holder[moisValue].transactionMax = transaction.montant;
        } else {
            holder[moisValue].nombreTransactions++;
            holder[moisValue].totalHT += transaction.montant;
            holder[moisValue].transactionMax = Math.max(holder[moisValue].transactionMax, transaction.montant);
        }

        holder[moisValue].totalTVA = holder[moisValue].totalHT * 0.2;
        holder[moisValue].totalTTC = holder[moisValue].totalHT + holder[moisValue].totalTVA;
    });
    return Object.values(holder).sort((fr, sc) => new Date(fr.mois) - new Date(sc.mois));
}

/**
 * @param {Array<Object>} transactions
 * @returns {Array<Object>}
 */
function top3Clients(transactions) {
    // TODO
    const holder = {};
    transactions.forEach((transaction) => {
        const client = transaction.clientId;
        if (!holder[client]) {
            holder[client] = { clientId: client };
            holder[client].nom = transaction.nom;
            holder[client].total = transaction.montant;
            holder[client].nombreAchats = 1;
        } else {
            holder[client].total += transaction.montant;
            holder[client].nombreAchats += 1;
        }
    });
    return Object.values(holder)
        .sort((fr, sc) => sc.total - fr.total)
        .slice(0, 3);
}

/**
 * @param {Array<Object>} transactions
 * @returns {Array<Object>}
 */
function evolutionMensuelle(transactions) {
    // TODO
    const holder = {};
    transactions.forEach((transaction) => {
        const moisValue = transaction.date.slice(0, -3);
        if (!holder[moisValue]) {
            holder[moisValue];
            holder[moisValue] = { mois: moisValue };
            holder[moisValue].totalHT = transaction.montant;
        } else {
            holder[moisValue].totalHT += transaction.montant;
        }
    });
    const arr = Object.values(holder).sort((fr, sc) => new Date(fr.mois) - new Date(sc.mois));
    let previousTotalHT;
    arr.map((obj, index) => {
        if (index == 0) {
            obj.evolution = 0;
            previousTotalHT = obj.totalHT;
        } else {
            obj.evolution = (((obj.totalHT - previousTotalHT) / previousTotalHT) * 100).toFixed(1);
            previousTotalHT = obj.totalHT;
        }
    });
    return arr;
}

/**
 * @param {Array<Object>} transactions
 * @returns {Array<Object>}
 */
function detecterAnomalies(transactions) {
    // TODO
    const transactionsAvg = transactions.reduce((cumul, transaction) => cumul + transaction.montant, 0) / transactions.length;
    // transactions.filter((transaction) => transaction.montant > transactionsAvg * 2.5);
    console.log(transactions.reduce((cumul, transaction) => cumul + transaction.montant, 0) / transactions.length);
    const anomalies = [];
    transactions.forEach((transaction) => {
        if (transaction.montant > 2.5 * transactionsAvg) anomalies.push({ id: transaction.id, montant: transaction.montant, ecartMoyenne: Math.round(((transaction.montant - transactionsAvg) / transactionsAvg) * 100) });
    });
    return anomalies;
}

// Tests
console.log("***************************** J2-EX1 *****************************");

console.log("--- Rapport mensuel ---");
console.log(rapportMensuel(transactions));

console.log("--- Top 3 clients ---");
console.log(top3Clients(transactions));

console.log("--- Evolution mensuelle ---");
console.log(evolutionMensuelle(transactions));

console.log("--- Anomalies ---");
console.log(detecterAnomalies(transactions));
