# Style Guide

This guide covers how to use Tailwind CSS effectively in the BostadsPortalen project. For quick reference, see the detailed examples in [styling.md](./styling.md).

## Tailwind CSS Overview

[Official Tailwind Documentation](https://tailwindcss.com/docs/)

Tailwind is a utility-first CSS framework. Instead of writing CSS classes, you compose styles directly in your HTML/JSX using utility classes.

### What to Expect

**Utility-First Approach**: You'll see long `className` strings with multiple Tailwind utilities:
```tsx
className="w-full p-6 bg-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
```

This is normal and expected. It's more maintainable than traditional CSS files for React projects.

### Key Concepts

#### 1. **Responsive Design (Mobile First)**
Tailwind uses breakpoint prefixes:
- `sm:` (640px+)
- `md:` (768px+)
- `lg:` (1024px+)
- `xl:` (1280px+)
- `2xl:` (1536px+)

Example:
```tsx
className="w-full md:w-1/2 lg:w-1/3" // Full width on mobile, half on tablet, third on desktop
```

#### 2. **State Variants**
Standard CSS states are prefixed:
- `hover:` - Mouse hover
- `focus:` - Input focus
- `active:` - Active state
- `disabled:` - Disabled elements

Example:
```tsx
className="bg-neutral-200 hover:bg-neutral-300 focus:ring-2 focus:ring-green-500"
```

#### 3. **Dark Mode (if needed)**
Add `dark:` prefix:
```tsx
className="bg-white dark:bg-neutral-900"
```

## How to Use It

### Basic Setup (Already Done)
The project is already configured with Tailwind. You don't need to install anything—just use the utilities in your `className` attributes.

### Common Tasks

#### Creating a Centered Container
```tsx
<div className="flex items-center justify-center h-screen">
    {/* Content */}
</div>
```

#### Styling a Form
```tsx
<form className="flex flex-col gap-6">
    <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Email:</label>
        <input className="w-full p-6 bg-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500" />
    </div>
</form>
```

#### Creating a Button
```tsx
<button className="w-full py-6 bg-neutral-900 text-white font-semibold rounded-2xl cursor-pointer hover:bg-neutral-800 transition duration-200">
    Click Me
</button>
```

#### Spacing
- Use **margin** (`m-`, `mt-`, `ml-`, etc.) to add space outside elements
- Use **padding** (`p-`, `pt-`, `pl-`, etc.) to add space inside elements
- Use **gap** (`gap-`) in flexbox containers for spacing between children

```tsx
<div className="flex flex-col gap-4 p-6 m-2"> {/* 4 = 16px, 6 = 24px, 2 = 8px */}
    {/* Children with 16px gap between them */}
</div>
```

## Common Issues & Solutions

### Issue: Styles Not Applying
**Cause**: Typo in class name or using unsupported values
**Solution**:
- Double-check spelling (e.g., `bg-neutral-200` not `bg-gray-200`)
- Check the [Tailwind color palette](https://tailwindcss.com/docs/customizing-colors)
- Verify the value exists (e.g., `p-6` is valid, but `p-7` might not be)

### Issue: Spacing is Off
**Cause**: Using wrong spacing scale or missing flex properties
**Solution**:
- Remember Tailwind scale: `1 = 4px, 2 = 8px, 3 = 12px, 4 = 16px, 6 = 24px, 8 = 32px`
- For flex layouts, combine with `gap-X` instead of `margin`

### Issue: Focus Ring Not Showing
**Cause**: Browser-specific styling conflicts
**Solution**:
```tsx
className="focus:outline-none focus:ring-2 focus:ring-green-500"
```
Always remove default outline and apply custom ring.

### Issue: Responsive Layout Looks Bad
**Cause**: Not accounting for mobile-first design
**Solution**: Always test mobile first, then add larger screen adjustments:
```tsx
className="w-full md:w-1/2 lg:w-1/3" // NOT lg:w-1/3 md:w-1/2 w-full
```

## Design Consistency

For this project, follow these guidelines:

### Colors
- **Primary action**: `green-500`
- **Hover states**: `green-700` or darker variant
- **Text**: `neutral-900` (main), `gray-700` (secondary)
- **Backgrounds**: `white`, `neutral-200`

See [styling.md](./styling.md) for complete color reference.

### Sizing
- **Buttons/Inputs**: Use `p-6` (24px padding) for a spacious, modern feel
- **Border radius**: `rounded-2xl` (16px) for main components
- **Gap**: `gap-6` between major sections, `gap-2` for tight pairs

### Transitions
For interactive elements, add smooth transitions:
```tsx
className="hover:bg-neutral-800 transition duration-200"
```

## Useful Resources

- [Tailwind Color Palette](https://tailwindcss.com/docs/customizing-colors) - All available colors
- [Tailwind Spacing Scale](https://tailwindcss.com/docs/customizing-spacing) - Padding, margin, gap values
- [Flexbox Guide](https://tailwindcss.com/docs/display#flex) - Layout utilities
- [Responsive Design](https://tailwindcss.com/docs/responsive-design) - Mobile-first breakpoints
- [State Variants](https://tailwindcss.com/docs/hover-focus-and-other-states) - Hover, focus, active, etc.

## Example: Complete Form Component

```tsx
function LoginForm() {
    return (
        <form className="flex flex-col gap-6">
            {/* Email Field */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Email:</label>
                <input
                type="email"
                className="w-full p-6 bg-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter email"
                />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Password:</label>
                <input
                type="password"
                className="w-full p-6 bg-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter password"
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full py-6 bg-neutral-900 text-white font-semibold rounded-2xl cursor-pointer hover:bg-neutral-800 transition duration-200"
            >
                Log In
            </button>

            {/* Secondary Action */}
            <button
                type="button"
                className="w-full py-4 bg-neutral-200 rounded-2xl cursor-pointer hover:bg-neutral-300 transition duration-200"
            >
                Sign Up
            </button>
        </form>
    );
}
```

## Tips for Success

1. **Consistency First**: Always refer to [styling.md](./styling.md) when adding new components
2. **Mobile First**: Style for mobile, then add responsive modifiers for larger screens
3. **Reuse Patterns**: Copy class names from existing components rather than creating new patterns
4. **Test Responsiveness**: Check your components on mobile, tablet, and desktop
5. **Keep It Simple**: Avoid deep nesting of utilities; break complex layouts into smaller components

Happy styling! 🎨