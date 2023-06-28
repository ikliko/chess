import { Application, Loader } from "pixi.js";
import { config } from "./config";
import { ChessScene } from "./scenes/ChessScene";
import { MainMenu } from "./scenes/MainMenu";
import "./style.css";

declare const VERSION: string;

const gameWidth = 800;
const gameHeight = 600;

console.log(`Welcome from pixi-typescript-boilerplate ${VERSION}`);

const app = new Application({
    backgroundColor: 0x0f0f0f,
    width: gameWidth,
    height: gameHeight,
});

window.onload = async (): Promise<void> => {
    await loadGameAssets();

    document.body.appendChild(app.view);
    resizeCanvas();

    const chess = new ChessScene(app);
    chess.render();
    chess.onHold();

    const menu = new MainMenu(app);
    menu.render();

    window.addEventListener("startGame", () => chess.start());
};

async function loadGameAssets(): Promise<void> {
    return new Promise((res, rej) => {
        const loader = Loader.shared;

        loader.add("chess", config.theme.spritesheet);

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
