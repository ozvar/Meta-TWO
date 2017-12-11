$("#playButton").click(function() {
    $('html, body').animate({
        scrollTop: $("#tetris").offset().top
    }, 800);
});

function playGame(){
    document.getElementById("buttonLayout").style.display = "none";
    MetaTWO.run();
    $('html, body').animate({
        scrollTop: $("#tetris").offset().top
    }, 800);

}
window.onload(playGame())
function login() {
    alert('hello!');
}
// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};