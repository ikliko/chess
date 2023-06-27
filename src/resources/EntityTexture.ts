import { Texture } from "pixi.js";

export class EntityTexture {
    active: Texture;
    inactive: Texture;

    constructor(active: string, inactive: string) {
        this.active = Texture.from(active);
        this.inactive = Texture.from(inactive);
    }
}
