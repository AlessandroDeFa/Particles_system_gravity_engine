class ShapesManeger {
  constructor(engine){
    this.engine = engine;
    this.shapes = [];
  }

  setShapes(s){
    this.shapes = s;
  }

  removeShape(id){
    this.shapes = this.shapes.filter(shape => shape.id !== parseInt(id, 10));
  }

  setStyleForType(type, id, ...params){
    const shape = this.getShapeById(id);
    if (!shape) throw new Error(`Shape with id ${id} not found.`);
    switch(type){
      case 'fill':
        shape.setFill(...params);
        break;
      case 'stroke':
        shape.setStroke(...params);
        break;
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  }

  addShape(type, ...params){
    let shape;
    switch(type){
      case 'rectangle':
        shape = new Rectangle(this, ...params);
        break;
      case 'square':
        shape = new Rectangle(this, ...params);
        break;
      case 'circle':
        shape = new Circle(this, ...params);
        break;
      case 'line':
        shape = new Line(this, ...params);
        break;
    }
    this.shapes.push(shape);
  }

  getId(){
    if (this.shapes.length === 0) {
      return 1;
    }
    return this.shapes[this.shapes.length - 1].id + 1;
  }

  getShapes(){
    return this.shapes;
  }

  getShapeGrabbed(x, y){
    for (let i = this.shapes.length - 1; i >= 0; i--){
      const shape = this.shapes[i];
      if (shape instanceof Rectangle) {
        if (this.isPointInRectangle(x, y, shape)) {
          return shape;
        }
      } else if (shape instanceof Circle) {
        if (this.isPointInCircle(x, y, shape)) {
          return shape;
        }
      } else if (shape instanceof Line) {
        if (this.isPointNearLine(x, y, shape)) {
          return shape;
        }
      }
    }
    return false;
  }

  isPointInRectangle(x, y, shape) {
    const rect = shape.getRect();
    return x >= rect.x && x <= rect.x + rect.width &&
            y >= rect.y && y <= rect.y + rect.height;
  }

  isPointInCircle(x, y, circle) {
    const rect = circle.getRect();
    const dx = x - rect.x;
    const dy = y - rect.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= rect.size;
  }

  isPointNearLine(x, y, line) {
    const { x1, y1, x2, y2 } = line.getRect();
    const { closestX, closestY } = line.getClosestPointOnLine(x, y, x1, y1, x2, y2);
    const distance = line.getDistance(x, y, closestX, closestY);
    const tolerance = 10;
    return distance <= tolerance;
  }

  confirmShapes(){
    this.shapes.forEach(shape => {
      if (!shape.getActive()){
        shape.setActive(true);
        shape.setLastPosition();
      }
    })
  }

  discardShapes(){
    this.shapes.forEach(shape => {
      if(!shape.getActive() && shape.lastPosition){
        shape.resetOffset();
        if (shape instanceof Line){
          shape.moveTo(shape.lastPosition.x, shape.lastPosition.y, shape.lastPosition.x2, shape.lastPosition.y2);
        }else{
          shape.moveTo(shape.lastPosition.x, shape.lastPosition.y);
        }
        shape.setActive(true);
      }
    })
    this.shapes = this.shapes.filter(shape => shape.getActive());
  }

  getShapeById(id){
    return this.shapes.find(shape => shape.id === parseInt(id, 10));
  }
}
