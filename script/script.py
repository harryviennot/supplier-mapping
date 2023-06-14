import json

# Ouvrir le fichier json et charger les données
with open('data.json', 'r') as f:
    data = json.load(f)

# Initialiser les listes de noeuds et de liens
nodes = []
links = []

# Parcourir chaque élément du dictionnaire
for key, value in data.items():
    # Ajouter un noeud pour chaque élément
    nodes.append({
        "id": key,
        "location": value["Location"].split(", "),
        "commodities": value["Commodities"].split(", ")
    })

    # Ajouter un lien pour chaque fournisseur dans la liste des fournisseurs de l'élément
    for supplier in value["Suppliers"]:
        if supplier:  # ignore empty suppliers
            links.append({
                "source": key,
                "target": supplier
            })

# Construire le nouveau dictionnaire à partir des listes de noeuds et de liens
new_data = {
    "nodes": nodes,
    "links": links
}

# Enregistrer le nouveau dictionnaire en tant que fichier json
with open('output.json', 'w') as f:
    json.dump(new_data, f, ensure_ascii=False, indent=4)
