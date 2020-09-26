
import * as helpers from '../ParseHelpers'

export default function EntityParser() {}

EntityParser.ForEntityName = 'HATCH';

var BoundaryPathTypes = {
    0: 'default',
    1: 'external',
    2: 'polyline',
    4: 'derived',
    8: 'textbox',
    16: 'outermost',
}


EntityParser.prototype.parseEntity = function(scanner, curr) {
    var entity;
    entity = { type: curr.value };
    entity.boundaryPath = {};
    curr = scanner.next();
    while(curr !== 'EOF') {
        if(curr.code === 0) break;

        switch(curr.code) {
            case 2:
                entity.hatchPatternName = curr.value;
                break;
            case 10:
                entity.elevationPoint = helpers.parsePoint(scanner);
                break;
            case 210:
                entity.extrusionDirection = helpers.parsePoint(scanner);
                break;
            case 70:
                entity.solidFillFlag = curr.value;
                break;
            case 63:
                entity.patternFillColor = curr.value;
                break;
            case 71:
                entity.associativityFlag = curr.value;
                break;
            case 91:
                entity.numberOfBoundaryPaths = curr.value;
                break;
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
                entity.hatchPatternScaleOrSpacing = curr.value;
                break;
            case 73:
                entity.boundaryAnnotationFlag = curr.value;
                break;
            case 77:
                entity.hatchPatternDoubleFill = curr.value;
                break;
            case 78:
                entity.numberPatternDefinitionLines = curr.value;
                break;
            case 47:
                entity.pixelSize = curr.value;
                break;
            case 98:
                entity.seedPoints = curr.value;
                break;
            case 11:
                entity.offsetVector = curr.value;
                break;
            case 99:
                entity.boundaryPath.numDegeneratePaths = curr.value;
                break;
            // 10/20 should probably use parsePoint helper
            // Also, 10 is a repeat, which, I guess means order matters . . .
            case 10:
                entity.seedPointX = curr.value;
                break;
            case 20:
                entity.seedPointY = curr.value;
                break;
            case 450:
                entity.solidHatchOrGradient = curr.value;
                break;
            // 451 -- reserved for future use
            case 452:
                entity.howColorsUsed = curr.value;
                break;
            case 453:
                entity.numberColors = curr.value;
                break;
            case 460:
                entity.rotationAngle = curr.value;
                break;
            case 461:
                entity.gradientDefinition = curr.value;
                break;
            default: // ignored attribute
                if (!helpers.checkCommonEntityProperties(entity, curr)) {
                    if (curr.code === 92) {
                        entity.boundaryPath.type = BoundaryPathTypes[curr.value];
                    }
                }
                break;
        }
        curr = scanner.next();
    }
    return entity;
};