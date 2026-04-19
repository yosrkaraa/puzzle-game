const board = document.getElementById("board");
let size = 3;
let pieces = [];

let image = localStorage.getItem("image") || "img1.jpg";

// ⏱️ TIMER
let time = 0;
let paused = false;

let timer = setInterval(() => {
  if (!paused) {
    time++;
    document.getElementById("time").innerText = time;
  }
}, 1000);

// 🔢 MOVES
let moves = 0;

// ⏸️ PAUSE
function togglePause() {
  paused = !paused;

  document.getElementById("pauseBtn").innerText =
    paused ? "▶" : "⏸";
}

// CREATE PIECES
for (let i = 0; i < size * size; i++) {
  let piece = document.createElement("div");
  piece.classList.add("piece");

  let x = i % size;
  let y = Math.floor(i / size);

  piece.style.backgroundImage = `url(${image})`;
  piece.style.backgroundPosition = `-${x * 100}px -${y * 100}px`;

  piece.dataset.index = i;

  pieces.push(piece);
}

// SHUFFLE
pieces.sort(() => Math.random() - 0.5);

// RENDER
pieces.forEach(p => board.appendChild(p));

// CLICK SWAP
let first = null;

pieces.forEach(piece => {
  piece.onclick = () => {
    if (paused) return;

    if (!first) {
      first = piece;
      piece.style.border = "3px solid red";
    } else {
      let second = piece;

      let i1 = pieces.indexOf(first);
      let i2 = pieces.indexOf(second);

      [pieces[i1], pieces[i2]] = [pieces[i2], pieces[i1]];

      first.style.border = "1px solid black";
      first = null;

      board.innerHTML = "";
      pieces.forEach(p => board.appendChild(p));

      moves++;
      document.getElementById("moves").innerText = moves;

      checkWin();
    }
  };
});

// 🎉 WIN
function checkWin() {
  let win = pieces.every((p, i) => p.dataset.index == i);

  if (win) {
    clearInterval(timer);

    let popup = document.createElement("div");
    popup.className = "win-popup";

    popup.innerHTML = `
      <div class="win-box">
        <h2>🎉 Congratulations!</h2>
        <p>You completed the puzzle!</p>

        <p>${moves} Moves | ${time}s</p>

        <button onclick="restartGame()">Restart</button>
        <button onclick="goChoose()">Choose Image</button>
      </div>
    `;

    document.body.appendChild(popup);
  }
}

// 🔄 BUTTONS
function restartGame() {
  location.reload();
}

function goChoose() {
  window.location.href = "choose.html";
}