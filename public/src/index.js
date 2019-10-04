import { ThreeJSWrapper } from './Core/ThreeJSWrapper.js';
import { RouletteGame, GameState } from './Core/RouletteGame.js';
import { GameHelper } from './Core/GameHelper.js';
import { Particles } from './Core/Particles.js';
import { TextRenderer } from './Core/TextRenderer.js';
import { DissolveSprite } from './Core/DissolveSprite.js';
import { Sprites } from './Core/RouletteSprites.js';
import { TextureAnimator } from './Core/TextureAnimator.js';

window.onload = () =>
{
    let wrapper = new ThreeJSWrapper();

    let TimerText = new TextRenderer('00:00', wrapper, 30, new THREE.Vector3(-wrapper.width / 2 + 115, -wrapper.height / 2 + 180, 0));
    let WinNumberText = new TextRenderer('0', wrapper, 100, new THREE.Vector3(-25, 60, 0));

    let game = new RouletteGame(wrapper, TimerText, WinNumberText);
    let particles = new Particles(wrapper);

    let roulette_anim = new THREE.TextureLoader().load('textures/Roulette/T_SandboxAtlas.png');
    let ta = new TextureAnimator(roulette_anim, 11, 17, 17);
    let explosionMaterial = new THREE.MeshBasicMaterial({ map: roulette_anim, transparent: true });
    let cubeGeometry = new THREE.PlaneGeometry(40, 40, 512);
    let cube = new THREE.Mesh(cubeGeometry, explosionMaterial);
    cube.position.set(-90, -100, 0);
    cube.scale.set(0.8, 0.8, 0.8);
    wrapper.particlesScene.add(cube);

    wrapper.init_callback = () =>
    {
        TimerText.play();
        ta.init();
        ta.test(18);

        // todo add some loading screen for this
        particles.init(wrapper);
        wrapper.particlesScene.add(particles.mesh);

        // game.LoadRouletteSprites();
        // game.StartCountDown();
    }

    wrapper.animate_callback = () =>
    {
        // game.SpinLoop();

        particles.loop();
        TimerText.loop();
        WinNumberText.loop();


        ta.loop(wrapper.clock.getElapsedTime() * 10);

        // game.TextureAnimator.update(wrapper.clock.getDelta() * 1000);

    }

    wrapper.init();
    wrapper.animate();
}