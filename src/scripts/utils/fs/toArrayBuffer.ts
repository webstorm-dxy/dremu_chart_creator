export async function toArrayBuffer(file: Blob | File): Promise<ArrayBuffer> {
    return file.arrayBuffer();
}