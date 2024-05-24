export type LogMessage = {
  type: 'error' | 'info'
  message: string
}

export function execCode(code: string): LogMessage[] {
  const logResults: LogMessage[] = []
  const originalConsole = window.console
  try {
    window.console = new Proxy(console, {
      get(target, prop) {
        if (prop === 'log' || prop === 'error' || prop === 'warn') {
          return (...args: any[]) => {
            const message = args.join(' ')
            logResults.push({
              type: prop === 'error' ? 'error' : 'info',
              message,
            })
            target[prop](...args)
          };
        }
        return target[prop as keyof Console]
      },
    })

    new Function(code)()
  } catch (err) {
    logResults.push({
      type: 'error',
      message: `${err}`
    })
  } finally {
    window.console = originalConsole
  }

  return logResults
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
