let rues = JSON.parse(localStorage.getItem("rues")) || [];
let rueSelectionnee = null;
let afficherToutes = false;

function sauvegarder() {
  localStorage.setItem("rues", JSON.stringify(rues));
  calculerStats();
}

function afficherRues() {
  const list = document.getElementById("rues-list");
  list.innerHTML = "";
  rues.forEach((rue, i) => {
    const li = document.createElement("li");
    li.textContent = rue.nom;
    const btn = document.createElement("button");
    btn.textContent = "Voir";
    btn.onclick = () => afficherMaisons(i);
    li.appendChild(btn);
    list.appendChild(li);
  });
}

document.getElementById("ajouter-rue").onclick = () => {
  const nom = document.getElementById("nouvelle-rue").value.trim();
  if (!nom) return;
  rues.push({ nom, maisons: [] });
  document.getElementById("nouvelle-rue").value = "";
  sauvegarder();
  afficherRues();
};

function afficherMaisons(index) {
  rueSelectionnee = index;
  document.getElementById("rues-container").style.display = "none";
  document.getElementById("maisons-container").style.display = "block";
  document.getElementById("nom-rue").textContent = rues[index].nom;
  afficherMaisonsListe();
}

document.getElementById("retour-rues").onclick = () => {
  document.getElementById("rues-container").style.display = "block";
  document.getElementById("maisons-container").style.display = "none";
};

document.getElementById("ajouter-maison").onclick = () => {
  const num = document.getElementById("numero-maison").value.trim();
  if (!num) return;
  rues[rueSelectionnee].maisons.push({ numero: num });
  document.getElementById("numero-maison").value = "";
  sauvegarder();
  afficherMaisonsListe();
};

document.getElementById("toggle-filtre").onclick = () => {
  afficherToutes = !afficherToutes;
  document.getElementById("toggle-filtre").textContent = afficherToutes
    ? "Afficher uniquement les maisons restantes"
    : "Afficher toutes les maisons";
  afficherMaisonsListe();
};

function afficherMaisonsListe() {
  const list = document.getElementById("maisons-list");
  list.innerHTML = "";
  rues[rueSelectionnee].maisons.forEach((m, i) => {
    if (!afficherToutes && (m.statut === "Vendu" || m.statut === "Refus")) return;

    const li = document.createElement("li");
    li.className = m.statut ? m.statut.toLowerCase() : "";
    li.innerHTML = `<strong>Maison ${m.numero}</strong><br>
    Statut: ${m.statut || "Non fait"} - Montant: ${m.montant || 0}€ (${m.paiement || "-"})`;

    const actions = document.createElement("div");
    actions.className = "actions";

    const btnVendu = creerBouton("Vendu", "#4caf50", () => {
      m.statut = "Vendu";
      m.montant = prompt("Montant reçu (€):", m.montant || 0);
      m.paiement = prompt("Mode de paiement (espèce/chèque):", m.paiement || "espèce");
      sauvegarder();
      afficherMaisonsListe();
    });

    const btnRefus = creerBouton("Refus", "#f44336", () => {
      m.statut = "Refus";
      m.montant = 0;
      m.paiement = "-";
      sauvegarder();
      afficherMaisonsListe();
    });

    const btnRepasser = creerBouton("À repasser", "#ff9800", () => {
      m.statut = "À repasser";
      m.montant = 0;
      m.paiement = "-";
      sauvegarder();
      afficherMaisonsListe();
    });

    const btnFermee = creerBouton("Fermée", "#9e9e9e", () => {
      m.statut = "Fermée";
      m.montant = 0;
      m.paiement = "-";
      sauvegarder();
      afficherMaisonsListe();
    });

    const btnSuppr = creerBouton("🗑️", "#333", () => {
      if (confirm("Supprimer cette maison ?")) {
        rues[rueSelectionnee].maisons.splice(i, 1);
        sauvegarder();
        afficherMaisonsListe();
      }
    });

    actions.append(btnVendu, btnRefus, btnRepasser, btnFermee, btnSuppr);
    li.appendChild(actions);
    list.appendChild(li);
  });
}

function creerBouton(texte, couleur, action) {
  const btn = document.createElement("button");
  btn.textContent = texte;
  btn.style.backgroundColor = couleur;
  btn.style.color = "white";
  btn.onclick = action;
  return btn;
}

function calculerStats() {
  let ventes = 0, argent = 0, refus = 0;
  rues.forEach(r => {
    r.maisons.forEach(m => {
      if (m.statut === "Vendu") {
        ventes++;
        argent += parseFloat(m.montant) || 0;
      } else if (m.statut === "Refus") refus++;
    });
  });
  document.getElementById("total-ventes").textContent = ventes;
  document.getElementById("total-argent").textContent = argent.toFixed(2);
  document.getElementById("total-refus").textContent = refus;
}

afficherRues();
calculerStats();
