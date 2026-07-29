import type { FoundationModuleConfig } from "@/components/react-hub/FoundationModuleLab";

export const HTML_MODULE: FoundationModuleConfig = {
  id: "module-2",
  order: 2,
  title: "HTML",
  mission: "Give the tracker meaningful structure",
  headline: "Build a document the browser and people can understand.",
  description: "Turn the expense tracker into a meaningful document before styling or behavior enters the picture.",
  completion: "The tracker now has meaningful HTML structure. Module 3 will use CSS to turn that structure into a deliberate interface.",
  nextModule: {
    href: "/resources/react/module-3",
    label: "Continue to CSS",
  },
  laboratories: [
    {
      id: "document",
      title: "Document Blueprint",
      short: "Build the page skeleton",
      instruction: "Follow the colored document regions from the page’s identity to its visible content.",
      help: "Start with DOCUMENT, then move into HEAD and BODY. The browser needs the outer structure before it can interpret the page.",
      points: [
        { keyword: "DOCUMENT", title: "Declare HTML", explanation: "The doctype tells the browser to use modern HTML rules.", example: "<!doctype html>" },
        { keyword: "ROOT", title: "Open the document", explanation: "The html element wraps the complete document and declares its language.", example: '<html lang="en">...</html>' },
        { keyword: "HEAD", title: "Describe the page", explanation: "Metadata gives the document a title and correct character encoding.", example: "<head>\n  <meta charset=\"UTF-8\" />\n  <title>Expense Tracker</title>\n</head>" },
        { keyword: "BODY", title: "Place visible content", explanation: "Everything the learner sees belongs inside the body.", example: "<body>\n  <h1>Expense Tracker</h1>\n</body>" },
      ],
    },
    {
      id: "semantics",
      title: "Semantic Structure",
      short: "Choose elements by meaning",
      instruction: "Match each colored semantic keyword to the job that region performs in the tracker.",
      help: "Ask what the content means, not how it should look. A heading is h1 because it names the page—not because it is large.",
      points: [
        { keyword: "HEADER", title: "Introduce the tracker", explanation: "Header groups the page title and short introduction.", example: "<header>\n  <h1>Expense Tracker</h1>\n  <p>Know where your money goes.</p>\n</header>" },
        { keyword: "MAIN", title: "Hold the primary task", explanation: "Main contains the form, summary, and expense history.", example: "<main>...</main>" },
        { keyword: "SECTION", title: "Group related content", explanation: "Sections divide the form, totals, and history into named regions.", example: "<section aria-labelledby=\"summary-title\">\n  <h2 id=\"summary-title\">Summary</h2>\n</section>" },
        { keyword: "LIST", title: "Represent expenses", explanation: "An expense history is a collection, so a list communicates that relationship.", example: "<ul>\n  <li>Bus fare — ₦1,500</li>\n</ul>" },
      ],
    },
    {
      id: "forms",
      title: "Form Anatomy",
      short: "Capture an expense",
      instruction: "Trace one expense through the matching LABEL, INPUT, and BUTTON controls.",
      help: "Every input needs a visible label. Match label for with input id so clicking the label focuses the correct field.",
      points: [
        { keyword: "FORM", title: "Create the submission boundary", explanation: "The form groups every control involved in adding one expense.", example: "<form>...</form>" },
        { keyword: "LABEL", title: "Name the information", explanation: "A visible label tells everyone what belongs in the field.", example: '<label for="description">Description</label>' },
        { keyword: "INPUT", title: "Collect the value", explanation: "The matching id connects the field to its label.", example: '<input id="description" name="description" required />' },
        { keyword: "BUTTON", title: "Submit the expense", explanation: "An explicit submit button states the form’s action.", example: '<button type="submit">Add expense</button>' },
      ],
    },
    {
      id: "accessibility",
      title: "Accessible by Default",
      short: "Make meaning available",
      instruction: "Review four HTML decisions that make the tracker usable before any CSS is loaded.",
      help: "Native HTML gives you strong accessibility for free. Prefer real headings, labels, buttons, and status regions over generic div elements.",
      points: [
        { keyword: "LANGUAGE", title: "Declare the document language", explanation: "Language helps assistive technology pronounce content correctly.", example: '<html lang="en">' },
        { keyword: "ORDER", title: "Keep headings logical", explanation: "A clear h1 then h2 hierarchy makes the page easy to navigate.", example: "<h1>Expense Tracker</h1>\n<h2>Add expense</h2>\n<h2>History</h2>" },
        { keyword: "STATUS", title: "Announce changing totals", explanation: "A live status can announce a newly calculated total.", example: '<p aria-live="polite">Total: ₦8,500</p>' },
        { keyword: "ACTION", title: "Use a real button", explanation: "Buttons already support keyboard focus and activation.", example: '<button type="submit">Add expense</button>' },
      ],
    },
  ],
};

export const CSS_MODULE: FoundationModuleConfig = {
  id: "module-3",
  order: 3,
  title: "CSS",
  mission: "Turn structure into a responsive interface",
  headline: "Make the tracker clear, deliberate, and adaptable.",
  description: "Style the HTML tracker by controlling selectors, spacing, layout, and responsive behavior without losing its meaning.",
  completion: "The expense tracker now has meaningful structure and responsive presentation. JavaScript will make it behave.",
  laboratories: [
    {
      id: "selectors",
      title: "Selectors and Cascade",
      short: "Target the right element",
      instruction: "Follow the matching selector keywords to see which tracker elements receive each rule.",
      help: "Read a CSS rule as: select something, then apply declarations. Later or more specific rules can override earlier ones.",
      points: [
        { keyword: "ELEMENT", title: "Style every heading", explanation: "An element selector targets every matching HTML element.", example: "h1 {\n  color: #f5f5f0;\n}" },
        { keyword: "CLASS", title: "Style a reusable pattern", explanation: "A class targets any element carrying that reusable label.", example: ".expense-card {\n  background: #111111;\n}" },
        { keyword: "STATE", title: "Respond to interaction", explanation: "A pseudo-class targets a temporary state such as hover or focus.", example: "button:hover {\n  background: #e8ff47;\n}" },
        { keyword: "CASCADE", title: "Resolve competing rules", explanation: "Specificity and source order decide which declaration wins.", example: ".total { color: #a3c4b4; }\n.summary .total { color: #e8ff47; }" },
      ],
    },
    {
      id: "box-model",
      title: "The Box Model",
      short: "Control space precisely",
      instruction: "Build one expense card from the inside out using the matching box-model layers.",
      help: "Content sits in the center. Padding creates inner breathing room, border draws the edge, and margin separates the card from neighbors.",
      points: [
        { keyword: "CONTENT", title: "Size the useful area", explanation: "Width and height describe the content box by default.", example: ".expense-card {\n  width: 100%;\n}" },
        { keyword: "PADDING", title: "Add inner breathing room", explanation: "Padding separates content from its border.", example: ".expense-card {\n  padding: 1rem;\n}" },
        { keyword: "BORDER", title: "Define the edge", explanation: "A subtle border makes the card boundary visible.", example: ".expense-card {\n  border: 1px solid #222220;\n}" },
        { keyword: "MARGIN", title: "Separate neighboring cards", explanation: "Margin creates space outside the element.", example: ".expense-card {\n  margin-block-end: 0.75rem;\n}" },
      ],
    },
    {
      id: "layout",
      title: "Layout Systems",
      short: "Arrange the interface",
      instruction: "Match each layout keyword to the relationship it controls in the tracker.",
      help: "Use Flexbox for one-dimensional rows or columns. Use Grid when rows and columns need to coordinate together.",
      points: [
        { keyword: "FLOW", title: "Start with normal flow", explanation: "Block elements naturally stack, giving the page a reliable mobile foundation.", example: ".tracker > * + * {\n  margin-block-start: 1rem;\n}" },
        { keyword: "FLEX", title: "Align a summary row", explanation: "Flexbox distributes the label and total across one row.", example: ".summary {\n  display: flex;\n  justify-content: space-between;\n}" },
        { keyword: "GRID", title: "Arrange the workspace", explanation: "Grid coordinates the form and expense history as columns.", example: ".workspace {\n  display: grid;\n  grid-template-columns: 1fr 1.4fr;\n}" },
        { keyword: "GAP", title: "Space related items", explanation: "Gap creates consistent space without child margins.", example: ".workspace {\n  gap: 1.5rem;\n}" },
      ],
    },
    {
      id: "responsive",
      title: "Responsive Tracker",
      short: "Adapt across screens",
      instruction: "Move from the smallest viewport upward, matching each responsive keyword to its visible effect.",
      help: "Begin with a single-column mobile layout. Add complexity only when the available width can support it.",
      points: [
        { keyword: "MOBILE", title: "Begin with one column", explanation: "The base layout works without a media query on narrow screens.", example: ".workspace {\n  display: grid;\n  gap: 1rem;\n}" },
        { keyword: "FLUID", title: "Let controls fill their space", explanation: "Flexible widths prevent overflow and tiny tap targets.", example: "input,\nbutton {\n  width: 100%;\n}" },
        { keyword: "BREAKPOINT", title: "Add columns when they fit", explanation: "A media query enhances the layout at a meaningful width.", example: "@media (min-width: 768px) {\n  .workspace { grid-template-columns: 1fr 1.4fr; }\n}" },
        { keyword: "TEST", title: "Check real viewport widths", explanation: "Testing catches overflow, cramped controls, and unreadable line lengths.", example: "/* Verify at 375px, 768px, 1024px, and 1440px */" },
      ],
    },
  ],
};
