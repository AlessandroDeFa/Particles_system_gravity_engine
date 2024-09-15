class Engine{
  constructor(canvas,ctx){
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = ctx;
    this.particles = [];
    this.particlesSpawned = 0;
    this.isSpawning = false;
    this.gravity = { x: 0, y: 1000};
    this.frameDt = 0;
    this.subStep = 1;
    this.elapsedTime = 0;
    this.lastTime = 0;
    this.spawnDelay = 0.025;
    this.spawnSpeed = 1200.0;
    this.maxAngle = 80;
    this.spawnAngle = 30;
    this.randomAngle = false;
    this.gridSize = 20;
    this.grid = [];
    this.gridWidth = Math.ceil(this.width / this.gridSize);
    this.gridHeight = Math.ceil(this.height / this.gridSize);
    this.particlesSet = new Set();
    this.#buildGrid();
    this.shapesManager = new ShapesManeger(this);
    this.eventHandler = new EventHandler(this, this.shapesManager);
  }

  render(){
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.elapsedTime += deltaTime;
    for (let i = this.subStep; i > 0; i--){
      this.#clearCanvas();
      this.clearGrid();
      this.drawShapes();
      this.spawnParticles();
      this.updateGrid();
      this.applyGravity();
      this.checkCollisions();
      this.updateParticles();
      this.#drawParticles();

    }
    this.lastTime = currentTime;
  }

  setParticlesNum(num){
    if(isNaN(num)){
      return;
    }
    this.particlesSpawned += parseInt(num);
  }

  setAngle(angle){
    if(isNaN(angle)){
      return;
    }
    this.spawnAngle = angle;
  }

  setRandomAngle(val){
    this.randomAngle = val;
  }

  spawnParticles(){
    if(this.particles.length < this.particlesSpawned && this.elapsedTime >= this.spawnDelay){
      this.isSpawning = true;
      let angle = !this.randomAngle ? this.spawnAngle : (Math.random() * this.maxAngle);
      angle = angle * (Math.PI / 180);
      const velocity = {
        x: Math.cos(angle) * this.spawnSpeed,
        y: Math.sin(angle) * this.spawnSpeed
      };
      const particle = new Particle(this, this.shapesManager);
      particle.setVelocity(velocity, this.getStepDt());
      this.particles.push(particle);
      this.elapsedTime = 0;
    }

    if (this.particles.length >= this.particlesSpawned) {
        this.isSpawning = false;
    }

    this.eventHandler.toggleSpawnButton(this.isSpawning);

    this.#updateGUINumParticles();
  }

  clearAllEntities(){
    this.particles = [];
    this.particlesSpawned = 0
    this.shapesManager.setShapes([]);
    this.eventHandler.templateRenderer.clearHTML();
  }

  checkParticleCollision(particleA, particleB) {
    const dx = particleB.position.x - particleA.position.x;
    const dy = particleB.position.y - particleA.position.y;
    const dist2 = dx * dx + dy * dy;
    const minDist = particleA.size + particleB.size;

    if (dist2 < minDist * minDist) {
      const dist = Math.sqrt(dist2);
      const normal = {
          x: dx / dist,
          y: dy / dist
      };

      const massRatioA = particleA.size / (particleA.size + particleB.size);
      const massRatioB = particleB.size / (particleA.size + particleB.size);


      const penetrationDepth = minDist - dist;
      const correction = 0.5 * penetrationDepth;

      particleA.position.x -= normal.x * correction * massRatioB;
      particleA.position.y -= normal.y * correction * massRatioB;

      particleB.position.x += normal.x * correction * massRatioA;
      particleB.position.y += normal.y * correction * massRatioA;

      particleA.isColliding = true;
      particleB.isColliding = true;
    }else{
      particleA.isColliding = false;
      particleB.isColliding = false;
    }
  }

  checkCollisions() {
    this.particlesSet.clear();
    for (let col = 0; col < this.gridWidth; col++) {
      for (let row = 0; row < this.gridHeight; row++) {
        const cell = this.grid[col][row];
        if (cell.length > 1) {
          for (let i = 0; i < cell.length; i++) {
            for (let j = i + 1; j < cell.length; j++) {
              const particleA = cell[i];
              const particleB = cell[j];
              const setKey = this.getGridKey(particleA, particleB);
              if (!this.particlesSet.has(setKey)){
                this.checkParticleCollision(particleA, particleB);
                this.particlesSet.add(setKey);
              }
            }
          }
        }
      }
    }
  }

  getOverlappingCells(entity) {
    const minCol = Math.floor((entity.position.x - entity.size) / this.gridSize);
    // const minCol = Math.floor(entity.position.x / this.gridSize);
    const maxCol = Math.floor((entity.position.x + entity.size) / this.gridSize);
    const minRow = Math.floor((entity.position.y - entity.size) / this.gridSize);
    // const minRow = Math.floor(entity.position.y / this.gridSize);
    const maxRow = Math.floor((entity.position.y + entity.size) / this.gridSize);

    return { minCol, maxCol, minRow, maxRow };
  }

  insertParticleIntoGrid(particle) {
    const { minCol, maxCol, minRow, maxRow } = this.getOverlappingCells(particle);

    for (let col = Math.max(0, minCol); col <= Math.min(maxCol, this.grid.length - 1); col++) {
      for (let row = Math.max(0,minRow); row <= Math.min(maxRow, this.grid[col].length - 1); row++) {
        this.grid[col][row].push(particle);
      }
    }
  }

  drawShapes(){
    this.shapesManager.getShapes().forEach(shape => shape.draw(this.ctx));
  }

  getStepDt(){
    return this.frameDt / this.subStep;
  }

  getGridKey(pA, pB){
    return `${Math.min(pA.id, pB.id)}-${Math.max(pA.id, pB.id)}`;
  }

  getCtx(){
    return this.ctx;
  }

  setSubStepsCount(sub_steps){
    this.subStep = sub_steps;
  }

  setSimulationUpdateRate(rate){
    this.frameDt = 1.0 / rate;
  }

  applyGravity(){
    this.particles.forEach(particle => particle.accelerate(this.gravity));
  }

  updateParticles(){
    this.particles.forEach(particle => particle.update(this.getStepDt()));
  }

  updateGrid(){
    this.particles.forEach(particle => this.insertParticleIntoGrid(particle));
  }

  clearGrid() {
   this.#buildGrid();
  }

  setCanvasBounds(){
    this.canvas.width = $(window).width();
    this.canvas.height = $(window).height();
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.#setGridBounds();
  }

  run() {
    this.render();
    requestAnimationFrame(() => this.run());
  }

  #drawParticles() {
    this.particles.forEach(particle => particle.draw(this.ctx));
  }

  #buildGrid(){
    this.grid = Array.from({ length: this.gridWidth }, () =>
      Array.from({ length: this.gridHeight }, () => [])
    );
  }

  #setGridBounds(){
    this.gridWidth = Math.ceil(this.width / this.gridSize);
    this.gridHeight = Math.ceil(this.height / this.gridSize);
  }

  #updateGUINumParticles(){
    $('.num_particles span').html(this.particles.length);
  }

  #drawGrid(){
    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 1;

    for (let col = 0; col < this.gridWidth; col++) {
      for (let row = 0; row < this.gridHeight; row++) {
        const x = col * this.gridSize;
        const y = row * this.gridSize;
        this.ctx.strokeRect(x, y, this.gridSize, this.gridSize);
      }
    }
  }

  #clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

}
