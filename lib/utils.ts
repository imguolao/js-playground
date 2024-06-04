export type LogMessage = {
  type: 'error' | 'info'
  message: string
}

export function execCode(code: string, callback: (message: LogMessage) => void): void {
  try {
    const proxyConsole = new Proxy(console, {
      get(target, prop) {
        if (prop === 'log' || prop === 'error' || prop === 'warn') {
          return (...args: any[]) => {
            const message = args.join(' ')
            callback({
              type: prop === 'error' ? 'error' : 'info',
              message,
            })
            target[prop](...args)
          };
        }
        return target[prop as keyof Console]
      },
    })

    const proxyWindow = new Proxy(window, {
      get(target, prop) {
        if (prop === 'console') {
          return proxyConsole
        }

        return target[prop as keyof Window]
      }
    })

    new Function('proxyWindow', `with(proxyWindow) {${code}}`)(proxyWindow)
  } catch (err) {
    callback({
      type: 'error',
      message: `${err}`
    })
  }
}

export function debounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): (...args: Parameters<T>) => any {
  let timeoutID: ReturnType<typeof setTimeout> | null
  function wrapper(...args: T[]) {
    if (timeoutID) {
      clearTimeout(timeoutID)
      timeoutID = null
    }

    // @ts-ignore
    timeoutID = setTimeout(() => callback.apply(this, args), delay)
  }

  return wrapper
}

export function isUndefined(val: unknown): val is undefined {
  return typeof val === 'undefined'
}
