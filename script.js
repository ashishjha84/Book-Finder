var verify_existance = false;
var loader = document.getElementById("load"); // loader div from HTML

function queryBooks() {
  const QUERY = (document.getElementById("query").value).toLowerCase();
  var results = document.getElementById("res");
  var query_display = document.getElementById("query-display");
  loader.style.display = "block"; // show loader

  if (verify_existance) {
    results.innerHTML = "";
    results.appendChild(loader);
    results.appendChild(query_display);
  }

  query_display.innerHTML = `Related results for "${QUERY}"`;

  const URL = "https://www.googleapis.com/books/v1/volumes?q=" + QUERY;
  var request = new XMLHttpRequest();
  request.open("GET", URL, true);

  request.onload = function () {
    var data = JSON.parse(this.response);
    loader.style.display = "none"; // hide loader

    // ✅ If no items found → show error message
    if (!data.items || data.items.length === 0) {
      results.innerHTML =
        "<p class='text-danger fs-5'>❌ No books found for your search.</p>";
      return;
    }

    // ✅ Loop only through available items
    for (var i = 0; i < Math.min(9, data.items.length); i++) {
      var item = data.items[i].volumeInfo;

      var authors = item.authors ? item.authors.join(", ") : "No Author Disclosed";
      var title = item.title || "No Title Disclosed";
      var publisher = item.publisher || "No Publisher Disclosed";
      var thumbnail =
        (item.imageLinks && item.imageLinks.thumbnail) ||
        "https://via.placeholder.com/128x200?text=No+Cover";
      var info = item.infoLink || "#";

      // Create card
      var card = document.createElement("div");
      card.className = "card col-md-4 mb-4";

      const logo = document.createElement("img");
      logo.src = thumbnail;
      logo.className = "card-img-top";
      card.appendChild(logo);

      const card_body = document.createElement("div");
      card_body.className = "card-body";

      const card_title = document.createElement("h5");
      card_title.className = "card-title";
      card_title.innerHTML = title;

      const card_text = document.createElement("p");
      card_text.className = "card-text";
      card_text.innerHTML =
        "By: " + authors + "<br>Published By: " + publisher;

      const button = document.createElement("a");
      button.className = "btn btn-primary";
      button.href = info;
      button.target = "_blank";
      button.innerHTML = "See this Book";

      card_body.appendChild(card_title);
      card_body.appendChild(card_text);
      card_body.appendChild(button);
      card.appendChild(card_body);

      results.appendChild(card);
    }
  };

  verify_existance = true;
  request.send();
  document.getElementById("query").value = "";
}

// 🌙 Dark Mode Toggle
document.getElementById("darkToggle").addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
});
