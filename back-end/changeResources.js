import * as def from "../public/define/define.js"

export async function Addresource(db, language, level, resourceName, subjectField, link, room, id, res, result) {
    try {
        // try to add the resource into the db
        await db.execute(
            "INSERT INTO resources (language, level, resourceName, subjectField, link, room, id) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [language, level, resourceName, subjectField, link, room, id]
        );

        // return the success
        res.json({message: def.messageAddresource, id: result.insertId});
    } catch(err){
        // if the call with the db fail, return an error
        console.error(err);
        res.status(500).json({error: def.errorMessageAddresource});
    }
}

export async function replaceResource(db, res, link, result) {
    try {
        // try to update the resource into the db
        await db.execute(
            "UPDATE resources SET link = REPLACE(link, ?, ?)",
            [result[0][0].link, link]
        );

        // return the success
        res.json({message: def.messageReplaceResource, id: result.insertId});
    } catch(err){
        // if the call with the db fail, return an error
        console.error(err);
        res.status(500).json({error: def.errorMessageReplaceResource});
    }
}