import { ThreeJSWrapper } from './Core/ThreeJSWrapper.js';
import { RouletteGame, GameState } from './Core/RouletteGame.js';
import { GameHelper } from './Core/GameHelper.js';
import { sprites } from './Core/RouletteGame.js';

window.onload = () =>
{
    let wrapper = new ThreeJSWrapper();
    let game = new RouletteGame(wrapper);

    wrapper.init_callback = () =>
    {
        // load all sprites
        // todo add some loading screen for this
        game.LoadRouletteSprites();
        game.LoadTextSprites();
        game.InitCanvasText();
        game.StartCountDown();
        // game.SpawnParticles();
        // game.canvasText.play();

        // TweenMax.fromTo(game.particles.uniforms.uAnimation, 10, { value: 0 }, { value: 1 });
        // setTimeout(() =>
        // {
        //     TweenMax.fromTo(game.particles.uniforms.uAnimation, 10, { value: 1 }, { value: 0 });
        // }, 11000);
        // game.Spin();

        // setTimeout(() =>
        // {
        //     wrapper.ReadBuffer();
        // }, 2000);

        // setTimeout(() =>
        // {
        // let renderTexture = new THREE.WebGLRenderTarget(wrapper.width, wrapper.height, {
        //     format: THREE.RGBAFormat,
        //     type: THREE.UnsignedByteType
        // });
        //     var buffer = new Uint8Array(wrapper.width * wrapper.height * 4);
        //     // wrapper.renderer.setRenderTarget(renderTexture);
        //     // wrapper.renderer.clear();

        //     // wrapper.renderer.render(wrapper.scene, wrapper.camera, renderTexture, true);
        //     // wrapper.renderer.readRenderTargetPixels(renderTexture, 0, 0, wrapper.width, wrapper.height, buffer);

        //     // let c = 0;
        //     // for(let i = 0 ;i < buffer.length;++i)
        //     // {
        //     //     if(buffer[i] > 0.0)
        //     //     {
        //     //         c++;
        //     //     }
        //     // }
        //     console.log(buffer);

        //     // let context = wrapper.renderer.getContext();
        //     // let pixels = new Uint8Array(context.drawingBufferWidth * context.drawingBufferHeight * 4);
        //     // context.readPixels(-500, -500, context.drawingBufferWidth, context.drawingBufferHeight, context.RGBA, context.UNSIGNED_BYTE, pixels);

        //     // console.log(pixels);

        // }, 3000);

        // start countdown
        // todo should be request to server here

        // TweenMax.fromTo(game.number_pad.material, 1, { rotation: 0 }, { rotation: Math.PI / 4 }, { ease: Back.easeOut });

    }
    wrapper.animate_callback = () =>
    {
        game.SpinLoop();
       
        // game.TextureAnimator.update(wrapper.clock.getDelta() * 1000);

    }

    wrapper.init();
    wrapper.animate();
}