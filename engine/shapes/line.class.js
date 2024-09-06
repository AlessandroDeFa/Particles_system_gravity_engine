class Line extends Shape {
  constructor(shapesManager, x2, y2) {
    super(shapesManager);
    this.shapesManager = shapesManager;
    this.x2 = x2;
    this.y2 = y2;
    this.offsetX1 = 0;
    this.offsetY1 = 0;
    this.offsetX2 = 0;
    this.offsetY2 = 0;
  }

  moveTo(x, y, x2=x, y2=y){
    this.x = x - this.offsetX1;
    this.y = y - this.offsetY1;
    this.x2 = x2 + this.offsetX2;
    this.y2 = y2 + this.offsetY2;
  }

  calcOffset(x, y){
    this.offsetX1 = x - this.x;
    this.offsetY1 = y - this.y;
    this.offsetX2 = this.x2 - x;
    this.offsetY2 = this.y2 - y;
  }

  resetOffset(){
    this.offsetX1 = 0;
    this.offsetY1 = 0;
    this.offsetX2 = 0;
    this.offsetY2 = 0;
  }

  setLastPosition(){
    this.lastPosition = { x: this.x , y: this.y , x2: this.x2, y2: this.y2 };
  }

  getRect(){
    return {
      x1: this.x,
      y1: this.y,
      x2: this.x2,
      y2: this.y2
    }
  }

  getClosestPointOnLine(px, py, x1, y1, x2, y2) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    const param = lenSq !== 0 ? dot / lenSq : -1;

    let closestX, closestY;

    if (param < 0) {
      closestX = x1;
      closestY = y1;
    } else if (param > 1) {
      closestX = x2;
      closestY = y2;
    } else {
      closestX = x1 + param * C;
      closestY = y1 + param * D;
    }

    return { closestX, closestY };
  }

  getDistance(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  }

  collidesWith(particle) {
    const px = particle.position.x;
    const py = particle.position.y;

    return this.shapesManager.isPointNearLine(px, py, this);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x2, this.y2);
    if (this.stroke.width){
      ctx.save();
      ctx.globalAlpha = this.active ? this.stroke.a : 0.5;
      ctx.strokeStyle = this.getColorForType('stroke');
      ctx.lineWidth = this.stroke.width;
      ctx.stroke();
      ctx.restore();
    }
  }
}
