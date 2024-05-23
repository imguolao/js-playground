export function createConsoleProxy() {
  const consoleProxy = new Proxy(console, {
    get(target, prop) {
      if (prop === 'log' || prop === 'error' || prop === 'warn') {
        return (...args: any[]) => {
          // TODO: proxy message
          // const message = args.join(' ')
          // proxyMessage += message
          target[prop](...args)
        };
      }
      return target[prop as keyof Console]
    },
  });
  
  window.console = consoleProxy
  window.addEventListener('error', (e) => console.log(e.error))

  return window.console
}