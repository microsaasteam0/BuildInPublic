# Responsive Design Quick Reference

## 🎯 Breakpoints

| Name | Size | Usage |
|------|------|-------|
| `xs` | 475px | Extra small phones |
| `sm` | 640px | Small devices (phones) |
| `md` | 768px | Medium devices (tablets) |
| `lg` | 1024px | Large devices (laptops) |
| `xl` | 1280px | Extra large devices |
| `2xl` | 1536px | 2X large devices |
| `3xl` | 1920px | Ultra-wide displays |

## 📱 Common Patterns

### Container
```jsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
```

### Grid (1→2→3 columns)
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
```

### Flex (Column→Row)
```jsx
<div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
```

### Padding
```jsx
<div className="p-4 sm:p-6 md:p-8 lg:p-10">
```

### Text Sizes
```jsx
<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
<p className="text-base sm:text-lg md:text-xl">
```

### Buttons
```jsx
<button className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 text-sm sm:text-base">
```

## 🎨 Utility Classes

### Pre-built Responsive Classes
- `.text-display` - Display text (4xl→8xl)
- `.text-heading` - Heading text (2xl→5xl)
- `.text-subheading` - Subheading (xl→3xl)
- `.text-body-lg` - Large body (base→xl)
- `.container-padding` - Container padding
- `.section-spacing` - Section spacing
- `.card-padding` - Card padding
- `.rounded-card` - Responsive border radius
- `.flex-mobile-col` - Column on mobile, row on desktop

## 📐 Spacing Scale

| Class | Mobile | Tablet | Desktop |
|-------|--------|--------|---------|
| `gap-4 sm:gap-6 lg:gap-8` | 1rem | 1.5rem | 2rem |
| `p-4 sm:p-6 md:p-8 lg:p-10` | 1rem | 1.5rem→2rem | 2.5rem |
| `py-12 sm:py-16 md:py-20 lg:py-24` | 3rem | 4rem→5rem | 6rem |

## 🖼️ Images

### Responsive Image
```jsx
<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  className="w-full h-auto"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

## 🎯 Touch Targets

### Minimum Size
All interactive elements should be at least 44x44px on mobile:
```jsx
<button className="min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0">
```

Or use the utility:
```jsx
<button className="btn-touch">
```

## 📱 Mobile-Specific

### Prevent iOS Zoom
```jsx
<input
  type="email"
  className="text-base" // 16px minimum
/>
```

### Hide on Mobile
```jsx
<div className="hidden sm:block">
```

### Show Only on Mobile
```jsx
<div className="block sm:hidden">
```

## 🎭 Visibility Classes

| Class | Behavior |
|-------|----------|
| `hidden sm:block` | Hidden on mobile, visible on tablet+ |
| `block sm:hidden` | Visible on mobile, hidden on tablet+ |
| `hidden md:flex` | Hidden until tablet, flex on desktop |
| `lg:hidden` | Hidden on large screens |

## 🔄 Common Responsive Patterns

### Hero Section
```jsx
<section className="pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-40 lg:pb-32">
  <div className="container mx-auto px-4 sm:px-6">
    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
      Hero Title
    </h1>
    <p className="text-base sm:text-lg md:text-xl lg:text-2xl">
      Subtitle
    </p>
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
      <button>CTA 1</button>
      <button>CTA 2</button>
    </div>
  </div>
</section>
```

### Card Grid
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
  <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl">
    <h3 className="text-lg sm:text-xl md:text-2xl">Card Title</h3>
    <p className="text-sm sm:text-base">Card content</p>
  </div>
</div>
```

### Navigation
```jsx
<nav className="py-3 sm:py-5">
  <div className="container mx-auto px-4 sm:px-6">
    <div className="flex items-center justify-between">
      <Logo className="w-8 h-8 sm:w-10 sm:h-10" />
      <div className="hidden md:flex gap-4">
        {/* Desktop nav */}
      </div>
      <div className="md:hidden">
        <MobileMenu />
      </div>
    </div>
  </div>
</nav>
```

## ⚡ Performance Tips

1. **Use transform for animations** (not width/height)
2. **Lazy load images** with Next.js Image
3. **Debounce resize events**
4. **Use CSS containment** for complex components
5. **Minimize reflows** during scroll

## ✅ Testing Checklist

- [ ] Test on iPhone SE (375px)
- [ ] Test on standard phone (390px)
- [ ] Test on large phone (430px)
- [ ] Test on tablet (768px)
- [ ] Test on laptop (1280px)
- [ ] Test on desktop (1920px)
- [ ] Test portrait orientation
- [ ] Test landscape orientation
- [ ] Check touch targets (44x44px min)
- [ ] Verify no horizontal scroll
- [ ] Test with browser zoom (up to 200%)

## 🚫 Common Mistakes to Avoid

1. ❌ Fixed pixel widths without responsive alternatives
2. ❌ Hover-only interactions (no touch alternative)
3. ❌ Small touch targets (<44px)
4. ❌ Horizontal scrolling
5. ❌ Text that's too small on mobile
6. ❌ Forgetting to test on real devices
7. ❌ Not considering landscape orientation
8. ❌ Ignoring safe areas on notched devices

## 💡 Pro Tips

1. **Start mobile-first** - Add larger breakpoints as needed
2. **Use semantic breakpoints** - Think about content, not devices
3. **Test early and often** - Don't wait until the end
4. **Use browser DevTools** - Chrome/Firefox have excellent responsive modes
5. **Consider touch** - Design for fingers, not mouse cursors
6. **Optimize images** - Use appropriate sizes for each breakpoint
7. **Think about orientation** - Both portrait and landscape
8. **Use relative units** - rem/em over px when appropriate

## 📚 Resources

- [Tailwind Responsive Design Docs](https://tailwindcss.com/docs/responsive-design)
- [Can I Use](https://caniuse.com/) - Browser compatibility
- [Responsive Breakpoints](https://www.responsivebreakpoints.com/) - Image breakpoint generator
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly) - Google's tool
