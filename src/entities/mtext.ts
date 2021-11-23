
import DxfArrayScanner, { IGroup } from '../DxfArrayScanner';
import * as helpers from '../ParseHelpers'
import IGeometry, { IEntity, IPoint } from './geomtry';

export interface IMtextEntity extends IEntity {
	text: string;
	position: IPoint;
	directionVector: IPoint;
	height: number;
	width: number;
	rotation: number;
	attachmentPoint: number;
	drawingDirection: number;
	styleName: string;
	backgroundFill: number;
	backgroundFillColor: number;
}

export default class Mtext implements IGeometry {
	public ForEntityName = 'MTEXT' as const;
	public parseEntity(scanner: DxfArrayScanner, curr: IGroup) {
		const entity = { type: curr.value } as IMtextEntity;
		curr = scanner.next();
		while (!scanner.isEOF()) {
			if (curr.code === 0) break;

			switch (curr.code) {
				case 3:
					entity.text ? entity.text += curr.value : entity.text = curr.value as string;
					break;
				case 1:
					entity.text ? entity.text += curr.value : entity.text = curr.value as string;
					break;
				case 10:
					entity.position = helpers.parsePoint(scanner);
					break;
				case 11:
					entity.directionVector = helpers.parsePoint(scanner);
					break;
				case 40:
					//Note: this is the text height
					entity.height = curr.value as number;
					break;
				case 41:
					entity.width = curr.value as number;
					break;
				case 50:
					entity.rotation = curr.value as number;
					break;
				case 71:
					entity.attachmentPoint = curr.value as number;
					break;
				case 72:
					entity.drawingDirection = curr.value as number;
					break;
				case 7:
					entity.styleName = curr.value as string;
					break;
				case 90:
					// Background fill setting:
					// 0 = Background fill off
					// 1 = Use background fill color
					// 2 = Use drawing window color as background fill color
					entity.backgroundFill = curr.value as number;
					break;
				case 63:
					entity.backgroundFillColor = curr.value as number;
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
