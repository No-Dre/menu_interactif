function user_have_perm(first_name, last_name, email, user_data){
    // get all necessary information to know if the user have exist
    let array = user_data.split(';');
    let nb_user = array.length;

    // search in the user's list the currently user
    for (let i = 0; i < nb_user; i += 3){
        if (first_name === array[i] && last_name === array[i + 1] && email === array[i + 2]){
            // if the user is valid, set her id an return the validity
            sessionStorage.setItem('user', i / 3);
            return true;
        }
    }
    return false;
}

async function setToken(first_name, last_name, email){
    const body = {fname: first_name, lname: last_name, email: email};

    // ask to the back-end the token for this user
    const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    // read the back-end response
    if (response.headers.get("content-type")?.includes("application/json")) {
        const token = await response.json();
    sessionStorage.setItem('token', token);
}
}

window.onload=async function(){
    document.getElementById('button_valid').addEventListener('click', function(){ // si l'utilisateur valide son envoie
        // get the data of the user
        let first_name = document.getElementById('fname').value.trim();
        let last_name = document.getElementById('lname').value.trim();
        let email = document.getElementById('email').value.trim();

        fetch("../db/db_user.csv").then(response => response.text()).then(user_data => { // recupere le contenu de la db
            // ask to the database if the user has permision
            if (user_have_perm(first_name, last_name, email, user_data) === false){
                // return the error for the user
                document.getElementById('failed').style.display = '';

            } else {
                // store the right of the user
                sessionStorage.setItem('haveRight', true);

                // change the html page
                window.location.href = '/depot';
            }
        })
    })
};
