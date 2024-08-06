let startingYear = 2011;
let currentSelectedYear = startingYear;

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions
//////////////////////////////////////////////////////////////////////////////////////////////////////

// Get the value of ppm for the given year and ppmArray
function gettingPPMValue(year, ppmArray) {
    for (let i = 0; i < ppmArray.length; i++) {
        if (ppmArray[i][0] === year.toString()){
            return [parseInt(ppmArray[i][1]), parseInt(ppmArray[i][2]), parseInt(ppmArray[i][3])];
        }
    }
    return [-1, -1, -1];
}

function getMinMaxPPMValuesFromArray(ppmArray) {
    let minPM10 = 100;
    let minNO2 = 100;
    let minO3 = 100;
    let maxPM10 = 0;
    let maxNO2 = 0;
    let maxO3 = 0;

    for (let i = 0; i < ppmArray.length; i++) {
        
        if (parseFloat(minPM10) > parseFloat(ppmArray[i][1])){
            minPM10 = ppmArray[i][1];
        }
        if (parseFloat(minNO2) > parseFloat(ppmArray[i][2])){
            minNO2 = ppmArray[i][2];
        }
        if (parseFloat(minO3) > parseFloat(ppmArray[i][3])){
            minO3 = ppmArray[i][3];
        }

        if (parseFloat(maxPM10) < parseFloat(ppmArray[i][1])){
            maxPM10 = ppmArray[i][1];
        }
        if (parseFloat(maxNO2) < parseFloat(ppmArray[i][2])){
            maxNO2 = ppmArray[i][2];
        }
        if (parseFloat(maxO3) < parseFloat(ppmArray[i][3])){
            maxO3 = ppmArray[i][3];
        }
    }

    return [minPM10, minNO2, minO3, maxPM10, maxNO2, maxO3];
}

function getMinMaxPPMValues(ppmUrbanArray, ppmSuburbanArray, ppmRuralArray) {
    
    let minPM10, minNO2, minO3, maxPM10, maxNO2, maxO3;

    let ppmUrbanMinMaxArray = getMinMaxPPMValuesFromArray(ppmUrbanArray);
    let ppmSuburbanMinMaxArray = getMinMaxPPMValuesFromArray(ppmSuburbanArray);
    let ppmRuralMinMaxArray = getMinMaxPPMValuesFromArray(ppmRuralArray);

    minPM10 = Math.min(ppmUrbanMinMaxArray[0], ppmSuburbanMinMaxArray[0], ppmRuralMinMaxArray[0]);
    minNO2 = Math.min(ppmUrbanMinMaxArray[1], ppmSuburbanMinMaxArray[1], ppmRuralMinMaxArray[1]);
    minO3 = Math.min(ppmUrbanMinMaxArray[2], ppmSuburbanMinMaxArray[2], ppmRuralMinMaxArray[2]);
    maxPM10 = Math.max(ppmUrbanMinMaxArray[3], ppmSuburbanMinMaxArray[3], ppmRuralMinMaxArray[3]);
    maxNO2 = Math.max(ppmUrbanMinMaxArray[4], ppmSuburbanMinMaxArray[4], ppmRuralMinMaxArray[4]);
    maxO3 = Math.max(ppmUrbanMinMaxArray[5], ppmSuburbanMinMaxArray[5], ppmRuralMinMaxArray[5]);

    return [Math.trunc(minPM10), Math.trunc(minNO2), Math.trunc(minO3), Math.trunc(maxPM10)+1, Math.trunc(maxNO2)+1, Math.trunc(maxO3)+1]
}

function drawPPMValues(sketch, ppmArray, color, ppmMinMaxValues, currentSelectedYear, 
    xCoordinateStart, xCoordinateEnd, yCoordinatePM10, yCoordinateNO2, yCoordinateO3,
    currentTXRural){

    let sizeOfMarker = 15;
    let ppmValuesArray = gettingPPMValue(currentSelectedYear, ppmArray);

    // PM10

    // Compute ration of the ppm first and then lerp to the corresponding coordinate
    // Removing 1 to the max value as the rounded max will not be reached otherwise
    let ratioPM10 = (ppmValuesArray[0]-ppmMinMaxValues[0])/(ppmMinMaxValues[3]-1-ppmMinMaxValues[0]);
    let currentTXRuralPM10 = sketch.lerp(currentTXRural[0], xCoordinateStart+xCoordinateEnd*ratioPM10, 0.1);

    sketch.fill(sketch.color(color));
    sketch.noStroke();
    sketch.rect(currentTXRuralPM10, yCoordinatePM10-sizeOfMarker, 2, sizeOfMarker*2);

    // NO2

    // Compute ration of the ppm first and then lerp to the corresponding coordinate
    // Removing 1 to the max value as the rounded max will not be reached otherwise
    let ratioNO2 = (ppmValuesArray[1]-ppmMinMaxValues[1])/(ppmMinMaxValues[4]-1-ppmMinMaxValues[1]);
    let currentTXRuralNO2 = sketch.lerp(currentTXRural[1], xCoordinateStart+xCoordinateEnd*ratioNO2, 0.1);

    sketch.fill(sketch.color(color));
    sketch.noStroke();
    sketch.rect(currentTXRuralNO2, yCoordinateNO2-sizeOfMarker, 2, sizeOfMarker*2);

    // O3

    // Compute ration of the ppm first and then lerp to the corresponding coordinate
    // Removing 1 to the max value as the rounded max will not be reached otherwise
    let ratioO3 = (ppmValuesArray[2]-ppmMinMaxValues[2])/(ppmMinMaxValues[5]-1-ppmMinMaxValues[2]);
    let currentTXRuralO3 = sketch.lerp(currentTXRural[2], xCoordinateStart+xCoordinateEnd*ratioO3, 0.1);

    sketch.fill(sketch.color(color));
    sketch.noStroke();
    sketch.rect(currentTXRuralO3, yCoordinateO3-sizeOfMarker, 2, sizeOfMarker*2);
    
    return [currentTXRuralPM10, currentTXRuralNO2, currentTXRuralO3]
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
// CANVAS
//////////////////////////////////////////////////////////////////////////////////////////////////////


// Create the canvas dedicated to the Abroisie particles
let canvasPPMEvolution = function(sketch){
    let xCoordinate, yCoordinate, canvasWidth, canvas, dataRural, dataSuburbain, dataUrbain, imgRural, imgSuburbain, imgUrbain, 
    imageSize, lineOffset, ppmMinMaxValues, minPM10, maxPM10, minNO2, maxNO2, minO3, maxO3;
    let ruralPPMArray = [];
    let suburbainPPMArray = [];
    let urbainPPMArray = [];
    let ppmButtonYearArray = [];
    let canvasH = 700;
    let buttonWidth = 100;
    let buttonHeigth = 50;
    let buttonMargin = 10;
    let borderHorizontalSize = 3;
    let lineXOffset = 100;
    let imagesMargin = 50;
    let cursorInButton = false;
    let ruralColor = "#FF0000";
    let suburbainColor = "#00FF00";
    let urbainColor = "#0000FF";
    let currentTXRural = [lineXOffset, lineXOffset, lineXOffset];
    let currentTXSuburbain = [lineXOffset, lineXOffset, lineXOffset];
    let currentTXUrbain = [lineXOffset, lineXOffset, lineXOffset]


    sketch.preload = function() {
        dataRural = sketch.loadStrings('static/data/ppm_rural.csv');
        dataSuburbain = sketch.loadStrings('static/data/ppm_suburbain.csv');
        dataUrbain = sketch.loadStrings('static/data/ppm_urbain.csv');

        imgRural = sketch.loadImage('static/images/rural3.jpeg');
        imgSuburbain = sketch.loadImage('static/images/suburban.jpeg');
        imgUrbain = sketch.loadImage('static/images/urban.jpeg');
    }

    sketch.setup = function() {
        xCoordinate = document.querySelector("#ppmMeanEvolutionVisualizer").offsetLeft;
        yCoordinate = document.querySelector("#ppmMeanEvolutionVisualizer").offsetTop;

        if (document.querySelector("body").offsetWidth < 700) {
            buttonMargin = 5;
            canvasH = 400;
            imagesMargin = 10;
        }

        // Setting up data
        for (let row in dataRural) {
            ruralPPMArray.push(dataRural[row].split(','));
            suburbainPPMArray.push(dataSuburbain[row].split(','));
            urbainPPMArray.push(dataUrbain[row].split(','));
        }

        // Assigning values
        canvasWidth = document.querySelector("#ppmMeanEvolutionVisualizer").offsetWidth;
        
        // Create canvas to display animation
        canvas = sketch.createCanvas(canvasWidth, canvasH);
        canvas.parent("#ppmMeanEvolutionVisualizer");

        // Resizing images
        imageSize = canvasWidth/3-imagesMargin;
        imgRural.resize(imageSize, imageSize);
        imgSuburbain.resize(imageSize, imageSize);
        imgUrbain.resize(imageSize, imageSize);

        // Creating buttons from 2011 to 2023 on all the width available
        for (let i = 2011; i < 2024; i++) {
            buttonWidth = canvasWidth/(2023-2011+1)-buttonMargin;
            let posX = (buttonWidth+(2023-2011+1)*buttonMargin/(2023-2011))*(i-2011);
            ppmButtonYearArray.push(new PPMYEARBUTTON(sketch, buttonWidth, buttonHeigth, i, posX, imageSize+50));
        }

        lineOffset = imageSize+50+buttonHeigth+50;

        pm10Legend = sketch.createP("PM10 :");
        pm10Legend.parent("#ppmMeanEvolutionVisualizer");

        no2Legend = sketch.createP("NO2 :");
        no2Legend.parent("#ppmMeanEvolutionVisualizer");

        o3Legend = sketch.createP("O3 :");
        o3Legend.parent("#ppmMeanEvolutionVisualizer");

        // Getting and printing minimum values
        ppmMinMaxValues = getMinMaxPPMValues(urbainPPMArray, suburbainPPMArray, ruralPPMArray)

        console.log(ppmMinMaxValues)

        minPM10 = sketch.createP(ppmMinMaxValues[0].toString());
        minPM10.parent("#ppmMeanEvolutionVisualizer");

        maxPM10 = sketch.createP(ppmMinMaxValues[3].toString());
        maxPM10.parent("#ppmMeanEvolutionVisualizer");

        minNO2 = sketch.createP(ppmMinMaxValues[1].toString());
        minNO2.parent("#ppmMeanEvolutionVisualizer");

        maxNO2 = sketch.createP(ppmMinMaxValues[4].toString());
        maxNO2.parent("#ppmMeanEvolutionVisualizer");

        minO3 = sketch.createP(ppmMinMaxValues[2].toString());
        minO3.parent("#ppmMeanEvolutionVisualizer");

        maxO3 = sketch.createP(ppmMinMaxValues[5].toString());
        maxO3.parent("#ppmMeanEvolutionVisualizer");

    }
    sketch.draw = function() {
        // Assigning values
        xCoordinate = document.querySelector("#ppmMeanEvolutionVisualizer").offsetLeft
        yCoordinate = document.querySelector("#ppmMeanEvolutionVisualizer").offsetTop;

        // Setting background
        sketch.background('#F0F0F0');

        if (document.querySelector("body").offsetWidth < 700) {
            buttonMargin = 5;
            canvasH = 400;
            imagesMargin = 10;
        }
        else {
            buttonMargin = 10;
            canvasH = 700;
            imagesMargin = 50;
        }

        // Displaying images and drawing shadow around
        sketch.drawingContext.shadowBlur = 30;
        sketch.drawingContext.shadowColor = sketch.color(ruralColor);
        sketch.image(imgRural, 0, 0);

        sketch.drawingContext.shadowBlur = 30;
        sketch.drawingContext.shadowColor = sketch.color(suburbainColor);
        sketch.image(imgSuburbain, canvasWidth/3+imagesMargin/2, 0);

        sketch.drawingContext.shadowBlur = 30;
        sketch.drawingContext.shadowColor = sketch.color(urbainColor);
        sketch.image(imgUrbain, canvasWidth/3*2+imagesMargin, 0);

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

        // Creating line and positionning for PM10 and placing text around
        sketch.fill(sketch.color("#000000"));
        sketch.noStroke();
        sketch.rect(lineXOffset, lineOffset, canvasWidth-lineXOffset-10-maxO3.size().width, borderHorizontalSize);

        pm10Legend.position(xCoordinate, yCoordinate+lineOffset-pm10Legend.size().height/2);
        minPM10.position(xCoordinate+lineXOffset-10-minPM10.size().width, yCoordinate+lineOffset-minPM10.size().height/2+1);
        maxPM10.position(xCoordinate+canvasWidth-maxPM10.size().width, yCoordinate+lineOffset-maxPM10.size().height/2+1);

        // Creating line for NO2 and placing text around
        sketch.fill(sketch.color("#000000"));
        sketch.noStroke();
        sketch.rect(lineXOffset, lineOffset+borderHorizontalSize+50, canvasWidth-lineXOffset-10-maxO3.size().width, borderHorizontalSize);

        no2Legend.position(xCoordinate, yCoordinate+lineOffset+borderHorizontalSize+50-no2Legend.size().height/2);
        minNO2.position(xCoordinate+lineXOffset-10-minNO2.size().width, yCoordinate+lineOffset+borderHorizontalSize+50-minNO2.size().height/2+1);
        maxNO2.position(xCoordinate+canvasWidth-maxNO2.size().width, yCoordinate+lineOffset+borderHorizontalSize+50-maxNO2.size().height/2+1);

        // Creating line for O3 and placing text around
        sketch.fill(sketch.color("#000000"));
        sketch.noStroke();
        sketch.rect(lineXOffset, lineOffset+(borderHorizontalSize+50)*2, canvasWidth-lineXOffset-10-maxO3.size().width, borderHorizontalSize);

        o3Legend.position(xCoordinate, yCoordinate+lineOffset+(borderHorizontalSize+50)*2-o3Legend.size().height/2);
        minO3.position(xCoordinate+lineXOffset-10-minO3.size().width, yCoordinate+lineOffset+(borderHorizontalSize+50)*2-minO3.size().height/2+1);
        maxO3.position(xCoordinate+canvasWidth-maxO3.size().width, yCoordinate+lineOffset+(borderHorizontalSize+50)*2-maxO3.size().height/2+1);

        // Draw the position of the PPM values on the lines previouly created
        currentTXRural = drawPPMValues(sketch, ruralPPMArray, ruralColor, ppmMinMaxValues, currentSelectedYear, lineXOffset, canvasWidth-lineXOffset-10-maxO3.size().width, 
            lineOffset+2, lineOffset+borderHorizontalSize+50+2, lineOffset+(borderHorizontalSize+50)*2+2, currentTXRural);

        currentTXSuburbain = drawPPMValues(sketch, suburbainPPMArray, suburbainColor, ppmMinMaxValues, currentSelectedYear, lineXOffset, canvasWidth-lineXOffset-10-maxO3.size().width, 
            lineOffset+2, lineOffset+borderHorizontalSize+50+2, lineOffset+(borderHorizontalSize+50)*2+2, currentTXSuburbain);

        currentTXUrbain = drawPPMValues(sketch, urbainPPMArray, urbainColor, ppmMinMaxValues, currentSelectedYear, lineXOffset, canvasWidth-lineXOffset-10-maxO3.size().width, 
            lineOffset+2, lineOffset+borderHorizontalSize+50+2, lineOffset+(borderHorizontalSize+50)*2+2, currentTXUrbain);

    }
    sketch.windowResized = function() {
        // rezising canvas with new width
        canvasWidth = document.querySelector("#ppmMeanEvolutionVisualizer").offsetWidth;
        sketch.resizeCanvas(canvasWidth, canvasH);

        // Resizing images
        imageSize = canvasWidth/3-50;
        imgRural.resize(imageSize, imageSize);
        imgSuburbain.resize(imageSize, imageSize);
        imgUrbain.resize(imageSize, imageSize);

        for (let i = 0; i < ppmButtonYearArray.length; i++) {
            buttonWidth = canvasWidth/(2023-2011+1)-buttonMargin;
            let posX = (buttonWidth+(2023-2011+1)*buttonMargin/(2023-2011))*(i);
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