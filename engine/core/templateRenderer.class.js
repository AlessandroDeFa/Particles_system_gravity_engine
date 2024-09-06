class TemplateRenderer{
  constructor(){
    this.shapesContainer = $('.menu-opts');
  }

  injectHTML(template){
    this.shapesContainer.append(template);
  }

  clearHTML(){
    this.shapesContainer.find('div.shape').remove();
  }

  refreshTemplates(shapes) {
    this.clearHTML();
    shapes.filter(shape => shape.active)
      .forEach(shape => {
        const template = this.getTemplateForShape(shape);
        this.injectHTML(template);
      });
  }

  getTemplateForShape(shape) {
     if (shape instanceof Rectangle) {
       return this.getRectTemplate(shape);
     } else if (shape instanceof Circle) {
       return this.getCircleTemplate(shape);
     } else if (shape instanceof Line) {
       return this.getLineTemplate(shape);
     }
     return '';
   }

   getRectTemplate(rect){
     const { x, y, width, height } = rect.getRect();
     return `<div class="shape" id=${rect.id} data-state='${rect.isCollapsed ? 'closed' : 'open'}'>
         <div class="title">
             <div class="collapse">
                <svg style="${rect.isCollapsed ? 'transform: rotate(-90deg);' : ''}" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 64 64" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="M54.921 20.297a1 1 0 0 0-.92-.611H10a1 1 0 0 0-.718 1.698l22 22.627a1 1 0 0 0 1.434 0l22-22.628a1 1 0 0 0 .204-1.086z" fill="#ffffff" opacity="1" data-original="#000000" class=""></path></g></svg>
                <span>Rectangle</span>
             </div>
             <div class="remove-shape">
                 <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="122.879px" height="122.88px" viewBox="0 0 122.879 122.88" enable-background="new 0 0 122.879 122.88" xml:space="preserve"><g><path d="M8.773,0h105.332c2.417,0,4.611,0.986,6.199,2.574c1.589,1.588,2.574,3.783,2.574,6.199v105.333 c0,2.416-0.985,4.61-2.574,6.199c-1.588,1.588-3.782,2.574-6.199,2.574H8.773c-2.416,0-4.611-0.986-6.199-2.574 C0.986,118.717,0,116.522,0,114.106V8.773c0-2.417,0.986-4.611,2.574-6.199S6.357,0,8.773,0L8.773,0z M92.027,57.876 c1.969,0,3.563,1.596,3.563,3.563s-1.595,3.563-3.563,3.563c-20.392,0-40.784,0-61.176,0c-1.968,0-3.563-1.595-3.563-3.563 c0-1.968,1.596-3.563,3.563-3.563C51.244,57.876,71.636,57.876,92.027,57.876L92.027,57.876z M114.105,7.129H8.773 c-0.449,0-0.859,0.186-1.159,0.485c-0.3,0.3-0.486,0.71-0.486,1.159v105.333c0,0.448,0.186,0.859,0.486,1.159 c0.3,0.299,0.71,0.485,1.159,0.485h105.332c0.449,0,0.86-0.187,1.159-0.485c0.3-0.3,0.486-0.711,0.486-1.159V8.773 c0-0.449-0.187-0.859-0.486-1.159C114.966,7.315,114.555,7.129,114.105,7.129L114.105,7.129z"></path></g></svg>
             </div>
         </div>
         <div class="content" style="${rect.isCollapsed ? 'display:none;' : ''}">
             <div class="content-opts">
                  <div class="input-50">
                      <div class="input-container">
                          <span>X</span>
                          <input data-val="coordX" type="text" value="${x}">
                      </div>
                      <div class="input-container">
                          <span>Y</span>
                          <input data-val="coordY" type="text" value="${y}">
                      </div>
                  </div>
                  <div class="input-50">
                      <div class="input-container">
                          <span>W</span>
                          <input type="text" data-val="width" value="${width}">
                      </div>
                      <div class="input-container">
                          <span>H</span>
                          <input type="text" data-val="height" value="${height}">
                      </div>
                  </div>
                  <div class="color-selector">
                      <div>Fill</div>
                      <div class="input-color">
                          <div class="input-container">
                              <span>R</span>
                              <input class="color-channels" type="text" data-type="fill" data-val="r" value="${rect.fill.r}">
                          </div>
                          <div class="input-container">
                              <span>G</span>
                              <input class="color-channels" type="text" data-type="fill" data-val="g" value="${rect.fill.g}">
                          </div>
                          <div class="input-container">
                              <span>B</span>
                              <input class="color-channels" type="text" data-type="fill" data-val="b" value="${rect.fill.b}">
                          </div>
                          <div class="input-container">
                              <span>A</span>
                              <input type="text" data-type="fill" class="color-alpha" data-val="a" value="1">
                          </div>
                          <div class="input-color-selector">
                              <div class="bg-transparent"></div>
                              <input type="color" data-type="fill" value="${Utils.rgbToHex(rect.fill.r, rect.fill.g, rect.fill.b)}">
                          </div>
                      </div>
                  </div>
                  <div class="color-selector">
                      <div>Stroke</div>
                      <div class="input-color">
                          <div class="input-container">
                              <span>R</span>
                              <input class="color-channels"  type="text" data-type="stroke" data-val="r" value="${rect.stroke.r}">
                          </div>
                          <div class="input-container">
                              <span>G</span>
                              <input class="color-channels"  type="text" data-type="stroke" data-val="g" value="${rect.stroke.g}">
                          </div>
                          <div class="input-container">
                              <span>B</span>
                              <input class="color-channels"  type="text" data-type="stroke" data-val="b" value="${rect.stroke.b}">
                          </div>
                          <div class="input-container">
                              <span>A</span>
                              <input type="text" data-type="stroke" class="color-alpha" data-val="a" value="1">
                          </div>
                          <div class="input-color-selector">
                              <div class="bg-transparent"></div>
                              <input type="color" data-type="stroke" value="${Utils.rgbToHex(rect.stroke.r, rect.stroke.g, rect.stroke.b)}">
                          </div>
                      </div>
                      <div class="input-container">
                          <span>W</span>
                          <input type="text" data-val="stroke-width" value="${rect.stroke.width}" >
                      </div>
                  </div>
             </div>
         </div>
     </div>`;
   }
   getCircleTemplate(circle){
     const { x, y, size } = circle.getRect();
     return `<div class="shape" id=${circle.id} data-state='${circle.isCollapsed ? 'closed' : 'open'}'>
         <div class="title">
             <div class="collapse">
                <svg style="${circle.isCollapsed ? 'transform: rotate(-90deg);' : ''}" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 64 64" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="M54.921 20.297a1 1 0 0 0-.92-.611H10a1 1 0 0 0-.718 1.698l22 22.627a1 1 0 0 0 1.434 0l22-22.628a1 1 0 0 0 .204-1.086z" fill="#ffffff" opacity="1" data-original="#000000" class=""></path></g></svg>
                <span>Circle</span>
             </div>
             <div class="remove-shape">
                 <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="122.879px" height="122.88px" viewBox="0 0 122.879 122.88" enable-background="new 0 0 122.879 122.88" xml:space="preserve"><g><path d="M8.773,0h105.332c2.417,0,4.611,0.986,6.199,2.574c1.589,1.588,2.574,3.783,2.574,6.199v105.333 c0,2.416-0.985,4.61-2.574,6.199c-1.588,1.588-3.782,2.574-6.199,2.574H8.773c-2.416,0-4.611-0.986-6.199-2.574 C0.986,118.717,0,116.522,0,114.106V8.773c0-2.417,0.986-4.611,2.574-6.199S6.357,0,8.773,0L8.773,0z M92.027,57.876 c1.969,0,3.563,1.596,3.563,3.563s-1.595,3.563-3.563,3.563c-20.392,0-40.784,0-61.176,0c-1.968,0-3.563-1.595-3.563-3.563 c0-1.968,1.596-3.563,3.563-3.563C51.244,57.876,71.636,57.876,92.027,57.876L92.027,57.876z M114.105,7.129H8.773 c-0.449,0-0.859,0.186-1.159,0.485c-0.3,0.3-0.486,0.71-0.486,1.159v105.333c0,0.448,0.186,0.859,0.486,1.159 c0.3,0.299,0.71,0.485,1.159,0.485h105.332c0.449,0,0.86-0.187,1.159-0.485c0.3-0.3,0.486-0.711,0.486-1.159V8.773 c0-0.449-0.187-0.859-0.486-1.159C114.966,7.315,114.555,7.129,114.105,7.129L114.105,7.129z"></path></g></svg>
             </div>
         </div>
         <div class="content" style="${circle.isCollapsed ? 'display:none;' : ''}">
             <div class="content-opts">
                 <div class="input-50">
                    <div class="input-container">
                        <span>X</span>
                        <input data-val="coordX" type="text" value="${x}">
                    </div>
                    <div class="input-container">
                        <span>Y</span>
                        <input data-val="coordY" type="text" value="${y}">
                    </div>
                 </div>
                 <div class="slider-content-option">
                     <div class="opt-label">Size:</div>
                     <div class="slider-container">
                         <label for="cirlce-size-${circle.id}">${size}</label>
                         <input min="1" max="100" value="${size}" class="circle-size" id="cirlce-size-${circle.id}" type="range">
                     </div>
                 </div>
                  <div class="color-selector">
                      <div>Fill</div>
                      <div class="input-color">
                          <div class="input-container">
                              <span>R</span>
                              <input class="color-channels" type="text" data-type="fill" data-val="r" value="${circle.fill.r}">
                          </div>
                          <div class="input-container">
                              <span>G</span>
                              <input class="color-channels" type="text" data-type="fill" data-val="g" value="${circle.fill.g}">
                          </div>
                          <div class="input-container">
                              <span>B</span>
                              <input class="color-channels" type="text" data-type="fill" data-val="b" value="${circle.fill.b}">
                          </div>
                          <div class="input-container">
                              <span>A</span>
                              <input type="text" data-type="fill" class="color-alpha" data-val="a" value="1">
                          </div>
                          <div class="input-color-selector">
                              <div class="bg-transparent"></div>
                              <input type="color" data-type="fill" value="${Utils.rgbToHex(circle.fill.r, circle.fill.g, circle.fill.b)}">
                          </div>
                      </div>
                  </div>
                  <div class="color-selector">
                      <div>Stroke</div>
                      <div class="input-color">
                          <div class="input-container">
                              <span>R</span>
                              <input class="color-channels"  type="text" data-type="stroke" data-val="r" value="${circle.stroke.r}">
                          </div>
                          <div class="input-container">
                              <span>G</span>
                              <input class="color-channels"  type="text" data-type="stroke" data-val="g" value="${circle.stroke.g}">
                          </div>
                          <div class="input-container">
                              <span>B</span>
                              <input class="color-channels"  type="text" data-type="stroke" data-val="b" value="${circle.stroke.b}">
                          </div>
                          <div class="input-container">
                              <span>A</span>
                              <input type="text" data-type="stroke" class="color-alpha" data-val="a" value="1">
                          </div>
                          <div class="input-color-selector">
                              <div class="bg-transparent"></div>
                              <input type="color" data-type="stroke" value="${Utils.rgbToHex(circle.stroke.r, circle.stroke.g, circle.stroke.b)}">
                          </div>
                      </div>
                      <div class="input-container">
                          <span>W</span>
                          <input type="text" data-val="stroke-width" value="${circle.stroke.width}" >
                      </div>
                  </div>
             </div>
         </div>
     </div>`;
   }
   getLineTemplate(line){
     const { x1, y1, x2, y2 } = line.getRect();
     return `<div class="shape" id=${line.id} data-state='${line.isCollapsed ? 'closed' : 'open'}'>
         <div class="title">
              <div class="collapse">
                  <svg style="${line.isCollapsed ? 'transform: rotate(-90deg);' : ''}" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 64 64" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="M54.921 20.297a1 1 0 0 0-.92-.611H10a1 1 0 0 0-.718 1.698l22 22.627a1 1 0 0 0 1.434 0l22-22.628a1 1 0 0 0 .204-1.086z" fill="#ffffff" opacity="1" data-original="#000000" class=""></path></g></svg>
                  <span>Line</span>
              </div>
             <div class="remove-shape">
                 <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="122.879px" height="122.88px" viewBox="0 0 122.879 122.88" enable-background="new 0 0 122.879 122.88" xml:space="preserve"><g><path d="M8.773,0h105.332c2.417,0,4.611,0.986,6.199,2.574c1.589,1.588,2.574,3.783,2.574,6.199v105.333 c0,2.416-0.985,4.61-2.574,6.199c-1.588,1.588-3.782,2.574-6.199,2.574H8.773c-2.416,0-4.611-0.986-6.199-2.574 C0.986,118.717,0,116.522,0,114.106V8.773c0-2.417,0.986-4.611,2.574-6.199S6.357,0,8.773,0L8.773,0z M92.027,57.876 c1.969,0,3.563,1.596,3.563,3.563s-1.595,3.563-3.563,3.563c-20.392,0-40.784,0-61.176,0c-1.968,0-3.563-1.595-3.563-3.563 c0-1.968,1.596-3.563,3.563-3.563C51.244,57.876,71.636,57.876,92.027,57.876L92.027,57.876z M114.105,7.129H8.773 c-0.449,0-0.859,0.186-1.159,0.485c-0.3,0.3-0.486,0.71-0.486,1.159v105.333c0,0.448,0.186,0.859,0.486,1.159 c0.3,0.299,0.71,0.485,1.159,0.485h105.332c0.449,0,0.86-0.187,1.159-0.485c0.3-0.3,0.486-0.711,0.486-1.159V8.773 c0-0.449-0.187-0.859-0.486-1.159C114.966,7.315,114.555,7.129,114.105,7.129L114.105,7.129z"></path></g></svg>
             </div>
         </div>
         <div class="content" style="${line.isCollapsed ? 'display:none;' : ''}">
             <div class="content-opts">
                 <div class="input-50">
                     <div class="input-container">
                         <span>X1</span>
                         <input data-val="coordX1" type="text" value="${x1}">
                     </div>
                     <div class="input-container">
                         <span>Y1</span>
                         <input data-val="coordY1" type="text" value="${y1}">
                     </div>
                 </div>
                 <div class="input-50">
                     <div class="input-container">
                         <span>X2</span>
                         <input data-val="coordX2" type="text" value="${x2}">
                     </div>
                     <div class="input-container">
                         <span>Y2</span>
                         <input data-val="coordY2" type="text" value="${y2}">
                     </div>
                 </div>
                  <div class="color-selector">
                  <div>Stroke</div>
                  <div class="input-color">
                      <div class="input-container">
                          <span>R</span>
                          <input class="color-channels"  type="text" data-type="stroke" data-val="r" value="${line.stroke.r}">
                      </div>
                      <div class="input-container">
                          <span>G</span>
                          <input class="color-channels"  type="text" data-type="stroke" data-val="g" value="${line.stroke.g}">
                      </div>
                      <div class="input-container">
                          <span>B</span>
                          <input class="color-channels"  type="text" data-type="stroke" data-val="b" value="${line.stroke.b}">
                      </div>
                      <div class="input-container">
                          <span>A</span>
                          <input type="text" data-type="stroke" class="color-alpha" data-val="a" value="1">
                      </div>
                      <div class="input-color-selector">
                          <div class="bg-transparent"></div>
                          <input type="color" data-type="stroke" value="${Utils.rgbToHex(line.stroke.r, line.stroke.g, line.stroke.b)}">
                      </div>
                  </div>
                  <div class="input-container">
                      <span>W</span>
                      <input type="text" data-val="stroke-width" value="${line.stroke.width}" >
                  </div>
                  </div>
             </div>
         </div>
     </div>`;
   }
}
