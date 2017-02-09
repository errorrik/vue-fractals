import logo from './logo.png';
import './App.css';
import { select as d3select, mouse as d3mouse } from 'd3-selection';
import { scaleLinear } from 'd3-scale';

import Pythagoras from './Pythagoras';


function throttleWithRAF(fn) {
    let running = false
    return function() {
        if (running) return
        running = true
        window.requestAnimationFrame(() => {
            fn.apply(this, arguments)
            running = false
        })
    }
}

export default {

    components: {
        'pythagoras': Pythagoras
    },

    template: `
        <div class="App">
            <div class="App-header">
                <img :src="logo" class="App-logo" alt="logo" />
                <h2>This is a dancing Pythagoras tree</h2>
            </div>
            <p class="App-intro">
                <svg ref="svg" :width="svg.width" :height="svg.height"
                    style="border: 1px solid lightgray">

                    <pythagoras :w="baseW"
                                :h="baseW"
                                :heightFactor="heightFactor"
                                :lean="lean"
                                :x="svg.width / 2 - 40"
                                :y="svg.height - baseW"
                                :lvl="0"
                                :maxlvl="currentMax" />

                </svg>
            </p>
        </div>
    `,


    data: function() {
        return {
            logo: logo,
            svg: {
                width: 1280,
                height: 600
            },
            realMax: 11,
            currentMax: 0,
            baseW: 80,
            heightFactor: 0,
            lean: 0
        };
    },

    mounted() {
        d3select(this.$refs.svg).on('mousemove', this.onMouseMove.bind(this));
        this.next();
    },

    methods: {
        next() {

            let currentMax = this.currentMax;
            let realMax = this.realMax;

            if (currentMax < realMax) {
                this.currentMax = currentMax + 1;
                setTimeout(this.next.bind(this), 500);
            }

        },

        update: throttleWithRAF(function (x, y) {
            const scaleFactor = scaleLinear()
                .domain([this.svg.height, 0])
                .range([0, 0.8])
            const scaleLean = scaleLinear()
                .domain([0, this.svg.width / 2, this.svg.width])
                .range([0.5, 0, -0.5])
            this.heightFactor = scaleFactor(y)
            this.lean = scaleLean(x)
        }),

        onMouseMove(event) {

            const [x, y] = d3mouse(this.$refs.svg);

            this.update(x, y);
        }
    }

}

