class ConwaysGameOfLife {
    constructor(canvas, speed = 0.1, width = 800, height = 800, resolution = 10, saveHistory = false){
        if( typeof canvas == "object" ){
            this.canvas = canvas.canvas;
            if( canvas.speed ){
                this.speed = canvas.speed;
            }else{
                this.speed = speed;
            }
            if( canvas.width ){
                this.width = canvas.width;
            }else{
                this.width = width;
            }
            if( canvas.height ){
                this.height = canvas.height;
            }else{
                this.height = height;
            }
            if( canvas.resolution ){
                this.resolution = canvas.resolution;
            }else{
                this.resolution = resolution;
            }
            if( canvas.saveHistory ){
                this.saveHistory = canvas.saveHistory;
            }else{
                this.saveHistory = saveHistory;
            }
        }else{
            this.canvas = canvas;
            this.width = width;
            this.height = height;
            this.resolution = resolution;
            this.speed = speed * 1000;
            this.saveHistory = saveHistory;
        }
        this.cols = this.width / this.resolution;
        this.rows = this.height / this.resolution; 
        this.ctx = this.canvas.getContext('2d');
        this.gens = [];
        this.loop;
        this.lastGen;
        this.currentGen = 0;
        this.initialState;
        this.paused = false;
        this.started = false;
        this.onRender;
        this.onNewGen;
        this.onGenUpdate;
        this.history = [];

        this.canvas.height = this.height;
        this.canvas.width = this.width;


        this.init();
    }

    init(){
        const oldGen = this.createInitialGen();

        this.initialState = oldGen;

        this.render(oldGen);
    }

    start() {        
        if( !this.started ){
            this.started = true;
            let initialState = this.initialState;

            this.loop = window.setInterval(() => {
                initialState = this.newGen(initialState);
                this.render(initialState);
            }, this.speed);
        }
    }

    pause(){
        if( !this.paused ){
            clearInterval(this.loop);
            this.paused = true;
        }
    }

    continue(){
        if( this.paused ){
            this.paused = false;
            let oldGen = this.lastGen;

            this.loop = window.setInterval(() => {
                oldGen = this.newGen(oldGen);
                this.render(oldGen);
            }, this.speed);
        }
    }

    reset(){
        this.pause();

        this.history = [];
        this.gens = [];
        this.currentGen = 0;
        this.loop = null;
        this.paused = false;
        this.started = false;

        this.init();
    }

    setSpeed(speed){
        this.speed = speed * 1000;
    }

    getGen(){
        return this.currentGen;
    }

    getGenFromHistory(gen){
        if( this.saveHistory ){
            return this.history[gen];
        }
    }

    gensNumbs(){
        return this.gens.length;
    }

    loadGen(gen){
        let generation = this.gens[gen];

        this.render(generation);
        this.currentGen = gen;
    }

    addEvent(eventType, eventAction){
        if( eventType == "onRender" ){
            this.onRender = eventAction;
        }
        if( eventType == "onNewGen" ){
            this.onNewGen = eventAction;
        }
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

        if( this.saveHistory ){
            this.history.push(newGen);
        }

        if( typeof this.onNewGen == "function" ){
            this.onNewGen(newGen);
        }
        
        return newGen;
    }

    displayGen(gen){
        for (let col = 0; col < gen.length; col++) {
            for (let row = 0; row < gen[col].length; row++) {
                const cell = gen[col][row];
                
                this.ctx.beginPath();
                this.ctx.rect(col * this.resolution, row * this.resolution, this.resolution, this.resolution);
                this.ctx.fillStyle = cell ? 'black' : 'white';
                this.ctx.fill();
                this.ctx.stroke();
            }
        }
    }

    render(oldGen) {
        this.currentGen = this.gens.length;
        this.lastGen = oldGen.map(arr => [...arr]);
        this.gen = this.gens.length + 1;

        this.displayGen(oldGen);

        if( typeof this.onRender == "function" ){
            this.onRender(this.currentGen);
        }
    }
}