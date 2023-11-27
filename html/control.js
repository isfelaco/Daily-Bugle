// front end JS for Daily Bugle app
const endpoint = {};
endpoint["articles"] = "http://localhost:8080/api/articles";
endpoint["users"] = "http://localhost:8080/api/users";
endpoint["ads"] = "http://localhost:8080/api/ads";

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

function showCommenterView() {
  fetch("commenter.html")
    .then((response) => response.text())
    .then((html) => {
      const content = document.getElementById("content");
      content.innerHTML = html;

      // setup login/logout controls
      var curUser = document.getElementById("curUser");
      curUser.style.display = "none";
      var openModal = document.getElementById("openModal");
      openModal.style.display = "block";
      document.getElementById("logOutBtn").style.display = "none";

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

      // populate article previews
      fetchArticles().then((articles) => {
        if (articles.length > 0) {
          document.getElementById("article1Title").innerHTML =
            articles[0].title;
          document.getElementById("article1").innerHTML = articles[0].body;
        }
        if (articles.length > 1) {
          document.getElementById("teaser2Title").innerHTML = articles[1].title;
          document.getElementById("teaser2").innerHTML = articles[1].teaser;
        }
        if (articles.length > 2) {
          document.getElementById("teaser3Title").innerHTML = articles[2].title;
          document.getElementById("teaser3").innerHTML = articles[2].teaser;
        }
      });

      // populate ads
      fetchAd().then((ad) => {
        updateAdViews(ad);

        document.getElementById("adTitle").innerHTML = ad.title;
        document.getElementById("adBody").innerHTML = ad.body;

        document.getElementById("ad").onclick = function () {
          updateAdClicks(ad);
        };
      });
    })
    .catch((error) =>
      console.error("Error fetching commenter content:", error)
    );
}

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
      // populate the page with article info
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

      // populate ads
      fetchAd().then((ad) => {
        updateAdViews(ad);

        document.getElementById("adTitle").innerHTML = ad.title;
        document.getElementById("adBody").innerHTML = ad.body;

        document.getElementById("ad").onclick = function () {
          updateAdClicks(ad);
        };
      });
    })
    .catch((error) => console.error("Error fetching reader content:", error));
}

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

// calls show view functions
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

// only called in reader.html to submit a comment
function updateSubmitButton() {
  var submitComment = document.getElementById("submitComment");
  var commentInput = document.getElementById("commentInput");
  submitComment.disabled = commentInput.value.trim() === "";
}

// only called in commenter.html modal to login
function updateLoginButton() {
  var usernameInput = document.getElementById("usernameInput");
  var passwordInput = document.getElementById("passwordInput");
  var loginBtn = document.getElementById("loginBtn");
  loginBtn.disabled =
    usernameInput.value.trim() === "" || passwordInput.value.trim() === "";
}

// renders an article in reader view
function renderArticle(article) {
  document.getElementById("articleTitle").innerHTML = article.title;
  document.getElementById("articleBody").innerHTML = article.body;
  document.getElementById("articleId").value = article._id;

  var comments = document.getElementById("articleComments");
  comments.innerHTML = "";
  if (!article.comments) comments.innerHTML = "No comments";
  else {
    let list = document.createElement("ul");
    for (const comment of article.comments) {
      let item = document.createElement("li");
      item.innerHTML = comment;
      list.append(item);
    }
    comments.append(list);
  }
}

// navigates through existing articles in reader view
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

/*
  API CALLS
*/

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
  await fetch(endpoint["articles"], {
    method: "PUT",
    headers: {
      Accept: "application/JSON",
      "Content-type": "application/json",
    },
    body: JSON.stringify(dataToUpdate),
  }).catch((error) => console.log("error adding comment"));

  location.reload();
}

// fetch a user based on username
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

// create a user from current form data
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

// login a user from sent form data
async function loginUser(event) {
  event.preventDefault();

  var form = event.target.closest("form");

  var username = form.querySelector("#usernameInput").value;
  var password = form.querySelector("#passwordInput").value;
  var userType = form.querySelector("#userTypeInput").value;

  const result = await fetchUser(username);

  // authenticate user and pass
  var loginMessage = document.getElementById("loginMessage");
  if (result.found) {
    if (result.user.password === password && result.user.type === userType) {
      localStorage.setItem("username", username);
      localStorage.setItem("userType", userType);
      loadContent(viewType[localStorage.userType]);
    } else {
      document.getElementById("loginMessage").innerHTML = "Incorrect password.";
    }
  } else {
    document.getElementById("createUserBtn").style.display = "block";
    document.getElementById(
      "loginMessage"
    ).innerHTML = `No ${userType} was found with that username and password. Would you like to create one?`;
  }

  return false;
}

// create a basic ad (tester, not used)
async function createAd() {
  const adData = {
    title: "Ad 1 Title",
    body: "Ad 1 Body",
    views: 0,
    clicks: 0,
  };
  await fetch(endpoint["ads"], {
    method: "POST",
    headers: {
      Accept: "application/JSON",
      "Content-type": "application/json",
    },
    body: JSON.stringify(adData),
  })
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((error) => console.log("error saving ad: ", error));
}

// fetch a random ad
async function fetchAd() {
  let ads = fetch(endpoint["ads"]);
  return ads
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}

// increment ad clicks
async function updateAdClicks(ad) {
  const dataToUpdate = {
    id: ad._id,
    clicks: ad.clicks + 1,
  };

  await fetch(endpoint["ads"], {
    method: "PUT",
    headers: {
      Accept: "application/JSON",
      "Content-type": "application/json",
    },
    body: JSON.stringify(dataToUpdate),
  }).catch((error) => console.log("error updating ad"));
}

// increment ad views
async function updateAdViews(ad) {
  const dataToUpdate = {
    id: ad._id,
    views: ad.views + 1,
  };

  await fetch(endpoint["ads"], {
    method: "PUT",
    headers: {
      Accept: "application/JSON",
      "Content-type": "application/json",
    },
    body: JSON.stringify(dataToUpdate),
  }).catch((error) => console.log("error updating ad"));
}
