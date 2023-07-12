import fs from 'fs';


const bpmMeasurement = (await import('@/scripts/utils/bpm-measurement')).bpmMeasurement;

const file = fs.readFileSync('D:\\杨昕睿-资料\\code\\ReAstEdit\\__test__\\assets\\default.ogg');

const arrBuf = file.buffer;
const blob = new Blob([file.buffer]);

function judge(res: any) {
    if (typeof res === 'number' && res) return true;
    return res;
}

test('file', async () => {
    const testFile = new File([blob], 'test');

    expect(judge(await bpmMeasurement(testFile))).toBe(true);
});

test('blob', async () => {
    expect(judge(await bpmMeasurement(blob))).toBe(true);
});

test('array buffer', async () => {
    expect(judge(await bpmMeasurement(arrBuf))).toBe(true);
});

test('audio buffer', async () => {
    const data: AudioBuffer = await new Promise((resolve, reject) => {
        const ctx = new AudioContext();
        ctx.decodeAudioData(arrBuf, resolve, reject);
    });

    expect(judge(await bpmMeasurement(data))).toBe(true);
});