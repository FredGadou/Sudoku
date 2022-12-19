//---------jQuery----------//

   

    $('body').keydown(function(e){
        if(help){
            toHelp();
        }
        if(e.keyCode === 17) {
            //celebrate();
        }
        check();
    });

    $('td').keydown(function(e){
        if(help){
            toHelp();
        }
        if(e.keyCode === 13) {
            $('td').blur();
            window.getSelection().removeAllRanges();
            e.preventDefault();
            check();
        }
    });

    $('td').keydown(function(e){
        if ((isNaN(String.fromCharCode(e.which)) && (e.keyCode > 105 || e.keyCode < 96)) && e.keyCode != 8) e.preventDefault();
        return $.inArray(e.which, [8, 46, 37, 39]) > -1 || 
               $(this).text().length == 0;
        
    });


//--------------------------//


//-----------------------event------------------------------//

document.body.addEventListener('click', (event) => {
    if(help){
        toHelp();
    }  
});
//----------------------------------------------------------//



//---------------main variable---------------------//
var sudokuComplet = false;
var sudTab = [];
var modCell = [];
var greenCell = [];
var redCell = [];
var help = false;
var darkMode = false;
//------------------------------------------------//



//-------------------------------play----------------------------------//
function play(){
    resetTimer();
    var diff = document.getElementById('difficulty').value;
    if(diff === '') {
        alert('Choisi une difficulté gros cave');
    }else{
        do {
            sudBuild();
        } while(!sudokuComplet);
        drawSudoku(diff);

        document.getElementById('sudokuDiv').style.display = 'block';
        document.getElementById('difficulty').style.display = 'none';
        document.getElementById('play').style.display = 'none';
        document.getElementById('reset').style.display = 'inline';
        document.getElementById('sidebar').style.display = 'block';

    }
    sec = 0;
    startTimer = setInterval( function(){
        document.getElementById("seconds").innerHTML=pad(++sec%60);
        document.getElementById("minutes").innerHTML=pad(parseInt(sec/60,10));
    }, 1000);
    var darkMode = document.getElementById('darkMode');
    var fixedClass = document.getElementsByClassName('fixed');
    var toFillClass = document.getElementsByClassName('toFill');
    if(darkMode.checked) {
        for(let i = 0; i < fixedClass.length; i++){
            fixedClass[i].style.color = 'gray';
        }
    }else{
        for(let i = 0; i < fixedClass.length; i++){
            fixedClass[i].style.color = 'black';
        }    
    }
}
//----------------------------------------------------------------------------//


function sudBuild() {
    sudTab = sudTab.slice(0, 0);
    var series = [[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9]];
    let abc = [];   
    let a;
    let b;
    let c;
    let num;

    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            
            abc = findSeries(i, j);
            a = abc[0];
            b = abc[1];
            c = abc[2];
            num = findNum(series[a], series[b], series[c]);
            if(typeof num === 'undefined'){
                sudokuComplet = false;
                return false;
            }
            sudTab.push(num);
            series[a] = delNum(series[a], num)
            series[b] = delNum(series[b], num)
            series[c] = delNum(series[c], num)
        }
    }
    sudokuComplet = true;
}

function drawSudoku(diff) {
    var screenSud = [];
    var htmlTable = document.getElementById('sudokuTable');
    var index = 0;
    var nbBlank = 0;

    switch(diff) {
        case 'easy':
            nbBlank = 35;
            break;
        case 'normal':
            nbBlank = 50;
            break;
        case 'hard':
            nbBlank = 65;
            break;
    }
 
    
    var blankSpot = [...Array(nbBlank)].map(e => Array(2));

    for(let i = 0; i < nbBlank; i++){
        var a = Math.floor(Math.random() * 9);
        var b = Math.floor(Math.random() * 9);
        if(isDouble(blankSpot, a, b)) {
            while(isDouble(blankSpot, a, b)) {
                a = Math.floor(Math.random() * 9);
                b = Math.floor(Math.random() * 9);
            }
        }
        blankSpot[i][0] = a;
        blankSpot[i][1] = b;
    }

    
    let isColor;

    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {

            isColor = isColored(findSeries(i, j)[2]);

            if(isBlank(blankSpot, i, j)) {
                htmlTable.rows[i].cells[j].className = 'toFill';
                htmlTable.rows[i].cells[j].id = i + ' ' + j;
                document.getElementById(i+' '+j).contentEditable = 'true';
                modCell.push([i,j,sudTab[index]]);
                htmlTable.rows[i].cells[j].innerHTML = '';
                index++;
                if(isColor){htmlTable.rows[i].cells[j].style.backgroundColor = "#def5da";}
            } else {     
                htmlTable.rows[i].cells[j].className = 'fixed';
                htmlTable.rows[i].cells[j].innerHTML = sudTab[index];
                index++;
                if(isColor){htmlTable.rows[i].cells[j].style.backgroundColor = "#def5da";}
            }
        }
    }
}


function isColored(series){
    if(series%2===0){return true;}else{return false;}
}

function isBlank(array, a, b) {
    return isDouble(array, a, b);
}

function isDouble(array, a, b) {
    for(let i = 0; i < array.length; i++){
        if(array[i][0] === a && array[i][1] === b) {
            return true;
        }
    }
    return false;
}

function findSeries(i, j) {

    let serieA = i;
    let serieB = j + 9;
    let serieC;

    if( i < 3 && j < 3 ) {
        serieC = 18;
    }else if( i < 3 && (j >= 3 && j < 6 )) {
        serieC = 19;
    }else if( i < 3 && j >= 6 ) {
        serieC = 20;
    }else if(( i >= 3 && i < 6 ) && j < 3 ) {
        serieC = 21;
    }else if(( i >= 3 && i < 6 ) && (j >= 3 && j < 6 )) {
        serieC = 22;
    }else if(( i >= 3 && i < 6 ) && j >= 6 ) {
        serieC = 23;
    }else if( i >= 6 && j < 3 ) {
        serieC = 24;
    }else if( i >= 6 && (j >= 3 && j < 6 )) {
        serieC = 25;
    }else if( i >= 6 && j >= 6 ) {
        serieC = 26;
    }

    return [serieA, serieB, serieC];

}

function findNum(serieA, serieB, serieC) {
    serieAB = [];
    serieBC = [];
    serieABC = [];

    for(let i = 0; i < serieA.length; i++) {
        for(let j = 0; j < serieB.length; j++) {
            if(serieA[i] === serieB[j]) {
                serieAB.push(serieA[i]);
            }
        }
    }
    for(let i = 0; i < serieB.length; i++) {
        for(let j = 0; j < serieC.length; j++) {
            if(serieB[i] === serieC[j]) {
                serieBC.push(serieB[i]);
            }
        }
    }
    for(let i = 0; i < serieAB.length; i++) {
        for(let j = 0; j < serieBC.length; j++) {
            if(serieAB[i] === serieBC[j]) {
                serieABC.push(serieAB[i]);
            }
        }
    }

    let max = serieABC.length;
    let index = Math.floor(Math.random() * max);
    return serieABC[index];
}

function delNum(array, num) {
    let index = array.indexOf(parseInt(num));
    array.splice(index, 1);
    return array;
}

//-------------------------------------reset function------------------------------------//
function resetPlay() {
    document.getElementById('sudokuDiv').style.display = 'none';
    document.getElementById('difficulty').style.display = 'inline';
    document.getElementById('play').style.display = 'inline';
    document.getElementById('reset').style.display = 'none';
    document.getElementById('sidebar').style.display = 'none';
    document.getElementById('countup').style.display = 'none';
    document.getElementById('timer').checked = false;

    for(let a = 0; a < modCell.length; a++) {
        let i = modCell[a][0];
        let j = modCell[a][1];
        document.getElementById(i+' '+j).contentEditable = 'false';
    }

   

    modCell = modCell.slice(0, 0);
    greenCell = greenCell.slice(0, 0);
    redCell = redCell.slice(0, 0);
    resetTimer();
}
//------------------------------------------------------------------------------------//

function check() {
    var htmlTable = document.getElementById('sudokuTable');
    var index = 0;
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            if(sudTab[index] != htmlTable.rows[i].cells[j].innerHTML){
                return false;
            }
            index++;
        }
    }
    console.log('You Win!');
    celebrate();
}

function toHelp() {
    var htmlTable = document.getElementById('sudokuTable');

    for(let a = 0; a < modCell.length; a++) {
        let i = modCell[a][0];
        let j = modCell[a][1];
        let num = parseInt(modCell[a][2]);
        let actualNum = parseInt(htmlTable.rows[i].cells[j].innerHTML);
        if(!isNaN(actualNum)){
            if( actualNum === num){
                htmlTable.rows[i].cells[j].style.color = 'blue';
            }else{
                htmlTable.rows[i].cells[j].style.color = 'red';
            }
        }else{
            document.getElementById(i+' '+j).style.color = 'black';
        }
    }   
}

//-----------------sidebar function------------------//

function darkModeSwitch(e) {
    var bodyElement = document.body;
    var headElement = document.getElementById('header');
    var fixedClass = document.getElementsByClassName('fixed');
    var toFillClass = document.getElementsByClassName('toFill');
    if(e.checked) {
        bodyElement.classList.add('b-dark-mode');
        headElement.classList.add('h-dark-mode');
        for(let i = 0; i < fixedClass.length; i++){
            fixedClass[i].style.color = 'gray';
        }
        if(!help){
            for(let i = 0; i < toFillClass.length; i++){
                toFillClass[i].style.color = 'gray';
            }
        }
        darkMode = true;
    }else{
        bodyElement.classList.remove('b-dark-mode');
        headElement.classList.remove('h-dark-mode');
        for(let i = 0; i < fixedClass.length; i++){
            fixedClass[i].style.color = 'black';
        }
        if(!help){
            for(let i = 0; i < toFillClass.length; i++){
                toFillClass[i].style.color = 'black';
            }
        }
        darkMode = false;
    }
}

function helpCheck(e) {
    if(e.checked) {
        help = true;
        toHelp()
    }else{
        help = false;
        var htmlTable = document.getElementById('sudokuTable');
        for(let a = 0; a < modCell.length; a++) {
            let i = modCell[a][0];
            let j = modCell[a][1];
            if(darkMode) {
                document.getElementById(i+' '+j).style.color = 'gray';
            }else{
                document.getElementById(i+' '+j).style.color = 'black';
            }
        }
    }
}

function timeCheck(e) {
    if(e.checked) {
        document.getElementById('countup').style.display = 'inline';
    }else{
        document.getElementById('countup').style.display = 'none';
    }
}
//---------------------------------------------------//



//-------------------timer-----------//
var sec = 0;
function pad ( val ) { return val > 9 ? val : "0" + val; }  
var startTimer = setInterval( function(){
        document.getElementById("seconds").innerHTML=pad(++sec%60);
        document.getElementById("minutes").innerHTML=pad(parseInt(sec/60,10));
    }, 1000);

function resetTimer() {
    clearInterval(startTimer);
}

//-------------------------------------//




//-------------------------------------explosion anim----------------------------------//



function celebrate() {
    
    
    /* Get the canvas  */
        var canvas = document.getElementById("explosion");
        canvas.style.display = 'block';
          
        /* Get the height and width of the window */
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
          
        /* Get the 2D context of the canvas  */
        var ctx = canvas.getContext("2d");
        
      
        /* Fills or sets the color,gradient,pattern */
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "50px Arial";
        ctx.fillStyle = "green";
          
        /* Writes the required text  */
        setTimeout(() => {ctx.fillText("Bravo gros laid!", 470, 350);},1500);
        let particles = [];
          
        /* Initialize particle object  */
        class Particle {
            constructor(x, y, radius, dx, dy) {
                this.x = x;
                this.y = y;
                this.radius = radius;
                this.dx = dx;
                this.dy = dy;
                this.alpha = 1;
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = 'green';
                  
                /* Begins or reset the path for 
                   the arc created */
                ctx.beginPath();
                  
                /* Some curve is created*/
                ctx.arc(this.x, this.y, this.radius, 
                        0, Math.PI * 2, false);
  
                ctx.fill();
                  
                /* Restore the recent canvas context*/
                ctx.restore();
            }
            update() {
                this.draw();
                this.alpha -= 0.01;
                this.x += this.dx;
                this.y += this.dy;
            }
        }
          
        /* Timer is set for particle push 
            execution in intervals*/
        setTimeout(() => {
            for (i = 0; i <= 2000; i++) {
                let dx = (Math.random() - 0.5) * (Math.random() * 20);
                let dy = (Math.random() - 0.5) * (Math.random() * 15);
                let radius = Math.random() * 4;
                let particle = new Particle(650, 320, radius, dx, dy);
                  
                /* Adds new items like particle*/
                particles.push(particle);
            }
            explode();
        }, 3000);
  
        /* Particle explosion function */
        var animationReq;
        function explode() {
  
            /* Clears the given pixels in the rectangle */
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            particles.forEach((particle, i) => {
                    if (particle.alpha <= 0) {
                        particles.splice(i, 1);
                    } else particle.update()
                })
                  
                /* Performs a animation after request*/
           animationReq = requestAnimationFrame(explode);
        }
    setTimeout(() => {
        canvas.style.display = 'none';
        cancelAnimationFrame(animationReq);
    },6000);
    
}


//-----------------------------------------------------------------------------------//


