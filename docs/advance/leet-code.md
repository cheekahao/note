# LeetCode

## 滑动窗口算法

滑动窗口算法主要用于解决数组/字符串的子元素问题。可以将嵌套的循环问题，转换为单循环问题，降低时间复杂度。

其主要过程是：维护一个队列或者两个指针，通过队列出队/入队或者左右两个指针的往右移动，使窗口不断向右滑动，直到最右面为止。

用到该算法的有：

* [3. 无重复字符的最长子串](#_3-无重复字符的最长子串)
* [76. 最小覆盖子串](#_76-最小覆盖子串)

## 1. 两数之和

在数组中找到`2`个数之和等于给定值的数字，结果返回`2`个数字在数组中的下标。例如：

```js
const nums = [2, 7, 11, 15]
const target = 9

// [0, 1]
```

解题思路：

此题其实和数组去重类似，都是查询一个值是否在数组里去重是值本身，而此题是和`target`之差。

一开始想到的方式，是双指针循环两次，算法复杂度为<code>O(n<sup>2</sup>)</code>：

```js
function twoSum(nums, target){
    const {length} = nums
    let j = length - 1
    let i
    let isFind = false
    while(!isFind && j){
        const end = nums[j]

        for (i = 0; i < j; i++) {
            const item = nums[i];

            if(item + end === target){
                isFind = true

                break
            }
        }

        if(isFind) break

        j--
    }

    return isFind ? [i, j] : null
}
```

深入思考后，其实与数组去重类似，可以用空间换时间，时间复杂度为`O(n)`：

```js
function twoSum(nums, target){
    const {length} = nums
    const map = {}

    for (let index = 0; index < length; index++) {
        const item = nums[index]
        const diff = target - item
        const diffIndex = map[diff]

        if(diffIndex !== undefined){
            return [diffIndex, index]
        }else{
            map[item] = index
        }
    }
    
    return null
}
```

## 2. 两数相加

两个**非空**的链表，表示两个非负的整数。每位数字**逆序**存储的，且每个节点只存储**一位**数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

```js
function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val)
    this.next = (next === undefined ? null : next)
}

function addTwoNumbers(l1, l2) {
    let isCarry = 0
    let first, current

    while (l1 || l2 || isCarry) {
        const value1 = l1 ? l1.val : 0
        const value2 = l2 ? l2.val : 0
        let sum = value1 + value2 + isCarry

        if (sum >= 10) {
            isCarry = 1
            sum = sum % 10
        } else {
            isCarry = 0
        }

        if (!first){
            first = new ListNode(sum)
            current = first
        }else{
            current.next = new ListNode(sum)
            current = current.next
        }

        l1 = l1 && l1.next
        l2 = l2 && l2.next
    }

    return first
}
```

## 3. 无重复字符的最长子串

**题目：** 在一个字符串中寻找没有重复字母的最长子串

```js
function lengthOfLongestSubstring(s){
    let left = 0
    let right = 0
    let maxLength = 0
    const {length} = s

    while (right < length) {
        right ++
        let sub = s.substring(left, right)
        while(hasRepeted(sub)){
            left++
            sub = s.substring(left, right)
        }

        const subLength = sub.length
        if(subLength > maxLength) maxLength = subLength
    }

    return maxLength
}

function hasRepeted(str){
    const set = new Set()
    const {length} = str
    let result = false

    for (let index = 0; index < length; index++) {
        const char = str.charAt(index)

        if(set.has(char)){
            result = true
            break
        }

        set.add(char)
    }

    return result
}
```

## 12. 整数转罗马数字

**题目：**

罗马数字包含以下七种字符：`I`、`V`、`X`、`L`、`C`、`D`和`M`。

| 符号 | 十进制对应的值 |
|-----|--------------|
|`I`   | `1` |
|`V`   | `5` |
|`X`   | `10` |
|`L`   | `50` |
|`C`   | `100` |
|`D`   | `500` |
|`M`   | `1000` |

例如，罗马数字`2`写做`II`，即为两个并列的`1`。`12`写做`XII`，即为`X + II`。`27`写做`XXVII`，即为`XX + V + II`。

通常情况下，罗马数字中小的数字在大的数字的右边。但也存在特例，例如`4`不写做`IIII`，而是`IV`。数字`1`在数字`5`的左边，所表示的数等于大数`5`减小数`1`得到的数值`4`。同样地，数字`9`表示为`IX`。这个特殊的规则只适用于以下六种情况：

`I`可以放在`V`(5)和`X`(10)的左边，来表示`4`和`9`。
`X`可以放在`L`(50)和`C`(100)的左边，来表示`40`和`90`。 
`C`可以放在`D`(500)和`M`(1000)的左边，来表示`400`和`900`。

给定一个整数，将其转为罗马数字。输入确保在`1`到`3999`的范围内。

```js
function intToRoman(int) {
    const list = [{
        roman: 'M',
        value: 1000,
    }, {
        roman: 'D',
        value: 500,
    }, {
        roman: 'C',
        value: 100,
    }, {
        roman: 'L',
        value: 50,
    }, {
        roman: 'X',
        value: 10,
    }, {
        roman: 'V',
        value: 5,
    }, {
        roman: 'I',
        value: 1,
    }]
    let rest = int
    let isConvertNine = false

    return list.reduce( (result, item, index) => {
        const {
            roman,
            value,
        } = item
        const next = list[index + 1]
        const prev = list[index - 1]
        const ten = list[index - 2]
        let current = Math.floor(rest / value)

        if (!current) return result

        rest = rest % value

        switch (true) {
            case current === 1 && next && Math.floor(rest / next.value) === 4: // 9 需要特殊表示为prev + next
                isConvertNine = true
                break;
            case isConvertNine && current === 4: // 说明值为9或者其倍数
                result += roman + ten.roman
                isConvertNine = false
                break;
            case !isConvertNine && current === 4: // 说明值为4
                result += roman + prev.roman
                break;
            default:
                while (current) {
                    result += roman
                    current--
                }
                break;
        }

        return result
    }, '')
}
```

## 13. 罗马数字转整数

```js
function romanToInt(roman) {
    const map = {
        I: 1,
        V: 5,
        X: 10,
        L: 50,
        C: 100,
        D: 500,
        M: 1000
    }
    const romanArr = roman.split('')

    return romanArr.reduce((result, item, index) => {
        const value = map[item]
        const next = romanArr[index + 1]

        if (!next) return result + value
        const nextValue = map[next]

        return value < nextValue ? result - value : result + value
    }, 0)
}
```

## 76. 最小覆盖子串

**题目：** 给两个个字符串`s`和`t`。返回`s`中涵盖`t`所有字符的最小子串。如果不存在则返回空字符串`""`。

```js
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
```