import { Container, Title, Text, SimpleGrid, Card, Anchor, Stack, Group } from '@mantine/core'
import { HomeDashboard } from './home-dashboard'
import { Mascot } from '@/components/mascot'

const features = [
  {
    icon: '📷',
    title: 'Scan Seeds',
    description: 'Photograph seed packets to extract planting info',
    href: '/scan',
  },
  {
    icon: '🌿',
    title: 'Browse Plants',
    description: 'Explore our catalog of 50+ garden plants',
    href: '/plants',
  },
  {
    icon: '📅',
    title: 'Plan Calendar',
    description: 'Zone-aware planting schedule for your seeds',
    href: '/calendar',
  },
  {
    icon: '🏡',
    title: 'Design Garden',
    description: 'Drag-and-drop garden layout editor',
    href: '/gardens',
  },
]

export default function Home() {
  return (
    <Container size="sm" py="xl">
      <Stack gap="xl">
        <Group align="center" gap="md" wrap="nowrap">
          <Mascot size="sm" />
          <div>
            <Title order={1}>🌱 Gardenmancer</Title>
            <Text c="dimmed" mt="xs">
              Plan, organize, and track your garden
            </Text>
          </div>
        </Group>

        <HomeDashboard />

        <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="md">
          {features.map((feature) => (
            <Anchor key={feature.href} href={feature.href} underline="never">
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{ cursor: 'pointer', height: '100%' }}
              >
                <Text size="2rem" mb="xs">
                  {feature.icon}
                </Text>
                <Text fw={500}>{feature.title}</Text>
                <Text size="sm" c="dimmed" mt={4}>
                  {feature.description}
                </Text>
              </Card>
            </Anchor>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  )
}
