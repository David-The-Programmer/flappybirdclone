// Class responsible for the bird object
// handles how the bird flys upwards and falls

class Bird {
  constructor(xOfBird, startingYOfbird, birdRadius) {
    this.x = xOfBird;
    this.y = startingYOfbird;
    this.radius = birdRadius;
    this.velocity = 0;
    this.rotationAngle;
    this.timer = 0;
  }

  // draws the bird onto the canvas
  draw(img1, img2, img3) {
    push();
    imageMode(CENTER);
    translate(this.x, this.y);
    angleMode(DEGREES);
    if(this.velocity < 10) {
      this.rotationAngle = -30;
      rotate(this.rotationAngle);

    } else if(this.velocity <= 25){
      this.rotationAngle += 20;
      this.rotationAngle = constrain(this.rotationAngle, -30, 90);
      rotate(this.rotationAngle);

    } else {
      rotate(90);
    }

    if(this.timer >= 0 && this.timer < 5) {
      image(img1, 0, 0, this.radius * 2.6, this.radius * 2);

    } else if(this.timer >= 5 && this.timer < 10) {
      image(img2, 0, 0, this.radius * 2.6, this.radius * 2);

    } else if(this.timer >= 10 && this.timer < 15) {
      image(img3, 0, 0, this.radius * 2.6, this.radius * 2);

    } else {
      this.timer = 0;
      image(img1, 0, 0, this.radius * 2.6, this.radius * 2);
    }

    pop();
    this.timer++;
  }

  // function responsible for the bird flying upwards
  flyUp(upwardForce) {
    this.velocity -= upwardForce;
    this.velocity /= 2;
   }

   // function responsible for the bird flying downwards
   fall(downwardForce) {
     this.velocity += downwardForce;
   }

   // updates the y position of the bird
   update() {
     this.y += this.velocity;
   }

   // checks to see if the bird has collided with the top or ground of the world
   collideWithGround(groundObject) {
     return(this.y + this.radius >=  groundObject.y);
   }

   // checks if the bird has collided with the pipes
   collideWithPipes(upperPipe, lowerPipe) {
     if(this.x + this.radius >= upperPipe.x && this.x - this.radius <= upperPipe.x + upperPipe.width) {
       if(this.y - this.radius <= upperPipe.y + upperPipe.height || this.y + this.radius >= lowerPipe.y) {
         return true;
       }
     }
   }



}
