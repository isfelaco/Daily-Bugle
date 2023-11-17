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
  var article = {
    title: "test title",
  };

  var testBtn = document.getElementById("testBtn");
  testBtn.onclick = function () {
    recordArticle(article);
  };

  var fetchBtn = document.getElementById("fetchArticles");
  fetchBtn.onclick = function () {
    fetchArticles();
  };

  // modal to login
  // open login modal
  var loginModal = document.getElementById("loginModal");

  var openModal = document.getElementById("loginBtn");
  openModal.onclick = function () {
    loginModal.style.display = "block";
  };

  // close modal using button
  var closeSpan = document.getElementsByClassName("close")[0];
  closeSpan.onclick = function () {
    loginModal.style.display = "none";
  };
  // close modal on click away
  window.onclick = function (event) {
    if (event.target == loginModal) {
      loginModal.style.display = "none";
    }
  };
}

function fetchArticles() {
  let articleNames = fetch(endpoint["articles"]);
  articleNames
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
      // for (item of result) {
      //   console.log("result");
      // }
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
      statusMessage("success");
      // update the list of articles ?
    })
    .catch((error) => console.log("error saving article: ", error));
}

function statusMessage(message) {
  document.getElementById("messages").innerHTML = message;
}

function loginUser(user) {
  console.log("Login");
  let username = document.getElementById("userName").value;
  let password = document.getElementById("password").value;
  return false;
}
