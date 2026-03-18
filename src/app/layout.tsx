import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/nprogress/styles.css'
import { Box, ColorSchemeScript, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { theme } from '@/theme'
import { NavBar } from '@/components/nav-bar'

export const metadata = {
  title: 'Gardenmancer',
  description: 'Plan, organize, and track your garden',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Notifications position="top-right" />
          <Box pb={80}>{children}</Box>
          <NavBar />
        </MantineProvider>
      </body>
    </html>
  )
}
