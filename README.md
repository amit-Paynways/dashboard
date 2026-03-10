# AngularAuthApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Auth modes (temporary)

This app supports a simple frontend-only auth toggle (no backend required):

- `AUTH_MODE=enabled` (default): protected routes require login
- `AUTH_MODE=bypass`: bypass login and auto-authenticate
- `AUTH_MODE=login_only`: force everything back to the login page

## Docker (deployment image)

Build an image:

```bash
docker build -t angular-auth-app .
```

Run the container (SSR server on port 4000):

```bash
docker run --rm -p 4000:4000 -e PORT=4000 -e AUTH_MODE=bypass angular-auth-app
```

Or with compose:

```bash
docker compose up --build
```

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
