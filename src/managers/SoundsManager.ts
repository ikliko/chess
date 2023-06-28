import { config } from "../config";
import { Howl } from "howler";
import { FigureTypes } from "../enums/FigureTypes";
import { FigureActions } from "../enums/FigureActions";
import { Figure } from "../models/Figure";
import { Pawn } from "../models/Pawn";
import { Knight } from "../models/Knight";
import { Bishop } from "../models/Bishop";
import { Queen } from "../models/Queen";
import { Rook } from "../models/Rook";
import { King } from "../models/King";
import { FigureColor } from "../enums/FigureColor";

type Sounds = {
    [key in FigureTypes]?: {
        [key in FigureActions]?: Howl | undefined;
    };
};

type FigureConfig = {
    sounds?: { [key in FigureActions]?: string };
    textures: { [key in FigureColor]: { inactive: string; active: string } };
};

export class SoundsManager {
    private sounds: Sounds = {};

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

        if (figure instanceof Rook) {
            this._playFigureSound(FigureTypes.rook, action);

            return;
        }

        if (figure instanceof Queen) {
            this._playFigureSound(FigureTypes.queen, action);

            return;
        }

        if (figure instanceof King) {
            this._playFigureSound(FigureTypes.king, action);

            return;
        }
    }

    protected _playFigureSound(type: FigureTypes, action: FigureActions) {
        if (!this.sounds[type]) {
            this.sounds[type] = {
                [action]: undefined,
            };
        }

        // @ts-ignore
        if (this.sounds[type][action] === undefined) {
            // @ts-ignore
            this.sounds[type][action] = this.getSound(type, action);
        }

        // @ts-ignore
        if (this.sounds[type][action]) {
            // @ts-ignore
            this.sounds[type][action].play();
        }
    }

    private getSound(type: FigureTypes, action: FigureActions): Howl | null {
        const figureConfig: FigureConfig = config.theme.figures[type];

        if (!figureConfig?.sounds || !figureConfig.sounds[action]) {
            return this.getDefaultSounds(action);
        }

        const soundResourcePath = figureConfig.sounds[action];

        if (soundResourcePath) {
            return new Howl({
                src: [soundResourcePath],
            });
        }

        return this.getDefaultSounds(action);
    }

    private getDefaultSounds(action: FigureActions): Howl | null {
        const defaultSoundPath = config.theme.defaultSounds[action];

        if (!defaultSoundPath) {
            return null;
        }

        return new Howl({
            src: [config.theme.defaultSounds[action]],
        });
    }
}
