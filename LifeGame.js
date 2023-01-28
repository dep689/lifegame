class LifeGame
{
    bd = new Cells(160, 90, { pbc: true })
    cell_px = 5      // セルの大きさ(pixel)
    interval_ms = 80 // 更新間隔(msec)

    init () {
        const canvas  = document.getElementById("canvas")
        canvas.width  = this.bd.nx * this.cell_px
        canvas.height = this.bd.ny * this.cell_px
    }
    
    start () {
        this.init()
        setInterval(() => {
            this.bd.update()
            this.draw()
        }, this.interval_ms)
    }

    /** draw functions */
    draw () {
        const g = document.getElementById("canvas").getContext("2d")
        g.clearRect(0, 0, g.canvas.width, g.canvas.height)

        for (let idx = 0; idx < this.bd.length; idx++) {
            const [x, y] = [this.bd.x(idx), this.bd.y(idx)]
            g.fillStyle = this.#color(x, y)
            g.fillRect(x * this.cell_px, y * this.cell_px, this.cell_px, this.cell_px)
        }
    }

    #color (x, y) {
        if (this.bd.dead(x,y)) return "rgba(0,0,0,0)"

        // alive
        const baby     = 1
        const amature  = 5
        if (this.bd.age(x,y) <= baby) return "rgba(80,0,0,0.5)"
        if (this.bd.age(x,y) <= amature) {
            const alpha = Math.min(1.0, 0.2*this.bd.age(x,y))
            return `rgba(80, 255, 0, ${alpha})`    
        }
        // mature
        const green = 255 - 255*Math.min(1, 0.2*(this.bd.age(x,y) - amature))
        return `rgba(80, ${green}, 0, 1)`
    }
}