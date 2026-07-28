export const COURSE_VERSION = 2;

export type ModuleId = "machine" | "product" | "behavior" | "ship";
export type ExerciseType = "predict" | "trace" | "fix" | "build" | "explain";
export type WorkspaceFiles = Record<string, string>;

export interface CourseModule {
  id: ModuleId;
  order: number;
  title: string;
  promise: string;
  lessonIds: string[];
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  instruction: string;
  answerGuide?: string[];
}

export interface Lesson {
  id: string;
  order: number;
  slug: string;
  moduleId: ModuleId;
  title: string;
  outcome: string;
  productProblem: string;
  milestone: string;
  duration: string;
  xp: number;
  concept: string[];
  pseudocode: string[];
  exercises: Exercise[];
  workspace: WorkspaceFiles;
  glossaryTerms: string[];
  resources: { label: string; url: string }[];
}

const styles = `:root {
  font-family: Inter, system-ui, sans-serif;
  color: #172018;
  background: #f4f6ef;
}

* { box-sizing: border-box; }
body { margin: 0; }
button, input, select { font: inherit; }
button { cursor: pointer; }

.app {
  width: min(760px, calc(100% - 32px));
  margin: 32px auto;
}

.eyebrow {
  color: #58705e;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
}

h1 { margin: 8px 0; font-size: clamp(30px, 6vw, 48px); }
.lede { color: #59645b; max-width: 58ch; line-height: 1.6; }

.panel {
  margin-top: 24px;
  padding: 20px;
  background: white;
  border: 1px solid #dce2d8;
  border-radius: 16px;
  box-shadow: 0 16px 50px rgba(30, 45, 32, .08);
}

.row {
  display: grid;
  grid-template-columns: 1fr 140px;
  gap: 12px;
  align-items: end;
}

label { display: grid; gap: 6px; color: #39443b; font-weight: 650; }
input, select {
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid #cbd3c8;
  border-radius: 10px;
}

button {
  min-height: 44px;
  padding: 10px 14px;
  border: 0;
  border-radius: 10px;
  background: #172018;
  color: white;
  font-weight: 750;
}

button.secondary { background: #edf1e9; color: #172018; }
.expense {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 12px;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #e7ebe4;
}
.expense:last-child { border-bottom: 0; }
.amount { font-variant-numeric: tabular-nums; font-weight: 800; }
.empty { color: #69746b; padding: 20px 0; }
.error { color: #a52626; margin-top: 8px; }
.total { display: flex; justify-content: space-between; margin-top: 18px; font-size: 20px; }

@media (max-width: 560px) {
  .row { grid-template-columns: 1fr; }
  .expense { grid-template-columns: 1fr auto; }
}`;

const expenseType = `export type Category = "Food" | "Transport" | "Learning" | "Other";

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: Category;
}`;

function appFor(stage: number): string {
  if (stage <= 1) {
    return `export default function App() {
  return (
    <main className="app">
      <p className="eyebrow">My first web project</p>
      <h1>Expense Tracker</h1>
      <p className="lede">
        A useful app we will build one understandable step at a time.
      </p>
      <section className="panel">
        <p className="empty">No expenses yet.</p>
      </section>
    </main>
  );
}`;
  }

  if (stage <= 2) {
    return `import type { Expense } from "./types";

const expenses: Expense[] = [
  { id: "1", description: "Bus fare", amount: 1200, category: "Transport" },
  { id: "2", description: "React notebook", amount: 3500, category: "Learning" },
];

export default function App() {
  return (
    <main className="app">
      <p className="eyebrow">My first web project</p>
      <h1>Expense Tracker</h1>
      <p className="lede">See where your money went without guessing.</p>
      <section className="panel">
        {expenses.map((expense) => (
          <article className="expense" key={expense.id}>
            <div>
              <strong>{expense.description}</strong>
              <div>{expense.category}</div>
            </div>
            <span className="amount">₦{expense.amount.toLocaleString()}</span>
          </article>
        ))}
      </section>
    </main>
  );
}`;
  }

  if (stage <= 3) {
    return `import { FormEvent, useMemo, useState } from "react";
import type { Category, Expense } from "./types";

const starterExpenses: Expense[] = [
  { id: "1", description: "Bus fare", amount: 1200, category: "Transport" },
  { id: "2", description: "React notebook", amount: 3500, category: "Learning" },
];

export default function App() {
  const [expenses, setExpenses] = useState(starterExpenses);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food");
  const [filter, setFilter] = useState<Category | "All">("All");
  const [error, setError] = useState("");

  const visibleExpenses = useMemo(
    () => filter === "All" ? expenses : expenses.filter((item) => item.category === filter),
    [expenses, filter]
  );
  const total = visibleExpenses.reduce((sum, item) => sum + item.amount, 0);

  function addExpense(event: FormEvent) {
    event.preventDefault();
    const parsedAmount = Number(amount);
    if (!description.trim() || parsedAmount <= 0) {
      setError("Add a description and an amount greater than zero.");
      return;
    }
    setExpenses((current) => [
      ...current,
      { id: crypto.randomUUID(), description: description.trim(), amount: parsedAmount, category },
    ]);
    setDescription("");
    setAmount("");
    setError("");
  }

  function removeExpense(id: string) {
    setExpenses((current) => current.filter((item) => item.id !== id));
  }

  return (
    <main className="app">
      <p className="eyebrow">My first web project</p>
      <h1>Expense Tracker</h1>
      <p className="lede">See where your money went without guessing.</p>

      <form className="panel" onSubmit={addExpense}>
        <div className="row">
          <label>Description
            <input value={description} onChange={(event) => setDescription(event.target.value)} />
          </label>
          <label>Amount
            <input type="number" min="0" value={amount} onChange={(event) => setAmount(event.target.value)} />
          </label>
        </div>
        <div className="row" style={{ marginTop: 12 }}>
          <label>Category
            <select value={category} onChange={(event) => setCategory(event.target.value as Category)}>
              <option>Food</option><option>Transport</option><option>Learning</option><option>Other</option>
            </select>
          </label>
          <button type="submit">Add expense</button>
        </div>
        {error && <p className="error" role="alert">{error}</p>}
      </form>

      <section className="panel">
        <label>Show category
          <select value={filter} onChange={(event) => setFilter(event.target.value as Category | "All")}>
            <option>All</option><option>Food</option><option>Transport</option><option>Learning</option><option>Other</option>
          </select>
        </label>
        {visibleExpenses.length === 0 ? <p className="empty">No matching expenses.</p> :
          visibleExpenses.map((expense) => (
            <article className="expense" key={expense.id}>
              <div><strong>{expense.description}</strong><div>{expense.category}</div></div>
              <span className="amount">₦{expense.amount.toLocaleString()}</span>
              <button className="secondary" onClick={() => removeExpense(expense.id)}>Delete</button>
            </article>
          ))
        }
        <div className="total"><span>Total</span><strong>₦{total.toLocaleString()}</strong></div>
      </section>
    </main>
  );
}`;
  }

  return `import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Category, Expense } from "./types";

const STORAGE_KEY = "expense-tracker-v1";

function loadExpenses(): Expense[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>(loadExpenses);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food");
  const [filter, setFilter] = useState<Category | "All">("All");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const visibleExpenses = useMemo(
    () => filter === "All" ? expenses : expenses.filter((item) => item.category === filter),
    [expenses, filter]
  );
  const total = visibleExpenses.reduce((sum, item) => sum + item.amount, 0);

  function addExpense(event: FormEvent) {
    event.preventDefault();
    const parsedAmount = Number(amount);
    if (!description.trim() || parsedAmount <= 0) {
      setError("Add a description and an amount greater than zero.");
      return;
    }
    setExpenses((current) => [...current, {
      id: crypto.randomUUID(), description: description.trim(), amount: parsedAmount, category,
    }]);
    setDescription("");
    setAmount("");
    setError("");
  }

  return (
    <main className="app">
      <p className="eyebrow">Built from first principles</p>
      <h1>Expense Tracker</h1>
      <p className="lede">Add, filter, total, and remember everyday expenses.</p>
      <form className="panel" onSubmit={addExpense}>
        <div className="row">
          <label>Description<input value={description} onChange={(e) => setDescription(e.target.value)} /></label>
          <label>Amount<input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
        </div>
        <div className="row" style={{ marginTop: 12 }}>
          <label>Category
            <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
              <option>Food</option><option>Transport</option><option>Learning</option><option>Other</option>
            </select>
          </label>
          <button type="submit">Add expense</button>
        </div>
        {error && <p className="error" role="alert">{error}</p>}
      </form>
      <section className="panel">
        <label>Show category
          <select value={filter} onChange={(e) => setFilter(e.target.value as Category | "All")}>
            <option>All</option><option>Food</option><option>Transport</option><option>Learning</option><option>Other</option>
          </select>
        </label>
        {visibleExpenses.length === 0 ? <p className="empty">No matching expenses.</p> :
          visibleExpenses.map((expense) => (
            <article className="expense" key={expense.id}>
              <div><strong>{expense.description}</strong><div>{expense.category}</div></div>
              <span className="amount">₦{expense.amount.toLocaleString()}</span>
              <button className="secondary" onClick={() =>
                setExpenses((current) => current.filter((item) => item.id !== expense.id))
              }>Delete</button>
            </article>
          ))
        }
        <div className="total"><span>Total</span><strong>₦{total.toLocaleString()}</strong></div>
      </section>
    </main>
  );
}`;
}

function workspace(stage: number): WorkspaceFiles {
  return {
    "/App.tsx": appFor(stage),
    "/types.ts": expenseType,
    "/styles.css": styles,
    "/index.tsx": `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode><App /></StrictMode>
);`,
  };
}

const reactDocs = { label: "React Learn", url: "https://react.dev/learn" };
const tsDocs = { label: "TypeScript for JavaScript Programmers", url: "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html" };
const mdn = { label: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development" };

function lesson(
  value: Omit<Lesson, "workspace" | "resources"> & {
    stage: number;
    resources?: Lesson["resources"];
  },
): Lesson {
  const { stage, resources = [reactDocs, mdn], ...rest } = value;
  return { ...rest, workspace: workspace(stage), resources };
}

export const COURSE_MODULES: CourseModule[] = [
  { id: "machine", order: 1, title: "Understand the Machine", promise: "See how the web and programs actually work.", lessonIds: ["web-conversation", "problem-into-steps", "typescript-data", "first-react-screen"] },
  { id: "product", order: 2, title: "Turn the Screen into a Product", promise: "Build the first genuinely useful version.", lessonIds: ["model-expense", "render-expenses", "change-the-screen", "capture-expense"] },
  { id: "behavior", order: 3, title: "Make the App Behave Correctly", promise: "Handle real data and real user mistakes.", lessonIds: ["edit-remove", "transactions-into-answers", "every-screen", "organize-app"] },
  { id: "ship", order: 4, title: "Make It Durable and Ship It", promise: "Save, debug, move, and deploy the app.", lessonIds: ["remember-visits", "debug-prove", "leave-playground", "ship-explain"] },
];

export const CURRICULUM: Lesson[] = [
  lesson({
    id: "web-conversation", order: 1, slug: "a-webpage-is-a-conversation", moduleId: "machine",
    title: "A Webpage Is a Conversation", duration: "25 min", xp: 60, stage: 1,
    outcome: "Explain how a URL becomes a visible webpage and identify what HTML, CSS, and JavaScript contribute.",
    productProblem: "Before changing an interface, we need to know which machine receives our code and what each web language controls.",
    milestone: "You can inspect the static expense-tracker screen and name every layer responsible for it.",
    concept: [
      "A browser is a program that requests files, reads them, and turns them into a visible, interactive page. A server is another computer program that responds to those requests.",
      "HTML gives a page structure, CSS controls presentation, and JavaScript provides behavior. React does not replace these foundations; it helps us coordinate them as interfaces become more complex.",
    ],
    pseudocode: ["ASK a server for the page", "RECEIVE HTML, CSS, and JavaScript", "BUILD the document", "PAINT the interface", "RESPOND to the learner"],
    exercises: [
      { id: "web-predict", type: "predict", instruction: "If CSS fails to load, what still exists and what changes?", answerGuide: ["HTML structure remains", "Presentation and layout change"] },
      { id: "web-explain", type: "explain", instruction: "Describe the browser and server as two people having a short conversation.", answerGuide: ["request", "response", "browser renders"] },
    ],
    glossaryTerms: ["browser", "server", "HTML", "CSS", "JavaScript"],
  }),
  lesson({
    id: "problem-into-steps", order: 2, slug: "turn-a-problem-into-steps", moduleId: "machine",
    title: "Turn a Problem into Steps", duration: "30 min", xp: 70, stage: 1,
    outcome: "Translate a human goal into inputs, processing rules, outputs, and pseudocode.",
    productProblem: "“Track my expenses” is too vague for a computer. A program needs precise steps and decisions.",
    milestone: "You have an algorithm for accepting an expense and recalculating a total.",
    concept: [
      "Programming begins before syntax. We decide what information enters the program, what rules transform it, and what result should appear.",
      "Pseudocode lets us test our thinking in ordinary language. If the steps are unclear in English, JavaScript will not rescue them.",
    ],
    pseudocode: ["READ description and amount", "IF either value is invalid, SHOW an error", "OTHERWISE add the expense", "ADD all amounts", "SHOW the new total"],
    exercises: [
      { id: "steps-trace", type: "trace", instruction: "Trace the algorithm for an expense named Bus fare with an amount of 1200.", answerGuide: ["validate", "add", "total"] },
      { id: "steps-build", type: "build", instruction: "Write pseudocode for deleting one expense without deleting the others.", answerGuide: ["identify by id", "keep all other expenses"] },
    ],
    glossaryTerms: ["program", "input", "process", "output", "algorithm"],
  }),
  lesson({
    id: "typescript-data", order: 3, slug: "make-data-explicit-with-typescript", moduleId: "machine",
    title: "Make Data Explicit with TypeScript", duration: "40 min", xp: 90, stage: 1,
    outcome: "Use variables, primitive values, functions, parameters, return values, and helpful type labels.",
    productProblem: "The computer must distinguish a description from an amount and reject operations that make no sense.",
    milestone: "Your project has named, typed values for the information an expense needs.",
    concept: [
      "JavaScript stores values and runs instructions. TypeScript adds labels that help us catch mismatched values before the program reaches a learner.",
      "A function groups a repeatable operation. Parameters are its inputs; the returned value is its output.",
    ],
    pseudocode: ["DEFINE amount as a number", "DEFINE description as text", "GIVE calculateTotal a list of amounts", "RETURN their sum"],
    exercises: [
      { id: "types-predict", type: "predict", instruction: "Why should amount be a number instead of the text \"1200\"?", answerGuide: ["arithmetic", "prevents accidental text joining"] },
      { id: "types-explain", type: "explain", instruction: "Explain a function using a familiar machine or service.", answerGuide: ["input", "process", "output"] },
    ],
    glossaryTerms: ["variable", "function", "type", "parameter", "return value"],
    resources: [tsDocs, mdn],
  }),
  lesson({
    id: "first-react-screen", order: 4, slug: "build-the-first-screen-with-react", moduleId: "machine",
    title: "Build the First Screen with React", duration: "45 min", xp: 110, stage: 1,
    outcome: "Describe a static interface with a component and JSX.",
    productProblem: "Manual DOM instructions become difficult to coordinate as the screen changes. We need a predictable description of the UI.",
    milestone: "Your expense tracker has a clear, responsive React shell running entirely in the browser.",
    concept: [
      "A React component is a JavaScript function that describes part of an interface. JSX is the readable notation we use for that description.",
      "React compares descriptions across renders and updates the browser DOM. We focus on what the screen should show for the current data.",
    ],
    pseudocode: ["CREATE an App component", "RETURN the page heading and empty panel", "RENDER App into the browser document"],
    exercises: [
      { id: "react-trace", type: "trace", instruction: "Trace App.tsx from the function call to the visible heading.", answerGuide: ["component runs", "returns JSX", "React updates DOM"] },
      { id: "react-build", type: "build", instruction: "Change the description and add a short sentence explaining who the tracker helps.", answerGuide: ["valid JSX", "meaningful copy"] },
    ],
    glossaryTerms: ["DOM", "React", "component", "JSX", "render"],
  }),
  lesson({
    id: "model-expense", order: 5, slug: "model-a-real-expense", moduleId: "product",
    title: "Model a Real Expense", duration: "40 min", xp: 100, stage: 2,
    outcome: "Represent a real expense with an object, interface, category, and stable ID.",
    productProblem: "A screen cannot render useful transactions until the program agrees on the shape of one expense.",
    milestone: "The app has one consistent Expense model used by every future feature.",
    concept: [
      "Objects group related values. An interface documents the required shape so description, amount, category, and ID remain consistent.",
      "Arrays hold many expenses. A stable ID lets us change one item without confusing it with another.",
    ],
    pseudocode: ["DEFINE the Expense shape", "CREATE two expense objects", "PUT them in an Expense array"],
    exercises: [
      { id: "model-fix", type: "fix", instruction: "Add a third expense that satisfies the Expense interface.", answerGuide: ["unique id", "number amount", "valid category"] },
      { id: "model-explain", type: "explain", instruction: "Why is description not enough to identify an expense?", answerGuide: ["duplicates", "stable identity"] },
    ],
    glossaryTerms: ["object", "array", "interface", "ID"],
    resources: [tsDocs, reactDocs],
  }),
  lesson({
    id: "render-expenses", order: 6, slug: "render-any-number-of-expenses", moduleId: "product",
    title: "Render Any Number of Expenses", duration: "45 min", xp: 110, stage: 2,
    outcome: "Transform an array into reusable expense rows with props and stable keys.",
    productProblem: "Writing a separate block of JSX for every transaction will immediately become repetitive and fragile.",
    milestone: "Any number of typed expenses can appear as a consistent list.",
    concept: [
      "The array map method transforms each data item into an interface element. A reusable row component receives its changing values through props.",
      "Keys tell React which item is which across updates. A database-style ID is safer than an array position.",
    ],
    pseudocode: ["FOR EACH expense", "PASS the expense into a row", "SHOW description, category, and formatted amount"],
    exercises: [
      { id: "render-predict", type: "predict", instruction: "What happens when a third expense is added to the array?", answerGuide: ["map creates another row"] },
      { id: "render-fix", type: "fix", instruction: "Extract the repeated article into an ExpenseRow component.", answerGuide: ["props", "component reuse", "key stays on mapped component"] },
    ],
    glossaryTerms: ["props", "map", "key", "reuse"],
  }),
  lesson({
    id: "change-the-screen", order: 7, slug: "let-the-user-change-the-screen", moduleId: "product",
    title: "Let the User Change the Screen", duration: "45 min", xp: 110, stage: 3,
    outcome: "Connect a user event to state and explain why React renders again.",
    productProblem: "The list is visible but frozen. A real product must respond when a person acts.",
    milestone: "The screen can hold changing data and react to a learner’s actions.",
    concept: [
      "State is data React remembers between renders. An event handler translates a user action into a state update.",
      "Calling a setter requests another render. React runs the component with the new state and updates only the necessary DOM.",
    ],
    pseudocode: ["WAIT for a click", "UPDATE the relevant state", "RUN the component again", "SHOW the new screen"],
    exercises: [
      { id: "state-trace", type: "trace", instruction: "Trace a button click from the browser event to the updated screen.", answerGuide: ["event handler", "setter", "render", "DOM"] },
      { id: "state-explain", type: "explain", instruction: "Why does changing a normal variable not reliably update the React screen?", answerGuide: ["React does not track it", "state triggers render"] },
    ],
    glossaryTerms: ["state", "event", "setter", "re-render"],
  }),
  lesson({
    id: "capture-expense", order: 8, slug: "capture-a-new-expense", moduleId: "product",
    title: "Capture a New Expense", duration: "60 min", xp: 140, stage: 3,
    outcome: "Build a controlled, validated TypeScript form that adds a real expense.",
    productProblem: "The learner needs a safe way to turn typed input into trustworthy application data.",
    milestone: "You can add a valid expense and immediately see it in the list and total.",
    concept: [
      "A controlled input displays a state value and updates that state on every change. The program and the visible field stay synchronized.",
      "Browser input arrives as text. Validation and number parsing must happen before the values become an Expense.",
    ],
    pseudocode: ["READ all fields", "STOP default form navigation", "VALIDATE description and amount", "CREATE an Expense", "APPEND it without mutating the old array", "CLEAR the form"],
    exercises: [
      { id: "form-fix", type: "fix", instruction: "Try invalid values, then improve the error so it tells the learner exactly what to fix.", answerGuide: ["specific message", "role alert"] },
      { id: "form-build", type: "build", instruction: "Add a useful placeholder and prevent a negative amount at the input level.", answerGuide: ["placeholder", "min attribute"] },
    ],
    glossaryTerms: ["form", "controlled input", "validation", "immutable"],
  }),
  lesson({
    id: "edit-remove", order: 9, slug: "edit-and-remove-without-breaking-data", moduleId: "behavior",
    title: "Edit and Remove Without Breaking Data", duration: "50 min", xp: 120, stage: 3,
    outcome: "Update one array item by identity and remove another without mutating state.",
    productProblem: "People make mistakes. The app needs safe, predictable ways to correct or remove one transaction.",
    milestone: "Transactions can be removed, and you understand the same identity pattern needed for editing.",
    concept: [
      "Filter produces a new array without the selected ID. Map can produce a new array with one selected object replaced.",
      "Immutable updates give React a reliable new value to compare and keep previous state from changing behind our backs.",
    ],
    pseudocode: ["RECEIVE the selected ID", "KEEP every expense whose ID is different", "SET the resulting array"],
    exercises: [
      { id: "remove-trace", type: "trace", instruction: "Trace deleting the first expense while the second remains.", answerGuide: ["compare ids", "filter", "new array"] },
      { id: "edit-build", type: "build", instruction: "Write pseudocode for replacing only the amount of one matching expense.", answerGuide: ["map", "matching id", "copy other fields"] },
    ],
    glossaryTerms: ["filter", "callback", "identity", "immutability"],
  }),
  lesson({
    id: "transactions-into-answers", order: 10, slug: "turn-transactions-into-answers", moduleId: "behavior",
    title: "Turn Transactions into Answers", duration: "55 min", xp: 130, stage: 3,
    outcome: "Derive filtered lists and totals from source data without duplicating state.",
    productProblem: "Raw transactions become useful only when the app can answer questions about them.",
    milestone: "The app filters by category and recalculates the visible total automatically.",
    concept: [
      "Derived values are calculated from existing state during rendering. Storing a second total would create two sources of truth that can disagree.",
      "Filter selects matching items. Reduce combines many amounts into one total.",
    ],
    pseudocode: ["SELECT expenses matching the active category", "START total at zero", "ADD each visible amount", "SHOW the answer"],
    exercises: [
      { id: "total-trace", type: "trace", instruction: "Calculate the visible total after choosing Transport.", answerGuide: ["filter first", "reduce matching amounts"] },
      { id: "total-explain", type: "explain", instruction: "Why should total not have its own setter?", answerGuide: ["derived", "single source of truth", "cannot become stale"] },
    ],
    glossaryTerms: ["reduce", "derived value", "source of truth", "filter"],
  }),
  lesson({
    id: "every-screen", order: 11, slug: "design-every-possible-screen", moduleId: "behavior",
    title: "Design Every Possible Screen", duration: "50 min", xp: 120, stage: 3,
    outcome: "Handle empty, invalid, filtered, keyboard, and small-screen states accessibly.",
    productProblem: "A product is not only its happy path. Empty data, mistakes, and different devices are normal states.",
    milestone: "Every expected screen communicates clearly without relying on colour alone.",
    concept: [
      "Conditional rendering chooses the correct interface for the current state. An empty list needs guidance, while invalid input needs a nearby, specific error.",
      "Semantic labels, keyboard operation, visible focus, sufficient contrast, and responsive layouts are product requirements—not decorative polish.",
    ],
    pseudocode: ["IF input is invalid, SHOW a useful error", "IF no result matches, SHOW an empty state", "OTHERWISE SHOW the list"],
    exercises: [
      { id: "states-predict", type: "predict", instruction: "List four screens the app can show without changing routes.", answerGuide: ["empty", "list", "filtered empty", "error"] },
      { id: "states-build", type: "build", instruction: "Make the empty-state message suggest a useful next action.", answerGuide: ["clear action", "plain language"] },
    ],
    glossaryTerms: ["conditional rendering", "semantic HTML", "accessibility", "responsive"],
  }),
  lesson({
    id: "organize-app", order: 12, slug: "organize-a-growing-application", moduleId: "behavior",
    title: "Organize a Growing Application", duration: "60 min", xp: 140, stage: 3,
    outcome: "Choose component boundaries and state ownership from the application’s data flow.",
    productProblem: "The working App component is becoming difficult to scan, explain, and change safely.",
    milestone: "You have a component plan for separating the form, list, row, filters, and summary.",
    concept: [
      "A component boundary should make a responsibility easier to understand or reuse. Splitting every line into a component only creates noise.",
      "State belongs in the nearest common owner of every component that reads or changes it. Data flows down; requested changes flow up through callbacks.",
    ],
    pseudocode: ["DRAW the component tree", "MARK where each value is used", "PLACE state in the nearest shared owner", "PASS data down", "PASS event callbacks down"],
    exercises: [
      { id: "organize-trace", type: "trace", instruction: "Trace an add-expense request from ExpenseForm to the list.", answerGuide: ["callback", "App state", "props", "render"] },
      { id: "organize-build", type: "build", instruction: "Sketch the component tree and justify one boundary you would create.", answerGuide: ["responsibility", "state owner"] },
    ],
    glossaryTerms: ["composition", "state ownership", "callback", "data flow"],
  }),
  lesson({
    id: "remember-visits", order: 13, slug: "remember-between-visits", moduleId: "ship",
    title: "Remember Between Visits", duration: "55 min", xp: 140, stage: 4,
    outcome: "Synchronize expenses with localStorage and recover safely from malformed saved data.",
    productProblem: "A useful tracker cannot forget everything when the browser tab closes.",
    milestone: "Expenses survive a refresh, and broken stored data cannot crash the application.",
    concept: [
      "localStorage is an external browser system that stores text. JSON converts our array into text and reconstructs it later.",
      "An Effect synchronizes React state with that external system. Guarded parsing gives the app a safe fallback when saved data is missing or malformed.",
    ],
    pseudocode: ["ON startup, TRY to read and parse saved expenses", "IF parsing fails, USE an empty array", "WHEN expenses change, SAVE their JSON"],
    exercises: [
      { id: "storage-trace", type: "trace", instruction: "Trace an expense from form submission to storage and back after refresh.", answerGuide: ["state", "effect", "JSON", "initializer"] },
      { id: "storage-explain", type: "explain", instruction: "Why is an Effect appropriate for storage but unnecessary for calculating the total?", answerGuide: ["external synchronization", "derived during render"] },
    ],
    glossaryTerms: ["localStorage", "JSON", "Effect", "synchronization"],
  }),
  lesson({
    id: "debug-prove", order: 14, slug: "debug-and-prove-the-app-works", moduleId: "ship",
    title: "Debug and Prove the App Works", duration: "60 min", xp: 150, stage: 4,
    outcome: "Reproduce, classify, investigate, and verify application failures.",
    productProblem: "Code that appears to work once is not yet trustworthy.",
    milestone: "The expense tracker passes a written behavior, accessibility, and edge-case checklist.",
    concept: [
      "Debugging begins by reproducing a specific failure. Read the complete error, identify whether it is a type, syntax, runtime, or behavior problem, and change one assumption at a time.",
      "Testing means proving important behavior under normal and difficult inputs. It is evidence, not confidence.",
    ],
    pseudocode: ["REPRODUCE the failure", "READ the first useful error", "FORM one hypothesis", "CHANGE one thing", "VERIFY the original behavior and nearby behaviors"],
    exercises: [
      { id: "debug-fix", type: "fix", instruction: "Create one harmless bug, record its symptom, then restore the working checkpoint.", answerGuide: ["reproducible symptom", "cause", "verification"] },
      { id: "debug-build", type: "build", instruction: "Write five behavior checks covering add, invalid input, filter, delete, and refresh.", answerGuide: ["action", "expected visible result"] },
    ],
    glossaryTerms: ["syntax error", "type error", "runtime error", "test"],
  }),
  lesson({
    id: "leave-playground", order: 15, slug: "leave-the-playground", moduleId: "ship",
    title: "Leave the Playground", duration: "75 min", xp: 170, stage: 4,
    outcome: "Explain and perform the move from the browser workspace to a local Vite project.",
    productProblem: "The browser workspace removed setup friction; now the learner needs ownership of the files and professional tools.",
    milestone: "The same expense tracker runs locally with Vite, React, and TypeScript.",
    concept: [
      "Node runs development tools outside the browser. npm installs packages and records them in package.json. Vite starts a development server and creates a production build.",
      "Git records meaningful versions of the project; GitHub stores and shares the repository. These tools support the code—they are not the code itself.",
    ],
    pseudocode: ["CREATE a Vite React TypeScript project", "COPY the checkpoint files", "INSTALL packages", "RUN the development server", "COMMIT the working result"],
    exercises: [
      { id: "tooling-trace", type: "trace", instruction: "Explain what npm run dev does from terminal command to browser page.", answerGuide: ["package script", "Vite server", "browser request"] },
      { id: "tooling-explain", type: "explain", instruction: "Explain the difference between React, Vite, npm, Git, and GitHub.", answerGuide: ["library", "build tool", "package manager", "version control", "host"] },
    ],
    glossaryTerms: ["Node", "npm", "package", "Vite", "Git", "GitHub", "build"],
    resources: [
      { label: "Vite: Getting Started", url: "https://vite.dev/guide/" },
      { label: "GitHub: Hello World", url: "https://docs.github.com/en/get-started/start-your-journey/hello-world" },
    ],
  }),
  lesson({
    id: "ship-explain", order: 16, slug: "ship-and-explain-your-work", moduleId: "ship",
    title: "Ship and Explain Your Work", duration: "75 min", xp: 200, stage: 4,
    outcome: "Deploy the finished product and explain its architecture without hiding behind framework vocabulary.",
    productProblem: "A project creates opportunity only when other people can use it and understand the decisions behind it.",
    milestone: "Your accessible expense tracker has a public URL, README, and a clear story you can tell.",
    concept: [
      "A production build transforms source files into assets suitable for delivery. A deployment platform builds those files and serves them from a public URL.",
      "A strong project explanation starts with the human problem, follows the data through the system, names tradeoffs honestly, and demonstrates the result.",
    ],
    pseudocode: ["RUN the final checklist", "WRITE the README", "PUSH to GitHub", "IMPORT into Vercel", "VERIFY desktop and mobile", "EXPLAIN input → state → render → storage"],
    exercises: [
      { id: "ship-build", type: "build", instruction: "Draft a README with problem, features, learning, setup, and live-link sections.", answerGuide: ["problem", "features", "setup", "link"] },
      { id: "ship-explain", type: "explain", instruction: "Explain how one expense travels through your finished application.", answerGuide: ["form", "event", "validation", "state", "render", "storage"] },
    ],
    glossaryTerms: ["production build", "deploy", "README", "architecture"],
    resources: [
      { label: "Vercel: Deploying a Vite Project", url: "https://vercel.com/docs/frameworks/frontend/vite" },
      { label: "GitHub: About READMEs", url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes" },
    ],
  }),
];

export const TOTAL_LESSONS = CURRICULUM.length;
export const TOTAL_XP = CURRICULUM.reduce((sum, item) => sum + item.xp, 0);

export function getLessonBySlug(slug: string): Lesson | undefined {
  return CURRICULUM.find((item) => item.slug === slug);
}

export function getLessonById(id: string): Lesson | undefined {
  return CURRICULUM.find((item) => item.id === id);
}

export function getModuleById(id: ModuleId): CourseModule {
  return COURSE_MODULES.find((item) => item.id === id)!;
}

export function getAdjacentLessons(slug: string): { prev: Lesson | null; next: Lesson | null } {
  const index = CURRICULUM.findIndex((item) => item.slug === slug);
  return {
    prev: index > 0 ? CURRICULUM[index - 1] : null,
    next: index >= 0 && index < CURRICULUM.length - 1 ? CURRICULUM[index + 1] : null,
  };
}
