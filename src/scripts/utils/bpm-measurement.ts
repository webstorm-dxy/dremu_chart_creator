let detect;

(async() => {
    detect = (await import('bpm-detective')).default;
})();

export async function bpmMeasurement(audioData: File | ArrayBuffer | Blob | AudioBuffer): Promise<number> {
    return new Promise(async (resolve, reject) => {
        // 如果是 AudioBuffer 则直接分析
        if (audioData instanceof AudioBuffer) {
            resolve(detect(audioData));

        // 否则先转换为 AudioBuffer 后分析
        } else {
            let arrBuf: ArrayBuffer = audioData as ArrayBuffer;
            const ctx = new AudioContext();

            if (!(audioData instanceof ArrayBuffer)) {
                arrBuf = await audioData.arrayBuffer();
            }

            new Promise((resolve, reject) => {
                ctx.decodeAudioData(arrBuf, resolve, reject);
            })
                .then(data => resolve(detect(data)))
                .catch(err => reject(err));
        }
    });
}