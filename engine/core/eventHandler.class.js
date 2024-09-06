class EventHandler{
  constructor(engine, shapesManager){
    this.engine = engine;
    this.shapesManager = shapesManager;
    this.menu = $(".menu");
    this.optionsContainer = $('.menu-opts');
    this.toggle = $("#toggle-menu");
    this.sliderParticleSpawned = $("input#particles-spawned");
    this.sliderAngle = $("input#particles-angle");
    this.checkboxRandomAngle = $("input#random-angle");
    this.spawnParticlesBtn = $("#btn-spawn");
    this.clearButton = $("#btn-clear");
    this.toggleShapesSelector = $('#toggle-shapes-selector');
    this.shapesSelector = $('#shapes-selector');
    this.confirmButton = $('#confirm');
    this.discardButton = $('#discard');
    this.isDragging = false;
    this.grabbedShape = null;
    this.templateRenderer = new TemplateRenderer();
    this.initListeners();
  }

  initListeners() {
    $(window).on('mousemove', this.handleMouseMove.bind(this));
    $(window).on('mousedown', this.handleMouseDown.bind(this));
    $(window).on('mouseup', this.handleMouseUp.bind(this));
    $(window).on('resize', ()=>{
      this.engine.setCanvasBounds();
    })

    this.initUIListeners();
    this.activateTemplateListeners();
  }

  initUIListeners() {
    this.toggle.on("click", () => {
      this.toggleElementState(this.menu, "data-state", (newState)=>{
        let svg = this.toggle.find(`svg[data-icon='${newState}']`);
        this.toggle.find('svg').removeClass('active');
        svg.addClass('active');
      });
    });

    this.sliderParticleSpawned.on('input', (event) => {this.handleSliderUpdate(event)});

    this.sliderAngle.on('input', (event)=> {
      this.handleSliderUpdate(event, (val)=>{
        this.engine.setAngle(val);
      })
    })

    this.checkboxRandomAngle.on('input', (event) => {
      this.handleCheckboxUpdate(event, (val) => this.engine.setRandomAngle(val));
    });

    this.toggleShapesSelector.on('click', () => {
      this.toggleElementState(this.shapesSelector, "data-state");
    });

    this.bindShapeButton('#rect', 'rectangle', G_OPTIONS.shapes.rectangle.width, G_OPTIONS.shapes.rectangle.height);
    this.bindShapeButton('#square', 'square', G_OPTIONS.shapes.square.width, G_OPTIONS.shapes.square.height);
    this.bindShapeButton('#circle', 'circle', G_OPTIONS.shapes.circle.size);
    this.bindShapeButton('#line', 'line', G_OPTIONS.shapes.line.endX, G_OPTIONS.shapes.line.endY);

    this.confirmButton.on('click', () => {
      this.handleShapeUpdate(() => this.shapesManager.confirmShapes());
    });
    this.discardButton.on('click', () => {
      this.handleShapeUpdate(() => this.shapesManager.discardShapes());
    });

    this.spawnParticlesBtn.on("click", ()=> {
      this.engine.setParticlesNum($("#particles-spawned").val());
    });

    this.clearButton.on('click', ()=>{
      this.engine.clearAllEntities();
    })
  }

  activateTemplateListeners(){
    this.optionsContainer.on('click', ".collapse", (event)=> {
      const shapeC = $(event.target).closest(".shape");
      const idShape = shapeC.attr('id');
      const icon = shapeC.find('.collapse svg');

      this.toggleElementState(shapeC, "data-state", (newState)=>{
        const shouldShowContent = newState === 'open';
        shapeC.find(".content").toggle(shouldShowContent);
        icon.css("transform", shouldShowContent ? "rotate(0deg)" : "rotate(-90deg)");
        const shape = this.shapesManager.getShapeById(idShape);
        if (shape){
          shape.setCollapsed(!shouldShowContent);
        }
      });
    })
    this.optionsContainer.on('input', '.circle-size', (event)=> {
      this.handleSliderUpdate(event, (val)=>{
        val = this.validateValue(val);
        if (val === false) return;
        const idShape = $('.circle-size').closest(".shape").attr("id");
        const shape = this.shapesManager.getShapeById(idShape);
        if (shape){
          shape.setBounds(val);
        }
      })
    })
    this.optionsContainer.on('click', '.remove-shape', (event)=> {
      const idShape = $(event.target).closest(".shape").attr("id");
      this.shapesManager.removeShape(idShape);
      this.templateRenderer.refreshTemplates(this.shapesManager.getShapes());
    })
    this.optionsContainer.on('input', 'input[data-val="coordX"], input[data-val="coordY"]', (event) => {
      this.handleShapeBounds(event, (shape, coord)=>{
        shape.moveTo(coord.x, coord.y);
        shape.setLastPosition();
      })
    });
    this.optionsContainer.on('input', 'input[data-val="width"], input[data-val="height"]', (event)=> {
      this.handleShapeBounds(event, (shape, bounds) => {
         shape.setBounds(bounds.width, bounds.height);
      });
    })
    this.optionsContainer.on('input', 'input[type="color"]', (event) => {
      this.handleInputColor(event);
    })
    this.optionsContainer.on('input', 'input.color-channels', (event)=> {
      this.handleChannelsColor(event, (value, updateColor)=>{
        const inputColor = $(event.target).closest('.input-color').find("input[type='color']");
        inputColor.val(Utils.rgbToHex(updateColor.r, updateColor.g, updateColor.b));
      });
    })
    this.optionsContainer.on('input', 'input[data-val="stroke-width"]', (event)=>{
      this.handleStrokeUpdate(event);
    })
    this.optionsContainer.on('input', 'input.color-alpha', (event)=> {
      this.handleChannelsColor(event, (value, updateColor)=>{
        const input = $(event.target);
        input.closest(".input-color").find('input[type="color"]').css('opacity', value);
      })
    })
    this.optionsContainer.on("input", 'input[data-val="coordX1"], input[data-val="coordY1"], input[data-val="coordX2"], input[data-val="coordY2"]', (event)=>{
      this.handleShapeBounds(event, (shape, coord)=>{
        shape.moveTo(coord.x, coord.y ,coord.x2, coord.y2);
        shape.setLastPosition();
      })
    })
  }

  bindShapeButton(selector, shapeType, ...shapeArgs) {
    $(selector).on('click', () => {
      this.shapesManager.addShape(shapeType, ...shapeArgs);
      this.confirmButton.show();
      this.discardButton.show();
    });
  }

  handleShapeUpdate(action) {
    action();
    this.templateRenderer.refreshTemplates(this.shapesManager.getShapes());
    this.confirmButton.hide();
    this.discardButton.hide();
  }

  handleShapeBounds(event, cb){
    const input = $(event.currentTarget);
    let value = parseFloat(input.val());
    const dataVal = input.attr('data-val');
    const idShape = input.closest(".shape").attr("id");
    const shape = this.shapesManager.getShapeById(idShape);
    const limit = this.getLimit(dataVal, shape)
    value = this.validateValue(value, limit);
    if (!shape || value===false) return;
    input.val(value);
    const uValues = this.getUpdatedValues(dataVal, value, shape);
    cb(shape, uValues);
  }

  handleInputColor(event){
    let color = $(event.target).val();
    const dataType = $(event.target).attr('data-type');
    const { r, g, b } = Utils.hexToRgb(color);
    this.updateColorInputs($(event.target).closest('.input-color'), r, g, b);
    const idShape = $(event.target).closest(".shape").attr("id");
    const shape = this.shapesManager.getShapeById(idShape);
    if (!shape) return;
    if (dataType === "fill") {
      shape.setFill(r, g, b);
    }else{
      shape.setStroke(r, g, b);
    }
  }

  handleChannelsColor(event, cb = () => {}){
    const input = $(event.target);
    let value = parseFloat(input.val());
    const dataVal = input.attr('data-val');
    const dataType = input.attr('data-type');
    value = this.validateValue(value, dataType === 'a' ? 1 : 255);
    const idShape = input.closest(".shape").attr("id");
    const shape = this.shapesManager.getShapeById(idShape);
    if (!shape || value === false) return;
    const updateColor = dataType === 'fill' ? shape.getFill() : shape.getStroke();
    updateColor[dataVal] = value;
    if (dataType === 'fill') {
      shape.setFill(updateColor.r, updateColor.g, updateColor.b, updateColor.a);
    } else {
      shape.setStroke(updateColor.r, updateColor.g, updateColor.b, updateColor.a);
    }
    cb(value, updateColor);
  }

  updateColorInputs(container, r, g, b) {
      container.find("input[data-val='r']").val(r);
      container.find("input[data-val='g']").val(g);
      container.find("input[data-val='b']").val(b);
  }

  handleStrokeUpdate(event){
    const input = $(event.target);
    let value = parseFloat(input.val());
    const idShape = input.closest(".shape").attr("id");
    const shape = this.shapesManager.getShapeById(idShape);
    value = this.validateValue(value);
    if (!shape || value === false) return;
    input.val(value);
    shape.setStrokeWidth(value);
  }

  getLimit(dataVal, shape) {
    const offset = shape.getRect();
    const limits = {
        coordX: this.engine.width - (offset.size || offset.width),
        coordY: this.engine.height - (offset.size || offset.height),
        coordX1: this.engine.width,
        coordX2: this.engine.width,
        coordY1: this.engine.height,
        coordY2: this.engine.height,
        width: this.engine.width - (offset.size || offset.width),
        height: this.engine.height - (offset.size || offset.height)
    };
    return limits[dataVal];
  }

  getUpdatedValues(dataVal, value, shape) {
    switch(dataVal){
      case 'coordX':
        return { x: value, y: shape.y }
      case 'coordY':
        return {x:shape.x, y: value}
      case 'coordX1':
        return { x: value, y: shape.y, x2: shape.x2, y2: shape.y2 };
      case 'coordY1':
          return { x: shape.x, y: value, x2: shape.x2, y2: shape.y2 };
      case 'coordX2':
        return { x: shape.x, y: shape.y, x2: value, y2: shape.y2 };
      case 'coordY2':
         return { x: shape.x, y: shape.y, x2: shape.x2, y2: value };
      case 'width':
        return { width: value, height: shape.height };
      case 'height':
          return { width: shape.width, height: value };
    }
  }

  handleSliderUpdate(event, action=()=>{}){
    const slider = $(event.currentTarget);
    let value = parseFloat(slider.val());
    const label = $(`label[for='${slider.attr('id')}']`);
    value = this.validateValue(value);
    if (value!==false){
      label.html(value);
      action(value);
    }
  }

  handleCheckboxUpdate(event, action = () => {}){
    const checkbox = $(event.currentTarget);
    let val = checkbox.is(":checked") ? true : false;
    action(val);
    const data = checkbox.data('slider');
    if (data){
      $(`input#${data}`).prop('disabled', val);
    }
  }

  toggleElementState(element, attribute, cb) {
    const currentState = element.attr(attribute);
    const newState = currentState === "closed" ? "open" : "closed";
    element.attr(attribute, newState);

    if (cb) {
      cb(newState, element);
    }
  }

  updateInputs({id, x, y, x2=null, y2=null}){
    const shape = $(`.shape[id=${id}]`);

    if (x2 !== null && y2 !== null) {
      const coords = {
        'coordX1': x,
        'coordY1': y,
        'coordX2': x2,
        'coordY2': y2
      };

      for (const [key, value] of Object.entries(coords)) {
        shape.find(`input[data-val='${key}']`).val(value);
      }
    } else {
      shape.find("input[data-val='coordX']").val(x);
      shape.find("input[data-val='coordY']").val(y);
    }
  }

  handleMouseMove({ pageX, pageY }) {
    if (this.isDragging && this.grabbedShape) {
      this.grabbedShape.moveTo(pageX, pageY);
      this.updateInputs(this.grabbedShape);
    } else if (this.isExcludedElementClicked()){
      this.updateCursor();
    }else{
      this.grabbedShape = this.shapesManager.getShapeGrabbed(pageX, pageY);
      this.updateCursor(this.grabbedShape);
    }
  }

  handleMouseDown({ pageX, pageY }) {
    if (this.isExcludedElementClicked()) return;
    if (this.grabbedShape) {
      this.grabbedShape.calcOffset(pageX, pageY);
      this.isDragging = true;
      this.grabbedShape.setActive(false);
      this.confirmButton.show();
      this.discardButton.show();
      this.updateCursor(this.grabbedShape, 'grabbing');
    }
  }

  handleMouseUp() {
    if (this.isDragging) {
      this.isDragging = false;
      this.updateCursor();
      this.grabbedShape.resetOffset();
    }
  }

  updateCursor(shape, cursorType = 'default') {
    if (shape) {
      $('body').css('cursor', cursorType === 'grabbing' ? 'grabbing' : 'grab');
    } else {
      $('body').css('cursor', cursorType);
    }
  }

  validateValue(val,limit=val){
    if (isNaN(val)) return false;
    return Math.max(0, Math.min(val, limit));
  }

  isExcludedElementClicked(){
    return $(event.target).closest(this.menu).length ||
      $(event.target).closest(this.shapesSelector).length ||
      $(event.target).is('button');
  }
}
