# relay-todomvc
Relay TodoMVC with routing.

## Usage

Visit http://fashionablenonsense.com/relay-todomvc, or clone this repo and run:

```shell
npm install
npm start
```

Then point your browser at [http://localhost:8080/](http://localhost:8080/).

## Notes

- The schema design is intended to demonstrate the use of route parameters. To take full advantage of Relay mutations, you would instead implement this with separate `todos`, `activeTodos`, and `completedTodos` connections, rather than a single parameterized `todos` connection.
- Most of the code is taken directly from [the official example](https://github.com/relayjs/relay-examples/tree/master/todo) and falls under [the license there](https://github.com/relayjs/relay-examples/tree/master/todo#license).
- The `npm start` command runs webpack-dev-server, and accepts other options, e.g. `npm start -- --port 5000`.
