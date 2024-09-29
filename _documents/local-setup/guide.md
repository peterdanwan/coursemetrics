# Running this project locally

## Dependencies & Environment Files

To run this project locally, you will need the following dependencies/environment files:

- [node.js](https://nodejs.org/en/download/package-manager) installed
- a [.env.local] file, containing your credentials for:
  - `Auth0`: [follow this guide to set up your _own_ Auth0 credentials](../auth0/_auth0.md)
  - `MongoDB`: ask for the _shared_ MongoDB connection string
- [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/) installed

## Running the project locally

To run this project locally, you will run the following commands:

```sh
# Ensure you have the most recent node_modules installed (may or may not update package* files)
npm i
```

```sh
# Rebuilds the mock MongoDB server from scratch, and hosts on port 8081
docker compose up --build
```

```sh
# Starts hosting the Next.js app on port 3000
npm run dev
```

To stop running this project locally, run the following commands:

```sh
# Stops the containers that were spun up from docker compose up --build
docker compose down
```

```sh
# Stop the Next.js app
CTRL + c
```

## Author

[Peter Wan](https://www.github.com/peterdanwan)
[Aryan Khurana](https://www.github.com/AryanK1511)
