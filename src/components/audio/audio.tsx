import { Slider } from "antd";
import { useRef } from "react";

interface IAudioProps {
    src: string;
    show?: boolean;
}

export default function Audio({src, show=true}: IAudioProps) {
    const audioRef = useRef(null);


    
    return <div>
        {show && <Slider></Slider>}
        <audio ref={audioRef} src={src} controls={false}></audio>
    </div>;
}