# Obsidian Workout Plugin

This plugin is an exercise management plugin.
Edit the JSON file and write your own routine.
It creates a plan for each date based on your routine.

**How to use**

## JSON file edit

```json
{

"name": "TEMP ROUTINE", / enter the name of routine./
"workoutList": [
{
"workoutName": "SQUAT", /enter the name of workout/
"type": "WEIGHT", /type section, enter either 'WEIGHT' or 'BODYWEIGHT'/
"trainingWeight": 0, /enter the weight to start exercising
It can be set later, so it is recommended to enter 0. /
"weight": 0, /Please enter the weight
It can be set later, so it is recommended to enter 0./
"reps": 0 / Please enter the weight
It can be set later, so it is recommended to enter 0.
},
{
"workoutName": "BENCH PRESS",
"type": "WEIGHT",
"trainingWeight": 0,
"weight": 0,
"reps": 0,
},
],
"session": / This is the part where you set up a routine based on the workoutLists./[

{
"sessionname": "Volume Day" /enter the name of session/,
"workoutname": ["SQUAT", "BENCH PRESS", "DEADLIFT"] /
This is the part where you create a list of exercises to include in your routine./ ,
"reps": [5, 5, 5] /This is the part where you enter how many times you want to perform the index corresponding to the exercise./ ,
"sets": [5, 5, 1],
"weight": ["5RM * 90%", "5RM * 90%", "5RM * 90%"]
} => 이러한 부분은 ,


{
"sessionname": "Light/Recovery Day",
"workoutname": ["SQUAT", "OHP", "CHIN UPS", "BACK EXTENSION"],
"reps": [5, 5, 10, 10],
"sets": [2, 3, 3, 5],
"weight": ["5RM * 72%", "5RM * 72%", "bodyweight", "bodyweight"],
"add": [

[0, 0],

[0, 0],

[2.5, 0],

[2.5, 0]

]

},

{

"sessionname": "Intensity Day",

"workoutname": ["SQUAT", "BENCH PRESS", "POWER CLEAN"],

"reps": [5, 5, 5],

"sets": [1, 1, 3],

"weight": ["5RM * 100%", "5RM * 100%", "5RM * 90%"],

"add": [

[5, 0],

[2.5, 0],

[2.5, 0]

]

},

{

"sessionname": "Volume Day",

"workoutname": ["SQUAT", "OHP", "DEADLIFT"],

"reps": [5, 5, 5],

"sets": [5, 5, 1],

"weight": ["5RM * 90%", "5RM * 90%", "5RM * 90%"],

"add": [

[0, 0],

[0, 0],

[5, 0]

]

},

{

"sessionname": "Light/Recovery Day",

"workoutname": ["SQUAT", "BENCH PRESS", "CHIN UPS", "BACK EXTENSION"],

"reps": [5, 5, 10, 10],

"sets": [2, 3, 3, 5],

"weight": ["5RM * 72%", "5RM * 72%", "bodyweight", "bodyweight"],

"add": [

[0, 0],

[0, 0],

[2.5, 0],

[2.5, 0]

]

},

{

"sessionname": "Intensity Day",

"workoutname": ["SQUAT", "OHP", "POWER CLEAN"],

"reps": [5, 5, 5],

"sets": [1, 1, 3],

"weight": ["5RM * 100%", "5RM * 100%", "5RM * 90%"],

"add": [

[5, 0],

[2.5, 0],

[2.5, 0]

]

}

],

  

"week": [

["SESSION_1", "SESSION_4", "SESSION_1", "SESSION_4", "SESSION_1", "SESSION_4"],

[],

["SESSION_2", "SESSION_5", "SESSION_2", "SESSION_5", "SESSION_2", "SESSION_5"],

[],

["SESSION_3", "SESSION_6", "SESSION_3", "SESSION_6", "SESSION_3", "SESSION_6"],

[],

[]

]

}

```







This sample plugin demonstrates some of the basic functionality the plugin API can do.
- Adds a ribbon icon, which shows a Notice when clicked.
- Adds a command "Open Sample Modal" which opens a Modal.
- Adds a plugin setting tab to the settings page.
- Registers a global click event and output 'click' to the console.
- Registers a global interval which logs 'setInterval' to the console.

## First time developing plugins?

Quick starting guide for new plugin devs:

- Check if [someone already developed a plugin for what you want](https://obsidian.md/plugins)! There might be an existing plugin similar enough that you can partner up with.
- Make a copy of this repo as a template with the "Use this template" button (login to GitHub if you don't see it).
- Clone your repo to a local development folder. For convenience, you can place this folder in your `.obsidian/plugins/your-plugin-name` folder.
- Install NodeJS, then run `npm i` in the command line under your repo folder.
- Run `npm run dev` to compile your plugin from `main.ts` to `main.js`.
- Make changes to `main.ts` (or create new `.ts` files). Those changes should be automatically compiled into `main.js`.
- Reload Obsidian to load the new version of your plugin.
- Enable plugin in settings window.
- For updates to the Obsidian API run `npm update` in the command line under your repo folder.

## Releasing new releases

- Update your `manifest.json` with your new version number, such as `1.0.1`, and the minimum Obsidian version required for your latest release.
- Update your `versions.json` file with `"new-plugin-version": "minimum-obsidian-version"` so older versions of Obsidian can download an older version of your plugin that's compatible.
- Create new GitHub release using your new version number as the "Tag version". Use the exact version number, don't include a prefix `v`. See here for an example: https://github.com/obsidianmd/obsidian-sample-plugin/releases
- Upload the files `manifest.json`, `main.js`, `styles.css` as binary attachments. Note: The manifest.json file must be in two places, first the root path of your repository and also in the release.
- Publish the release.

> You can simplify the version bump process by running `npm version patch`, `npm version minor` or `npm version major` after updating `minAppVersion` manually in `manifest.json`.
> The command will bump version in `manifest.json` and `package.json`, and add the entry for the new version to `versions.json`

## Adding your plugin to the community plugin list

- Check https://github.com/obsidianmd/obsidian-releases/blob/master/plugin-review.md
- Publish an initial version.
- Make sure you have a `README.md` file in the root of your repo.
- Make a pull request at https://github.com/obsidianmd/obsidian-releases to add your plugin.

## How to use

- Clone this repo.
- Make sure your NodeJS is at least v16 (`node --version`).
- `npm i` or `yarn` to install dependencies.
- `npm run dev` to start compilation in watch mode.

## Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.

## Improve code quality with eslint (optional)
- [ESLint](https://eslint.org/) is a tool that analyzes your code to quickly find problems. You can run ESLint against your plugin to find common bugs and ways to improve your code. 
- To use eslint with this project, make sure to install eslint from terminal:
  - `npm install -g eslint`
- To use eslint to analyze this project use this command:
  - `eslint main.ts`
  - eslint will then create a report with suggestions for code improvement by file and line number.
- If your source code is in a folder, such as `src`, you can use eslint with this command to analyze all files in that folder:
  - `eslint .\src\`

## Funding URL

You can include funding URLs where people who use your plugin can financially support it.

The simple way is to set the `fundingUrl` field to your link in your `manifest.json` file:

```json
{
    "fundingUrl": "https://buymeacoffee.com"
}
```

If you have multiple URLs, you can also do:

```json
{
    "fundingUrl": {
        "Buy Me a Coffee": "https://buymeacoffee.com",
        "GitHub Sponsor": "https://github.com/sponsors",
        "Patreon": "https://www.patreon.com/"
    }
}
```

## API Documentation

See https://github.com/obsidianmd/obsidian-api











# Obsidian Sample Plugin

This is a sample plugin for Obsidian (https://obsidian.md).

This project uses Typescript to provide type checking and documentation.
The repo depends on the latest plugin API (obsidian.d.ts) in Typescript Definition format, which contains TSDoc comments describing what it does.

**Note:** The Obsidian API is still in early alpha and is subject to change at any time!

This sample plugin demonstrates some of the basic functionality the plugin API can do.
- Adds a ribbon icon, which shows a Notice when clicked.
- Adds a command "Open Sample Modal" which opens a Modal.
- Adds a plugin setting tab to the settings page.
- Registers a global click event and output 'click' to the console.
- Registers a global interval which logs 'setInterval' to the console.

## First time developing plugins?

Quick starting guide for new plugin devs:

- Check if [someone already developed a plugin for what you want](https://obsidian.md/plugins)! There might be an existing plugin similar enough that you can partner up with.
- Make a copy of this repo as a template with the "Use this template" button (login to GitHub if you don't see it).
- Clone your repo to a local development folder. For convenience, you can place this folder in your `.obsidian/plugins/your-plugin-name` folder.
- Install NodeJS, then run `npm i` in the command line under your repo folder.
- Run `npm run dev` to compile your plugin from `main.ts` to `main.js`.
- Make changes to `main.ts` (or create new `.ts` files). Those changes should be automatically compiled into `main.js`.
- Reload Obsidian to load the new version of your plugin.
- Enable plugin in settings window.
- For updates to the Obsidian API run `npm update` in the command line under your repo folder.

## Releasing new releases

- Update your `manifest.json` with your new version number, such as `1.0.1`, and the minimum Obsidian version required for your latest release.
- Update your `versions.json` file with `"new-plugin-version": "minimum-obsidian-version"` so older versions of Obsidian can download an older version of your plugin that's compatible.
- Create new GitHub release using your new version number as the "Tag version". Use the exact version number, don't include a prefix `v`. See here for an example: https://github.com/obsidianmd/obsidian-sample-plugin/releases
- Upload the files `manifest.json`, `main.js`, `styles.css` as binary attachments. Note: The manifest.json file must be in two places, first the root path of your repository and also in the release.
- Publish the release.

> You can simplify the version bump process by running `npm version patch`, `npm version minor` or `npm version major` after updating `minAppVersion` manually in `manifest.json`.
> The command will bump version in `manifest.json` and `package.json`, and add the entry for the new version to `versions.json`

## Adding your plugin to the community plugin list

- Check https://github.com/obsidianmd/obsidian-releases/blob/master/plugin-review.md
- Publish an initial version.
- Make sure you have a `README.md` file in the root of your repo.
- Make a pull request at https://github.com/obsidianmd/obsidian-releases to add your plugin.

## How to use

- Clone this repo.
- Make sure your NodeJS is at least v16 (`node --version`).
- `npm i` or `yarn` to install dependencies.
- `npm run dev` to start compilation in watch mode.

## Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.

## Improve code quality with eslint (optional)
- [ESLint](https://eslint.org/) is a tool that analyzes your code to quickly find problems. You can run ESLint against your plugin to find common bugs and ways to improve your code. 
- To use eslint with this project, make sure to install eslint from terminal:
  - `npm install -g eslint`
- To use eslint to analyze this project use this command:
  - `eslint main.ts`
  - eslint will then create a report with suggestions for code improvement by file and line number.
- If your source code is in a folder, such as `src`, you can use eslint with this command to analyze all files in that folder:
  - `eslint .\src\`

## Funding URL

You can include funding URLs where people who use your plugin can financially support it.

The simple way is to set the `fundingUrl` field to your link in your `manifest.json` file:

```json
{
    "fundingUrl": "https://buymeacoffee.com"
}
```

If you have multiple URLs, you can also do:

```json
{
    "fundingUrl": {
        "Buy Me a Coffee": "https://buymeacoffee.com",
        "GitHub Sponsor": "https://github.com/sponsors",
        "Patreon": "https://www.patreon.com/"
    }
}
```

## API Documentation

See https://github.com/obsidianmd/obsidian-api
