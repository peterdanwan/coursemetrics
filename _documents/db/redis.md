# Using Redis CLI: A Quick Guide

## Overview

Redis CLI (`redis-cli`) is a command-line tool that allows you to interact with your Redis database. It allows you to perform various operations like setting, getting, and deleting data in the Redis database.

This document will guide you through the following common Redis operations:

1. **Connecting to Redis**
2. **Getting keys**
3. **Setting keys**
4. **Deleting keys**

## 1. Connecting to Redis

### Basic Usage

To connect to Redis using the `redis-cli`, open your terminal and type the following command:

```bash
redis-cli
```

This will connect to the default Redis server at `localhost` on port `6379`.

### Connecting to a Remote Redis Server

If you're connecting to a remote Redis instance (for example, a Redis instance hosted on AWS), you can specify the host and port:

```bash
redis-cli -h <hostname> -p <port>
```

For example, if your Redis instance is hosted on `redis-16964.c44.us-east-1-2.ec2.redns.redis-cloud.com:16964`, the command would look like:

```bash
redis-cli -h redis-16964.c44.us-east-1-2.ec2.redns.redis-cloud.com -p 16964
```

If authentication is required, use the `-a` option followed by the password:

```bash
redis-cli -h <hostname> -p <port> -a <password>
```

## 2. Getting All Keys

To retrieve all the keys stored in your Redis database, you can use the `KEYS` command.

### Example: Getting All Keys

```bash
KEYS *
```

This will return a list of all keys stored in the selected Redis database.

### Note on Using `KEYS`

- The `KEYS` command can be slow on large databases because it scans through all the keys to return the result. It's recommended to use it with caution, especially on production systems.

## 3. Setting Keys

To store data in Redis, you use the `SET` command.

```bash
SET <key> <value>
```

### Example: Setting a Key

```bash
SET mykey "Hello, Redis!"
```

This command sets a key called `mykey` with the value `"Hello, Redis!"`.

### Setting Expiry on a Key

You can also set an expiration time for a key using the `EXPIRE` command, which sets a time-to-live (TTL) for the key in seconds.

### Example: Setting Expiry for a Key

```bash
SET mykey "Temporary Data"
EXPIRE mykey 3600  # Expires in 1 hour (3600 seconds)
```

## 4. Deleting Keys

You can delete keys using the `DEL` command, which removes the specified key from the database.

```bash
DEL <key>
```

### Example: Deleting a Single Key

```bash
DEL mykey
```

This will delete the `mykey` key.

### Deleting All Keys in the Current Database

If you want to remove all keys from the currently selected database, use the `FLUSHDB` command:

```bash
FLUSHDB
```

This will **delete all keys** from the current Redis database.

### Deleting All Keys Across All Databases

To remove keys from all Redis databases (not just the selected one), use the `FLUSHALL` command:

```bash
FLUSHALL
```

### Important Notes

- **`DEL`** will delete only the specified keys.
- **`FLUSHDB`** deletes all keys from the selected database.
- **`FLUSHALL`** deletes all keys from all databases on the Redis server.
