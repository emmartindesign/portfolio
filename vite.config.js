import { defineConfig } from 'vite'

export default defineConfig({
  appType: 'mpa',
  base: '/portfolio/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        about: 'about.html',
        contact: 'contact.html',
        'case-studies/design-systems': 'case-studies/design-systems.html',
        'case-studies/ai-native-design-system': 'case-studies/ai-native-design-system.html',
        'case-studies/ai-pdlc': 'case-studies/ai-pdlc.html',
        'case-studies/raintree-pdlc': 'case-studies/raintree-pdlc.html',
        'case-studies/e15-reporting': 'case-studies/e15-reporting.html',
        'case-studies/sourcescrub-navigation': 'case-studies/sourcescrub-navigation.html',
        'case-studies/cb-insights-reporting': 'case-studies/cb-insights-reporting.html',
        'case-studies/scheduler': 'case-studies/scheduler.html',
        'case-studies/raintree-scheduler': 'case-studies/raintree-scheduler.html',
        'case-studies/branding': 'case-studies/branding.html',
        'case-studies/product-design': 'case-studies/product-design.html',
        'case-studies/training-mentorship': 'case-studies/training-mentorship.html'
      }
    }
  }
})
