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
        const entity = { type: curr.value };
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
                    entity.solidFillFlag = curr.value;
                    break;
                case 73:
                    entity.patternFillColor = curr.value;
                    break;
                case 71:
                    entity.assiciativityFlag = curr.value;
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
                    console.error(`Unknown HATCH code ${curr.code}. Could be boundaryPath or patternLineData. Or something else.`);
                    console.debug(`Calling checkCommonEntityProperties for HATCH ${curr.value}`);
                    helpers.checkCommonEntityProperties(entity, curr, scanner);
                    break;
            }
            curr = scanner.next();
        }
        console.debug('HATCH entity:');
        console.debug(entity);
        return entity;
    }
}
// function parseBoundaryPaths(entity: IHatchEntity, curr: IGroup) {
//     let paths = [];
//     let numPaths = 0;
//     if (!entity.numPaths || entity.numPaths === 0) {
//         return false;
//     }
//     let boundaryPathData = entity.boundaryPathData;
//     if (boundaryPathData.type === 'polyline') {
//         console.debug('Handle polyline boundary data. Barf.')
//     } else {
//         switch (curr.code) {
//             case 93:
//                 boundaryPathData.numEdges = curr.value;
//                 break;
//             case 72:
//                 boundaryPathData.edgeType = EdgeTypes[curr.value];
//                 break;
//             default:
//                 console.log(`unahandled boundaryPath code ${curr.code}`)
//                 break;
//         }
//     }
//     return boundaryPathData;
// }
// function processEdgeType(entity: IHatchEntity, curr: IGroup) {
//     let edges = {};
//     return edges;
// }
