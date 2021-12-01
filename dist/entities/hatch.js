import * as helpers from '../ParseHelpers';
// Note: defining indexes explicitly because DXF is not consistent in use of 0 v 1 for indexed enums.
var HatchStyle;
(function (HatchStyle) {
    HatchStyle[HatchStyle["normal"] = 0] = "normal";
    HatchStyle[HatchStyle["outer"] = 1] = "outer";
    HatchStyle[HatchStyle["ignore"] = 2] = "ignore";
})(HatchStyle || (HatchStyle = {}));
var HatchPatternType;
(function (HatchPatternType) {
    HatchPatternType[HatchPatternType["user"] = 0] = "user";
    HatchPatternType[HatchPatternType["predefined"] = 1] = "predefined";
    HatchPatternType[HatchPatternType["custom"] = 2] = "custom";
})(HatchPatternType || (HatchPatternType = {}));
export default class Hatch {
    ForEntityName = 'HATCH';
    parseEntity(scanner, curr) {
        const entity = { type: curr.value, boundaryPath: [] };
        curr = scanner.next();
        while (!scanner.isEOF()) {
            if (curr.code === 0)
                break;
            switch (curr.code) {
                case 10:
                    entity.elevationPoint = helpers.parsePoint(scanner);
                    break;
                case 210:
                    entity.extrusionDirection = helpers.parsePoint(scanner);
                    break;
                case 2:
                    entity.hatchPatternName = curr.value;
                    break;
                case 70:
                    entity.solidFillFlag = curr.value; // FIXME: Seeing non-boolean values in Saigon. KR 2021.12.01
                    break;
                case 73:
                    entity.patternFillColor = curr.value;
                    break;
                case 71:
                    entity.associativityFlag = curr.value;
                    break;
                case 91:
                    entity.numPaths = curr.value;
                    break;
                // boundaryPath: IBoundaryPath, // Code: varies Loop number of times defined in numPaths
                case 75:
                    entity.hatchStyle = curr.value;
                    break;
                case 76:
                    entity.hatchPatternType = curr.value;
                    break;
                case 52:
                    entity.hatchPatternAngle = curr.value;
                    break;
                case 41:
                    entity.hatchPatternScale = curr.value;
                    break;
                case 73:
                    entity.isBoundaryAnnotated = curr.value;
                    break;
                case 77:
                    entity.isHatchPatternDoubled = curr.value;
                    break;
                case 78:
                    entity.numPatternDefinitionLines = curr.value;
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
function parseBoundaryPaths(scanner, curr, numPaths) {
    let boundaryPaths = [];
    let boundaryPathIsStarted = false;
    let boundaryPathIsFinished = false;
    for (let i = 0; i <= numPaths; i++) {
        let boundaryPath = {};
        while (!scanner.isEOF()) {
            if (curr.code === 0 || boundaryPathIsFinished)
                break;
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
                    console.log(curr);
                    return boundaryPaths;
            }
            boundaryPaths.push(boundaryPath);
            curr = scanner.next();
        }
        boundaryPathIsStarted = false;
        boundaryPathIsFinished = false;
    }
    scanner.rewind();
    console.log(boundaryPaths);
    return boundaryPaths;
}
;
