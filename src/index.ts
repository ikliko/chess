import { AnimatedSprite, Application, Container, Graphics, Loader, Text, TextStyle, Texture } from "pixi.js";
import { getSpine } from "./spine-example";
import "./style.css";

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

    const birdFromSprite = getBird();
    birdFromSprite.anchor.set(0.5, 0.5);
    birdFromSprite.position.set(app.view.width / 2, 530);

    const spineExample = getSpine();
    spineExample.position.y = 580;

    const gameplay = new Container();
    gameplay.addChild(birdFromSprite);
    gameplay.addChild(spineExample);
    gameplay.interactive = true;

    app.stage.addChild(gameplay);

    const menu = new Container();

    const redRect = new Graphics();
    redRect.beginFill(0xcccccc, 0.7).drawRect(0, 0, app.view.width, app.view.height).endFill();

    menu.addChild(redRect);

    const playBtn = new Text("Play");
    playBtn.anchor.set(0.5, 0.5);
    playBtn.x = app.view.width / 2;
    playBtn.y = app.view.height / 2;
    playBtn.style = new TextStyle({
        fill: 0xfcfcfc,
        fontSize: 70,
        fontFamily: "Arial",
        fontWeight: "bold",
        // stroke: 0xff0000,
        // strokeThickness: 2,
        dropShadow: true,
        dropShadowAlpha: 1,
        dropShadowAngle: 0.1,
        dropShadowBlur: 0.6,
        dropShadowColor: 0x000000,
        dropShadowDistance: 3,
    });
    playBtn.on("pointerdown", function () {
        menu.visible = false;
    });
    playBtn.on("mouseover", function () {
        playBtn.style.dropShadowAngle = 10;
    });
    playBtn.on("mouseout", function () {
        playBtn.style.dropShadowAngle = 0.1;
    });
    playBtn.interactive = true;
    playBtn.buttonMode = true;
    menu.addChild(playBtn);

    app.stage.addChild(menu);
};

async function loadGameAssets(): Promise<void> {
    return new Promise((res, rej) => {
        const loader = Loader.shared;

        loader.add("rabbit", "./assets/simpleSpriteSheet.json");
        loader.add("pixie", "./assets/spine-assets/pixie.json");

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

function getBird(): AnimatedSprite {
    const bird = new AnimatedSprite([
        Texture.from("birdUp.png"),
        Texture.from("birdMiddle.png"),
        Texture.from("birdDown.png"),
    ]);

    bird.loop = true;
    bird.animationSpeed = 0.1;
    bird.play();
    bird.scale.set(3);

    return bird;
}
