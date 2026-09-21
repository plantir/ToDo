type Envelope<T> = {
  data: T
}

export function dataOf<T>(response: { body: () => unknown }): T {
  return (response.body() as Envelope<T>).data
}
