/**
 * EXERCICE 3 - Systeme de gestion des notes etudiantes
 *
 * Contexte :
 * Vous developpez le module de calcul et d'affichage des resultats
 * d'un etablissement de formation. Les regles de calcul sont precises
 * et doivent etre implementees rigoureusement.
 *
 * Regles de l'etablissement :
 * - Chaque module a un coefficient
 * - La moyenne generale = somme(note * coeff) / somme(coeff)
 * - Mention : TB >= 16, B >= 14, AB >= 12, P >= 10, Echec < 10
 * - Rattrapage possible si 8 <= moyenne < 10
 * - Exclusion si une note de module < 5 (note eliminatoire)
 *
 * Travail demande :
 *
 * 1. calculerMoyenne(etudiant)
 *    Retourner la moyenne ponderee de l'etudiant (arrondie a 2 decimales).
 *
 * 2. determinerStatut(etudiant)
 *    Retourner { moyenne, mention, statut, modulesEliminatoires }
 *    statut : 'admis', 'rattrapage', 'exclu', 'elimine'
 *    elimine = a une note eliminatoire (< 5)
 *
 * 3. classementPromotion(etudiants)
 *    Retourner le tableau trie par moyenne decroissante avec rang.
 *
 * 4. statistiquesModule(etudiants, nomModule)
 *    Pour un module donne, retourner :
 *    { module, moyenne, min, max, tauxReussite, distribution }
 *    distribution : { '<10': N, '10-12': N, '12-14': N, '14-16': N, '>=16': N }
 *
 * 5. etudiantsARisque(etudiants)
 *    Retourner les etudiants ayant au moins 2 modules en dessous de 10.
 *    Inclure la liste de leurs modules en difficulte.
 */

const etudiants = [
    {
        id: "ETU01",
        nom: "Alami",
        prenom: "Karim",
        notes: [
            { module: "Algorithmique", note: 14, coeff: 4 },
            { module: "PHP POO", note: 12, coeff: 4 },
            { module: "JavaScript", note: 16, coeff: 3 },
            { module: "BDD SQL", note: 11, coeff: 3 },
            { module: "HTML/CSS", note: 15, coeff: 2 },
            { module: "Projet", note: 13, coeff: 4 },
        ],
    },
    {
        id: "ETU02",
        nom: "Benali",
        prenom: "Sara",
        notes: [
            { module: "Algorithmique", note: 7, coeff: 4 },
            { module: "PHP POO", note: 9, coeff: 4 },
            { module: "JavaScript", note: 11, coeff: 3 },
            { module: "BDD SQL", note: 8, coeff: 3 },
            { module: "HTML/CSS", note: 14, coeff: 2 },
            { module: "Projet", note: 10, coeff: 4 },
        ],
    },
    {
        id: "ETU03",
        nom: "Chraibi",
        prenom: "Omar",
        notes: [
            { module: "Algorithmique", note: 4, coeff: 4 },
            { module: "PHP POO", note: 15, coeff: 4 },
            { module: "JavaScript", note: 13, coeff: 3 },
            { module: "BDD SQL", note: 16, coeff: 3 },
            { module: "HTML/CSS", note: 18, coeff: 2 },
            { module: "Projet", note: 14, coeff: 4 },
        ],
    },
    {
        id: "ETU04",
        nom: "Drissi",
        prenom: "Fatima",
        notes: [
            { module: "Algorithmique", note: 17, coeff: 4 },
            { module: "PHP POO", note: 18, coeff: 4 },
            { module: "JavaScript", note: 16, coeff: 3 },
            { module: "BDD SQL", note: 19, coeff: 3 },
            { module: "HTML/CSS", note: 17, coeff: 2 },
            { module: "Projet", note: 18, coeff: 4 },
        ],
    },
    {
        id: "ETU05",
        nom: "Ennaji",
        prenom: "Youssef",
        notes: [
            { module: "Algorithmique", note: 6, coeff: 4 },
            { module: "PHP POO", note: 7, coeff: 4 },
            { module: "JavaScript", note: 9, coeff: 3 },
            { module: "BDD SQL", note: 5, coeff: 3 },
            { module: "HTML/CSS", note: 12, coeff: 2 },
            { module: "Projet", note: 8, coeff: 4 },
        ],
    },
];

/**
 *
 * @param {Object} etudiant
 * @returns {Number}
 */
function calculerMoyenne(etudiant) {
    // TODO
    return (etudiant.notes.reduce((sum, noteObj) => sum + noteObj.note * noteObj.coeff, 0) / etudiant.notes.reduce((sum, noteObj) => sum + noteObj.coeff, 0)).toFixed(2);
}

/**
 *
 * @param {Object} etudiant
 * @returns {Object}
 */
function determinerStatut(etudiant) {
    // TODO
    const statutObj = { moyenne: calculerMoyenne(etudiant) };
    switch (true) {
        case statutObj.moyenne >= 16:
            statutObj.mention = "TB";
            break;
        case statutObj.moyenne >= 14:
            statutObj.mention = "B";
            break;
        case statutObj.moyenne >= 12:
            statutObj.mention = "AB";
            break;
        case statutObj.moyenne >= 10:
            statutObj.mention = "P";
            break;
        default:
            statutObj.mention = "Echec";
            switch (true) {
                case statutObj.moyenne >= 8:
                    statutObj.statut = "rattrapage";
                    break;
                case statutObj.moyenne >= 5:
                    statutObj.statut = "exclu";
                    break;
                default:
                    statutObj.statut = "elimine";
                    break;
            }
            break;
    }
    if (statutObj.mention != "Echec") statutObj.statut = "admis";

    statutObj.modulesEliminatoires = etudiant.notes.filter((noteObj) => noteObj.note < 10);

    return statutObj;
}

/**
 *
 * @param {Array<Object>} etudiants
 * @returns {Array<Object>}
 */
function classementPromotion(etudiants) {
    // TODO
    const ranksArr = [];
    etudiants.forEach((etudiant) => ranksArr.push({ nom: etudiant.prenom + " " + etudiant.nom, moyenne: calculerMoyenne(etudiant), mention: determinerStatut(etudiant).mention }));
    ranksArr.sort((currRank, nextRank) => nextRank.moyenne - currRank.moyenne);
    ranksArr.map((rankObj, index) => {
        rankObj.rang = index + 1;
        return rankObj;
    });
    return ranksArr;
}

/**
 *
 * @param {Array<Object>} etudiants
 * @param {String} nomModule
 * @returns {Object}
 */
function statistiquesModule(etudiants, nomModule) {
    // TODO
    const moduleArr = etudiants.map((etudiant) => etudiant.notes.find((noteObj) => noteObj.module == nomModule));
    const moduleObj = { module: moduleArr[0].module };
    moduleObj.moyenne = calculerMoyenne({ notes: moduleArr });
    const notes = moduleArr.map((moduleObj) => moduleObj.note);
    moduleObj.min = Math.min(...notes);
    moduleObj.max = Math.max(...notes);
    moduleObj.tauxReussite = (moduleArr.filter((moduleObj) => moduleObj.note >= 10).length / moduleArr.length).toFixed(4) * 100 + "%";
    moduleObj.distribution = { "<10": 0, "10-12": 0, "12-14": 0, "14-16": 0, ">=16": 0 };
    moduleArr.forEach((moduleCurr) => {
        switch (true) {
            case moduleCurr.note < 10:
                moduleObj.distribution["<10"]++;
                break;
            case moduleCurr.note < 12:
                moduleObj.distribution["10-12"]++;
                break;
            case moduleCurr.note < 14:
                moduleObj.distribution["12-14"]++;
                break;
            case moduleCurr.note < 16:
                moduleObj.distribution["14-16"]++;
                break;
            default:
                moduleObj.distribution[">=16"]++;
                break;
        }
    });
    return moduleObj;
}

/**
 *
 * @param {Array<Object>} etudiants
 * @returns {Object}
 */
function etudiantsARisque(etudiants) {
    // TODO
    return etudiants.map((etudiant) => {
        let copy = structuredClone(etudiant)
        let res = copy.notes.filter((noteObj) => noteObj.note < 10);

        if (res.length >= 2) {
            copy.notes = res;
            return copy;
        }
    }).filter(Boolean);
}

// Tests

console.log("***************************** J3-EX3 *****************************");

console.log("Moyenne ETU02:", calculerMoyenne(etudiants[1]));
console.log("Statut ETU02:", determinerStatut(etudiants[2]));
console.log("Statut ETU03 (eliminatoire):", determinerStatut(etudiants[4]));
console.log("Classement:");
classementPromotion(etudiants).forEach((e) => console.log(e.rang, e.nom, e.moyenne, e.mention));
console.log("Stats PHP POO:", statistiquesModule(etudiants, "PHP POO"));
console.log(
    "A risque:",
    etudiantsARisque(etudiants).map((e) => e.nom),
);

console.log("Risque (detailles completes): ", etudiantsARisque(etudiants));
