// front end JS for Daily Bugle app
const endpoint = {};
endpoint["articles"] = "http://localhost:8080/api/articles";
endpoint["readers"] = "http://localhost:8080/api/readers";
endpoint["authors"] = "http://localhost:8080/api/authors";

const viewType = {
  home: "unauthenticated",
  reader: "reader",
  author: "author",
};

function initPage() {
  // set up the page
  // set the title
  document.getElementById("heading").innerHTML = "Headline";

  /*
  if (cached_user) {
    if (cached_user in Readers) loadContent(viewType["reader"]);
    else loadContent(viewType["author"]);
  }
  else loadContent(viewType["unauthenticated"]);
  */

  // modal to login
  // open login modal
  var loginBtn = document.getElementById("loginBtn");
  loginBtn.onclick = function () {
    modal.style.display = "block";
  };

  // control buttons on the modal if open
  var loginModal = document.getElementById("loginModal");
  if (loginModal) {
    var closeBtn = document.getElementById("closeModal");
    closeBtn.onclick = function () {
      modal.style.display = "none";
    };
    // close modal on click away
    window.onclick = function (event) {
      if (event.target != modal) {
        modal.style.display = "none";
      }
    };
    // there will be an html form with a submit button
  }
}

function fetchArticles() {
  let articleNames = fetch(endpoint["articles"]);
  articleNames
    .then((res) => res.json())
    .then((result) => {
      for (item of result) {
        // do something
      }
    });
}

function loadContent(view) {
  // reset the view
  const contentAreas = document.getElementsByClassName("displayArea");
  for (area of contentAreas) {
    area.innerHTML = ""; // empty the containers for redrawing
  }
  switch (view) {
    case viewType["unauthenticated"]: {
      // fetch first article
      // fetch teasers of two other articles
      // fetch one ad
      // display view
      break;
    }
    case viewType["reader"]: {
      // fetch full first article
      // fetch one ad
      // display view
      break;
    }
    case viewType["author"]: {
      // display view
    }
  }
}

async function recordArticle(article) {
  const dataToSend = {
    title: article.title,
    // image: article.img,
    // teaser: article.teaser,
    // categories: article.categories,
  };
  let addArticle = await fetch(endpoint["articles"], {
    method: "POST",
    headers: {
      Accept: "application/JSON",
      "Content-type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  })
    .then((response) => response.json())
    .then((result) => {
      statusMessage(result);
      //   fetchAndListVoters(); // update the list of voters
    })
    .catch((error) => console.log("error saving article"));
}

function statusMessage(message) {
  document.getElementById("messages").innerHTML = message;
}

function loginUser(user) {}
