import { IEntity } from 'src';
import DxfArrayScanner, {IGroup} from '../../DxfArrayScanner';
import IGeometry, {IPoint} from '../geomtry';
// import * as helpers from '../../ParseHelpers';
// import { ILayer } from 'src';

export interface IHatchPatternLineData extends IEntity {
    lineAngle: number, // Code: 53
    basePoint: IPoint, // Codes: 43, 44
    offset: IPoint, // Codes: 45, 46
    numDashLengthItems: number, // Code: 79
    dashLength: object, // Code: 49. Might be array?

}

export default class HatchPatternLineData implements IGeometry {
    public ForEntityName = 'BOUNDARYPATH' as const;
    public parseEntity(scanner: DxfArrayScanner, curr: IGroup) {
		const entity = { type: curr.value } as IHatchPatternLineData;
        console.log(scanner)
        console.log(curr)
        return entity
    }
    // public parseEntity(scanner: DxfArrayScanner, curr: IGroup) {
	// 	const entity = { type: curr.value } as IHatchPatternLineData;
    //     curr = scanner.next();
	// 	while (!scanner.isEOF()) {
    //         if(curr.code === 0) break;

    //         switch(curr.code) {
    //             case 53:
    //                 entity.lineAngle = curr.value as number;
    //                 break;
    //             case 43:
    //                 entity.basePoint = helpers.parsePoint(scanner);
    //                 break;
    //             case 45:
    //                 entity.offset = helpers.parsePoint(scanner);
    //                 break;
    //             case 79:
    //                 entity.numDashLengthItems = curr.value as number;
    //                 break;
    //             case 49:
    //                 entity.dashLength = curr.value as object; // Not clear this should be an object. See interface.
    //                 break;
    //             default:
    //                 console.error(`Unknown HatchPatterLineData code ${curr.code}`)
    //                 break;
    //         }
    //     }
    }
