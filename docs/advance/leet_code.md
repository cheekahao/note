# LeetCode

## 2.

```js
function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val)
    this.next = (next === undefined ? null : next)
}

function addTwoNumbers(l1, l2) {
    const stack1 = toStack(l1)
    const stack2 = toStack(l2)
    let stack1Length = stack1.length
    let stack2Length = stack2.length
    let isCarry = 0
    let next, current

    while (stack1Length || stack2Length || isCarry) {
        const value1 = stack1Length ? stack1.pop() : 0
        const value2 = stack2Length ? stack2.pop() : 0
        let sum = value1 + value2 + isCarry
        console.log('sum', sum, value1, value2, isCarry);
        if (sum >= 10){
            isCarry = 1
            sum = sum % 10
        }else{
            isCarry = 0
        }

        if (!next) {
            next = new ListNode(sum)
        }else{
            current = new ListNode(sum, next)

            next = current
        }

        stack1Length = stack1.length
        stack2Length = stack2.length
    }

    return current
}

function toStack(list) {
    const stack = []

    while (list) {
        stack.push(list.val)
        list = list.next
    }
    
    return stack
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