import dissolveVertShaderCode from '../../shaders/dissolve.vs'
import dissolveFragShaderCode from '../../shaders/dissolve.fs'
import { Sprites } from './RouletteSprites.js'

export class DissolveSprite
{
    constructor(wrapper, texture, scale, position)
    {
        this.wrapper = wrapper;
        this.texture = new THREE.TextureLoader().load(texture);
        this.scale = scale ? scale : new THREE.Vector3(1, 1, 1);
        this.position = position ? position : new THREE.Vector3();

        this.geo = new THREE.PlaneGeometry(50, 50);

        this.material = new THREE.ShaderMaterial({
            vertexShader: dissolveVertShaderCode,
            fragmentShader: dissolveFragShaderCode,
            transparent: true,
            depthTest: false,
            uniforms: {
                uThreshold: {
                    value: 1
                },
                uEdgeWidth: {
                    value: 0.01
                },
                uEdgeColor: {
                    value: [211, 169, 46]
                },
                uColor: {
                    value: [20, 20, 20]
                },
                uFrequency: {
                    value: 0.03
                },
                sandTimeTexture: {
                    type: "t",
                    value: this.texture
                }
            }
        });


        this.mesh = new THREE.Mesh(this.geo, this.material);
        this.mesh.scale.set(this.scale.x, this.scale.y, this.scale.z);
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        // this.circle.position.set(400, 100, 0);
        this.wrapper.spritesScene.add(this.mesh);
    }

    loop()
    {

    }

    appear(duration)
    {
        let d = duration ? duration : 2;
        TweenMax.fromTo(this.mesh.material.uniforms.uThreshold, d, { value: 0 }, { value: 1 });
    }

    disappear(duration)
    {
        let d = duration ? duration : 2;
        TweenMax.fromTo(this.mesh.material.uniforms.uThreshold, d, { value: 1 }, { value: 0 });
    }
}