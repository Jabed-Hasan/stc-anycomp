# Technology Stack Setup - Complete

## Frontend Stack
1. **Next.js 16.1.1** - React framework with App Router
2. **TypeScript 5** - Type-safe development
3. **Tailwind CSS 4** - Utility-first CSS framework
4. **Redux Toolkit** - State management
5. **Material-UI v7** - Component library
6. **Fonts**: Red Hat Display (Google Fonts) & Proxima Nova (Adobe Fonts)
7. **Primary Color**: #222222

## Project Structure

```
stc-anycomp/
├── app/
│   ├── globals.css          # Tailwind & global styles
│   ├── layout.tsx           # Root layout with fonts
│   ├── page.tsx             # Home page
│   ├── provider.tsx         # All providers wrapper
│   └── theme/
│       └── mui-theme.ts     # MUI theme configuration
├── lib/
│   └── redux/
│       ├── store.ts         # Redux store configuration
│       ├── hooks.ts         # Typed Redux hooks
│       ├── StoreProvider.tsx # Redux provider component
│       └── features/
│           └── appSlice.ts  # Example slice
└── package.json
```

## Setup Details

### Redux Toolkit
- Store configured in `lib/redux/store.ts`
- Typed hooks available: `useAppDispatch`, `useAppSelector`, `useAppStore`
- Example slice in `lib/redux/features/appSlice.ts`
- Provider wrapped in `app/provider.tsx`

### Material-UI Configuration
- Properly configured for Next.js 16 with `@mui/material-nextjs`
- Theme customized with:
  - Primary color: #222222
  - Text color: #222222
  - Font family: Red Hat Display, Proxima Nova

### Tailwind CSS
- Configured with custom theme in `globals.css`
- Font families and colors set as CSS variables
- Works alongside MUI components

### Fonts
- **Red Hat Display**: Loaded via Next.js Google Fonts (weights: 300, 400, 500, 600, 700)
- **Proxima Nova**: Link Adobe Fonts by replacing `your-kit-id` in `layout.tsx` with your Adobe Fonts Kit ID

## Usage

### Redux State Management
```typescript
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { setInitialized } from '@/lib/redux/features/appSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const initialized = useAppSelector((state) => state.app.initialized);
  
  // Use dispatch and state
}
```

### Material-UI Components
```typescript
import { Button, Typography } from '@mui/material';

function MyComponent() {
  return (
    <>
      <Typography variant="h1">Hello World</Typography>
      <Button variant="contained">Click Me</Button>
    </>
  );
}
```

### Tailwind CSS
```typescript
function MyComponent() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50">
      <h1 className="text-4xl font-bold text-primary">Hello World</h1>
    </div>
  );
}
```

## Next Steps

1. **Replace Adobe Fonts Kit ID**: Update `your-kit-id` in `app/layout.tsx` with your actual Adobe Fonts Kit ID for Proxima Nova
2. **Add more Redux slices**: Create additional slices in `lib/redux/features/`
3. **Customize MUI theme**: Modify `app/theme/mui-theme.ts` as needed
4. **Add Tailwind config**: Create `tailwind.config.ts` for extended customization if needed

## Development

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm start      # Start production server
npm run lint   # Run ESLint
```

## Dependencies

### Production
- @emotion/react, @emotion/styled
- @mui/material, @mui/material-nextjs, @mui/icons-material
- @reduxjs/toolkit, react-redux
- next, react, react-dom

### Development
- @tailwindcss/postcss, tailwindcss
- @types/node, @types/react, @types/react-dom
- eslint, eslint-config-next
- typescript
