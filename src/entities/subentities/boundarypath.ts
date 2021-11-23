// import DxfArrayScanner, { IGroup } from '../../DxfArrayScanner';
// import * as helpers from '../../ParseHelpers';
import DxfArrayScanner, { IGroup } from 'src/DxfArrayScanner';
import IGeometry, { IEntity } from '../geomtry';

enum EdgeType {
    line = 1,
    circle = 2,
    arc = 3,
    spline = 4,
}

export interface IBoundaryPath extends IEntity {
    isPolyline: boolean,
    pathData?: object, // Only for polylines
    numEdges?: number, // Only if not polyline
    edgeType?: EdgeType,
    edgeTypeData?: object,
    numSourceObjects: number,
    sourceObjectReference: object,
}

export default class BoundaryPath implements IGeometry {
    public ForEntityName = 'BOUNDARYPATH' as const;
    public parseEntity(scanner: DxfArrayScanner, curr: IGroup) {
		const entity = { type: curr.value } as IBoundaryPath;
        console.log(scanner)
        console.log(curr)
        return entity
    }
}