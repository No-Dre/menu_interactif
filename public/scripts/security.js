// verif if the user is connected
if (sessionStorage.getItem('haveRight') === null){
    console.log("no right");
    window.location.href = "/";
}