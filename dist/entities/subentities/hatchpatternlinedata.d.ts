import { IEntity } from 'src';
import DxfArrayScanner, { IGroup } from '../../DxfArrayScanner';
import IGeometry, { IPoint } from '../geomtry';
export interface IHatchPatternLineData extends IEntity {
    lineAngle: number;
    basePoint: IPoint;
    offset: IPoint;
    numDashLengthItems: number;
    dashLength: object;
}
export default class HatchPatternLineData implements IGeometry {
    ForEntityName: "BOUNDARYPATH";
    parseEntity(scanner: DxfArrayScanner, curr: IGroup): IHatchPatternLineData;
}
