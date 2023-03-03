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
