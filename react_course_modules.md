# React Hub — Beginner-First Module Map

## Course promise

This course assumes the learner has never written HTML, CSS, or JavaScript.

The learner will not be rushed into React. They will first understand the browser, build the project as a real webpage, style it, program its behavior with JavaScript, and manipulate the DOM themselves. React is introduced only after the learner has experienced the coordination problem React solves.

The same expense-tracker project grows throughout the course:

1. A paper sketch and browser mental model.
2. A semantic HTML expense page.
3. A responsive CSS interface.
4. JavaScript calculations and data.
5. A working vanilla-JavaScript expense tracker.
6. A typed TypeScript data model.
7. A React version built with understanding.
8. A tested, accessible, persistent, deployed product.

AI assistance is optional. The course, editor, explanations, exercises, and checks must remain useful when Groq or any future AI provider is unavailable.

---

## Start Here — What You Are About to Learn

This is an orientation, not a numbered module.

- What the learner will build and why it is useful.
- How the project will grow after every module.
- What a program is: input → process → output.
- The difference between learning syntax and learning how to think.
- How to use the browser workspace.
- How checkpoints, saved progress, hints, and assessments work.
- Why fundamentals still matter when AI can generate code.
- The promise that no installation or previous programming knowledge is required.

**Visible outcome:** The learner can describe the final product, the learning path, and how their work will be saved.

---

## Module 1 — Meet the Computer and the Web

### Purpose

Give the learner a concrete mental model of the machines and files involved before showing code.

### Lessons

1. **What Is a Computer Program?**
   - Instructions, data, memory, input, processing, and output.
   - Programs as precise descriptions rather than magic.
   - Trace entering an expense and receiving a total.

2. **What Happens When You Open a Website?**
   - URLs, browsers, servers, requests, responses, and files.
   - Local files versus files requested across the internet.
   - A simple request → response diagram.

3. **How the Browser Builds a Page**
   - HTML becomes the document tree.
   - CSS changes presentation.
   - JavaScript adds behavior.
   - The browser renders pixels and responds to input.

4. **Meet the Browser Developer Tools**
   - Elements, Styles, Console, and Network panels.
   - Inspecting without being afraid of breaking anything.
   - Errors as information.

### Project milestone

Inspect a finished expense-tracker preview and identify which parts come from structure, presentation, data, and behavior.

### Learner must be able to explain

- The difference between a browser and a server.
- The difference between code, data, and the visible interface.
- Why HTML, CSS, and JavaScript have separate responsibilities.

---

## Module 2 — Build Meaningful Structure with HTML

### Purpose

Teach HTML as the semantic structure of a document—not as tags to memorize.

### Lessons

1. **Your First HTML Document**
   - `doctype`, `html`, `head`, `body`, metadata, and page title.
   - Opening tags, closing tags, nesting, and indentation.
   - How the browser turns markup into a document tree.

2. **Text Has Meaning**
   - Headings, paragraphs, emphasis, strong importance, and lists.
   - Heading hierarchy rather than choosing headings by size.
   - Writing content before styling it.

3. **Links, Images, and Paths**
   - Attributes and values.
   - Relative and absolute paths.
   - Alternative text and when an image is decorative.

4. **Divide a Page by Responsibility**
   - `header`, `nav`, `main`, `section`, `article`, `aside`, and `footer`.
   - Semantic elements versus generic `div` and `span`.
   - Why semantics help people, browsers, and assistive technology.

5. **Collect Information with Forms**
   - `form`, `label`, `input`, `select`, `option`, and `button`.
   - Input names, values, types, placeholders, and required fields.
   - Labels and keyboard accessibility.

6. **Build the Static Expense Page**
   - Page header and introductory copy.
   - Add-expense form.
   - Expense list with realistic sample data.
   - Summary and total section.
   - Empty-state message.

### Project milestone

A complete, semantic expense-tracker page that works as a readable document without CSS or JavaScript.

### Learner must be able to explain

- Why HTML is structure and meaning rather than visual design.
- Why a label matters even when a placeholder exists.
- Why semantic elements are preferable to using `div` for everything.

---

## Module 3 — Make the Interface Clear with CSS

### Purpose

Teach CSS slowly enough that layout and the cascade are understandable, not copied incantations.

### Lessons

1. **How CSS Finds HTML**
   - Rules, selectors, declarations, properties, and values.
   - Element, class, and simple descendant selectors.
   - Connecting a stylesheet to an HTML document.

2. **The Cascade and Inheritance**
   - Source order, specificity, and inheritance.
   - Why a style “does not work.”
   - Using developer tools to see which rule won.

3. **The Box Model**
   - Content, padding, border, and margin.
   - Width, height, `box-sizing`, and overflow.
   - Measuring the expense cards in developer tools.

4. **Colour, Type, and Readability**
   - Colour formats, contrast, and design tokens.
   - Font families, size, weight, line height, and line length.
   - Visual hierarchy without sacrificing accessibility.

5. **Normal Flow and Display**
   - Block, inline, and inline-block behavior.
   - Why elements naturally appear where they do.
   - Hiding content responsibly.

6. **One-Dimensional Layout with Flexbox**
   - Main axis, cross axis, alignment, distribution, gap, and wrapping.
   - Building the expense-row and action layouts.

7. **Two-Dimensional Layout with Grid**
   - Rows, columns, tracks, gaps, and fractional units.
   - Building the form and dashboard layout.
   - Choosing Grid versus Flexbox.

8. **Responsive Design**
   - Fluid widths, `min`, `max`, `clamp`, and media queries.
   - Mobile-first thinking.
   - Preventing horizontal overflow.

9. **Interaction States**
   - Hover, focus, focus-visible, disabled, and error states.
   - Transitions and reduced motion.
   - Making controls visibly interactive.

10. **Style the Expense Tracker**
    - Establish a small design system.
    - Style the form, list, summary, errors, and empty state.
    - Verify the interface at mobile, tablet, and desktop sizes.

### Project milestone

A responsive, accessible expense-tracker interface with a consistent visual system.

### Learner must be able to explain

- How the cascade decides which style wins.
- How the box model affects an element’s final size.
- When to choose Flexbox or Grid.
- Why responsive design is about constraints rather than specific devices.

---

## Module 4 — Learn to Think Like a Programmer

### Purpose

Teach programming principles separately from the browser and React so learners can reason about code.

### Lessons

1. **Turn Problems into Steps**
   - Inputs, outputs, constraints, algorithms, and pseudocode.
   - Breaking “track expenses” into smaller operations.

2. **Values and Types**
   - Strings, numbers, booleans, `null`, and `undefined`.
   - Literal values and how operations depend on type.
   - Why `"1200" + 300` is different from `1200 + 300`.

3. **Variables and Expressions**
   - `const` and `let`.
   - Naming, assignment, expressions, and evaluation.
   - Reading code from right to left during assignment.

4. **Operators and Calculations**
   - Arithmetic, comparison, equality, and logical operators.
   - Precedence and parentheses.
   - Calculating totals and validating amounts.

5. **Decisions with Conditionals**
   - `if`, `else if`, `else`, truthiness, and boolean conditions.
   - Guard clauses.
   - Valid and invalid expense decisions.

6. **Repeat Work with Loops**
   - Why repetition needs control.
   - `for`, `for...of`, counters, and stopping conditions.
   - Summing a list of amounts manually.

7. **Functions Give Operations Names**
   - Declarations, calls, parameters, arguments, and return values.
   - Pure functions and predictable behavior.
   - `calculateTotal`, `isValidExpense`, and `formatCurrency`.

8. **Scope and the Lifetime of Values**
   - Global, function, and block scope.
   - Why a variable can be unavailable.
   - Keeping temporary values contained.

9. **Read and Debug Small Programs**
   - Syntax, runtime, and logic errors.
   - Reading error locations.
   - Predict → run → compare → explain.

### Project milestone

A set of plain JavaScript functions that validate expenses, calculate totals, and format output without touching the webpage.

### Learner must be able to explain

- How a value moves through a function.
- Why an algorithm should be clear before syntax is written.
- The difference between a syntax error, runtime error, and incorrect result.

---

## Module 5 — Model and Transform Data with JavaScript

### Purpose

Teach the data structures and transformations required by the project before introducing UI state.

### Lessons

1. **Objects Group Related Information**
   - Properties, values, dot notation, bracket notation, and object literals.
   - Model one expense as an object.

2. **Arrays Hold Collections**
   - Indexes, length, reading values, adding values, and removing values.
   - Model many expenses as an array.

3. **Objects Inside Arrays**
   - Reading nested data.
   - Stable IDs and identity.
   - Why descriptions and array positions are weak identifiers.

4. **Transform Arrays with `map`**
   - Callback functions.
   - Producing a new array.
   - Updating one expense without changing the others.

5. **Select Values with `filter` and `find`**
   - Boolean callback decisions.
   - Filtering by category.
   - Finding one item by ID.

6. **Combine Values with `reduce`**
   - Accumulators and current values.
   - Deriving totals from source data.
   - When a loop may be clearer for a beginner.

7. **Mutation versus New Values**
   - References and shared objects.
   - Why unexpected mutation creates difficult bugs.
   - Spread syntax for arrays and objects.

8. **Organize Code with Modules**
   - Exporting and importing functions and data.
   - Separating responsibilities without creating unnecessary files.

### Project milestone

A JavaScript expense engine that can add, locate, update, delete, filter, and total expense objects.

### Learner must be able to explain

- The difference between one expense object and an array of expenses.
- How `map`, `filter`, `find`, and `reduce` answer different questions.
- Why stable identity matters when data changes.

---

## Module 6 — Make the HTML Interactive with Browser JavaScript

### Purpose

Let learners experience manual DOM coordination so React solves a problem they genuinely understand.

### Lessons

1. **Meet the DOM**
   - The DOM as the browser’s object representation of HTML.
   - Elements, attributes, text, parent/child relationships.
   - Inspecting the tree.

2. **Find and Change Elements**
   - `querySelector` and `querySelectorAll`.
   - Reading and changing text, attributes, and classes.
   - Why direct updates must remain coordinated.

3. **Respond to Events**
   - Click, input, change, and submit events.
   - Event listeners, event objects, targets, and default behavior.

4. **Read a Form**
   - Input values are strings.
   - Parsing numbers.
   - Validation, error messages, and focus management.

5. **Render an Expense List**
   - Turning expense data into DOM elements.
   - `createElement`, text content, attributes, and appending nodes.
   - Avoiding unsafe HTML injection.

6. **Update and Delete by ID**
   - Event delegation or explicit listeners.
   - Synchronizing the data array, list, and total.
   - Re-rendering after a change.

7. **Filter and Derive a Total**
   - Separating source data from derived visible data.
   - Updating multiple regions of the interface consistently.

8. **Remember Data with `localStorage`**
   - String-only storage, JSON serialization, guarded parsing, and fallbacks.
   - Saving after changes and loading on startup.

9. **Recognize the Coordination Problem**
   - The number of manual update points in the application.
   - Bugs caused when one update is forgotten.
   - Imperative instructions versus declarative descriptions.

### Project milestone

A complete working expense tracker built with semantic HTML, CSS, and vanilla JavaScript.

### Learner must be able to explain

- How a form event becomes data and then visible DOM.
- Why changing the array does not automatically change the screen.
- What makes a growing manually coordinated interface difficult to maintain.

---

## Module 7 — Add Safety with TypeScript

### Purpose

Introduce only the TypeScript features needed to make the existing product easier to understand and safer to change.

### Lessons

1. **Why Add Types to Working JavaScript?**
   - Static checking versus runtime behavior.
   - Helpful editor feedback.
   - Types disappear before the browser runs the program.

2. **Annotate Values and Functions**
   - Primitive annotations, inferred types, parameters, and return types.
   - Avoiding unnecessary annotations.

3. **Describe an Expense with an Interface**
   - Required and optional properties.
   - Reading a type as a promise about data.

4. **Model Categories with Union Types**
   - Restricting values to meaningful choices.
   - Literal unions and autocomplete.

5. **Type Arrays, Events, and Forms**
   - `Expense[]`.
   - Event types used by the project.
   - Narrowing values safely rather than using `any`.

6. **Read and Fix Type Errors**
   - Expected versus received types.
   - Following error messages through the program.
   - Distinguishing a type error from a runtime error.

### Project milestone

The expense data engine and browser interactions have explicit, useful TypeScript models.

### Learner must be able to explain

- What TypeScript can catch and what it cannot prove.
- How the `Expense` interface describes the product’s data.
- Why `any` removes the protection the learner is trying to gain.

---

## Module 8 — Understand React Before Using Hooks

### Purpose

Connect the learner’s vanilla DOM experience to React’s declarative mental model.

### Lessons

1. **The Problem React Solves**
   - Review the manual update points in the vanilla project.
   - Describe UI as a function of data.
   - Declarative versus imperative code.

2. **Set Up the React Root**
   - Application entry point.
   - Root element and rendering.
   - Development mode and Strict Mode at a beginner-friendly level.

3. **Describe UI with JSX**
   - JSX versus HTML.
   - Expressions, attributes, one parent, fragments, and closed elements.
   - How JSX becomes JavaScript.

4. **Build Components**
   - Components as functions.
   - Capitalized names.
   - Choosing useful component boundaries.

5. **Pass Data with Props**
   - Parent-to-child data flow.
   - Read-only inputs.
   - Rendering an `ExpenseRow` from one `Expense`.

6. **Render Lists with Keys**
   - Mapping data to components.
   - Stable identity.
   - Why array indexes cause problems when lists change.

### Project milestone

A static React expense tracker rendered from the same typed expense data used earlier.

### Learner must be able to explain

- What React replaces and what it does not replace.
- How JSX, components, props, and keys cooperate.
- Why React is still JavaScript, HTML concepts, and CSS working together.

---

## Module 9 — Turn the React Screen into a Product

### Purpose

Add interaction one understandable state transition at a time.

### Lessons

1. **State Is the App’s Current Memory**
   - `useState`, initial state, current value, and setter.
   - Rendering again after state changes.
   - State versus normal variables.

2. **Events Request State Changes**
   - React event handlers.
   - Passing a function versus calling it.
   - Trace click → handler → setter → render.

3. **Build Controlled Form Fields**
   - State as the input’s source of truth.
   - `value` and `onChange`.
   - Strings, parsed numbers, and select values.

4. **Submit and Validate an Expense**
   - Preventing default navigation.
   - Guard clauses and clear error states.
   - Creating a stable ID and clearing successful input.

5. **Add Without Mutating**
   - Functional state updates.
   - Creating a new array.
   - Why the latest state matters.

6. **Delete and Edit by Identity**
   - Passing callbacks through props.
   - `filter` for deletion.
   - `map` and object spread for editing.

7. **Derive Filters and Totals**
   - Source state versus derived values.
   - Why duplicated totals become stale.
   - Filtering before reducing.

8. **Design Every State**
   - Empty list, empty filter result, validation error, populated list, and editing state.
   - Conditional rendering.

9. **Choose State Ownership**
   - Draw the component tree.
   - Place state in the nearest shared owner.
   - Lift state only when real consumers require it.

### Project milestone

A complete interactive React expense tracker with add, edit, delete, filter, validation, and derived totals.

### Learner must be able to explain

- The full path from form input to a new rendered row.
- Why state should be minimal.
- Why React re-renders and how identity keeps updates correct.

---

## Module 10 — Synchronize with the Outside World

### Purpose

Teach Effects narrowly and correctly after the learner understands rendering and derived data.

### Lessons

1. **Pure Rendering and Side Effects**
   - What rendering should do.
   - External systems.
   - Why Effects are escape hatches rather than general-purpose sequencing.

2. **Load Saved Expenses Safely**
   - Lazy initial state.
   - Guarded JSON parsing.
   - Recovering from missing or malformed data.

3. **Save When Expenses Change**
   - `useEffect`.
   - Dependency arrays.
   - Synchronizing one external system.

4. **Cleanup and Repeated Effects**
   - Cleanup concept through small timers or listeners.
   - Development behavior under Strict Mode.
   - Avoiding loops.

5. **Optional: Understand Remote Data**
   - APIs, asynchronous work, loading, success, empty, and error states.
   - Why production applications often use dedicated server-state tools.
   - This lesson does not add a mandatory backend.

### Project milestone

The React expense tracker survives browser refreshes and fails safely when stored data is invalid.

### Learner must be able to explain

- Why totals do not need an Effect.
- Why storage synchronization does need an Effect.
- What the dependency array communicates.

---

## Module 11 — Make the Product Trustworthy

### Purpose

Teach that a project is not complete merely because its happy path works.

### Lessons

1. **Debug from Evidence**
   - Reproduce, read, isolate, hypothesize, change, and verify.
   - Console and React DevTools.

2. **Test Behaviors, Not Implementation Trivia**
   - User action and expected visible result.
   - Add, reject, edit, delete, filter, total, reload.
   - Automated course assertions.

3. **Keyboard and Screen-Reader Fundamentals**
   - Semantic controls, labels, focus order, status messages, and error announcements.
   - Keyboard-only testing.

4. **Responsive and Visual Quality**
   - 375px, 768px, 1024px, and 1440px checks.
   - Contrast, readable line length, touch targets, overflow, and reduced motion.

5. **Refactor Without Changing Behavior**
   - Rename unclear code.
   - Extract repeated logic.
   - Keep the checks passing while structure improves.

6. **Final Product Review**
   - Correctness, design, accessibility, code clarity, and resilience rubric.
   - Honest limitations and possible next features.

### Project milestone

A tested, accessible, responsive expense tracker that can be demonstrated confidently.

### Learner must be able to explain

- How they know the application works.
- Which users could be excluded by an inaccessible implementation.
- The difference between refactoring and adding a feature.

---

## Module 12 — Leave the Playground and Ship

### Purpose

Move from the browser learning environment into a real development and deployment workflow only after the learner understands the project.

### Lessons

1. **Meet the Terminal, Node, and npm**
   - Commands, current directory, Node, package managers, and scripts.
   - What each tool contributes.

2. **Create a Vite React TypeScript Project**
   - Project scaffolding.
   - Files and folders.
   - Development server.

3. **Move the Browser Project Locally**
   - Copy the same components, types, and CSS.
   - Resolve imports.
   - Confirm behavior did not change.

4. **Understand Packages and Builds**
   - `package.json`, dependencies, development dependencies, and lockfiles.
   - Development versus production builds.

5. **Save History with Git**
   - Repository, status, add, commit, and meaningful commit messages.
   - Version history as recoverable checkpoints.

6. **Publish the Repository on GitHub**
   - Remote repositories, pushing, public/private choice, and repository hygiene.
   - Avoiding secrets.

7. **Write the Project README**
   - Human problem, features, screenshots, local setup, decisions, limitations, and live link.

8. **Deploy with Vercel**
   - Import, build, deploy, production URL, and later updates.
   - Verify mobile and desktop behavior.

9. **Explain the Project**
   - Problem → input → validation → state → render → storage.
   - Demonstrate one feature and one bug that was solved.
   - Describe what to learn next without pretending the foundation is job readiness.

### Final milestone

A public GitHub repository and deployed expense-tracker URL that the learner understands well enough to explain and continue improving.

### Learner must be able to explain

- The difference between React, Vite, Node, npm, Git, GitHub, and Vercel.
- How source code becomes a public website.
- Every important data transition in the application they built.

---

## Course-wide teaching rules

Every lesson follows the same sequence:

1. **The product problem**
2. **What the learner will make**
3. **Explain the concept from first principles**
4. **Use an analogy, then state where the analogy stops working**
5. **Trace a small example by hand**
6. **Write pseudocode**
7. **Build the next project slice**
8. **Predict, trace, fix, build, and explain**
9. **Run deterministic checks**
10. **Save a visible project checkpoint**

No lesson may:

- Introduce a term without defining it.
- Use unexplained syntax in starter code.
- Mark completion through an unrestricted button.
- Require AI to understand or finish the material.
- Jump to a React abstraction before showing the concrete problem it solves.
- Treat HTML or CSS as decoration around “real programming.”
- Present copied code as evidence of understanding.

## Proposed size

- Start Here orientation
- 12 modules
- 87 lessons
- 8 major project milestones
- One cumulative expense-tracker project
- Browser-first through Module 11
- Local tooling and deployment in Module 12

The lesson count can be reduced only by combining genuinely related practice—not by removing the foundational explanations a complete beginner needs.
