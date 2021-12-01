// See http://help.autodesk.com/view/OARX/2018/ENU/?guid=GUID-C6C71CED-CE0F-4184-82A5-07AD6241F15B
import DxfArrayScanner, { IGroup } from '../DxfArrayScanner';
import * as helpers from '../ParseHelpers';
import IGeometry, { IEntity, IPoint } from './geomtry';
// import BoundaryPath, { IBoundaryPathEntity } from './subentities/boundarypath';
// import { IBoundaryPathEntity } from './subentities/boundarypath';
import HatchPatternLineData from './subentities/hatchpatternlinedata';

// Note: defining indexes explicitly because DXF is not consistent in use of 0 v 1 for indexed enums.
enum HatchStyle {
    normal = 0,
    outer = 1,
    ignore = 2,
}

enum HatchPatternType {
    user = 0,
    predefined = 1,
    custom = 2,
}

export interface IHatchEntity extends IEntity {
    elevationPoint: IPoint, // Codes: 10, 20, 30
    extrusionDirection: IPoint, // Codes: 210, 220, 230
    hatchPatternName: string, // Code: 2
    solidFillFlag: boolean, // Code: 70
    patternFillColor?: number, // Code: 73 For MPolygon. AutoCad Color Index
    associativityFlag: boolean, // Code: 71 Associativity flag (0 = non-associative; 1 = associative); for MPolygon, solid-fill flag (0 = lacks solid fill; 1 = has solid fill)
    numPaths: number, // Code: 91
    boundaryPath: IBoundaryPathEntity[], // Code: varies Loop number of times defined in numPaths
    hatchStyle: HatchStyle, // Code: 75
    hatchPatternType: HatchPatternType, // Code: 76
    hatchPatternAngle?: number, // Code: 52 Pattern-fill only
    hatchPatternScale?: number, // Code: 41 Pattern-fill only
    isBoundaryAnnotated?: boolean // Code: 73 For MPolygon
    isHatchPatternDoubled?: boolean, // Code: 77 Pattern-fill only
    numPatternDefinitionLines: number, // Code: 78
    patternLineData: HatchPatternLineData, // Code: varies
}

export default class Hatch implements IGeometry {
    public ForEntityName = 'HATCH' as const;
    public parseEntity(scanner: DxfArrayScanner, curr: IGroup) {
        const entity = { type: curr.value, boundaryPath: [] as IBoundaryPathEntity[] } as IHatchEntity;
        curr = scanner.next();
        while (!scanner.isEOF()) {
            if (curr.code === 0) break;

            switch (curr.code) {
                case 10:
                    entity.elevationPoint = helpers.parsePoint(scanner);
                    break;
                case 210:
                    entity.extrusionDirection = helpers.parsePoint(scanner);
                    break;
                case 2:
                    entity.hatchPatternName = curr.value as string;
                    break;
                case 70:
                    entity.solidFillFlag = curr.value as boolean; // FIXME: Seeing non-boolean values in Saigon. KR 2021.12.01
                    break;
                case 73:
                    entity.patternFillColor = curr.value as number;
                    break;
                case 71:
                    entity.associativityFlag = curr.value as boolean;
                    break;
                case 91:
                    entity.numPaths = curr.value as number;
                    break;
                // boundaryPath: IBoundaryPath, // Code: varies Loop number of times defined in numPaths
                case 75:
                    entity.hatchStyle = curr.value as HatchStyle;
                    break;
                case 76:
                    entity.hatchPatternType = curr.value as HatchPatternType;
                    break;
                case 52:
                    entity.hatchPatternAngle = curr.value as number;
                    break;
                case 41:
                    entity.hatchPatternScale = curr.value as number;
                    break;
                case 73:
                    entity.isBoundaryAnnotated = curr.value as boolean;
                    break;
                case 77:
                    entity.isHatchPatternDoubled = curr.value as boolean;
                    break;
                case 78:
                    entity.numPatternDefinitionLines = curr.value as number;
                    break;
                // patternLineData: HatchPatternData, // Code: varies
                default:
                    if (!helpers.checkCommonEntityProperties(entity, curr, scanner)) {
                        parseBoundaryPaths(scanner, curr, entity.numPaths);
                        curr = scanner.lastReadGroup;
                        // console.error(`Unknown HATCH code ${curr.code}. Could be boundaryPath or patternLineData. entity.numPaths = ${entity.numPaths}. entity.numPatternLineDefinitions = ${entity.numPatternDefinitionLines}`)
                        //entity.boundaryPath = BoundaryPath.prototype.parseBoundaryPaths(scanner, curr, entity.numPaths)
                        //entity.boundaryPath.push(BoundaryPath.prototype.parseEntity(scanner, curr));
                    }
                    break;
            }
            curr = scanner.next();
        }
        // console.debug('HATCH entity:');
        // console.debug(entity);
        return entity;
    }
}

interface IBoundaryPathEntity extends IEntity {
    boundaryPathType: number,
    isPolyline: boolean,
    pathData?: object, // Only for polylines
    numEdges?: number, // Only if not polyline
    edgeType?: number,
    edgeTypeData?: object,
    numSourceObjects: number,
    sourceObjectReference: string,
}

function parseBoundaryPaths(scanner: DxfArrayScanner, curr: IGroup, numPaths: number) {
    let boundaryPaths = [];
    let boundaryPathIsStarted = false;
    let boundaryPathIsFinished = false;

    for (let i = 0; i <= numPaths; i++) {
        let boundaryPath = {} as IBoundaryPathEntity;
        while (!scanner.isEOF()) {
            if (curr.code === 0 || boundaryPathIsFinished) break;
            boundaryPathIsStarted = true;
            // switch code
            switch (curr.code) {
                case 92:
                    // boundaryPath.boundaryPathType = curr.value as number;
                    // break;
                case 93:
                    // boundaryPath.isPolyline = false;
                    // boundaryPath.numEdges = curr.value as number;
                    // break;
                case 72:
                    // boundaryPath.edgeType = curr.value as number;
                    // break;
                case 97:
                    // boundaryPath.numSourceObjects = curr.value as number;
                    // break;
                    console.log(curr);
                    break;
                case 330:
                    console.log(curr);
                    if (boundaryPathIsStarted) {
						boundaryPathIsFinished = true;
						continue;
					}
					// boundaryPath.sourceObjectReference = curr.value as string;
					boundaryPathIsStarted = true;
					break;
                default:
                    console.log(curr)
                    return boundaryPaths;
            }
            boundaryPaths.push(boundaryPath);
            curr = scanner.next();
        }
        boundaryPathIsStarted = false;
        boundaryPathIsFinished = false;
    }
    scanner.rewind();
    console.log(boundaryPaths)
    return boundaryPaths;
};


