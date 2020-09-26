import AUTO_CAD_COLOR_INDEX from './AutoCadColorIndex';

/**
 * Returns the truecolor value of the given AutoCad color index value
 * @return {Number} truecolor value as a number
 */
export function getAcadColor(index) {
	return AUTO_CAD_COLOR_INDEX[index];
}

/**
 * Parses the 2D or 3D coordinate, vector, or point. When complete,
 * the scanner remains on the last group of the coordinate.
 * @param {*} scanner 
 */
export function parsePoint(scanner) {
    var point = {};

    // Reread group for the first coordinate
    scanner.rewind();
    var curr = scanner.next();

    var code = curr.code;
    point.x = curr.value;

    code += 10;
    curr = scanner.next();
    if(curr.code != code)
        throw new Error('Expected code for point value to be ' + code +
        ' but got ' + curr.code + '.');
    point.y = curr.value;

    code += 10;
    curr = scanner.next();
    if(curr.code != code)
    {
        // Only the x and y are specified. Don't read z.
        scanner.rewind(); // Let the calling code advance off the point
        return point;
    }
    point.z = curr.value;
    
    return point;
};

export function parseBoundaryPaths(scanner, current, entity) {
    // console.log(scanner)
    // console.log(entity.boundaryPaths)
    if (!entity.boundaryPaths.numPaths || entity.boundaryPaths.numPaths === 0) {
        console.log('Not a boundary path')
        console.log(current)
    }
    var EdgeTypes = {
        1: 'line',
        2: 'arc',
        3: 'ellipse',
        4: 'spline', // Lord, have mercy on our souls
    }
    var boundaryPath = entity.boundaryPath;



  // http://help.autodesk.com/view/OARX/2018/ENU/?guid=GUID-DC5215D6-E73F-4DFF-8BE9-01CA9610FAEE
                    // if (curr.code === 92) {
                    //     entity.boundaryPath.type = BoundaryPathTypes[curr.value];
                    // }
                    // if (entity.boundaryPath.type === BoundaryPathTypes[2]) {
                    //     console.log('Processing attributes of HATCH POLYLINE. Fuck you.')
                    //     entity.boundaryPath.vertexLocation = {x: null, y: null}
                    //     entity.boundaryPath.bulge = 0;
                    //     switch (curr.code) {
                    //         case 72:
                    //             entity.boundaryPath.hasBulge = curr.value;
                    //             break;
                    //         case 73:
                    //             entity.boundaryPath.isClosed = curr.value;
                    //             break;
                    //         case 93:
                    //             entity.boundaryPath.numVertices = curr.value;
                    //             break;
                    //         case 10:
                    //             entity.boundaryPath.vertexLocation.x = curr.value;
                    //             break;
                    //         case 20:
                    //             entity.boundaryPath.vertexLocation.y = curr.value;
                    //             break;
                    //         case 42:
                    //             entity.boundaryPath.bulge = curr.value;
                    //             break;
                    //         default:
                    //             console.log('Some shit we do not know how to handle in a HATCH POLYLINE. (Fuck you)^2')
                    //             break;
                    //     }
                    // } else if (entity.boundaryPath.type !== BoundaryPathTypes[2]) {
                    //     switch (curr.code) {
                    //         case 93:
                    //             entity.boundaryPath.numEdges = curr.value;
                    //             break;
                    //         case 72:
                    //             entity.boundaryPath.edgeType = EdgeTypes[curr.value];
                    //             break;
                    //         case 97:
                    //             entity.boundaryPath.numSourceObjects = curr.value;
                    //             break;
                    //         case 330:
                    //             entity.boundaryPath.sourceObjects = curr.value; // going to need to write a function to parse this
                    //             break;
                    //         default:
                    //             console.log(curr)
                                // Edge data group codes based on edge type
                                // switch (entity.boundaryPath.edgeType) {
                                //     case 'line':
                                //         console.log('This is a HATCH with LINE edgeType')
                                //         console.log(curr)
                                //         // entity.boundaryPath.edgeData = {}
                                //         // switch(curr.code) {
                                //         //     case 10:
                                //                 // console.log(`startPoint.x = ${curr.value}`)
                                //                 // entity.boundaryPath.edgeData.startPoint = helpers.parsePoint(scanner);
                                //                 // break;
                                //             // case 20:
                                //             //     entity.boundaryPath.edgeData.startPoint.y = curr.value;
                                //             //     break;
                                //             // case 11:
                                //             //     entity.boundaryPath.edgeData.endPoint = helpers.parsePoint(scanner);
                                //             //     break;
                                //             // case 21:
                                //             //     entity.boundaryPath.edgeData.endPoint.y = curr.value;
                                //             //     break;
                                //         }
                                    // could be smarter about handling shared attributes of arc and ellipse. not feeling smart.
                                    // case 'arc':
                                    //     // This is showing up for line. WTF?
                                    //     entity.boundaryPath.centerPoint = {
                                    //         x: null,
                                    //         y: null,
                                    //     }
                                    //     switch(curr.code) {
                                    //         case 10:
                                    //             entity.boundaryPath.centerPoint.x = curr.value;
                                    //             break;
                                    //         case 20:
                                    //             entity.boundaryPath.centerPoint.y = curr.value;
                                    //             break;
                                    //         case 40:
                                    //             entity.boundaryPath.radius = curr.value;
                                    //             break;
                                    //         case 50:
                                    //             entity.boundaryPath.startAngle = curr.value;
                                    //             break;
                                    //         case 51:
                                    //             entity.boundaryPath.endAngle = curr.value;
                                    //             break;
                                    //         case 73:
                                    //             entity.boundaryPath.isCounterClockwise = curr.value;
                                    //             break;
                                    //         default:
                                    //             console.log(`Unknown code for HATCH with edge type of ARC code: ${curr.code} value: ${JSON.stringify(curr.value)}`)
                                    //             break;
                                    //     }
                                    // case 'ellipse':
                                    //     entity.boundaryPath.centerPoint = {
                                    //         x: null,
                                    //         y: null,
                                    //     }
                                    //     entity.boundaryPath.endPoint = {
                                    //         x: null,
                                    //         y: null,
                                    //     }
                                    //     switch(curr.code) {
                                    //         case 10:
                                    //             entity.boundaryPath.centerPoint.x = curr.value;
                                    //             break;
                                    //         case 20:
                                    //             entity.boundaryPath.centerPoint.y = curr.value;
                                    //             break;
                                    //         case 11:
                                    //             entity.boundaryPath.endPoint.x = curr.value;
                                    //             break;
                                    //         case 21:
                                    //             entity.boundaryPath.endPoint.y = curr.value;
                                    //             break;
                                    //         case 40:
                                    //             entity.boundaryPath.minorAxisLength = curr.value;
                                    //             break;
                                    //         case 50:
                                    //             entity.boundaryPath.startAngle = curr.value;
                                    //             break;
                                    //         case 51:
                                    //             entity.boundaryPath.endAngle = curr.value;
                                    //             break;
                                    //         case 73:
                                    //             entity.boundaryPath.isCounterClockwise = curr.value;
                                    //             break;
                                    //         default:
                                    //             console.log(`Unknown code for HATCH with edge type of ELLIPSE code: ${curr.code} value: curr.value)`)
                                    //             break;
                                    //     }
                                    // case 'spline':
                                    //     entity.boundaryPath.controlPoint = {
                                    //         x: null,
                                    //         y: null,
                                    //     }
                                    //     entity.boundaryPath.fitDatum = {
                                    //         x: null,
                                    //         y: null,
                                    //     }
                                    //     entity.boundaryPath.startTangent = {
                                    //         x: null,
                                    //         y: null,
                                    //     }
                                    //     entity.boundaryPath.endTangent = {
                                    //         x: null,
                                    //         y: null,
                                    //     }
                                    //     switch (curr.code) {
                                    //         case 94:
                                    //             entity.boundaryPath.degree = curr.value;
                                    //             break;
                                    //         // are the next two bools? if so, rename
                                    //         case 73:
                                    //             entity.boundaryPath.rational = curr.value;
                                    //             break;
                                    //         case 74:
                                    //             entity.boundaryPath.periodic = curr.value;
                                    //             break;
                                    //         case 95:
                                    //             entity.boundaryPath.numKnots = curr.value;
                                    //             break;
                                    //         case 96:
                                    //             entity.boundaryPath.numControlPoints = curr.value;
                                    //             break;
                                    //         case 40:
                                    //             entity.boundaryPath.knotValues = curr.value; // there are multiple. need to parse
                                    //             break;
                                    //         case 10:
                                    //             entity.boundaryPath.controlPoint.x = curr.value;
                                    //             break;
                                    //         case 20:
                                    //             entity.boundaryPath.controlPoint.y = curr.value;
                                    //             break;
                                    //         case 42:
                                    //             entity.boundaryPath.weights = curr.value;
                                    //             break;
                                    //         case 97:
                                    //             entity.boundaryPath.numFitData = curr.value;
                                    //             break;
                                    //         case 11:
                                    //             entity.boundaryPath.fitDatum.x = curr.value;
                                    //             break;
                                    //         case 21:
                                    //             entity.boundaryPath.fitDatum.y = curr.value;
                                    //             break;
                                    //         case 12:
                                    //             entity.boundaryPath.startTangent.x = curr.value;
                                    //             break;
                                    //         case 22:
                                    //             entity.boundaryPath.startTangent.y = curr.value;
                                    //             break;
                                    //         case 13:
                                    //             entity.boundaryPath.endTangent.x = curr.value;
                                    //             break;
                                    //         case 23:
                                    //             entity.boundaryPath.endTangent.y = curr.value;
                                    //             break;                                            
                                    //         default:
                                    //             console.log(`Unknown code for HATCH with edge type of SPLINE code: ${curr.code} value: ${JSON.stringify(curr.value)}`)
                                    //             break;                                                
                                    //     }
                                    // default:
                                    //     console.log(`HATCH not polyline with edgeType ${entity.boundaryPath.edgeType}. Deal later.`)
                                    //     break;
                                // }
                        // }
                    // }
}

/**
 * Attempts to parse codes common to all entities. Returns true if the group
 * was handled by this function.
 * @param {*} entity - the entity currently being parsed 
 * @param {*} curr - the current group being parsed
 */
export function checkCommonEntityProperties(entity, curr) {
    switch(curr.code) {
        case 0:
            entity.type = curr.value;
            break;
        case 5:
            entity.handle = curr.value;
            break;
        case 6:
            entity.lineType = curr.value;
            break;
        case 8: // Layer name
            entity.layer = curr.value;
            break;
        case 48:
            entity.lineTypeScale = curr.value;
            break;
        case 60:
            entity.visible = curr.value === 0;
            break;
        case 62: // Acad Index Color. 0 inherits ByBlock. 256 inherits ByLayer. Default is bylayer
            entity.colorIndex = curr.value;
            entity.color = getAcadColor(Math.abs(curr.value));
            break;
        case 67:
            entity.inPaperSpace = curr.value !== 0;
            break;
        case 100:
            //ignore
            break;
        case 330:
            entity.ownerHandle = curr.value;
            break;
        case 347:
            entity.materialObjectHandle = curr.value;
            break;
        case 370:
            //From https://www.woutware.com/Forum/Topic/955/lineweight?returnUrl=%2FForum%2FUserPosts%3FuserId%3D478262319
            // An integer representing 100th of mm, must be one of the following values:
            // 0, 5, 9, 13, 15, 18, 20, 25, 30, 35, 40, 50, 53, 60, 70, 80, 90, 100, 106, 120, 140, 158, 200, 211.
            // -3 = STANDARD, -2 = BYLAYER, -1 = BYBLOCK
            entity.lineweight = curr.value;
            break;
        case 420: // TrueColor Color
            entity.color = curr.value;
            break;
        case 1000: 
            entity.extendedData = entity.extendedData || {};
            entity.extendedData.customStrings = entity.extendedData.customStrings || []; 
            entity.extendedData.customStrings.push(curr.value);
            break;
        case 1001: 
            entity.extendedData = entity.extendedData || {};
            entity.extendedData.applicationName = curr.value;
            break;
        default:
            return false;
    }
    return true;
};
