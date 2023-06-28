import { FigureResource } from "./FigureResource";
import { FigureTypes } from "../enums/FigureTypes";

export class RookResource extends FigureResource {
    protected static figure: FigureTypes = FigureTypes.rook;
}
