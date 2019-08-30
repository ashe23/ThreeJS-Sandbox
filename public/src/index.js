import { ThreeJSWrapper } from './Core/ThreeJSWrapper.js';
import { RouletteGame, GameState } from './Core/RouletteGame.js';

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
        game.StartCountDown();
        // game.Spin();
        // start countdown
        // todo should be request to server here

        // TweenMax.fromTo(game.number_pad.material, 1, { rotation: 0 }, { rotation: Math.PI / 4 }, { ease: Back.easeOut });

    }
    wrapper.animate_callback = () =>
    {
        if (game.CurrentGameState === GameState.spinning)
        {
            game.time += game.step;
            game.Spin();


            
            if (game.time + 1 > game.SpinDuration)
            {
                game.StopSpin();
            }
            
        }
    }

    wrapper.init();
    wrapper.animate();
}