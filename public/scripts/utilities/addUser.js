const fs = require('fs')
const prompt = require("prompt-sync")()

async function addUser(content) {
    try {
        fs.readFile('public/db/db_user.csv', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                fs.writeFile('public/db/db_user.csv', data + content, err => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("user added successfully");
                    }
                })
            }
    })} catch (err) {
        console.error(err);
    }
}

fname = prompt("Enter the first name:")
if (fname === "exit"){
    return(0)
}
lname = prompt("Enter the last name:")
email = prompt("Enter the email:")
content = ";" + fname + ";" + lname + ";" + email

addUser(content)
