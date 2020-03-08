import TicTacToe from "./tic-tac-toe.js";
import MadLibs from "./madlibs.js";

const url = "http://ec2-54-172-96-100.compute-1.amazonaws.com/feed/random?q=noodle";

Vue.component('tweet', {
    props: {
        'test': String,
        'profile_photo': String,
        'user_name': String,
        'created_at': String,
        'text': String,
        'background_color': String
    },
    template: `
        <div class="tweet" :style="background_color">
            <img class="profile-photo" :src="profile_photo" alt="profile photo">
            <div class="tweet-text">
                <div class="col2row1">
                    {{user_name}}
                    {{created_at}}
                </div>
                <div class="col2row2">
                    {{text}}
                </div>
            </div>
        </div>
    `
});

Vue.component('feed', {
    props: {
        'tweet_objects': {
            type: Array,
            default: () => []
        }
    },
    template: `
        <div>
            <div v-for="tweet_object in tweet_objects">
                <tweet
                :profile_photo="tweet_object.user.profile_image_url"
                :user_name="tweet_object.user.name"
                :created_at="tweet_object.created_at"
                :text="tweet_object.text"
                :background_color="tweet_object.style"></tweet>
            </div>
        </div>
    `
});

Vue.component('search', {
    methods: {
        input_operation: function(event) {
            console.log(event.target.value)
            this.$emit('searchfilter', event.target.value)
        }
    },
    template: `
        <input type="search" placeholder="What are you looking for?" v-on:input="input_operation">
    `
});

Vue.component('make-tweet', {
    methods: {
        input: function(event) {
            console.log(event.target.value)
            this.$emit('post', event.target.value)
        }
    },
    template: `
        <textarea placeholder="What's happening?" style="height:150px;width: 200px;max-width:200px;max-height:150px" v-on:input="input"></textarea>
    `
});

const routes = [
    { path: '/tictactoe', component: TicTacToe },
    { path: '/madlibs', component: MadLibs }
]
  
const router = new VueRouter({
    routes
})

const app = new Vue({
    el: '#app',
    data: {
        tweetSet: new Set(),
        tweetList: [],
        masterList: [],
        myTweet: ""
    },
    mounted() {
        this.getTweets();
        this.onScroll();
    },
    router,
    methods: {
        getTweets: function() {
            fetch(url)
            .then(res => res.json())
            .then(data => {
                const tweets = data.statuses;
                for (const tweetObject of tweets) {
                    if (!this.tweetSet.has(tweetObject.id)) {
                        this.masterList.push(tweetObject);
                        this.tweetList.push(tweetObject);
                        this.tweetSet.add(tweetObject.id)
                    }
                };
                this.sort();
                console.log(this.tweetList);
            })
            .catch(err => {
                console.log(err);
            })
        },
        onSearch: function(input) {
            console.log(input)
            this.tweetList = this.masterList.filter(tweet => tweet.text.toLowerCase().includes(input.toLowerCase()));
        },
        onPost: function(tweet) {
            this.myTweet = tweet;
        },
        onClick: function() {
            let tweet = {style: "background-color: lightcyan", text: this.myTweet, created_at: new Date(), user: {name: "Penguin", profile_image_url: "./images/penguin.png"}
            }
            this.masterList.push(tweet);
            this.tweetList.push(tweet);
            this.sort();
        },
        sort: function() {
            this.masterList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            this.tweetList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        },
        onScroll: function() {
            window.addEventListener('scroll', 
                this.update
            );
        },
        update: function() {
            if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
                this.getTweets();
            }
        }
    }
})