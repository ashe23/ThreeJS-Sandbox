uniform float uThreshold;
uniform float uEdgeWidth;
uniform vec3 uEdgeColor;
uniform vec3 uColor;
uniform sampler2D sandTimeTexture;
varying float vNoise;
varying vec2 vUv;

void main()
{
    float alpha = 1.0;
    if( vNoise > uThreshold) {
        alpha = 0.0;
    }

    vec3 materialColor = uColor / 255.0;
    vec3 edgeColor = uEdgeColor / 255.0;

    vec3 color = materialColor;

    if( vNoise + uEdgeWidth > uThreshold ) {
        color = edgeColor;
    }

    vec4 diffuseColor = vec4( color, alpha );
    vec3 c = vec3(1.0, 1.0, 1.0);
    gl_FragColor = diffuseColor * texture2D(sandTimeTexture, vUv) * vec4(10.0, 10.0, 10.0,1.0);
    // gl_FragColor = diffuseColor;
    // gl_FragColor = texture2D(sandTimeTexture, vUv);
}