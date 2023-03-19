
export function drawBoard() {
    const sudukoBoard = document.querySelector("#puzzle")
    const squares = 81
    
    for (let i=0; i<squares; i++) {
        const inputElement = document.createElement("input")
        inputElement.setAttribute('type', 'input')
        inputElement.setAttribute('min', '1')
        inputElement.setAttribute('max', '9')
        inputElement.disabled = true

        if (
            ((i % 9 == 0 || i % 9 == 1 || i % 9 == 2) && i < 21) ||
            ((i % 9 == 6 || i % 9 == 7 || i % 9 == 8) && i < 27) ||
            ((i % 9 == 3 || i % 9 == 4 || i % 9 == 5) && (i > 27 && i < 53)) ||
            ((i % 9 == 0 || i % 9 == 1 || i % 9 == 2) && i > 53) ||
            ((i % 9 == 6 || i % 9 == 7 || i % 9 == 8) && i > 53)
        ) {
            inputElement.classList.add('odd-section')
        }

        sudukoBoard.appendChild(inputElement)
    }

}

export function clearBoard() {
    const inputs = document.querySelectorAll('input')
    for (let i=0; i<81; i++){
        inputs[i].value = ""
        inputs[i].classList.remove('empty-el')
        inputs[i].classList.remove('valid')
        inputs[i].classList.remove('invalid')
        inputs[i].disabled = true
    }
}