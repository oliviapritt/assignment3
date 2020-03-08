import { madlibs } from './resources/resources.js';

console.log(`${madlibs.length} madlibs loaded`);

//madIndex is the random index of the madlab to use
let madIndex = Math.floor(Math.random() * (madlibs.length - 1));

//fields is an array holding each field of a madlib
let fields = madlibs[madIndex].content.match(/\[([^\])]*)\]/g);
console.log(fields);

Vue.component('inputs', {
    props: {
        'num_fields': {
            type: Number,
            default: 0,
        },
        'user_inputs': {
            type: Array,
            default: () => []
        }
    },
    methods: {
        get_id(i) {
            return `id-${i}-${fields[i]}`;
        },
        get_field(i) {
            i = i - 1
            return `${fields[i]}`;
        },
        onTextEntered: function(text_input, index) {
            this.$emit('message-pass', text_input, index);
        }
    },
    template: `
        <div>
            <input-field v-on:text-entered="onTextEntered" v-for="r in num_fields" v-bind:key="get_id(r)" :id="get_id(r)" :placeholder="get_field(r)" :index="r" :value="user_inputs[r]"/>
        </div>
    `,
});

Vue.component('input-field', {
    props: {
        'value': String,
        'index': Number,
        'id': String,
        'placeholder': {
            type: String,
            default: "",
        }
    },
    methods: {
        input_func: function (event) {
            this.$emit('text-entered', event.target.value, this.index);
        }
    },
    template: `
        <input type="text" :id="id" :placeholder="placeholder" v-on:keyup.enter="input_func" :value="value">
    `,
});
     
export default {
    data() {
        return {
            user_inputs: Array(fields.length + 1).fill(""),
            message: madlibs[madIndex].content,
            outputs: fields,
            indices: Array.from(Array(fields.length).keys()),
            num_fields: fields.length
        }
    },
    methods: {
        handleReset: function() {
            madIndex = Math.floor(Math.random() * (madlibs.length - 1));
            this.message = madlibs[madIndex].content;
            fields = madlibs[madIndex].content.match(/\[([^\])]*)\]/g);
            this.user_inputs = Array(fields.length + 1).fill("");
            this.indices = Array.from(Array(fields.length).keys())
            this.outputs = fields
            this.num_fields = fields.length

        },
        onMessageReceived: function(text, i) {
            let currIndex = this.indices.indexOf(i-1);
            if (currIndex === -1) {
                return;
            }
            this.outputs[currIndex] = "<strong>" + text + "</strong>";
            this.message = replaceItems(this.message, this.outputs);
            this.outputs.splice(currIndex, 1);
            this.indices.splice(currIndex, 1);
        }
    },
    template: `
        <div id="main" role="main" >
            <button id="reset" v-on:click="handleReset" role="button">Reset</button>
            <div id="left">
                <inputs :user_inputs="user_inputs" :num_fields="num_fields" v-on:message-pass="onMessageReceived"></inputs>
            </div>
            <div id="right" >
                <span v-html="message"></span>
            </div>
        </div>
    `
};

function replaceItems(mad,items) {
    let i = 0;
    let r = mad.replace(/\[([^\])]*)\]/g,function (mat,p1,off,str) {
       return items[i++];
     });
    return r;
 } 