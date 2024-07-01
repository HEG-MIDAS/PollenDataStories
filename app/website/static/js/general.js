//////////////////////////////////////////////////////////////////////////////////////////////////////
// Variables
//////////////////////////////////////////////////////////////////////////////////////////////////////

// CONSTANTS
const CANVASHEIGTH = 400;
const MARGINTEXT = 25;

// Colors the particles can be depending on the number of particles displayed
const COLORSPARTICLE = ["#FEF001", "#FFCE03", "#FD9A01", "#FD6104", "#FF2C05", "#F00505"]

// Arrays containing the data of the mean pollen for each year
let pollen_ambroisie_mean_year_array = [];
let pollen_bouleau_mean_year_array = [];
let pollen_graminees_mean_year_array = [];

// Arrays containing the pollen particles
let particlesAmbroisie = [];
let particlesBouleau = [];
let particlesGraminees = [];

// Defining the starting current year
let pollen_mean_current_year = 1995;

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions
//////////////////////////////////////////////////////////////////////////////////////////////////////

// Get the maximum value of the given pollenArray
function gettingValueMaxOfPollenArray(pollenArray) {
    let valMax = 0;
    for (let i = 0; i < pollenArray.length; i++) {
        if (parseInt(pollenArray[i][1]) > valMax){
            valMax = parseInt(pollenArray[i][1]);
        }
    }
    return valMax;
}

// Get the minimum value of the given pollenArray
function gettingValueMinOfPollenArray(pollenArray) {
    let valMin = 1000;
    for (let i = 0; i < pollenArray.length; i++) {
        if (parseInt(pollenArray[i][1]) < valMin){
            valMin = parseInt(pollenArray[i][1]);
        }
    }
    return valMin;
}

// Get the value of pollen for the given year and pollenArray
function gettingPollenFromYear(year, pollenArray) {
    for (let i = 0; i < pollenArray.length; i++) {
        if (pollenArray[i][0] === year.toString()){
            return parseInt(pollenArray[i][1]);
        }
    }
    return 0;
}

// Get the number of active particles in the given particlesArray
function gettingNbActiveParticles(particlesArray) {
    let nbActive = 0;
    for (let i = 0; i < particlesArray.length; i++) {
        if (particlesArray[i].isActive()){
            nbActive += 1;
        }
    }
    return nbActive;
}

//Updating particles, it means the number of particles displayed and the color
function updateParticles(year, pollenArray, particlesArray, sketch, minVal) {
    // Get the number of particles for the given year
    let nbParticles = gettingPollenFromYear(year, pollenArray);
    // Get the number of active particles in the given array of particles
    let nbParticlesActive = gettingNbActiveParticles(particlesArray);
    // Compute the difference to update the number of particles to display
    let tmp_nb_particles = nbParticles - nbParticlesActive;

    // Compute the color to display based on nbParticles to display, min, and max values
    let colorHexa = COLORSPARTICLE[parseInt(((nbParticles-minVal)/(particlesArray.length-minVal))*(COLORSPARTICLE.length-1))];
    let previousColor = particlesArray[0].getColor();

    // Check if we must remove particles from canvas
    if (tmp_nb_particles < 0) {
        tmp_nb_particles *= -1;
        // Iterates over the particles until the number of desired particles are deleted
        for(let i = 0;i<particlesArray.length;i++) {
            if (particlesArray[i].isActive()) {
                particlesArray[i].deleteParticle();
                tmp_nb_particles -= 1;
                if (tmp_nb_particles == 0){
                    break;
                }
            }
        }
    }
    // Check if we must add particles from canvas
    else if (tmp_nb_particles > 0) {
        // Iterates over the particles until the number of desired particles are added
        for(let i = 0;i<particlesArray.length;i++) {
            if (!(particlesArray[i].isActive())) {
                particlesArray[i].addParticle();
                tmp_nb_particles -= 1;
                if (tmp_nb_particles == 0){
                    break;
                }
            }
        }
    }

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].cleanParticle();
        particlesArray[i].modifyColor(sketch.lerpColor(sketch.color(previousColor), sketch.color(colorHexa), 0.1));
    }
}


function drawBarLegends(sketch, gX, gY, gWidth, gHeigth, currentGX, valBar, xCoordinate, yCoordinate) {
    let rectOverflow = 15;

    currentPollen = gettingPollenFromYear(pollen_mean_current_year, pollen_ambroisie_mean_year_array);
    minPollen = gettingValueMinOfPollenArray(pollen_ambroisie_mean_year_array);
    maxPollen = gettingValueMaxOfPollenArray(pollen_ambroisie_mean_year_array);

    gX2Fit = gX+(((currentPollen-minPollen)/(maxPollen-minPollen))*(gWidth)-1);

    currentGX = sketch.lerp(currentGX, gX2Fit, 0.1)

    sketch.fill(sketch.color("#000000"));
    sketch.noStroke();
    sketch.rect(currentGX, gY-rectOverflow/2, 3, gHeigth+rectOverflow);

    valBar.html(currentPollen);
    valBar.position(xCoordinate+currentGX-(valBar.size().width/2)+1, yCoordinate-rectOverflow)

    return currentGX;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
// CANVAS
//////////////////////////////////////////////////////////////////////////////////////////////////////


// Create the canvas dedicated to the Abroisie particles
let canvasParticlesAmbroisie = function(sketch){
    let xCoordinate, yCoordinate, canvasWidth, canvas, namePollenAmbroisie, minValAmbroisie, dataAmbroisie;
    let colorParticleAmbroisie = COLORSPARTICLE[0];

    sketch.preload = function() {
        dataAmbroisie = sketch.loadStrings('static/data/pollen_ambroisie.csv');
    }

    sketch.setup = function() {
        // Setting up data
        for (let row in dataAmbroisie) {
            pollen_ambroisie_mean_year_array.push(dataAmbroisie[row].split(','));
        }

        // Get values for the generation of particles and computing which gradient assign to which year
        let nbParticlesAmbroisie = gettingPollenFromYear(pollen_mean_current_year, pollen_ambroisie_mean_year_array);
        let value_max_of_pollen_array = gettingValueMaxOfPollenArray(pollen_ambroisie_mean_year_array);
        // Assigning values
        minValAmbroisie = gettingValueMinOfPollenArray(pollen_ambroisie_mean_year_array);
        canvasWidth = document.querySelector("#pollenEvolutionVisualizerAmbroisie").offsetWidth
        
        // Create canvas to display animation
        canvas = sketch.createCanvas(canvasWidth, CANVASHEIGTH);
        canvas.parent("#pollenEvolutionVisualizerAmbroisie");
        
        // Creating particles
        for(let i = 0;i<value_max_of_pollen_array;i++){
            if (i < nbParticlesAmbroisie) {
                particlesAmbroisie.push(new Particle(sketch, canvasWidth, CANVASHEIGTH, colorParticleAmbroisie));
            }
            else {
                particlesAmbroisie.push(new Particle(sketch, canvasWidth, CANVASHEIGTH, colorParticleAmbroisie, false));
            }
        }

        // Creating label for ambroisie
        namePollenAmbroisie = sketch.createP("Ambroisie");
        namePollenAmbroisie.parent("#pollenEvolutionVisualizerAmbroisie");
        namePollenAmbroisie.addClass("namePollen");
    }
    sketch.draw = function() {
        // Assigning values
        xCoordinate = document.querySelector("#pollenEvolutionVisualizerAmbroisie").offsetLeft
        yCoordinate = document.querySelector("#pollenEvolutionVisualizerAmbroisie").offsetTop;

        // Setting background
        sketch.background('#B3D9FF');

        // Defining position of text label
        namePollenAmbroisie.position(xCoordinate+canvasWidth/2-namePollenAmbroisie.size().width/2, yCoordinate-MARGINTEXT);

        updateParticles(pollen_mean_current_year, pollen_ambroisie_mean_year_array, particlesAmbroisie, sketch, minValAmbroisie);

        // Updating nb particles visible
        for(let i = 0;i<particlesAmbroisie.length;i++) {
            particlesAmbroisie[i].createParticle();
            particlesAmbroisie[i].moveParticle();
        }
    }
    sketch.windowResized = function() {
        // rezising canvas with new width
        canvasWidth = document.querySelector("#pollenEvolutionVisualizerAmbroisie").offsetWidth
        sketch.resizeCanvas(canvasWidth, CANVASHEIGTH);
        for (let i = 0; i < particlesAmbroisie.length; i++) {
            particlesAmbroisie[i].setWidthAndHeight(canvasWidth, CANVASHEIGTH)
        }
    }
}


// Create the canvas dedicated to the bouleau particles
let canvasParticlesBouleau = function(sketch){
    let xCoordinate, yCoordinate, canvasWidth, canvas, namePollenBouleau, minValBouleau, dataBouleau;
    let colorParticleBouleau = COLORSPARTICLE[0];

    sketch.preload = function() {
        dataBouleau = sketch.loadStrings('static/data/pollen_bouleau.csv');
    }

    sketch.setup = function() {
        // Setting up data
        for (let row in dataBouleau) {
            pollen_bouleau_mean_year_array.push(dataBouleau[row].split(','));
        }

        // Get values for the generation of particles and computing which gradient assign to which year
        let nbParticlesBouleau = gettingPollenFromYear(pollen_mean_current_year, pollen_bouleau_mean_year_array);
        let value_max_of_pollen_array = gettingValueMaxOfPollenArray(pollen_bouleau_mean_year_array);
        // Assigning value
        minValBouleau = gettingValueMinOfPollenArray(pollen_bouleau_mean_year_array);
        canvasWidth = document.querySelector("#pollenEvolutionVisualizerBouleau").offsetWidth

        // Create canvas to display animation
        canvas = sketch.createCanvas(canvasWidth, CANVASHEIGTH);
        canvas.parent("#pollenEvolutionVisualizerBouleau");

        // Creating particles
        for(let i = 0;i<value_max_of_pollen_array;i++){
            if (i < nbParticlesBouleau) {
                particlesBouleau.push(new Particle(sketch, canvasWidth, CANVASHEIGTH, colorParticleBouleau));
            }
            else {
                particlesBouleau.push(new Particle(sketch, canvasWidth, CANVASHEIGTH, colorParticleBouleau, false));
            }
        }

        // Creating label for bouleau
        namePollenBouleau = sketch.createP("Bouleau");
        namePollenBouleau.parent("#pollenEvolutionVisualizerBouleau");
        namePollenBouleau.addClass("namePollen");
    }
    sketch.draw = function() {
        // Assigning values
        xCoordinate = document.querySelector("#pollenEvolutionVisualizerBouleau").offsetLeft
        yCoordinate = document.querySelector("#pollenEvolutionVisualizerBouleau").offsetTop;
        
        // Setting background
        sketch.background('#B3D9FF');

        // Defining position of text label
        namePollenBouleau.position(xCoordinate+canvasWidth/2-namePollenBouleau.size().width/2, yCoordinate-MARGINTEXT);

        // Updating nb particles visible
        updateParticles(pollen_mean_current_year, pollen_bouleau_mean_year_array, particlesBouleau, sketch, minValBouleau);

        // Defining width and heigth, drawing particle, and moving it
        for(let i = 0;i<particlesBouleau.length;i++) {
            particlesBouleau[i].createParticle();
            particlesBouleau[i].moveParticle();
        }
    }
    sketch.windowResized = function() {
        // rezising canvas with new width
        canvasWidth = document.querySelector("#pollenEvolutionVisualizerBouleau").offsetWidth
        sketch.resizeCanvas(canvasWidth, CANVASHEIGTH);
        for (let i = 0; i < particlesBouleau.length; i++) {
            particlesBouleau[i].setWidthAndHeight(canvasWidth, CANVASHEIGTH)
        }
    }
}


// Create the canvas dedicated to the graminees particles
let canvasParticlesGraminees = function(sketch){
    let xCoordinate, yCoordinate, canvasWidth, canvas, namePollenGraminees, minValGraminees, dataGraminees;
    let colorParticleGraminees = COLORSPARTICLE[0];

    sketch.preload = function() {
        dataGraminees = sketch.loadStrings('static/data/pollen_graminees.csv');
    }

    sketch.setup = function() {
        // Setting up data
        for (let row in dataGraminees) {
            pollen_graminees_mean_year_array.push(dataGraminees[row].split(','));
        }

        // Get values for the generation of particles and computing which gradient assign to which year
        let nbParticlesGraminees = gettingPollenFromYear(pollen_mean_current_year, pollen_graminees_mean_year_array);
        let value_max_of_pollen_array = gettingValueMaxOfPollenArray(pollen_graminees_mean_year_array);
        // Assigning value
        minValGraminees = gettingValueMinOfPollenArray(pollen_graminees_mean_year_array);
        canvasWidth = document.querySelector("#pollenEvolutionVisualizerGraminees").offsetWidth;

        // Create canvas to display animation
        canvas = sketch.createCanvas(canvasWidth, CANVASHEIGTH);
        canvas.parent("#pollenEvolutionVisualizerGraminees");

        // Creating particles
        for(let i = 0;i<value_max_of_pollen_array;i++){
            if (i < nbParticlesGraminees) {
                particlesGraminees.push(new Particle(sketch, canvasWidth, CANVASHEIGTH, colorParticleGraminees));
            }
            else {
                particlesGraminees.push(new Particle(sketch, canvasWidth, CANVASHEIGTH, colorParticleGraminees, false));
            }
        }

        // Creating label for graminees
        namePollenGraminees = sketch.createP("Graminées");
        namePollenGraminees.parent("#pollenEvolutionVisualizerGraminees");
        namePollenGraminees.addClass("namePollen");
    }
    sketch.draw = function() {
        // Assigning values
        xCoordinate = document.querySelector("#pollenEvolutionVisualizerGraminees").offsetLeft;
        yCoordinate = document.querySelector("#pollenEvolutionVisualizerGraminees").offsetTop;

        // Setting background
        sketch.background('#B3D9FF');

        // Defining position of text label
        namePollenGraminees.position(xCoordinate+canvasWidth/2-namePollenGraminees.size().width/2, yCoordinate-MARGINTEXT);

        // Updating nb particles visible
        updateParticles(pollen_mean_current_year, pollen_graminees_mean_year_array, particlesGraminees, sketch, minValGraminees);

        // Defining width and heigth, drawing particle, and moving it
        for(let i = 0;i<particlesGraminees.length;i++) {
            particlesGraminees[i].createParticle();
            particlesGraminees[i].moveParticle();
        }
    }
    sketch.windowResized = function() {
        // rezising canvas with new width
        canvasWidth = document.querySelector("#pollenEvolutionVisualizerGraminees").offsetWidth;
        sketch.resizeCanvas(canvasWidth, CANVASHEIGTH);
        for (let i = 0; i < particlesGraminees.length; i++) {
            particlesGraminees[i].setWidthAndHeight(canvasWidth, CANVASHEIGTH)
        }
    }
}


// Handles the slider to interactively see the evolution of the pollen through the years
let canvasParticlesSlider = function(sketch){
    let canvas_h = 100;
    let xCoordinate, yCoordinate, canvasWidth, currentYearPollen, slider, canvas;

    sketch.setup = function() {
        // Assigning values
        xCoordinate = document.querySelector("#pollenEvolutionVisualizerSlider").offsetLeft;
        yCoordinate = document.querySelector("#pollenEvolutionVisualizerSlider").offsetTop;
        canvasWidth = document.querySelector("#pollenEvolutionVisualizerSlider").offsetWidth;

        // Creating canvas
        canvas = sketch.createCanvas(canvasWidth, canvas_h);
        canvas.parent("#pollenEvolutionVisualizerSlider");

        // Creating the text displaying the year selected
        currentYearPollen = sketch.createP("1995");
        currentYearPollen.parent("#pollenEvolutionVisualizerSlider");
        currentYearPollen.addClass("currentYearPollen");
        
        // Creating the slider managing the years
        slider = sketch.createSlider(1995, 2023);
        slider.parent("#pollenEvolutionVisualizerSlider");
        slider.size(canvasWidth);
        slider.addClass("slider");
    }
    sketch.draw = function() {
        // Assigning values
        xCoordinate = document.querySelector("#pollenEvolutionVisualizerSlider").offsetLeft;
        yCoordinate = document.querySelector("#pollenEvolutionVisualizerSlider").offsetTop;

        // Positionning currentYearPollen centered
        let currentYearPollenWidth = currentYearPollen.size().width;
        currentYearPollen.position(xCoordinate+(canvasWidth/2)-(currentYearPollenWidth/2), yCoordinate);

        // Positionning slider
        slider.position(xCoordinate, yCoordinate+(canvas_h/2));

        // Updating the year selected with the year selected by the slider
        let g = slider.value();
        currentYearPollen.html(g);
        pollen_mean_current_year = g;
    }
    // Handling window resizes
    sketch.windowResized = function() {
        // rezising canvas with new width
        canvasWidth = document.querySelector("#pollenEvolutionVisualizerSlider").offsetWidth;

        sketch.resizeCanvas(canvasWidth, canvas_h);
        slider.size(canvasWidth);
    }
}


// Handles the legend of the mean evolution of the pollens through the years since 1995
let canvasParticlesLegend = function(sketch){
    let canvas_h = 100;
    let c1, c2, canvasWidth, labelMin, labelMax, canvas, xCoordinate, yCoordinate, currentGX, valBar;

    // Create gradient from given colors at the desired position
    function setGradient(x, y, w, h, c1, c2) {
        sketch.noFill();
      
        // Left to right gradient
        for (let i = x; i <= x + w; i++) {
            let inter = sketch.map(i, x, x + w, 0, 1);
            let c = sketch.lerpColor(c1, c2, inter);
            sketch.stroke(c);
            sketch.line(i, y, i, y + h);
        }
    }

    sketch.setup = function() {
        // Assigning value
        canvasWidth = document.querySelector("#pollenEvolutionVisualizerLegend").offsetWidth

        canvas = sketch.createCanvas(canvasWidth, canvas_h);
        canvas.parent("#pollenEvolutionVisualizerLegend");

        // Define colors
        c1 = sketch.color("#FEF001");
        c2 = sketch.color("#F00505");

        // Define text legend
        labelMin = sketch.createP("Minimum");
        labelMin.parent("#pollenEvolutionVisualizerLegend");
        labelMin.addClass("labelMeanPollen");
        
        labelMax = sketch.createP("Maximum");
        labelMax.parent("#pollenEvolutionVisualizerLegend");
        labelMax.addClass("labelMeanPollen");

        currentGX = document.querySelector("#pollenEvolutionVisualizerLegend").offsetLeft;

        valBar = sketch.createP(0);
        valBar.parent("#pollenEvolutionVisualizerLegend");

    }
    sketch.draw = function() {
        // Assigning values
        xCoordinate = document.querySelector("#pollenEvolutionVisualizerLegend").offsetLeft;
        yCoordinate = document.querySelector("#pollenEvolutionVisualizerLegend").offsetTop;

        let gX = labelMin.size().width+MARGINTEXT;
        let gY = canvas_h/8;
        let gWidth = canvasWidth-labelMin.size().width-labelMax.size().width-(MARGINTEXT*2);
        let gHeigth = canvas_h/4;

        // Setting background
        sketch.background('#F0F0F0');
        
        // Defines the gradient of colors used in the canvas showing the evolution of the pollen through the years
        setGradient(gX, gY, gWidth, gHeigth, c1, c2);
        
        // Defines the position of the text of the legend
        labelMin.position(xCoordinate, yCoordinate+canvas_h/8);
        labelMax.position(xCoordinate+canvasWidth-labelMax.size().width, yCoordinate+canvas_h/8);

        currentGX = drawBarLegends(sketch, gX, gY, gWidth, gHeigth, currentGX, valBar, xCoordinate, yCoordinate);

    }
    // Handling window resizes
    sketch.windowResized = function() {
        canvasWidth = document.querySelector("#pollenEvolutionVisualizerLegend").offsetWidth
        sketch.resizeCanvas(canvasWidth, canvas_h);
    }
}


// Creating p5 Canvas
new p5(canvasParticlesSlider);
new p5(canvasParticlesAmbroisie);
new p5(canvasParticlesBouleau);
new p5(canvasParticlesGraminees);
new p5(canvasParticlesLegend);