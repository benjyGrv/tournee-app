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
        btn.classList.add("modifier");
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

// Afficher maisons
let rueSelectionnee = null;
function afficherMaisons(index) {
    rueSelectionnee = index;
    document.getElementById("rues-container").style.display = "none";
    document.getElementById("maisons-container").style.display = "block";
    document.getElementById("nom-rue").textContent = rues[index].nom;
    afficherMaisonsListe();
}

// Affichage cartes avec swipe et animations
function afficherMaisonsListe() {
    const maisonsList = document.getElementById("maisons-list");
    maisonsList.innerHTML = "";

    rues[rueSelectionnee].maisons.forEach((maison, idx) => {
        const li = document.createElement("li");
        if(maison.statut === "Vendu") li.classList.add("vendu");
        else if(maison.statut === "Refus") li.classList.add("refus");
        else if(maison.statut === "À repasser") li.classList.add("repasser");

        const infoDiv = document.createElement("div");
        infoDiv.classList.add("info");
        infoDiv.innerHTML = `<span>Maison ${maison.numero}</span>
                             <span>${maison.statut || "Non fait"}</span>
                             <span>${maison.montant || 0}€</span>
                             <span>${maison.paiement || "-"}</span>`;
        li.appendChild(infoDiv);

        const actionsDiv = document.createElement("div");
        actionsDiv.classList.add("actions");

        const btnVendu = document.createElement("button");
        btnVendu.textContent = "Vendu"; btnVendu.classList.add("vendu");
        btnVendu.onclick = () => { maison.statut="Vendu"; maison.montant=prompt("Montant reçu (€) :",maison.montant||0); maison.paiement=prompt("Mode de paiement :",maison.paiement||"espèce"); sauvegarder(); afficherMaisonsListe(); }

        const btnRefus = document.createElement("button");
        btnRefus.textContent = "Refus"; btnRefus.classList.add("refus");
        btnRefus.onclick = () => { maison.statut="Refus"; maison.montant=0; maison.paiement="-"; sauvegarder(); afficherMaisonsListe(); }

        const btnRepasser = document.createElement("button");
        btnRepasser.textContent = "À repasser"; btnRepasser.classList.add("repasser");
        btnRepasser.onclick = () => { maison.statut="À repasser"; maison.montant=0; maison.paiement="-"; sauvegarder(); afficherMaisonsListe(); }

        const btnModifier = document.createElement("button");
        btnModifier.textContent="Modifier"; btnModifier.classList.add("modifier");
        btnModifier.onclick=()=>{ const ns=prompt("Modifier statut (Vendu/Refus/À repasser):",maison.statut||"Non fait"); if(ns){ maison.statut=ns.trim(); if(ns==="Vendu"){ maison.montant=prompt("Montant (€) :",maison.montant||0); maison.paiement=prompt("Mode de paiement :",maison.paiement||"espèce"); } else { maison.montant=0; maison.paiement="-"; } sauvegarder(); afficherMaisonsListe(); } }

        const btnSupprimer = document.createElement("button");
        btnSupprimer.textContent="Supprimer"; btnSupprimer.classList.add("supprimer");
        btnSupprimer.onclick=()=>{ if(confirm(`Supprimer maison ${maison.numero}?`)){ li.classList.add("swipe-left"); setTimeout(()=>{ rues[rueSelectionnee].maisons.splice(idx,1); sauvegarder(); afficherMaisonsListe(); },300); } }

        actionsDiv.appendChild(btnVendu);
        actionsDiv.appendChild(btnRefus);
        actionsDiv.appendChild(btnRepasser);
        actionsDiv.appendChild(btnModifier);
        actionsDiv.appendChild(btnSupprimer);

        li.appendChild(actionsDiv);
        maisonsList.appendChild(li);

        // Swipe tactile pour mobile
        let startX=0;
        li.addEventListener("touchstart", e=>{ startX=e.touches[0].clientX; });
        li.addEventListener("touchend", e=>{
            const endX=e.changedTouches[0].clientX;
            if(startX-endX>50){ li.classList.add("swipe-left"); setTimeout(()=>{ rues[rueSelectionnee].maisons.splice(idx,1); sauvegarder(); afficherMaisonsListe(); },300); }
            else if(endX-startX>50){ li.classList.add("swipe-right"); setTimeout(()=>{ const ns=prompt("Modifier statut (Vendu/Refus/À repasser):",maison.statut||"Non fait"); if(ns){ maison.statut=ns.trim(); if(ns==="Vendu"){ maison.montant=prompt("Montant (€) :",maison.montant||0); maison.paiement=prompt("Mode de paiement :",maison.paiement||"espèce"); } else { maison.montant=0; maison.paiement="-"; } sauvegarder(); afficherMaisonsListe(); } },300); }
        });
    });
}

// Retour aux rues
document.getElementById("retour-rues").onclick = () => {
    document.getElementById("rues-container").style.display = "block";
    document.getElementById("maisons-container").style.display = "none";
}

// Ajouter maison
document.getElementById("ajouter-maison").onclick = () => {
    const numero=document.getElementById("numero-maison").value.trim();
    if(numero){ rues[rueSelectionnee].maisons.push({numero:numero}); document.getElementById("numero-maison").value=""; sauvegarder(); afficherMaisonsListe(); }
}

// Calcul statistiques
function calculerStats() {
    let totalVentes=0, totalArgent=0, totalRefus=0;
    rues.forEach(rue=>{ rue.maisons.forEach(maison=>{ if(maison.statut==="Vendu"){ totalVentes++; totalArgent+=parseFloat(maison.montant)||0; } else if(maison.statut==="Refus"){ totalRefus++; } }); });
    document.getElementById("total-ventes").textContent=totalVentes;
    document.getElementById("total-argent").textContent=totalArgent.toFixed(2);
    document.getElementById("total-refus").textContent=totalRefus;
}

// Initialisation
afficherRues();
calculerStats();
