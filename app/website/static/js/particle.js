
// this class describes the properties of a single particle.
class Particle {
    // setting the co-ordinates, radius and the
    // speed of a particle in both the co-ordinates axes.
    constructor(sketch, width, height){
        this.sketch = sketch;
        this.width = width;
        this.height = height;
        this.x = this.sketch.random(0,this.width);
        this.y = this.sketch.random(0,this.height);
        this.r = this.sketch.random(1,8);
        this.xSpeed = this.sketch.random(-2,2);
        this.ySpeed = this.sketch.random(-1,1.5);
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