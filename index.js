const score = document.querySelector('.score');
const start = document.querySelector('.start');
const gameArea = document.querySelector('.gameArea');
const car = document.createElement('div');
const recordsEl = document.querySelector('.records');

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
  speed: 10,
  traffic: 3,
  heightStreap: 75,
  heightCar: 100,
};

const updateRecord = () => {
  if (localStorage.getItem('records')) {
    const records = JSON.parse(localStorage.getItem('records'));
    recordsEl.innerHTML = '';
    records.forEach((record) => {
      recordsEl.innerHTML += `
        <div class="record">
          <div class="name">
            <p>
              ${record.name}
            </p>
          </div>
          <div class="points">
             ${record.result}
          </div>
        </div>`;
    });
  }
};


document.addEventListener('DOMContentLoaded', () => {
  updateRecord();
  const records = document.querySelector('.records');
  records.style.left = `${document.documentElement.clientWidth * 0.5 - 200}px`;
});

window.addEventListener('resize', () => {
  const records = document.querySelector('.records');
  records.style.left = `${document.documentElement.clientWidth * 0.5 - 200}px`;
});

const moveRoad = () => {
  const lines = document.querySelectorAll('.line');
  lines.forEach((line) => {
    const amountOfMoves = Math.floor(settings.heightStreap / settings.speed);
    const height = settings.heightStreap;
    if (line.y < 0 && line.y % height === -(height - amountOfMoves * settings.speed)) {
      line.y = -height;
    } else if (line.y % height === amountOfMoves * settings.speed) {
      line.y = Math.floor(line.y / height) * height;
    } else {
      line.y += settings.speed;
    }
    line.style.top = `${line.y}px`;
  });
};

const saveRecord = (result) => {
  if (localStorage.getItem('records')) {
    const records = JSON.parse(localStorage.getItem('records'));
    if (records.length < 10 || records[9].result < result) {
      const name = prompt('Введите ваше имя.');
      records.push({ name, result });
    }
    records.sort((a, b) => b.result - a.result);
    if (records.length > 10) {
      records.length = 10;
    }
    localStorage.setItem('records', JSON.stringify(records));
    updateRecord();
  } else {
    const name = prompt('Введите ваше имя.');
    localStorage.setItem('records', JSON.stringify([{ name, result }]));
    updateRecord();
  }
};

const moveEnemy = () => {
  const enemy = document.querySelectorAll('.enemy');
  enemy.forEach((item) => {
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();

    if (carRect.top <= enemyRect.bottom
      && carRect.right >= enemyRect.left
      && carRect.left <= enemyRect.right
      && carRect.bottom >= enemyRect.top) {
      settings.start = false;
      start.classList.remove('hide');
      start.style.top = `${score.offsetHeight}px`;
      saveRecord(settings.score);
    }

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
    settings.score += settings.speed;
    score.textContent = `Score: ${settings.score}`;
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

const getQuanitityElements = (heightElement) =>  document.documentElement.clientHeight / heightElement;

const startGame = () => {
  start.classList.add('hide');
  gameArea.innerHTML = '';

  for (let i = -1; i < getQuanitityElements(settings.heightStreap); i += 1) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = `${i * settings.heightStreap}px`;
    line.y = i * settings.heightStreap;
    gameArea.appendChild(line);
  }

  for (let i = 0; i <= getQuanitityElements(settings.heightCar * settings.traffic); i += 1) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = -settings.heightCar * settings.traffic * (i + 1);
    enemy.style.top = `${enemy.y}px`;
    enemy.style.left = `${Math.floor(Math.random() * (gameArea.offsetWidth - 50))}px`;
    enemy.style.background = "transparent url('./image/enemy2.png') center / cover no-repeat";
    gameArea.appendChild(enemy);
  }

  settings.score = 0;
  settings.start = true;
  gameArea.appendChild(car);

  car.style.left = `${(gameArea.offsetWidth - car.offsetWidth) / 2}px`;
  car.style.top = 'auto';
  car.style.bottom = '10px';

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