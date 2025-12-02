function show(obj) {
    obj.style.display = 'block';
}

function is_show(obj) {
    return obj.style.display === 'block';
}

function hide(obj) {
    obj.style.display = 'none';
}

window.onload=function(){
    let button_term = document.querySelector('#button-term');
    let unchecked = document.querySelector(".check-unchecked");
    let checked = document.querySelector('.check-checked');
    let loader = document.querySelector('.loader-button');
    let text = document.querySelector('.text-button');
    let valided = false;
    document.body.addEventListener('click', function( event_click ){
        if (button_term.contains(event_click.target)){
            if (!valided){
                console.log("The charter has been accepted");
                hide(unchecked);
                hide(checked);
                hide(text);
                show(loader);
                valided = true;
            } else {
                console.log("The charter is currently being accepted");
                hide(loader);
                hide(unchecked);
                show(text);
                show(checked);
                valided = false;
            }
        }
    });
    document.body.addEventListener('hover', function( event_hover ){
        if (button_term.contains(event_hover.target)){
            console.log("move");
        }
    })
};