import { clearBoard, drawBoard } from "./draw.js";
import { solve, insertValues, populateValues, checkEnabled, checkDisabled } from './solver.js'
import { Easy, Medium, Hard, Insane, loadBoard} from "./generate.js";
import { hideClock, resetClock, showClock, startStop } from "./clock.js";

const solveButton = document.querySelector("#solve-button")
const clearButton = document.querySelector("#clear-button")
const newButton = document.querySelector('#generate-button')
const easyButton = document.querySelector('#easy')
const mediumButton = document.querySelector('#medium')
const hardButton = document.querySelector('#hard')
const insaneButton = document.querySelector('#insane')
const checkEnable = document.querySelector('#enableCheck')
const checkDisable = document.querySelector('#disableCheck')
const clockEnable = document.querySelector('#clockEnable')
const clockDisable = document.querySelector('#clockDisable')
const pausePlay = document.querySelector('#startStop')
const scanButton = document.querySelector('#scanButton')

function main(){
    drawBoard()
    checkDisabled()
    hideClock()
    clockDisable.classList.add('active')
    checkDisable.classList.add('active')
    mediumButton.classList.add('active')
    scanButton.onclick = function () {
        location.href = 'test.html'
    }
    pausePlay.addEventListener('click', () => {
        startStop()
    })
    clockEnable.addEventListener('click', () =>{
        clockEnable.classList.add('active')
        clockDisable.classList.remove('active')
        showClock()
    })
    clockDisable.addEventListener('click', ()=> {
        clockDisable.classList.add('active')
        clockEnable.classList.remove('active')
        hideClock()
    })
    solveButton.addEventListener('click', () => {
        insertValues(true)
        if(solve()) {
            populateValues()
        } else {
            alert("Can't solve this puzzle!")
        }
    })
    checkEnable.addEventListener('click', () =>{
        checkEnable.classList.add('active')
        checkDisable.classList.remove('active')
        checkEnabled()
    })
    checkDisable.addEventListener('click', () => {
        checkEnable.classList.remove('active')
        checkDisable.classList.add('active')
        checkDisabled()
    })
    clearButton.addEventListener('click', () => {
        clearBoard()
        resetClock()
    })
    newButton.addEventListener('click', () => {
        loadBoard()
        resetClock()
        startStop()
    })
    easyButton.addEventListener('click', () => {
        Easy()
        easyButton.classList.add('active')
        mediumButton.classList.remove('active')
        hardButton.classList.remove('active')
        insaneButton.classList.remove('active')
    })
    mediumButton.addEventListener('click', () => {
        Medium()
        easyButton.classList.remove('active')
        hardButton.classList.remove('active')
        insaneButton.classList.remove('active')
        mediumButton.classList.add('active')
    })
    hardButton.addEventListener('click', () => {
        Hard()
        easyButton.classList.remove('active')
        mediumButton.classList.remove('active')
        insaneButton.classList.remove('active')
        hardButton.classList.add('active')
    })
    insaneButton.addEventListener('click', () => {
        Insane()
        easyButton.classList.remove('active')
        mediumButton.classList.remove('active')
        hardButton.classList.remove('active')
        insaneButton.classList.add('active')
    })
}
main()