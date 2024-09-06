class Rectangle extends Shape{
  constructor(shapesManager, width, height){
    super(shapesManager);
    this.shapesManager = shapesManager
    this.width = width;
    this.height = height;
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

  setBounds(width, height){
    this.width = width;
    this.height = height;
  }

  setLastPosition(){
    this.lastPosition = { x: this.x , y: this.y };
  }

  getRect(){
    return {
      x: this.x,
      y: this.y,
      width:this.width,
      height: this.height
    }
  }

  collidesWith(particle) {
    const { x, y, width, height } = this.getRect();
    const px = particle.position.x;
    const py = particle.position.y;
    const size = particle.size;

    return (
      px + size > x - this.stroke.width &&
      px - size < x + width + this.stroke.width &&
      py + size > y - this.stroke.width &&
      py - size < y + height + this.stroke.width
    );
  }

  draw(ctx){
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + this.height);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.lineTo(this.x + this.width, this.y);
    ctx.lineTo(this.x, this.y);
    if(this.fill){
      ctx.save();
      ctx.globalAlpha = this.active ? this.fill.a : 0.5;
      ctx.fillStyle = this.getColorForType('fill');
      ctx.fill();
      ctx.restore();
    }
    if(this.stroke.width){
      ctx.save();
      ctx.globalAlpha = this.active ? this.stroke.a : 0.5;
      ctx.strokeStyle = this.getColorForType('stroke');
      ctx.lineWidth = this.stroke.width;
      ctx.stroke();
      ctx.restore();
    }
  }
}
