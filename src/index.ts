import { Application, Loader } from "pixi.js";
import "./style.css";
import getGameplayScene from "./scenes/gameplayScene";
import { mainMenuScene } from "./scenes/mainMenuScene";

declare const VERSION: string;

const gameWidth = 800;
const gameHeight = 600;

console.log(`Welcome from pixi-typescript-boilerplate ${VERSION}`);

const app = new Application({
    backgroundColor: 0xd3d3d3,
    width: gameWidth,
    height: gameHeight,
});

window.onload = async (): Promise<void> => {
    await loadGameAssets();

    document.body.appendChild(app.view);
    resizeCanvas();

    const gameplay = getGameplayScene(app);
    app.stage.addChild(gameplay);

    const menu = mainMenuScene(app);
    // app.stage.addChild(menu);
};

async function loadGameAssets(): Promise<void> {
    return new Promise((res, rej) => {
        const loader = Loader.shared;

        loader.add("chess", "./assets/chess/spritesheet.json");

        loader.onComplete.once(() => res());
        loader.onError.once(() => rej());

        loader.load();
    });
}

function resizeCanvas(): void {
    const resize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        app.stage.width = window.innerWidth;
        app.stage.height = window.innerHeight;
    };

    resize();

    window.addEventListener("resize", resize);
}
