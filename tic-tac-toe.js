Vue.component('game-title', {
    template: `
        <h1>
            <a href="https://en.wikipedia.org/wiki/Tic-tac-toe">TicTacToe</a>
        </h1>
    `,
});

Vue.component('welcome-message', {
    props: {
        'message': String,
        'playerNames': {
            type: Array,
            default: () => [],
        }
    },
    computed: {
        messageToPlayers() {
            if (this.playerNames.length) {
                return `${this.message} ${this.playerNames.join(', ')}`;   
            } else {
                return this.message;
            }
        }
    },
    template: `
        <h6>
          {{ messageToPlayers }}
        </h6>
    `,
});

Vue.component('ready-checkbox', {
    props: {
        'name': String
    },
    data: function() {
        const id = `ready-switch-for-${this.name}`;
        return {
            checked: false,  
            id
        };
    },
    methods: {
        onClick(event) {
            this.checked = event.target.checked;
            this.$emit('player-ready', this.name, this.checked);
        }
    },
    template: `
        <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" :id="id" :checked="checked" v-on:click="onClick">
            <label class="custom-control-label" :for="id">{{name}}, are you ready?</label>
        </div>
    `,
});

Vue.component('game-board', {
    data: function() {
        return {
            classObject: ['container', 'm-auto', 'bg-light', 'd-flex', 'flex-column'],
            styleObject: {
                'width': '900px',
                'height': '900px'
            },
            boardRowClasses: ['board-row', 'row', 'flex-grow-1'],
            boardCellClasses: ['board-cell', 'col', 'p-4', 'border', 'border-primary', 'rounded-lg'],
        };
    },
    methods: {
        boardRowKey(r) {
            return `row-${r}`;
        },
        boardCellKey(r, c) {
            return `cell-${r}-${c}`;
        }
    },
    template: `
        <div id="board" :class="classObject" :style="styleObject">
            <div v-for="r of 3" :key="boardRowKey(r)" :class="boardRowClasses">
                <board-cell
                    v-for="c of 3"
                    :key="boardCellKey(r, c)"
                    :id="(r - 1) * 3 + c"
                    :class="[{'bg-white': [2, 4, 6, 8].includes((r - 1) * 3 + c)} ,boardCellClasses]">
                </board-cell>
            </div>
        </div>
    `
});

let gameOver = false;
let p1 = true;
let boardValues = Array(9).fill(0);

Vue.component('board-cell', {
    props: ['myid', 'myclass'],
    data: function() {
        return {
            clicked: false,
            marker: ""
        }
    },
    methods : {
        onClick(event) {
            if (this.clicked || gameOver) {
                return
            }
            if (p1) {
                this.marker = "X";
                p1 = false;
                boardValues[parseInt(event.target.id) - 1] = 1;
                this.clicked = true;
            } else {
                this.marker = "O";
                p1 = true;
                boardValues[parseInt(event.target.id) - 1] = -1;
                this.clicked = true;
            }
            if (Math.abs(boardValues[0] + boardValues[4] + boardValues[8]) === 3 ||
            Math.abs(boardValues[2] + boardValues[4] + boardValues[6]) === 3) {
                gameOver = true;
            }
            for (let i = 0; i < 3; i++) {
                if (Math.abs(boardValues[i] + boardValues[i+3] + boardValues[i+6]) === 3 ||
                    Math.abs(boardValues[i] + boardValues[i+1] + boardValues[i+2]) === 3) {
                    gameOver = true;
                }
            }
        }
    },
    template: `
        <div
            :id="myid"
            :class="myclass"
            v-on:click="onClick"> {{marker}}
        </div>
    `
});

export default {
    data() {
        return {
            message: 'Welcome to the game!',
            playerNames: [],
            appClasses: ['w-100', 'h-100', 'p-5', 'd-flex', 'flex-column', 'align-items-center'],
            playerReady: {},
        }
    },
    created() {
        const self = this;
        window.setTimeout(() => {
            self.message = 'Ready to get started?';
            self.playerNames.push('Player 1', 'Player 2');
        }, 2000);
    },
    methods: {
        onPlayerReady(playerName, isReady) {
            this.$set(this.playerReady, playerName, isReady);
        }
    },
    computed: {
        bothPlayerReady() {
            gameOver = false;
            p1 = true;
            boardValues = Array(9).fill(0);
            return this.playerNames.length && 
                this.playerNames.map(playerName => this.playerReady[playerName])
                                .reduce((prevValue, currValue) => prevValue && currValue);
        }
    },
    template: `
        <div id="app" :class="appClasses">
            <game-title></game-title>
            <welcome-message :message="message" :player-names="playerNames"></welcome-message>
            <template v-if="playerNames.length">
                <ready-checkbox :name="playerNames[0]" v-on:player-ready="onPlayerReady"></ready-checkbox>
                <ready-checkbox :name="playerNames[1]" v-on:player-ready="onPlayerReady"></ready-checkbox>
            </template>
            <div v-else>
                <div class="spinner-grow text-primary" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
            <game-board v-if="bothPlayerReady"></game-board>
        </div>
    `
};