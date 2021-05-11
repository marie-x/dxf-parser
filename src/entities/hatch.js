
import * as helpers from '../ParseHelpers'

export default function EntityParser() { }

EntityParser.ForEntityName = 'HATCH';

var BoundaryPathTypes = {
    0: 'default',
    1: 'external',
    2: 'polyline',
    4: 'derived',
    8: 'textbox',
    16: 'outermost',
};

var EdgeTypes = {
    1: 'line',
    2: 'arc',
    3: 'ellipse',
    4: 'spline', // Lord, have mercy on our souls
}

EntityParser.prototype.parseEntity = function (scanner, curr) {
    console.log('EntityParser.prototype.parseEntity HATCH')
    // console.log(curr)
    var entity = {
        type: curr.value,
        elevationPoint: { x: null, y: null, z: null },
        extrusionDirection: { x: null, y: null, z: null }
    };

    curr = scanner.next();
    while (curr !== 'EOF') {
        if (curr.code === 0) break;

        switch (curr.code) {
            // this is eating subsequent 10s and 20s
            // case 10:
            //     entity.elevationPoint.x = curr.value;
            //     break;
            // case 20:
            //     entity.elevationPoint.y = curr.value;
            //     break;
            // case 10:
            //     entity.elevationPoint.z = curr.value;
            //     break;
            case 210:
                entity.extrusionDirection.x = curr.value;
                break;
            case 220:
                entity.extrusionDirection.y = curr.value;
                break;
            case 230:
                entity.extrusionDirection.z = curr.value;
                break;
            case 2:
                entity.hatchPatternName = curr.value;
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
                entity.numPaths = curr.value;
                break;
            // case 75:
            //     // entity.hatchStyle = curr.value;
            //     // break;
            // case 76:
            //     // entity.hatchPatternType = curr.value;
            //     // break;
            // case 52:
            //     // entity.hatchPatternAngle = curr.value;
            //     // break;
            // case 41:
            //     // entity.hatchPatternScale = curr.value;
            //     // break;
            // case 47:
            //     // entity.pixelSize = curr.value;
            //     // break;
            // case 98:
            //     // entity.seedPoints = curr.value;
            //     // break;
            // case 11:
            //     // entity.offsetVector = curr.value;
            //     // break;
            // case 99:
            //     // // this should probably be in boundary path data
            //     // entity.numDegeneratePaths = curr.value;
            //     // break;
            // case 10:
            //     // entity.seedPoint = helpers.parsePoint(scanner);
            //     // break;
            // case 450:
            //     // entity.solidHatchOrGradient = curr.value;
            //     // break;
            // case 451:
            //     //  -- reserved for future use
            //     // break;
            // case 452:
            //     // entity.howColorsUsed = curr.value;
            //     // break;
            // case 453:
            //     // entity.numberColors = curr.value;
            //     // break;
            // case 460:
            //     // entity.rotationAngle = curr.value;
            //     // break;
            // case 461:
            //     // entity.gradientDefinition = curr.value;
            //     // break;
            // case 462:
            // case 463:
            // case 470:
            //     break;
            default: // ignored attribute
                if (!helpers.checkCommonEntityProperties(entity, curr)) {
                    if (curr.code === 92) {
                        entity.boundaryPathData = {
                            type: BoundaryPathTypes[curr.value],
                        }
                        curr = scanner.next();
                    } else {
                        entity.boundaryPathData = parseBoundaryPaths(entity, curr);
                    }
                }
                break;
        }
        curr = scanner.next();
    }
    console.log(entity)
    return entity;
};

export function parseBoundaryPaths(entity, curr) {
    var paths = [];
    var numPaths = 0;
    if (!entity.numPaths || entity.numPaths === 0) {
        return false;
    }
    var boundaryPathData = entity.boundaryPathData;
    if (boundaryPathData.type === 'polyline') {
        console.log('Handle polyline boundary data. Barf.')
    } else {
        switch (curr.code) {
            case 93:
                boundaryPathData.numEdges = curr.value;
                break;
            case 72:
                boundaryPathData.edgeType = EdgeTypes[curr.value];
                break;
            default:
                console.log(`unahandled boundaryPath code ${curr.code}`)
                break;
        }
    }

    // var boundaryPaths = { type: null};
    // var edgeTypeData;
    //     // Handle everything but polylines
    //     switch(curr.code) {
    //         case 92:
    //             boundaryPaths.type = BoundaryPathTypes[curr.value]
    //         case 93:
    //             boundaryPaths.numEdges = curr.value;
    //             break;
    //         case 72:
    //             boundaryPaths.edgeType = EdgeTypes[curr.value];
    //             break;
    //         case 97:
    //             boundaryPaths.numSourceObjects = curr.value;
    //             break;
    //         case 330:
    //             // console.log(curr.value)
    //             break;
    //         default:
    //             edgeTypeData = processEdgeType(entity, curr) 
    //             console.log(edgeTypeData)
    //             // console.log(`unexpected code: ${curr.code} value: ${curr.value}`);
    //             break;
    //     }
    // }
    // boundaryPaths.edgeTypeData = edgeTypeData
    return boundaryPathData;
}

function processEdgeType(entity, curr) {
    var numEdges = entity.boundaryPaths.numEdges
    console.log(`Processing edgeType = ${entity.boundaryPaths.edgeType}`)
    var edges = [];
    switch (entity.boundaryPaths.edgeType) {
        case 'line':
            if (edges.length < numEdges) {
                switch (curr.code) {
                    case 10:
                        var startPoint = helpers.parsePoint(scanner);
                        break;
                    case 20:
                        var endPoint = helpers.parsePoint(scanner)
                        var edge = { startPoint, endPoint }
                        edges.push(edge)
                        break;
                    default:
                        console.log(`unexpected linear edge type code ${curr.code}`)
                        break;
                }
            }
            break;
        case 'arc':
            console.log('Procress arc edgeType');
            break;
        case 'ellipse':
            console.log('Process ellipse edgeType');
            break;
        case 'spline':
            console.log('Process spline edgeType');
            break;
        default:
            console.log(`Unkown edgeType ${entity.boundaryPaths.edgeType}`)
            break;
    }
    return edges;
}
