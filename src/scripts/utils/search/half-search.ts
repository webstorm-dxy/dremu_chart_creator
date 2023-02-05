import { Int } from "@interfaces/global-type";

export default function halfSearch(nums: number[], target: number) : Int {
    /**
     * @return number target 所在的 index, 不存在则返回 -1。
     */
    // 定义指针
    let left = 0, right = nums.length - 1;

    // 进行排序确保 nums 是升序排列
    nums.sort((a, b) => b - a);
    
    // 搜索
    while (left <= right) {
        const MIDDLE = Math.floor((right - left) / 2 + left);
        
        if(nums[MIDDLE] > target)  right = MIDDLE - 1;
        else if(nums[MIDDLE] < target) left = MIDDLE + 1;
        else return MIDDLE;
    }
    // 未搜索到返回 -1
    return -1;
}