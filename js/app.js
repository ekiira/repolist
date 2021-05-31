const menu = document.querySelector(".menu-btn");
const menuLists = document.querySelector(".menu-lists");
const av = document.querySelectorAll(".av");
const userName = document.querySelectorAll(".user-name");
const dev = document.querySelectorAll(".dev");
const name = document.querySelectorAll(".name");
const repoCount = document.querySelectorAll(".repo-count");
const repoList = document.querySelector(".repo-lists");
const repoListMob = document.querySelector(".repo-lists-mob");
const loader = document.querySelector(".loader");

// menu toggle on mobile
menu.addEventListener("click", () => {
  if (menuLists.style.display === "block") {
    menuLists.style.display = "none";
  } else {
    menuLists.style.display = "block";
  }
});
///////

// date conversion
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function convertMonth(num) {
  return months[num - 1];
}

function convertDate(date) {
  const string = date;
  const arr1 = string.split("T");
  const arr2 = arr1[0].split("-");
  const month = convertMonth(arr2[1]);

  return `${arr2[2]} ${month}`;
}
// end of date conversion

const username = localStorage.getItem("user");

const getUserQuery = (keyword) =>
  `{ user(login: "${keyword}") { 
      avatarUrl 
      bio 
      login
      name 
      repositories(first: 20) {
          totalCount 
          edges {
              node { 
                  name 
                  updatedAt
                  description
                  isFork
                  primaryLanguage {
                      name
                      color
                  }
                  parent {
                    nameWithOwner
                    forkCount
                  }
                } 
            }
        } 
     } }`;

window.addEventListener("load", async () => {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `bearer ${PERSONAL_TOKEN}`,
    },
    body: JSON.stringify({ query: getUserQuery(username) }),
  });
  const apiData = await response.json();
  const data = apiData.data.user;

  // pre-loader
  if (data) {
    loader.className += " hidden";
  } else {
    setTimeout(() => {
      loader.className += " hidden";
    }, 1000);
  }

  if (!data) {
    window.location.href = "404.html";
  }
  let i;
  // set avatar
  for (i = 0; i < av.length; i++) {
    av[i].src = data.avatarUrl;
  }

  // set username
  for (i = 0; i < userName.length; i++) {
    userName[i].innerHTML = data.login;
  }

  // set Bio
  for (i = 0; i < dev.length; i++) {
    dev[i].innerHTML = data.bio;
  }

  // set Full name
  for (i = 0; i < name.length; i++) {
    name[i].innerHTML = data.name;
  }

  // set repositories count
  for (i = 0; i < repoCount.length; i++) {
    repoCount[i].innerHTML = data.repositories.totalCount;
  }

  // repositories
  const repos = data.repositories.edges;

  const template = (data) =>
    `<div class="repo-list">
        <div class="repo-details">
          <p class="repo-name">${data?.node?.name}</p>
          ${
            data.node.isFork === true
              ? ` <p class="forked">Forked from <span>${data.node.parent.nameWithOwner}</span></p>`
              : ""
          } 
          ${
            data.node.description
              ? `<p class="repo-info"> ${data.node.description}</p>`
              : ""
          }
          
          <div class="repo-detail">
          ${
            data?.node?.primaryLanguage?.name
              ? `
          <div class="repo-detailP language">
          <div class="lang-icon" 
          style=${
            data?.node?.primaryLanguage?.color
              ? `"background-color: ${`${data?.node?.primaryLanguage?.color}`}"`
              : ``
          }
          ></div>
          <div class="language-name">${
            data?.node?.primaryLanguage?.name || ""
          }</div>
        </div>`
              : ``
          }
          
            ${
              data.node.isFork === true
                ? `<div class="repo-detailP fork">
              <img src="./assets/fork.svg" class="repo-icons" alt="fork-icon" />
              <div class="forked-num">${data.node.parent.forkCount}</div>
            </div>`
                : ""
            } 
            <div class="repo-detailP update">Updated on ${convertDate(
              data.node.updatedAt
            )}
            </div>
          </div>
        </div>

        <div class="repo-btn">
          <button class="star-btn">
            <img src="./assets/star.svg" class="btn-icon" alt="star-icon"/>
            Star
          </button>
        </div>
  </div>`;

  const mobileTemplate = (data) =>
    `
    <div class="repo-list">
    <div class="repo-details">
      <p class="repo-name">${data.node.name}</p>
      ${
        data.node.isFork === true
          ? ` <p class="forked">Forked from <span>${data.node.parent.nameWithOwner}</span></p>`
          : ""
      }
      ${
        data.node.description
          ? `<p class="repo-info-mob"> ${data.node.description}</p>`
          : ""
      }
      <div class="repo-detail-mob">
      ${
        data?.node?.primaryLanguage?.name
          ? `
      <span class="repo-detailP language-mob">
      <span class="language-name-mob-circle" 
      style=${
        data?.node?.primaryLanguage?.color
          ? `"background-color: ${`${data?.node?.primaryLanguage?.color}`}"`
          : ``
      }
      ></span>
      <span class="language-name-mob">${
        data?.node?.primaryLanguage?.name || ""
      }</span>
    </span>`
          : ``
      }

      ${
        data.node.isFork === true
          ? `<span class="repo-detailP fork-mob">
        <img src="./assets/fork.svg" class="repo-icons" alt="fork-icon" />
        <span class="forked-num">${data.node.parent.forkCount}</span>
      </span>`
          : ""
      } 
      <span class="repo-detailP update-mob">Updated on ${convertDate(
        data.node.updatedAt
      )}
      </span>
    </div>
  </div>

    <div class="repo-btn-mob">
      <div class="btn-mob">
        <button class="star-btn">
          <img src="./assets/star.svg" class="btn-icon" alt="star-icon"/>
          Star
        </button>
      </div>
    </div>
  </div>

    `;

  // set repositories list
  repoList.innerHTML = repos.map((item) => template(item)).join("");

  // set repositories list for mobile
  repoListMob.innerHTML = repos.map((item) => mobileTemplate(item)).join("");
});
