import { createEvent } from './EventDispatcher'

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
