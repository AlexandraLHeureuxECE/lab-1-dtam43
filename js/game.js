'use strict';

/*
  ===== DOM ELEMENTS =====
*/
const statusText = document.getElementById('status');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const themeToggleButton = document.getElementById('theme-toggle');

/*
  ===== GAME STATE =====
*/
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
// Keyboard selection state
let selectedIndex = 0; // default to top-left cell
// Apply initial selection
cells[selectedIndex].classList.add('selected');

/*
  ===== CONSTANTS =====
*/
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/*
  ===== FUNCTIONS =====
*/
function handleCellClick(event) {
  const cell = event.target;
  const index = Number(cell.dataset.index);

  // Ignore click if game is over or cell already filled
  if (!gameActive || board[index] !== '') {
    return;
  }

  makeMove(cell, index);
  checkGameResult();
}

function makeMove(cell, index) {
  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
}

function checkGameResult() {
  if (checkWin()) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (checkDraw()) {
    statusText.textContent = 'Draw!';
    gameActive = false;
    return;
  }

  switchPlayer();
}

function checkWin() {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => board[index] === currentPlayer);
  });
}

function checkDraw() {
  return board.every(cell => cell !== '');
}

function switchPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;

  statusText.textContent = `Player ${currentPlayer}'s turn`;

  cells.forEach(cell => {
    cell.textContent = '';
  });
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  themeToggleButton.textContent = '☀️ Light Mode';
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeToggleButton.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function handleKeyboardInput(event) {
  if (!gameActive) return; // optionally allow navigation even after game end

  const row = Math.floor(selectedIndex / 3);
  const col = selectedIndex % 3;

  switch (event.key) {
    case 'ArrowUp':
      if (row > 0) updateSelection(selectedIndex - 3);
      break;
    case 'ArrowDown':
      if (row < 2) updateSelection(selectedIndex + 3);
      break;
    case 'ArrowLeft':
      if (col > 0) updateSelection(selectedIndex - 1);
      break;
    case 'ArrowRight':
      if (col < 2) updateSelection(selectedIndex + 1);
      break;
    case 'Enter':
    case ' ':
      event.preventDefault(); // prevent scrolling
      const cell = cells[selectedIndex];
      handleCellClick({ target: cell });
      break;
  }
}

function updateSelection(newIndex) {
  cells[selectedIndex].classList.remove('selected');
  selectedIndex = newIndex;
  cells[selectedIndex].classList.add('selected');
  cells[selectedIndex].focus(); // optional, improves accessibility
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  statusText.textContent = `Player ${currentPlayer}'s turn`;

  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('selected');
  });

  selectedIndex = 0;
  cells[selectedIndex].classList.add('selected');
  cells[selectedIndex].focus();
}

/*
  ===== EVENT LISTENERS =====
*/
cells.forEach(cell => {
  cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', resetGame);
themeToggleButton.addEventListener('click', toggleTheme);
document.addEventListener('keydown', handleKeyboardInput);