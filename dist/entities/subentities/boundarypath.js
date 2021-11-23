var EdgeType;
(function (EdgeType) {
    EdgeType[EdgeType["line"] = 1] = "line";
    EdgeType[EdgeType["circle"] = 2] = "circle";
    EdgeType[EdgeType["arc"] = 3] = "arc";
    EdgeType[EdgeType["spline"] = 4] = "spline";
})(EdgeType || (EdgeType = {}));
export default class BoundaryPath {
    ForEntityName = 'BOUNDARYPATH';
    parseEntity(scanner, curr) {
        const entity = { type: curr.value };
        console.log(scanner);
        console.log(curr);
        return entity;
    }
}
