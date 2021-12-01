import DxfArrayScanner, { IGroup } from '../DxfArrayScanner';
import IGeometry, { IEntity, IPoint } from './geomtry';
import HatchPatternLineData from './subentities/hatchpatternlinedata';
declare enum HatchStyle {
    normal = 0,
    outer = 1,
    ignore = 2
}
declare enum HatchPatternType {
    user = 0,
    predefined = 1,
    custom = 2
}
export interface IHatchEntity extends IEntity {
    elevationPoint: IPoint;
    extrusionDirection: IPoint;
    hatchPatternName: string;
    solidFillFlag: boolean;
    patternFillColor?: number;
    associativityFlag: boolean;
    numPaths: number;
    boundaryPath: IBoundaryPathEntity[];
    hatchStyle: HatchStyle;
    hatchPatternType: HatchPatternType;
    hatchPatternAngle?: number;
    hatchPatternScale?: number;
    isBoundaryAnnotated?: boolean;
    isHatchPatternDoubled?: boolean;
    numPatternDefinitionLines: number;
    patternLineData: HatchPatternLineData;
}
export default class Hatch implements IGeometry {
    ForEntityName: "HATCH";
    parseEntity(scanner: DxfArrayScanner, curr: IGroup): IHatchEntity;
}
interface IBoundaryPathEntity extends IEntity {
    boundaryPathType: number;
    isPolyline: boolean;
    pathData?: object;
    numEdges?: number;
    edgeType?: number;
    edgeTypeData?: object;
    numSourceObjects: number;
    sourceObjectReference: string;
}
export {};
