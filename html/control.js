// front end JS for Daily Bugle app
const endpoint = {};
endpoint["articles"] = "http://localhost:8080/api/articles";
endpoint["users"] = "http://localhost:8080/api/users";

const viewType = {
  home: "commenter",
  reader: "reader",
  author: "author",
};

function initPage() {
  if (!localStorage.getItem("index")) localStorage.setItem("index", 0);

  if (localStorage.username && localStorage.userType) {
    loadContent(viewType[localStorage.userType]);
  } else {
    loadContent(viewType["home"]);
  }

  var logOutBtn = document.getElementById("logOutBtn");
  logOutBtn.onclick = function () {
    localStorage.clear();
    location.reload();
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

      document.getElementById("logOutBtn").style.display = "block";

      var articles = null;
      // populate the oage with article info
      fetchArticles().then((a) => {
        if (a.length > 0) {
          articles = a;
          renderArticle(a[localStorage.getItem("index")]);
        }
      });

      // set the action for the navigation buttons
      var nextBtn = document.getElementById("next");
      var prevBtn = document.getElementById("previous");
      nextBtn.onclick = function () {
        var i = parseInt(localStorage.getItem("index"));
        localStorage.setItem("index", navArticles(articles, i, 1));
      };
      prevBtn.onclick = function () {
        var i = parseInt(localStorage.getItem("index"));
        localStorage.setItem("index", navArticles(articles, i, 0));
      };
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

      document.getElementById("logOutBtn").style.display = "block";
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

// fetch all articles
function fetchArticles() {
  let articleNames = fetch(endpoint["articles"]);
  return articleNames
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}

// record a new article
async function recordArticle(event) {
  const dataToSend = {
    title: document.getElementById("titleInput").value,
    body: document.getElementById("bodyInput").value,
    // image: article.img,
    teaser: document.getElementById("teaserInput").value,
    categories: ["cat 1", "cat 2"],
  };
  await fetch(endpoint["articles"], {
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

// add a comment to an article
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

  location.reload();
}

function updateSubmitButton() {
  var submitComment = document.getElementById("submitComment");
  var commentInput = document.getElementById("commentInput");

  // Check if the input value is not empty
  submitComment.disabled = commentInput.value.trim() === "";
}

async function fetchUser(username) {
  try {
    const response = await fetch(`${endpoint["users"]}/${username}`);
    if (response.ok) {
      const user = await response.json();
      return { found: true, user };
    } else if (response.status === 404) {
      return { found: false };
    } else {
      console.error(
        "Failed to fetch user: ",
        response.status,
        response.statusText
      );
      return { found: false };
    }
  } catch (error) {
    console.error("Error fetching user: ", error);
    return { found: false };
  }
}

async function createUser() {
  const userData = {
    username: document.querySelector("#usernameInput").value,
    password: document.querySelector("#passwordInput").value,
    type: document.querySelector("#userTypeInput").value,
  };
  await fetch(endpoint["users"], {
    method: "POST",
    headers: {
      Accept: "application/JSON",
      "Content-type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((error) => console.log("error saving user: ", error));
}

async function loginUser(event) {
  event.preventDefault();

  var form = event.target.closest("form");

  var username = form.querySelector("#usernameInput").value;
  var password = form.querySelector("#passwordInput").value;
  var userType = form.querySelector("#userTypeInput").value;

  const result = await fetchUser(username);

  if (result.found) {
    const user = result.user;
    // authenticate user and pass
    if (user.password === password && user.type === userType) {
      localStorage.setItem("username", username);
      localStorage.setItem("userType", userType);

      loadContent(viewType[localStorage.userType]);
    }
  } else {
    document.getElementById("loginError").style.display = "block";
  }

  return false;
}

function renderArticle(article) {
  document.getElementById("articleTitle").innerHTML = article.title;
  document.getElementById("articleBody").innerHTML = article.body;
  document.getElementById("articleComments").innerHTML =
    article.comments || "No comments";
  document.getElementById("articleId").value = article._id;
}

function navArticles(articles, index, dir) {
  if (dir === 1) {
    if (articles.length - 1 > index) {
      renderArticle(articles[index + 1]);
      return index + 1;
    }
  } else {
    if (index > 0) {
      renderArticle(articles[index - 1]);
      return index - 1;
    }
  }
  return index;
}
