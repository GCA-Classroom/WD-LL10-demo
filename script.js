// ====== GLOBAL STATE ======
let comments = []; // Stores all added comments


// ====== DOM ELEMENT REFERENCES ======
const addButton = document.querySelector('#addButton');
const usernameInput = document.querySelector('#usernameInput');
const commentInput = document.querySelector('#commentInput');
const addToStartCheckbox = document.querySelector('#addToStart');

const pickWinnerBtn = document.querySelector('#pick-winner-btn');
const emojiFilterButton = document.querySelector('#emojiFilterButton');
const reverseButton = document.querySelector('#reverseButton');


// ====== EVENT LISTENERS ======

// Add Comment button
addButton.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  const comment = commentInput.value.trim();
  const addToStart = addToStartCheckbox.checked;

  if (username && comment) {
    addComment(username, comment, addToStart);
    usernameInput.value = '';
    commentInput.value = '';
  }
});

// Pick Winner button
pickWinnerBtn.addEventListener('click', pickWinner);

// Toggle Emoji Filter button
let emojiFilterActive = false;
emojiFilterButton.addEventListener('click', () => {
  emojiFilterActive = !emojiFilterActive;
  emojiFilterButton.textContent = emojiFilterActive ? 'Show All' : 'Hide Emoji-Only';

  if (emojiFilterActive) {
    filterEmojiComments();
  } else {
    renderComments();
  }
});

// Reverse List button
reverseButton.addEventListener('click', reverseOrder);


// ====== CORE FUNCTIONS ======

/**
 * Adds a comment to the list
 * @param {string} username - Username (with or without @)
 * @param {string} comment - The comment text
 * @param {boolean} addToStart - Whether to add to start or end
 */
function addComment(username, comment, addToStart) {
  const formattedUsername = username.startsWith('@') ? username : '@' + username;
  const newComment = { username: formattedUsername, comment };

  if (addToStart) {
    comments.unshift(newComment);
  } else {
    comments.push(newComment);
  }

  renderComments();
}

/**
 * Randomly picks a comment and displays the winner
 */
function pickWinner() {
  if (comments.length === 0) return;

  const randomIndex = Math.floor(Math.random() * comments.length);
  const winner = comments[randomIndex];
  const message = `🎉 Winner: ${winner.username}: ${winner.comment}`;
  
  showWinnerMessage(message);
}

/**
 * Displays a winner message in the UI
 * @param {string} message - Formatted message to show
 */
function showWinnerMessage(message) {
  const winnerBox = document.querySelector('#winnerBox');
  if (winnerBox) {
    winnerBox.textContent = message;
    winnerBox.style.display = 'block';
  }
}

/**
 * Renders all comments (or filtered subset)
 * @param {Array} commentList - List of comments to display
 */
function renderComments(commentList = comments) {
  const listGroup = document.querySelector('.list-group');
  listGroup.innerHTML = ''; // Clear existing items

  commentList.forEach((c, index) => {
    const listItem = document.createElement('div');
    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

    const content = document.createElement('span');
    content.innerHTML = `<strong>${c.username}</strong> ${c.comment}`;
    listItem.appendChild(content);

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '❌';
    removeBtn.className = 'btn btn-sm btn-outline-danger';
    removeBtn.onclick = () => {
      comments.splice(index, 1);
      renderComments();
    };
    listItem.appendChild(removeBtn);

    listGroup.appendChild(listItem);
  });
}

/**
 * Reverses the current order of comments
 */
function reverseOrder() {
  comments.reverse();
  renderComments();
}

/**
 * Filters out comments that only contain emojis
 */
function filterEmojiComments() {
  const filtered = comments.filter(c => /\w/.test(c.comment)); // At least one alphanumeric
  renderComments(filtered);
}

/**
 * (Optional) Removes a comment by index - not used directly, but could be reused
 */
function removeComment(index) {
  comments.splice(index, 1);
  renderComments();
}

/**
 * (Optional) Filter list by search input (user/comment) — implement if needed
 */
function filterList(searchTerm, searchUsers) {
  // Not implemented — add if you want live search!
}
