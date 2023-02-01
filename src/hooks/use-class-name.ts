export default function useClassName(...classNames: string[]): string {
    /**
     * @description 合并并格式化若干个 className.
     * @return string 
     */
    return classNames.filter(v => typeof v === 'string') // 排除非字符串
        .join(' ') // 转字符串, 空格为分割
        .replace(/[ (\n)(\r)]{2,}/g, ' ').trim(); // 去除多余空白
}