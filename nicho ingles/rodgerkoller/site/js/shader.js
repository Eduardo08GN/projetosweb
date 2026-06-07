(function () {
  'use strict';

  var canvas = document.getElementById('hero-shader');
  if (!canvas) return;

  var gl = canvas.getContext('webgl', { alpha: false, antialias: false });
  if (!gl) return;

  var vertSrc = [
    'attribute vec2 a_position;',
    'varying vec2 v_uv;',
    'void main() {',
    '  v_uv = a_position * 0.5 + 0.5;',
    '  gl_Position = vec4(a_position, 0.0, 1.0);',
    '}'
  ].join('\n');

  var fragSrc = [
    'precision mediump float;',
    'varying vec2 v_uv;',
    'uniform float u_time;',
    'uniform vec2 u_resolution;',
    '',
    'vec3 c0 = vec3(0.027, 0.145, 0.388);',  // hsl(216,90%,27%) deep navy
    'vec3 c1 = vec3(0.118, 0.122, 0.604);',  // hsl(243,68%,36%) purple
    'vec3 c2 = vec3(0.357, 0.659, 0.902);',  // hsl(205,91%,64%) light blue
    'vec3 c3 = vec3(0.302, 0.561, 0.831);',  // hsl(211,61%,57%) medium blue
    'vec3 c4 = vec3(0.059, 0.090, 0.165);',  // base dark (#0f172a)
    '',
    'float hash(vec2 p) {',
    '  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);',
    '}',
    '',
    'float noise(vec2 p) {',
    '  vec2 i = floor(p);',
    '  vec2 f = fract(p);',
    '  f = f * f * (3.0 - 2.0 * f);',
    '  float a = hash(i);',
    '  float b = hash(i + vec2(1.0, 0.0));',
    '  float c = hash(i + vec2(0.0, 1.0));',
    '  float d = hash(i + vec2(1.0, 1.0));',
    '  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);',
    '}',
    '',
    'float fbm(vec2 p) {',
    '  float v = 0.0;',
    '  float a = 0.5;',
    '  for (int i = 0; i < 4; i++) {',
    '    v += a * noise(p);',
    '    p *= 2.0;',
    '    a *= 0.5;',
    '  }',
    '  return v;',
    '}',
    '',
    'void main() {',
    '  vec2 uv = v_uv;',
    '  float aspect = u_resolution.x / u_resolution.y;',
    '  vec2 st = vec2(uv.x * aspect, uv.y);',
    '  float t = u_time * 0.08;',
    '',
    '  float n1 = fbm(st * 1.8 + vec2(t * 0.7, t * 0.3));',
    '  float n2 = fbm(st * 2.2 + vec2(-t * 0.5, t * 0.6));',
    '  float n3 = fbm(st * 1.4 + vec2(t * 0.4, -t * 0.8));',
    '',
    '  vec3 col = c4;',
    '  col = mix(col, c0, smoothstep(0.2, 0.7, n1) * 0.8);',
    '  col = mix(col, c1, smoothstep(0.3, 0.8, n2) * 0.5);',
    '  col = mix(col, c3, smoothstep(0.4, 0.75, n3) * 0.6);',
    '',
    '  float highlight = fbm(st * 3.0 + vec2(t, -t * 0.5));',
    '  col = mix(col, c2, smoothstep(0.55, 0.85, highlight) * 0.35);',
    '',
    '  float vignette = 1.0 - length((uv - 0.5) * vec2(1.2, 1.6));',
    '  vignette = smoothstep(0.0, 0.7, vignette);',
    '  col *= 0.7 + 0.3 * vignette;',
    '',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  function createShader(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  var vs = createShader(gl.VERTEX_SHADER, vertSrc);
  var fs = createShader(gl.FRAGMENT_SHADER, fragSrc);
  if (!vs || !fs) return;

  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;

  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

  var aPos = gl.getAttribLocation(prog, 'a_position');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  var uTime = gl.getUniformLocation(prog, 'u_time');
  var uRes = gl.getUniformLocation(prog, 'u_resolution');

  function resize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.floor(rect.width * dpr);
    var h = Math.floor(rect.height * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }

  var running = true;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function draw(time) {
    if (!running) return;
    resize();
    gl.uniform1f(uTime, reducedMotion ? 0.0 : time * 0.001);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(draw);
  }

  var observer = new IntersectionObserver(function (entries) {
    running = entries[0].isIntersecting;
    if (running) requestAnimationFrame(draw);
  }, { threshold: 0 });

  observer.observe(canvas);
  requestAnimationFrame(draw);
})();
