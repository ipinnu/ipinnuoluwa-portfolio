export type PracticeLevel = "fix" | "build" | "explain";

export interface Exercise {
  type: PracticeLevel;
  instruction: string;
  starterCode?: string;
  checkKeywords?: string[];
}

export interface ExampleHighlight {
  line: number;
  hint: string;
}

export interface Lesson {
  id: number;
  slug: string;
  title: string;
  concept: string[];
  example: string;
  exampleHighlights?: ExampleHighlight[];
  practiceNote: string;
  exercises: Exercise[];
  docLinks: { label: string; url: string }[];
}

export const CURRICULUM: Lesson[] = [
  {
    id: 1,
    slug: "what-is-react",
    title: "What is React?",
    concept: [
      "React is a JavaScript library for building user interfaces. It was created by engineers at Facebook and is now maintained by Meta and a large open-source community. You use React to describe what your UI should look like — React figures out how to make it happen.",
      "The core idea in React is the component. A component is a small, self-contained piece of your interface — a button, a header, a form. You build complex UIs by combining simple components the same way you build a sentence from words.",
      "React uses something called a virtual DOM — a lightweight copy of the real DOM kept in memory. When your data changes, React compares the virtual DOM with the real one and updates only what actually changed. This makes React fast, even in large apps.",
      "You write React components as JavaScript functions. Each function returns a description of what should appear on screen. That description is written in JSX — a syntax that looks like HTML but lives inside JavaScript.",
    ],
    example: `function Greeting() {
  return <h1>Hello, world!</h1>
}`,
    exampleHighlights: [
      { line: 1, hint: "A component is just a JavaScript function — nothing special about the syntax" },
      { line: 2, hint: "It returns JSX — HTML-like syntax that describes what appears on screen" },
    ],
    practiceNote: "A React component is a function that returns JSX. The exercises test whether you can write a valid component — JSX must be closed, returned, and the function must have a capital letter name.",
    exercises: [
      {
        type: "fix",
        instruction:
          "This component has a syntax error. Fix it so it renders without errors.",
        starterCode: `export default function Welcome() {
  return <h1>Welcome to React
}`,
      },
      {
        type: "build",
        instruction:
          "Build a component called Profile that displays your name inside an <h2> tag. Export it as the default export.",
        starterCode: `export default function Profile() {
  // your code here
  return null
}`,
      },
      {
        type: "explain",
        instruction:
          "In your own words, why does React use components instead of writing one giant HTML file?",
        checkKeywords: [
          "reusable",
          "reuse",
          "separate",
          "independent",
          "piece",
          "part",
          "small",
          "isolated",
        ],
      },
    ],
    docLinks: [
      { label: "React — Quick Start", url: "https://react.dev/learn" },
      { label: "Thinking in React", url: "https://react.dev/learn/thinking-in-react" },
    ],
  },

  {
    id: 2,
    slug: "jsx",
    title: "JSX",
    concept: [
      "JSX stands for JavaScript XML. It lets you write HTML-like markup directly inside your JavaScript code. It looks like HTML, but it is not — JSX is actually shorthand for JavaScript function calls that the browser never sees directly.",
      "Before your code reaches the browser, a tool called Babel compiles JSX into plain JavaScript. For example, <h1>Hello</h1> compiles into React.createElement('h1', null, 'Hello'). JSX is just a nicer way to write that.",
      "JSX has a few rules that differ from HTML: every element must be closed, you must have exactly one root element per return statement, use className instead of class, and attribute names are camelCase (onClick not onclick).",
      "To embed a JavaScript expression inside JSX, wrap it in curly braces {}. You can put variables, function calls, arithmetic — anything that evaluates to a value. Curly braces are the bridge between JSX markup and JavaScript logic.",
    ],
    example: `function UserCard() {
  const name = "Ifeoluwa"
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>Software Developer</p>
    </div>
  )
}`,
    exampleHighlights: [
      { line: 2, hint: "A regular JS variable — it lives inside the function, above the return" },
      { line: 4, hint: "className not class — JSX uses camelCase to avoid clashing with JS reserved words" },
      { line: 5, hint: "{} curly braces — the bridge that lets you embed any JS expression into JSX" },
    ],
    practiceNote: "JSX has three rules that differ from HTML: use className not class, every tag must be closed, and JavaScript expressions go inside {}. The exercises test all three — if you spot a bug, trace it back to one of these rules.",
    exercises: [
      {
        type: "fix",
        instruction:
          "There are two JSX mistakes in this component. Find and fix them both.",
        starterCode: `export default function Bio() {
  return (
    <div>
      <h1 class="title">About Me</h1>
      <p>I build things for the web
      <p>Based in Lagos</p>
    </div>
  )
}`,
      },
      {
        type: "build",
        instruction:
          "Build a component called Badge. Use a variable for the name and display it with {}. Show a name and a role.",
        starterCode: `export default function Badge() {
  const name = "Your Name"
  // your code here
  return null
}`,
      },
      {
        type: "explain",
        instruction:
          "What is the difference between JSX and HTML? Name at least two differences.",
        checkKeywords: [
          "className",
          "camelCase",
          "curly",
          "expression",
          "compiles",
          "javascript",
          "one root",
          "closed",
        ],
      },
    ],
    docLinks: [
      { label: "Writing Markup with JSX", url: "https://react.dev/learn/writing-markup-with-jsx" },
      { label: "JavaScript in JSX with Curly Braces", url: "https://react.dev/learn/javascript-in-jsx-with-curly-braces" },
    ],
  },

  {
    id: 3,
    slug: "components",
    title: "Components",
    concept: [
      "A React component is a JavaScript function that returns JSX. That's it. The function can do anything — fetch data, calculate values, store state — but it must return something that describes the UI.",
      "Component names must start with a capital letter. This is not a style preference — it is how React tells the difference between a built-in HTML tag like <div> and a custom component like <Button>. Lowercase names are treated as HTML tags.",
      "Components can render other components. You nest them exactly like HTML tags — just use the component name as the tag. This is how you build complex UIs out of small, focused pieces.",
      "A good component does one thing. If you find a component doing too much — handling three kinds of state, rendering five different sections — that is a signal to break it into smaller components.",
    ],
    example: `function Button() {
  return <button>Click me</button>
}

function App() {
  return (
    <div>
      <Button />
      <Button />
      <Button />
    </div>
  )
}`,
    exampleHighlights: [
      { line: 1, hint: "Capital B — React knows this is your component, not the <button> HTML tag" },
      { line: 8, hint: "Reuse the same component by writing it like an HTML tag — as many times as needed" },
    ],
    practiceNote: "React distinguishes your components from built-in HTML tags by capitalisation — <button> is HTML, <Button> is yours. The fix-it exercise tests exactly this: a lowercase component name that React silently treats as an unknown HTML tag.",
    exercises: [
      {
        type: "fix",
        instruction:
          "This component won't render. Find the problem and fix it.",
        starterCode: `function card() {
  return <div>I am a card</div>
}

export default function App() {
  return <card />
}`,
      },
      {
        type: "build",
        instruction:
          "Build two components: Avatar (shows two initials in a circle) and ProfileCard (uses Avatar plus a name and a title). Nest Avatar inside ProfileCard.",
        starterCode: `function Avatar() {
  // your code here
  return null
}

export default function ProfileCard() {
  // your code here — use <Avatar /> inside
  return null
}`,
      },
      {
        type: "explain",
        instruction:
          "Why do React component names need to start with a capital letter?",
        checkKeywords: [
          "lowercase",
          "html",
          "tag",
          "react",
          "differentiate",
          "distinguish",
          "custom",
          "built-in",
          "convention",
        ],
      },
    ],
    docLinks: [
      { label: "Your First Component", url: "https://react.dev/learn/your-first-component" },
      { label: "Importing and Exporting Components", url: "https://react.dev/learn/importing-and-exporting-components" },
    ],
  },

  {
    id: 4,
    slug: "props",
    title: "Props",
    concept: [
      "Props are how you pass data into a component. They work like function arguments — the parent component provides them, and the child component receives them. The name 'props' is short for properties.",
      "Props flow in one direction: from parent to child. A component cannot modify its own props. If you want to change data, that data needs to live in state (covered in the next lesson).",
      "You pass props as attributes in JSX: <Greeting name=\"Tolu\" />. Inside the component, you receive them as a single object and destructure what you need: function Greeting({ name }).",
      "You can pass any JavaScript value as a prop — strings, numbers, booleans, arrays, objects, and even functions. For non-string values, wrap them in curly braces: <Card price={1500} active={true} />.",
    ],
    example: `function Greeting({ name, role }) {
  return (
    <div>
      <h2>Hello, {name}</h2>
      <p>{role}</p>
    </div>
  )
}

function App() {
  return <Greeting name="Tolu" role="Frontend Developer" />
}`,
    exampleHighlights: [
      { line: 1, hint: "Destructure props in the signature — this is where name and role become available" },
      { line: 4, hint: "{name} renders the prop value — comes from wherever Greeting is used" },
      { line: 11, hint: "Parent passes props as attributes — child receives them as the object above" },
    ],
    practiceNote: "Props must be destructured in the function signature to be accessible — writing function ProductCard() with no parameters means name and price don't exist inside it. The fix-it exercise tests this directly: the data is passed correctly from the parent, but the component isn't set up to receive it.",
    exercises: [
      {
        type: "fix",
        instruction:
          "The component should display the product name and price, but it's not receiving props correctly. Fix it.",
        starterCode: `function ProductCard() {
  return (
    <div>
      <h3>{name}</h3>
      <p>₦{price}</p>
    </div>
  )
}

export default function App() {
  return <ProductCard name="Wireless Headphones" price={15000} />
}`,
      },
      {
        type: "build",
        instruction:
          "Build a TeamMember component that accepts name, role, and location as props. Use it three times in App with different values each time.",
        starterCode: `function TeamMember({ name, role, location }) {
  // your code here
  return null
}

export default function App() {
  return (
    <div>
      {/* Use <TeamMember /> three times with different props */}
    </div>
  )
}`,
      },
      {
        type: "explain",
        instruction:
          "Why can't a component change its own props?",
        checkKeywords: [
          "one-way",
          "one way",
          "read-only",
          "read only",
          "parent",
          "immutable",
          "data flow",
          "flow",
          "downward",
        ],
      },
    ],
    docLinks: [
      { label: "Passing Props to a Component", url: "https://react.dev/learn/passing-props-to-a-component" },
    ],
  },

  {
    id: 5,
    slug: "state",
    title: "State",
    concept: [
      "State is data that belongs to a component and can change over time. When state changes, React automatically re-renders that component with the new data — you never manually update the DOM.",
      "You create state with the useState hook. It returns two things: the current value, and a function to update it. By convention, they're named [something, setSomething].",
      "You must always use the setter function — never modify state directly. Doing myArray.push(item) or count = count + 1 won't trigger a re-render. setCount(count + 1) will.",
      "State is private to the component that owns it. If two components need to share state, you lift it up to their nearest common parent and pass it down as props.",
    ],
    example: `import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}

export default Counter`,
    exampleHighlights: [
      { line: 4, hint: "[value, setter] = useState(initial) — always destructure both, always provide a starting value" },
      { line: 8, hint: "Render the current state value — React updates this automatically when setCount is called" },
      { line: 9, hint: "Call setCount inside onClick — this is what triggers the re-render" },
    ],
    practiceNote: "useState returns two things: the current value and a setter function. The fix-it exercise has both missing — no setter in the destructure and no onClick to call it. Without the setter, clicking a button can never trigger a re-render.",
    exercises: [
      {
        type: "fix",
        instruction:
          "The counter below doesn't work. It has two issues — find and fix them both.",
        starterCode: `import { useState } from 'react'

export default function Counter() {
  const [count] = useState(0)

  return (
    <button>
      {count}
    </button>
  )
}`,
      },
      {
        type: "build",
        instruction:
          "Build a LightSwitch component. It shows 'ON' or 'OFF' as text. Clicking a button toggles between the two states.",
        starterCode: `import { useState } from 'react'

export default function LightSwitch() {
  // your code here
  return null
}`,
      },
      {
        type: "explain",
        instruction:
          "What is the difference between props and state? When would you use each?",
        checkKeywords: [
          "props",
          "parent",
          "external",
          "state",
          "internal",
          "changes",
          "own",
          "component",
          "mutable",
        ],
      },
    ],
    docLinks: [
      { label: "State: A Component's Memory", url: "https://react.dev/learn/state-a-components-memory" },
      { label: "useState Reference", url: "https://react.dev/reference/react/useState" },
    ],
  },

  {
    id: 6,
    slug: "events",
    title: "Events",
    concept: [
      "React handles events using camelCase names attached directly to JSX elements: onClick, onChange, onSubmit, onKeyDown. You pass an event handler — a function — as the value.",
      "The handler can be defined inline or as a named function above the return statement. Named functions are easier to read when the logic gets complex. Inline arrow functions are fine for simple one-liners.",
      "React passes the browser's native event object to your handler automatically. You access it as the first argument — by convention named e or event. This is the same event object you'd get in vanilla JavaScript.",
      "A common mistake: calling the function instead of passing it. onClick={handleClick} passes the reference. onClick={handleClick()} calls it immediately on every render. Always pass the reference, not the call.",
    ],
    example: `function AlertButton() {
  function handleClick() {
    alert('Button was clicked!')
  }

  return <button onClick={handleClick}>Click Me</button>
}

export default AlertButton`,
    exampleHighlights: [
      { line: 2, hint: "Named handler — define it above the return so JSX stays readable" },
      { line: 6, hint: "onClick={handleClick} — reference only, no (). Adding () here would fire it on every render" },
    ],
    practiceNote: "onClick={fn} passes the function — React calls it when clicked. onClick={fn()} calls it immediately during render. The fix-it exercise has this exact bug: alert('hello') runs on every render instead of waiting for a click.",
    exercises: [
      {
        type: "fix",
        instruction:
          "The button calls the function immediately on render instead of when clicked. Fix it without changing the alert message.",
        starterCode: `export default function App() {
  return (
    <button onClick={alert('hello')}>
      Say Hello
    </button>
  )
}`,
      },
      {
        type: "build",
        instruction:
          "Build a LiveInput component. It has a text input and displays what you're typing below it in real time. Use onChange to track the value.",
        starterCode: `import { useState } from 'react'

export default function LiveInput() {
  // your code here
  return null
}`,
      },
      {
        type: "explain",
        instruction:
          "Why do we write onClick={handleClick} and not onClick={handleClick()}?",
        checkKeywords: [
          "call",
          "invoke",
          "reference",
          "function",
          "render",
          "immediately",
          "parentheses",
          "every",
        ],
      },
    ],
    docLinks: [
      { label: "Responding to Events", url: "https://react.dev/learn/responding-to-events" },
    ],
  },

  {
    id: 7,
    slug: "conditional-rendering",
    title: "Conditional Rendering",
    concept: [
      "Conditional rendering means showing different UI based on a condition — exactly like conditional logic in regular JavaScript. React doesn't have a special directive for this; you just use JavaScript inside JSX.",
      "The ternary operator condition ? <A /> : <B /> is the most common pattern. Use it when you need to show one thing or another — two different outcomes based on one condition.",
      "The logical AND operator condition && <Component /> is cleaner when you only need to show something or nothing. If the condition is false, React renders nothing. Tip: make sure the condition is a boolean — {count && <Badge />} will print '0' when count is 0.",
      "For complex conditions with many branches, pull the logic out into a variable or a separate if/else block above the return statement. Keep the JSX itself readable — move complexity up, not into the markup.",
    ],
    example: `function UserStatus({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <p>Welcome back!</p>
      ) : (
        <p>Please log in.</p>
      )}
    </div>
  )
}

export default function App() {
  return <UserStatus isLoggedIn={true} />
}`,
    exampleHighlights: [
      { line: 4, hint: "Ternary starts here — the condition is isLoggedIn" },
      { line: 5, hint: "True branch — rendered when isLoggedIn is true" },
      { line: 6, hint: ": separates true from false — this is the false branch" },
      { line: 7, hint: "False branch — rendered when isLoggedIn is false" },
    ],
    practiceNote: "Use && when you want to show something or nothing — if the condition is false, nothing renders. Use a ternary when you need two different outcomes. The fix-it exercise shows a badge that always renders; the fix is wrapping it in a condition using &&.",
    exercises: [
      {
        type: "fix",
        instruction:
          "The notification badge should only show when count is greater than 0. Right now it always shows. Fix it.",
        starterCode: `export default function NotificationBell({ count = 3 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span>🔔</span>
      <span style={{
        background: '#E8FF47',
        color: '#000',
        borderRadius: 9999,
        padding: '2px 8px',
        fontSize: 12,
      }}>{count}</span>
    </div>
  )
}`,
      },
      {
        type: "build",
        instruction:
          "Build a PasswordStrength component. Accept a password prop (string). Show 'Weak' if length < 6, 'Medium' if 6–10, 'Strong' if > 10. Style each label differently.",
        starterCode: `export default function PasswordStrength({ password = '' }) {
  // your code here
  return null
}`,
      },
      {
        type: "explain",
        instruction:
          "When would you use && instead of a ternary operator for conditional rendering?",
        checkKeywords: [
          "nothing",
          "null",
          "one condition",
          "both",
          "either",
          "show",
          "hide",
          "else",
          "empty",
          "or nothing",
        ],
      },
    ],
    docLinks: [
      { label: "Conditional Rendering", url: "https://react.dev/learn/conditional-rendering" },
    ],
  },

  {
    id: 8,
    slug: "lists",
    title: "Lists",
    concept: [
      "When you have an array of data and want to render a list of UI elements from it, use the JavaScript .map() method. It transforms each item in the array into a piece of JSX.",
      "Every item rendered in a list must have a unique key prop. The key must be a string or number that uniquely identifies that item among its siblings — usually an ID from your data.",
      "React uses keys to track which items have changed, been added, or been removed between renders. Without keys, React has to guess — which causes bugs with stateful list items and is slower.",
      "Don't use the array index as a key if your list can be reordered or filtered. Index keys cause subtle bugs because the key stays the same even when a different item is at that position. Use a real ID when you have one.",
    ],
    example: `function SkillList() {
  const skills = ['React', 'TypeScript', 'Node.js', 'SQL']

  return (
    <ul>
      {skills.map((skill) => (
        <li key={skill}>{skill}</li>
      ))}
    </ul>
  )
}

export default SkillList`,
    exampleHighlights: [
      { line: 6, hint: ".map() transforms every item in the array into a JSX element" },
      { line: 7, hint: "key={skill} — must be unique per sibling so React can track which item changed" },
    ],
    practiceNote: "Every item rendered with .map() needs a unique key prop — React uses it to know which item changed, was added, or was removed. The fix-it exercise produces a warning because the <li> has no key; the data already has an id field you can use.",
    exercises: [
      {
        type: "fix",
        instruction:
          "React is logging a warning about missing keys. Fix it.",
        starterCode: `export default function MovieList() {
  const movies = [
    { id: 1, title: 'Inception' },
    { id: 2, title: 'Interstellar' },
    { id: 3, title: 'Dune' },
  ]

  return (
    <ul>
      {movies.map((movie) => (
        <li>{movie.title}</li>
      ))}
    </ul>
  )
}`,
      },
      {
        type: "build",
        instruction:
          "Build a ContactList component. Render each contact's name and email in a card. The contacts array is already provided.",
        starterCode: `export default function ContactList() {
  const contacts = [
    { id: 1, name: 'Amara', email: 'amara@mail.com' },
    { id: 2, name: 'Tunde', email: 'tunde@mail.com' },
    { id: 3, name: 'Chisom', email: 'chisom@mail.com' },
  ]

  // your code here
  return null
}`,
      },
      {
        type: "explain",
        instruction:
          "Why does React require a key prop when rendering lists? What problem does it solve?",
        checkKeywords: [
          "identify",
          "track",
          "change",
          "update",
          "re-render",
          "unique",
          "dom",
          "efficient",
          "diff",
        ],
      },
    ],
    docLinks: [
      { label: "Rendering Lists", url: "https://react.dev/learn/rendering-lists" },
    ],
  },

  {
    id: 9,
    slug: "forms",
    title: "Forms",
    concept: [
      "A controlled input is an input whose value is driven by React state. You set the value attribute to a state variable and update that state on every keystroke with onChange. React is always in sync with what the user typed.",
      "This contrasts with uncontrolled inputs — where the DOM manages the value and you read it only when needed (usually with a ref). Controlled inputs are React's preferred pattern because they give you instant access to the value for validation, transformation, or other logic.",
      "Form submission uses the onSubmit event on the <form> element, not onClick on the button. Always call e.preventDefault() as the first line of your handler — without it, the browser reloads the page on submit.",
      "For multi-field forms, you can use one state variable per field, or combine them into a single object: useState({ name: '', email: '' }). Update with spread: setForm({ ...form, name: e.target.value }).",
    ],
    example: `import { useState } from 'react'

function ContactForm() {
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    alert('Submitted: ' + name)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
      />
      <button type="submit">Submit</button>
    </form>
  )
}

export default ContactForm`,
    exampleHighlights: [
      { line: 7, hint: "e.preventDefault() stops the browser from refreshing — always the first line in a submit handler" },
      { line: 14, hint: "value={name} — React controls what the input shows, not the DOM" },
      { line: 15, hint: "onChange fires on every keystroke and updates state, keeping React in sync" },
    ],
    practiceNote: "A controlled input has two parts: value={state} so React owns what's displayed, and onChange to update that state as the user types. Without both, the input is uncontrolled. The fix-it also has a missing e.preventDefault() — without it the browser reloads the page on submit.",
    exercises: [
      {
        type: "fix",
        instruction:
          "The form reloads the page on submit. The input is also not controlled. Fix both issues.",
        starterCode: `import { useState } from 'react'

export default function SearchForm() {
  const [query, setQuery] = useState('')

  function handleSubmit() {
    console.log('Searching for:', query)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Search..." />
      <button type="submit">Search</button>
    </form>
  )
}`,
      },
      {
        type: "build",
        instruction:
          "Build a FeedbackForm with two fields: name and message. On submit, display the submitted values below the form. Clear the fields after submission.",
        starterCode: `import { useState } from 'react'

export default function FeedbackForm() {
  // your code here
  return null
}`,
      },
      {
        type: "explain",
        instruction:
          "What is a controlled input and why does React prefer it?",
        checkKeywords: [
          "state",
          "value",
          "onchange",
          "controlled",
          "track",
          "single source",
          "truth",
          "sync",
          "validation",
        ],
      },
    ],
    docLinks: [
      { label: "Reacting to Input with State", url: "https://react.dev/learn/reacting-to-input-with-state" },
    ],
  },

  {
    id: 10,
    slug: "effects",
    title: "Effects",
    concept: [
      "useEffect lets you run code after a component renders. Use it for things that need to reach outside of React: updating the document title, setting up a timer, subscribing to an event, or starting a network request.",
      "useEffect takes two arguments: the effect function, and a dependency array. The dependency array controls when the effect re-runs. If you pass [count], the effect runs whenever count changes.",
      "An empty array [] means the effect runs once — after the first render only. No array means it runs after every render. Missing the dependency array when you meant to use [] is a very common bug.",
      "Effects can return a cleanup function. React calls it before running the effect again, and when the component unmounts. Use cleanup to clear timers, cancel subscriptions, and avoid memory leaks.",
    ],
    example: `import { useState, useEffect } from 'react'

function Timer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return <p>Time elapsed: {seconds}s</p>
}

export default Timer`,
    exampleHighlights: [
      { line: 6, hint: "useEffect runs this function after the component renders — this is where side effects live" },
      { line: 11, hint: "Return a cleanup function — React calls it when the component unmounts to prevent memory leaks" },
      { line: 12, hint: "[] empty array — run once on mount and never again. Remove the [] and it runs after every render" },
    ],
    practiceNote: "The dependency array controls when useEffect runs: [] means once on mount, [count] means whenever count changes, no array means every render. The fix-it has no array at all — the effect runs on every render including the ones it triggers, causing a loop.",
    exercises: [
      {
        type: "fix",
        instruction:
          "The document title should update only when count changes. Right now the effect runs on every render. Fix the dependency array.",
        starterCode: `import { useState, useEffect } from 'react'

export default function PageTitle() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = 'Count: ' + count
  })

  return (
    <button onClick={() => setCount(count + 1)}>
      Increment ({count})
    </button>
  )
}`,
      },
      {
        type: "build",
        instruction:
          "Build a JokeFetcher component that fetches a random joke from https://official-joke-api.appspot.com/random_joke and displays the setup and punchline. Show a loading state while fetching.",
        starterCode: `import { useState, useEffect } from 'react'

export default function JokeFetcher() {
  // your code here
  return null
}`,
      },
      {
        type: "explain",
        instruction:
          "What is the purpose of the dependency array in useEffect? What happens if you leave it empty vs. leave it out entirely?",
        checkKeywords: [
          "dependency",
          "runs",
          "change",
          "once",
          "mount",
          "watch",
          "value",
          "trigger",
          "every render",
        ],
      },
    ],
    docLinks: [
      { label: "Synchronizing with Effects", url: "https://react.dev/learn/synchronizing-with-effects" },
      { label: "useEffect Reference", url: "https://react.dev/reference/react/useEffect" },
    ],
  },

  {
    id: 11,
    slug: "data-fetching",
    title: "Data Fetching",
    concept: [
      "Most real apps need to load data from an API. The basic React pattern is fetch inside useEffect with three state variables: loading, error, and data. You show different UI depending on which state you're in.",
      "The fetch lives inside useEffect with the right dependency array so it doesn't run on every render. If you're fetching based on a prop (like a userId), add that prop to the dependency array — the fetch re-runs whenever it changes.",
      "Always handle the three cases: while loading, show a spinner or placeholder. If something went wrong, show the error clearly. Only render the real data when it's actually there — otherwise you'll get crashes from trying to access properties on null.",
      "For production apps, consider a library like TanStack Query (React Query) that handles caching, refetching, and deduplication for you. The manual pattern here is the foundation — understanding it makes those tools much easier.",
    ],
    example: `import { useState, useEffect } from 'react'

function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch('https://jsonplaceholder.typicode.com/users/' + userId)
      .then(res => res.json())
      .then(data => {
        setUser(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [userId])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  return <h2>{user.name}</h2>
}

export default function App() {
  return <UserProfile userId={1} />
}`,
    exampleHighlights: [
      { line: 4, hint: "Three state variables — one for each possible outcome of the fetch" },
      { line: 5, hint: "loading starts true — show a placeholder immediately before data arrives" },
      { line: 6, hint: "error captures the failure message so you can display it to the user" },
      { line: 20, hint: "[userId] — the fetch re-runs whenever userId changes, keeping data in sync with props" },
      { line: 22, hint: "Handle all three states before the happy path — never render data that might be null" },
    ],
    practiceNote: "Fetching data has three states you must handle: loading (show a placeholder), error (show the message), and success (show the data). The fix-it is also missing the [] dependency array — without it the fetch triggers a re-render which triggers another fetch, creating an infinite loop.",
    exercises: [
      {
        type: "fix",
        instruction:
          "The fetch runs on every render, causing an infinite loop. Fix it. Also add a loading state.",
        starterCode: `import { useState, useEffect } from 'react'

export default function PostList() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
      .then(res => res.json())
      .then(data => setPosts(data))
  })

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}`,
      },
      {
        type: "build",
        instruction:
          "Fetch a list of countries from https://restcountries.com/v3.1/region/africa?fields=name,capital,flags and display each country's flag, name, and capital. Handle loading and error states.",
        starterCode: `import { useState, useEffect } from 'react'

export default function AfricaCountries() {
  // your code here
  return null
}`,
      },
      {
        type: "explain",
        instruction:
          "Why do we put the fetch call inside useEffect instead of directly in the component body?",
        checkKeywords: [
          "every render",
          "infinite",
          "loop",
          "effect",
          "once",
          "side effect",
          "mount",
          "re-render",
        ],
      },
    ],
    docLinks: [
      { label: "Fetching Data", url: "https://react.dev/learn/synchronizing-with-effects#fetching-data" },
    ],
  },

  {
    id: 12,
    slug: "task-manager",
    title: "Mini Project: Task Manager",
    concept: [
      "You've covered 11 React concepts: components, JSX, props, state, events, conditional rendering, lists, forms, effects, and data fetching. This capstone project uses every single one of them — in a real, working app.",
      "The goal is a functional task manager. You'll add tasks with a form, render them as a list, let users mark them complete, delete them, and show a count of what's remaining. You'll also persist tasks to localStorage so they survive a page refresh.",
      "There is no new concept here. If you get stuck on a step, the lesson number for that concept is right next to it in the requirements. Go back, re-read, then come back.",
    ],
    example: "",
    practiceNote: "This project uses every concept from the course: useState for task data (Lesson 5), .map() with keys for rendering (Lesson 8), form handling with e.preventDefault() (Lesson 9), conditional rendering for completed tasks (Lesson 7), and useEffect with localStorage for persistence (Lesson 10). If you get stuck on a step, the lesson reference is written in the starter code.",
    exercises: [
      {
        type: "build",
        instruction:
          "Build a complete TaskManager. Requirements: (1) Add tasks using a form input. (2) Display tasks in a list. (3) Mark tasks complete — completed tasks get a strikethrough style. (4) Delete tasks. (5) Show 'X tasks remaining' count. (6) Save tasks to localStorage so they persist on refresh.",
        starterCode: `import { useState, useEffect } from 'react'

// Requirements:
// 1. Add tasks using a form input           (Lesson 9 — Forms)
// 2. Display tasks in a list               (Lesson 8 — Lists)
// 3. Mark tasks complete (strikethrough)   (Lesson 7 — Conditional Rendering)
// 4. Delete tasks                          (Lesson 5 — State)
// 5. Show "X tasks remaining"              (Lesson 7 — Conditional Rendering)
// 6. Save to localStorage on change       (Lesson 10 — Effects)

export default function TaskManager() {
  // your code here
  return null
}`,
      },
    ],
    docLinks: [
      { label: "React — Quick Start", url: "https://react.dev/learn" },
      { label: "useState Reference", url: "https://react.dev/reference/react/useState" },
      { label: "useEffect Reference", url: "https://react.dev/reference/react/useEffect" },
    ],
  },
];

export const TOTAL_LESSONS = CURRICULUM.length;

export function getLessonBySlug(slug: string): Lesson | undefined {
  return CURRICULUM.find((l) => l.slug === slug);
}

export function getLessonById(id: number): Lesson | undefined {
  return CURRICULUM.find((l) => l.id === id);
}

export function getAdjacentLessons(slug: string): {
  prev: Lesson | null;
  next: Lesson | null;
} {
  const idx = CURRICULUM.findIndex((l) => l.slug === slug);
  return {
    prev: idx > 0 ? CURRICULUM[idx - 1] : null,
    next: idx < CURRICULUM.length - 1 ? CURRICULUM[idx + 1] : null,
  };
}
