import express from "express";
import { initDB } from "./db.js";
import cors from "cors"
import * as def from "../public/define/define.js";
import * as resource from "./changeResources.js"
const app = express();
let db;

try {
    db = await initDB(); // Initialise la DB et récupère la connexion
} catch (error) {
    console.error('Erreur lors de la connexion avec la base de données: ', error);
}

app.use(cors({origin: "http://localhost:3000"})); // this URL for only test the menu
app.use(cors({origin: "https://play.workadventu.re"})) // this URL for a local deployment of the virtual world
app.use(cors({origin: "https://mondevirtuel.univ-rennes2.fr"})) // this URL for a WEB deployment
app.use(cors());
app.use(express.json());

app.post("/users", async (req, res) => {
    let token = 0
    const {fname, lname, email} = req.body;
    for (let i = 0; fname[i]; i++){
        token *= 10 * fname.charCodeAt(i).toString().length;
        token += fname.charCodeAt(i);
    };
    for (let i = 0; lname[i]; i++){
        token *= 10 * lname.charCodeAt(i).toString().length;
        token += lname.charCodeAt(i);
    };
    for (let i = 0; email[i]; i++){
        token *= 10 * email.charCodeAt(i).toString().length;
        token += email.charCodeAt(i);
    };
    res.json(token.toString(16));
});

app.get("/resources", async (req, res) => {
    try {
        // get all resources
        const [rows] = await db.execute("SELECT * FROM resources");

        // return all resources
        res.json(rows);
    } catch (err) {
        // if a call with the db fail, return an error
        console.log(err);
        res.status(500).json({error: def.errorMessageCallDatabase});
    }
});

app.post("/resources", async (req, res) => {
    // get the resource's informations
    const {language, level, resourceName, subjectField, link, room, id, mode} = req.body;

    // try to add the resource
    try {
        // get all old resources
        const result = await db.execute(
            "SELECT * FROM resources WHERE language = ? AND level = ? AND resourceName = ? AND subjectField = ? AND room = ?",
            [language, level, resourceName, subjectField, room]
        );

        // Add the new resources
        if (result[0][0] === undefined){
            // if the resources doesn't already exist, add the resource
            await resource.Addresource(db, language, level, resourceName, subjectField, link, room, id, res, result);
        } else {
            if (result[0][0].id === Number(id)){
                if (mode === def.modeAdd){
                    // return that this user have already create this resource
                    res.json({message: def.messageYouHaveAlreadyCreateThisresource});
                } else {
                    // update the resource
                    resource.replaceResource(db, res, link, result);
                }
            } else {
                // else return to the current user the resource already exist
                res.json({message: def.errorMessageResourceAlreadyExist});
            }
        }
    } catch (err) {
        // if a call with the db fail, return an error
        console.log(err);
        res.status(500).json({error: def.errorMessageCallDatabase});
    }
});

app.listen(3001, () => console.log("Serveur démarré sur http://localhost:3001"));
