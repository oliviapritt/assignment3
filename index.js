const url = "http://ec2-54-172-96-100.compute-1.amazonaws.com/feed/random?q=noodle";

// var intervalID = window.setInterval(getTweets, 5000);

Vue.component('tweet', {
    props: {
        'profile_photo': String,
        'user_name': String,
        'created_at': String,
        'text': String
    },
    template: `
        <div class="tweet">
            <img class="profile-photo" :src="profile_photo" alt="user_name">
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

const app = new Vue({
    el: '#app',
    data: {
        tweetSet: new Set(),
        tweetContainer: document.getElementById('tweet-container')
    },
    methods: {
        // getTweets: function() {
        //     fetch(url)
        //     .then(res => res.json())
        //     .then(data => {
        //         const tweets = data.statuses;
        //         refreshTweets(tweets);
        //         console.log(tweets);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })
        // },
        // refreshTweets: function(tweets) {
        //     let sorted = tweets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        //     sorted.forEach((tweetObject) => {
        //         const tweet = document.createElement("div");
        //         tweet.setAttribute("class", "tweet");
        //         const tweetImage = document.createElement(
        //         "img");
        //         tweetImage.setAttribute("class", "profile-photo");
        //         const defaultPhoto = "./images/no_photo.png";
        //         tweetImage.setAttribute('src', tweetObject.user.profile_image_url_https);
        //         tweetImage.setAttribute('alt', tweetObject.user.name + "'s profile photo");
        //         tweetImage.setAttribute('onError', "this.onerror=null;this.src=\'" + defaultPhoto + "\';");
        //         const tweetContent = document.createElement("div");
        //         tweetContent.setAttribute("class", "tweet-text");
        //         const tweetDivOne = document.createElement("div");
        //         tweetDivOne.setAttribute("class", "col2row1");
        //         const tweetDivTwo = document.createElement("div");
        //         tweetDivTwo.setAttribute("class", "col2row2");
        //         const tweeterName = document.createTextNode(tweetObject.user.name + "  " + moment(tweetObject.created_at).format("LLL"));
        //         const tweetText = document.createTextNode(tweetObject.text);
        //         tweetDivOne.appendChild(tweeterName);
        //         tweetDivTwo.appendChild(tweetText);
        //         tweetContent.appendChild(tweetDivOne);
        //         tweetContent.appendChild(tweetDivTwo);
        //         tweet.appendChild(tweetImage);
        //         tweet.appendChild(tweetContent);
        //         if (!tweetSet.has(tweetObject.id)) {
        //             tweetContainer.appendChild(tweet);
        //             tweetSet.add(tweetObject.id)
        //         }
        //     });
        //     myFilter();
        // }
    }
})

function myFilter() {
    input = document.getElementById("search-term");
    filter = input.value.toLowerCase();
    var childDivs = tweetContainer.getElementsByClassName("tweet");
    for( i = 0; i < childDivs.length; i++ ) {
        var childDiv = childDivs[i];
        textValue = childDiv.textContent || childDiv.innerText;
        if (textValue.toLowerCase().indexOf(filter) > -1) {
            childDiv.style.display = "";
        } else {
            childDiv.style.display = "none";
        }
    }
}

// function handleToggle() {
//     console.log("handle toggle")
//     var checkBox = document.getElementById("checkbox");
//     if (checkBox.checked) {
//         console.log("stopping")
//         window.clearInterval(intervalID);
//     } else {
//         console.log("starting")
//         intervalID = window.setInterval(getTweets, 5000);
//     }
// }