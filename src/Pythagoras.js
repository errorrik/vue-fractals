import { interpolateViridis } from 'd3-scale';
import Vue from 'vue';


Math.deg = function(radians) {
  return radians * (180 / Math.PI);
};

const memoizedCalc = function () {
    const memo = {};

    const key = ({ w, heightFactor, lean }) => [w, heightFactor, lean].join('-');

    return (args) => {

        const memoKey = key(args);

        if (memo[memoKey]) {
            return memo[memoKey];
        }
        else {

            const { w, heightFactor, lean } = args;

            const trigH = heightFactor*w;

            const result = {
                nextRight: Math.sqrt(trigH**2 + (w * (.5+lean))**2),
                nextLeft: Math.sqrt(trigH**2 + (w * (.5-lean))**2),
                A: Math.deg(Math.atan(trigH / ((.5-lean) * w))),
                B: Math.deg(Math.atan(trigH / ((.5+lean) * w)))
            };

            memo[memoKey] = result;

            return result;
        }
    }

}();

var Pythagoras = {

    props: [
        'left',
        'right',
        'x',
        'y',
        'w',
        'maxlvl',
        'lvl',
        'heightFactor',
        'lean'
    ],


    data() {
        return {}
    },

    template: `

        <g :transform="gTransform">
            <rect
                :width="w" :height="w"
                x="0" y="0"
                :style="rectStyle" />

            <pythagoras
                v-if="hasNext"
                :w="nextLeft"
                :x="0"
                :y="- nextLeft"
                :lvl="lvl + 1"
                :maxlvl="maxlvl"
                :heightFactor="heightFactor"
                :lean="lean"
                :left="true" />

            <pythagoras
                v-if="hasNext"
                :w="nextRight"
                :x="w - nextRight"
                :y="-nextRight"
                :lvl="lvl + 1"
                :maxlvl="maxlvl"
                :heightFactor="heightFactor"
                :lean="lean"
                :right="true" />

        </g>
    `,

    computed: {

        ret: function() {

            var ret = memoizedCalc({
                w: this.w,
                heightFactor: this.heightFactor,
                lean: this.lean
            });

            return ret;

        },

        rectStyle: function() {
            return 'fill:' + interpolateViridis(this.lvl / this.maxlvl);
        },

        nextRight: function() {
            return this.ret['nextRight'];
        },

        nextLeft: function() {
            return this.ret['nextLeft'];
        },

        hasNext: function() {
            return this.lvl < this.maxlvl && this.w > 1;
        },

        gTransform: function() {

            const { w, x, y } = this;

            const { nextRight, nextLeft, A, B } = this.ret;

            let rotate = '';

            if (this.left) {
                rotate = `rotate(${-A} 0 ${w})`;
            }
            else if (this.right) {
                rotate = `rotate(${B} ${w} ${w})`;
            }

            return `translate(${x} ${y}) ${rotate}`;

        }
    }

};


Pythagoras.components = {
    pythagoras: Pythagoras
};

export default Pythagoras;
