class Ground {
  constructor(xOfGround, yOfGround, groundWidth, groundHeight) {
    this.x = xOfGround;
    this.y = yOfGround;
    this.width = groundWidth;
    this.height = groundHeight;
  }

  // draws the ground
  draw(img) {
    push();
    image(img, this.x, this.y, this.width, this.height);
    pop();
  }
}
