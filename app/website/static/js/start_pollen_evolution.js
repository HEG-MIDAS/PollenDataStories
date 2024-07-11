const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const NBDAYSYEAR = 360;

let currentStartingYear = 1994;
let startingAnimation = false;
let currentTXBouleau;

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


function startingDateAnimation() {
    startingAnimation = true;
}

function managingAnimationStart(sketch, textCurrentStartingYear, pollenBouleauStartYearArray, canvasWidth, canvasH) {
    if (startingAnimation) {
        if (sketch.frameCount % 60 == 0 && currentStartingYear < 2024) {
            currentStartingYear++;
            textCurrentStartingYear.html(currentStartingYear);
        }
        if (currentStartingYear == 2023){
            startingAnimation = false;
        }
        
        currentTXBouleau = sketch.lerp(currentTXBouleau, gettingStartingPollenFromYear(currentStartingYear, pollenBouleauStartYearArray) * canvasWidth / NBDAYSYEAR, 0.1);
    }

    for (let i = currentStartingYear-1; i >= 1994; i--) {
        let pos = gettingStartingPollenFromYear(i, pollenBouleauStartYearArray) * canvasWidth / NBDAYSYEAR
        
        sketch.fill(sketch.color(255-(currentStartingYear-i)*20, 0, 0));
        sketch.noStroke();
        sketch.rect(pos, canvasH/2-20, 2, 40);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
// CANVAS
//////////////////////////////////////////////////////////////////////////////////////////////////////


// Create the canvas dedicated to the Abroisie particles
let canvasStartingEvolution = function(sketch){
    let xCoordinate, yCoordinate, canvasWidth, canvas, namePollenAmbroisie, dataAmbroisie, dataBouleau, dataGraminees, buttonPlay, textCurrentStartingYear;
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

        currentTXBouleau = gettingStartingPollenFromYear(currentStartingYear, pollenBouleauStartYearArray) * canvasWidth / NBDAYSYEAR;

        buttonPlay = sketch.createButton("Visualisation");
        buttonPlay.mousePressed(startingDateAnimation);

        // Creating label for ambroisie
        textCurrentStartingYear = sketch.createP(currentStartingYear.toString());
        textCurrentStartingYear.parent("#pollenStartingEvolutionVisualizer");
    }
    sketch.draw = function() {
        // Assigning values
        xCoordinate = document.querySelector("#pollenStartingEvolutionVisualizer").offsetLeft
        yCoordinate = document.querySelector("#pollenStartingEvolutionVisualizer").offsetTop;

        // Setting background
        sketch.background('#F0F0F0');

        // Creating timeline
        sketch.fill(sketch.color("#000000"));
        sketch.noStroke();
        sketch.rect(0, canvasH/2-borderHorizontalSize/2, canvasWidth, borderHorizontalSize);

        // Adding Months to Timeline
        for (let i = 0; i < 12; i++) {
            sketch.fill(sketch.color("#000000"));
            sketch.noStroke();
            if (i < 11) {
                sketch.rect(canvasWidth/11*i, canvasH/2-10, 4, monthTextY);
                if (i%2 == 0){
                    monthP[i].position(xCoordinate+canvasWidth/11*i-monthP[i].size().width/2 > 0 ? xCoordinate+canvasWidth/11*i-monthP[i].size().width/2 : 0, yCoordinate+canvasH/2-40);
                }
                else {
                    monthP[i].position(xCoordinate+canvasWidth/11*i-monthP[i].size().width/2, yCoordinate+canvasH/2+20);
                }

            }
            else {
                sketch.rect(canvasWidth/11*i-4, canvasH/2-10, 4, monthTextY);
                monthP[i].position(xCoordinate+canvasWidth/11*i+monthP[i].size().width < document.querySelector("body").offsetWidth ? xCoordinate+canvasWidth/11*i-monthP[i].size().width/2 : document.querySelector("body").offsetWidth-monthP[i].size().width, yCoordinate+canvasH/2+20);
            }
        }

        textCurrentStartingYear.position(xCoordinate+canvasWidth/2, yCoordinate)

        managingAnimationStart(sketch, textCurrentStartingYear, pollenBouleauStartYearArray, canvasWidth, canvasH);

        sketch.fill(sketch.color("#FF0000"));
        sketch.noStroke();
        sketch.rect(currentTXBouleau, canvasH/2-20, 2, 40);

        buttonPlay.position(xCoordinate, yCoordinate);

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