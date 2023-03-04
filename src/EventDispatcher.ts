

export type EventDispatcher = {
  on: (eventName: string, handler: EventHandler) => EventDispatcherUnsubscribe,
  emit: (event: Event<EventPayload>) => void
}

export type EventDispatcherUnsubscribe = () => void

// Deliberately empty for extension purposes
export type EventPayload = {}

// Promise or void allows Typescript to let us use async functions
export type EventHandler = (event: Event<EventPayload>) => void|Promise<void>

export type Event<PayloadType> = {
  name: string,
  payload: PayloadType,
  cancelled?: boolean
}

export function createEvent<PayloadType>(
  eventName: string, payload: PayloadType
): Event<PayloadType> {
  return {
    name: eventName,
    cancelled: false,
    payload,
  }
}

export function createEventDispatcher(
  defaultHandlers: [ eventName: string, handler: EventHandler ][]
): EventDispatcher {
  const listeners = new Map<string, Set<EventHandler>>()

  defaultHandlers.forEach(input => on(...input))

  function on(eventName: string, handler: EventHandler) {
    if (!listeners.has(eventName)) {
      listeners.set(eventName, new Set())
    }

    listeners.get(eventName).add(handler)
    return () => {
      listeners.get(eventName).delete(handler)
    }
  }

  async function emit<PayloadType>(event: Event<PayloadType>) {
    const handlers = listeners.get(event.name)
    // Using a standard for loop here allows us an early exit from the loop
    for( const handler of handlers) {
      await handler(event)
      if (event.cancelled === true) {
        return
      }
    }
  }

  return {on, emit}
}
