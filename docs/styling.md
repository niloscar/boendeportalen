# Styling

In this document, we share what we have used for our different styling components to maintain consistency throughout the entire project.

## Colors

### Primary Colors
- **Primary Green**: `green-500` (primary action color)
- **Dark Green**: `green-700` (hover states, gradient overlays)
- **Darker Green overlay**: `green-950` (for subtle background overlays)

### Neutral Colors
- **Background Light**: `neutral-200` (input backgrounds, button backgrounds)
- **Text Dark**: `neutral-900` (primary text, headings)
- **White**: `white` (card backgrounds, form containers)
- **Gray Text**: `gray-600`, `gray-700` (secondary text, labels)
- **Light Gray**: `gray-500` (disabled text, footer text)

### Usage
- Use `green-500` for primary buttons and interactive elements
- Use `neutral-900` for primary headings and text
- Use `neutral-200` for input field backgrounds and secondary button backgrounds
- Use `white` for main content containers

## Buttons

### Primary Button (Call-to-action)
```
bg-neutral-900 text-white font-semibold rounded-2xl cursor-pointer hover:bg-neutral-800 transition duration-200
```
**Usage**: Login button, submit buttons, main actions
**Applied in**: Login.tsx

### Secondary Button (Social/Alternative)
```
bg-neutral-200 rounded-2xl cursor-pointer hover:bg-neutral-300 transition duration-200
```
**Usage**: Social login buttons, secondary actions
**Applied in**: Login.tsx

### Recommendations for Other Pages
- **Form submissions**: Use primary button style
- **Navigation buttons**: Consider adding icons with gap-2 for spacing
- **Danger actions**: Potentially use `bg-red-600` with same sizing
- **Link buttons**: Use text color with `hover:underline` (see Login footer links)

## Input Fields

```
w-full p-6 bg-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500
```

### Breakdown
- `w-full` - Full width of container
- `p-6` - Padding of 1.5rem (24px) for comfortable spacing
- `bg-neutral-200` - Light gray background
- `rounded-2xl` - Border radius of 16px for smooth edges
- `focus:outline-none` - Remove default outline
- `focus:ring-2` - Add 2px focus ring
- `focus:ring-green-500` - Use primary green for focus state

### Additional styling for labels
```
text-sm font-medium text-gray-700
```

### Recommendations for Other Pages
- Keep consistent `p-6` and `rounded-2xl` across all input fields
- Always include the focus ring for accessibility
- Use the same label styling for consistency
- For textareas, maintain the same base classes
- For select dropdowns, use matching styling

## Border Radius

### Consistent Sizing
- **Large rounded corners**: `rounded-2xl` (16px) - Used for inputs, buttons, cards
- **Medium rounded corners**: `rounded-lg` (8px) - For smaller components if needed
- **No rounding**: `rounded-none` - Only for specific design needs

### Applied in
- Login component: All buttons and inputs use `rounded-2xl`
- City image section: `rounded-l-2xl` and `rounded-r-2xl` for split design

### Recommendations
- Stick with `rounded-2xl` as default for major components
- This creates a modern, friendly appearance
- Use `rounded-l-2xl` or `rounded-r-2xl` for split/asymmetrical designs

## Gaps

### Spacing Scale
- `gap-2` - 8px (between small form elements like labels)
- `gap-4` - 16px (between buttons in a row)
- `gap-6` - 24px (between form sections, major content blocks)
- `gap-8` - 32px (between major layout sections)

### Applied in
```
gap-2  - Between label and input
gap-6  - Between form fields
gap-8  - Between header, welcome message, and form sections
```

### Recommendations for Other Pages
- Use consistent gaps to maintain visual rhythm
- `gap-6` as default for vertical spacing between form sections
- `gap-4` for horizontal spacing in button groups
- `gap-2` for tight label/input pairs

## Flexboxes

### Common Patterns

**Center content (both horizontally and vertically)**
```
flex items-center justify-center
```

**Full-height flexbox (common for page layouts)**
```
min-h-screen flex items-center justify-center
```

**Column layout with gaps**
```
flex flex-col gap-6
```

**Row layout with gaps**
```
flex flex-row gap-4 items-center
```

**Spacer layout (push items apart)**
```
flex flex-row items-center justify-between
```

### Applied in Login.tsx
- Main container: `h-screen flex bg-neutral-200 items-center justify-center` - Full height, centered
- Form container: `flex flex-col gap-6` - Vertical stacking with consistent spacing
- Header row: `flex flex-row items-center justify-between` - Logo on left, timestamp on right
- Input wrapper: `flex flex-col gap-2` - Label above, input below

### Recommendations for Other Pages
- Use `min-h-screen` for pages that should span full viewport
- Combine `flex flex-col` with `gap-X` for consistent vertical layouts
- Use `items-center justify-center` for centered sections
- Use `items-center justify-between` for header-type layouts