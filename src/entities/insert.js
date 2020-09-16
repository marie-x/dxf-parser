
import * as helpers from '../ParseHelpers'

export default function EntityParser() {}

EntityParser.ForEntityName = 'INSERT';

EntityParser.prototype.parseEntity = function(scanner, curr) {
    var entity;
    entity = { type: curr.value };
    curr = scanner.next();
    while(curr !== 'EOF') {
        if(curr.code === 0) break;

        switch(curr.code) {
            case 2:
                entity.name = curr.value;
                break;
            case 41:
                entity.xScale = curr.value;
                break;
            case 42:
                entity.yScale = curr.value;
                break;
            case 43:
                entity.zScale = curr.value;
                break;
            case 10:
                entity.position = helpers.parsePoint(scanner);
                break;
            case 20:
                entity.insertionPointY = curr.value;
                break;
            case 30:
                entity.insertionPointZ = curr.value;
                break;
            case 41:
                entity.xScale = curr.value;
                break;
            case 42:
                entity.yScale = curr.value;
                break;
            case 43:
                entity.zScale = curr.value;
                break;
            case 50:
                entity.rotation = curr.value;
                break;
            case 66:
                // Variable attributes-follow flag (optional; default = 0); if the value of attributes-follow flag is 1, 
                // a series of attribute entities is expected to follow the insert, terminated by a seqend entity
                entity.attributesFollow = curr.value;
                break;
            case 70:
                entity.columnCount = curr.value;
                break;
            case 71:
                entity.rowCount = curr.value;
                break;
            case 44:
                entity.columnSpacing = curr.value;
                break;
            case 45:
                entity.rowSpacing = curr.value;
                break;
            case 210:
                entity.extrusionDirection = helpers.parsePoint(scanner);
                break;
            default: // check common entity attributes
                helpers.checkCommonEntityProperties(entity, curr);
                break;
        }
        curr = scanner.next();
    }

    return entity;
};


