let cellsToRemove = 56

function generateSudokuBoard(cellsToRemove) {
    const board = Array.from({ length: 9 }, () => new Array(9).fill(0));
  
    function isValid(num, row, col) {
      for (let i = 0; i < 9; i++) {
        const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
        const n = 3 * Math.floor(col / 3) + i % 3;
        if (board[row][i] === num || board[i][col] === num || board[m][n] === num) {
          return false;
        }
      }
      return true;
    }
  
    function fillBoard(row, col) {
      if (col === 9) {
        col = 0;
        row++;
      }
  
      if (row === 9) {
        return true;
      }
  
      const choices = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      choices.sort(() => Math.random() - 0.5);
  
      for (let i = 0; i < choices.length; i++) {
        const num = choices[i];
        if (isValid(num, row, col)) {
          board[row][col] = num;
          if (fillBoard(row, col + 1)) {
            return true;
          }
          board[row][col] = 0;
        }
      }
  
      return false;
    }
  
    fillBoard(0, 0);

    for (let i = 0; i< cellsToRemove; i++){
        let row = Math.floor(Math.random() * 9)
        let col = Math.floor(Math.random() * 9)
        if (board[row][col] = 0){
            cellsToRemove++
        }else{
            board[row][col] = 0
        }
    }
  
    return board.flat();
  }
  


export function loadBoard() {
    const inputs = document.querySelectorAll('input')
    let game = generateSudokuBoard(cellsToRemove)
    for(let i=0; i<81; i++) {
        if(game[i] == 0) {
                inputs[i].value = ""
                inputs[i].disabled = false
        } else {
            inputs[i].value = game[i]
            inputs[i].disabled = true
        }
        inputs[i].classList.remove('empty-el')
        inputs[i].classList.remove('valid')
        inputs[i].classList.remove('invalid')
    }
}

export function Easy(){
   cellsToRemove = 56
}

export function Medium(){
  cellsToRemove = 61
}

export function Hard(){
  cellsToRemove = 68
}

export function Insane(){
  cellsToRemove = 75
}
