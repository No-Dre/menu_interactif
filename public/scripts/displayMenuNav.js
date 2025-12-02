if (sessionStorage.getItem('haveRight')){
    // if the user is connected, we don't show the "display" button
    document.getElementById("connection").style.display = 'none';
} else {
    // if the user isn't connected, we don't show the "disconnection" and "submission" button
    document.getElementById("submitresource").style.display = 'none';
    document.getElementById("disconnection").style.display = 'none';
}