const FRAME_RATE = 60;
const SUB_STEPS = 8;
const G_OPTIONS = {
  coords: {
    x: 800,
    y: 400,
  },
  shapes: {
    rectangle: {
      width: 100,
      height: 300
    },
    square: {
      width: 200,
      height: 200
    },
    circle: {
      size: 50
    },
    line: {
      endX: 50,
      endY: 90
    }
  },
  fill: {
    r: 0,
    g: 50,
    b: 0,
    a:1
  },
  stroke: {
    r: 255,
    g: 255,
    b: 255,
    a: 1,
    width: 2
  }
}

function main(){
  const canvas = $("#canvas").get(0);
  const ctx = canvas.getContext('2d');
  canvas.width = $(window).width();
  canvas.height = $(window).height();
  const engine = new Engine(canvas, ctx);
  engine.setSimulationUpdateRate(FRAME_RATE);
  engine.setSubStepsCount(SUB_STEPS);
  engine.run();
}

$(document).ready(main);
