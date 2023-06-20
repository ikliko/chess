import { Application, Container, Graphics, Text, TextStyle } from "pixi.js";

export default function mainMenuScene(app: Application) {
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

    return menu;
}
