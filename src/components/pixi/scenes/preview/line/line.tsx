import { bpm } from "@components/pages/preview/chart.tem";
import useDegree from "@hooks/use-degree";
import { Container, Graphics, Text } from "@pixi/react";
import { Vec2 } from "@interfaces/global-type";
import Ease from "@scripts/utils/ease";
import { Container as PContainer, Graphics as PGraphics, LINE_CAP, TextStyle, filters } from "pixi.js";
import { createRef, useCallback, useContext, useEffect, useMemo } from "react";
import { LineProps, PointProps } from './line.d';
import { OptionsContext, TransformerContext } from '../preview';
import Fraction from "fraction.js";
import { usePartial } from "@/hooks/use-partial";
import { LineEvents } from "@/interfaces/chart-data/event/line-events";
import { ChartDotEvent } from "@/scripts/chart-data/event/dot";
import { IDuringEvent } from "@/interfaces/chart-data/event-manager";




function drawBezier(g: PGraphics, from: Vec2, to: Vec2, ease: number) {
    const easeInfo = Ease.getEaseType(ease);
    const y = (to[1] - from[1]);
    const x = (to[0] - from[0]);

    g.bezierCurveTo(
        easeInfo.p0[0] * x + from[0],
        easeInfo.p0[1] * y + from[1],
        easeInfo.p1[0] * x + from[0],
        easeInfo.p1[1] * y + from[1],
        to[0], to[1]
    );
    g.moveTo(to[0], to[1]);
}

const lineBlurFilter = new filters.BlurFilter();

function Point(props: PointProps) {
    const { text, draw, color, graphicsProps } = props;
    let { textStyle } = props;
    const transformer = useContext(TransformerContext);

    textStyle = usePartial(textStyle, new TextStyle({ fill: color }));

    /**
     * @description 判定点绘制的回调
     */
    const drawPoint = useCallback(draw || ((g: PGraphics) => {
        g.clear();
        g.beginFill(color ?? 0xffffff);
        g.drawRect(...transformer.transforms(-.125, -.125, .25, .25));
        g.endFill();
    }), [draw]);

    return <Container {...props}>
        <Text position={[0, transformer.transform(0.5)]}
            text={text}
            style={textStyle}
            anchor={0.5}
            scale={[1, -1]} />
        <Graphics draw={drawPoint} {...graphicsProps} />
    </Container>;
}

export default function Line(props) {
    
    
    return null;
}

// export default function Line(props: LineProps) {
//     const { data, time } = props;
//     const { start, dots, moveXs, moveYs, timings, speed, id, rotates, alphas } = data;

//     const { speed: userSpeed } = useContext(OptionsContext);
//     const transformer = useContext(TransformerContext);

//     const containerRef = createRef<PContainer>();

//     // 时间对应的beat，方便计算
//     const timeBeat = bpm.toBeat(time);

//     function getDuring(evs) {}

//     const during = useMemo(() => {
//         return {
//             dot: getDuring(dots),
//             moveX: getDuring(moveXs),
//             moveY: getDuring(moveYs),
//             rotate: getDuring(rotates),
//             alpha: getDuring(alphas)
//         };
//     }, [data]);


//     const position: Vec2 = useMemo(
//         () => transformer.toGlobal(
//             countSustainAttr(moveXs, during.moveX, 0) + start[0],
//             countSustainAttr(moveYs, during.moveY, 0) + start[1],
//         ),
//         [moveXs, moveYs, start, time]
//     );

//     const pointPosition = useMemo(() => {
//         const { event: dot, index: dotIndex } = during.dot;
//         const nextDot = dotIndex ? dots[dotIndex + 1] : undefined;

//         const dotPosition = nextDot?.ease.count(time, [
//             bpm.toTime(dot.time) || 0,
//             bpm.toTime(nextDot.time),
//             dot.position || start[0] || 0,
//             nextDot.position
//         ]) || dot?.position || dots[dots.length - 1].position || 0;
//         return transformer.transform(dotPosition);
//     }, [transformer, dots, time]);

//     const alpha: number = useMemo(
//         () => countSustainAttr(alphas, during.alpha, 1),
//         [alphas, time]
//     );

//     const rotation: number = useMemo(
//         () => 0 - useDegree(countSustainAttr(rotates, during.rotate, 0)),
//         [rotates, time]
//     );

//     const idTextStyle = useMemo(() => new TextStyle({
//         fontSize: transformer.transform(0.5),
//         fill: 0xffffff
//     }), [transformer]);

//     // const drawMask = useCallback((g: PGraphics) => {
//     //     g.clear();
//     //     g.beginFill(0xffffff)
//     //         .drawRect(...transformer.transforms(-30, -0.5, 50, 60))
//     //         // .drawRect(...transformer.transforms(0, 0, 50, 60))
//     //         .endFill();
//     // }, [transformer]);

//     /**
//      * @description 查找正处于事件期间的事件
//      */
    

//     function countSustainAttr<T extends LineEvents & { from: number, to: number, endTime: Fraction, ease: Ease }>
//         (events: T[], attrInfo?: IDuringEvent<T>, defaultValue: number = 0): number {
//         const { event, index } = (attrInfo || getDuring<T>(events));

//         if (!index && index !== 0) return defaultValue;
//         if (!event) return events[index].to || defaultValue;

//         const { from, to, time: startTime, endTime } = event;

//         return event.ease.count(time, [
//             bpm.toTime(startTime),
//             bpm.toTime(endTime),
//             from,
//             to
//         ]) || defaultValue;
//     }

//     // 线绘制相关

//     // 调整模糊半径
//     useEffect(() => { lineBlurFilter.blur = transformer.transform(0.375); }, [transformer]);
//     /**
//      * @description 绘制线的回调函数
//      */
//     const drawLine = useCallback((g: PGraphics) => {
//         const { dot: { event: dot, index } } = during;
//         const nextDot = index || index === 0 ? dots[index + 1] : undefined;

//         function countY(dot: ChartDotEvent, speed: number): number {
//             if (!dot) return 0;
//             return (bpm.toTime(dot.time) - time) * speed * userSpeed;
//         }

//         /**
//          * @description 获取 t 在 from to 中的百分比
//          * @param {number} t
//          * @param {number} from 
//          * @param {number} to 
//          * @returns {number} 0~1
//          */
//         function getPercent(t: number, from: number, to: number): number {
//             if (t <= from) return 0;
//             if (t >= to) return 1;
//             return ((t - from) / (to - from)) || 0;
//         }

//         function getPosition(t: number, dot: ChartDotEvent) :Vec2 {
//             // const nowSpeed = 
//             // const startY
//         }

//         g.clear();

//         // 样式
//         g.lineStyle({ width: transformer.transform(.625), color: 0xffffff, alpha: 1, cap: LINE_CAP.ROUND });

//         // * 第一段绘制
//         if (dot && false) {
//             // ! 起点定位
//             const [dotT, nextDotT] = [bpm.toTime(dot.time), bpm.toTime(nextDot?.time)];
//             const startY = countY(dot, speed);
//             const difference = nextDotT - dotT;

//             function getY(percent: number = 0): number {
//                 if (percent <= 0) return 0;
//                 if (percent >= 1) return 1;
//                 return startY + (percent * difference) * speed * userSpeed;
//             }

//             for (let i = time; i < (nextDotT || dotT);) {
//                 const percent = getPercent(i, dotT, nextDotT);
//                 const position = nextDot?.ease.count(percent, [
//                     dot.position,
//                     nextDot.position
//                 ]) || dot?.position || 0;

//                 if (i !== time) g.lineTo(...transformer.toGlobal(position, getY(percent)));
//                 else g.moveTo(...transformer.toGlobal(position, getY(percent)));

//                 // 按时间分段减少性能消耗
//                 i += 100;
//             }
//         } else {
//             g.moveTo(...transformer.toGlobal(dots[0].position, countY(dots[0], speed)));
//         }

//         // 后续绘制
//         for (let i = (index || 0) + 1; i < dots.length; i++) {
//             const dot = dots[i];
//             const lastDot = dots[i - 1];
//             const ease = dot.ease.ease;

//             if (ease > 0 && ease < 30) {
//                 drawBezier(
//                     g,
//                     transformer.toGlobal(lastDot.position, countY(lastDot, speed)),
//                     transformer.toGlobal(dot.position, countY(dot, speed)),
//                     ease
//                 );
//             }
//             g.lineTo(...transformer.toGlobal(dot.position, countY(dot, speed)));
//         }
//     }, [dots, timings, userSpeed]);

//     return <Container ref={containerRef} position={[position[0], position[1]]} rotation={rotation}>
//         <Point text={id.toString()}
//             color={0xffdd88}
//             draw={(g) => { g.clear().beginFill(0xffdd88).drawCircle(0, 0, transformer.transform(0.125)).endFill(); }}
//             graphicsProps={{ anchor: 0.5 }} />
//         <Point text={id.toString()}
//             textStyle={idTextStyle}
//             graphicsProps={{ anchor: 0.5, rotation: useDegree(45) }}
//             position={[pointPosition, 0]} />
//         <Graphics draw={drawLine} alpha={alpha ?? 1} filters={[lineBlurFilter]} />
//     </Container>;
// }