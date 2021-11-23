import DxfArrayScanner, { IGroup } from 'src/DxfArrayScanner';
import IGeometry, { IEntity } from '../geomtry';
declare enum EdgeType {
    line = 1,
    circle = 2,
    arc = 3,
    spline = 4
}
export interface IBoundaryPath extends IEntity {
    isPolyline: boolean;
    pathData?: object;
    numEdges?: number;
    edgeType?: EdgeType;
    edgeTypeData?: object;
    numSourceObjects: number;
    sourceObjectReference: object;
}
export default class BoundaryPath implements IGeometry {
    ForEntityName: "BOUNDARYPATH";
    parseEntity(scanner: DxfArrayScanner, curr: IGroup): IBoundaryPath;
}
export {};
