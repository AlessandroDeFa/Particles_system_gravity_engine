function subtractObjects(obj1, obj2) {
  const result = {};

  for (let key in obj1) {
    if (obj2.hasOwnProperty(key) && typeof obj1[key] === 'number' && typeof obj2[key] === 'number') {
      result[key] = obj1[key] - obj2[key];
    }
  }

  return result;
}

function addObjects(obj1, obj2) {
  const result = {};

  for (let key in obj1) {
    if (obj2.hasOwnProperty(key) && typeof obj1[key] === 'number' && typeof obj2[key] === 'number') {
      result[key] = obj1[key] + obj2[key];
    }
  }

  return result;
}
