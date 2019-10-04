varying vec3 vColor;
uniform float time;
uniform vec2 resolution;
uniform sampler2D pointTexture;


float plot(vec2 st, float pct) {
  return  smoothstep( pct-0.02, pct, st.y) - smoothstep( pct, pct+0.02, st.y);
}

void main() {
   vec3 color1 = vec3(1.0, 0.0, 0.0);
   vec3 color2 = vec3(0.83, 0.66, 0.18);
   
   vec4 ParticlePointTexture = texture2D(pointTexture, gl_PointCoord);
   gl_FragColor = vec4(mix(color1, color2, sin(time * 0.5)), 1.0) * ParticlePointTexture;
}