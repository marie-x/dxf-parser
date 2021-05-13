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
    6: 'polyline derived',
    7: 'external polyline derived',
    22: 'polyline derived outermost'
};

var EdgeTypes = {
    1: 'line',
    2: 'arc',
    3: 'ellipse',
    4: 'spline', // Lord, have mercy on our souls
}

EntityParser.prototype.parseEntity = function (scanner, curr) {
    var entity = {
        type: curr.value,
        elevationPoint: { x: null, y: null, z: null },
        extrusionDirection: { x: null, y: null, z: null },
    };

    curr = scanner.next();
    while (curr !== 'EOF') {
        if (curr.code === 0) break;

        switch (curr.code) {
            case 5:
                break;
            case 330:
                break;
            case 100:
                // subclass marker
                break;
            case 10:
                // elevation point x
                entity.elevationPoint.x = curr.value;
                break;
            case 20:
                // y value of elevation
                entity.elevationPoint.y = curr.value;
                break;
            case 30:
                // z value of elevation
                entity.elevationPoint.z = curr.value;
                break;
            case 210:
                // extrusion direction x
                entity.extrusionDirection.x = curr.value;
                break;
            case 220:
                // extrusion direction y
                entity.extrusionDirection.y = curr.value;
                break;
            case 230:
                // extrusion direction z
                entity.extrusionDirection.z = curr.value;
                break;
            case 2:
                entity.hatchPatternName = curr.value;
                break;
            case 70:
                // Solid fill flag (0 = pattern fill; 1 = solid fill); for MPolygon, the version of MPolygon
                entity.solidFlag = curr.value;
                break;
            case 71:
                // Associativity flag (0 = non-associative; 1 = associative); for MPolygon, solid-fill flag (0 = lacks solid fill; 1 = has solid fill)
                entity.associativityFlag = curr.value;
                break;
            case 91:
                entity.boundaryPaths = new Array(curr.value);
                break;
            case 75:
                // Hatch style:
                // 0 = Hatch “odd parity” area(Normal style)
                // 1 = Hatch outermost area only(Outer style)
                // 2 = Hatch through entire area(Ignore style)
                entity.hatchStyle = curr.value
                break;
            case 76:
                // Hatch pattern type:
                // 0 = User-defined
                // 1 = Predefined
                // 2 = Custom
                entity.hatchPatternType = curr.value;
                break;
            case 52:
                // pattern fill only
                entity.hatchPatternAngle = curr.value; // degrees or radians?
                break;
            case 41:
                // pattern fill only
                entity.hatchPatternScale = curr.value;
                break;
            case 73:
                entity.boundaryAnnotationFlag = curr.value;
                break;
            case 77:
                entity.hatchPatternDoubleFlag = curr.value;
                break;
            case 78:
                entity.patternDefinitionLines = new Array(curr.value);
                break;
            case 47:
                entity.pixelSize = curr.value;
                break;
            case 98:
                entity.seedPoints = new Array(curr.value);
                break;
            case 450:
                // if code 450 is in the file, then the following codes must be in the file: 451, 452, 453, 460, 461, 462, and 470. If code 450 is not in the file, then the following codes must not be in the file: 451, 452, 453, 460, 461, 462, and 470
                // 0 = Solid hatch
                // 1 = Gradient
                entity.gradient = { isSingleColor: null, numberColors: null, rotationAngle: null, definition: null, tint: null, type: null }
                break;
            case 451:
                // reserved for future use
                break;
            case 470:
                entity.gradient.type = curr.value;
                break;
            case 452:
                entity.gradient.isSingleColor = curr.value;
                break;
            case 453:
                entity.gradient.numberColors = curr.value;
                break;
            case 460:
                entity.gradient.rotationAngle = curr.value; // radians
                break;
            case 461:
                entity.gradient.definition = curr.value;
                break;
            case 462:
                entity.gradient.tint = curr.value;
                break;
            case 8:
                // Always 'A-ANNO-NOTES
                break;
            case 1001:
                // always "ACAD" or "AcDbBlockRepETag" TODO: could this be a start/stop code?
                break;
            case 1071:
                console.log(`Counter? ${curr.value}`);
                break;
            default:
                console.log(`${curr.code} = ${curr.value}`);
                break;
        }
        // if (entity.numberOfSeedPoints && entity.numberOfSeedPoints > 0) {
        //     console.log('End Seed Points')
        // }

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
