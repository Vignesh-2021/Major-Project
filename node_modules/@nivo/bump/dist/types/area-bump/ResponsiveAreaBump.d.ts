/// <reference types="react" />
import { AreaBumpDatum, AreaBumpSerieExtraProps, AreaBumpSvgProps, DefaultAreaBumpDatum } from './types';
export declare const ResponsiveAreaBump: <Datum extends AreaBumpDatum = DefaultAreaBumpDatum, ExtraProps extends AreaBumpSerieExtraProps = Record<string, unknown>>(props: Omit<AreaBumpSvgProps<Datum, ExtraProps>, "height" | "width">) => JSX.Element;
//# sourceMappingURL=ResponsiveAreaBump.d.ts.map