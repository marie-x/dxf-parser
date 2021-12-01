

import DxfArrayScanner, { IGroup } from '../../DxfArrayScanner';
import * as helpers from '../../ParseHelpers'
import IGeometry, { IEntity } from '../geomtry';

enum EdgeType {
    line = 1,
    circle = 2,
    arc = 3,
    spline = 4,
}

enum BoundaryPathType {
    notBoundaryPath = -1,
    default = 0,
    external = 1,
    polyline = 2,
    derived = 4, // need to handle all derived variants
    textbox = 8,
    outermost = 16,
}

export interface IBoundaryPathEntity extends IEntity {
    boundaryPathType: BoundaryPathType,
    isPolyline: boolean,
    pathData?: object, // Only for polylines
    numEdges?: number, // Only if not polyline
    edgeType?: EdgeType,
    edgeTypeData?: object,
    numSourceObjects: number,
    sourceObjectReference: object[],
}

export default class BoundaryPath implements IGeometry {
    public ForEntityName = 'BOUNDARYPATH' as const;
    // FIXME: this should be the thing we use to build the boundary paths. parseBoundaryPaths is a hack. KR 2021.12.01
    public parseEntity(scanner: DxfArrayScanner, curr: IGroup) {
        const entity = {isPolyline: false, numSourceObjects: 0, sourceObjectReference: {} as object} as IBoundaryPathEntity;
        curr = scanner.next();
        while(!scanner.isEOF()) {
            if (curr.code === 0) break;

            switch(curr.code) {
                case 92:
                    // this never seems to happen, at least in Saigon. KR 2021.11.30
                    entity.boundaryPathType = curr.value as BoundaryPathType;
                    break;
                case 93:
                    entity.isPolyline = false;
                    entity.numEdges = curr.value as number;
                    break;
                case 72:
                    entity.edgeType = curr.value as EdgeType;
                    break;
                case 97:
                    entity.numSourceObjects = curr.value as number;
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
            curr = scanner.next()
        }

        return entity;
    }

    // public parseBoundaryPaths(scanner: DxfArrayScanner, curr: IGroup, numPaths: number) {
    //     const boundaryPaths = [];
    //     for (let i = 0; i < numPaths; i++) {
    //         const path = {isPolyline: false, numSourceObjects: 0, sourceObjectReference: {}} as IBoundaryPathEntity;
    //         while(!scanner.isEOF) {
    //             if (curr.code === 0) break;

    //             curr = scanner.next()
    //             switch (curr.code) {
    //                 case 92:
    //                     console.log(curr);
    //                     throw new Error('We have a boundaryPathType');
    //                     // path.boundaryPathType = curr.value as BoundaryPathType;
    //                     // if (curr.value === 2) { // FIXME: Use enum. KR 2021.12.01
    //                     //     path.isPolyline = true;
    //                     // }
    //                     // break;
    //                 case 93:
    //                     path.numEdges = curr.value as number;
    //                     break;
    //                 case 72:
    //                     path.edgeType = curr.value as EdgeType;
    //                     console.log(`boundaryPath edgeType = ${curr.value}`)
    //                     break;
    //                 case 97:
    //                     path.numSourceObjects = curr.value as number;
    //                     break;
    //                 case 330:
    //                     // entity.sourceObjectReference = curr.value as object;
    //                     path.sourceObjectReference.push({ info: 'This is a sourceObjectReference'});
    //                     break;
    //                 default:                    
    //                     if (!helpers.checkCommonEntityProperties(path, curr, scanner)) {
    //                         console.log(`Unknown boundaryPath code ${curr.code}`);
    //                     }
    //             }
    //         }
    //         boundaryPaths.push(path)
    //     }
    //     curr = scanner.next();
    //     return boundaryPaths;
    // }
}