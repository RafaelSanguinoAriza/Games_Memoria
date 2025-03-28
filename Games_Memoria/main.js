// Biblioteca de imágenes con solo los nombres de las imágenes
const library = {
  pokemon: ["Bulbasaur", "Charmander", "Squirtle", "Pikachu", "Mewtwo", "Mew", "Articuno", "Zapdos", "Moltres", "Eevee"],
  pixar: ["up", "buzz", "woody", "Remy", "Mike", "Nemo", "wall-e", "Mr-Incredible", "sully", "flash%20mcqueen"],
};

// URL base y rutas para las imágenes
const BASE_URL = "https://res.cloudinary.com/beumsk/image/upload/v154798";
const PATHS = {
  pokemon: "/memory/Pokemon/",
  pixar: "/memory/pixar/"
};

let images = [];
let tempElt1 = "";
let tempElt2 = "";
let click = -1;
let win = 0;
let score = 0;
let time = 0;
let numImages;

const preElt = document.querySelector("#pre-game");
const themesElt = document.querySelector("#themes");
const gameBoard = document.querySelector("#game-board");
const timeElt = document.querySelector("#time");
const scoreElt = document.querySelector("#score");
const postElt = document.querySelector("#post-game");
const finalElt = document.querySelector("#final");
const againElt = document.querySelector("#again");

// Añade un selector de dificultad
const difficultyElt = document.querySelector("#difficulty");

// Iniciar el juego con el tema elegido
themesElt.addEventListener("click", function (e) {
  if (e.target.classList.contains("theme-option")) {
    activateTheme(e.target.textContent.toLowerCase());
    preElt.classList.add("hidden");
  }
});

function activateTheme(theme) {
  // Limpia el array de imágenes
  images = [];

  // Obtiene el nivel de dificultad
  let difficulty = difficultyElt.value;

  // Elimina las clases de dificultad existentes
  gameBoard.classList.remove("easy", "medium", "hard");

  // Añade la clase de dificultad seleccionada
  gameBoard.classList.add(difficulty);

  // Determina el número de imágenes en función de la dificultad
  numImages = difficulty === "easy" ? 8 : difficulty === "medium" ? 12 : 20; // difficulty === "hard"

  // Inserta el tema en el array de imágenes
  for (let i = 0; i < numImages / 2; i++) {
    // Construye la URL completa de la imagen
    let imageUrl = BASE_URL + PATHS[theme] + library[theme][i] + ".png";
    images.push(imageUrl, imageUrl); // agrega la misma imagen dos veces para crear un par
  }

  // Mezcla el array de imágenes
  images.sort(() => Math.random() - 0.5);

  // Limpia el tablero 
  gameBoard.innerHTML = "";

  // Inserta imágenes
  for (let i = 0; i < numImages; i++) {
    let box = document.createElement("div");
    box.className = "box play card";
    box.innerHTML = "<img src='" + images[i] + "' alt='image' class='hidden card-img-top'>";
    gameBoard.appendChild(box);
  }
}

// Manejar el juego
gameBoard.addEventListener("click", gameLogic);

function gameLogic(e) {
  // Asegurarse que la casilla es jugable
  if (!e.target.classList.contains("play")) return;

  e.target.firstChild.classList.remove("hidden");

  // Primer click
  if (click < 1) {
    tempElt1 = e.target;
    // Temporizador
    if (click === -1) {
      timer = setInterval(function () {
        time++;
        timeElt.innerHTML = time;
      }, 1000);
    }
    click = 1;
  }

  // Segundo click
  else if (e.target !== tempElt1) {
    tempElt2 = e.target;

    // Imágenes diferentes
    if (tempElt1.firstChild.src !== tempElt2.firstChild.src) {
      gameBoard.removeEventListener("click", gameLogic);
      setTimeout(function () {
        tempElt1.firstChild.classList.add("hidden");
        tempElt2.firstChild.classList.add("hidden");
        gameBoard.addEventListener("click", gameLogic);
      }, 400);
      if (score > 0) {
        score -= 2;
      }
      scoreElt.innerHTML = score;
    }

    // Imágenes iguales
    else {
      score += 10;
      win += 2;
      tempElt1.firstChild.classList.add("outlined");
      tempElt2.firstChild.classList.add("outlined");
      tempElt1.classList.remove("play");
      tempElt2.classList.remove("play");
      scoreElt.innerHTML = score;

      // Victoria
      if (win === numImages) {
        clearInterval(timer);
        finalElt.innerHTML =
          "Has Ganado " + score + " puntos <br> en " + time + " segundos";
        postElt.classList.remove("hidden");
      }
    }
    click = 0;
  }
}

againElt.addEventListener("click", resetGame);

function resetGame() {
  // Reiniciar
  tempElt1 = "";
  tempElt2 = "";
  click = -1;
  win = 0;
  score = 0;
  time = 0;
  postElt.classList.add("hidden");
  preElt.classList.remove("hidden");
  for (let i = 0; i < numImages; i++) {
    let box = gameBoard.children[i];
    box.classList.add("play");
    box.firstChild.classList.add("hidden");
  }
  timeElt.textContent = time;
  scoreElt.textContent = score;
}
