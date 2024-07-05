const fs = require('fs')

// Find all sinks that are connected to the one source.
function connectedSinks(filePath) {
    // Get raw data from .txt file
    const rawData = fs.readFileSync(filePath, 'utf-8').split('\n')

    // Each coordinate will be represented by an object node.
    const Node = (elem, type) => {
        return {
            char: elem[0],
            coord: [parseInt(elem[1]), parseInt(elem[2].split('\r')[0])],
            type: type,
            adjacencies: [],
            visited: false,
        }
    }

    // Simple hashing function to generate unique index for each type of pipe.
    const hashingFunc = (key) => {
        let hashCode = 0
        let listSize = 11 // Number of unique pipes

        const primeNumber = 31
        for (let i = 0; i < key.length; i++) {
            hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % listSize
        }

        return hashCode
    }

    // Generate pipe info, this will contain the index generated from hashingFunc for each unique pipe.
    const generatePipeInfo = () => {
        const typesOfPipes = ['═', '║', '╔', '╗', '╚', '╝', '╠', '╣', '╦', '╩']
        const pipeInfo = []

        typesOfPipes.forEach((pipe) => {
            let newPipe = {
                char: pipe,
                index: hashingFunc(pipe),
            }

            switch (newPipe.index) {
                case 0: {
                    newPipe.adjacencies = [
                        [-1, 0],
                        [1, 0],
                    ]
                    break
                }

                case 1: {
                    newPipe.adjacencies = [
                        [0, 1],
                        [0, -1],
                    ]
                    break
                }

                case 3: {
                    newPipe.adjacencies = [
                        [0, 1],
                        [1, 0],
                    ]
                    break
                }

                case 4: {
                    newPipe.adjacencies = [
                        [-1, 0],
                        [1, 0],
                    ]
                    break
                }

                case 5: {
                    newPipe.adjacencies = [
                        [0, 1],
                        [1, 0],
                    ]
                    break
                }

                case 6: {
                    newPipe.adjacencies = [
                        [-1, 0],
                        [0, 1],
                    ]
                    break
                }

                case 7: {
                    newPipe.adjacencies = [
                        [-1, 0],
                        [0, 1],
                        [1, 0],
                    ]
                    break
                }

                case 8: {
                    newPipe.adjacencies = [
                        [0, -1],
                        [1, 0],
                    ]
                    break
                }

                case 9: {
                    newPipe.adjacencies = [
                        [1, 0],
                        [0, 1],
                        [0, -1],
                    ]
                    break
                }
            }

            pipeInfo.push(newPipe)
        })

        return pipeInfo
    }

    const pipeInfo = generatePipeInfo()

    // Clean the raw data
    const cleanData = (data) => {
        // Transformed raw data to be stored in cleanedData
        const cleanedData = []

        data.forEach((elem) => {
            let newElem = elem.split(' ')

            // Identify what each character means (e.g source, sink, pipe)
            let type = 'pipe'

            if (newElem[0] === '*') {
                type = 'source'
            } else {
                const reg = /[A-Z]/

                if (newElem[0].match(reg)) {
                    type = 'sink'
                }
            }

            // Store data of each row in newNode
            let newNode = Node(newElem, type)

            let x = newNode.coord[0]
            let y = newNode.coord[1]

            // Generate all possible neighbours for each node.
            if (newNode.type === 'source' || newNode.type === 'sink') {
                newNode.adjacencies.push([x + 1, y])
                newNode.adjacencies.push([x, y + 1])
                newNode.adjacencies.push([x - 1, y])
                newNode.adjacencies.push([x, y - 1])
            } else {
                newNode.index = hashingFunc(newNode.char)
                pipeInfo.forEach((pipe) => {
                    if (pipe.index === newNode.index) {
                        newNode.adjacencies = pipe.adjacencies.map((elem) => {
                            let newElem = elem.map((int, idx) => {
                                return int + newNode.coord[idx]
                            })
                            return newElem
                        })
                    }
                })
            }

            cleanedData.push(newNode)
        })

        return cleanedData
    }

    const cleanedData = cleanData(rawData)

    // Find the path from source to all sinks.
    const findPath = () => {
        // Find specific node when coordinate passed through.
        const findElem = (elem) => {
            let [a, b] = elem

            let [foundElem] = cleanedData.filter((elem) => {
                if (elem.coord[0] === a && elem.coord[1] === b) return elem
            })

            return foundElem
        }

        const [source] = cleanedData.filter((elem) => {
            if (elem.type === 'source') return elem
        })

        let queue = [source]
        let sinks = []

        const trackSeq = () => {
            while (queue.length !== 0) {
                let visitedNode = queue.shift()
                visitedNode.visited = true

                if (visitedNode.type === 'sink' && !sinks.includes(visitedNode.char)) {
                    sinks.push(visitedNode.char)
                }

                visitedNode.adjacencies.forEach((node) => {
                    if (findElem(node)) {
                        const adjNode = findElem(node)

                        if (adjNode.visited === false) {
                            // console.log(adjNode)
                            queue.push(adjNode)
                        }
                    }
                })
            }
        }

        trackSeq()

        return sinks.sort().join('')
    }

    return findPath()
}

console.log(connectedSinks('/home/elishamutang/Desktop/Projects/pipe-system-challenge/src/coding_example.txt'))
