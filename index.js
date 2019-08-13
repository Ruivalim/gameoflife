class ConwaysGameOfLife {
    constructor(canvas, speed = 0.1, width = 800, height = 800, resolution = 10){
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.resolution = resolution;
        this.speed = speed * 1000;
        this.cols = this.width / this.resolution;
        this.rows = this.height / this.resolution; 
        this.ctx = canvas.getContext('2d');
        this.gens = [];
        this.loop;
        this.lastGen;
        this.currentGen = 0;

        canvas.height = this.height;
        canvas.width = this.width;


        this.init();
    }

    init(){
        let oldGen = this.createInitialGen();

        this.render(oldGen);
        
        this.loop = window.setInterval(() => {
            oldGen = this.newGen(oldGen);
            this.render(oldGen);
        }, this.speed);
    }

    pause(){
        clearInterval(this.loop);
    }

    setSpeed(speed){
        this.speed = speed * 1000;
    }

    getGen(){
        return this.currentGen;
    }

    gensNumbs(){
        return this.gens.length;
    }

    loadGen(gen){
        let generation = this.gens[gen];

        this.render(generation);
        this.currentGen = gen;
    }

    continue(){
        let oldGen = this.lastGen;

        this.loop = window.setInterval(() => {
            oldGen = this.newGen(oldGen);
            this.render(oldGen);
        }, this.speed);
    }

    createInitialGen(){
        return new Array(this.cols).fill(null)
            .map(() => new Array(this.rows).fill(null)
                .map(() => Math.floor(Math.random() * 2)));
    }

    newGen(oldGen) {
        const newGen = oldGen.map(arr => [...arr]);
        this.gens.push(newGen);
      
        for (let col = 0; col < oldGen.length; col++) {
            for (let row = 0; row < oldGen[col].length; row++) {
                const cell = oldGen[col][row];
                let neighbour = 0;

                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        if (i === 0 && j === 0) {
                            continue;
                        }
                        const neighbour_x = col + i;
                        const neighbour_y = row + j;

                        if (neighbour_x >= 0 && neighbour_y >= 0 && neighbour_x < this.cols && neighbour_y < this.rows) {
                            const currentNeighbour = oldGen[neighbour_x][neighbour_y];
                            neighbour += currentNeighbour;
                        }
                    }
                }


                if (cell === 1 && neighbour < 2) {
                    newGen[col][row] = 0;
                } else if (cell === 1 && neighbour > 3) {
                    newGen[col][row] = 0;
                } else if (cell === 0 && neighbour === 3) {
                    newGen[col][row] = 1;
                }
            }
        }
        
        return newGen;
    }

    render(oldGen) {
        this.currentGen = this.gens.length;
        this.lastGen = oldGen.map(arr => [...arr]);
        this.gen = this.gens.length + 1;

        for (let col = 0; col < oldGen.length; col++) {
            for (let row = 0; row < oldGen[col].length; row++) {
                const cell = oldGen[col][row];
                
                this.ctx.beginPath();
                this.ctx.rect(col * this.resolution, row * this.resolution, this.resolution, this.resolution);
                this.ctx.fillStyle = cell ? 'black' : 'white';
                this.ctx.fill();
                this.ctx.stroke();
            }
        }
    }
}