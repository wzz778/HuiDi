let cancel = document.getElementsByClassName('cancel');
let confirms  = document.getElementsByClassName('confirm')
let hidden = document.getElementsByClassName('hidden');
let seal = document.getElementsByClassName('seal');
cancel[0].onclick  = function(){
    hidden[0].style.display = 'none';
}
confirms[0].onclick  = function(){
    hidden[0].style.display = 'none';
}

seal[0].onclick = function(){
    hidden[0].style.display = 'block';
}
