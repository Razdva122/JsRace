const score = document.querySelector('.score');
const start = document.querySelector('.start');
const gameArea = document.querySelector('.gameArea');
const car = document.createElement('div');

car.classList.add('car');

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};

const settings = {
  start: false,
  score: 0,
  speed: 3,
  traffic: 3,
  heightStreap: 75,
  heightCar: 100,
};

const moveRoad = () => {
  const lines = document.querySelectorAll('.line');
  lines.forEach((line) => {
    if (line.y < 0 && line.y % settings.heightStreap === -settings.speed) {
      line.y = -settings.heightStreap;
    } else if (line.y % settings.heightStreap === settings.heightStreap - settings.speed) {
      line.y = Math.floor(line.y / settings.heightStreap) * settings.heightStreap;
    } else {
      line.y += settings.speed;
    }
    line.style.top = `${line.y}px`;
  });
};

const moveEnemy = () => {
  const enemy = document.querySelectorAll('.enemy');
  enemy.forEach((item) => {
    item.y += settings.speed / 2;
    item.style.top = `${item.y}px`;
    if (item.y >= document.documentElement.clientHeight) {
      item.y = -settings.heightCar * settings.traffic;
      item.style.left = `${Math.floor(Math.random() * (gameArea.offsetWidth - 50))}px`;
    }
  });
};

const playGame = () => {
  if (settings.start) {
    moveRoad();
    moveEnemy();
    if (keys.ArrowLeft && settings.x > 0) {
      settings.x -= settings.speed;
    }
    if (keys.ArrowRight && settings.x < (gameArea.offsetWidth - car.offsetWidth)) {
      settings.x += settings.speed;
    }
    if (keys.ArrowUp && settings.y > 0) {
      settings.y -= settings.speed;
    }
    if (keys.ArrowDown && settings.y < (gameArea.offsetHeight - car.offsetHeight)) {
      settings.y += settings.speed;
    }

    car.style.left = `${settings.x}px`;
    car.style.top = `${settings.y}px`;
    requestAnimationFrame(playGame);
  }
};

const getQuanitityElements = (heightElement) =>  document.documentElement.clientHeight / heightElement + 1;

const startGame = () => {
  start.classList.add('hide');
  for (let i = -1; i < getQuanitityElements(settings.heightStreap); i += 1) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = `${i * settings.heightStreap}px`;
    line.y = i * settings.heightStreap;
    gameArea.appendChild(line);
  }

  for (let i = 0; i < getQuanitityElements(settings.heightCar * settings.traffic); i += 1) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = -settings.heightCar * settings.traffic * (i + 1);
    enemy.style.top = `${enemy.y}px`;
    enemy.style.left = `${Math.floor(Math.random() * (gameArea.offsetWidth - 50))}px`;
    enemy.style.background = "transparent url('./image/enemy2.png') center / cover no-repeat";
    gameArea.appendChild(enemy);
  }

  settings.start = true;
  gameArea.appendChild(car);
  settings.x = car.offsetLeft;
  settings.y = car.offsetTop;
  requestAnimationFrame(playGame);
};

const startRun = (event) => {
  event.preventDefault();
  keys[event.key] = true;
};

const stopRun = (event) => {
  event.preventDefault();
  keys[event.key] = false;
};

document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

start.addEventListener('click', startGame);
