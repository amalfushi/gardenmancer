# Components — Agent Guide

## Mantine-First

Use Mantine components as building blocks. Avoid raw HTML elements when a Mantine equivalent exists:

- `<Button>` instead of `<button>`
- `<TextInput>` instead of `<input type="text">`
- `<Stack>`, `<Group>`, `<Grid>` for layout
- `<Text>`, `<Title>` for typography

## Testing

Every component gets a corresponding test file in `src/__tests__/components/`:

```
src/
├── components/
│   └── PlantCard.tsx
└── __tests__/
    └── components/
        └── PlantCard.test.tsx
```

Use React Testing Library patterns:

```typescript
import { render, screen } from '@testing-library/react'
import { PlantCard } from '@/components/PlantCard'

describe('PlantCard', () => {
  it('renders the plant name', () => {
    render(<PlantCard name="Tomato" />)
    expect(screen.getByText('Tomato')).toBeInTheDocument()
  })
})
```

## Mobile-First Design

Design for **375px** viewport width first, then scale up using Mantine breakpoints:

```tsx
<Grid>
  <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
    <PlantCard />
  </Grid.Col>
</Grid>
```

## Accessibility

- Use semantic HTML via Mantine's built-in accessibility support.
- Add `aria-label` to icon-only buttons.
- Ensure proper heading hierarchy (`<Title order={1}>`, `<Title order={2}>`).
- All interactive elements must be keyboard-accessible.

## Storybook (NON-NEGOTIABLE)

**Every UI component MUST have a `.stories.tsx` file.** Components without stories will not be accepted.

Stories live alongside the component:

```
src/components/
├── PlantCard.tsx
└── PlantCard.stories.tsx
```

Story requirements:
- Use `tags: ['autodocs']` for automatic documentation
- Include at least 2-3 story variants showing different states (default, empty, loading, error, etc.)
- Use `@storybook/test` for interaction testing in stories where applicable
- Run `pnpm storybook` for development, `pnpm build-storybook` to verify compilation
- Stories should wrap components in `<MantineProvider>` if they use Mantine theme tokens

Example pattern:
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { MantineProvider } from '@mantine/core'
import { MyComponent } from './my-component'
import { theme } from '@/theme'

const meta: Meta<typeof MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
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
type Story = StoryObj<typeof MyComponent>

export const Default: Story = { args: { ... } }
export const Empty: Story = { args: { ... } }
```

## Props

- Define TypeScript interfaces for all component props.
- Use `zod` for runtime validation where appropriate (e.g., form data).
- Export prop types so consumers can reference them:

```typescript
export interface PlantCardProps {
  name: string
  species?: string
  imageUrl?: string
  onSelect?: (name: string) => void
}

export function PlantCard({ name, species, imageUrl, onSelect }: PlantCardProps) {
  // ...
}
```
