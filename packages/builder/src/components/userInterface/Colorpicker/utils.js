export const isValidHex = str =>
  /^#(?:[A-F0-9]{3}$|[A-F0-9]{4}$|[A-F0-9]{6}$|[A-F0-9]{8})$/gi.test(str);

const getHexaValues = hexString => {
  if (hexString.length <= 5) {
    let hexArr = hexString.match(/[A-F0-9]/gi);
    let t = hexArr.map(c => (c += c));
    return t;
  } else {
    return hexString.match(/[A-F0-9]{2}/gi);
  }
};

export const isValidRgb = str => {
  const hasValidStructure = /^(?:rgba\(|rgb\()(?:[0-9,\s]|\.(?=\d))*\)$/gi.test(str);
  if (hasValidStructure) {
    return testRgbaValues(str.toLowerCase());
  }
};

const findNonNumericChars = /[a-z()\s]/gi;

export const getNumericValues = str =>
  str
    .replace(findNonNumericChars, "")
    .split(",")
    .map(v => v !== "" ? v : undefined);

export const testRgbaValues = str => {
  const rgba = getNumericValues(str);
  const [r, g, b, a] = rgba;
  
  let isValidLengthRange =
    (str.startsWith("rgb(") && rgba.length === 3) ||
    (str.startsWith("rgba(") && rgba.length === 4);
  let isValidColorRange = [r, g, b].every(v => v >= 0 && v <= 255);
  let isValidAlphaRange = str.startsWith("rgba(") ? `${a}`.length <= 4 && a >= 0 && a <= 1 : true;

  return isValidLengthRange && isValidColorRange && isValidAlphaRange;
};

export const isValidHsl = str => {
  const hasValidStructure = /^(?:hsl\(|hsla\()(?:[0-9,%\s]|\.(?=\d))*\)$/gi.test(str);
  if (hasValidStructure) {
    return testHslaValues(str.toLowerCase());
  }
};

export const testHslaValues = str => {
  const hsla = getNumericValues(str);
  const [h, s, l, a] = hsla;
  const isUndefined = [h,s,l].some(v => v === undefined)

  if(isUndefined) return false;

  let isValidLengthRange =
    (str.startsWith("hsl(") && hsla.length === 3) ||
    (str.startsWith("hsla(") && hsla.length === 4);
  let isValidHue = h >= 0 && h <= 360
  let isValidSatLum = [s, l].every(v => v.endsWith('%') && parseInt(v) >= 0 && parseInt(v) <= 100 )
  let isValidAlphaRange = str.startsWith("hsla(") ? `${a}`.length <= 4 && a >= 0 && a <= 1 : true;

  return isValidLengthRange && isValidHue && isValidSatLum && isValidAlphaRange;
};

export const getColorFormat = color => {
  if (typeof color === "string") {
    if (isValidHex(color)) {
      return "hex";
    } else if (isValidRgb(color)) {
      return "rgb";
    } else if (isValidHsl(color)) {
      return "hsl";
    }
  }
};

export const convertToHSVA = (value, format) => {
  switch (format) {
    case "hex":
      return getAndConvertHexa(value);
    case "rgb":
      return getAndConvertRgba(value);
    case "hsl":
      return getAndConvertHsla(value);
  }
};

export const convertHsvaToFormat = (hsva, format) => {
  switch (format) {
    case "hex":
      return hsvaToHexa(hsva, true);
    case "rgb":
      return hsvaToRgba(hsva, true);
    case "hsl":
      return hsvaToHsla(hsva);
  }
};

export const getAndConvertHexa = color => {
  let [rHex, gHex, bHex, aHex] = getHexaValues(color);
  return hexaToHSVA([rHex, gHex, bHex], aHex);
};

export const getAndConvertRgba = color => {
  let rgba = getNumericValues(color);
  return rgbaToHSVA(rgba);
};

export const getAndConvertHsla = color => {
  let hsla = getNumericValues(color);
  return hslaToHSVA(hsla);
};


export const hexaToHSVA = (hex, alpha = "FF") => {
  const rgba = hex
    .map(v => parseInt(v, 16))
    .concat(Number((parseInt(alpha, 16) / 255).toFixed(2)));
  return rgbaToHSVA(rgba);
};

export const rgbaToHSVA = rgba => {
  const [r, g, b, a = 1] = rgba;
  let hsv = _rgbToHSV([r, g, b]);
  return [...hsv, a];
};

export const hslaToHSVA = ([h, s, l, a = 1]) => {
  let sat = s.replace(/%/, "")
  let lum = l.replace(/%/, "")
  let hsv = _hslToHSV([h, sat, lum])
  return [...hsv, a]
}

export const hsvaToHexa = (hsva, asString = false) => {
  const [r, g, b, a] = hsvaToRgba(hsva);

  const hexa = [r, g, b]
    .map(v => {
		let hex = Math.round(v).toString(16)
		return hex.length === 1 ? `0${hex}` : hex
	})
    .concat(Math.round(a * 255).toString(16));
  return asString ? `#${hexa.join("")}` : hexa;
};

export const hsvaToRgba = ([h, s, v, a = 1], asString = false) => {
  let rgb = _hsvToRgb([h, s, v]).map(x => Math.round(x));
  let rgba = [...rgb, a < 1 ? _fixNum(a, 2) : a];
  return asString ? `rgba(${rgba.join(",")})` : rgba;
};

export const hsvaToHsla = ([h, s, v, a = 1], asString = false) => {
  let [hue, sat, lum] = _hsvToHSL([h, s, v]);
  let hsla = [hue, sat + "%", lum + "%", a < 1 ? _fixNum(a, 2) : a];
  return `hsla(${hsla.join(",")})`;
};

export const _hslToHSV = hsl => {
  const h = hsl[0];
  let s = hsl[1] / 100;
  let l = hsl[2] / 100;
  let smin = s;
  const lmin = Math.max(l, 0.01);

  l *= 2;
  s *= l <= 1 ? l : 2 - l;
  smin *= lmin <= 1 ? lmin : 2 - lmin;
  const v = (l + s) / 2;
  const sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

  return [h, sv * 100, v * 100];
};

//Credit : https://github.com/Qix-/color-convert
export const _rgbToHSV = rgb => {
  let rdif;
  let gdif;
  let bdif;
  let h;
  let s;

  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const v = Math.max(r, g, b);
  const diff = v - Math.min(r, g, b);
  const diffc = function(c) {
    return (v - c) / 6 / diff + 1 / 2;
  };

  if (diff === 0) {
    h = 0;
    s = 0;
  } else {
    s = diff / v;
    rdif = diffc(r);
    gdif = diffc(g);
    bdif = diffc(b);

    if (r === v) {
      h = bdif - gdif;
    } else if (g === v) {
      h = 1 / 3 + rdif - bdif;
    } else if (b === v) {
      h = 2 / 3 + gdif - rdif;
    }

    if (h < 0) {
      h += 1;
    } else if (h > 1) {
      h -= 1;
    }
  }

  const hsvResult = [h * 360, s * 100, v * 100].map(v => Math.round(v));
  return hsvResult;
};

//Credit : https://github.com/Qix-/color-convert
export const _hsvToRgb = hsv => {
  const h = hsv[0] / 60;
  const s = hsv[1] / 100;
  let v = hsv[2] / 100;
  const hi = Math.floor(h) % 6;

  const f = h - Math.floor(h);
  const p = 255 * v * (1 - s);
  const q = 255 * v * (1 - s * f);
  const t = 255 * v * (1 - s * (1 - f));
  v *= 255;

  switch (hi) {
    case 0:
      return [v, t, p];
    case 1:
      return [q, v, p];
    case 2:
      return [p, v, t];
    case 3:
      return [p, q, v];
    case 4:
      return [t, p, v];
    case 5:
      return [v, p, q];
  }
};

//Credit : https://github.com/Qix-/color-convert
export const _hsvToHSL = hsv => {
  const h = hsv[0];
  const s = hsv[1] / 100;
  const v = hsv[2] / 100;
  const vmin = Math.max(v, 0.01);
  let sl;
  let l;

  l = (2 - s) * v;
  const lmin = (2 - s) * vmin;
  sl = s * vmin;
  sl /= lmin <= 1 ? lmin : 2 - lmin;
  sl = sl || 0;
  l /= 2;

  return [_fixNum(h, 0), _fixNum(sl * 100, 0), _fixNum(l * 100, 0)];
};

export const _fixNum = (value, decimalPlaces) =>
  Number(parseFloat(value).toFixed(decimalPlaces));
