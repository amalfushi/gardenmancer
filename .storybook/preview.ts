import type { Preview } from '@storybook/react'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      config: {
        rules: [
          // Canvas elements (react-konva) are not DOM-based; disable rules that don't apply
          { id: 'color-contrast', enabled: true },
          { id: 'label', enabled: true },
          { id: 'image-alt', enabled: true },
          { id: 'button-name', enabled: true },
          { id: 'link-name', enabled: true },
        ],
      },
    },
  },
}

export default preview
