/**
 * EXERCICE 1 - Registre d'abonnes avec gestion des abonnements
 *
 * Contexte :
 * Vous travaillez sur la plateforme d'abonnement d'un service de streaming.
 * Vous devez implementer le module de gestion des abonnes.
 *
 * Travail demande :
 *
 * 1. ajouterAbonne(registre, abonne)
 *    Retourner un nouveau registre avec l'abonne ajoute.
 *    Generer un id unique (incrementiel ou timestamp).
 *    Verifier qu'un abonne avec le meme email n'existe pas deja (lancer une Error si doublon).
 *
 * 2. mettreAJourAbonne(registre, id, modifications)
 *    Retourner un nouveau registre avec l'abonne mis a jour.
 *    Seuls les champs fournis dans `modifications` sont modifies.
 *    Lancer une Error si l'id n'existe pas.
 *
 * 3. supprimerAbonne(registre, id)
 *    Retourner un nouveau registre sans l'abonne. Error si non trouve.
 *
 * 4. renouvelerAbonnements(registre, dateReference)
 *    Retourner un nouveau registre ou :
 *    - Les abonnements expires (dateExpiration < dateReference) sont marques statut='expire'
 *    - Les abonnements expirant dans moins de 7 jours ont un champ `alerteRenouvellement: true`
 *
 * 5. tableauDeBord(registre)
 *    Retourner :
 *    {
 *      totalAbonnes, actifs, expires, suspendu,
 *      revenuesMensuelsTotaux,   // somme des tarifs des abonnes actifs
 *      repartitionParFormule,    // { basic: N, premium: N, business: N }
 *      top3Villes                // les 3 villes avec le plus d'abonnes
 *    }
 */

let registre = [
  { id: 1, nom: 'Alami Hassan',   email: 'h.alami@email.ma',  ville: 'Casablanca', formule: 'premium', tarif: 99,  statut: 'actif',    dateExpiration: '2024-06-15' },
  { id: 2, nom: 'Benali Sara',    email: 's.benali@email.ma', ville: 'Rabat',      formule: 'basic',   tarif: 49,  statut: 'actif',    dateExpiration: '2024-12-01' },
  { id: 3, nom: 'Chraibi Omar',   email: 'o.chraibi@web.ma',  ville: 'Casablanca', formule: 'business',tarif: 199, statut: 'actif',    dateExpiration: '2024-04-01' },
  { id: 4, nom: 'Drissi Fatima',  email: 'f.drissi@web.ma',   ville: 'Fes',        formule: 'basic',   tarif: 49,  statut: 'suspendu', dateExpiration: '2024-03-20' },
  { id: 5, nom: 'Ennaji Youssef', email: 'y.ennaji@mail.ma',  ville: 'Casablanca', formule: 'premium', tarif: 99,  statut: 'actif',    dateExpiration: '2024-08-30' },
  { id: 6, nom: 'Fassi Leila',    email: 'l.fassi@mail.ma',   ville: 'Marrakech',  formule: 'premium', tarif: 99,  statut: 'actif',    dateExpiration: '2024-04-10' },
  { id: 7, nom: 'Ghazali Mehdi',  email: 'm.ghazali@pro.ma',  ville: 'Rabat',      formule: 'business',tarif: 199, statut: 'expire',   dateExpiration: '2024-02-28' },
  { id: 8, nom: 'Hamdaoui Nadia', email: 'n.hmdaoui@web.ma',  ville: 'Tanger',     formule: 'basic',   tarif: 49,  statut: 'actif',    dateExpiration: '2024-07-15' },
];

let testRegistre = [
    { id: 2, nom: "Benali Sara", email: "s.benali@email.ma", ville: "Rabat", formule: "basic", tarif: 49, statut: "actif", dateExpiration: "2024-12-01" },
    { id: 3, nom: "Chraibi Omar", email: "o.chraibi@web.ma", ville: "Casablanca", formule: "business", tarif: 199, statut: "actif", dateExpiration: "2024-04-01" },
    { id: 4, nom: "Drissi Fatima", email: "f.drissi@web.ma", ville: "Fes", formule: "basic", tarif: 49, statut: "suspendu", dateExpiration: "2024-03-20" },
    { id: 4, nom: "alerted", email: "alerted@alerted.ma", ville: "Fes", formule: "basic", tarif: 49, statut: "suspendu", dateExpiration: "2024-04-11" },
];

/**
 * 
 * @param {Array<Object>} registre 
 * @param {Object} abonne
 * @returns {Array<Object>}
 */
function ajouterAbonne(registre, abonne) {
    // TODO
    const newRegister = structuredClone(registre);
    const email = abonne.email;
    let index;
    for (index = 0; index < newRegister.length; index++) {
        if (newRegister[index].email === email) return newRegister;
    }
    abonne.id = index;
    newRegister.push(abonne);
    // console.log(registre.length)
    return newRegister;
}

/**
 * 
 * @param {Array<Object>} registre 
 * @param {Number} id 
 * @param {Object} modifications
 * @returns {Array<Object>}
 */
function mettreAJourAbonne(registre, id, modifications) {
    // TODO
    const index = registre.findIndex((subscriber) => subscriber.id == id);
    try {
        if ( index < 0)
            throw new Error("this subscribtion doesn't exist");
    } catch (e) {
        console.log(e.message);
        const newRegister = structuredClone(registre);
        return newRegister;
    }
    const newRegister = structuredClone(registre);
    for (let key in modifications) {
        if (newRegister[index][key] !== undefined) newRegister[index][key] = modifications[key];
    }
    return newRegister;
}

/**
 * 
 * @param {Array<Object>} registre 
 * @param {Number} id 
 * @returns {Array<Object>}
 */
function supprimerAbonne(registre, id) {
    // TODO
    const newRegister = registre.filter((subscriber) => subscriber.id != id);
    try {
        if (newRegister.length === registre.length) throw new Error("this subscribtion doesn't exist");
    } catch (e) {
        console.log(e.message);
    }
    return newRegister;
}

/**
 * 
 * @param {Array<Object>} registre 
 * @param {String} dateReference 
 * @returns {Array<Object>}
 */
function renouvelerAbonnements(registre, dateReference) {
    // TODO
    const newRegister = structuredClone(registre);

    return newRegister.map((subscriber) => {
        const dateExpiration = subscriber.dateExpiration;
        subscriber.alerteRenouvellement = false;

        if (dateExpiration < dateReference) subscriber.statut = "expire";
        else if (new Date(dateExpiration).getTime() - new Date(dateReference).getTime() <= 7 * 1000 * 60 * 60 * 24) subscriber.alerteRenouvellement = true;

        // console.log((new Date(dateExpiration).getTime() - new Date(dateReference).getTime())/(1000*60*60*24));

        return subscriber;
    });
}

/**
 * 
 * @param {Array<Object>} registre
 * @returns {Object} 
 */
function tableauDeBord(registre) {
    // TODO
    const holder = { totalAbonnes: registre.length, actifs: 0, expires: 0, suspendu: 0, revenuesMensuelsTotaux: 0, repartitionParFormule: { basic: 0, premium: 0, business: 0 } };
    const cities = {}
    for (let index = 0; index < holder.totalAbonnes; index++) {
        if (!cities[registre[index].ville])
            cities[registre[index].ville] = 1;
        else 
            cities[registre[index].ville]++;
        
        switch (registre[index].statut) {
            case "actif":
                holder.actifs++;
                holder.revenuesMensuelsTotaux += registre[index].tarif;
                break;
            case "expire":
                holder.expires++;
                break;
            default: holder.suspendu++;
                break;
        }

        switch (registre[index].formule) {
            case "basic":
                holder.repartitionParFormule.basic++;
                break;
            case "premium":
                holder.repartitionParFormule.premium++;
                break;
            default: holder.repartitionParFormule.business++;
                break;
        }
    }
    
    holder.top3Villes = Object.keys(Object.fromEntries(Object.entries(cities).sort(([, currValue], [, nextValue]) => nextValue - currValue).slice(0, 3)));
    /* subscriptions: 
        3
        2
        1
    */
    return holder;
}

// Tests
console.log("Ancien registre:", registre.length);
const r1 = ajouterAbonne(registre, { nom: 'Test User', email: 'test@test.ma', ville: 'Agadir', formule: 'basic', tarif: 49, statut: 'actif', dateExpiration: '2024-09-01' });
console.log('Nouveau registre:', r1.length); // 9
const r11 = ajouterAbonne(r1, { nom: 'Test User', email: 'test@test.ma', ville: 'Agadir', formule: 'basic', tarif: 49, statut: 'actif', dateExpiration: '2024-09-01' });
console.log('Nouveau registre:', r11.length); // 9

const r2 = mettreAJourAbonne(registre, 3, { formule: 'premium', tarif: 99 });
console.log('Mis a jour:', r2.find(a => a.id === 3));
const r22 = mettreAJourAbonne(registre, 10, { formule: 'premium', tarif: 99 });
const r222 = mettreAJourAbonne(registre, 1, { whatever: 'whatever', tarif: 99 });
console.log('Mis a jour:', r222.find(a => a.id === 1));

console.log("Ancien registre:", registre.length);
const r3 = supprimerAbonne(registre, 3, { formule: "premium", tarif: 99 });
console.log("Nouveau registre:", r3.length); // 8

const r4 = renouvelerAbonnements(testRegistre, "2024-04-05"); // Soufiane, this is testRegister not register Obj
console.log('Apres renouvellement:', r4.filter(a => a.alerteRenouvellement || a.statut === 'expire').map(a => { return { dateExpiration: a.dateExpiration, nom: a.nom, statut: a.statut, alerteRenouvellement: a.alerteRenouvellement } }));
// console.log(registre);

console.log('Tableau de bord:', tableauDeBord(registre));
