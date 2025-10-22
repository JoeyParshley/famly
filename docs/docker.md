# Commands
`docker exec -it famly_db psql -U famly -d famly`
```bash
docker exec -it famly_db psql -U famly -d famly
```
This command is how you open a **PostgreSQL interactive shell (psql)** inside your running **Docker Container** thats running Postgres

## Command Structure Overview
The command has three main pieces
1. `docker exec` -> run a comman in an existing container
2. `-it` -> make that command interactive ( so you can type commands)
3. `psql -U famly -d famly` -> the comman you want to run in the container

### 1 `docker exec`
This is a **Docker CLI command** that tells Docker
    "Run a process in an already running container"
    - Your not starting a new container -- youre __entering__ one that is already up ( in this case your Postgres database)
### 2 `-it`
These are two flags combined.
- `-i` -> "interactive mode" -- keeps the input mode open so you can keep typing
- `-t` -> allocates a pseudo-terminal (TTY), which makes your terminal behave normally
- Together `-it` basically means `"Run this proces as if I were sitting inside the container typing in the continer"`
### 3 `famly_db`
Thats the **name of the container**  running your Postgres instance -- from your `docker-compose.yml`
```yml
  services:
    db:
      container_name: famly_db
```
When you run `docker ps` you will see something like:
```nginx
CONTAINER ID   IMAGE           PORTS                    NAMES
a1b2c3d4e5f6   postgres:16     0.0.0.0:5432->5432/tcp   famly_db
```
That's how you know that name to target.

So far this means : "Run a comman interactively inside the container called `famly_db`"
### 4 `psql`
This is the **PostgreSQL command-line client** -- a terminal program that lets you connect to a PostgreSQL server send SQL queries and manage the database interactively.

When you type `psql` inside the container, it connects to the Postgres server proces thats server process thats running in the **same container**

### 5 `-U famly`
This flag tells `psql` which **Postgres user** to connect as.
It corresponds to  your `.env` configuration

```bash
    POSTGRES_USER=famly
```
Inside the container this means "connect as the `famly` database role

If you used `-U postgres` it would connect as the superuser 

### 6 `-d famly`
This flag tells `psql` which **database** to connect to
It matches your `.env`

```bash
    POSTGRRES_DB=famly
```
So this parts connects specifically to the `famly` database (each Postgres instance can host multiple databases)

### Putting it all together
```bash
docker exec -it famly_db psql -U famly -d famly
```
Says "Open open an interactive terminal session in the running container called `famly_db`, and inside that container, launch the Postgres command-line client (`psql`), connecting to the database named `famly` as the user `famly` "

## Once inside `psql` you can run commands

| **Command** | Meaning                                  |
|----------|------------------------------------------|
| `\dt`    | Lists all tables in the current database |
| `\l`     | Lists all databases                      |
| `\c <dbname>` | Switch databases                         |
| `\dn`    | List schemas                             |    
| `\q`     | Quit the client                          |
| Any SQL (e.g. select * from users;)         | Executes the query                       |

## Variations
If you just want to run a single SQL command **without entering an interactive mode** you can append `-c`:

```bash
docker exec -it famly_db psql -U famly -d famly -c "select * from flyway_schema_history;"
```

That will execute the query and immediately exit.

## Why use this instead of installing `psql` locally
- the Postgres client (`psql`) is already installed inside the client 
- it always connects directly to the Postgres server using the Docker's internal networking
- No firewall host or port mapping issues
