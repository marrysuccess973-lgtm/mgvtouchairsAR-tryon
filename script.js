// =====================================
// MGV TOUCH VIRTUAL WIG TRY-ON
// =====================================


// Get elements from HTML
const photoInput = document.getElementById("photoInput");

const userPhoto = document.getElementById("userPhoto");

const wigOverlay = document.getElementById("wigOverlay");

const placeholder = document.getElementById("placeholder");

const wigButtons = document.querySelectorAll(".wig-button");

const wigCards = document.querySelectorAll(".wig-card");

const wigSize = document.getElementById("wigSize");

const wigX = document.getElementById("wigX");

const wigY = document.getElementById("wigY");

const resetButton = document.getElementById("resetButton");

const shopButton = document.getElementById("shopButton");


// =====================================
// WIG IMAGES
// =====================================

// Keep each wig as a transparent image so it can sit over the uploaded face.

const wigs = {

    straight:
        "assets/wigs/straight.svg",

    curly:
        "assets/wigs/curly.svg",

    bob:
        "assets/wigs/bob.svg",

    wave:
        "assets/wigs/wave.svg"

};


// =====================================
// UPLOAD CUSTOMER PHOTO
// =====================================

photoInput.addEventListener("change", function(event) {

    const file = event.target.files[0];

    if (!file) {
        return;
    }

    // Make sure it is an image
    if (!file.type.startsWith("image/")) {

        alert("Please upload an image.");

        return;
    }


    // Create temporary URL
    const imageURL = URL.createObjectURL(file);


    // Display customer's image
    userPhoto.src = imageURL;

    userPhoto.style.display = "block";

    placeholder.style.display = "none";


    // Show wig
    wigOverlay.style.display = "block";


    // Make sure the selected wig appears
    updateWig();

});


// =====================================
// SELECT WIG
// =====================================

wigButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Remove active state
        wigButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });


        // Add active state
        button.classList.add("active");


        // Get wig type
        const selectedWig =
            button.getAttribute("data-wig");


        // Change wig image
        if (wigs[selectedWig]) {

            wigOverlay.src = wigs[selectedWig];

        }

    });

});

wigCards.forEach(function(card) {

    card.addEventListener("click", function() {

        const selectedWig = card.getAttribute("data-wig");

        wigButtons.forEach(function(button) {
            button.classList.toggle(
                "active",
                button.getAttribute("data-wig") === selectedWig
            );
        });

        if (wigs[selectedWig]) {
            wigOverlay.src = wigs[selectedWig];
        }

        document.getElementById("tryon").scrollIntoView({
            behavior: "smooth"
        });

    });

});


// =====================================
// UPDATE WIG POSITION
// =====================================

function updateWig() {

    const size = wigSize.value;

    const x = wigX.value;

    const y = wigY.value;


    wigOverlay.style.width =
        size + "%";


    wigOverlay.style.transform =
        `translate(${x}px, ${y}px)`;

}


// =====================================
// SIZE SLIDER
// =====================================

wigSize.addEventListener("input", function() {

    updateWig();

});


// =====================================
// LEFT / RIGHT SLIDER
// =====================================

wigX.addEventListener("input", function() {

    updateWig();

});


// =====================================
// UP / DOWN SLIDER
// =====================================

wigY.addEventListener("input", function() {

    updateWig();

});


// =====================================
// RESET
// =====================================

resetButton.addEventListener("click", function() {

    wigSize.value = 90;

    wigX.value = 0;

    wigY.value = -20;

    updateWig();

});


// =====================================
// SHOP BUTTON
// =====================================

shopButton.addEventListener("click", function() {

    alert(
        "Welcome to MGV Touch Hair Wigs! " +
        "Our online wig collection will open here."
    );

});


// =====================================
// INITIAL WIG
// =====================================

wigOverlay.src = wigs.straight;

updateWig();
