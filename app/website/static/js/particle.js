
// this class describes the properties of a single particle.
class Particle {
    // setting the co-ordinates, radius and the
    // speed of a particle in both the co-ordinates axes.
    constructor(sketch, width, height, display=true){
        this.sketch = sketch;
        this.width = width;
        this.height = height;
        this.x = this.sketch.random(0,this.width);
        this.y = this.sketch.random(0,this.height);
        this.rMax = this.sketch.random(8,15);
        this.r = this.rMax;
        this.xSpeed = this.sketch.random(-2,2);
        this.ySpeed = this.sketch.random(-1,1.5);
        this.growing = false;
        this.shrinking = false;
        if (!display) {
            this.r = 0;
        }
        this.active = display;
    }

    setWidthAndHeight(width, height) {
        this.width = width;
        this.height = height;
    }
    
    // creation of a particle.
    createParticle() {
        this.sketch.noStroke();
        this.sketch.fill('#FFEB84');
        this.sketch.circle(this.x,this.y,this.r);
    }
    
    // setting the particle in motion.
    moveParticle() {
        if(this.x > this.width) {
            this.x = this.width
        }
        else if(this.x < 0) {
            this.x = 0
        }
        if(this.x <= 0 || this.x >= this.width)
        this.xSpeed*=-1;
        if(this.y <= 0 || this.y >= this.height)
        this.ySpeed*=-1;
        this.x+=this.xSpeed;
        this.y+=this.ySpeed;
    }

    deleteParticle() {
        this.growing = false;
        if (this.r <= 0) {
            this.r = 0;
            this.active = false;
            this.shrinking = false;
        }
        else {    
            this.r -= 1;
            this.shrinking = true;
        }
    }

    addParticle() {
        this.shrinking = false;
        if (this.r >= this.rMax) {
            this.r = this.rMax;
            this.active = true;
            this.growing = false;
        }
        else {
            this.r += 1;
            this.growing = true;
        }
    }

    getR() {
        return this.r;
    }

    getRMax() {
        return this.rMax;
    }

    isActive() {
        return this.active;
    }

    isIntermediate() {
        return this.intermediate;
    }

    cleanParticle(){
        if(this.growing){
            this.addParticle();
        }
        if (this.shrinking){
            this.deleteParticle();
        }
    }
}

// // an array to add multiple particles
// let particles = [];

// function setup() {
//     let canvas_w = document.querySelector("#pollenEvolutionVisualizerAmbroisie").offsetWidth
//     let canvas = createCanvas(canvas_w, 400);
//     canvas.parent("#pollenEvolutionVisualizerAmbroisie");
//     for(let i = 0;i<100;i++){
//         particles.push(new Particle());
//     }
// }

// function draw() {
//     background('#B3D9FF');
//     for(let i = 0;i<particles.length;i++) {
//         particles[i].createParticle();
//         particles[i].moveParticle();
//     }
// }

// function windowResized() {
//     let canvas_w = document.querySelector("#pollenEvolutionVisualizerAmbroisie").offsetWidth
//     resizeCanvas(canvas_w, 400);
// }