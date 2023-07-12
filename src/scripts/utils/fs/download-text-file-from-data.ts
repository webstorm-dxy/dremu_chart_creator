import dayjs from "dayjs";

export default function downloadFileFromData<T extends string|BufferSource|Blob>
(data: T, options: { name?: string, ext?: string, hasTime?: boolean } = {}) {
    function exportFile(data: T, name: string) {
        const urlObject = window.URL || window.webkitURL;
        const exportBlob = new Blob([data as BlobPart]);
        const saveLink = document.createElementNS("http://www.w3.org/1999/xhtml", "a") as HTMLAreaElement;
        saveLink.href = urlObject.createObjectURL(exportBlob);
        saveLink.download = name;
        saveLink.click();
    }


    function getTime() {
        return dayjs().format('YYYY-M-D_H-m-s');
    }
    
    exportFile(data, `${options.name ? options.name + (options.hasTime ? ' ' + getTime() : '') : getTime()}${options.ext ? '.' + options.ext : ''}`);
}