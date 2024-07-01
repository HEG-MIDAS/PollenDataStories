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
function getting_value_max_of_pollen_array(pollenArray) {
    let valMax = 0;
    for (let i = 0; i < pollenArray.length; i++) {
        if (parseInt(pollenArray[i][1]) > valMax){
            valMax = parseInt(pollenArray[i][1]);
        }
    }
    return valMax;
}

// Get the minimum value of the given pollenArray
function getting_value_min_of_pollen_array(pollenArray) {
    let valMin = 1000;
    for (let i = 0; i < pollenArray.length; i++) {
        if (parseInt(pollenArray[i][1]) < valMin){
            valMin = parseInt(pollenArray[i][1]);
        }
    }
    return valMin;
}

// Get the value of pollen for the given year and pollenArray
function getting_pollen_from_year(year, pollenArray) {
    for (let i = 0; i < pollenArray.length; i++) {
        if (pollenArray[i][0] === year.toString()){
            return parseInt(pollenArray[i][1]);
        }
    }
    return 0;
}

// Get the number of active particles in the given particlesArray
function getting_nb_active_particles(particlesArray) {
    let nbActive = 0;
    for (let i = 0; i < particlesArray.length; i++) {
        if (particlesArray[i].isActive()){
            nbActive += 1;
        }
    }
    return nbActive;
}

//Updating particles, it means the number of particles displayed and the color
function update_particles(year, pollenArray, particlesArray, sketch, minVal) {
    // Get the number of particles for the given year
    let nbParticles = getting_pollen_from_year(year, pollenArray);
    // Get the number of active particles in the given array of particles
    let nbParticlesActive = getting_nb_active_particles(particlesArray);
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

//////////////////////////////////////////////////////////////////////////////////////////////////////
// CANVAS
//////////////////////////////////////////////////////////////////////////////////////////////////////

// Create the canvas dedicated to the Abroisie particles
let canvasParticlesAmbroisie = function(sketch){
    let x_coordinate, y_coordinate, canvas_w, canvas, namePollenAmbroisie, minValAmbroisie;
    let colorParticleAmbroisie = COLORSPARTICLE[0];
    sketch.setup = function() {
        // Get values for the generation of particles and computing which gradient assign to which year
        let nbParticlesAmbroisie = getting_pollen_from_year(pollen_mean_current_year, pollen_ambroisie_mean_year_array);
        let value_max_of_pollen_array = getting_value_max_of_pollen_array(pollen_ambroisie_mean_year_array);
        // Assigning values
        minValAmbroisie = getting_value_min_of_pollen_array(pollen_ambroisie_mean_year_array);
        canvas_w = document.querySelector("#pollenEvolutionVisualizerAmbroisie").offsetWidth
        
        // Create canvas to display animation
        canvas = sketch.createCanvas(canvas_w, CANVASHEIGTH);
        canvas.parent("#pollenEvolutionVisualizerAmbroisie");
        
        // Creating particles
        for(let i = 0;i<value_max_of_pollen_array;i++){
            if (i < nbParticlesAmbroisie) {
                particlesAmbroisie.push(new Particle(sketch, canvas_w, CANVASHEIGTH, colorParticleAmbroisie));
            }
            else {
                particlesAmbroisie.push(new Particle(sketch, canvas_w, CANVASHEIGTH, colorParticleAmbroisie, false));
            }
        }

        // Creating label for ambroisie
        namePollenAmbroisie = sketch.createP("Ambroisie");
        namePollenAmbroisie.parent("#pollenEvolutionVisualizerAmbroisie");
        namePollenAmbroisie.addClass("namePollen");
    }
    sketch.draw = function() {
        // Assigning values
        x_coordinate = document.querySelector("#pollenEvolutionVisualizerAmbroisie").offsetLeft
        y_coordinate = document.querySelector("#pollenEvolutionVisualizerAmbroisie").offsetTop;

        // Setting background
        sketch.background('#B3D9FF');

        // Defining position of text label
        namePollenAmbroisie.position(x_coordinate+canvas_w/2-namePollenAmbroisie.size().width/2, y_coordinate-MARGINTEXT);

        update_particles(pollen_mean_current_year, pollen_ambroisie_mean_year_array, particlesAmbroisie, sketch, minValAmbroisie);

        // Updating nb particles visible
        for(let i = 0;i<particlesAmbroisie.length;i++) {
            particlesAmbroisie[i].createParticle();
            particlesAmbroisie[i].moveParticle();
        }
    }
    sketch.windowResized = function() {
        // rezising canvas with new width
        canvas_w = document.querySelector("#pollenEvolutionVisualizerAmbroisie").offsetWidth
        sketch.resizeCanvas(canvas_w, CANVASHEIGTH);
    }
}

// Create the canvas dedicated to the bouleau particles
let canvasParticlesBouleau = function(sketch){
    let x_coordinate, y_coordinate, canvas_w, canvas, namePollenBouleau, minValBouleau;
    let colorParticleBouleau = COLORSPARTICLE[0];
    sketch.setup = function() {
        // Get values for the generation of particles and computing which gradient assign to which year
        let nbParticlesBouleau = getting_pollen_from_year(pollen_mean_current_year, pollen_bouleau_mean_year_array);
        let value_max_of_pollen_array = getting_value_max_of_pollen_array(pollen_bouleau_mean_year_array);
        // Assigning value
        minValBouleau = getting_value_min_of_pollen_array(pollen_bouleau_mean_year_array);
        canvas_w = document.querySelector("#pollenEvolutionVisualizerBouleau").offsetWidth

        // Create canvas to display animation
        canvas = sketch.createCanvas(canvas_w, CANVASHEIGTH);
        canvas.parent("#pollenEvolutionVisualizerBouleau");

        // Creating particles
        for(let i = 0;i<value_max_of_pollen_array;i++){
            if (i < nbParticlesBouleau) {
                particlesBouleau.push(new Particle(sketch, canvas_w, CANVASHEIGTH, colorParticleBouleau));
            }
            else {
                particlesBouleau.push(new Particle(sketch, canvas_w, CANVASHEIGTH, colorParticleBouleau, false));
            }
        }

        // Creating label for bouleau
        namePollenBouleau = sketch.createP("Bouleau");
        namePollenBouleau.parent("#pollenEvolutionVisualizerBouleau");
        namePollenBouleau.addClass("namePollen");
    }
    sketch.draw = function() {
        // Assigning values
        x_coordinate = document.querySelector("#pollenEvolutionVisualizerBouleau").offsetLeft
        y_coordinate = document.querySelector("#pollenEvolutionVisualizerBouleau").offsetTop;
        
        // Setting background
        sketch.background('#B3D9FF');

        // Defining position of text label
        namePollenBouleau.position(x_coordinate+canvas_w/2-namePollenBouleau.size().width/2, y_coordinate-MARGINTEXT);

        // Updating nb particles visible
        update_particles(pollen_mean_current_year, pollen_bouleau_mean_year_array, particlesBouleau, sketch, minValBouleau);

        // Defining width and heigth, drawing particle, and moving it
        for(let i = 0;i<particlesBouleau.length;i++) {
            particlesBouleau[i].createParticle();
            particlesBouleau[i].moveParticle();
        }
    }
    sketch.windowResized = function() {
        // rezising canvas with new width
        canvas_w = document.querySelector("#pollenEvolutionVisualizerBouleau").offsetWidth
        sketch.resizeCanvas(canvas_w, CANVASHEIGTH);
    }
}

// Create the canvas dedicated to the graminees particles
let canvasParticlesGraminees = function(sketch){
    let x_coordinate, y_coordinate, canvas_w, canvas, namePollenGraminees, minValGraminees;
    let colorParticleGraminees = COLORSPARTICLE[0];
    sketch.setup = function() {
        // Get values for the generation of particles and computing which gradient assign to which year
        let nbParticlesGraminees = getting_pollen_from_year(pollen_mean_current_year, pollen_graminees_mean_year_array);
        let value_max_of_pollen_array = getting_value_max_of_pollen_array(pollen_graminees_mean_year_array);
        // Assigning value
        minValGraminees = getting_value_min_of_pollen_array(pollen_graminees_mean_year_array);
        canvas_w = document.querySelector("#pollenEvolutionVisualizerGraminees").offsetWidth;

        // Create canvas to display animation
        canvas = sketch.createCanvas(canvas_w, CANVASHEIGTH);
        canvas.parent("#pollenEvolutionVisualizerGraminees");

        // Creating particles
        for(let i = 0;i<value_max_of_pollen_array;i++){
            if (i < nbParticlesGraminees) {
                particlesGraminees.push(new Particle(sketch, canvas_w, CANVASHEIGTH, colorParticleGraminees));
            }
            else {
                particlesGraminees.push(new Particle(sketch, canvas_w, CANVASHEIGTH, colorParticleGraminees, false));
            }
        }

        // Creating label for graminees
        namePollenGraminees = sketch.createP("Graminées");
        namePollenGraminees.parent("#pollenEvolutionVisualizerGraminees");
        namePollenGraminees.addClass("namePollen");
    }
    sketch.draw = function() {
        // Assigning values
        x_coordinate = document.querySelector("#pollenEvolutionVisualizerGraminees").offsetLeft;
        y_coordinate = document.querySelector("#pollenEvolutionVisualizerGraminees").offsetTop;

        // Setting background
        sketch.background('#B3D9FF');

        // Defining position of text label
        namePollenGraminees.position(x_coordinate+canvas_w/2-namePollenGraminees.size().width/2, y_coordinate-MARGINTEXT);

        // Updating nb particles visible
        update_particles(pollen_mean_current_year, pollen_graminees_mean_year_array, particlesGraminees, sketch, minValGraminees);

        // Defining width and heigth, drawing particle, and moving it
        for(let i = 0;i<particlesGraminees.length;i++) {
            particlesGraminees[i].createParticle();
            particlesGraminees[i].moveParticle();
        }
    }
    sketch.windowResized = function() {
        // rezising canvas with new width
        canvas_w = document.querySelector("#pollenEvolutionVisualizerGraminees").offsetWidth;
        sketch.resizeCanvas(canvas_w, CANVASHEIGTH);
    }
}


// Handles the slider to interactively see the evolution of the pollen through the years
let canvasParticlesSlider = function(sketch){
    let canvas_h = 100;
    let x_coordinate, y_coordinate, canvas_w, currentYearPollen, slider, canvas;

    sketch.setup = function() {
        // Assigning values
        x_coordinate = document.querySelector("#pollenEvolutionVisualizerSlider").offsetLeft;
        y_coordinate = document.querySelector("#pollenEvolutionVisualizerSlider").offsetTop;
        canvas_w = document.querySelector("#pollenEvolutionVisualizerSlider").offsetWidth;

        // Creating canvas
        canvas = sketch.createCanvas(canvas_w, canvas_h);
        canvas.parent("#pollenEvolutionVisualizerSlider");

        // Creating the text displaying the year selected
        currentYearPollen = sketch.createP("1995");
        currentYearPollen.parent("#pollenEvolutionVisualizerSlider");
        currentYearPollen.addClass("currentYearPollen");
        
        // Creating the slider managing the years
        slider = sketch.createSlider(1995, 2023);
        slider.parent("#pollenEvolutionVisualizerSlider");
        slider.size(canvas_w);
        slider.addClass("slider");
    }
    sketch.draw = function() {
        // Assigning values
        x_coordinate = document.querySelector("#pollenEvolutionVisualizerSlider").offsetLeft;
        y_coordinate = document.querySelector("#pollenEvolutionVisualizerSlider").offsetTop;

        // Positionning currentYearPollen centered
        let currentYearPollenWidth = currentYearPollen.size().width;
        currentYearPollen.position(x_coordinate+(canvas_w/2)-(currentYearPollenWidth/2), y_coordinate);

        // Positionning slider
        slider.position(x_coordinate, y_coordinate+(canvas_h/2));

        // Updating the year selected with the year selected by the slider
        let g = slider.value();
        currentYearPollen.html(g);
        pollen_mean_current_year = g;
    }
    // Handling window resizes
    sketch.windowResized = function() {
        // rezising canvas with new width
        canvas_w = document.querySelector("#pollenEvolutionVisualizerSlider").offsetWidth;

        sketch.resizeCanvas(canvas_w, canvas_h);
        slider.size(canvas_w);
    }
}

new p5(canvasParticlesSlider);

// Handles the legend of the mean evolution of the pollens through the years since 1995
let canvasParticlesLegend = function(sketch){
    let canvas_h = 100;
    let c1, c2, canvas_w, labelMin, labelMax, canvas, x_coordinate, y_coordinate;

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
        canvas_w = document.querySelector("#pollenEvolutionVisualizerLegend").offsetWidth

        canvas = sketch.createCanvas(canvas_w, canvas_h);
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

    }
    sketch.draw = function() {
        // Assigning values
        x_coordinate = document.querySelector("#pollenEvolutionVisualizerLegend").offsetLeft;
        y_coordinate = document.querySelector("#pollenEvolutionVisualizerLegend").offsetTop;
        
        // Defines the gradient of colors used in the canvas showing the evolution of the pollen through the years
        setGradient(labelMin.size().width+MARGINTEXT, canvas_h/8, canvas_w-labelMin.size().width-labelMax.size().width-(MARGINTEXT*2), canvas_h/4, c1, c2);
        
        // Defines the position of the text of the legend
        labelMin.position(x_coordinate, y_coordinate+canvas_h/8);
        labelMax.position(x_coordinate+canvas_w-labelMax.size().width, y_coordinate+canvas_h/8);

    }
    // Handling window resizes
    sketch.windowResized = function() {
        canvas_w = document.querySelector("#pollenEvolutionVisualizerLegend").offsetWidth
        sketch.resizeCanvas(canvas_w, canvas_h);
    }
}

// Creating p5 Canvas
new p5(canvasParticlesLegend);

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Fetching data and drawing canvas
//////////////////////////////////////////////////////////////////////////////////////////////////////

// Fetching the data from the local csv file, converting it into an 2d array, 
// and creating the p5 Canvas corresponding to the data
fetch('static/data/pollen_ambroisie.csv')
    .then((res) => res.text())
    .then((text) => {
        let data = text.split('\n')
        
        for (let row in data) {
            pollen_ambroisie_mean_year_array.push(data[row].split(','));
        }

        new p5(canvasParticlesAmbroisie);
    })
    .catch((e) => console.error(e));

// Fetching the data from the local csv file, converting it into an 2d array, 
// and creating the p5 Canvas corresponding to the data
fetch('static/data/pollen_bouleau.csv')
    .then((res) => res.text())
    .then((text) => {
        let data = text.split('\n')
        
        for (let row in data) {
            pollen_bouleau_mean_year_array.push(data[row].split(','));
        }

        new p5(canvasParticlesBouleau);

    })
    .catch((e) => console.error(e));

// Fetching the data from the local csv file, converting it into an 2d array, 
// and creating the p5 Canvas corresponding to the data
fetch('static/data/pollen_graminees.csv')
    .then((res) => res.text())
    .then((text) => {
        let data = text.split('\n')
        
        for (let row in data) {
            pollen_graminees_mean_year_array.push(data[row].split(','));
        }
      
        new p5(canvasParticlesGraminees);

    })
    .catch((e) => console.error(e));