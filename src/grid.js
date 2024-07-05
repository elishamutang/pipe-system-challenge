// Additional function to visualize grid.
function createGrid(num) {
    let grid = Array(num + 1)
        .fill(0)
        .map((elem) => {
            elem = Array(num + 1).fill(0)
            return elem
        })

    return grid
}

module.exports = createGrid
