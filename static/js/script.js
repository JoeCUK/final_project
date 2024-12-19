document.addEventListener('DOMContentLoaded', function() {
    const alertButton = document.getElementById('alertButton');
    if (alertButton) {
        alertButton.addEventListener('click', function() {
            alert("Hello! Thank you for visiting my homepage!");
        });
    }
});
