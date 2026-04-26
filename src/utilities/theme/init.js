(() => {
  const storageKey = 'theme'

  const getPreference = () => {
    const preference = localStorage.getItem(storageKey)
    if (preference) {
      try {
        return JSON.parse(preference)
      } catch (e) {
        return preference.replace(/^"|"$/g, '')
      }
    }
  }

  const getSystemPreference = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const theme = getPreference() || getSystemPreference()
  document.documentElement.setAttribute('data-theme', theme)

  if (!localStorage.getItem(storageKey)) {
    localStorage.setItem(storageKey, JSON.stringify(theme))
  }

  document.addEventListener('astro:after-swap', () => {
    const theme = getPreference() || getSystemPreference()
    document.documentElement.setAttribute('data-theme', theme)
  })
})()
