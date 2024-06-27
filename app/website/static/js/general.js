var pollen_ambroisie_mean_year_array = [];
var pollen_bouleau_mean_year_array = [];
var pollen_graminees_mean_year_array = [];

let pollen_mean_current_year = 1995;

let navbarOffset = 56;

// an array to add multiple particles
let particlesAmbroisie = [];
let particlesBouleau = [];
let particlesGraminees = [];

let nbParticlesAmbroisie = 100;
let nbParticlesBouleau = 100;
let nbParticlesGraminees = 100;

let colorParticleAmbroisie = "#FFEB84";
let colorParticleBouleau = "#FFEB84";
let colorParticleGraminees = "#FFEB84";

const COLORSPARTICLE = ["#FEF001", "#FFCE03", "#FD9A01", "#FD6104", "#FF2C05", "#F00505"]

function getting_value_max_of_pollen_array(pollenArray) {
    let valMax = 0;
    for (let i = 0; i < pollenArray.length; i++) {
        if (parseInt(pollenArray[i][1]) > valMax){
            valMax = parseInt(pollenArray[i][1]);
        }
    }
    return valMax;
}

function getting_pollen_from_year(year, pollenArray) {
    for (let i = 0; i < pollenArray.length; i++) {
        if (pollenArray[i][0] === year.toString()){
            return parseInt(pollenArray[i][1]);
        }
    }
    return 0;
}

function getting_nb_active_particles(particlesArray) {
    let nbActive = 0;
    for (let i = 0; i < particlesArray.length; i++) {
        if (particlesArray[i].isActive()){
            nbActive += 1;
        }
    }
    return nbActive;
}

function update_nb_particles(year, pollenArray, particlesArray, sketch) {
    let nbParticles = getting_pollen_from_year(year, pollenArray);
    let nbParticlesActive = getting_nb_active_particles(particlesArray);
    let tmp_nb_particles = nbParticles - nbParticlesActive;
    let minVal = sketch.min(pollenArray.map(e => parseInt(e[1]) || 1000));

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

    let colorHexa = COLORSPARTICLE[parseInt(((nbParticles-minVal)/(particlesArray.length-minVal))*5)];
    let previousColor = particlesArray[0].getColor();

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].cleanParticle();
        particlesArray[i].modifyColor(sketch.lerpColor(sketch.color(previousColor), sketch.color(colorHexa), 0.1));
    }
}

var canvasParticlesAmbroisie = function(sketch){
    let textSize = 25;
    sketch.setup = function() {
        let x_coordinate = document.querySelector("#pollenEvolutionVisualizerAmbroisie").offsetLeft
        let y_coordinate = document.querySelector("#pollenEvolutionVisualizerAmbroisie").offsetTop;
        let canvas_w = document.querySelector("#pollenEvolutionVisualizerAmbroisie").offsetWidth
        let canvas = sketch.createCanvas(canvas_w, 400);
        canvas.parent("#pollenEvolutionVisualizerAmbroisie");
        nbParticlesAmbroisie = getting_pollen_from_year(pollen_mean_current_year, pollen_ambroisie_mean_year_array);
        var value_max_of_pollen_array = getting_value_max_of_pollen_array(pollen_ambroisie_mean_year_array);
        
        for(let i = 0;i<value_max_of_pollen_array;i++){
            if (i < nbParticlesAmbroisie) {
                particlesAmbroisie.push(new Particle(sketch, canvas_w, 400, colorParticleAmbroisie));
            }
            else {
                particlesAmbroisie.push(new Particle(sketch, canvas_w, 400, colorParticleAmbroisie, false));
            }
        }

        namePollenAmbroisie = sketch.createP("Ambroisie");
        namePollenAmbroisie.addClass("namePollen");
        namePollenAmbroisie.position(x_coordinate+(canvas_w/2)-40, y_coordinate-textSize);
    }
    sketch.draw = function() {
        sketch.background('#B3D9FF');

        update_nb_particles(pollen_mean_current_year, pollen_ambroisie_mean_year_array, particlesAmbroisie, sketch);

        for(let i = 0;i<particlesAmbroisie.length;i++) {
            particlesAmbroisie[i].createParticle();
            particlesAmbroisie[i].moveParticle();
        }
    }
    sketch.windowResized = function() {
        let canvas_w = document.querySelector("#pollenEvolutionVisualizerAmbroisie").offsetWidth
        sketch.resizeCanvas(canvas_w, 400);

        for(let i = 0;i<particlesAmbroisie.length;i++) {
            particlesAmbroisie[i].setWidthAndHeight(canvas_w, 400);
            particlesAmbroisie[i].moveParticle();
        }

        let x_coordinate = document.querySelector("#pollenEvolutionVisualizerAmbroisie").offsetLeft
        let y_coordinate = document.querySelector("#pollenEvolutionVisualizerAmbroisie").offsetTop;
        namePollenAmbroisie.position(x_coordinate+(canvas_w/2)-40, y_coordinate-textSize);
    }
}

var canvasParticlesBouleau = function(sketch){
    let textSize = 25;
    sketch.setup = function() {
        let x_coordinate = document.querySelector("#pollenEvolutionVisualizerBouleau").offsetLeft
        let y_coordinate = document.querySelector("#pollenEvolutionVisualizerBouleau").offsetTop;
        let canvas_w = document.querySelector("#pollenEvolutionVisualizerBouleau").offsetWidth
        let canvas = sketch.createCanvas(canvas_w, 400);
        canvas.parent("#pollenEvolutionVisualizerBouleau");
        nbParticlesBouleau = getting_pollen_from_year(pollen_mean_current_year, pollen_bouleau_mean_year_array);
        var value_max_of_pollen_array = getting_value_max_of_pollen_array(pollen_bouleau_mean_year_array);

        for(let i = 0;i<value_max_of_pollen_array;i++){
            if (i < nbParticlesBouleau) {
                particlesBouleau.push(new Particle(sketch, canvas_w, 400, colorParticleBouleau));
            }
            else {
                particlesBouleau.push(new Particle(sketch, canvas_w, 400, colorParticleBouleau, false));
            }
        }

        namePollenBouleau = sketch.createP("Bouleau");
        namePollenBouleau.addClass("namePollen");
        namePollenBouleau.position(x_coordinate+(canvas_w/2)-25, y_coordinate-textSize);
    }
    sketch.draw = function() {
        sketch.background('#B3D9FF');

        update_nb_particles(pollen_mean_current_year, pollen_bouleau_mean_year_array, particlesBouleau, sketch);

        for(let i = 0;i<particlesBouleau.length;i++) {
            particlesBouleau[i].createParticle();
            particlesBouleau[i].moveParticle();
        }
    }
    sketch.windowResized = function() {
        let canvas_w = document.querySelector("#pollenEvolutionVisualizerBouleau").offsetWidth
        sketch.resizeCanvas(canvas_w, 400);
        for(let i = 0;i<particlesAmbroisie.length;i++) {
            particlesBouleau[i].setWidthAndHeight(canvas_w, 400);
            particlesBouleau[i].moveParticle();
        }

        let x_coordinate = document.querySelector("#pollenEvolutionVisualizerBouleau").offsetLeft
        let y_coordinate = document.querySelector("#pollenEvolutionVisualizerBouleau").offsetTop;
        namePollenBouleau.position(x_coordinate+(canvas_w/2)-40, y_coordinate-textSize);
    }
}

var canvasParticlesGraminees = function(sketch){
    let textSize = 25;
    sketch.setup = function() {
        let x_coordinate = document.querySelector("#pollenEvolutionVisualizerGraminees").offsetLeft
        let y_coordinate = document.querySelector("#pollenEvolutionVisualizerGraminees").offsetTop;
        let canvas_w = document.querySelector("#pollenEvolutionVisualizerGraminees").offsetWidth
        let canvas = sketch.createCanvas(canvas_w, 400);
        canvas.parent("#pollenEvolutionVisualizerGraminees");

        nbParticlesGraminees = getting_pollen_from_year(pollen_mean_current_year, pollen_graminees_mean_year_array);
        var value_max_of_pollen_array = getting_value_max_of_pollen_array(pollen_graminees_mean_year_array);

        for(let i = 0;i<value_max_of_pollen_array;i++){
            if (i < nbParticlesGraminees) {
                particlesGraminees.push(new Particle(sketch, canvas_w, 400, colorParticleGraminees));
            }
            else {
                particlesGraminees.push(new Particle(sketch, canvas_w, 400, colorParticleGraminees, false));
            }
        }

        namePollen = sketch.createP("Graminées");
        namePollen.addClass("namePollen");
        namePollen.position(x_coordinate+(canvas_w/2)-40, y_coordinate-textSize);
    }
    sketch.draw = function() {
        sketch.background('#B3D9FF');

        update_nb_particles(pollen_mean_current_year, pollen_graminees_mean_year_array, particlesGraminees, sketch);

        for(let i = 0;i<particlesGraminees.length;i++) {
            particlesGraminees[i].createParticle();
            particlesGraminees[i].moveParticle();
        }
    }
    sketch.windowResized = function() {
        let canvas_w = document.querySelector("#pollenEvolutionVisualizerGraminees").offsetWidth
        sketch.resizeCanvas(canvas_w, 400);
        for(let i = 0;i<particlesAmbroisie.length;i++) {
            particlesGraminees[i].setWidthAndHeight(canvas_w, 400);
            particlesGraminees[i].moveParticle();
        }

        let x_coordinate = document.querySelector("#pollenEvolutionVisualizerGraminees").offsetLeft
        let y_coordinate = document.querySelector("#pollenEvolutionVisualizerGraminees").offsetTop;
        namePollen.position(x_coordinate+(canvas_w/2)-40, y_coordinate-textSize);
    }
}



var canvasParticlesSlider = function(sketch){
    let canvas_h = 100;
    let textSize = 25;

    sketch.setup = function() {
        let x_coordinate = document.querySelector("#pollenEvolutionVisualizerSlider").offsetLeft;
        let y_coordinate = document.querySelector("#pollenEvolutionVisualizerSlider").offsetTop + navbarOffset;
        let canvas_w = document.querySelector("#pollenEvolutionVisualizerSlider").offsetWidth
        let canvas = sketch.createCanvas(canvas_w, canvas_h);
        canvas.parent("#pollenEvolutionVisualizerSlider");

        currentYearPollen = sketch.createP("1995");
        currentYearPollen.addClass("currentYearPollen");
        currentYearPollen.position(x_coordinate+(canvas_w/2)-textSize, y_coordinate);
        
        slider = sketch.createSlider(1995, 2023);
        slider.position(x_coordinate, y_coordinate+(canvas_h/2));
        slider.size(canvas_w);
        slider.addClass("slider");
    }
    sketch.draw = function() {
        // sketch.background('#B3D9FF');
        let g = slider.value();
        currentYearPollen.html(g);
        pollen_mean_current_year = g;
    }
    sketch.windowResized = function() {
        let x_coordinate = document.querySelector("#pollenEvolutionVisualizerSlider").offsetLeft
        let y_coordinate = document.querySelector("#pollenEvolutionVisualizerSlider").offsetTop;
        let canvas_w = document.querySelector("#pollenEvolutionVisualizerSlider").offsetWidth;
        sketch.resizeCanvas(canvas_w, canvas_h);
        slider.size(canvas_w);
        slider.position(x_coordinate, y_coordinate+(canvas_h/2));
        currentYearPollen.position(x_coordinate+(canvas_w/2)-textSize, y_coordinate);
    }
}

new p5(canvasParticlesSlider);

fetch('static/data/pollen_ambroisie.csv')
    .then((res) => res.text())
    .then((text) => {
        var data = text.split('\n')
        
        for (var row in data) {
            pollen_ambroisie_mean_year_array.push(data[row].split(','));
        }

        getting_pollen_from_year(1995, pollen_ambroisie_mean_year_array);

        
        new p5(canvasParticlesAmbroisie);
    })
    .catch((e) => console.error(e));

fetch('static/data/pollen_bouleau.csv')
    .then((res) => res.text())
    .then((text) => {
        var data = text.split('\n')
        
        for (var row in data) {
            pollen_bouleau_mean_year_array.push(data[row].split(','));
        }

        getting_pollen_from_year(1995, pollen_bouleau_mean_year_array);

        
        new p5(canvasParticlesBouleau);

    })
    .catch((e) => console.error(e));

fetch('static/data/pollen_graminees.csv')
    .then((res) => res.text())
    .then((text) => {
        var data = text.split('\n')
        
        for (var row in data) {
            pollen_graminees_mean_year_array.push(data[row].split(','));
        }

        getting_pollen_from_year(1995, pollen_graminees_mean_year_array);

        
        new p5(canvasParticlesGraminees);

    })
    .catch((e) => console.error(e));