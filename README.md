# Introduction
Source Code for NAPCOM.  An Electron based application for the analasys of highway longevity. 

Currently the application can build a multi-platform desktop application for Windows, MAC, and linux.  Web-based application is not currently supported.

Current Development Stack
- Electron
- Angular
- Typscript
- Bootstrap
- SASS

## Requirements
This application depends on NodeJS and it's package manager 'npm'.  Versions used in this build were:
- Node v16.14.0
- npm 8.3.1

The easiest way to install Node is the use of a package called 'nvm'.  Depending on your system 'nvm' can be installed using the following links.
- MAC -  https://tecadmin.net/install-nvm-macos-with-homebrew/
- WINDOWS - https://dev.to/skaytech/how-to-install-node-version-manager-nvm-for-windows-10-4nbi
- LINUX - https://tecadmin.net/install-nodejs-with-nvm/

Once installed.  Use the instructions with 'nvm' to install node for your system.
## Getting Started


Clone this repository locally:

``` bash
git clone https://github.com/maximegris/angular-electron.git
```

Install dependencies with npm:

``` bash
npm install
```

If you want to generate Angular components with Angular-cli , you **MUST** install `@angular/cli` in npm global context.
Please follow [Angular-cli documentation](https://github.com/angular/angular-cli) if you had installed a previous version of `angular-cli`.

``` bash
npm install -g @angular/cli
```

## To build for development

- **in a terminal window** ->  npm run electron:local


## Project structure

###Folder Structure
| Folder       | Description                                                        |
|--------------|--------------------------------------------------------------------|
| app          | Electron main process folder (NodeJS)                              |
| src          | All applicaiton code. (Angular application modules)                |
| src/electron | electron specific code and services (NodeJS)                       |
| src/gui      | primary GUI components (Angular)                                   |
| src/home     | home page (Angular)                                                |
| src/main     | framework for application layout (Angular)                         |
| src/service  | UI services (Angular)                                              |
| src/shared   | shared components and directives (Angular)                         |
| assets       | images and file assets                                             |
| environments | definition of application environments (not currently implemented) |
| styles       | global style sheets.                                               |

###Key Files
| File               | Description                                                        |
|--------------------|--------------------------------------------------------------------|
| package.json       | NodeJS packages and build scripts                                  |
| angular.json       | Angular configuration (no need to touch)                           |
| tsconfig.json      | Typescript configuration (no need to touch)                        |
| material.module.ts | imports material modules                                           |
| app.module.ts      | application module                                                 |
| index.html         | UI entry point                                                     |
| styles.scss        | entry point for all styles sheet (scss)                            |
| main.ts            | application entry point                                            |                                            |

## Use Electron / NodeJS libraries

3rd party libraries used in electron's main process (like an ORM) have to be added in `dependencies` of `app/package.json`.
This sample project runs in both modes (web and electron). To make this work, **you have to import your dependencies the right way**. \

## Use "web" 3rd party libraries (like angular, material, bootstrap, ...)

3rd party libraries used in electron's renderer process (like angular) have to be added in `dependencies` of `package.json`. \
Please check `providers/electron.service.ts` to watch how conditional import of libraries has to be done when using NodeJS / 3rd party libraries in renderer context (i.e. Angular).

## Add a dependency with ng-add

You may encounter some difficulties with `ng-add` because this project doesn't use the defaults `@angular-builders`. \
For example you can find [here](HOW_TO.md) how to install Angular-Material with `ng-add`.

## Browser mode

Maybe you only want to execute the application in the browser with hot reload? Just run `npm run ng:serve:web`.

## Included Commands

|Command|Description|
| ---- | ---- |
|`npm run ng:serve`| Execute the app in the browser |
|`npm run build`| Build the app. Your built files are in the /dist folder. |
|`npm run build:prod`| Build the app with Angular aot. Your built files are in the /dist folder. |
|`npm run electron:local`| Builds your application and start electron
|`npm run electron:build`| Builds your application and creates an app consumable based on your operating system |

**Your application is optimised. Only /dist folder and NodeJS dependencies are included in the final bundle.**

## You want to use a specific lib (like rxjs) in electron main thread ?

YES! You can do it! Just by importing your library in npm dependencies section of `app/package.json` with `npm install --save XXXXX`. \
It will be loaded by electron during build phase and added to your final bundle. \
Then use your library by importing it in `app/main.ts` file. Quite simple, isn't it?

## E2E Testing

E2E Test scripts can be found in `e2e` folder.

|Command|Description|
| ---- | ---- |
|`npm run e2e`| Execute end to end tests |

Note: To make it work behind a proxy, you can add this proxy exception in your terminal  
`export {no_proxy,NO_PROXY}="127.0.0.1,localhost"`

## Debug with VsCode

[VsCode](https://code.visualstudio.com/) debug configuration is available! In order to use it, you need the extension [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome).

Then set some breakpoints in your application's source code.

Finally from VsCode press **Ctrl+Shift+D** and select **Application Debug** and press **F5**.

Please note that Hot reload is only available in Renderer process.

## Branch & Packages version

- Angular 4 & Electron 1 : Branch [angular4](https://github.com/maximegris/angular-electron/tree/angular4)
- Angular 5 & Electron 1 : Branch [angular5](https://github.com/maximegris/angular-electron/tree/angular5)
- Angular 6 & Electron 3 : Branch [angular6](https://github.com/maximegris/angular-electron/tree/angular6)
- Angular 7 & Electron 3 : Branch [angular7](https://github.com/maximegris/angular-electron/tree/angular7)
- Angular 8 & Electron 7 : Branch [angular8](https://github.com/maximegris/angular-electron/tree/angular8)
- Angular 9 & Electron 7 : Branch [angular9](https://github.com/maximegris/angular-electron/tree/angular9)
- Angular 10 & Electron 9 : Branch [angular10](https://github.com/maximegris/angular-electron/tree/angular10)
- Angular 11 & Electron 12 : Branch [angular10](https://github.com/maximegris/angular-electron/tree/angular11)
- Angular 12 & Electron 13 : (master)

[maintained-badge]: https://img.shields.io/badge/maintained-yes-brightgreen
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg
[license]: https://github.com/maximegris/angular-electron/blob/master/LICENSE.md
[prs-badge]: https://img.shields.io/badge/PRs-welcome-red.svg
[prs]: http://makeapullrequest.com

[linux-build-badge]: https://github.com/maximegris/angular-electron/workflows/Linux%20Build/badge.svg
[linux-build]: https://github.com/maximegris/angular-electron/actions?query=workflow%3A%22Linux+Build%22
[macos-build-badge]: https://github.com/maximegris/angular-electron/workflows/MacOS%20Build/badge.svg
[macos-build]: https://github.com/maximegris/angular-electron/actions?query=workflow%3A%22MacOS+Build%22
[windows-build-badge]: https://github.com/maximegris/angular-electron/workflows/Windows%20Build/badge.svg
[windows-build]: https://github.com/maximegris/angular-electron/actions?query=workflow%3A%22Windows+Build%22

[github-watch-badge]: https://img.shields.io/github/watchers/maximegris/angular-electron.svg?style=social
[github-watch]: https://github.com/maximegris/angular-electron/watchers
[github-star-badge]: https://img.shields.io/github/stars/maximegris/angular-electron.svg?style=social
[github-star]: https://github.com/maximegris/angular-electron/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20angular-electron!%20https://github.com/maximegris/angular-electron%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/maximegris/angular-electron.svg?style=social
