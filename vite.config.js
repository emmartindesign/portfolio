import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        about: 'about.html',
        contact: 'contact.html',
        'case-studies/design-systems': 'case-studies/design-systems.html',
        'case-studies/raintree-pdlc': 'case-studies/raintree-pdlc.html',
        'case-studies/e15-reporting': 'case-studies/e15-reporting.html',
        'case-studies/sourcescrub-navigation': 'case-studies/sourcescrub-navigation.html',
        'case-studies/cb-insights-reporting': 'case-studies/cb-insights-reporting.html',
        'case-studies/raintree-scheduler': 'case-studies/raintree-scheduler.html',
        'case-studies/branding': 'case-studies/branding.html'
      }
    }
  }
})
