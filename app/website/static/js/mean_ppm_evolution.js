let startingYear = 2011;
let currentSelectedYear = startingYear;

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

function drawPPMValues(ppmArray, color){
    
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
// CANVAS
//////////////////////////////////////////////////////////////////////////////////////////////////////


// Create the canvas dedicated to the Abroisie particles
let canvasPPMEvolution = function(sketch){
    let xCoordinate, yCoordinate, canvasWidth, canvas, dataRural, dataSuburbain, dataUrbain, imgRural, imgSuburbain, imgUrbain, imageSize, lineOffset;
    let ruralPPMArray = [];
    let suburbainPPMArray = [];
    let urbainPPMArray = [];
    let ppmButtonYearArray = [];
    let canvasH = 700;
    let buttonWidth = 100;
    let buttonHeigth = 50;
    let buttonMargin = 10;
    let borderHorizontalSize = 3;
    let cursorInButton = false;
    let ruralColor = "#FF0000";
    let suburbainColor = "#00FF00";
    let urbainColor = "#0000FF";


    sketch.preload = function() {
        dataRural = sketch.loadStrings('static/data/ppm_rural.csv');
        dataSuburbain = sketch.loadStrings('static/data/ppm_suburbain.csv');
        dataUrbain = sketch.loadStrings('static/data/ppm_urbain.csv');

        imgRural = sketch.loadImage('static/images/rural3.jpeg');
        imgSuburbain = sketch.loadImage('static/images/suburban.jpeg');
        imgUrbain = sketch.loadImage('static/images/urban.jpeg');
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

        lineOffset = imageSize+50+buttonHeigth+50;

        pm10Legend = sketch.createP("PM10 :");
        pm10Legend.parent("#ppmMeanEvolutionVisualizer");

        no2Legend = sketch.createP("NO2 :");
        no2Legend.parent("#ppmMeanEvolutionVisualizer");

        o3Legend = sketch.createP("O3 :");
        o3Legend.parent("#ppmMeanEvolutionVisualizer");

    }
    sketch.draw = function() {
        // Assigning values
        xCoordinate = document.querySelector("#ppmMeanEvolutionVisualizer").offsetLeft
        yCoordinate = document.querySelector("#ppmMeanEvolutionVisualizer").offsetTop;

        // Setting background
        sketch.background('#F0F0F0');

        // Displaying images and drawing shadow around
        sketch.drawingContext.shadowBlur = 30;
        sketch.drawingContext.shadowColor = sketch.color(ruralColor);
        sketch.image(imgRural, 0, 0);

        sketch.drawingContext.shadowBlur = 30;
        sketch.drawingContext.shadowColor = sketch.color(suburbainColor);
        sketch.image(imgSuburbain, canvasWidth/3+25, 0);

        sketch.drawingContext.shadowBlur = 30;
        sketch.drawingContext.shadowColor = sketch.color(urbainColor);
        sketch.image(imgUrbain, canvasWidth/3*2+50, 0);

        sketch.drawingContext.shadowBlur = 0;
        sketch.drawingContext.shadowColor = sketch.color("#FFF");

        // Displaying buttons
        // Array used to check if mouse is over a button
        let inButtonArray = [];
        for (let i = 2011; i < 2024; i++) {
            // Displays the button
            ppmButtonYearArray[i-2011].displayButton();
            // Check if the mouse is over a button to adapt the cursor consequently
            inButtonArray.push(ppmButtonYearArray[i-2011].over());
            cursorInButton = inButtonArray.includes(true);
        }

        // Handling cursor appearence when over the buttons or not
        if (cursorInButton) {
            sketch.cursor("pointer");
        }
        else {
            sketch.cursor("default");
        }

        // Creating line and positionning for PM10
        sketch.fill(sketch.color("#000000"));
        sketch.noStroke();
        sketch.rect(100, lineOffset, canvasWidth, borderHorizontalSize);

        pm10Legend.position(xCoordinate, yCoordinate+lineOffset-pm10Legend.size().height/2)

        // Creating line for NO2
        sketch.fill(sketch.color("#000000"));
        sketch.noStroke();
        sketch.rect(100, lineOffset+borderHorizontalSize+50, canvasWidth, borderHorizontalSize);

        no2Legend.position(xCoordinate, yCoordinate+lineOffset+borderHorizontalSize+50-no2Legend.size().height/2)

        // Creating line for O3
        sketch.fill(sketch.color("#000000"));
        sketch.noStroke();
        sketch.rect(100, lineOffset+(borderHorizontalSize+50)*2, canvasWidth, borderHorizontalSize);

        o3Legend.position(xCoordinate, yCoordinate+lineOffset+(borderHorizontalSize+50)*2-o3Legend.size().height/2)

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
        // Check if mouse is inside of the button's range
        if (sketch.mouseX > 0 && sketch.mouseX < canvasWidth && sketch.mouseY > imageSize+50 && sketch.mouseY < imageSize+50 + buttonHeigth) {
            // When the mouse is pressed, we must check every single button
            let arrayCurrentlySelected = [];
            let arrayNewCurrentlySelected = [];
            let indexOfSelectedButton = -1;
            let indexOfNewSelectedButton = -1;

            // Iterate over the elements of array to get the index of last button selected
            for (let i = 0; i < ppmButtonYearArray.length; i++) {
                arrayCurrentlySelected.push(ppmButtonYearArray[i].getIsCurrentlySelected());
            }
            indexOfSelectedButton = arrayCurrentlySelected.indexOf(true);

            // Iterate over the others button and clicking on it if it is the case
            for (let i = 0; i < ppmButtonYearArray.length; i++) {
                if (i != indexOfSelectedButton) {
                    ppmButtonYearArray[i].click(sketch.mouseX, sketch.mouseY);
                    arrayNewCurrentlySelected.push(ppmButtonYearArray[i].getIsCurrentlySelected());
                }
                // Adding false iteration to not shift the indices
                else {
                    arrayNewCurrentlySelected.push(false);
                }
            }

            // Getting new index of current click
            indexOfNewSelectedButton = arrayNewCurrentlySelected.indexOf(true);

            // If there is new index deselect old one and get new current year 
            if (indexOfNewSelectedButton != -1){
                ppmButtonYearArray[indexOfSelectedButton].deselect();
                currentSelectedYear = ppmButtonYearArray[indexOfNewSelectedButton].getYear();
            }
        }
    }
}

new p5(canvasPPMEvolution);