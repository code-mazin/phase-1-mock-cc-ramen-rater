document.addEventListener("DOMContentLoaded", () => {
    displayRamens();
    addSubmitListener();
});

// fetches ramens and puts them all on the menu
function displayRamens() {
    fetch("http://localhost:3000/ramens")
        .then(res => res.json())
        .then(ramens => {
            ramens.forEach(ramen => renderOneRamen(ramen));
            if (ramens.length > 0) {
                showRamenDetails(ramens[0]);
            }
        });
}

// adds event listener to form for new ramen submission
function addSubmitListener() {
    const ramenForm = document.getElementById("new-ramen");

    ramenForm.addEventListener("submit", (e) => {
        e.preventDefault();
        addNewRamen();
        ramenForm.reset();
    });
}

// adds one ramen at a time to the menu
function renderOneRamen(ramen) {
    const ramenImg = document.createElement("img");
    const ramenDiv = document.createElement("div");
    const ramenMenu = document.getElementById("ramen-menu");

    ramenImg.src = ramen.image;

    ramenMenu.append(ramenDiv);
    ramenDiv.append(ramenImg);

    ramenImg.addEventListener("click", () => showRamenDetails(ramen));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "delete";
    deleteButton.className = "delete-btn";
    ramenDiv.append(deleteButton);

    deleteButton.addEventListener("click", () => deleteRamen(ramen.id, ramenDiv));
}

// displays ramen details in center when its menu image is clicked
function showRamenDetails(ramen) {
    const detailImage = document.getElementById("detail-image");
    const detailName = document.getElementById("detail-name");
    const detailRestaurant = document.getElementById("detail-restaurant");
    const detailRating = document.getElementById("detail-rating");
    const detailComment = document.getElementById("detail-comment");

    detailImage.src = ramen.image;
    detailName.textContent = ramen.name;
    detailRestaurant.textContent = ramen.restaurant;
    detailRating.textContent = ramen.rating;
    detailComment.textContent = ramen.comment;
}

// gets new ramen from form, then adds it to database, then adds to menu
function addNewRamen() {
    const newRamen = {
        name: document.getElementById("new-name").value,
        restaurant: document.getElementById("new-restaurant").value,
        image: document.getElementById("new-image").value,
        rating: document.getElementById("new-rating").value,
        comment: document.getElementById("new-comment").value
    };

    fetch("http://localhost:3000/ramens", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRamen)
    })
    .then(res => res.json())
    .then(savedRamen => renderOneRamen(savedRamen));
}

// deletes ramen from db and from ramen menu
function deleteRamen(id, ramenDiv) {
    if (confirm("Are you sure you want to delete this ramen?")) {
        fetch(`http://localhost:3000/ramens/${id}`, { method: 'DELETE' })
            .then(() => {
                ramenDiv.remove();

                const placeholderInfo = {
                    name: "Click a ramen!",
                    restaurant: ":3",
                    image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.Wn3NuoGzrYA99hHdlJPyqgHaGH%26pid%3DApi&f=1",
                    rating: "Select a ramen to display its rating!",
                    comment: "Same deal."
                };
                showRamenDetails(placeholderInfo);
            });
    }
}
