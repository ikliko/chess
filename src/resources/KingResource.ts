import { FigureResource } from "./FigureResource";
import { FigureTypes } from "../enums/FigureTypes";

export class KingResource extends FigureResource {
    protected static figure: FigureTypes = FigureTypes.king;
}
