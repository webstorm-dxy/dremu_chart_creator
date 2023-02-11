import { bpm } from "@components/pages/preview/chart.tem";
import useDegree from "@hooks/use-degree";
import { Container, Graphics } from "@inlet/react-pixi";
import { Vec2 } from "@interfaces/global-type";
import Ease from "@scripts/utils/ease";
import { MaskData, Graphics as PGraphics, LINE_CAP } from "pixi.js";
import { useCallback } from "react";
import { LineProps } from './line.d';


function drawBezier(from: Vec2, g: PGraphics, ease: number, to: Vec2) {
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

export default function Line(props: LineProps) {
    const { data, time } = props;
    const { start, dots, timings, speed } = data;

    // const maskGraphics = new PGraphics();
    // maskGraphics.beginFill(0xffffff, 0);
    // maskGraphics.drawRect(-30, -1, 50, 60);
    // maskGraphics.endFill();
    // maskGraphics.position.set(...start);
    // const drawMask = new MaskData(maskGraphics);

    const drawPoint = useCallback((g: PGraphics) => {
        g.clear();
        g.beginFill(0xffffff);
        g.drawRect(-.125, -.125, .25, .25);
        g.endFill();
    }, [props]);

    const drawLine = useCallback((g: PGraphics) => {
        function countY(dot, speed): number {
            return (bpm.toTime(dot.time) - time) * speed;
        }

        g.clear();

        g.lineStyle({ width: .5, color: 0xffffff, alpha: 0.8, cap: LINE_CAP.ROUND });
        // g.beginFill(0xffffff);
        g.moveTo(dots[0].position, (bpm.toTime(dots[0].time) - time) * speed);
        for (let i = 1; i < dots.length; i++) {
            const dot = dots[i];
            const lastDot = dots[i - 1];
            const ease = dot.ease.ease;

            if (ease > 0 && ease < 30) {
                drawBezier([lastDot.position, countY(lastDot, speed)], g, ease, [dot.position, countY(dot, speed)]);
            }
            g.lineTo(dot.position, (bpm.toTime(dot.time) - time) * speed);
        }
    }, [props]);

    return <Container position={[start[0], start[1]]} /* mask={drawMask} */>
        <Graphics draw={drawPoint} rotation={useDegree(45)} anchor={0.5}></Graphics>
        <Graphics draw={drawLine} />
    </Container>;
}