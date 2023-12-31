# Mapeo Config Renderer

[![.github/workflows/publish-npm.yml](https://github.com/digidem/mapeo-config-renderer/actions/workflows/publish-npm.yml/badge.svg?branch=main)](https://github.com/digidem/mapeo-config-renderer/actions/workflows/publish-npm.yml)

Mapeo Config Renderer is a command line application that provides a visual interface for Mapeo configuration files from a local folder. It allows you to view the presets and icons defined in the Mapeo configuration project.

## Features

- Visual interface for Mapeo configuration files
- Displays presets and icons
- Reloads on config change

## Usage

You can run Mapeo Config Renderer using `npx` or `npm`. Inside a Mapeo configuration folder run:
```
npx mapeo-config-renderer
```
Or to install Mapeo Config Renderer globally, use the following command:
```
npm i -g mapeo-config-renderer
```


Open your browser on [http://localhost:5000](http://localhost:5000).

You can also pass an argument `<mapeo config folder path>` with the path to your Mapeo configuration folder, eg.: `npx mapeo-config-renderer /path/to/my-config`


## Development

In the project directory, you can run:

- `npm start`: Runs the app in the development mode. Open [http://localhost:5000](http://localhost:5000) and [http://localhost:3000](http://localhost:3000) to view it in your browser. Api doesn't auto reload.
- `npm run build`: Builds the app for production to the `build` folder.
- `npm run dev`: Starts both api server and React app in dev mode
## Learn More

Learn more about Mapeo at [Mapeo.app](https://mapeo.app).

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

