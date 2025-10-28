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

    rues[rueSelectionnee].maisons.forEach((maison, idx) => {
        const card = document.createElement("div");
        card.className = "house-card";
        if(maison.statut) card.classList.add(maison.statut.toLowerCase());

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

function calculerStats() {
    let totalVentes = 0, totalArgent = 0, totalRefus = 0;
    rues.forEach(rue => {
        rue.maisons.forEach(maison => {
            if(maison.statut === "Vendu") {
                totalVentes++;
                totalArgent += parseFloat(maison.montant) || 0;
            } else if(maison.statut === "Refus") {
                totalRefus++;
            }
        });
    });
    document.getElementById("total-ventes").textContent = totalVentes;
    document.getElementById("total-argent").textContent = totalArgent.toFixed(2);
    document.getElementById("total-refus").textContent = totalRefus;
}

afficherRues();
calculerStats();
