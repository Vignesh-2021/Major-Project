/// <reference types="react" />
import { Line as D3Line } from 'd3-shape';
import { BumpCommonProps, BumpComputedSerie, BumpDatum, BumpSerieExtraProps, BumpSerieMouseHandler } from './types';
interface LineProps<Datum extends BumpDatum, ExtraProps extends BumpSerieExtraProps> {
    serie: BumpComputedSerie<Datum, ExtraProps>;
    lineGenerator: D3Line<[number, number | null]>;
    yStep: number;
    isInteractive: BumpCommonProps<Datum, ExtraProps>['isInteractive'];
    onMouseEnter?: BumpSerieMouseHandler<Datum, ExtraProps>;
    onMouseMove?: BumpSerieMouseHandler<Datum, ExtraProps>;
    onMouseLeave?: BumpSerieMouseHandler<Datum, ExtraProps>;
    onClick?: BumpSerieMouseHandler<Datum, ExtraProps>;
    setActiveSerieIds: (serieIds: string[]) => void;
    lineTooltip: BumpCommonProps<Datum, ExtraProps>['lineTooltip'];
    useMesh: BumpCommonProps<Datum, ExtraProps>['useMesh'];
}
export declare const Line: <Datum extends BumpDatum, ExtraProps extends BumpSerieExtraProps>({ serie, lineGenerator, yStep, isInteractive, onMouseEnter, onMouseMove, onMouseLeave, onClick, setActiveSerieIds, lineTooltip, useMesh, }: LineProps<Datum, ExtraProps>) => JSX.Element;
export {};
//# sourceMappingURL=Line.d.ts.map