import express from "express";
import mysql from "mysql2/promise";

const connect = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "agenceVehicule"
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "./template");

app.get("/agences", async(req, res) => {
    const [rows] = await (await connect).execute("SELECT * FROM agence");
    res.render("home", {"agences": rows});
});

app.get("/agence/:id", async(req, res) => {
    const [row] = await (await connect).execute("SELECT * FROM agence WHERE id = ?", [req.params.id]);
    
    if(row.length > 0) {
        res.status(200).json(row[0]);
    } else {
        res.status(404).json({message: "Aucune agence trouvée"});
    }
});

app.post("/agence", async(req, res) => {
    const { nom, adresse, tel, email } = req.body;
    
    await (await connect).execute(
        "INSERT INTO agence (nom, adresse, tel, email) VALUES (?, ?, ?, ?)",
        [nom, adresse, tel, email]
    );
    
    res.redirect("/agences");
});

app.post("/agence/:id/update", async(req, res) => {
    const { nom, adresse, tel, email } = req.body;
    
    await (await connect).execute(
        "UPDATE agence SET nom = ?, adresse = ?, tel = ?, email = ? WHERE id = ?",
        [nom, adresse, tel, email, req.params.id]
    );
    
    res.redirect("/agences");
});

app.post("/agence/:id/delete", async(req, res) => {
    await (await connect).execute("DELETE FROM agence WHERE id = ?", [req.params.id]);
    res.redirect("/agences");
});

app.get("/vehicules", async(req, res) => {
    const [vehicules] = await (await connect).execute("SELECT * FROM vehicule");
    const [agences] = await (await connect).execute("SELECT * FROM agence");
    res.render("homeVehicule", {"vehicules": vehicules, "agences": agences});
});

app.get("/vehicules/agence/:id", async(req, res) => {
    const [vehicules] = await (await connect).execute("SELECT * FROM vehicule WHERE idAgence = ?", [req.params.id]);
    const [agences] = await (await connect).execute("SELECT * FROM agence");
    res.render("homeVehicule", {"vehicules": vehicules, "agences": agences});
});

app.get("/vehicule/:id", async(req, res) => {
    const [row] = await (await connect).execute("SELECT * FROM vehicule WHERE id = ?", [req.params.id]);
    
    if(row.length > 0) {
        res.status(200).json(row[0]);
    } else {
        res.status(404).json({message: "Aucun véhicule trouvé"});
    }
});

app.post("/vehicule", async(req, res) => {
    const { marque, modele, immatriculation, annee, statut, prixJour, idAgence } = req.body;
    
    await (await connect).execute(
        "INSERT INTO vehicule (marque, modele, immatriculation, annee, statut, prixJour, idAgence) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [marque, modele, immatriculation, annee, statut, prixJour, idAgence]
    );
    
    res.redirect("/vehicules");
});

app.post("/vehicule/:id/update", async(req, res) => {
    const { marque, modele, immatriculation, annee, statut, prixJour, idAgence } = req.body;
    
    await (await connect).execute(
        "UPDATE vehicule SET marque = ?, modele = ?, immatriculation = ?, annee = ?, statut = ?, prixJour = ?, idAgence = ? WHERE id = ?",
        [marque, modele, immatriculation, annee, statut, prixJour, idAgence, req.params.id]
    );
    
    res.redirect("/vehicules");
});

app.post("/vehicule/:id/delete", async(req, res) => {
    await (await connect).execute("DELETE FROM vehicule WHERE id = ?", [req.params.id]);
    res.redirect("/vehicules");
});

app.listen(4000, () => {
    console.log("Port 4000 opé");
});