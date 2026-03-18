# Components

## Architecture

All UI components are built on top of [Mantine](https://mantine.dev/) primitives. Use Mantine's `Button`, `TextInput`, `Stack`, `Group`, `Grid`, `Text`, and `Title` components instead of raw HTML elements.

## Testing

Every component has a corresponding test file in `src/__tests__/components/`. Tests use React Testing Library to render components and assert behavior from the user's perspective.

```
src/components/PlantCard.tsx
src/__tests__/components/PlantCard.test.tsx
```

## Mobile-First Design

All components are designed for a 375px viewport width first, then scaled up using Mantine's responsive props:

```tsx
<Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
```

## Storybook

Component development workflow uses Storybook. Every component has a `.stories.tsx` file alongside it.

- `pnpm storybook` — launch Storybook dev server at localhost:6006
- `pnpm build-storybook` — verify stories compile
- `pnpm test:storybook` — run the Storybook test runner against all stories

## Conventions

- Props are defined as TypeScript interfaces and exported alongside the component.
- Runtime validation uses `zod` where appropriate (e.g., form submissions).
- Accessibility: semantic HTML via Mantine, `aria-label` on icon-only buttons, proper heading hierarchy.
