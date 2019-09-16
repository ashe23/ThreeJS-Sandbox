varying vec3 vColor;
uniform float time;
uniform vec2 resolution;
uniform sampler2D pointTexture;


float plot(vec2 st, float pct) {
  return  smoothstep( pct-0.02, pct, st.y) - smoothstep( pct, pct+0.02, st.y);
}

void main() {
   vec3 color1 = vec3(1.0, 1.0, 1.0);
   
   vec4 ParticlePointTexture = texture2D(pointTexture, gl_PointCoord);
   gl_FragColor = vec4(color1, 1.0) * ParticlePointTexture;
}