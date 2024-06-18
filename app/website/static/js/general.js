let navbarOffset = 56;

// an array to add multiple particles
let particlesAmbroisie = [];
let particlesBouleau = [];
let particlesGraminees = [];

let nbParticlesAmbroisie = 100;
let nbParticlesBouleau = 100;
let nbParticlesGraminees = 100;

var canvasParticlesAmbroisie = function(sketch){
    sketch.setup = function() {
        let canvas_w = document.querySelector("#pollenEvolutionVisualizerAmbroisie").offsetWidth
        let canvas = sketch.createCanvas(canvas_w, 400);
        canvas.parent("#pollenEvolutionVisualizerAmbroisie");
        for(let i = 0;i<nbParticlesAmbroisie;i++){
            particlesAmbroisie.push(new Particle(sketch, canvas_w, 400));
        }
    }
    sketch.draw = function() {
        sketch.background('#B3D9FF');
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
    }
}

var canvasParticlesBouleau = function(sketch){
    sketch.setup = function() {
        let canvas_w = document.querySelector("#pollenEvolutionVisualizerBouleau").offsetWidth
        let canvas = sketch.createCanvas(canvas_w, 400);
        canvas.parent("#pollenEvolutionVisualizerBouleau");
        for(let i = 0;i<nbParticlesBouleau;i++){
            particlesBouleau.push(new Particle(sketch, canvas_w, 400));
        }
    }
    sketch.draw = function() {
        sketch.background('#B3D9FF');
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
    }
}

var canvasParticlesGraminees = function(sketch){
    sketch.setup = function() {
        let canvas_w = document.querySelector("#pollenEvolutionVisualizerGraminees").offsetWidth
        let canvas = sketch.createCanvas(canvas_w, 400);
        canvas.parent("#pollenEvolutionVisualizerGraminees");
        for(let i = 0;i<nbParticlesGraminees;i++){
            particlesGraminees.push(new Particle(sketch, canvas_w, 400));
        }
    }
    sketch.draw = function() {
        sketch.background('#B3D9FF');
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
    }
}

new p5(canvasParticlesAmbroisie);
new p5(canvasParticlesBouleau);
new p5(canvasParticlesGraminees);

var canvasParticlesSlider = function(sketch){
    sketch.setup = function() {
        let x_coordinate = document.querySelector("#pollenEvolutionVisualizerSlider").offsetLeft
        let y_coordinate = document.querySelector("#pollenEvolutionVisualizerSlider").offsetTop + navbarOffset;
        let canvas_w = document.querySelector("#pollenEvolutionVisualizerSlider").offsetWidth
        let canvas_h = 100;
        let canvas = sketch.createCanvas(canvas_w, canvas_h);
        let textSize = 25;
        canvas.parent("#pollenEvolutionVisualizerSlider");
        currentYearPollen = sketch.createP("1994");
        currentYearPollen.addClass("currentYearPollen");
        console.log(document.querySelector(".currentYearPollen").offsetWidth)
        currentYearPollen.position(x_coordinate+(canvas_w/2)-textSize, y_coordinate);
        
        slider = sketch.createSlider(1994, 2023);
        slider.position(x_coordinate, y_coordinate+(canvas_h/2));
        slider.size(canvas_w);
        slider.addClass("slider");
    }
    sketch.draw = function() {
        sketch.background('#B3D9FF');
        let g = slider.value();
        currentYearPollen.html(g);
    }
    sketch.windowResized = function() {
        let x_coordinate = document.querySelector("#pollenEvolutionVisualizerSlider").offsetLeft
        let y_coordinate = document.querySelector("#pollenEvolutionVisualizerSlider").offsetTop;
        let canvas_w = document.querySelector("#pollenEvolutionVisualizerSlider").offsetWidth
        let canvas_h = document.querySelector("#pollenEvolutionVisualizerSlider").offsetHeight
        sketch.resizeCanvas(canvas_w, 100);
        slider.size(canvas_w);
        slider.position(x_coordinate, y_coordinate);
        currentYearPollen.position(x_coordinate, y_coordinate);
    }
}

new p5(canvasParticlesSlider);