import DxfArrayScanner, { IGroup } from '../../DxfArrayScanner';
import IGeometry, { IEntity } from '../geomtry';
declare enum EdgeType {
    line = 1,
    circle = 2,
    arc = 3,
    spline = 4
}
declare enum BoundaryPathType {
    notBoundaryPath = -1,
    default = 0,
    external = 1,
    polyline = 2,
    derived = 4,
    textbox = 8,
    outermost = 16
}
export interface IBoundaryPathEntity extends IEntity {
    boundaryPathType: BoundaryPathType;
    isPolyline: boolean;
    pathData?: object;
    numEdges?: number;
    edgeType?: EdgeType;
    edgeTypeData?: object;
    numSourceObjects: number;
    sourceObjectReference: object[];
}
export default class BoundaryPath implements IGeometry {
    ForEntityName: "BOUNDARYPATH";
    parseEntity(scanner: DxfArrayScanner, curr: IGroup): IBoundaryPathEntity;
}
export {};
