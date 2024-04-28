## How to Run Exemple with Docker ?


This is an example in situations where you have a load balancer or a proxy. If your project is set up this way, it is necessary to use:

`applicationExpress.set("trust proxy", true);`

### Prerequisites
- Install **Docker** and **Docker Compose**.

### Start the Services

Run the following command in the project directory to start the containers:

```bash
docker-compose up --build
```

### View Logs

To view logs from a container, use:

```bash
docker logs [container-name] -f
```

### Test the Application

Make a request to test:

```bash
curl --location 'http://localhost:7777/rate-limiter'
```