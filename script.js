// Données sauvegardées localement
let rues = JSON.parse(localStorage.getItem("rues")) || [];

function sauvegarder() {
    localStorage.setItem("rues", JSON.stringify(rues));
    calculerStats();
}

// Affichage des rues
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

// Ajouter une rue
document.getElementById("ajouter-rue").onclick = () => {
    const nomRue = document.getElementById("nouvelle-rue").value.trim();
    if (nomRue) {
        rues.push({ nom: nomRue, maisons: [] });
        document.getElementById("nouvelle-rue").value = "";
        sauvegarder();
        afficherRues();
    }
};

// Afficher maisons d’une rue
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
    maisonsList.innerHTML = "";

    const maisonsVendues = document.createElement("ul");
    const maisonsRestantes = document.createElement("ul");

    rues[rueSelectionnee].maisons.forEach((maison, idx) => {
        const li = document.createElement("li");

        li.className = "";
        if (maison.statut === "Vendu") li.classList.add("vendu");
        else if (maison.statut === "Refus") li.classList.add("refus");
        else if (maison.statut === "À revoir") li.classList.add("repasser");
        else if (maison.statut === "Non vu") li.classList.add("nonvu");

        li.textContent = `Maison ${maison.numero} - ${maison.statut || "Non fait"} - ${maison.montant || 0}€ (${maison.paiement || "-"})`;

        // Boutons d’action
        const actions = document.createElement("div");

        const btnVendu = document.createElement("button");
        btnVendu.textContent = "Vendu";
        btnVendu.onclick = () => {
            maison.statut = "Vendu";
            maison.montant = prompt("Montant reçu (€) :", maison.montant || 0);
            maison.paiement = prompt("Mode de paiement (espèce/chèque) :", maison.paiement || "espèce");
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

        const btnRevoir = document.createElement("button");
        btnRevoir.textContent = "À revoir";
        btnRevoir.onclick = () => {
            maison.statut = "À revoir";
            maison.montant = 0;
            maison.paiement = "-";
            sauvegarder();
            afficherMaisonsListe();
        };

        const btnNonVu = document.createElement("button");
        btnNonVu.textContent = "Non vu";
        btnNonVu.onclick = () => {
            maison.statut = "Non vu";
            maison.montant = 0;
            maison.paiement = "-";
            sauvegarder();
            afficherMaisonsListe();
        };

        const btnSuppr = document.createElement("button");
        btnSuppr.textContent = "🗑️";
        btnSuppr.onclick = () => {
            if (confirm("Supprimer cette maison ?")) {
                rues[rueSelectionnee].maisons.splice(idx, 1);
                sauvegarder();
                afficherMaisonsListe();
            }
        };

        actions.append(btnVendu, btnRefus, btnRevoir, btnNonVu, btnSuppr);
        li.appendChild(actions);

        // Séparation automatique
        if (maison.statut === "Vendu") maisonsVendues.appendChild(li);
        else maisonsRestantes.appendChild(li);
    });

    maisonsList.innerHTML = `
        <h3>Maisons restantes</h3>
    `;
    maisonsList.appendChild(maisonsRestantes);

    if (maisonsVendues.childElementCount > 0) {
        const titreVendus = document.createElement("h3");
        titreVendus.textContent = "Maisons vendues";
        maisonsList.appendChild(titreVendus);
        maisonsList.appendChild(maisonsVendues);
    }
}

// Retour aux rues
document.getElementById("retour-rues").onclick = () => {
    document.getElementById("rues-container").style.display = "block";
    document.getElementById("maisons-container").style.display = "none";
};

// Ajouter maison
document.getElementById("ajouter-maison").onclick = () => {
    const numero = document.getElementById("numero-maison").value.trim();
    if (numero) {
        rues[rueSelectionnee].maisons.push({ numero: numero });
        document.getElementById("numero-maison").value = "";
        sauvegarder();
        afficherMaisonsListe();
    }
};

// Calcul statistiques
function calculerStats() {
    let totalVentes = 0, totalArgent = 0, totalRefus = 0;
    rues.forEach(rue => {
        rue.maisons.forEach(maison => {
            if (maison.statut === "Vendu") {
                totalVentes++;
                totalArgent += parseFloat(maison.montant) || 0;
            } else if (maison.statut === "Refus") {
                totalRefus++;
            }
        });
    });
    document.getElementById("total-ventes").textContent = totalVentes;
    document.getElementById("total-argent").textContent = totalArgent.toFixed(2);
    document.getElementById("total-refus").textContent = totalRefus;
}

// Initialisation
afficherRues();
calculerStats();
