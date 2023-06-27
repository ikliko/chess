import { FigureResource } from "./FigureResource";
import { FigureTypes } from "../enums/FigureTypes";

export class BishopResource extends FigureResource {
    protected static figure: FigureTypes = FigureTypes.bishop;
}
