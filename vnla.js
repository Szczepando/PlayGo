class Stone {
  constructor (corX, corY, color, nomero, liberties) {
    this.corX = corX;
    this.corY = corY;
    this.color = color;
    this.nomero = nomero.toString();
    this.liberties = liberties;
  };
  
  draw (context, width, height, paddingW, paddingH, r) {
    context.beginPath();
    context.fillStyle = this.color;
    const xDraw = paddingW + width * (this.corX - 1);
    const yDraw = paddingH + height * (this.corY - 1);
    context.arc(xDraw, yDraw, r, 0, Math.PI * 2);
    context.fill();
  };

  mark (context, width, height, paddingW, paddingH, r) {
    context.beginPath();
    this.color == 'black' ? context.strokeStyle = 'white' : context.strokeStyle = 'black';
    context.lineWidth = r * .15
    const xDraw = paddingW + width * (this.corX - 1);
    const yDraw = paddingH + height * (this.corY - 1);
    context.arc(xDraw, yDraw, r * .5, 0, Math.PI * 2);
    context.stroke();

  };

  moveNo (context, width, height, paddingW, paddingH, r) {
    context.beginPath();
    this.color == 'black' ? context.fillStyle = 'white' : context.fillStyle = 'black';
    context.font = `${r * 1.2}px sans serif`;
    context.textBaseline = 'middle';
    const textMetric = context.measureText(this.nomero);
    const textW = textMetric.actualBoundingBoxLeft - textMetric.actualBoundingBoxRight
    const xDraw = paddingW + width * (this.corX - 1) + textW * .5;
    const yDraw = paddingH + height * (this.corY - 1);
    context.fillText(this.nomero, xDraw, yDraw);
    // console.log(no);s
  };

  libCount (context, width, height, paddingW, paddingH, r) {
    context.beginPath();
    this.color == 'black' ? context.fillStyle = 'white' : context.fillStyle = 'black';
    context.font = `${r * 1.2}px sans serif`;
    context.textBaseline = 'middle';
    const textMetric = context.measureText(this.liberties);
    const textW = textMetric.actualBoundingBoxLeft - textMetric.actualBoundingBoxRight
    const xDraw = paddingW + width * (this.corX - 1) + textW * .5;
    const yDraw = paddingH + height * (this.corY - 1);
    let libNo;
    this.liberties < 0 ? libNo = 0 : libNo = this.liberties;
    context.fillText(libNo, xDraw, yDraw);
  };
};

let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');

var colors = ['black', 'white']
var turnColor = colors[0];
var moveNumber = 1;
let removedStones = [];

const coords = ['A','B','C','D','E','F','G','H','J','K','L','M','N','O','P','Q','R','S','T']
const hexList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

let stones = [];

const draw = () => {
  const cw = Math.min(window.innerHeight, window.innerWidth);
  const ch = Math.min(window.innerHeight, window.innerWidth);
  
  context.canvas.width = cw;
  context.canvas.height = ch;
  
  context.beginPath();
  context.fillStyle = '#db6';
  context.fillRect(0, 0, cw, ch);
  context.fill();
  
  // context.fillStyle = '#ffee88';
  // context.fillStyle = '#edd';
  // context.strokeStyle = '#dee';
  
  context.lineWidth = 1;

  let x, y;
  const paddingW = cw * .05;
  const paddingH = cw * .05;
  const dimensionW = 18;
  const dimensionH = 18;
  const width = (cw - paddingW * 2) / dimensionW;
  const height = (ch - paddingH * 2) / dimensionH;
  const stoneSize = Math.min(width, height) * .95 * .5;
  const margin = 0;

  context.beginPath();
  context.rect(paddingW, paddingH, width * (dimensionW), height * (dimensionH));
  context.stroke();

  let nomero;

  for (let i = 0; i < dimensionW - 1; i++) {
    for (let j = 0; j < dimensionH - 1; j++) {
      context.strokeStyle = '#000';
      x = paddingW + (width + margin) * (0 + i);
      y = paddingH + (width + margin) * (0 + j);
      if (i == dimensionH - 2) {
        context.beginPath();
        context.moveTo(x + width, y + height);
        context.lineTo(x + width * 2, y + height);
        context.stroke();
      };
      if (j == dimensionW - 2) {
        context.beginPath();
        context.moveTo(x + width, y + height);
        context.lineTo(x+ width, y + height * 2);
        context.stroke();
      };
      if ( (i == 2 || i == 8  || i == 14) & (j == 2 || j == 8 || j == 14) ) {
        context.beginPath();
        context.arc(x + width, y + height, 4, 0, Math.PI * 2);
        context.fillStyle = 'black';
        context.fill();
      };

      context.beginPath();
      context.moveTo(x + width, y + height);
      context.lineTo(x, y + height);
      context.moveTo(x + width, y + height);
      context.lineTo(x + width, y);
      context.stroke();
    };

  };

  requestAnimationFrame(draw);

  stones.forEach( stone => {
    if (stone.liberties > 0) {
      stone.draw(context, width, height, paddingW, paddingH, stoneSize);
      // stone.moveNo(context, width, height, paddingW, paddingH, stoneSize);
      stone.libCount(context, width, height, paddingW, paddingH, stoneSize);
      if(stones.indexOf(stone) == stones.length -1) {
        stone.mark(context, width, height, paddingW, paddingH, stoneSize);
      };
    };
  });
  
  
};
requestAnimationFrame(draw);

// setInterval(draw, 200);

const mouseClick = (e) => {

  const cw = Math.min(window.innerHeight, window.innerWidth);
  const ch = cw;
  const paddingW = cw * .05;
  const paddingH = cw * .05;
  const dimensionW = 18;
  const dimensionH = 18;
  const width = (cw - paddingW * 2) / dimensionW;
  const height = (ch - paddingH * 2) / dimensionH;
  // const stoneSize = Math.min(width, height) * .9 * .5;
  
  const contextStart = canvas.getBoundingClientRect().left;

  const stoneX = e.clientX - contextStart;
  const stoneY = e.clientY;
  const corX = Math.round((stoneX - paddingW * 2 + width) / width) + 1;
  const corY = Math.round((stoneY - paddingH * 2 + height) / height) + 1;

  if (corX > 0 && corY > 0 && corX <= 19 && corY <= 19) {
    if (stones.some(e => e.corX == corX && e.corY == corY)) {
      let clickedStone = stones.find(obj => obj.corX == corX && obj.corY == corY);
      moveNumber = clickedStone.nomero;
      removedStones.push(clickedStone.nomero);
      removedStones.sort(function(a, b){return a-b});
      stones.splice(stones.indexOf(clickedStone), 1);
    } else {
      // removedStones.length == 0 ? moveNumber = stones.length + 1 : moveNumber = removedStones[0];
      if (removedStones.length == 0) {
        moveNumber = stones.length + 1;
      } else {
        moveNumber = removedStones[0];
        removedStones.shift();
      };
      turnColor = colors[(moveNumber - 1) % 2];
      // console.log((moveNumber - 1) % 2);
      let enemyStones = stones.filter(s => s.color != turnColor && s.liberties > 0);
      let cornerEdge = (corX == 1 || corX == 19) + (corY == 1 || corY == 19);
      const liberties = 4 - cornerEdge - enemyStones.filter(s => s.corX == corX && Math.abs(corY - s.corY) == 1 || s.corY == corY && Math.abs(corX - s.corX) == 1 ).length;
      let stone = new Stone(corX, corY, turnColor, moveNumber, liberties);
      stones.splice(moveNumber - 1, 0, stone);      

      // moveNumber = stones.length + 1;
    };
    stones.forEach( stone => {
      // stone.liberties = stones.filter(s => (s.corX == stone.corX - 1 || s.corX == stone.corX + 1) && (s.corY == stone.corY - 1 || s.corY == stone.corY + 1)).length;
      // enemyStones = stones.filter(s => s.color != stone.color && s.liberties > 0);
      // stone.liberties = 4 - stones.filter(s => (s.color != stone.color && s.liberties > 0) && (s.corX == stone.corX && Math.abs(stone.corY - s.corY) == 1 || s.corY == stone.corY && Math.abs(stone.corX - s.corX) == 1) ).length;
      let enemyStones = stones.filter(s => s.color != stone.color && s.liberties > 0);
      stone.liberties = 4 - enemyStones.filter(s => s.corX == stone.corX && Math.abs(stone.corY - s.corY) == 1 || s.corY == stone.corY && Math.abs(stone.corX - s.corX) == 1 ).length;
    });
  };

};

draw();


document.addEventListener('click', mouseClick);

// const start = async () => {
//   manager = await draw();
// };

// start();