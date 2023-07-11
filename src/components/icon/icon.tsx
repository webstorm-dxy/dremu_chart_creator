import useClassName from "@hooks/use-class-name";
import { IconProps } from './icon.d';

export default function Icon({ icon, className, type, fillType, sty }: IconProps) {
    /**
     * @param icon 图标库内图标名
     * @param type 图标样式 只能用brands和solid
     * @param fillType 填充还是不填充 classic 或 sharp
     */
    return <span className={useClassName("inline-flex relative h-full justify-center items-center ml-2 mr-2", className)} style={sty}>
            <i className={useClassName("w-full text-inherit", 'fa', 'fa-' + icon, type ? 'fa-' + type : '', fillType === 'sharp' ? 'fa-sharp' : '')}></i>
        </span>;
}