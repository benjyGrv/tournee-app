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
    if(nomRue) {
        rues.push({nom: nomRue, maisons: []});
        document.getElementById("nouvelle-rue").value = "";
        sauvegarder();
        afficherRues();
    }
}

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
    rues[rueSelectionnee].maisons.forEach((maison, idx) => {
        const li = document.createElement("li");
        li.className = ""; // reset
        if(maison.statut === "Vendu") li.classList.add("vendu");
        else if(maison.statut === "Refus") li.classList.add("refus");
        else if(maison.statut === "À repasser") li.classList.add("repasser");

        li.textContent = `Maison ${maison.numero} - Statut: ${maison.statut || "Non fait"} - Montant: ${maison.montant || 0}€ (${maison.paiement || "-"})`;

        // Bouton Vendu
        const btnVendu = document.createElement("button");
        btnVendu.textContent = "Vendu";
        btnVendu.onclick = () => {
            maison.statut = "Vendu";
            maison.montant = prompt("Montant reçu (€) :", maison.montant || 0);
            maison.paiement = prompt("Mode de paiement (espèce/chèque) :", maison.paiement || "espèce");
            sauvegarder();
            afficherMaisonsListe();
        }

        // Bouton Refus
        const btnRefus = document.createElement("button");
        btnRefus.textContent = "Refus";
        btnRefus.onclick = () => {
            maison.statut = "Refus";
            maison.montant = 0;
            maison.paiement = "-";
            sauvegarder();
            afficherMaisonsListe();
        }

        // Bouton À repasser
        const btnRepasser = document.createElement("button");
        btnRepasser.textContent = "À repasser";
        btnRepasser.onclick = () => {
            maison.statut = "À repasser";
            maison.montant = 0;
            maison.paiement = "-";
            sauvegarder();
            afficherMaisonsListe();
        }

        // Bouton Modifier maison (changer statut, montant ou paiement)
        const btnModifier = document.createElement("button");
        btnModifier.textContent = "Modifier";
        btnModifier.onclick = () => {
            const nouveauStatut = prompt("Modifier le statut (Vendu / Refus / À repasser) :", maison.statut || "Non fait");
            if(nouveauStatut) {
                maison.statut = nouveauStatut.trim();
                if(maison.statut === "Vendu") {
                    maison.montant = prompt("Montant reçu (€) :", maison.montant || 0);
                    maison.paiement = prompt("Mode de paiement (espèce/chèque) :", maison.paiement || "espèce");
                } else {
                    maison.montant = 0;
                    maison.paiement = "-";
                }
                sauvegarder();
                afficherMaisonsListe();
            }
        }

        // Bouton Supprimer maison
        const btnSupprimer = document.createElement("button");
        btnSupprimer.textContent = "Supprimer";
        btnSupprimer.onclick = () => {
            if(confirm(`Supprimer la maison ${maison.numero} ?`)) {
                rues[rueSelectionnee].maisons.splice(idx, 1);
                sauvegarder();
                afficherMaisonsListe();
            }
        }

        li.appendChild(btnVendu);
        li.appendChild(btnRefus);
        li.appendChild(btnRepasser);
        li.appendChild(btnModifier);
        li.appendChild(btnSupprimer);
        maisonsList.appendChild(li);
    });
}

// Retour aux rues
document.getElementById("retour-rues").onclick = () => {
    document.getElementById("rues-container").style.display = "block";
    document.getElementById("maisons-container").style.display = "none";
}

// Ajouter maison
document.getElementById("ajouter-maison").onclick = () => {
    const numero = document.getElementById("numero-maison").value.trim();
    if(numero) {
        rues[rueSelectionnee].maisons.push({numero: numero});
        document.getElementById("numero-maison").value = "";
        sauvegarder();
        afficherMaisonsListe();
    }
}

// Calcul statistiques
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

// Initialisation
afficherRues();
calculerStats();
