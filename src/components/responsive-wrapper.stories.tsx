import type { Meta, StoryObj } from '@storybook/react'
import { MantineProvider, Text, Paper, Stack } from '@mantine/core'
import '@mantine/core/styles.css'
import { theme } from '@/theme'
import { ResponsiveWrapper } from './responsive-wrapper'

const meta: Meta<typeof ResponsiveWrapper> = {
  title: 'Components/ResponsiveWrapper',
  component: ResponsiveWrapper,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MantineProvider theme={theme}>
        <Story />
      </MantineProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ResponsiveWrapper>

export const Default: Story = {
  args: {
    desktopPadding: 24,
    children: (
      <Stack gap="md">
        <Paper p="md" withBorder>
          <Text>This content adjusts padding based on screen size.</Text>
        </Paper>
        <Paper p="md" withBorder>
          <Text>Resize your browser to see the responsive behavior.</Text>
        </Paper>
      </Stack>
    ),
  },
}

export const NoPadding: Story = {
  args: {
    desktopPadding: 0,
    children: (
      <Paper p="md" withBorder>
        <Text>No extra desktop padding.</Text>
      </Paper>
    ),
  },
}
