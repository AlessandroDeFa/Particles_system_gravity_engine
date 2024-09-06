class Shape {
    constructor(shapesManager) {
      if (new.target === Shape) {
          throw new Error("Cannot instantiate an abstract class directly.");
      }
      this.shapesManager = shapesManager;
      this.x = G_OPTIONS.coords.x;
      this.y = G_OPTIONS.coords.y;
      this.lastPosition=null;
      this.active = false;
      this.isCollapsed = false;
      this.id = this.shapesManager.getId();
      this.fill = { ...G_OPTIONS.fill };
      this.stroke = { ...G_OPTIONS.stroke };
    }

    setActive(isActive) {
      this.active = isActive;
    }

    getActive(){
      return this.active;
    }

    setCollapsed(value){
      this.isCollapsed = value;
    }

    getColorForType(type) {
      switch (type) {
        case 'fill':
          return `rgb(${this.fill.r}, ${this.fill.g}, ${this.fill.b})`;
        case 'stroke':
          return `rgb(${this.stroke.r}, ${this.stroke.g}, ${this.stroke.b})`;
        default:
          throw new Error(`Unknown color type: ${type}`);
      }
    }

    setFill(r, g, b, a){
      this.fill.r = r;
      this.fill.g = g;
      this.fill.b = b;
      this.fill.a = a;
    }

    setStroke(r, g, b, a, width = this.stroke.width){
      this.stroke.r = r;
      this.stroke.g = g;
      this.stroke.b = b;
      this.stroke.a = a;
      this.stroke.width = width;
    }

    getFill(){
      return this.fill;
    }

    getStroke(){
      return this.stroke;
    }

    setStrokeWidth(width){
      this.stroke.width = width
    }

    collidesWith(particle){
      throw new Error("Method 'collidesWith()' must be implemented.");
    }

    calcOffset(x, y){
      throw new Error("Method 'moveTo()' must be implemented.");
    }

    resetOffset(){
      throw new Error("Method 'resetOffset()' must be implemented.");
    }

    setLastPosition(){
      throw new Error("Method 'resetOffset()' must be implemented.");
    }

    moveTo(x, y){
      throw new Error("Method 'moveTo()' must be implemented.");
    }

    getRect(){
      throw new Error("Method 'getRect()' must be implemented.");
    }

    setBounds(){
      throw new Error("Method 'setBounds()' must be implemented.");
    }

    draw(ctx) {
       throw new Error("Method 'draw()' must be implemented.");
    }
}
