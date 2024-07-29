
// this class describes the properties of a button for the PPM year button selection.
class PPMYEARBUTTON {
    
    constructor(sketch, width, height, year, posX, posY){
        this.sketch = sketch;
        this.width = width;
        this.height = height;
        this.year = year;

        this.posX = posX;
        this.posY = posY;

        this.isCurrentlySelected = year == 2011 ? true : false;
    }

    over() {
        if (this.sketch.mouseX > this.posX && this.sketch.mouseX < this.posX + this.width && this.sketch.mouseY > this.posY && this.sketch.mouseY < this.posY + this.height) {
            return true;
        }
        else {
            return false;
        }
    }
    
    // creation of a particle.
    displayButton() {
        this.sketch.stroke(0);
        if (this.isCurrentlySelected) {
            this.sketch.fill(this.sketch.color("#c1c1c1"));
        }
        else if (this.over()) {
            this.sketch.fill(this.sketch.color("#DCDCDC"));
        } else {
            this.sketch.fill(this.sketch.color("#fff"));
        }
        this.sketch.rect(this.posX, this.posY, this.width, this.height, 5);
        
        this.sketch.fill(0);
        this.sketch.noStroke();
        this.sketch.textAlign(this.sketch.CENTER, this.sketch.CENTER);
        this.sketch.textSize(18);
        this.sketch.text(this.year.toString(), this.posX + this.width/2, this.posY + this.height/2);
    }

    resize(width, posX, posY) {
        this.width = width;
        this.posX = posX;
        this.posY = posY;
    }

    click(mouseX, mouseY) {
        if (mouseX > this.posX && mouseX < this.posX + this.width && mouseY > this.posY && mouseY < this.posY + this.height) {
            this.isCurrentlySelected = true;
        }
    }

    getIsCurrentlySelected() {
        return this.isCurrentlySelected;
    }

    select() {
        this.isCurrentlySelected = true;
    }

    deselect() {
        this.isCurrentlySelected = false;
    }
}
