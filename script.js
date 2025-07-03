// ===== 1) PARSE rawComments INTO an array of {username, comment} =====
let comments = rawComments.map((entry) => {
  const [username, comment] = entry.split(":");
  return {
    username: username.trim(),
    comment: comment.trim(),
  };
});

// ===== 2) GRAB DOM NODES =====
const addButton = document.querySelector("#addButton");
const usernameInput = document.querySelector("#usernameInput");
const commentInput = document.querySelector("#commentInput");
const addToStartCheckbox = document.querySelector("#addToStart");
const pickWinnerBtn = document.querySelector("#pick-winner-btn");
const emojiFilterButton = document.querySelector("#emojiFilterButton");
const reverseButton = document.querySelector("#reverseButton");
const listGroup = document.querySelector(".list-group");
const winnerBox = document.querySelector("#winnerBox");

// Bootstrap’s Toast API
const toastEl = document.getElementById("winnerToast");
const toastMsg = document.getElementById("winnerToastMsg");
const winnerToast = new bootstrap.Toast(toastEl, { delay: 3000 }); // auto‐dismiss after 3s

// ===== 3) WIRE UP EVENT LISTENERS =====
addButton.addEventListener("click", () => {
  const user = usernameInput.value.trim();
  const text = commentInput.value.trim();
  const atStart = addToStartCheckbox.checked;
  if (!user || !text) return;

  addComment(user, text, atStart);
  usernameInput.value = "";
  commentInput.value = "";
});

pickWinnerBtn.addEventListener("click", pickWinner);

reverseButton.addEventListener("click", () => {
  comments.reverse();
  renderComments();
});

let emojiFilterActive = false;
emojiFilterButton.addEventListener("click", () => {
  emojiFilterActive = !emojiFilterActive;
  emojiFilterButton.textContent = emojiFilterActive
    ? "Show All"
    : "Hide Emoji-Only";
  emojiFilterActive ? filterEmojiComments() : renderComments();
});

// ===== 4) CORE FUNCTIONS =====

function renderComments(list = comments) {
  listGroup.innerHTML = "";
  list.forEach((c, i) => {
    const item = document.createElement("div");
    item.className =
      "list-group-item d-flex justify-content-between align-items-center";

    const span = document.createElement("span");
    span.innerHTML = `<strong>${c.username}</strong> ${c.comment}`;
    item.appendChild(span);

    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.className = "btn btn-sm btn-outline-danger";
    btn.onclick = () => {
      comments.splice(i, 1);
      renderComments();
    };
    item.appendChild(btn);

    listGroup.appendChild(item);
  });
}

function addComment(user, text, atStart) {
  const name = user.startsWith("@") ? user : "@" + user;
  const obj = { username: name, comment: text };
  atStart ? comments.unshift(obj) : comments.push(obj);
  renderComments();
}

function pickWinner() {
  if (!comments.length) return;
  const { username, comment } =
    comments[Math.floor(Math.random() * comments.length)];
  showWinnerMessage(`🎉 Winner: ${username}: ${comment}`);
}

function showWinnerMessage(message) {
  toastMsg.textContent = message;  // put the text in the toast
  winnerToast.show();              // show it
}


function filterEmojiComments() {
  const filtered = comments.filter((c) => /\w/.test(c.comment));
  renderComments(filtered);
}

// ===== 5) INITIAL RENDER =====
renderComments();
