# ts-event-dispatcher

A basic implementation of an Event Dispatcher with Handler written with Typescript and
using generics to extend the Events passed around.

## Usage

Set up an event type with specific payload so your IDE can give you nice auto-completion::

```ts
type MessageEvent = EventPayload & {
    message: string,
}
```

Create an Event Dispatcher using it's create function:

```ts
const dispatcher = createEventDispatcher()
```

You can also pass a list of existing events with handlers when creating:

```ts
const dispatcher = createEventDispatcher([
    [ 'message-sent', event => console.log('Event received', event.name)]
])
```

Add a listener/handler:

```ts
dispatcher.on('message-sent', (event: Event<MessageEvent>) => console.log(event.payload.message))
```

Dispatch an event:

```ts
dispatcher.emit(createEvent<TaskEvent>('message-sent', { message: 'hello, world' }))
```


When registering a handler, an unsubscribe function is returned:

```ts
const unsubscribe = dispatcher.on('some-event', () => {console.log("I'm handling!")})

unsubscribe()

dispatcher.emit('some-event') // our handler is not called
```


## Use cases

1. Logging.  When starting up your application, register a logging function against each event you
   plan on having your app emit, they'll be triggered each time the event is sent.
2. Asynchronous processing.  Using `async` functions as callbacks means execution won't be paused
   waiting for a long-winded process to happen, for example using the filesystem, interacting with
   a database, or making a http request.
3. Decoupling logic that doesn't really belong in together.   Report on something happening in a
   separate function to processing some data, fire events while handling events to truly unlock this
   power.
