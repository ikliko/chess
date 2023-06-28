import { FigureTypes } from "../enums/FigureTypes";
import { config } from "../config";
import { EntityTexture } from "./EntityTexture";

export class FigureResource {
    protected static figure: FigureTypes;

    static get white(): EntityTexture {
        const { white } = config.theme.figures[this.figure].textures;

        return new EntityTexture(white.active, white.inactive);
    }

    static get black(): EntityTexture {
        const { black } = config.theme.figures[this.figure].textures;

        return new EntityTexture(black.active, black.inactive);
    }
}
