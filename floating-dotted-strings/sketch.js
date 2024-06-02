var paths = [];
var painting = false;
var next = 0;
var current;
var previous;

function setup() {
  createCanvas(1490, 685);
  current = createVector(0,0);
  previous = createVector(0,0);
};

function draw() {
  // background(200);
  background('#fae');
  
  if (millis() > next && painting) {

    current.x = mouseX;
    current.y = mouseY;

    var force = p5.Vector.sub(current, previous);
    force.mult(0.05);

    paths[paths.length - 1].add(current, force);
    
    next = millis() + random(100);

    previous.x = current.x;
    previous.y = current.y;
  }

  for( var i = 0; i < paths.length; i++) {
    paths[i].update();
    paths[i].display();
  }
}

function mousePressed() {
  next = 0;
  painting = true;
  previous.x = mouseX;
  previous.y = mouseY;
  paths.push(new Path());
}

function mouseReleased() {
  painting = false;
}

function Path() {
  this.particles = [];
  this.hue = random(100);
}

Path.prototype.add = function(position, force) {
  this.particles.push(new Particle(position, force, this.hue));
}

Path.prototype.update = function() {  
  for (var i = 0; i < this.particles.length; i++) {
    this.particles[i].update();
  }
}  

Path.prototype.display = function() {
  
  for (var i = this.particles.length - 1; i >= 0; i--) {
    if (this.particles[i].lifespan <= 0) {
      this.particles.splice(i, 1);
    } else {
      this.particles[i].display(this.particles[i+1]);
    }
  }

}  

function Particle(position, force, hue) {
  this.position = createVector(position.x, position.y);
  this.velocity = createVector(force.x, force.y);
  this.drag = 0.95;
  this.lifespan = 255;
}

Particle.prototype.update = function() {
  this.position.add(this.velocity);
  this.velocity.mult(this.drag);
  this.lifespan--;
}

Particle.prototype.display = function(other) {
  stroke(0, this.lifespan);
  fill(0, this.lifespan/2);    
  ellipse(this.position.x,this.position.y, 8, 8);    
  if (other) {
    line(this.position.x, this.position.y, other.position.x, other.position.y);
  }
}