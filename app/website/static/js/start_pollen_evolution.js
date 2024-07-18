const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const NBDAYSYEAR = 360;

let currentStartingYear = 1994;
let startingAnimation = false;
let bouleauStartingYearDaysOffset = 0;
let ambroisieStartingYearDaysOffset = 180;
let gramineesStartingYearDaysOffset = 60;
let currentTXBouleau, currentTXAmbroisie, currentTXGraminees;

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions
//////////////////////////////////////////////////////////////////////////////////////////////////////

// Get the value of pollen for the given year and pollenArray
function gettingStartingPollenFromYear(year, pollenArray) {
    for (let i = 0; i < pollenArray.length; i++) {
        if (pollenArray[i][0] === year.toString()){
            return parseInt(pollenArray[i][2]);
        }
    }
    return 0;
}


function startingDateAnimation(event) {
    startingAnimation = !startingAnimation;

    if (startingAnimation) {
        event.target.classList.remove("playbutton")
        event.target.classList.add("pausebutton");
    }
    else {
        event.target.classList.remove("pausebutton")
        event.target.classList.add("playbutton");
    }
    
}

function startingAnimationIfActivated(sketch, textCurrentStartingYear) {

    if (startingAnimation) {
        if (sketch.frameCount % 60 == 0 && currentStartingYear < 2023) {
            currentStartingYear++;
            textCurrentStartingYear.html(currentStartingYear);
        }
    }
}

function endingAnimationIfActivated(sketch, pollenBouleauMeanYearArray, pollenAmbroisieStartYearArray, pollenGramineesMeanYearArray, canvasWidth) {
    let bouleauTX2Go = (gettingStartingPollenFromYear(currentStartingYear, pollenBouleauMeanYearArray) + bouleauStartingYearDaysOffset) * canvasWidth / NBDAYSYEAR + 12;
    let ambroisieTX2Go = (gettingStartingPollenFromYear(currentStartingYear, pollenAmbroisieStartYearArray) + ambroisieStartingYearDaysOffset) * canvasWidth / NBDAYSYEAR + 12;
    let gramineesTX2Go = (gettingStartingPollenFromYear(currentStartingYear, pollenGramineesMeanYearArray) + gramineesStartingYearDaysOffset) * canvasWidth / NBDAYSYEAR + 12;
    if (startingAnimation) {
        if (bouleauTX2Go == currentTXBouleau && ambroisieTX2Go == currentTXAmbroisie && gramineesTX2Go == currentTXGraminees && currentStartingYear == 2023){
            startingAnimation = false;
        }
    }
}

function managingAnimationStart(sketch, pollenArray, canvasWidth, canvasH, currentTX, startingYearDaysOffset, color1, color2) {

    currentTX = sketch.lerp(currentTX, (gettingStartingPollenFromYear(currentStartingYear, pollenArray) + startingYearDaysOffset) * canvasWidth / NBDAYSYEAR + 12, 0.1);

    for (let i = currentStartingYear-1; i >= 1994; i--) {
        let pos = (gettingStartingPollenFromYear(i, pollenArray) + startingYearDaysOffset) * canvasWidth / NBDAYSYEAR + 12
        
        let c = sketch.lerpColor(sketch.color(color1), sketch.color(color2), (currentStartingYear - i)/29);
        sketch.stroke(c);
        sketch.strokeWeight(2);
        sketch.drawingContext.setLineDash([0.5, 3]);
        sketch.line(pos, canvasH-canvasH/4-19, pos, canvasH-canvasH/4+20);
    }

    sketch.fill(sketch.color(color1));
    sketch.noStroke();
    sketch.rect(currentTX, canvasH-canvasH/4-20, 2, 40);

    return currentTX
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
// CANVAS
//////////////////////////////////////////////////////////////////////////////////////////////////////


// Create the canvas dedicated to the Abroisie particles
let canvasStartingEvolution = function(sketch){
    let xCoordinate, yCoordinate, canvasWidth, canvas, namePollenAmbroisie, dataAmbroisie, dataBouleau, dataGraminees, buttonPlay, 
    textCurrentStartingYear, namePollenBouleauLegend, namePollenAmbroisieLegend, namePollenGramineesLegend;
    let pollenAmbroisieStartYearArray = [];
    let pollenBouleauStartYearArray = [];
    let pollenGramineesStartYearArray = [];
    let monthP = [];
    let canvasH = 200;
    let monthTextY = 20;
    let borderHorizontalSize = 4;

    sketch.preload = function() {
        dataAmbroisie = sketch.loadStrings('static/data/pollen_ambroisie.csv');
        dataBouleau = sketch.loadStrings('static/data/pollen_bouleau.csv');
        dataGraminees = sketch.loadStrings('static/data/pollen_graminees.csv');
    }

    sketch.setup = function() {
        xCoordinate = document.querySelector("#pollenStartingEvolutionVisualizer").offsetLeft
        yCoordinate = document.querySelector("#pollenStartingEvolutionVisualizer").offsetTop;

        // Setting up data
        for (let row in dataAmbroisie) {
            pollenAmbroisieStartYearArray.push(dataAmbroisie[row].split(','));
            pollenBouleauStartYearArray.push(dataBouleau[row].split(','));
            pollenGramineesStartYearArray.push(dataGraminees[row].split(','));
        }

        // Assigning values
        canvasWidth = document.querySelector("#pollenStartingEvolutionVisualizer").offsetWidth
        
        // Create canvas to display animation
        canvas = sketch.createCanvas(canvasWidth, canvasH);
        canvas.parent("#pollenStartingEvolutionVisualizer");


        // Creating label for ambroisie
        namePollenAmbroisie = sketch.createP("");
        namePollenAmbroisie.parent("#pollenStartingEvolutionVisualizer");
        namePollenAmbroisie.addClass("namePollen");

        for (let i = 0; i < 12; i++) {
            monthP.push(sketch.createP(MONTHS[i]));
            monthP[i].parent("#pollenStartingEvolutionVisualizer");
            if (document.querySelector("body").offsetWidth > 700) {
                monthP[i].style('font-size', '14px');
            }
            else {
                monthP[i].style('font-size', '11px');
            }
        }

        currentTXBouleau = (gettingStartingPollenFromYear(currentStartingYear, pollenBouleauStartYearArray)+bouleauStartingYearDaysOffset) * canvasWidth / NBDAYSYEAR + 12;
        currentTXAmbroisie = (gettingStartingPollenFromYear(currentStartingYear, pollenAmbroisieStartYearArray)+ambroisieStartingYearDaysOffset) * canvasWidth / NBDAYSYEAR + 12;
        currentTXGraminees = (gettingStartingPollenFromYear(currentStartingYear, pollenGramineesStartYearArray)+gramineesStartingYearDaysOffset) * canvasWidth / NBDAYSYEAR + 12;

        buttonPlay = sketch.createButton("");
        buttonPlay.addClass("playbutton");
        buttonPlay.mousePressed(startingDateAnimation);

        // Creating label for ambroisie
        textCurrentStartingYear = sketch.createP(currentStartingYear.toString());
        textCurrentStartingYear.parent("#pollenStartingEvolutionVisualizer");
        textCurrentStartingYear.style('font-size', '25px');

        namePollenBouleauLegend = sketch.createP("Bouleau");
        namePollenBouleauLegend.parent("#pollenStartingEvolutionVisualizer");

        namePollenAmbroisieLegend = sketch.createP("Ambroisie");
        namePollenAmbroisieLegend.parent("#pollenStartingEvolutionVisualizer");

        namePollenGramineesLegend = sketch.createP("Graminees");
        namePollenGramineesLegend.parent("#pollenStartingEvolutionVisualizer");
    }
    sketch.draw = function() {
        // Assigning values
        xCoordinate = document.querySelector("#pollenStartingEvolutionVisualizer").offsetLeft
        yCoordinate = document.querySelector("#pollenStartingEvolutionVisualizer").offsetTop;

        // Setting background
        sketch.background('#F0F0F0');

        // Creating Legend

        if (document.querySelector("body").offsetWidth > 700) {
            namePollenBouleauLegend.style('font-size', '14px');
            namePollenAmbroisieLegend.style('font-size', '14px');
            namePollenGramineesLegend.style('font-size', '14px');
            namePollenBouleauLegend.position(xCoordinate+20, yCoordinate-3)
            namePollenAmbroisieLegend.position(xCoordinate+20, yCoordinate+20-3)
            namePollenGramineesLegend.position(xCoordinate+20, yCoordinate+40-2)
        }
        else {
            namePollenBouleauLegend.style('font-size', '11px');
            namePollenAmbroisieLegend.style('font-size', '11px');
            namePollenGramineesLegend.style('font-size', '11px');
            namePollenBouleauLegend.position(xCoordinate+20, yCoordinate-1)
            namePollenAmbroisieLegend.position(xCoordinate+20, yCoordinate+20-1)
            namePollenGramineesLegend.position(xCoordinate+20, yCoordinate+40)
        }

        sketch.fill(sketch.color("#FF0000"));
        sketch.noStroke();
        sketch.rect(0, 0, 15, 15);

        sketch.fill(sketch.color("#00FF00"));
        sketch.noStroke();
        sketch.rect(0, 20, 15, 15);
        
        sketch.fill(sketch.color("#0000FF"));
        sketch.noStroke();
        sketch.rect(0, 40, 15, 15);

        // Creating timeline
        sketch.fill(sketch.color("#000000"));
        sketch.noStroke();
        sketch.rect(0, canvasH-canvasH/4-borderHorizontalSize/2, canvasWidth, borderHorizontalSize);

        // Adding Months to Timeline
        for (let i = 0; i < 12; i++) {
            sketch.fill(sketch.color("#000000"));
            sketch.noStroke();
            if (i < 11) {
                sketch.rect(canvasWidth/11*i, canvasH-canvasH/4-10, 4, monthTextY);
                if (i%2 == 0){
                    monthP[i].position(xCoordinate+canvasWidth/11*i-monthP[i].size().width/2 > 0 ? xCoordinate+canvasWidth/11*i-monthP[i].size().width/2 : 0, yCoordinate+canvasH-canvasH/4-40);
                }
                else {
                    monthP[i].position(xCoordinate+canvasWidth/11*i-monthP[i].size().width/2, yCoordinate+canvasH-canvasH/4+20);
                }

            }
            else {
                sketch.rect(canvasWidth/11*i-4, canvasH-canvasH/4-10, 4, monthTextY);
                monthP[i].position(xCoordinate+canvasWidth/11*i+monthP[i].size().width < document.querySelector("body").offsetWidth ? xCoordinate+canvasWidth/11*i-monthP[i].size().width/2 : document.querySelector("body").offsetWidth-monthP[i].size().width, yCoordinate+canvasH-canvasH/4+20);
            }
        }

        textCurrentStartingYear.position(xCoordinate+canvasWidth/2-textCurrentStartingYear.size().width/2, yCoordinate)

        startingAnimationIfActivated(sketch, textCurrentStartingYear);

        currentTXBouleau = managingAnimationStart(sketch, pollenBouleauStartYearArray, canvasWidth, canvasH, currentTXBouleau, bouleauStartingYearDaysOffset, "#FF0000", "#FFDCDC");
        currentTXAmbroisie = managingAnimationStart(sketch, pollenAmbroisieStartYearArray, canvasWidth, canvasH, currentTXAmbroisie, ambroisieStartingYearDaysOffset, "#00FF00", "#DCFFDC");
        currentTXGraminees = managingAnimationStart(sketch, pollenGramineesStartYearArray, canvasWidth, canvasH, currentTXGraminees, gramineesStartingYearDaysOffset, "#0000FF", "#DCDCFF");

        endingAnimationIfActivated(sketch, pollenBouleauStartYearArray, pollenAmbroisieStartYearArray, pollenGramineesStartYearArray, canvasWidth);

        buttonPlay.position(xCoordinate+canvasWidth/2-buttonPlay.size().width/2+6, yCoordinate+40);

    }
    sketch.windowResized = function() {
        // rezising canvas with new width
        canvasWidth = document.querySelector("#pollenStartingEvolutionVisualizer").offsetWidth
        sketch.resizeCanvas(canvasWidth, canvasH);

        for (let i = 0; i < 12; i++) {
            if (document.querySelector("body").offsetWidth > 700) {
                monthP[i].style('font-size', '14px');
            }
            else {
                monthP[i].style('font-size', '11px');
            }
        }
    }
}

new p5(canvasStartingEvolution);