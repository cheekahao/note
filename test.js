function mergeSort(array) {
    const {
        length
    } = array
    if (length < 2) return array

    const middle = Math.floor(length / 2)
    const left = mergeSort(array.slice(0, middle))
    const right = mergeSort(array.slice(middle, length))
    console.log('left', left, 'right', right);
    return merge(left, right)
}

function merge(left, right) {
    let i = 0;
    let j = 0;
    let result = []

    while (i < left.length && j < right.length) {
        const leftItem = left[i]
        const rightItem = right[j]
        let item

        if (leftItem < rightItem) {
            item = leftItem;
            i++;
        } else {
            item = rightItem;
            j++;
        }
        result.push(item)
    }

    result = result.concat(i < left.length ? left.slice(i) : right.slice(j))
    console.log('result', result);
    return result
}

function lengthOfLongestSubstring(s){
    const arr = s.split('')
    let maxLength = 0
    const sub = []
    const map = {}

    while (arr.length) {
        const item = arr.shift()

        while (map[item] && sub.length) {
            const first = sub.shift()

            delete map[first]
        }

        map[item] = 1
        sub.push(item)

        maxLength = sub.length > maxLength ? sub.length : maxLength
    }

    return maxLength
}

function minWindow(s, t) {
    const {length} = s
    const total = t.length
    const leftSteps = getContainedSteps(s, t)
    const rightSteps = leftSteps.slice(0)
    let left = leftSteps.shift()
    let right = rightSteps.shift()
    let minSubStr = ''
    const sourceCountMap = {}
    const targetCountMap = getCountMap(t)

    while (right <= length) {
        let rightChat = s.charAt(right)
        let leftChat = s.charAt(left)
        updateCountMap(sourceCountMap, rightChat)

        while (right - left >= total && sourceCountMap[leftChat] > targetCountMap[leftChat]) {
            reduceCountMap(sourceCountMap, leftChat)
            left = leftSteps.shift()
            leftChat = s.charAt(left)
        }

        const subStr = s.substring(left, right + 1)

        if ((!minSubStr || minSubStr.length > subStr.length) && hasContainedSource(sourceCountMap, targetCountMap)) minSubStr = subStr

        if (rightSteps.length){
            right = rightSteps.shift()
        }else {
            right++
        }

    }

    return minSubStr
}

function getContainedSteps(source, target) {
    const steps = []
    const {length} = source

    for (let index = 0; index < length; index++) {
        const char = source.charAt(index)

        if (target.indexOf(char) > -1) steps.push(index)
    }

    return steps
}

function getCountMap(str) {
    const map = {}
    const {
        length
    } = str

    for (let index = 0; index < length; index++) {
        const char = str.charAt(index)

        updateCountMap(map, char)
    }

    return map
}

function updateCountMap(map, char) {
    map[char] = (map[char] || 0) + 1
}
function reduceCountMap(map, char) {
    map[char] = map[char] > 0 ? map[char] - 1 : 0
}

function hasContainedSource(sourceCountMap, targetCountMap) {
    let hasContained = true
    for (const key in targetCountMap) {
        if (Object.hasOwnProperty.call(targetCountMap, key)) {
            const sourceCount = sourceCountMap[key] || 0
            if (sourceCount < targetCountMap[key]){
                hasContained = false
                break
            }

        }
    }

    return hasContained
}

function minWindow2(s, t) {
    const {
        length
    } = s
    let left = 0
    let right = left + total
    const total = t.length
    const set = new Set()
    const map = {}
    let minSubString = ''

    while (right < length) {
        let item = s.charAt(right)

        right++

        // 不在字串t中，直接进入下一循环
        if (t.indexOf(item) == -1) continue

        if (!set.has(item)) { //set中不包含item，向set、map中增加对应数据
            set.add(item)
            map[item] = 1 //用于保存字串中该字符的个数
        } else {
            map[item] += 1
        }

        const isAllContained = set.size == total //set的大小等于字符串长度，说明字串已经包含所有

        if (!isAllContained) continue // 没有包含全部字符时，直接进入下一循环

        // 开始移动做指针

        let leftItem = s.charAt(left)
        let leftCount = map[leftItem] || 0
        while (leftCount !== 1) {
            if (leftCount > 1) map[leftItem] -= 1

            left++
            leftItem = s.charAt(left)

            leftCount = map[leftItem] || 0
        }

        const subString = s.substring(left, right)

        if (minSubString.length > subString.length) {
            minSubString = subString
        }
    }

    if (set.size < total) return ''

    return minSubString
}


var findMedianSortedArrays = function (nums1, nums2) {
    const total = nums1.length + nums2.length
    const isEven = total % 2 === 0
    const middle = Math.ceil(total / 2)
    let arr = []

    while (arr.length <= middle) {
        const item = !nums2.length || (nums1.length && nums1[0] <= nums2[0]) ? nums1.shift() : nums2.shift()

        arr.push(item)
    }

    return isEven ? (arr[middle] + arr[middle - 1]) / 2 : arr[middle - 1]
}

console.log(findMedianSortedArrays([2], []))
