const fs = require('fs')
const prompt = require("prompt-sync")()

async function deleteUser(fname, lname, email) {
    try {
        let new_data = "";
        let isfirst = true;
        fs.readFile('public/db/db_user.csv', "utf-8", (err, data) => {
            if (err) {
                console.log(err);
            } else {
                data_split = data.split(";");
                for (let i = 0; i < data_split.length; i += 3){
                    if (data_split[i] != fname || data_split[i + 1] != lname || data_split[i + 2] != email){
                        if (!isfirst){
                            new_data += ";";
                        }
                        new_data += data_split[i] + ";" + data_split[i + 1] + ";" + data_split[i + 2];
                        isfirst = false;
                    }
                }
                if (new_data === data){
                    console.log("no user found");
                    return 1;
                } else {
                    fs.writeFile('public/db/db_user.csv', new_data, err => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("user deleted successfully");
                        }
                    })
                }
            }
        })
    } catch (err) {
        console.error(err);
    }
}

fname = prompt("Enter the first name:");
if (fname === "exit"){
    return(0);
}
lname = prompt("Enter the last name:");
email = prompt("Enter the email:");

deleteUser(fname, lname, email);