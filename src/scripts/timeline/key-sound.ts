const keySounds: Map<string, HTMLAudioElement | null> = new Map([
    ['tap', null],
    ['hold', null],
    ['darg', null],
    ['flick', null],
]);

export function playKeySound(key: string) {
    if (!keySounds.has(key)) return;
    
    const sound = keySounds.get(key);

    if (!sound.paused) {
        const newSound = sound.cloneNode() as HTMLAudioElement;
        newSound.id = '';
        const deleteSoundHandler = () => {
            newSound.remove();
        };
        newSound.addEventListener('ended', deleteSoundHandler);
        newSound.addEventListener('pause', deleteSoundHandler);
        newSound.currentTime = 0;
        newSound.play();
        return;
    }
    sound.currentTime = 0;
    sound.play();
}

export interface ISetKeySoundAttrs {
    src: string;
    [key: string]: string;
}

export function setKeySound(key: string, attrs: ISetKeySoundAttrs | null) {
    if (!document) return;
    
    if (!attrs) {
        keySounds.set(key, null);
        return;
    }

    const audioEl = document.createElement('audio');

    audioEl.preload = 'auto';
    for (const key in attrs) {
        audioEl.setAttribute(key, attrs[key]);
    }

    keySounds.set(key, audioEl);
}