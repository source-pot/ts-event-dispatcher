import { createEvent, createEventDispatcher } from './EventDispatcher'

test('can create event', () => {
  expect(createEvent('test', {}))
    .toStrictEqual({
      cancelled: false,
      name: 'test',
      payload: {},
    });
});

test('can attach payload to event', () => {
  const evt = createEvent<{data: string}>('test', {data: 'test'})

  expect(evt.payload)
    .toStrictEqual({
      data: 'test'
    });
});

test('can create dispatcher with no default handlers', () => {
  const dispatcher = createEventDispatcher()
  expect(dispatcher).toHaveProperty('on')
  expect(dispatcher).toHaveProperty('emit')
})

test('can create dispatcher with default handlers', () => {
  const dispatcher = createEventDispatcher([
    ['test', () => {}]
  ])
  expect(dispatcher).toHaveProperty('on')
  expect(dispatcher).toHaveProperty('emit')
})

test('can unsubscribe from event', () => {
  const handler = jest.fn(event => {})
  const eventName = 'test'
  const dispatcher = createEventDispatcher()
  const unsub = dispatcher.on(eventName, handler)

  unsub()
  dispatcher.emit(createEvent('test', {}))

  expect(handler).toBeCalledTimes(0)
})

test('emit correctly calls handler', () => {
  const handler = jest.fn(event => {})

  const dispatcher = createEventDispatcher([
    ['test', handler]
  ])

  dispatcher.emit(createEvent('test', {}))

  expect(handler.mock.calls).toHaveLength(1)
})

test('emit event can be cancelled', () => {
  const handler = jest.fn(event => { event.cancelled = true })
  const handlerThatShouldNotBeCalled = jest.fn(event => {})

  const dispatcher = createEventDispatcher([
    ['test', handler],
    ['test', handlerThatShouldNotBeCalled]
  ])

  dispatcher.emit(createEvent('test', {}))

  expect(handler).toHaveBeenCalledTimes(1)
  expect(handlerThatShouldNotBeCalled).toHaveBeenCalledTimes(0)
})
