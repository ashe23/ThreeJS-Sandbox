uniform float time;
uniform vec2 resolution;  
uniform sampler2D pointTexture;

varying vec3 vColor;
varying float vAlpha;
varying vec2 vUv;

void main()	{
    vec4 ParticlePointTexture = texture2D(pointTexture, gl_PointCoord);
    vec3 c = vec3(1.0, 1.0, 0.0);
    gl_FragColor = vec4(c, 1.0) * ParticlePointTexture;
}