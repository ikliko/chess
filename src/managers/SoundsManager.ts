import { config } from "../config";
import { Howl } from "howler";
import { FigureTypes } from "../enums/FigureTypes";
import { FigureActions } from "../enums/FigureActions";
import { Figure } from "../models/Figure";
import { Pawn } from "../models/Pawn";
import { Knight } from "../models/Knight";
import { Bishop } from "../models/Bishop";

export class SoundsManager {
    private sounds: any = {};

    playFigureSound(figure: Figure, action: FigureActions) {
        if (figure instanceof Pawn) {
            this._playFigureSound(FigureTypes.pawn, action);

            return;
        }

        if (figure instanceof Knight) {
            this._playFigureSound(FigureTypes.knight, action);

            return;
        }

        if (figure instanceof Bishop) {
            this._playFigureSound(FigureTypes.bishop, action);

            return;
        }
    }

    protected _playFigureSound(type: FigureTypes, action: FigureActions) {
        if (!this.sounds[type]) {
            this.sounds[type] = {
                [action]: undefined,
            };
        }

        if (this.sounds[type][action] === undefined) {
            this.sounds[type][action] = this.getSound(type, action);
        }

        if (this.sounds[type][action]) {
            this.sounds[type][action].play();
        }
    }

    private getSound(type: FigureTypes, action: FigureActions): Howl | null {
        try {
            const figureConfig: any = config.theme.figures[type];

            const soundResourcePath = figureConfig?.sounds[action];

            if (soundResourcePath) {
                return new Howl({
                    src: [soundResourcePath],
                });
            }
        } catch (e) {}

        const defaultSoundPath = config.theme.defaultSounds[action];

        if (!defaultSoundPath) {
            return null;
        }

        return new Howl({
            src: [config.theme.defaultSounds[action]],
        });
    }
}
