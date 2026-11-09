import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

// Conjunto de Julia animado, com distorção de domínio e paleta vermelho/azul
const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  float t = u_time * 0.06;

  // distorção "líquida" antes de iterar o fractal
  uv += 0.08 * vec2(sin(uv.y * 5.0 + t * 6.0), cos(uv.x * 5.0 - t * 5.0));

  float a = t * 0.7;
  mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));
  vec2 z = rot * uv * (2.4 + 0.5 * sin(t * 2.0));

  // o parâmetro c percorre um círculo perto da borda do conjunto de Mandelbrot
  vec2 c = 0.7885 * vec2(cos(t * 1.3 + 1.0), sin(t * 1.3 + 1.0));

  float n = 0.0;
  const float MAX_IT = 72.0;
  for (int i = 0; i < 72; i++) {
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
    if (dot(z, z) > 1000.0) break;
    n += 1.0;
  }

  vec3 col;
  if (n >= MAX_IT) {
    col = vec3(0.20, 0.03, 0.09);
  } else {
    float sm = n - log2(log2(dot(z, z))) + 4.0;
    float v = sm / MAX_IT;
    col = mix(vec3(0.50, 0.07, 0.11), vec3(0.93, 0.27, 0.25), 0.5 + 0.5 * sin(v * 11.0 + t * 9.0));
    float blue = smoothstep(0.55, 0.92, 0.5 + 0.5 * sin(v * 6.0 - t * 6.0 + 1.5));
    col = mix(col, vec3(0.10, 0.45, 0.86), blue);
  }
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

export default function FractalBackground({ scale = 0.5, speed = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");
    if (!gl) {
      canvas.style.display = "none"; // cai no gradiente do CSS
      return;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");

    const resize = () => {
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf;
    const start = performance.now();

    const draw = (now) => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reduced ? 3 : ((now - start) / 1000) * speed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [scale, speed]);

  return <canvas ref={canvasRef} className="fractal-bg" aria-hidden="true" />;
}