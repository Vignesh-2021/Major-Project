/// <reference types="react" />
import { Margin } from '@nivo/core';
import { BumpCommonProps, BumpDatum, BumpPoint, BumpPointMouseHandler, BumpSerieExtraProps } from './types';
interface MeshProps<Datum extends BumpDatum, ExtraProps extends BumpSerieExtraProps> {
    points: BumpPoint<Datum, ExtraProps>[];
    width: number;
    height: number;
    margin: Margin;
    setActivePointIds: (ids: string[]) => void;
    setActiveSerieIds: (ids: string[]) => void;
    onMouseEnter?: BumpPointMouseHandler<Datum, ExtraProps>;
    onMouseMove?: BumpPointMouseHandler<Datum, ExtraProps>;
    onMouseLeave?: BumpPointMouseHandler<Datum, ExtraProps>;
    onClick?: BumpPointMouseHandler<Datum, ExtraProps>;
    tooltip: BumpCommonProps<Datum, ExtraProps>['pointTooltip'];
    debug: boolean;
}
export declare const Mesh: <Datum extends BumpDatum, ExtraProps extends BumpSerieExtraProps>({ points, width, height, margin, setActivePointIds, setActiveSerieIds, onMouseEnter, onMouseMove, onMouseLeave, onClick, tooltip, debug, }: MeshProps<Datum, ExtraProps>) => JSX.Element;
export {};
//# sourceMappingURL=Mesh.d.ts.map