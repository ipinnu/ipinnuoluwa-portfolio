export interface GlossaryEntry {
  term: string;
  aliases: string[];
  plainEnglish: string;
  inReact: string;
  example?: string;
  learnMoreLesson?: number;
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    term: "function",
    aliases: ["functions", "function's"],
    plainEnglish:
      "A reusable block of code that performs a specific task. You define it once, give it a name, and call it whenever you need it to run. Think of it like a recipe — write the steps once, cook it as many times as you want.",
    inReact:
      "Every React component is a function. You define a function called Button or Header, and React calls it whenever it needs to display that piece of the screen.",
    example: `function greet(name) {\n  return "Hello, " + name\n}\n\ngreet("Tolu") // "Hello, Tolu"`,
    learnMoreLesson: 1,
  },
  {
    term: "component",
    aliases: ["components", "component's"],
    plainEnglish:
      "A self-contained piece of your user interface. Like a Lego brick — small, reusable, and combinable. A button is a component. A navigation bar is a component. Even a whole page can be a component.",
    inReact:
      "In React, a component is a JavaScript function that returns JSX. You write it once and reuse it everywhere. <Button /> can appear 50 times in your app — one definition, 50 uses.",
    example: `function Button() {\n  return <button>Click me</button>\n}`,
    learnMoreLesson: 3,
  },
  {
    term: "JSX",
    aliases: [],
    plainEnglish:
      "A special syntax that looks like HTML but lives inside JavaScript. It was invented so React developers could describe what the UI should look like without switching back and forth between two completely different languages.",
    inReact:
      "JSX gets compiled into regular JavaScript before the browser sees it. <h1>Hello</h1> becomes React.createElement('h1', null, 'Hello'). You write the readable version; the build tool handles the translation.",
    example: `// JSX\nconst element = <h1>Hello, world!</h1>\n\n// What it compiles to\nconst element = React.createElement('h1', null, 'Hello, world!')`,
    learnMoreLesson: 2,
  },
  {
    term: "state",
    aliases: ["states"],
    plainEnglish:
      "Information a component remembers between renders. If you think of a light switch, its state is either ON or OFF. When the state changes, the component updates the screen to reflect the new reality.",
    inReact:
      "State is created with useState. Unlike a regular variable, changing state tells React to re-run the component function and update only what changed on screen — automatically, no manual DOM manipulation.",
    example: `const [isOn, setIsOn] = useState(false)\n\n// When you call setIsOn(true),\n// React re-renders and updates the screen`,
    learnMoreLesson: 5,
  },
  {
    term: "props",
    aliases: ["prop", "properties"],
    plainEnglish:
      "Data passed from a parent component to a child component. Like filling out a form — you provide specific values, the component uses them. Props let you reuse the same component with different data each time.",
    inReact:
      "Props flow one way: parent to child. A child can never change its own props. If data needs to change, it lives in state (which the parent owns), not in props.",
    example: `function Greeting({ name }) {\n  return <h1>Hello, {name}</h1>\n}\n\n<Greeting name="Amara" />`,
    learnMoreLesson: 4,
  },
  {
    term: "hook",
    aliases: ["hooks", "React hooks"],
    plainEnglish:
      "A special function that lets you add features — like memory or timers — to a simple function. Before hooks, you needed a more complex class-based syntax to do anything beyond displaying static content.",
    inReact:
      "Hooks always start with 'use' — useState, useEffect, useRef. They can only be called at the top level of a component, not inside loops or conditions. They were introduced in React 16.8 (2019) and changed everything.",
    example: `// useState and useEffect are both hooks\nimport { useState, useEffect } from 'react'`,
    learnMoreLesson: 5,
  },
  {
    term: "useState",
    aliases: [],
    plainEnglish:
      "The hook that gives a component memory. It creates a piece of data that the component can read and update. Every time you update it, the screen refreshes to show the new value.",
    inReact:
      "useState returns two things in an array: the current value, and a function to change it. You must always use the setter function — never change the value directly, or React won't know to update the screen.",
    example: `const [count, setCount] = useState(0)\n//     ↑ value   ↑ setter   ↑ initial value`,
    learnMoreLesson: 5,
  },
  {
    term: "useEffect",
    aliases: [],
    plainEnglish:
      "The hook for doing things that happen outside of React — fetching data, setting a timer, updating the page title. 'Effect' means a side effect: something your code does beyond just returning UI.",
    inReact:
      "useEffect runs after the component renders. The second argument (the dependency array) controls when it runs again. [] means once on mount. [value] means re-run whenever value changes. No array means every render.",
    example: `useEffect(() => {\n  document.title = "New Title"\n}, []) // Runs once on mount`,
    learnMoreLesson: 10,
  },
  {
    term: "render",
    aliases: ["renders", "rendered", "rendering", "re-render", "re-renders"],
    plainEnglish:
      "The process of turning your component code into actual content visible on screen. When React 'renders' a component, it calls the function and translates the returned JSX into real HTML in the browser.",
    inReact:
      "React re-renders a component whenever its state or props change. It's smarter than updating everything — it compares the new output with the old one (using the virtual DOM) and only updates what actually changed.",
    example: `// React calls this function on every render\nfunction Counter() {\n  const [n, setN] = useState(0)\n  return <p>{n}</p> // Re-renders when n changes\n}`,
  },
  {
    term: "DOM",
    aliases: [],
    plainEnglish:
      "Document Object Model — the browser's internal map of your web page. It's a tree of objects: the <body> contains a <div>, which contains a <p>, which contains text. JavaScript can read and modify this tree to change what appears on screen.",
    inReact:
      "React tries to touch the real DOM as little as possible because DOM operations are slow. It uses a virtual DOM — a copy kept in memory — to calculate the minimum changes needed, then applies only those.",
    example: `// Without React (raw DOM manipulation):\ndocument.getElementById('title').textContent = 'New Title'\n\n// With React (just update state):\nsetTitle('New Title')`,
  },
  {
    term: "virtual DOM",
    aliases: [],
    plainEnglish:
      "A lightweight copy of the real DOM that React keeps in memory. When something changes, React updates this virtual copy first, compares it with the previous version to find differences, then applies only those differences to the real DOM.",
    inReact:
      "You never interact with the virtual DOM directly. It's an implementation detail React handles for you. The benefit: React batches and optimises updates, so your app stays fast even with many changes happening at once.",
    example: `// You describe what you want:\nreturn <h1>Count: {count}</h1>\n\n// React figures out the minimum DOM change needed`,
  },
  {
    term: "HTML",
    aliases: [],
    plainEnglish:
      "HyperText Markup Language — the skeleton of every web page. It defines structure: headings, paragraphs, links, images, buttons. Without HTML, there's nothing to style or make interactive. Invented by Tim Berners-Lee in 1991.",
    inReact:
      "React uses JSX instead of raw HTML, but JSX compiles to HTML in the end. Most HTML attributes are the same in JSX with small differences: class becomes className, for becomes htmlFor.",
    example: `<!-- HTML -->\n<h1 class="title">Hello</h1>\n\n{/* JSX */}\n<h1 className="title">Hello</h1>`,
  },
  {
    term: "CSS",
    aliases: [],
    plainEnglish:
      "Cascading Style Sheets — the appearance layer of the web. It controls colours, fonts, spacing, layout, and animation. Without CSS, every web page looks like a plain text document. Created by Håkon Wium Lie in 1994.",
    inReact:
      "In React you can apply CSS through className (linking to a .css file), inline styles as JavaScript objects ({ color: 'red' }), or CSS-in-JS libraries. All three approaches work — most large projects use a combination.",
    example: `// Inline style as a JS object\n<div style={{ color: 'red', fontSize: 16 }}>\n  Styled text\n</div>`,
  },
  {
    term: "JavaScript",
    aliases: ["JS"],
    plainEnglish:
      "The programming language of the web. It makes web pages interactive — form validation, animations, fetching data, everything that moves or responds. Invented by Brendan Eich in 10 days in 1995 at Netscape.",
    inReact:
      "React is a JavaScript library — you write React in JavaScript. All of JavaScript is available inside your components. Knowing JavaScript fundamentals (variables, functions, arrays, objects) makes React much easier.",
    example: `// JavaScript\nconst name = "Tolu"\nconst doubled = [1,2,3].map(n => n * 2)`,
  },
  {
    term: "variable",
    aliases: ["variables"],
    plainEnglish:
      "A named container for a value. You give it a name, store something in it, and use that name to access the value later. Like a labeled box — you can store anything in it and retrieve it by the label.",
    inReact:
      "Variables in React components are re-created on every render. If you need a value to persist across renders, use state (useState) instead of a plain variable.",
    example: `const name = "Amara"    // string\nconst age = 24          // number\nconst isActive = true   // boolean`,
  },
  {
    term: "array",
    aliases: ["arrays"],
    plainEnglish:
      "An ordered list of values. Written with square brackets. Arrays can hold anything — numbers, strings, objects, even other arrays. You access items by position (starting at 0).",
    inReact:
      "Arrays appear constantly in React. You store lists of items in state as arrays. You use .map() to render a list of components from an array. You use .filter() to show only some items.",
    example: `const skills = ['React', 'TypeScript', 'CSS']\n\n// Render each one\nskills.map(skill => <li key={skill}>{skill}</li>)`,
    learnMoreLesson: 8,
  },
  {
    term: "object",
    aliases: ["objects"],
    plainEnglish:
      "A collection of named values (called key-value pairs). Written with curly braces. Like a real-world object — a person has a name, age, and email. You access values by their key name.",
    inReact:
      "Props arrive as an object. State is often stored as an object when a component has multiple related values. When updating object state, always spread the existing object first to avoid losing other fields.",
    example: `const user = { name: "Tolu", age: 24 }\n\nuser.name  // "Tolu"\nuser.age   // 24`,
  },
  {
    term: "event",
    aliases: ["events"],
    plainEnglish:
      "Something that happens in the browser — a click, a keypress, a form submission, the page loading. The browser fires an event, and you can listen for it and run code in response.",
    inReact:
      "React uses synthetic events — a wrapper around the browser's native events that works consistently across all browsers. You handle them with camelCase attributes: onClick, onChange, onSubmit.",
    example: `<button onClick={() => alert('Clicked!')}>Click</button>\n<input onChange={(e) => setValue(e.target.value)} />`,
    learnMoreLesson: 6,
  },
  {
    term: "library",
    aliases: [],
    plainEnglish:
      "A collection of pre-written code that solves specific problems. You add it to your project and use whatever parts you need. Unlike a framework, a library doesn't take control of your whole app — you're in charge.",
    inReact:
      "React is a library, not a framework. It handles one thing — building UI. You choose your own router, data fetching solution, state manager, and styling approach. This flexibility is a feature, not a bug.",
  },
  {
    term: "API",
    aliases: ["APIs"],
    plainEnglish:
      "Application Programming Interface. A way for two pieces of software to talk to each other. When your app needs data from a server — weather, user profiles, posts — it makes an API request and receives data back, usually as JSON.",
    inReact:
      "Fetching from APIs in React always lives inside useEffect, with fetch() or a library like Axios. You manage three states: loading (data is on the way), error (something went wrong), and success (data arrived).",
    example: `useEffect(() => {\n  fetch('https://api.example.com/users')\n    .then(res => res.json())\n    .then(data => setUsers(data))\n}, [])`,
    learnMoreLesson: 11,
  },
  {
    term: "import",
    aliases: ["imports"],
    plainEnglish:
      "A way to bring code from another file into the current file. The modern web splits code into many small files and uses import/export to share functionality between them.",
    inReact:
      "Every React component file starts with imports. You import React features (useState, useEffect), third-party packages, and your own components. Without the import, the code doesn't exist in that file.",
    example: `import { useState } from 'react'\nimport Button from './Button'\nimport styles from './App.css'`,
  },
  {
    term: "export",
    aliases: ["exports"],
    plainEnglish:
      "Makes something from a file available for other files to import. If import is how you receive, export is how you share. Without an export, a component stays private to its file.",
    inReact:
      "React components are usually exported as default exports. A file can have one default export and many named exports. The component name after export default is what other files import.",
    example: `// Named export\nexport function Button() { ... }\n\n// Default export\nexport default function App() { ... }`,
  },
];

export const GLOSSARY_MAP = new Map(
  GLOSSARY.flatMap((entry) =>
    [entry.term, ...entry.aliases].map((alias) => [alias.toLowerCase(), entry])
  )
);

// All terms and aliases, sorted longest-first for regex matching
const _allTerms = GLOSSARY.flatMap((e) => [e.term, ...e.aliases]);
export const GLOSSARY_TERMS_SORTED = _allTerms
  .filter((t, i) => _allTerms.indexOf(t) === i)
  .sort((a, b) => b.length - a.length);
