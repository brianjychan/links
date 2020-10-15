# Links

A React + AWS web app for you to save, comment on, and show off links. Easily add it your own static website.

Demo at https://brianjychan.com/links

Stack

- React + Typescript
- AWS Amplify

# Setup Instructions

Our goal is to integrate a React App into a static website. This works with any static website and hosting provider, and in our example we're using Github Pages. We currently do some hacky `mv`s here and there, but it works and we'll improve the build process in the future.

Table of Contents

- Clone the app and set up AWS
- Set up the React app
- Build and Deploy

### A. Fork the App and set up AWS

Start at the root of your GH pages site (which also has `_posts` and `_site`)

0. Fork this repo.

   - Press Fork on the upper right of this repo, `https://github.com/brianjychan/linkfeed.git`. Later, this is done to easily designate this project as a submodule of your parent directory (with your main website)
   - On your local machine, `cd` to the root of your website repository. If you're using Github Pages, this is the directory that contains `_site` and `_posts`.
   - Clone your forked repo. Run `$ git clone https://github.com/{username}/linkfeed.git`, replacing {username} with your GH username.
   - Change to the directory, `$ cd linkfeed`

1. Install the [aws amplify CLI](https://docs.amplify.aws/cli/start/install)

2. Now we will create a new AWS IAM user. This keeps permission and security from any of your other AWS projects.

   - `$ amplify configure`
   - Sign in to your AWS account.
   - ? region: Choose the region closest to you.
   - ? user name: Name it whatever you want the role to be. Such as `linkfeed-iam-user`
   - Complete creation of the user. Stay on the page with the access key information.
   - ? accessKeyId: Get this from the above page.
   - ? secretAccessKey: Get this from the above page.
   - ? Profile Name: Enter the same username with which you responded to "user name: " (in our case `linkfeed-iam-user`). This is what this IAM role is saved under locally.
   - Now you've set your amplify CLI up to have access keys for a specific role within your AWS account. This new profile's access keys are saved locally in `~/.aws`

3) Create/initialize the Amplify project in AWS.

   - Run `$ amplify init`
   - ? Enter a name for your environment: The default `dev` is fine.
   - ? Choose your default editor: Make the right choice.
   - ? Do you want to use an AWS profile? `Y`
   - ? Please choose the profile you want to use: Choose the profile you created in Step 1 (in our case `linkfeed-iam-user`)
   - ? Do you want to configure Lambda Triggers for Cognito? `N`

4) Push the Amplify project. This deploys our local API/auth/function code to the project.

   - Run `$ amplify push`
   - ? Are you sure you want to continue? `Y`
   - ? Do you want to update code for your updated GraphQL API `Y`
   - ? Do you want to generate GraphQL statements (queries, mutations and subscription) based on your schema types? This will overwrite your current graphql queries, mutations and subscriptions `Y`

5) Great, your AWS backend is set up.

### B. Set up the React App

Your backend works now, so it's time for you to be able to use it. We'll be working on the React app in `/src`.

0. Install our npm packages by running `$ npm install`
1. You need to create your personal account within your app so that only you can post. We're going to _temporarily_ introduce a signup portal for you to do this.
   - In `App/App.tsx`, uncomment `import { withAuthenticator }`
   - Go to the bottom of `App.tsx`. Comment out `export default AppWithProviders`. Uncomment the two replacement lines above.
2. Save your changes, then locally run the app using `npm run start`.
3. Follow through the Create Account flow.
   - Use your email for **both** the Username and Email fields. Phone number can be left blank.
   - Sign in afterwards.
4. Search `App.tsx` for `emailString`. Replace its value with the email you used. Extra bit of (**client-side only**) security, so even if someone else created an account, they'd also have to fumble with no UI for making a post. That's called paranoia
   - Now, you should be able to see the "New Post" box pop up.
5. Now that your profile is created, reverse the commenting changes you made in step 1.
   - Delete `import { withAuthenticator }`
   - Delete the setup version of exports at the bottom of the file.
   - Save your changes
6. Customize your Links App.
   - Add your desired profile photo as `src/assets/photo.png`. Try using a small, square image. This is imported in `App.tsx` and used as a small profile pic when you add a caption to a link
   - In `App.tsx`, update the `CHANNEL_MAP` such that its values are your channels / category names (e.g. `Gardening`, `Pottery`, `Martial Arts`, etc. ). The channel codes are used as identifiers but are otherwise completely arbitrary.
     - Channel codes are used by DynamoDB as primary keys, so you might want to follow their policy of making them evenly distributed, though it probably doesn't matter at this scale
   - If you want some channels to be private (links in them are only visible when logged in as you), add those channel codes to the `SECRET_CHANNELS` array. Note that this was quickly implemented by being filtered by the **client's browser**, so it's technically insecure. Use at your own discretion. We will update this soon.
   - Feel free to change the title, description, [opengraph tags](https://ogp.me/), etc. in `public/index.html`
   - If you want, don't forget to add a link to the `/links` path your from your homepage.
7. Edit `linkfeed/package.json` settings to fit your site.
   - In the `homepage: ` field, replace `yourdomain.com` with your website details
   - If you want the path to your app to be something other than `/links`, edit the word `links` in the `homepage` and `scripts: build:` fields. For example, if you want it to be `/urls`:
      - the `homepage: ` value should be `https://yourdomain.com/urls`
      - the `scripts:build:` command should be `react-scripts build && rm -rf ../urls && mv build ../urls`
   - See the [CRA docs](https://create-react-app.dev/docs/deployment/#building-for-relative-paths) for more info
   - If you're NOT using Jekyll or Github Pages, just make sure that the `build` folder ends up as a folder under your site root, with its name set as whatever you want the app's path on your website to be.

### C. Build and Deploy

0. Start in `/linkfeed`.
1. Run `$ npm run build`.
   - If you take a look at `src/package.json`; that command builds the RA, then moves the compiled `build` to a `links` folder in the repo root.
2. Tell Jekyll to ignore the uncompiled `linkfeed` source when creating the site.
   - `$ cd ..` back to your website's root.
   - Add the line `exclude: [linkfeed]` to your `_config.yml`. This tells Jekyll to not copy over the not-yet-compiled `linkfeed` source directory to `_site`, but it will still copy over the compiled build `links`.
3. To test locally, build your jekyll site. `$ jekyll serve` (this is what github pages does). Use the app at the `/links` path
4. Commit and push the entire website repo (with `_site`, `_posts`, and now `links`) to Github.
   - If you're setting up your Github Pages site / Jekyll for the first time, you can follow [this guide](https://help.github.com/en/github/working-with-github-pages/creating-a-github-pages-site-with-jekyll).
5. On the production version of your site, navigate to the `/links` path to use the app. This is where you can save links from now on.
   - Sign in by clicking the "© 2020" at the bottom of the screen.
   - Refresh the page after pressing Sign In.
   - Enjoy your site. Save and comment whatever you want

# Using the site

Table of Contents

- Using the site
- Updating the site

### D. Using the site

0. Sharing a link:

   - Share your link in the first box. If you want to post it with a comment, type it out in the second box.
   - Select a channel to complete the post
   - You need to refresh the page to see your newly added link
   - An asynchronous Lambda function listens to edits to the DDB, and then retrieves the title for any new links--you'll see it update in a few seconds. It sometimes fails with links from Twitter or Youtube, probably due to rate throttling on the Lambda function's IP address.

1. Adding a channel: in `App.tsx`, channels are hardcoded as magic values. So (at the moment), you can only add a channel

2. Sorting by Channel: Click a channel name under a link to view only links from that channel.

3. Pagination - This react App doesn't paginate or remember navigation history like Reddit or Hacker News, so pressing "Previous" or "Next" and using your browser's Back button will leave the website. You also can't share the URL to navigate to a specific page of results.

4. Pinning Links - Hover over a link and press "Pin" to pin it to the top of the first page. You can also "unpin" the currently pinned link. Refresh page to see updates

5. Bugs - Avoid posting non links; they'll be added to the page and then act as weird Anchor links to nothing

6. Making Edits: If you need to edit a post, you have to go into the [AWS DynamoDB console](https://console.aws.amazon.com/dynamodb) and manually search for the item in DDB. This includes changing the channel/caption of a post.

### E. Making Updates

0. Since we build our React App locally to create the `links` and `static` folder and prepare Jekyll to include them in the site, make sure to always run `$ npm run build` in `linkfeed` before pushing to github. Alternatively, if you use a different service besides Github Pages that lets you specify a build command (like Netlify), you can add this logic there or create your own build script.
1. Note that although `linkfeed/src/aws-exports.js` is included in `.gitignore`, the site still works because those variables are embedded into the compiled build after `$ npm run build`.

# Contributing

We welcome and encourage pull requests! Anything that makes the site more powerful while keeping it a template is particularly appreciated.

When making PR's, don't check in `amplify/team-provider-info.json`--this is meant to be used when sharing the same AWS project within a team.

# Thanks

Thanks to [@pranavsekhar](https://github.com/pranavsekhar) for patiently encouraging, testing, and improving early builds

And thanks to you if you try it out.
