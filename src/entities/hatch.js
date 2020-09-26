
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

var EdgeTypes = {
    1: 'line',
    2: 'circluar-arc',
    3: 'elliptical-arc',
    4: 'spline', // Lord, have mercy on our souls
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
                entity.boundaryPath.numPaths = curr.value;
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
                    // http://help.autodesk.com/view/OARX/2018/ENU/?guid=GUID-DC5215D6-E73F-4DFF-8BE9-01CA9610FAEE
                    if (curr.code === 92) {
                        entity.boundaryPath.type = BoundaryPathTypes[curr.value];
                    }
                    if (entity.boundaryPath.type === BoundaryPathTypes[2]) {
                        console.log('Processing attributes of HATCH POLYLINE. Fuck you.')
                        entity.boundaryPath.vertexLocation = {x: null, y: null}
                        entity.boundaryPath.bulge = 0;
                        switch (curr.code) {
                            case 72:
                                entity.boundaryPath.hasBulge = curr.value;
                                break;
                            case 73:
                                entity.boundaryPath.isClosed = curr.value;
                                break;
                            case 93:
                                entity.boundaryPath.numVertices = curr.value;
                                break;
                            case 10:
                                entity.boundaryPath.vertexLocation.x = curr.value;
                                break;
                            case 20:
                                entity.boundaryPath.vertexLocation.y = curr.value;
                                break;
                            case 42:
                                entity.boundaryPath.bulge = curr.value;
                                break;
                            default:
                                console.log('Some shit we do not know how to handle in a HATCH POLYLINE. (Fuck you)^2')
                                break;
                        }
                    } else if (entity.boundaryPath.type !== BoundaryPathTypes[2]) {
                        switch (curr.code) {
                            case 93:
                                entity.boundaryPath.numEdges = curr.value;
                                break;
                            case 72:
                                entity.boundaryPath.edgeType = EdgeTypes[curr.value];
                                break;
                            case 97:
                                entity.boundaryPath.numSourceObjects = curr.value;
                                break;
                            case 330:
                                entity.boundaryPath.sourceObjects = curr.value; // going to need to write a function to parse this
                                break;
                            default:
                                // Edge data group codes based on edge type
                                switch (entity.boundaryPath.edgeType) {
                                    case 'line':
                                        entity.boundaryPath.edgeData = {
                                            startPoint: {x: null, y: null},
                                            endPoint: {x: null, y: null},
                                        }
                                        switch(curr.code) {
                                            case 10:
                                                entity.boundaryPath.edgeData.startPoint.x = curr.value;
                                                break;
                                            case 20:
                                                entity.boundaryPath.edgeData.startPoint.y = curr.value;
                                                break;
                                            case 11:
                                                entity.boundaryPath.edgeData.endPoint.x = curr.value;
                                                break;
                                            case 21:
                                                entity.boundaryPath.edgeData.endPoint.y = curr.value;
                                                break;
                                        }
                                    default:
                                        console.log('HATCH not polyline with edgeType !== line. Deal later.')
                                        break;
                                }
                        }
                    }
                }
                break;
        }
        curr = scanner.next();
    }
    return entity;
};