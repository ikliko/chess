import { FigureResource } from "./FigureResource";
import { FigureTypes } from "../enums/FigureTypes";

export class PawnResource extends FigureResource {
    protected static figure: FigureTypes = FigureTypes.pawn;
}
