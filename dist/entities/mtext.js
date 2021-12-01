import * as helpers from '../ParseHelpers';
export default class Mtext {
    ForEntityName = 'MTEXT';
    parseEntity(scanner, curr) {
        const entity = { type: curr.value };
        curr = scanner.next();
        while (!scanner.isEOF()) {
            if (curr.code === 0)
                break;
            switch (curr.code) {
                case 3:
                    entity.text ? entity.text += curr.value : entity.text = curr.value;
                    break;
                case 1:
                    entity.text ? entity.text += curr.value : entity.text = curr.value;
                    break;
                case 10:
                    entity.position = helpers.parsePoint(scanner);
                    break;
                case 11:
                    entity.directionVector = helpers.parsePoint(scanner);
                    break;
                case 40:
                    //Note: this is the text height
                    entity.height = curr.value;
                    break;
                case 41:
                    entity.width = curr.value;
                    break;
                case 50:
                    entity.rotation = curr.value;
                    break;
                case 71:
                    entity.attachmentPoint = curr.value;
                    break;
                case 72:
                    entity.drawingDirection = curr.value;
                    break;
                case 7:
                    entity.styleName = curr.value;
                    break;
                case 90:
                    // Background fill setting:
                    // 0 = Background fill off
                    // 1 = Use background fill color
                    // 2 = Use drawing window color as background fill color
                    entity.backgroundFill = curr.value;
                    break;
                case 63:
                    entity.backgroundFillColor = curr.value;
                    break;
                default:
                    helpers.checkCommonEntityProperties(entity, curr, scanner);
                    break;
            }
            curr = scanner.next();
        }
        return entity;
    }
}
