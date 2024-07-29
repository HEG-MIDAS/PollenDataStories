let startingYear = 2011;

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions
//////////////////////////////////////////////////////////////////////////////////////////////////////

// Get the value of pollen for the given year and pollenArray
function gettingPPMValue(year, ppmArray) {
    for (let i = 0; i < ppmArray.length; i++) {
        if (ppmArray[i][0] === year.toString()){
            return parseInt(ppmArray[i]);
        }
    }
    return 0;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
// CANVAS
//////////////////////////////////////////////////////////////////////////////////////////////////////


// Create the canvas dedicated to the Abroisie particles
let canvasPPMEvolution = function(sketch){
    let xCoordinate, yCoordinate, canvasWidth, canvas, dataRural, dataSuburbain, dataUrbain, imgRural, imgSuburbain, imgUrbain;
    let ruralPPMArray = [];
    let suburbainPPMArray = [];
    let urbainPPMArray = [];
    let ppmButtonYearArray = [];
    let canvasH = 600;
    let buttonWidth = 100;
    let buttonHeigth = 50;
    let buttonMargin = 10;
    let cursorInButton = false;

    sketch.preload = function() {
        dataRural = sketch.loadStrings('static/data/ppm_rural.csv');
        dataSuburbain = sketch.loadStrings('static/data/ppm_suburbain.csv');
        dataUrbain = sketch.loadStrings('static/data/ppm_urbain.csv');

        imgRural = sketch.loadImage('static/images/rural.jpeg');
        imgSuburbain = sketch.loadImage('static/images/suburbain.jpeg');
        imgUrbain = sketch.loadImage('static/images/ville.jpeg');
    }

    sketch.setup = function() {
        xCoordinate = document.querySelector("#ppmMeanEvolutionVisualizer").offsetLeft
        yCoordinate = document.querySelector("#ppmMeanEvolutionVisualizer").offsetTop;

        // Setting up data
        for (let row in dataRural) {
            ruralPPMArray.push(dataRural[row].split(','));
            suburbainPPMArray.push(dataSuburbain[row].split(','));
            urbainPPMArray.push(dataUrbain[row].split(','));
        }

        // Assigning values
        canvasWidth = document.querySelector("#ppmMeanEvolutionVisualizer").offsetWidth
        
        // Create canvas to display animation
        canvas = sketch.createCanvas(canvasWidth, canvasH);
        canvas.parent("#ppmMeanEvolutionVisualizer");

        // Resizing images
        imageSize = canvasWidth/3-50
        imgRural.resize(imageSize, imageSize);
        imgSuburbain.resize(imageSize, imageSize);
        imgUrbain.resize(imageSize, imageSize);

        // Creating buttons from 2011 to 2023 on all the width available
        for (let i = 2011; i < 2024; i++) {
            buttonWidth = canvasWidth/(2023-2011+1)-buttonMargin
            let posX = (buttonWidth+(2023-2011+1)*buttonMargin/(2023-2011))*(i-2011)
            ppmButtonYearArray.push(new PPMYEARBUTTON(sketch, buttonWidth, buttonHeigth, i, posX, imageSize+50));
        }

    }
    sketch.draw = function() {
        // Assigning values
        xCoordinate = document.querySelector("#ppmMeanEvolutionVisualizer").offsetLeft
        yCoordinate = document.querySelector("#ppmMeanEvolutionVisualizer").offsetTop;

        // Setting background
        sketch.background('#F0F0F0');

        // Displaying images and drawing shadow around
        sketch.drawingContext.shadowBlur = 30;
        sketch.drawingContext.shadowColor = sketch.color("#FF0000");
        sketch.image(imgRural, 0, 0);

        sketch.drawingContext.shadowBlur = 30;
        sketch.drawingContext.shadowColor = sketch.color("#00FF00");
        sketch.image(imgSuburbain, canvasWidth/3+25, 0);

        sketch.drawingContext.shadowBlur = 30;
        sketch.drawingContext.shadowColor = sketch.color("#0000FF");
        sketch.image(imgUrbain, canvasWidth/3*2+50, 0);

        sketch.drawingContext.shadowBlur = 0;
        sketch.drawingContext.shadowColor = sketch.color("#FFF");

        // Displaying buttons
        let inButtonArray = [];
        for (let i = 2011; i < 2024; i++) {
            ppmButtonYearArray[i-2011].displayButton();
            inButtonArray.push(ppmButtonYearArray[i-2011].over());
            cursorInButton = inButtonArray.includes(true);
        }

        if (cursorInButton) {
            sketch.cursor("pointer");
        }
        else {
            sketch.cursor("default");
        }

    }
    sketch.windowResized = function() {
        // rezising canvas with new width
        canvasWidth = document.querySelector("#ppmMeanEvolutionVisualizer").offsetWidth
        sketch.resizeCanvas(canvasWidth, canvasH);

        // Resizing images
        imageSize = canvasWidth/3-50
        imgRural.resize(imageSize, imageSize);
        imgSuburbain.resize(imageSize, imageSize);
        imgUrbain.resize(imageSize, imageSize);

        for (let i = 0; i < ppmButtonYearArray.length; i++) {
            buttonWidth = canvasWidth/(2023-2011+1)-buttonMargin
            let posX = (buttonWidth+(2023-2011+1)*buttonMargin/(2023-2011))*(i)
            ppmButtonYearArray[i].resize(buttonWidth, posX, imageSize+50);
        }
    }

    sketch.mousePressed = function() {
        // When the mouse is pressed, we must check every single button
        let arrayCurrentlySelected = [];
        let arrayNewCurrentlySelected = [];
        let indexOfSelectedButton = -1;
        let indexOfNewSelectedButton = -1;

        for (let i = 0; i < ppmButtonYearArray.length; i++) {
            arrayCurrentlySelected.push(ppmButtonYearArray[i].getIsCurrentlySelected());
        }
        indexOfSelectedButton = arrayCurrentlySelected.indexOf(true);

        for (let i = 0; i < ppmButtonYearArray.length; i++) {
            if (i != indexOfSelectedButton) {
                ppmButtonYearArray[i].click(sketch.mouseX, sketch.mouseY);
                arrayNewCurrentlySelected.push(ppmButtonYearArray[i].getIsCurrentlySelected());
            }
        }

        indexOfNewSelectedButton = arrayNewCurrentlySelected.indexOf(true);

        if (indexOfNewSelectedButton != -1){
            ppmButtonYearArray[indexOfSelectedButton].deselect();
        }
        else {
            ppmButtonYearArray[indexOfSelectedButton].select();
        }
      }
}

new p5(canvasPPMEvolution);