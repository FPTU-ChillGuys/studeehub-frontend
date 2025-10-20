# My Documents Components

This folder contains all the reusable components for the My Documents (Notebooks) page.

## Components

### NotebookStats
Displays statistics about notebooks (total, active, documents count).

**Props:**
- `total: number` - Total number of notebooks
- `active: number` - Number of active notebooks
- `totalDocuments: number` - Total number of documents across all notebooks

### NotebookControls
Search bar, filter dropdown, and view mode toggle (grid/list).

**Props:**
- `searchTerm: string` - Current search term
- `onSearchChange: (value: string) => void` - Search change handler
- `filterStatus: string` - Current filter status
- `onFilterChange: (value: string) => void` - Filter change handler
- `viewMode: "grid" | "list"` - Current view mode
- `onViewModeChange: (mode: "grid" | "list") => void` - View mode change handler

### NotebookCard
Individual notebook card displayed in grid view.

**Props:**
- `notebook: Notebook` - Notebook data
- `isEditing: boolean` - Whether the title is being edited
- `editTitle: string` - Current edit title value
- `onEditTitleChange: (value: string) => void` - Edit title change handler
- `onStartEdit: () => void` - Start editing handler
- `onSaveEdit: () => void` - Save edit handler
- `onCancelEdit: () => void` - Cancel edit handler
- `onDelete: () => void` - Delete handler
- `openDropdown: boolean` - Whether the dropdown menu is open
- `onDropdownChange: (open: boolean) => void` - Dropdown state change handler

### NotebookListItem
Individual notebook item displayed in list view.

**Props:** Same as NotebookCard

### EmptyNotebooks
Empty state component shown when no notebooks are found.

**Props:**
- `hasFilters: boolean` - Whether filters are currently applied
- `onCreateClick?: () => void` - Optional create button click handler

## Usage

```tsx
import {
  NotebookStats,
  NotebookControls,
  NotebookCard,
  NotebookListItem,
  EmptyNotebooks,
} from "@/components/my-documents";
```

## Benefits

- **Separation of Concerns**: Each component has a single responsibility
- **Reusability**: Components can be used in different contexts
- **Maintainability**: Easier to update and test individual components
- **Readability**: Main page is much cleaner and easier to understand
- **Type Safety**: All props are properly typed with TypeScript
