const readline = require("readline");
const prompt = require("prompt-sync")({ sigint: true });

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
  constructor(field) {
    this.field = field;
    this.you = [0, 0]; // posizione iniziale del giocatore
    this.hat = this.generateRandomPosition(); // posizione casuale del cappello
  }

  move(direction) {
    const [y, x] = this.you;

    // Muovi il giocatore in base alla direzione
    switch (direction.toLowerCase()) {
      case "w":
        if (y > 0) this.you = [y - 1, x];
        break;
      case "s":
        if (y < this.field.length - 1) this.you = [y + 1, x];
        break;
      case "a":
        if (x > 0) this.you = [y, x - 1];
        break;
      case "d":
        if (x < this.field[0].length - 1) this.you = [y, x + 1];
        break;
      default:
        console.log("Invalid direction!");
        break;
    }
  }

  checkGameResult() {
    const [y, x] = this.you;

    if (this.field[y][x] === hat) {
      console.log("Congratulations! You found your hat!");
      return true;
    } else if (this.field[y][x] === hole) {
      console.log("Game Over! You fell into a hole.");
      return true;
    } else {
      return false;
    }
  }

  print() {
    for (let i = 0; i < this.field.length; i++) {
      let row = '';
      for (let j = 0; j < this.field[i].length; j++) {
        if (i === this.you[0] && j === this.you[1]) {
          row += pathCharacter;
        } else {
          row += this.field[i][j];
        }
      }
      console.log(row);
    }
    console.log(`You are at position (${this.you[0]}, ${this.you[1]})`);
  }


  askNextMove() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question("Which direction would you like to move? (w/a/s/d): ", answer => {
      this.move(answer.trim());
      this.print();
      if (!this.checkGameResult()) {
        this.askNextMove();
      } else {
        rl.close();
      }
    });
  }

  generateRandomPosition() {
    const y = Math.floor(Math.random() * (this.field.length - 1 + 1) + 2);
    const x = Math.floor(Math.random() * (this.field[0].length - 1 + 1) + 2);
    return [y, x];
  }

  static generateField(height, width) {
    const field = [];

    // Genera un campo vuoto
    for (let i = 0; i < height; i++) {
      const row = [];
      for (let j = 0; j < width; j++) {
        row.push(fieldCharacter);
      }
      field.push(row);
    }

    // Posiziona il cappello in una posizione casuale
    const [hatY, hatX] = Field.generateRandomPosition(height, width);
    field[hatY][hatX] = hat;

    // Posiziona le buche in posizioni casuali
    const numHoles = Math.floor((height * width) / 4); // supponiamo che il 25% del campo sia costituito da buche
    for (let i = 0; i < numHoles; i++) {
      const [holeY, holeX] = Field.generateRandomPosition(height, width);
      if (field[holeY][holeX] !== hat) {
        field[holeY][holeX] = hole;
      }
    }

    return field;
  }

  static generateRandomPosition(height, width) {
    const y = Math.floor(Math.random() * height);
    const x = Math.floor(Math.random() * width);
    return [y, x];
  }
}

const height = 10; // altezza del campo
const width = 10; // larghezza del campo
const myField = new Field(Field.generateField(height, width));
myField.print();
myField.askNextMove();
