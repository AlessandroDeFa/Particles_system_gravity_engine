class Circle extends Shape {
  constructor(shapeManager, size){
    super(shapeManager);
    this.shapesManager = shapeManager;
    this.size = size;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  moveTo(x, y){
    this.x = x - this.offsetX;
    this.y = y - this.offsetY;
  }

  calcOffset(x, y){
    this.offsetX = x - this.x;
    this.offsetY = y - this.y;
  }

  resetOffset(){
    this.offsetX = 0, this.offsetY = 0;
  }

  setBounds(size){
    this.size = size;
  }

  setLastPosition(){
    this.lastPosition = { x: this.x , y: this.y };
  }

  getRect(){
    return {
      x: this.x,
      y: this.y,
      size: this.size
    }
  }

  collidesWith(particle) {
    const { x, y, size } = this.getRect();
    const px = particle.position.x;
    const py = particle.position.y;
    const radius = particle.size / 2;

    const dx = px - x;
    const dy = py - y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < radius + size;
  }

  draw(ctx){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    if (this.fill){
      ctx.save();
      ctx.globalAlpha = this.active ? this.fill.a : 0.5;
      ctx.fillStyle = this.getColorForType('fill');
      ctx.fill();
      ctx.restore();
    }
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
