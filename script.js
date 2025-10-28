let rues = JSON.parse(localStorage.getItem("rues")) || [];

function sauvegarder() {
    localStorage.setItem("rues", JSON.stringify(rues));
    calculerStats();
}

function afficherRues() {
    const ruesList = document.getElementById("rues-list");
    ruesList.innerHTML = "";
    rues.forEach((rue, index) => {
        const li = document.createElement("li");
        li.textContent = rue.nom;
        const btn = document.createElement("button");
        btn.textContent = "Voir Maisons";
        btn.onclick = () => afficherMaisons(index);
        li.appendChild(btn);
        ruesList.appendChild(li);
    });
}

document.getElementById("ajouter-rue").onclick = () => {
    const nomRue = document.getElementById("nouvelle-rue").value.trim();
    if(nomRue) {
        rues.push({nom: nomRue, maisons: []});
        document.getElementById("nouvelle-rue").value = "";
        sauvegarder();
        afficherRues();
    }
};

let rueSelectionnee = null;
function afficherMaisons(index) {
    rueSelectionnee = index;
    document.getElementById("rues-container").style.display = "none";
    document.getElementById("maisons-container").style.display = "block";
    document.getElementById("nom-rue").textContent = rues[index].nom;
    afficherMaisonsListe();
}

function afficherMaisonsListe() {
    const maisonsList = document.getElementById("maisons-list");
    const maisonsVenduesList = document.getElementById("maisons-vendues-list");
    maisonsList.innerHTML = "";
    maisonsVenduesList.innerHTML = "";

    rues[rueSelectionnee].maisons.forEach((maison) => {
        const card = document.createElement("div");
        card.className = "house-card";

        switch(maison.statut){
            case "Vendu": card.classList.add("vendu"); break;
            case "Refus": card.classList.add("refus"); break;
            case "À repasser": card.classList.add("repasser"); break;
            default: card.classList.add("nonfait");
        }

        const info = document.createElement("div");
        info.textContent = `Maison ${maison.numero} - Statut: ${maison.statut || "Non fait"} - Montant: ${maison.montant || 0}€ (${maison.paiement || "-"})`;

        const actions = document.createElement("div");
        const btnVendu = document.createElement("button");
        btnVendu.textContent = "Vendu";
        btnVendu.onclick = () => {
            maison.statut = "Vendu";
            maison.montant = prompt("Montant reçu (€) :", maison.montant || 0);
            maison.paiement = prompt("Mode de paiement :", maison.paiement || "espèce");
            sauvegarder();
            afficherMaisonsListe();
        };

        const btnRefus = document.createElement("button");
        btnRefus.textContent = "Refus";
        btnRefus.onclick = () => {
            maison.statut = "Refus";
            maison.montant = 0;
            maison.paiement = "-";
            sauvegarder();
            afficherMaisonsListe();
        };

        const btnRepasser = document.createElement("button");
        btnRepasser.textContent = "À repasser";
        btnRepasser.onclick = () => {
            maison.statut = "À repasser";
            maison.montant = 0;
            maison.paiement = "-";
            sauvegarder();
            afficherMaisonsListe();
        };

        actions.append(btnVendu, btnRefus, btnRepasser);
        card.append(info, actions);

        if(maison.statut === "Vendu") maisonsVenduesList.appendChild(card);
        else maisonsList.appendChild(card);
    });
}

document.getElementById("retour-rues").onclick = () => {
    document.getElementById("rues-container").style.display = "block";
    document.getElementById("maisons-container").style.display = "none";
};

document.getElementById("ajouter-maison").onclick = () => {
    const numero = document.getElementById("numero-maison").value.trim();
    if(numero) {
        rues[rueSelectionnee].maisons.push({numero: numero});
        document.getElementById("numero-maison").value = "";
        sauvegarder();
        afficherMaisonsListe();
    }
};

// Statistiques complètes
function calculerStats() {
    let totalMaisons = 0;
    let totalRestantes = 0;
    let totalVentes = 0;
    let totalArgent = 0;
    let paiementEspece = 0;
    let paiementCheque = 0;
    let totalRefus = 0;
    let totalRepasser = 0;

    rues.forEach(rue => {
        rue.maisons.forEach(maison => {
            totalMaisons++;
            switch(maison.statut){
                case "Vendu":
                    totalVentes++;
                    totalArgent += parseFloat(maison.montant) || 0;
                    if(maison.paiement === "espèce") paiementEspece++;
                    else if(maison.paiement === "chèque") paiementCheque++;
                    break;
                case "Refus":
                    totalRefus++;
                    break;
                case "À repasser":
                    totalRepasser++;
                    break;
                default:
                    totalRestantes++;
            }
        });
    });

    document.getElementById("total-maisons").textContent = totalMaisons;
    document.getElementById("maisons-restantes").textContent = totalRestantes;
    document.getElementById("total-ventes").textContent = totalVentes;
    document.getElementById("total-argent").textContent = totalArgent.toFixed(2);
    document.getElementById("paiement-espece").textContent = paiementEspece;
    document.getElementById("paiement-cheque").textContent = paiementCheque;
    document.getElementById("total-refus").textContent = totalRefus;
    document.getElementById("total-repasser").textContent = totalRepasser;
}

afficherRues();
calculerStats();
