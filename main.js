const readline = require("readline")

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';


class Field {
  constructor(field){
    this.you = [0, 0];
    this.field = field;
  }


  print() {
    for (let i = 0; i < this.field.length; i++) {
      let riga = '';
      for (let j = 0; j < this.field[i].length; j++) {
        if (i === this.you[0] && j === this.you[1]) {
          riga += pathCharacter;
        } else {
          riga += this.field[i][j];
        }
      }
      console.log(riga);
    }
    /* console.log(`Sei nella posizione (${this.you[0]}, ${this.you[1]})`); */
  }


  askNextMove() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    rl.question('In che direzione ti vuoi muovere? (w/a/s/d)', answer => {
      this.move(answer.trim())
      this.print()
      if(this.checkResult() === false){
        this.askNextMove()
      }else{
        rl.close()
      }
    })
  }

  checkResult() {
    const [x, y] = this.you;

    if (this.field[x][y] === hat) {
      console.log("Hai trovato il cappello!!!");
      return true;
    } else if (this.field[x][y] === hole) {
      console.log("Sei Caduto nel Buco!");
      return true;
    } else {
      return false;
    }
  }

  move(direction){
    let [x, y] = this.you
    
    switch (direction.toLowerCase()) {
      case "w":
        if (x > 0) this.you = [x - 1, y];
        break;
      case "s":
        if (x < this.field.length - 1) this.you = [x + 1, y];
        break;
      case "a":
        if (y > 0) this.you = [x, y - 1];
        break;
      case "d":
        if (y < this.field[0].length - 1) this.you = [x, y + 1];
        break;
      default:
        console.log("Cambia direzione!");
        break;
    }
  }


  static generateField(width, height, numberHoles) {
    let field = [];
    for(let i = 0; i < width; i++) {
        let base = []
      for(let j = 0; j < height; j++) {
        base.push(fieldCharacter) 
      }
      field.push(base)
    }

    function randomPositions(){
      let randomWidth = Math.floor(Math.random() * width);
      let randomHeight = Math.floor(Math.random() * height);
      return [randomWidth, randomHeight]
    }

    const [hatX, hatY] = randomPositions()
    field[hatX][hatY] = hat;

    for(let h = 0; h < numberHoles; h++){
      let [holeX, holeY] = randomPositions()
      if((holeX !== hatX || holeY !== hatY) && (holeX !== 0 || holeY !== 0)) {
          field[holeX][holeY] = hole;
      }
      else{
        h--
      }
    }
    
    return field
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let dimension
let holes

rl.question('Quando grande lo vuoi il campo?', answer => {
  dimension = answer ? answer.trim() : 6;
  rl.question('Quanti buchi vuoi generare? (piu il numero è grande e più sarà difficile)', answer2 => {
    holes = answer2 ? answer2.trim() : 4;
    const myField= new Field(Field.generateField(dimension, dimension, holes))
    myField.print();
    myField.askNextMove()
    rl.close
  })
})

