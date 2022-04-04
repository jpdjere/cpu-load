
# CPU Load Observability Monitor

A web application POC (proof-of-concept) for a CPU load monitoring application. 

## App Bootstrapping

Main application is was bootstrapped using `express-generator-typescript`[https://github.com/seanpmaxwell/express-generator-typescript].  

The React Frontend, created using [`create-react-app`](https://github.com/facebook/create-react-app), is found inside the `src/client` directory.

## Development Instructions

1. On the `root`, install Node dependencies:
```
yarn 
```

2. Install `client` dependencies, running the command:
```
cd src/client && yarn && cd ../..
```

3. Start concurrently the Node/Express.js backend server and the React dev server with:

```
yarn start:dev
```

4. Navigate to the development build in `localhost:3000`.

In the client's `package.json` file, the `"proxy": "http://localhost:3001"` config proxies requests from the frontend to the Express backend, running on port `3001`.

## Libraries used

### Node/Express Backend

* [Express](https://github.com/expressjs/express): A framework for Node, used to build our API.
* [Concurrently](https://github.com/open-cli-tools/concurrently): Used to start up concurrently the Node and React devservers when running the app locally.

### React Frontend

* [D3](https://github.com/d3/d3): JavaScript visualization library, used to create and update the time graph.
* [TailwindCSS](https://tailwindcss.com/): CSS framework.
* [React Hooks Testing Library](https://www.npmjs.com/package/@testing-library/react-hooks): React Hooks testing utilities, used for testing the alerting logic.

## Extending the application for production

The application presented here is a POC, meant only to run locally. If the application were to be deployed to be production there is a number of ways in which it should be extended and improved:

### Preparing the application for a production environment

The app can only currently run locally, with the Node server and the React devserver fired up simultaneously, and requests being proxied through the `proxy` command. 

In order for the application to be served in a production environment, the command to `build` the `frontend` should be run, and the Express routes to serve the static files should be added to our API.

This process would also probably include creating environment variables and setting up a CI pipeline for the deployment of the app, optionally creating a Dockerfile or a Kubernetes configuration.

### Adding persistence in our backend

A better design for the application would be to add some type of persistance to our backend -most possible an SQL database- that stored our CPU load data points. 

Having a store for our data would enable us to still poll our application for data, every X amount of seconds, but would also allow us to query and display the user data for any historic time period that the user wanted.

This would enable us to add data history controls for the user to navigate and update the graph to show any time window desired. We could also store the alert history events.

### Updating the design

Working together with a designer, I would attempt to improve the design, making it pixel-perfect and fully responsive. Of particular importance would be to make the D3 graph adapt to the current viewport in a flexible way.

### Improving test coverage

The current application only includes tests for the alerting logic. I would work on improving test coverage, focusing on the components and the design with the use of React Testing Library, and unit testing (and maybe integration testing) the existing and new API routes.

### Adding new features

Apart from displaying historical data that a database would allow us, the application could be expanded to offer a number of new features:

1. Besides offering information on CPU load, our API could also offer information on the **total and free memory** available to the computer.
2. Option to export data, both as JSON and CSV, of both historic data points, for CPU load and memory, as well as the alert history.
3. Improving configurability of graph, to allow the user to extend or compress the time window displayed, as well as being able to zoom in on a certain subwindow of data by clicking and dragging over it.
4. Adding configuration options for the application, allowing the user to set their own thresholds for CPU Load, memory usage, as well as the time window that is needed for the alerts to trigger.
5. Add the option to trigger an email or notification when an alert for CPU load or high memory is usage. This would be especially useful for on-call duty engineers.

## Author

* [**Juan Pablo Djeredjian**](https://github.com/jpdjere)