import { ThreeJSWrapper } from './Core/ThreeJSWrapper.js';
import { RouletteGame, GameState } from './Core/RouletteGame.js';
import { GameHelper } from './Core/GameHelper.js';
import { Particles } from './Core/Particles.js';
import { TextRenderer } from './Core/TextRenderer.js';
import { DissolveSprite } from './Core/DissolveSprite.js';
import { Sprites } from './Core/RouletteSprites.js';

window.onload = () =>
{
    let wrapper = new ThreeJSWrapper();

    let TimerText = new TextRenderer('00:00', wrapper, 30, new THREE.Vector3(-wrapper.width / 2 + 115, -wrapper.height / 2 + 180, 0));
    let WinNumberText = new TextRenderer('0', wrapper, 100, new THREE.Vector3(-20, 60, 0));

    let game = new RouletteGame(wrapper, TimerText, WinNumberText);
    let particles = new Particles(wrapper);

    wrapper.init_callback = () =>
    {
        TimerText.play();

        // todo add some loading screen for this
        particles.init(wrapper);
        wrapper.particlesScene.add(particles.mesh);

        game.LoadRouletteSprites();
        game.StartCountDown();
    }

    wrapper.animate_callback = () =>
    {
        game.SpinLoop();

        particles.loop();
        TimerText.loop();
        WinNumberText.loop();

        // game.TextureAnimator.update(wrapper.clock.getDelta() * 1000);

    }

    wrapper.init();
    wrapper.animate();
}