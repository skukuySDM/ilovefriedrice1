import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

class FontLoader {
  constructor(manager) {
    this.manager = manager;
  }

  load(url, onLoad, onProgress, onError) {
    const loader = new THREE.FileLoader(this.manager);
    loader.load(url, (text) => {
      try {
        const json = JSON.parse(text);
        const font = this.parse(json);
        if (onLoad) onLoad(font);
      } catch (error) {
        if (onError) onError(error);
        console.error('Error parsing JSON:', error);
      }
    }, onProgress, onError);
  }

  parse(json) {
    return new Font(json);
  }
}

class Font {
  constructor(data) {
    this.isFont = true;
    this.type = 'Font';
    this.data = data;
  }

  generateShapes(text, size = 100) {
    const shapes = [];
    const paths = createPaths(text, size, this.data);
    for (const path of paths) {
      shapes.push(...path.toShapes());
    }
    return shapes;
  }
}

// Helper function to create paths from the font data
function createPaths(text, size, data) {
  const chars = Array.from(text);
  const scale = size / data.resolution;
  const lineHeight = (data.boundingBox.yMax - data.boundingBox.yMin + data.underlineThickness) * scale;
  const paths = [];
  let offsetX = 0, offsetY = 0;

  for (const char of chars) {
    if (char === '\n') {
      offsetX = 0;
      offsetY -= lineHeight;
    } else {
      const result = createPath(char, scale, offsetX, offsetY, data);
      offsetX += result.offsetX;
      paths.push(result.path);
    }
  }
  return paths;
}

function createPath(char, scale, offsetX, offsetY, data) {
  const glyph = data.glyphs[char] || data.glyphs['?'];
  if (!glyph) {
    console.error(`Character "${char}" not found in font.`);
    return { offsetX: 0, path: new THREE.ShapePath() };
  }

  const path = new THREE.ShapePath();
  const outline = glyph.o.split(' ');

  for (let i = 0; i < outline.length; ) {
    const action = outline[i++];
    switch (action) {
      case 'm': // moveTo
        path.moveTo(outline[i++] * scale + offsetX, outline[i++] * scale + offsetY);
        break;
      case 'l': // lineTo
        path.lineTo(outline[i++] * scale + offsetX, outline[i++] * scale + offsetY);
        break;
      case 'q': // quadraticCurveTo
        path.quadraticCurveTo(
          outline[i++] * scale + offsetX,
          outline[i++] * scale + offsetY,
          outline[i++] * scale + offsetX,
          outline[i++] * scale + offsetY
        );
        break;
      case 'b': // bezierCurveTo
        path.bezierCurveTo(
          outline[i++] * scale + offsetX,
          outline[i++] * scale + offsetY,
          outline[i++] * scale + offsetX,
          outline[i++] * scale + offsetY,
          outline[i++] * scale + offsetX,
          outline[i++] * scale + offsetY
        );
        break;
    }
  }
  return { offsetX: glyph.ha * scale, path };
}

export { FontLoader, Font };



