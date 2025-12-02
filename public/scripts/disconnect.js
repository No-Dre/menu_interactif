window.onload=async function disconnection(){
    // when the user want to disconnect
    document.getElementById('button_valid').addEventListener('click', function(){
        // revome the connection
        sessionStorage.removeItem("haveRight");

        // move to the menu
        window.location.href = "/"
    })
};
