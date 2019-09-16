precision mediump float;
precision mediump int;

uniform sampler2D pointTexture;

varying float vAlpha;

void main() {
    float d = length(gl_PointCoord.xy - .5) * 2.0;

    float c = 1.0 - clamp(d, 0.0, 1.0);

    vec3 color = mix(vec3(1.0, 0.0, 0.0), vec3(0.83, 0.66, 0.18), vAlpha);
    // vec4 color = texture2D(pointTexture, gl_PointCoord)
    // vec3 c = vec3(1.0,1.0,1.0);
    gl_FragColor = vec4(color, vAlpha * c);
    // gl_FragColor = vec4(c, 1.0) * color;

}