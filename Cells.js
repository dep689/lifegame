class Cells
{
    #ages   // セルの年齢リスト
    
    age_max // 最大寿命
    pbc     // 周期境界条件
    nx      // 列数
    ny      // 行数

    constructor (nx, ny, {
        age_max=Infinity,
        pbc=false,
    }={}) {
        this.nx = nx
        this.ny = ny
        this.age_max = age_max
        this.pbc = pbc
        this.#ages = new Array(nx * ny)
        this.#randomRect(0, 0, nx, ny, { rate: 0.2 })
    }

    get length () { return this.#ages.length}
    
    /** cell states */
    // getter
    age (x, y) {
        // 周期境界条件
        if (this.pbc) {
            x = ((x % this.nx) + this.nx) % this.nx
            y = ((y % this.ny) + this.ny) % this.ny
            return this.#ages[this.idx(x,y)]
        }

        // not 周期境界条件
        if (x < 0 || x >= this.nx) return undefined
        if (y < 0 || y >= this.ny) return undefined
        return this.#ages[this.idx(x,y)]
    }
    alive (x, y) { return this.age(x, y) > 0  }
    dead  (x, y) { return this.age(x, y) <= 0 }
    // setter
    set (x, y, age) {
        if (x < 0 || x >= this.nx) return
        if (y < 0 || y >= this.ny) return
        this.#ages[this.idx(x,y)] = age
    }

    /** convert functions */
    x (idx) { return idx % this.nx }
    y (idx) { return Math.floor(idx/this.nx) }
    idx (x, y) { return x + y*this.nx}

    /** update function */
    update () {
        this.#ages = this.#nextAges()
        this.#noise()
    }

    #noise () {
        if (Math.random() < 0.5) {
            this.#randomRect(0, 0, this.nx, 2, { rate: 0.2 })
        }
    }

    #countNeighbors (x, y) {
        return this.alive(x-1, y-1) + this.alive(x, y-1) + this.alive(x+1, y-1)
             + this.alive(x-1, y  ) + 0                  + this.alive(x+1, y  )
             + this.alive(x-1, y+1) + this.alive(x, y+1) + this.alive(x+1, y+1)
    }

    #nextAge (x, y) {
        const neighbors = this.#countNeighbors(x, y)
        
        // born (dead -> alive)
        if (this.dead(x,y) && neighbors === 3) { return 1 } 

        // death (alive -> dead)
        if (this.alive(x,y) && this.age(x,y) > this.age_max) { return 0 }

        // survive (alive -> alive)
        if ((this.alive(x,y) && neighbors === 2) ||
            (this.alive(x,y) && neighbors === 3) )
        {
            return this.age(x,y) + 1
        }

        // (dead -> dead)
        return 0
    }

    #nextAges () {
        const next = new Array(this.length)

        for (let idx = 0; idx < next.length; idx++) {
            next[idx] = this.#nextAge(this.x(idx), this.y(idx))
        }

        return next
    }

    /** helper functions */
    #randomRect (x, y, w, h, { rate=1 }={}) {
        for (let dx = 0; dx < w; dx++) {
            for (let dy = 0; dy < h; dy++) {
                if (Math.random() < rate) {
                    this.set(x+dx, y+dy, 1)
                } else {
                    this.set(x+dx, y+dy, 0)
                }
            }
        }
    }
}