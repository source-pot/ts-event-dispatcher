

export type EventDispatcher = {
  on: (eventName: string, handler: EventHandler) => EventDispatcherUnsubscribe,
  emit: (event: Event<EventPayload>) => void
}

export type EventDispatcherUnsubscribe = () => void

// Deliberately empty for extension purposes
export type EventPayload = {}

export type EventHandler = (event: Event<EventPayload>) => void

type DefaultHandlerList = [ eventName: string, handler: EventHandler ][]

export type Event<PayloadType> = {
  name: string,
  payload: PayloadType,
}

export function createEvent<EventPayloadType>(
  eventName: string, payload: EventPayloadType
): Event<EventPayloadType> {
  return {
    name: eventName,
    payload,
  }
}

export function createEventDispatcher(defaultHandlers: DefaultHandlerList): EventDispatcher {
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

  function emit<EventPayloadType>(event: Event<EventPayloadType>) {
    listeners.get(event.name)?.forEach(listener => listener(event))
  }

  return {on, emit}
}
