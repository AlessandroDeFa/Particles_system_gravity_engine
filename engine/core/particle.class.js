class Particle {
  constructor(engine, shapeManager){
    this.engine = engine;
    this.shapeManager = shapeManager;
    this.id = this.engine.particles.length + 1;
    this.size = 6;
    this.x = 50;
    this.y = this.size;
    this.position = { x: this.x, y: this.y };
    this.lastPosition = {x: this.x, y: this.y};
    this.acceleration = { x: 0, y: 0 };
    this.damping = 0.9992;
    this.restitution = 0.7;
    this.isColliding = false;
    this.color = this.#getRandomColor();
  }

  update(dt){
    const velocity = subtractObjects(this.position, this.lastPosition);

    if (!this.isColliding){
      velocity.x *= this.damping;
    }

    if (Math.abs(velocity.x) < 0.001){
      velocity.x = 0;
    }

    this.lastPosition = {...this.position}

    this.position = {
      x: this.position.x + velocity.x + this.acceleration.x * (dt * dt),
      y: this.position.y + velocity.y + this.acceleration.y * (dt * dt)
    };

    this.acceleration = { x: 0, y: 0 };

    this.checkCanvasBounds();
    this.checkCollisionWithShapes();
  }

  accelerate(g){
    this.acceleration.x += g.x;
    this.acceleration.y += g.y;
  }

  setVelocity(v,dt){
      this.lastPosition = {
        x: this.position.x - (v.x * dt),
        y: this.position.y - (v.y * dt),
      }
  }

  checkCanvasBounds() {
    const width = this.engine.width;
    const height = this.engine.height;

    const velocity = subtractObjects(this.position, this.lastPosition);

    if (this.position.x - this.size < 0) {
        this.position.x = this.size;
        this.lastPosition.x = this.position.x + velocity.x * this.restitution;
    }

    if (this.position.x + this.size > width) {
        this.position.x = width - this.size;
        this.lastPosition.x = this.position.x + velocity.x * this.restitution;
    }

    if (this.position.y - this.size < 0) {
        this.position.y = this.size;
        this.lastPosition.y = this.position.y + velocity.y * this.restitution;
    }

    if (this.position.y + this.size > height) {
        this.position.y = height - this.size;
        this.lastPosition.y = this.position.y + velocity.y * this.restitution;
    }
  }

  checkCollisionWithShapes(){
    this.shapeManager.getShapes().forEach(shape => {
      if(!shape.active) return;
      if(shape.collidesWith(this)){
        if (shape instanceof Rectangle) {
          this.resolveCollisionWithRectangle(shape);
        } else if (shape instanceof Circle) {
          this.resolveCollisionWithCircle(shape);
        } else if (shape instanceof Line) {
          this.resolveCollisionWithLine(shape);
        }
      }
    });
  }

  resolveCollisionWithRectangle(rect){
    const velocity = subtractObjects(this.position, this.lastPosition);
    if (this.position.x < rect.x - rect.stroke.width) {
        this.position.x = rect.x - this.size - rect.stroke.width;
        this.lastPosition.x = this.position.x + velocity.x * this.restitution;
    }else if (this.position.x > rect.x + rect.width + rect.stroke.width) {
        this.position.x = rect.x + rect.width + this.size + rect.stroke.width;
        this.lastPosition.x = this.position.x + velocity.x * this.restitution;
    }else if (this.position.y > rect.y + rect.height + rect.stroke.width) {
        this.position.y = rect.y + rect.height + this.size + rect.stroke.width;
        this.lastPosition.y = this.position.y + velocity.y * this.restitution;
    }else if (this.position.y < rect.y - rect.stroke.width) {
        this.position.y = rect.y - this.size - rect.stroke.width;
        this.lastPosition.y = this.position.y + velocity.y * this.restitution;
    }
    if (this.position.x > rect.x && this.position.x < rect.x + rect.width &&
        this.position.y > rect.y && this.position.y < rect.y + rect.height) {

        if (this.position.x - this.size < rect.x + rect.stroke.width) {
            this.position.x = rect.x + this.size + rect.stroke.width;
            this.lastPosition.x = this.position.x + velocity.x * this.restitution;
        }else if (this.position.x + this.size > rect.x + rect.width - rect.stroke.width) {
            this.position.x = rect.x + rect.width - this.size - rect.stroke.width;
            this.lastPosition.x = this.position.x + velocity.x * this.restitution;
        }
        if (this.position.y + this.size > rect.y + rect.height - rect.stroke.width) {
            this.position.y = rect.y + rect.height - this.size - rect.stroke.width;
            this.lastPosition.y = this.position.y + velocity.y * this.restitution;
        }
        if (this.position.y - this.size < rect.y + rect.stroke.width) {
            this.position.y = rect.y + this.size + rect.stroke.width;
            this.lastPosition.y = this.position.y + velocity.y * this.restitution;
        }
    }
  }

  resolveCollisionWithCircle(circle){
    const { x, y, size } = circle.getRect();
    const dx = x - this.position.x;
    const dy = y - this.position.y;
    const dist2 = dx * dx + dy * dy;
    const minDist = this.size + size;

    if (dist2 < minDist * minDist) {
      const dist = Math.sqrt(dist2);
      const normal = {
          x: dx / dist,
          y: dy / dist
      };

      const massRatio = size / (this.size + size);

      const penetrationDepth = minDist - dist;
      const correction = 0.5 * penetrationDepth;

      this.position.x -= normal.x * correction * massRatio;
      this.position.y -= normal.y * correction * massRatio;
    }
  }

  resolveCollisionWithLine(line){
    const velocity = subtractObjects(this.position, this.lastPosition);
    const { x1, y1, x2, y2 } = line.getRect();
    const { closestX, closestY } = line.getClosestPointOnLine(this.position.x, this.position.y, x1, y1, x2, y2);
    const distance = line.getDistance(this.position.x, this.position.y, closestX, closestY);
    const tolerance = this.size;

    if (distance < tolerance) {
      const normalX = -(y2 - y1);
      const normalY = x2 - x1;
      const normalLength = Math.sqrt(normalX * normalX + normalY * normalY);

      const unitNormalX = normalX / normalLength;
      const unitNormalY = normalY / normalLength;

      const particleToLine = {
        x: this.position.x - closestX,
        y: this.position.y - closestY
      };

      const dotProduct = particleToLine.x * unitNormalX + particleToLine.y * unitNormalY;

      const correctionFactor = dotProduct < 0 ? -1 : 1;

      this.position.x = closestX + correctionFactor * unitNormalX * tolerance;
      this.position.y = closestY + correctionFactor * unitNormalY * tolerance;

      const velocityDotNormal = velocity.x * unitNormalX + velocity.y * unitNormalY;
      const reflectedVelocityX = velocity.x - 2 * velocityDotNormal * unitNormalX;
      const reflectedVelocityY = velocity.y - 2 * velocityDotNormal * unitNormalY;

      this.lastPosition.x = this.position.x - reflectedVelocityX * this.restitution;
      this.lastPosition.y = this.position.y - reflectedVelocityY * this.restitution;
    }
  }


  draw(ctx){
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  #getRandomColor() {
    let r, g, b;

    do {
      r = Math.floor(Math.random() * 256);
      g = Math.floor(Math.random() * 256);
      b = Math.floor(Math.random() * 256);
    } while (r === 0 && g === 0 && b === 0);

    return `rgba(${r},${g},${b},1)`;
  }
}
