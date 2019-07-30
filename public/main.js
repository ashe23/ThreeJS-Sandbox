import { GameLoop } from './GameLoop.js';

function OnDocumentLoad(){
    let GL = new GameLoop();
    GL.init();
    GL.animate();
}

window.onload = OnDocumentLoad;