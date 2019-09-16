uniform float time;
attribute vec3 velocity;
attribute vec3 acceleration;
attribute float size;

float rand(float n) {
    return fract(sin(n) * 43758.5453123);
}

float noise(float p) {
	float fl = floor(p);
    float fc = fract(p);
	return mix(rand(fl), rand(fl + 1.0), fc);
}



void main() {
    float t = time / 10.0;
    vec3 acc = acceleration * 0.5 * t * t;
    vec3 vel = velocity * t;
    
    vec3 pos = position;
    pos.x += noise(vel.x);
    pos.y += noise(vel.y);

   
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos * 5.0, 1.0);
    gl_PointSize = size;
}