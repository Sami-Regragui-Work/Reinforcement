/**
 * EXERCICE 2 - Simulation de transactions bancaires
 *
 * Contexte :
 * Vous developpez le module de traitement des transactions d'une fintech.
 * Chaque compte a un solde et un historique de transactions. Vous devez
 * implementer le moteur de traitement et les controles associes.
 *
 * Regles metier :
 * - Un retrait est refuse si solde - montant < decouvertAutorise
 * - Frais de retrait : 0.5% si compte type 'courant', 0 si 'epargne'
 * - Frais mensuels : 25 DH si solde moyen du mois < 1000 DH (compte courant uniquement)
 * - Virement entre comptes : atomique (les deux operations reussissent ou aucune)
 *
 * Travail demande :
 *
 * 1. traiterTransaction(comptes, transaction)
 *    Retourner un nouvel etat des comptes apres traitement de la transaction.
 *    transaction = { type: 'depot'|'retrait'|'virement', compteId, montant, compteDestId? }
 *    Retourner { succes: false, erreur: '...' } si la transaction echoue.
 *    Retourner { succes: true, comptes: [...] } si elle reussit.
 *
 * 2. appliquerFraisMensuels(comptes, mois)
 *    mois au format 'YYYY-MM'.
 *    Calculer la moyenne du solde sur le mois pour chaque compte courant,
 *    puis deduire les frais si applicable.
 *    Retourner le nouvel etat des comptes.
 *
 * 3. releveCompte(compte)
 *    Retourner un objet releve avec :
 *    { solde, totalDebits, totalCredits, nombreOperations, derniereOperation }
 *
 * 4. detecterSuspects(comptes)
 *    Retourner les transactions suspects : montant > 3x la moyenne des transactions du compte.
 *    Format : [{ compteId, transaction, ecartMoyenne }]
 */

const comptes = [
    {
        id: "CPT001",
        titulaire: "Alami Hassan",
        type: "courant",
        solde: 5200,
        decouvertAutorise: -1000,
        transactions: [
            { id: "TR001", type: "depot", montant: 5000, date: "2024-03-01", soldeApres: 5000 },
            { id: "TR002", type: "retrait", montant: 800, date: "2024-03-05", soldeApres: 4200 },
            { id: "TR003", type: "depot", montant: 2500, date: "2024-03-15", soldeApres: 6700 },
            { id: "TR004", type: "retrait", montant: 1500, date: "2024-03-22", soldeApres: 5200 },
        ],
    },
    {
        id: "CPT002",
        titulaire: "Benali Sara",
        type: "epargne",
        solde: 18500,
        decouvertAutorise: 0,
        transactions: [
            { id: "TR005", type: "depot", montant: 20000, date: "2024-01-10", soldeApres: 20000 },
            { id: "TR006", type: "retrait", montant: 1500, date: "2024-02-20", soldeApres: 18500 },
        ],
    },
    {
        id: "CPT003",
        titulaire: "Chraibi Omar",
        type: "courant",
        solde: 350,
        decouvertAutorise: -500,
        transactions: [
            { id: "TR007", type: "depot", montant: 1200, date: "2024-03-02", soldeApres: 1200 },
            { id: "TR008", type: "retrait", montant: 850, date: "2024-03-10", soldeApres: 350 },
        ],
    },
];

const tests = [
    {
        id: "CPT001",
        titulaire: "Alami Hassan",
        type: "courant",
        solde: -2300,
        decouvertAutorise: -6500,
        transactions: [
            { id: "TR001", type: "depot", montant: 100, date: "2024-03-01", soldeApres: 100 },
            { id: "TR002", type: "retrait", montant: 100, date: "2024-03-05", soldeApres: 0 },
            { id: "TR003", type: "depot", montant: 2500, date: "2024-03-15", soldeApres: 2500 },
            { id: "TR004", type: "retrait", montant: 9000, date: "2024-03-22", soldeApres: -6500 },
        ],
    },
    {
        id: "CPT002",
        titulaire: "Benali Sara",
        type: "epargne",
        solde: 60200,
        decouvertAutorise: 0,
        transactions: [
            { id: "TR005", type: "depot", montant: 60300, date: "2024-01-10", soldeApres: 60300 },
            { id: "TR006", type: "retrait", montant: 100, date: "2024-02-20", soldeApres: 60200 },
        ],
    },
    {
        id: "CPT003",
        titulaire: "Chraibi Omar",
        type: "courant",
        solde: 350,
        decouvertAutorise: -500,
        transactions: [
            { id: "TR007", type: "depot", montant: 1200, date: "2024-03-02", soldeApres: 1200 },
            { id: "TR008", type: "retrait", montant: 850, date: "2024-03-10", soldeApres: 350 },
        ],
    },
];

/**
 *
 * @param {Array<Object>} comptes
 * @param {Object} transaction
 * @returns {Object}
 */
function traiterTransaction(comptes, transaction) {
    // TODO
    const newComptes = structuredClone(comptes);
    const sender = newComptes.find((compte) => transaction.compteId == compte.id);
    let receiver = null;
    const transactionResult = sender.solde - transaction.montant;
    const transactionResultFee = transactionResult - transaction.montant * 0.005;

    if (!sender)
        try {
            throw Error("Transaction failed");
        } catch (e) {
            console.log(e.message);
            return { succes: false, erreur: e.message + ": User Who Initiates This Transaction Does Not Exist" };
        }

    if ((sender.type == "courant" && transactionResultFee < sender.decouvertAutorise) || (sender.type != "courant" && transactionResult < sender.decouvertAutorise))
        try {
            throw Error("Transaction failed");
        } catch (e) {
            console.log(e.message);
            return { succes: false, erreur: e.message + ": Insufficient Funds" };
        }

    if (transaction.type == "virement") {
        receiver = newComptes.find((compte) => transaction.compteDestId == compte.id);
        if (!receiver)
            try {
                throw Error("Transaction failed");
            } catch (e) {
                console.log(e.message);
                return { succes: false, erreur: e.message + ": Receiver Not found" };
            }
    }

    if (sender.type == "courant") {
        if (transaction.type == "depot") sender.solde += transaction.montant;
        else sender.solde = transactionResultFee;
    } else {
        sender.solde = transactionResult;
    }

    if (receiver) {
        receiver.solde += transaction.montant;
        return { succes: true, comptes: [sender, receiver] };
    }

    return { succes: true, comptes: [sender] };
}

/**
 *
 * @param {Array<Object>} comptes
 * @param {string} mois
 * @returns {Array<Object>}
 */
function appliquerFraisMensuels(comptes, mois) {
    // TODO
    const copyComptes = structuredClone(comptes);
    for (let i = 0; i < comptes.length; i++) {
        const compte = copyComptes[i];
        if (compte.type != "courant") continue;
        let avg = 0;
        let counter = 0;
        for (let j = 0; j < compte.transactions.length; j++) {
            const transaction = compte.transactions[j];
            if (transaction.date.slice(0, 7) == mois) {
                avg += transaction.montant;
                counter++;
            }
        }
        if (avg) avg /= counter;
        if (avg > 1000) compte.solde -= 25;
        // console.log(avg, ' ', compte);
    }
    return copyComptes;
}

/**
 *
 * @param {Object} compte
 * @returns {Object}
 */
function releveCompte(compte) {
    // TODO
    const holder = { solde: compte.solde, totalDebits: 0, totalCredits: 0, nombreOperations: 0, derniereOperation: compte.transactions[0] };

    for (let i = 0; i < compte.transactions.length; i++) {
        const transaction = compte.transactions[i];
        if (transaction.type == "retrait") holder.totalDebits++;
        else /*if (transaction.type == "depot")*/ holder.totalCredits++;

        holder.nombreOperations++;

        try {
            if (compte.transactions[i + 1].date >= transaction.date) holder.derniereOperation = compte.transactions[i + 1];
        } catch (e) {
            break;
        }
    }

    return holder;
}

/**
 * [
  {
    id: 'CPT001', 
    titulaire: 'Alami Hassan',  
    type: 'courant', 
    solde: 5200,
    decouvertAutorise: -1000,
    transactions: [
      { id: 'TR001', 
       type: 'depot',   
       montant: 5000, 
       date: '2024-03-01', 
       soldeApres: 5000 },
    ]
  },]
 *  * Regles metier :
 * - Un retrait est refuse si solde - montant < decouvertAutorise
 * - Frais de retrait : 0.5% si compte type 'courant', 0 si 'epargne'
 * - Frais mensuels : 25 DH si solde moyen du mois < 1000 DH (compte courant uniquement)
 * - Virement entre comptes : atomique (les deux operations reussissent ou aucune)
 * 
 *  * 4. detecterSuspects(comptes)
 *    Retourner les transactions suspects : montant > 3x la moyenne des transactions du compte.
 *    Format : [{ compteId, transaction, ecartMoyenne }]
 */
/**
 *
 * @param {Array<Object>} comptes
 * @returns {Array<Object>}
 */
function detecterSuspects(comptes) {
    // TODO
    const suspectAccounts = [];
    for (let i = 0; i < comptes.length; i++) {
        const suspectTransactions = [];

        const compte = comptes[i];
        const transactions = compte.transactions;
        const avg = transactions.reduce((sum, transaction) => sum + transaction.montant, 0) / transactions.length;
        const avg3 = 3 * avg;

        console.log(avg3);
        suspectTransactions.push(...transactions.filter((transaction) => transaction.montant > avg3));

        if (suspectTransactions.length) {
            suspectAccounts.push({ compteId: compte.id, transactions: suspectTransactions, ecartMoyenne: avg });
        }
    }

    return suspectAccounts;
}

// Tests
const result = traiterTransaction(comptes, { type: "virement", compteId: "CPT001", compteDestId: "CPT003", montant: 500 });
console.log("Virement:", result.succes);

const resultEchec = traiterTransaction(comptes, { type: "retrait", compteId: "CPT003", montant: 1000 });
console.log("Retrait refuse:", resultEchec);

const newComptes = appliquerFraisMensuels(comptes, "2024-03");
console.log(
    "Old comptes states:",
    comptes.map((compte) => compte.solde),
);
console.log(
    "New comptes states:",
    newComptes.map((compte) => compte.solde),
);

console.log("Releve CPT001:", releveCompte(comptes[0]));
console.log("Transactions suspectes:", detecterSuspects(tests)); // tests not comptes, O Soufiane
