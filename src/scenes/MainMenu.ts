import { Scene } from "./Scene";
import { Container, Graphics, Text, TextStyle } from "pixi.js";

export class MainMenu extends Scene {
    render(): void {
        this.application.stage.addChild(this.getScene());
    }

    protected loadScene(): void {
        const menu = new Container();
        const redRect = new Graphics();

        redRect
            .beginFill(0xcccccc, 0.7)
            .drawRect(0, 0, this.application.view.width, this.application.view.height)
            .endFill();

        menu.addChild(redRect);

        const playBtn = new Text("Play");

        playBtn.anchor.set(0.5, 0.5);
        playBtn.x = this.application.view.width / 2;
        playBtn.y = this.application.view.height / 2;

        playBtn.interactive = true;
        playBtn.buttonMode = true;

        playBtn.style = new TextStyle({
            fill: 0xfcfcfc,
            fontSize: 70,
            fontFamily: "Arial",
            fontWeight: "bold",
            dropShadow: true,
            dropShadowAlpha: 1,
            dropShadowAngle: 0.1,
            dropShadowBlur: 0.6,
            dropShadowColor: 0x000000,
            dropShadowDistance: 3,
        });

        playBtn.on("pointerdown", function () {
            menu.visible = false;

            window.dispatchEvent(new CustomEvent("startGame"));
        });

        playBtn.on("mouseover", function () {
            playBtn.style.dropShadowAngle = 10;
        });

        playBtn.on("mouseout", function () {
            playBtn.style.dropShadowAngle = 0.1;
        });

        menu.addChild(playBtn);

        this.scene = menu;
    }
}
