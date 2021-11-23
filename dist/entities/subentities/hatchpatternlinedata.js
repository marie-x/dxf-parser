export default class HatchPatternLineData {
    ForEntityName = 'BOUNDARYPATH';
    parseEntity(scanner, curr) {
        const entity = { type: curr.value };
        console.log(scanner);
        console.log(curr);
        return entity;
    }
}
