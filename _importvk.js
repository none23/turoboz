var request = require('request');
var request = require('request');
request('https://api.vk.com/method/wall.get?owner_id=-33948424&offset=3&count=3&filter=owner&extended=1&v=5.7', function (error, response, body) {
    if (!error && response.statusCode === 200) {
        data = JSON.parse(body);
        posts = data.response.items;
        profiles = data.response.profiles;
        groups = data.response.groups;
        latest_post = posts[0];
        console.log(posts);
        console.log("\n\n\n");
        console.log(profiles);
        console.log("\n\n\n");
        console.log(groups);
        console.log("\n\n\n");
        console.log(latest_post.copy_history[0].attachments);
    }
})
