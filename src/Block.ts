export class Block {
    public figureId;
    public color;
    public positionX;
    public positionY;
  
    constructor(
      figureId: number,
      positionX: number,
      positionY: number,
      color: string
    ) {
      this.positionX = positionX;
      this.positionY = positionY;
      this.color = color;
      this.figureId = figureId;
    }
  }
  