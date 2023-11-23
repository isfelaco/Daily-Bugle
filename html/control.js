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

      // populate the oage with article info
      fetchArticles().then((articles) => {
        console.log(articles);
        if (articles.length > 0) {
          var article = articles[0];
          document.getElementById("articleTitle").innerHTML = article.title;
          document.getElementById("articleBody").innerHTML = article.body;
          document.getElementById("articleComments").innerHTML =
            article.comments;
          document.getElementById("articleId").value = article._id;
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
      break;
    }
    case viewType["reader"]: {
      showReaderView();
      break;
    }
    case viewType["author"]: {
      showAuthorView();
      break;
    }
    default: {
      console.error("invalid view request");
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

async function recordArticle(event) {
  const dataToSend = {
    title: document.getElementById("titleInput").value,
    body: document.getElementById("bodyInput").value,
    // image: article.img,
    teaser: document.getElementById("teaserInput").value,
    categories: ["cat 1", "cat 2"],
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

async function addComment(event) {
  event.preventDefault();

  var comment = document.getElementById("commentInput").value;
  var id = document.getElementById("articleId").value;

  const dataToUpdate = {
    id: id,
    comment: comment,
  };
  let updateArticle = await fetch(endpoint["articles"], {
    method: "PUT",
    headers: {
      Accept: "application/JSON",
      "Content-type": "application/json",
    },
    body: JSON.stringify(dataToUpdate),
  })
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.log("error adding comment"));
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
