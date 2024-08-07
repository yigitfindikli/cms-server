# cms-server

This repository, `cms-server`, serves as a type-safe boilerplate for a CMS server application built with Node.js and TypeScript. It features modern best practices, including authentication, role management, and database interactions with TypeORM. Designed to integrate seamlessly with the `cms-client-react` frontend repository, it ensures a robust and scalable foundation for developing content management systems.

## Features

-   **TypeScript**: Ensures type safety throughout the project.
-   **Node.js**: Backend runtime environment.
-   **Express.js**: Web framework for Node.js.
-   **TypeORM**: ORM for database interactions.
-   **PostgreSQL**: Primary database.
-   **Docker**: Containerization for consistent development environments.
-   **Authentication**: Built-in authentication mechanisms.
-   **Role Management**: Support for user roles and permissions.
-   **Environment Configuration**: Manage configuration for different environments.
-   **Integration**: Seamlessly integrates with `cms-client-react` for a full-stack CMS solution.

## Planned Features

-   **Fully Error Handling**: Comprehensive error handling throughout the application.
-   **Error Logs**: Logging of errors for debugging and monitoring.
-   **Tests**: Unit and integration tests for reliability.
-   **Social Auth**: Integration with social authentication providers.
-   **Other DB Options**: Support for additional databases.
-   **Redis Option**: Redis integration for caching and other purposes.

## Scripts

Here are the scripts available in the project:

-   **`start`**: Runs the built application.

    ```bash
    npm run start
    ```

-   **`dev`**: Runs the application in development mode using `nodemon`.

    ```bash
    npm run dev
    ```

-   **`build`**: Compiles TypeScript files and copies the configuration.

    ```bash
    npm run build
    ```

-   **`typeorm`**: Runs TypeORM commands using TypeScript.

    ```bash
    npm run typeorm
    ```

-   **`db:makemigration`**: Generates a new migration file in the specified directory.

    ```bash
    npm run db:makemigration
    ```

-   **`db:migrate`**: Runs all pending migrations.

    ```bash
    npm run db:migrate
    ```

-   **`db:seed:all`**: Seeds the database with initial data.

    ```bash
    npm run db:seed:all
    ```

-   **`lint`**: Runs ESLint to fix linting issues.

    ```bash
    npm run lint
    ```

-   **`format`**: Formats the code using Prettier.
    ```bash
    npm run format
    ```

## Setup

1. **Clone the repository**:

    ```bash
    git clone https://github.com/yigitfindikli/cms-server.git
    cd cms-server
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Configure environment variables**:

    - Create a `.env` file in the root of the project.
    - Add the necessary environment variables as shown in the example below:
        ```env
        NODE_ENV=development
        DB_TYPE=postgres
        DB_HOST=localhost
        DB_PORT=5432
        DB_USERNAME=cms-admin
        DB_PASSWORD=Admin.123
        DB_DATABASE=cms-db
        CLIENT_APP_ROOT_URL=http://localhost:3000
        SERVER_PORT=9001
        ROOT_URL=http://localhost:9001
        ACCESS_TOKEN=your_base_for_access_secret
        ACCESS_TOKEN_EXPIRES_IN=1
        REFRESH_TOKEN=your_base_for_refresh_secret
        REFRESH_TOKEN_EXPIRES_IN=365
        PASSWORD_RESET_TOKEN_SECRET=your_base_for_password_reset_secret
        PASSWORD_RESET_TOKEN_EXPIRES_IN=15
        GOOGLE_CLIENT_ID=your_google_client_id
        GOOGLE_CLIENT_SECRET=GOCSPX-your_google_secret
        GITHUB_CLIENT_ID=your_github_client_id
        GITHUB_CLIENT_SECRET=your_github_secret
        ```
    - You can create your `ACCESS_TOKEN`, `REFRESH_TOKEN`, and `PASSWORD_RESET_TOKEN_SECRET` using a library like `crypto` for generation.

4. **Create the database**:

    ```bash
    docker-compose up
    ```

5. **Run migrations**:

    ```bash
    npm run db:migrate
    ```

6. **Seed the database**:

    ```bash
    npm run db:seed:all
    ```

7. **Start the application**:
    ```bash
    npm run dev
    ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
