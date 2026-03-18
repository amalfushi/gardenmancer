# Milestone 4: Garden Layout Editor

## Problem Statement

The garden layout editor is Gardenmancer's most complex feature — an interactive 2D canvas where users design their garden beds by dragging and dropping plants onto a grid. This milestone builds the full editor experience using react-konva, from basic garden CRUD to AI-powered optimization suggestions.

Users need to create, name, and size their garden beds (raised beds, in-ground plots, container gardens), then place plants onto a grid overlay with snap-to-grid behavior. The editor must visually communicate spacing requirements (showing circles that represent each plant's space needs and turning red when plants overlap), height information (tall plants in back, short in front), and sun exposure patterns. Drag-and-drop must feel responsive and intuitive on both desktop (mouse) and mobile (touch).

The crown jewel is AI-powered optimization — users can ask Claude Opus 4.6 to analyze their current layout and suggest improvements. The AI considers companion planting (tomatoes love basil, hate fennel), spacing efficiency, succession planting opportunities, sun exposure optimization (tall plants shouldn't shade short ones), and aesthetic balance. Suggestions appear as a visual overlay that users can accept, modify, or dismiss. This transforms the editor from a simple placement tool into an intelligent gardening assistant.
