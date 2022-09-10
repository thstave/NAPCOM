# Introduction
Source Code for NAPCOM.  An Electron based application for the analysis of relative responsibilities of various vehicle types for pavement damage . 

Currently the application can build a multi-platform desktop application for Windows, MAC, and linux.  Web-based application is not currently supported.

Current Development Stack
- Electron
- Angular
- Material
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
git clone https://github.com/thstave/NAPCOM.git
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

- **in a terminal window** ->  ```npm run electron:local```

## Project structure

### Folder Structure

| Folder           | Description                                                        |
|------------------|--------------------------------------------------------------------|
| app              | Electron main process folder (NodeJS)                              |
| src              | All applicaiton code. (Angular application modules)                |
| src/app          | the application code                                               |
| src/app/electron | electron specific code and services (NodeJS)                       |
| src/app/gui      | primary GUI components (Angular)                                   |
| src/app/home     | home page (Angular)                                                |
| src/app/main     | framework for application layout (Angular)                         |
| src/app/service  | UI services (Angular)                                              |
| src/app/shared   | shared components and directives (Angular)                         |
| src/assets       | images and file assets (need to be replaced with more relevant)    |
| src/environments | definition of application environments (not currently implemented) |
| src/styles       | global style sheets.                                               |


### Files of Note

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


## Themes
Angular Material themes are used for all colors and font declarations.  All color (and font) definitions should be placed in theme files and use colors based on the theme's color palette.

Each component that utilizes the theme has a second style sheet included with it.  These files are located with the component definition and end with ```-theme.scss```.

For consistency, these themes should define the mixin ```@mixin theme($theme)``` which should be included in the ```styles/_themes.scss```.

For more information on Angular Material themes.
```https://material.angular.io/guide/theming```

**Currently, there may be warnings on duplicate themes.  For now these may be ignored.

## Data
Currently the default directory is ```../Data```.  It is recommended that the existing CSV files be placed in this directory.  At this time there is no option to change the default directory.

The directory can always be changed once the application is started.


