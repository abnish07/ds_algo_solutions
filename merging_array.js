// merge two array and print element in ascending order


function runProgram(input) {
    var data = input.split('\n')
    var tc = Number(data[0])
    data.shift()
    console.log(data)

    for (var i = 0; i < tc; i++) {
        var N = data[3 * i].split(' ')
        var n1 = Number(N[0])
        var n2 = Number(N[1])
        var len = n1 + n2;

        var arr1 = data[3 * i + 1]
        var arr2 = data[3 * i + 2]
        var arr = arr1 + " " + arr2
        var final = arr.split(' ').map(Number)

        console.log(typeof final)
        for (var j = 0; j < len; j++) {
            var min = j
            for (var k = j + 1; k < len; k++) {
                if (final[k] < final[min]) {
                    min = k

                }

            }
            var temp = final[j]
            final[j] = final[min]
            final[min] = temp
        }
        console.log(final)
    }
}

runProgram('2\n4 5\n1 3 5 7\n0 2 6 8 9\n2 3\n10 12\n5 18 20')