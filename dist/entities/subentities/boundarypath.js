import * as helpers from '../../ParseHelpers';
var EdgeType;
(function (EdgeType) {
    EdgeType[EdgeType["line"] = 1] = "line";
    EdgeType[EdgeType["circle"] = 2] = "circle";
    EdgeType[EdgeType["arc"] = 3] = "arc";
    EdgeType[EdgeType["spline"] = 4] = "spline";
})(EdgeType || (EdgeType = {}));
var BoundaryPathType;
(function (BoundaryPathType) {
    BoundaryPathType[BoundaryPathType["notBoundaryPath"] = -1] = "notBoundaryPath";
    BoundaryPathType[BoundaryPathType["default"] = 0] = "default";
    BoundaryPathType[BoundaryPathType["external"] = 1] = "external";
    BoundaryPathType[BoundaryPathType["polyline"] = 2] = "polyline";
    BoundaryPathType[BoundaryPathType["derived"] = 4] = "derived";
    BoundaryPathType[BoundaryPathType["textbox"] = 8] = "textbox";
    BoundaryPathType[BoundaryPathType["outermost"] = 16] = "outermost";
})(BoundaryPathType || (BoundaryPathType = {}));
export default class BoundaryPath {
    ForEntityName = 'BOUNDARYPATH';
    // FIXME: this should be the thing we use to build the boundary paths. parseBoundaryPaths is a hack. KR 2021.12.01
    parseEntity(scanner, curr) {
        const entity = { isPolyline: false, numSourceObjects: 0, sourceObjectReference: {} };
        curr = scanner.next();
        while (!scanner.isEOF()) {
            if (curr.code === 0)
                break;
            switch (curr.code) {
                case 92:
                    // this never seems to happen, at least in Saigon. KR 2021.11.30
                    entity.boundaryPathType = curr.value;
                    break;
                case 93:
                    entity.isPolyline = false;
                    entity.numEdges = curr.value;
                    break;
                case 72:
                    entity.edgeType = curr.value;
                    break;
                case 97:
                    entity.numSourceObjects = curr.value;
                    break;
                case 330:
                    // entity.sourceObjectReference = curr.value as object;
                    // entity.sourceObjectReference.push({ info: 'This is a sourceObjectReference'});
                    break;
                default:
                    if (!helpers.checkCommonEntityProperties(entity, curr, scanner)) {
                        console.log(`Unknown boundaryPath code ${curr.code}`);
                    }
                    entity.boundaryPathType = -1;
            }
            curr = scanner.next();
        }
        return entity;
    }
}
