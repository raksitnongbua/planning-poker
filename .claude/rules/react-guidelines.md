# React 19 & React Compiler Rules

## Rules of React (Compiler Requirements)

Components and hooks must follow these rules — violations break compiler optimizations:

1. **Pure components** — same props/state/context always returns same JSX. No side effects during render.
2. **No mutation** — never mutate props, state, context, or hook return values. Finalize mutations before JSX creation.
3. **Hooks at top level only** — never inside loops, conditions, or nested functions.
4. **Never call components as functions** — always `<MyComponent />`, never `myComponent()`.

## Compiler-Managed Memoization

The React Compiler auto-memoizes. **Do not manually optimize unless profiler confirms a bottleneck.**

- No preemptive `useMemo`, `useCallback`, or `React.memo`
- No suppressing hook dependency ESLint warnings — fix the root cause
- Write plain functions; the compiler wraps as needed

## useEffect Rules

- One Effect = one external system (API, timer, WebSocket, event listener)
- Always return a cleanup function that mirrors setup
- Depend on primitives, not inline objects/functions — move those inside the effect
- Use `useRef` to track previous values when an effect must fire only on state transitions

```js
// Effect fires on every animated tick (40x per reveal)
useEffect(() => { setFrozen(score) }, [isRevealed, displayedScore]);

// Fire only when isRevealed transitions false -> true
const prevRef = useRef(false);
useEffect(() => {
  const justRevealed = isRevealed && !prevRef.current;
  prevRef.current = isRevealed;
  if (!justRevealed) return;
  setFrozen(averagePoint);
}, [isRevealed, averagePoint]);
```

## useState Initialization — No Mount Blink

Use lazy initializers for layout-sensitive state to prevent SSR->client layout jumps:

```js
// Wrong value on first paint, corrected by effect (visible blink)
const [scale, setScale] = useState(1);
useEffect(() => setScale(calcScale()), []);

// Correct value on first render, no blink
const [scale, setScale] = useState(calcScale);
```

## React 19 Patterns

| Pattern | Use case |
|---|---|
| `useActionState(async fn, init)` | Form/API mutations — handles pending + error automatically |
| `useOptimistic(state, reducer)` | Instant UI feedback before server confirms |
| `use(promise)` | Read async data in render (auto-suspends) |
| `ref` as a prop | Accept `ref` directly — no `forwardRef` needed |
| `<Context value={...}>` | No `.Provider` wrapper needed |

## Anti-patterns

- `new QueryClient()` as JSX prop — recreates on every render -> `useState(() => new QueryClient())`
- `new Date()` / `Math.random()` in render body — hoist to module-level constant
- Deriving state from state inside `useEffect` — compute in render or use lazy `useState`
- Inline object/array props `<C config={{a:1}} />` — new identity every render; extract to constants
- `window` / `localStorage` / `document` in render without `typeof window !== 'undefined'` guard
