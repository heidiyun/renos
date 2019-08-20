import sha1 from 'sha1';

function HSVtoRGB(h, s, v) {
  let r;
  let g;
  let b;
  let i;
  let f;
  let p;
  let q;
  let t;

  if (arguments.length === 1) {
    s = h.s, v = h.v, h = h.h;
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}


export default {
  getReadableFileSizeString(bytes) {
    let i = 0;
    const byteUnits = [
      '바이트',
      'KB',
      'MB',
      'GB',
      'TB',
      'PB',
      'EB',
      'ZB',
      'YB'
    ];
    if (bytes > 1024) {
      do {
        bytes = bytes / 1024;
        i++;
      } while (bytes > 1024);
    }
    return Math.max(bytes, 0).toFixed(0) + byteUnits[i];
  },
  getNameToColor(name) {
    const sha = sha1(name);
    const r = parseInt(sha[0] + sha[1], 16);
    const c = HSVtoRGB(r / 256, 0.5, 0.6);
    return `rgb(${c.r},${c.g},${c.b})`;
  }
};

