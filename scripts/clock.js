let h = 0;
let m = 0;
let s = 0;
let timer = false;
let timeout;

export function startStop() {
    let clockButton = document.querySelector('#startStop')
    if (!timer){
        timer = true
        clearTimeout(timeout)
        stopWatch()
        clockButton.classList.remove('paused')
    } else{
        timer = false
        clockButton.classList.add('paused')
    }
}

export function resetClock() {
    timer = false
    h = 0
    m = 0
    s = 0
    document.getElementById('h').innerHTML = "00"
    document.getElementById('m').innerHTML = "00"
    document.getElementById('s').innerHTML = "00"
}


export function stopWatch() {
    if (timer) {

        if (s == 60){
            m++
            s = 0
        }

        if (m == 60){
            h++
            m = 0
            s = 0
        }
        let hString =""
        let mString =""
        let sString =""

        if (h < 10) {
            hString = "0" + h
        } else {
            hString = h
        }

        if (m < 10) { mString = "0" + m}
        else{ mString = m}
        
        if (s < 10) { sString = "0" + s}
        else{ sString = s}

        document.getElementById('h').innerHTML = hString
        document.getElementById('m').innerHTML = mString
        document.getElementById('s').innerHTML = sString
        s++
        timeout = setTimeout(stopWatch, 990)
    }
}

export function hideClock(){
    document.getElementById('time').classList.add('hidden')
}

export function showClock(){
    document.getElementById('time').classList.remove('hidden')
}