import { Application, Container } from "pixi.js";

export abstract class Scene {
    protected application: Application;
    protected scene: Container | null = null;

    constructor(application: Application) {
        this.application = application;
    }

    abstract render(): void;

    protected getScene(): Container {
        if (!this.scene) {
            this.loadScene();
        }

        // @ts-ignore
        return this.scene;
    }

    protected abstract loadScene(): void;
}
