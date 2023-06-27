import { config } from "../config";
import { Howl } from "howler";
import { FigureTypes } from "../enums/FigureTypes";
import { FigureActions } from "../enums/FigureActions";

class SoundsManager {
    private static sounds: any = {};

    static playFigureSound(type: FigureTypes, action: FigureActions) {
        if (this.sounds[type][action] === undefined) {
            this.sounds[type][action] = this.getSound(type, action);
        }

        if (this.sounds[type][action]) {
            this.sounds[type][action].play();
        }
    }

    private static getSound(type: FigureTypes, action: FigureActions): Howl | null {
        const figureConfig: any = config.theme.figures[type];

        const soundResourcePath = figureConfig?.sounds[action];

        if (soundResourcePath) {
            return new Howl({
                src: [soundResourcePath],
            });
        }

        const defaultSoundPath = config.theme.defaultSounds[action];

        if (!defaultSoundPath) {
            return null;
        }

        return new Howl({
            src: [config.theme.defaultSounds[action]],
        });
    }
}
