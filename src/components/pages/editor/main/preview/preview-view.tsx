import { chart } from "@/components/pages/preview/chart.tem";
import PreviewScene from "@/components/pixi/scenes/preview/preview";
import PixiApp from "@/components/pixi/stage/pixi-app";

const tempChartData = chart;
export default function PreviewView() {

    return <div className="h-1/2 relative">
        <PixiApp
            className="bg-black max-h-full max-w-full relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover"
            width={960}
            height={540}
            paused={true}
            >
            <PreviewScene chart={tempChartData} options={{}}></PreviewScene>
        </PixiApp>
    </div>;
}