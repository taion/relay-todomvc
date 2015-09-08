# relay-todomvc
Relay TodoMVC with routing.

## Usage

Visit http://fashionablenonsense.com/relay-todomvc, or clone this repo and run:

```shell
npm install
npm start
```

## Notes

- The schema design is intended to demonstrate the use of route parameters. To take full advantage of Relay mutations, you would instead implement this with separate `todos`, `activeTodos`, and `completedTodos` connections, rather than a single parameterized `todos` connection.
- Most of the code is taken directly from [the official example](https://github.com/facebook/relay/tree/master/examples/todo) and falls under [the license there](https://github.com/facebook/relay/tree/master/examples/todo#license).
