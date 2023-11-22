// front end JS for Daily Bugle app
const endpoint = {};
endpoint["articles"] = "http://localhost:8080/api/articles";
endpoint["readers"] = "http://localhost:8080/api/readers";
endpoint["authors"] = "http://localhost:8080/api/authors";

const viewType = {
  home: "commenter",
  reader: "reader",
  author: "author",
};

function initPage() {
  // set up the page
  var logOutBtn = document.getElementById("logOutBtn");
  if (localStorage.username && localStorage.userType) {
    loadContent(viewType[localStorage.userType]);
  } else {
    loadContent(viewType["home"]);
    logOutBtn.style.display = "none";
  }

  logOutBtn.onclick = function () {
    localStorage.clear();
    // refresh page somehow
  };

  // testing api calls
  var article = {
    title: "test title",
    body: "test article body",
  };

  var testBtn = document.getElementById("testBtn");
  testBtn.onclick = function () {
    recordArticle(article);
  };

  var fetchBtn = document.getElementById("fetchArticles");
  fetchBtn.onclick = function () {
    fetchArticles();
  };
}

// Function to show the commenter view
function showCommenterView() {
  fetch("commenter.html")
    .then((response) => response.text())
    .then((html) => {
      const content = document.getElementById("content");
      content.innerHTML = html;

      // set user area to login button
      var curUser = document.getElementById("curUser");
      curUser.style.display = "none";
      var openModal = document.getElementById("openModal");
      openModal.style.display = "block";

      // open modal
      var modal = content.querySelector("#loginModal");
      openModal.onclick = function () {
        modal.style.display = "block";
      };

      // close modal using button
      var closeSpan = document.getElementsByClassName("close")[0];
      closeSpan.onclick = function () {
        loginModal.style.display = "none";
      };
    })
    .catch((error) =>
      console.error("Error fetching commenter content:", error)
    );
}

// Function to show reader view
function showReaderView() {
  fetch("reader.html")
    .then((response) => response.text())
    .then((html) => {
      const content = document.getElementById("content");
      content.innerHTML = html;

      // set user area to the cur user
      var curUser = document.getElementById("curUser");
      curUser.style.display = "block";
      curUser.innerHTML = localStorage.username;
      var openModal = document.getElementById("openModal");
      openModal.style.display = "none";

      var articleTitle = document.getElementById("articleTitle");
      var articleBody = document.getElementById("articleBody");
      fetchArticles().then((articles) => {
        console.log(articles);
        if (articles.length > 0) {
          var article = articles[0];
          articleTitle.innerHTML = article.title;
          articleBody.innerHTML = article.body;
        }
      });
    })
    .catch((error) => console.error("Error fetching reader content:", error));
}

// Function to show the author view
function showAuthorView() {
  fetch("author.html")
    .then((response) => response.text())
    .then((html) => {
      const content = document.getElementById("content");
      content.innerHTML = html;

      // set user area to the cur user
      var curUser = document.getElementById("curUser");
      curUser.style.display = "block";
      curUser.innerHTML = localStorage.username;
      var openModal = document.getElementById("openModal");
      openModal.style.display = "none";
    })
    .catch((error) => console.error("Error fetching author content:", error));
}

function loadContent(view) {
  switch (view) {
    case viewType["home"]: {
      showCommenterView();
      // fetch first article
      // fetch teasers of two other articles
      // fetch one ad
      // display view
      break;
    }
    case viewType["reader"]: {
      showReaderView();
      // fetch full first article
      // fetch one ad
      // display view
      break;
    }
    case viewType["author"]: {
      showAuthorView();
      // display view
      break;
    }
    default: {
      console.error("invalid request");
    }
  }
}

// API functions
function fetchArticles() {
  let articleNames = fetch(endpoint["articles"]);
  return articleNames
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}

async function recordArticle(article) {
  const dataToSend = {
    title: article.title,
    body: article.body,
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
      // update the list of articles ?
    })
    .catch((error) => console.log("error saving article: ", error));
}

function addComment(event) {
  event.preventDefault();

  var comment = document.getElementById("commentInput").value;

  console.log(comment);
  // submit comment to database with associated story
}

function updateSubmitButton() {
  var submitComment = document.getElementById("submitComment");
  var commentInput = document.getElementById("commentInput");

  // Check if the input value is not empty
  submitComment.disabled = commentInput.value.trim() === "";
}

function loginUser(event) {
  event.preventDefault();

  var form = event.target.closest("form");

  var userName = form.querySelector("#userName").value;
  var password = form.querySelector("#password").value;
  var userType = form.querySelector("#userType").value;

  // authenticate user and pass

  localStorage.setItem("username", userName);
  localStorage.setItem("userType", userType);

  loadContent(viewType[localStorage.userType]);
  return false;
}
