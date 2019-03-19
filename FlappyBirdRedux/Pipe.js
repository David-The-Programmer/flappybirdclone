class Pipe {
  constructor(xOfPipe, yOfPipe, pipeWidth, pipeHeight) {
    this.x = xOfPipe;
    this.y = yOfPipe;
    this.width = pipeWidth;
    this.height = pipeHeight;
  }


  draw(pipeHeadImg, shaftImg) {
    let xOfPipeHead = this.x - ((PIPE_HEAD_WIDTH - this.width) / 2);
    if(this.y == 0) {
      push();
      image(pipeHeadImg, xOfPipeHead, this.y + (this.height - PIPE_HEAD_HEIGHT), PIPE_HEAD_WIDTH, PIPE_HEAD_HEIGHT);
      image(shaftImg, this.x, this.y, this.width, this.height - PIPE_HEAD_HEIGHT);
      pop();

    } else {
      push();
      image(pipeHeadImg, xOfPipeHead, this.y, PIPE_HEAD_WIDTH, PIPE_HEAD_HEIGHT);
      image(shaftImg, this.x, this.y + PIPE_HEAD_HEIGHT, this.width, this.height - PIPE_HEAD_HEIGHT);
      pop();
    }

  }

  move(movementSpeed) {
    this.x -= movementSpeed;
  }
}
