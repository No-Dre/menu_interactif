/*
NOTE:
ranking of languages in ascending order: 1.french, 2.english, 3.german, 4.italian, 5.spanish, 6.breton, 7.arab, 8.catalan, 9.irish, 10.japanese, 11.portuguese, 12.russian, 13.greek, 14.latin, 15.welsh
*/

import * as def from "../define/define.js";

class dataResource {
    constructor() {
        this.language = document.getElementById('language').value.trim();
        this.level = document.getElementById('level').value;
        this.resourceName = document.getElementById('resourceName').value.trim();
        this.subjectField = document.getElementById('subjectField').value.trim();
        this.link = document.getElementById('link').value.trim();
        this.room = document.getElementById('room').value.trim();
    }
}

function colorArg(data, color){
    // init the value to return
    let return_value = true;

    // for each element in data
    for (let element in data) {
        // set the background color in red if the element is missing or clean the background in the other case
        document.getElementById(element).style.backgroundColor = data[element] ? "" : color;

        // set the return value to false if one element is missing
        return_value &= !(!data[element]);
    }
    // return the inverse value: true => false, false => true
    return !return_value;
}

function DataIsIncomplete(data){
    // look if some information are missing and change their background color
    if (colorArg(data, "rgb(180, 26, 9)")){
        // return an error message to the user
        document.getElementById("failedText").alt = def.errorMessageMissingData;
        console.log("Some information is missing");
        return true
    }
    // return the success
    console.log("all data are complete");
    return false;
};

function linkIsIncorrect(url) {
    if (url.length > def.lenMaxData){
        // return an error message to the user if the url is too long
        document.getElementById('link').style.backgroundColor = "rgb(180, 26, 9)";
        console.log("this url isn't available, please try again");
        document.getElementById("failedText").alt = def.errorMessageInvalidUrlSize;
        return true;
    }
    try {
        // test if the given url is indeed a url
        new URL(url);
        return false;
    } catch (err) {
        // return an error message to the user
        document.getElementById('link').style.backgroundColor = "rgb(180, 26, 9)";
        console.log("this url isn't available, please try again");
        document.getElementById("failedText").alt = def.errorMessageInvalidUrl;
        return true;
    }
}

async function languageIsIncorrect(resource_data){
    try {
        // get and initialized all value
        const response = await fetch("../db/db_InfoResource.csv");
        let data = await response.text();
        data = data.split(";");

        // search if the language is in the database
        for (let i = 0; i < data.length; i += 2) {
          if (resource_data.language === data[i]) {
            // return that the language is correct
            resource_data.language = Number(data[i + 1]);
            document.getElementById('language').style.backgroundColor = "";
            return false;
          }
        }
        // return that the language isn't correct
        document.getElementById('language').style.backgroundColor = "rgb(180, 26, 9)";
        console.log("this language isn't recognized, please try again");
        document.getElementById("failedText").alt = def.errorMessageInvalidLanguage;
        return true;
      } catch (err) {
        // handle in case of error
        console.error(err);
        return true;
      }
}

async function roomIsIncorrect(data, mapsName){
    // ensures that map names are no longer promises
    if (mapsName instanceof Promise)
        mapsName = await mapsName;

    // verif if the room exist
    if (mapsName.includes(data.room))
        return false;

    // return that the room doesn't exist
    console.log("this room doesn't exist");
    document.getElementById('room').style.backgroundColor = "rgb(180, 26, 9)";
    document.getElementById("failedText").alt = def.errorMessageInvalidRoom;
    return true;
}

async function DataIsIncorrecte(data, mapsName){
    // verif if all information are correct
    if (await languageIsIncorrect(data)) // à mettre au propre avec l'accès à une db !!!!!!!!!!!!!
        return true;
    if (linkIsIncorrect(data.link))
        return true
    if (data.resourceName.length > def.lenMaxData){
        // return an error to the user if the resource's name is too long
        console.log("your resource name is too long");
        document.getElementById('resourceName').style.backgroundColor = "rgb(180, 26, 9)";
        document.getElementById("failedText").alt = def.errorMessageInvalidResourceName;
        return true;
    }
    return (await roomIsIncorrect(data, mapsName));
};

async function GetMapsNames() {
    // init variables
    const url = "https://monde-virtuel-21761.map-storage.workadventu.re/maps";
    let mapsName = [];
    let i = 0;

    // try to have all map's name
    try {
        // ask all map's data
        const response = await fetch(url);
        if (!response.ok) {
            // return an error if it fail
            throw new Error(`Response status: ${response.status}`);
        }

        // put all map's name into an array
        const result = await response.json();
        for (let map in result.maps){
            mapsName[i] = result.maps[map].metadata.name;
            i++;
        }
    } catch (error) {
        // return an error if it fail
        console.error(error.message);
    }
    // return all map's name
    return mapsName;
}

async function Addresource(data) {
    // try to add a resource
    try {
        console.log("len = " + data.resourceName.length);
        // init essential data
        let res = "";
        const body = {language: data.language, level: data.level, resourceName: data.resourceName, subjectField: data.subjectField, link: data.link, room: data.room, id: sessionStorage.getItem("user"), mode: def.modeAdd};

        // call the back-end to add the resource
        const response = await fetch("http://localhost:3001/resources", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        // get the response of the back-end
        if (response.headers.get("content-type")?.includes("application/json")) {
            res = await response.json();
        }

        // handle the back-end response
        if (!response.ok) {
            console.error("Here is the error message: " + res);
        } else {
            if (res.message === def.messageYouHaveAlreadyCreateThisresource){
                // display the warning to notify the user that he have already add this resource
                document.getElementById('formForresource').style.filter = "blur(2.5px)";
                document.getElementById('replaceResource').style.display = "inline-flex";
            } else if(res.message === def.errorMessageResourceAlreadyExist){
                // display the error to notify the user that the resource already exist
                document.getElementById('resourceName').style.backgroundColor = "rgb(180, 26, 9)";
                document.getElementById("failedText").alt = def.errorMessageResourceAlreadyExist;
                document.getElementById("failed").style.display = 'block';
            } else {
                // display the message to notify the user that the resource had been added
                document.getElementById("successText").alt = res.message;
                document.getElementById("success").style.display = 'block';
            }
        }
    } catch (err) {
        // if the call with the back-end fail, return an error
        console.error(err);
        document.getElementById("failedText").alt = def.errorMessageCallDatabase;
        document.getElementById("failed").style.display = 'block';
    }
}

async function replaceResource(data) {
    // try to add a resource
    try {
        // init essential data
        let res = "";
        const body = {language: data.language, level: data.level, resourceName: data.resourceName, subjectField: data.subjectField, link: data.link, room: data.room, id: sessionStorage.getItem("user"), mode: def.modeReplace};

        // call the back-end to replace the resource
        const response = await fetch("http://localhost:3001/resources", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        // get the response of the back-end
        if (response.headers.get("content-type")?.includes("application/json")) {
            res = await response.json();
        }

        // handle the back-end response
        if (!response.ok) {
            console.error("Here is the error message: " + res);
        } else {
            // display the message to notify the user that the resource had been modified
            document.getElementById("successText").alt = res.message;
            document.getElementById("success").style.display = 'block';
        }
    } catch (err) {
        // if the call with the back-end fail, return an error
        console.error(err);
        document.getElementById("failedText").alt = def.errorMessageCallDatabase;
        document.getElementById("failed").style.display = 'block';
    }
}

window.onload=function saveResource(){
    // get the name of all rooms in the virtual world
    const mapsName = GetMapsNames();

    // if the user want add a resource
    document.getElementById('button_valid').addEventListener('click', async function(){
        // get the resource's informations
        let data = new dataResource();

        // remove the display of all message in case one is show
        document.getElementById("success").style.display = 'none';
        document.getElementById("failed").style.display = 'none';

        // verif data's validity
        if (!DataIsIncomplete(data) && !await DataIsIncorrecte(data, mapsName)) {
            // if all informations are correct, try to add the resource
            Addresource(data);
        } else {
            // return to the user an error
            document.getElementById("failed").style.display = 'block';
        }
    });

    // if the user refuses to change an old resource
    document.getElementById('cancel_button').addEventListener('click', function(){
        document.getElementById('formForresource').style.filter = "blur()";
        document.getElementById('replaceResource').style.display = "none";
    });

    // if the user want to change an old resource
    document.getElementById('continue_button').addEventListener('click', async function(){
        // get the resource's informations
        let data = new dataResource();
        await languageIsIncorrect(data);

        // replace the resource
        replaceResource(data);

        // set the depot in initial states
        document.getElementById('formForresource').style.filter = "blur()";
        document.getElementById('replaceResource').style.display = "none";
    });
};