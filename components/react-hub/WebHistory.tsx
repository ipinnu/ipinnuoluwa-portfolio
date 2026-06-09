"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

interface TimelineEvent {
  year: string;
  title: string;
  who: string;
  body: string;
  problem?: string;
  impact: string;
  tag: "web" | "language" | "library" | "framework" | "react" | "now";
}

const TAG_STYLES: Record<TimelineEvent["tag"], { color: string; label: string }> = {
  web: { color: "#A3C4B4", label: "Web" },
  language: { color: "#E8FF47", label: "Language" },
  library: { color: "#7EB8F7", label: "Library" },
  framework: { color: "#F7A07E", label: "Framework" },
  react: { color: "#E8FF47", label: "React" },
  now: { color: "#E8FF47", label: "Today" },
};

const EVENTS: TimelineEvent[] = [
  {
    year: "1991",
    title: "The World Wide Web is Born",
    who: "Tim Berners-Lee · CERN, Geneva",
    body: "Tim Berners-Lee was a physicist working at CERN — Europe's particle physics lab — who needed a better way for scientists worldwide to share research documents. His solution: a system of linked text documents accessible over a network. He invented HTML (the language), HTTP (the transfer protocol), and URLs (the addresses). The first web page went live on August 6, 1991. It was just text and links — no images, no colour, no interaction. But it was the foundation of everything.",
    problem: "Scientists at CERN couldn't easily share research across different computer systems. They needed a universal, network-accessible document format.",
    impact: "Created the fundamental structure of every web page that has ever existed. Every <div>, <p>, and <h1> you write traces back to this moment.",
    tag: "web",
  },
  {
    year: "1993",
    title: "The First Graphical Browser",
    who: "Marc Andreessen & Eric Bina · NCSA, Illinois",
    body: "The early web was text-only. Mosaic, built by a 22-year-old student named Marc Andreessen and a programmer named Eric Bina, was the first browser to display images inline with text on the same page. Within months, millions of people who had never used the internet before were browsing it. The web exploded from 50 sites to over 10,000 in a single year.",
    problem: "The web existed but was invisible to ordinary people — only command-line-comfortable users could access it.",
    impact: "Brought the web to the public. Andreessen later co-founded Netscape, which would become the battleground for the browser wars — and the birthplace of JavaScript.",
    tag: "web",
  },
  {
    year: "1994",
    title: "CSS: Giving the Web a Wardrobe",
    who: "Håkon Wium Lie · CERN / Opera",
    body: "By 1994, web pages were getting messier. Developers were cramming visual information into HTML tags — using <font color='red'> and <table> tricks for layout. Norwegian web developer Håkon Wium Lie proposed CSS: a separate language just for appearance. The idea was separation of concerns — HTML describes what something is, CSS describes how it looks. It took two years to get browser support (Netscape and IE both fought adopting it), and another decade before developers could actually rely on it behaving consistently.",
    problem: "HTML was being abused to handle presentation — making documents impossible to maintain and inaccessible to screen readers and search engines.",
    impact: "CSS is the reason web pages look anything like they do today. Every colour, font, margin, flexbox row, and animation you've ever seen in a browser is CSS.",
    tag: "language",
  },
  {
    year: "1995",
    title: "JavaScript: Written in 10 Days",
    who: "Brendan Eich · Netscape",
    body: "Netscape needed a scripting language that non-programmers could embed in web pages. Their CEO, Jim Barksdale, gave engineer Brendan Eich a single constraint: it must look like Java (which was trendy in 1995). Eich designed and implemented the entire language in 10 days in May 1995. It was originally called Mocha, then LiveScript, then JavaScript — a marketing decision that caused decades of confusion. Despite the rushed birth, JavaScript contained ideas that turned out to be genuinely powerful: first-class functions, closures, and dynamic typing.",
    problem: "Web pages were static. You filled out a form and waited for the server to respond. There was no way to validate inputs, animate elements, or respond to user actions in real time.",
    impact: "JavaScript is the only programming language that runs natively in every web browser on earth. React, Node.js, and virtually every web technology you will ever use is built in JavaScript.",
    tag: "language",
  },
  {
    year: "1995–2005",
    title: "The Browser Wars",
    who: "Netscape vs. Microsoft",
    body: "Netscape Navigator dominated the early web, but Microsoft built Internet Explorer into Windows 95 and distributed it to hundreds of millions of PCs for free. Netscape couldn't compete on distribution. By 2002, IE had 96% market share. The problem: both companies added their own non-standard features. JavaScript worked differently in each browser. CSS behaved differently. Developers had to write the same code twice — once for each browser. A common sight in 1999: 'This site best viewed in Internet Explorer 5.'",
    problem: "Building a website that worked in all browsers required enormous effort. JavaScript APIs were completely inconsistent. The web fragmented into two parallel, incompatible worlds.",
    impact: "This chaos directly created jQuery — a library whose entire reason for existing was to paper over browser differences. And when Microsoft eventually stopped innovating on IE, Firefox and Chrome rose from the ashes.",
    tag: "web",
  },
  {
    year: "2006",
    title: "jQuery: Write Less, Do More",
    who: "John Resig · open source",
    body: "John Resig was 22 when he released jQuery at BarCamp NYC in January 2006. His insight was simple: the pain of cross-browser JavaScript could be hidden behind a clean, unified API. Instead of writing 20 lines to fade an element in IE and Firefox, you wrote one: $('#box').fadeIn(). jQuery normalised the DOM, handled events consistently, and made AJAX (loading data without refreshing the page) accessible. It spread virally. By 2012, jQuery was running on over 55% of the world's most visited websites.",
    problem: "Cross-browser JavaScript required painful workarounds. Selecting DOM elements, attaching events, and animating required completely different code per browser.",
    impact: "jQuery proved that a library could tame browser chaos. But it didn't solve the deeper problem: as web applications grew more complex, manually manipulating the DOM became unmanageable. That problem would take another seven years to properly solve.",
    tag: "library",
  },
  {
    year: "2008",
    title: "Chrome and the V8 Revolution",
    who: "Google",
    body: "Google launched Chrome on September 2, 2008. Its secret weapon: V8, a JavaScript engine that compiled JavaScript directly to machine code instead of interpreting it line by line. JavaScript went from being a slow scripting language to being genuinely fast. Google Maps, Gmail, and Google Docs had shown that you could build complex applications in the browser — but they were slow. V8 changed the performance ceiling entirely. This also enabled Node.js in 2009, which let JavaScript run on servers.",
    problem: "JavaScript was too slow to power complex applications. Browsers interpreted JavaScript rather than compiling it, limiting what was possible.",
    impact: "V8 made JavaScript competitive with native applications. Without this speed revolution, React — which re-renders components in milliseconds — wouldn't have been practical.",
    tag: "web",
  },
  {
    year: "2010",
    title: "The First Frameworks",
    who: "Angular (Google) · Backbone.js (Jeremy Ashkenas)",
    body: "By 2010, web apps had outgrown jQuery. You could toggle elements and fetch data, but there was no structure for managing complex, changing data. Backbone.js (by Jeremy Ashkenas, creator of CoffeeScript) introduced the concept of models and views. Google's Angular (released in 2010) went further: two-way data binding, directives, dependency injection — a complete framework for building SPAs (Single Page Applications). Angular was powerful but had a steep learning curve. It also had a performance problem that would become critical at Facebook's scale.",
    problem: "Large web applications written with jQuery became impossible to maintain. When data changed, you had to manually find and update every piece of the UI that referenced it.",
    impact: "These frameworks proved that the web could support real applications — not just documents. They also exposed the core unsolved problem: keeping the UI in sync with data at scale.",
    tag: "framework",
  },
  {
    year: "2011–2012",
    title: "Facebook's Nightmare",
    who: "Facebook Engineering",
    body: "Facebook's chat feature kept showing unread messages that had already been read. The notification counter would say '1 unread' even after you'd opened and closed the conversation. Engineers would fix it, and it would break somewhere else. The root cause: Facebook had many engineers working on many features, each manipulating the same DOM elements, each with their own understanding of what the 'current state' was. There was no single source of truth. When one engineer updated the message count, another component that also tracked it wouldn't know. The UI became impossible to reason about.",
    problem: "At Facebook's scale, with hundreds of engineers and dozens of UI states changing simultaneously, no one could predict how a code change would affect the overall interface.",
    impact: "This exact problem — UI state getting out of sync — led Facebook engineer Jordan Walke to ask a fundamental question: what if, instead of manually updating the DOM, you just described what you want the UI to look like, and the computer figured out the differences?",
    tag: "web",
  },
  {
    year: "2013",
    title: "React is Born",
    who: "Jordan Walke · Facebook / JSConf US",
    body: "Jordan Walke, a software engineer at Facebook, had been experimenting with XHP — an extension of PHP that let you write HTML inside PHP code. He applied a similar idea to JavaScript, calling his prototype FaxJS. The core insight: instead of telling the browser how to update the DOM (imperative), you describe what the UI should look like for a given state (declarative), and let the library figure out the minimum changes needed. Facebook first deployed it in the News Feed in 2011, then Instagram in 2012. On May 29, 2013, Tom Occhino and Jordan Walke open-sourced React at JSConf US in Amelia Island, Florida. The audience was skeptical — mixing HTML in JavaScript? That breaks separation of concerns! But within months, engineers who tried it became converts.",
    problem: "Manually tracking DOM updates across a large codebase was error-prone and unscalable. The mental model required was too complex.",
    impact: "React introduced the component model, the virtual DOM, and declarative UI. These ideas were so right that every major framework that came after — Vue, Svelte, even Angular's rewrite — adopted them.",
    tag: "react",
  },
  {
    year: "2015",
    title: "React Goes Mobile",
    who: "Facebook · React Native",
    body: "Facebook released React Native at React.js Conf in January 2015. The promise: Learn Once, Write Anywhere. Using React's component model, you could now build iOS and Android apps with JavaScript. Unlike earlier hybrid approaches (like PhoneGap), React Native didn't wrap a web view — it rendered actual native UI components. Instagram, Airbnb, and thousands of other apps shipped React Native in production. The underlying idea — use the same mental model for any platform — turned React into an ecosystem rather than just a web library.",
    problem: "Mobile and web development required entirely separate codebases, teams, and skill sets.",
    impact: "React Native proved that the React model was not just a web idea but a universal approach to building UIs. It cemented React's position as the dominant UI paradigm across platforms.",
    tag: "react",
  },
  {
    year: "2019",
    title: "Hooks Change Everything",
    who: "Sophie Alpert, Dan Abramov, Ryan Florence · React 16.8",
    body: "Before 2019, React had two kinds of components: function components (simple, stateless) and class components (complex, stateful). If you needed state or lifecycle methods, you had to use a class — complete with constructor, super(props), this.state, this.setState, and componentDidMount. The code was verbose and the mental model was confusing. Hooks — introduced in React 16.8 — let you use state and other React features in function components. useState replaced this.state. useEffect replaced componentDidMount, componentDidUpdate, and componentWillUnmount combined. The community moved from classes to functions almost entirely within 18 months.",
    problem: "Class components were hard to understand, hard to test, and hard to share logic between. The `this` keyword confused beginners and veterans alike.",
    impact: "Hooks are what you're learning in this course. They're the modern, correct way to write React. The class-based API still works but is effectively legacy.",
    tag: "react",
  },
  {
    year: "2020–2023",
    title: "React Goes to the Server",
    who: "Vercel / Next.js · Meta Research",
    body: "React had always been a client-side library — your browser downloaded a JavaScript bundle, React ran in the browser, and HTML was generated dynamically. But this caused two problems: slow initial load (users stared at blank screens while JS downloaded) and poor SEO (search engines struggled with JS-rendered content). Next.js, built by Vercel, popularised Server-Side Rendering (SSR) and Static Site Generation (SSG). Then in 2023, React 18 introduced Server Components — components that run on the server, send plain HTML to the browser, and never ship JavaScript to the client. This portfolio site you're reading right now is built with Next.js.",
    problem: "Pure client-side React apps were slow to load and invisible to search engines.",
    impact: "React Server Components are the future of the framework. The line between server and client has blurred. Understanding both is now a core React skill.",
    tag: "now",
  },
  {
    year: "Today",
    title: "Where We Stand",
    who: "2025 and beyond",
    body: "React is maintained by Meta (formerly Facebook) and a team of open-source contributors. It's used by companies from startups to the largest organisations in the world: Meta, Netflix, Airbnb, Twitter, Atlassian, and hundreds of thousands more. The ecosystem is mature: Next.js for full-stack apps, React Native for mobile, Remix for server-focused apps, Expo for cross-platform mobile. New tools like Rspack and Vite have replaced the old bundlers. AI tooling built on React is everywhere. And the core ideas — components, state, props, declarative rendering — remain exactly what Jordan Walke invented in 2011. Once you understand them, you understand all of it.",
    impact: "You are learning the most widely used UI library in the world. The concepts in this course will apply to every React project you ever work on, regardless of what else changes around them.",
    tag: "now",
  },
];

function TimelineItem({ event, index }: { event: TimelineEvent; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const tagStyle = TAG_STYLES[event.tag];
  const isReact = event.tag === "react" || event.tag === "now";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.05 }}
      className="relative pl-10 pb-12 last:pb-0"
    >
      {/* Timeline line */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px"
        style={{
          background: isReact
            ? "linear-gradient(to bottom, rgba(232,255,71,0.4), rgba(232,255,71,0.1))"
            : "linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
        }}
      />

      {/* Timeline dot */}
      <div
        className="absolute left-0 top-1 -translate-x-1/2 w-2 h-2"
        style={{
          background: tagStyle.color,
          boxShadow: isReact ? `0 0 10px ${tagStyle.color}80` : "none",
        }}
      />

      {/* Year badge */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <span
          className="font-syne font-black text-lg leading-none"
          style={{
            color: tagStyle.color,
            textShadow: isReact ? `0 0 20px ${tagStyle.color}60` : "none",
          }}
        >
          {event.year}
        </span>
        <span
          className="font-mono text-[9px] px-2 py-0.5 tracking-widest uppercase"
          style={{
            color: tagStyle.color,
            background: `${tagStyle.color}12`,
            border: `1px solid ${tagStyle.color}30`,
          }}
        >
          {tagStyle.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-syne font-bold text-xl text-text-primary mb-1">
        {event.title}
      </h3>

      {/* Who */}
      <p className="font-mono text-[10px] text-text-tertiary tracking-wide mb-4">
        {event.who}
      </p>

      {/* Body */}
      <p className="text-[15px] text-text-secondary leading-relaxed mb-4">
        {event.body}
      </p>

      {/* Problem callout */}
      {event.problem && (
        <div
          className="mb-4 p-4 border-l-2"
          style={{
            borderColor: "rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <p className="font-mono text-[9px] text-text-tertiary tracking-widest uppercase mb-1">
            The Problem
          </p>
          <p className="text-sm text-text-secondary italic leading-relaxed">
            {event.problem}
          </p>
        </div>
      )}

      {/* Impact callout */}
      <div
        className="p-4 border-l-2"
        style={{
          borderColor: isReact
            ? "rgba(232,255,71,0.4)"
            : "rgba(163,196,180,0.3)",
          background: isReact
            ? "rgba(232,255,71,0.03)"
            : "rgba(163,196,180,0.03)",
        }}
      >
        <p
          className="font-mono text-[9px] tracking-widest uppercase mb-1"
          style={{ color: isReact ? "#E8FF47" : "#A3C4B4" }}
        >
          Why it matters
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">
          {event.impact}
        </p>
      </div>
    </motion.div>
  );
}

export default function WebHistory() {
  return (
    <article className="min-h-screen">
      {/* Hero */}
      <div className="border-b border-border px-6 py-10">
        <p className="font-mono text-[10px] text-text-tertiary tracking-widest uppercase mb-3">
          // Foundation · Before React
        </p>
        <h1 className="font-syne font-black text-3xl md:text-4xl text-text-primary mb-4">
          The Web Before React
        </h1>
        <p className="text-[15px] text-text-secondary leading-relaxed max-w-2xl mb-6">
          React didn't appear out of nowhere. It was the answer to 20 years of
          accumulated pain — browser wars, spaghetti JavaScript, and UIs that
          broke in ways nobody could predict. To truly understand why React works
          the way it does, you need to know the story it was written to end.
        </p>
        <div
          className="inline-flex items-center gap-2 px-4 py-2 border font-mono text-xs text-text-secondary"
          style={{ borderColor: "rgba(163,196,180,0.25)", background: "rgba(163,196,180,0.04)" }}
        >
          <span style={{ color: "#A3C4B4" }}>✦</span>
          No prior coding knowledge needed — this is history, not homework
        </div>
      </div>

      {/* Timeline */}
      <div className="px-6 py-10 max-w-3xl">
        <div className="space-y-0">
          {EVENTS.map((event, i) => (
            <TimelineItem key={event.year} event={event} index={i} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        className="mx-6 mb-12 p-8 border text-center"
        style={{
          borderColor: "rgba(232,255,71,0.25)",
          background: "rgba(232,255,71,0.03)",
        }}
      >
        <p
          className="font-syne font-black text-2xl mb-3"
          style={{ color: "#E8FF47", textShadow: "0 0 30px #E8FF4740" }}
        >
          Now you're ready
        </p>
        <p className="text-text-secondary text-[15px] leading-relaxed mb-6 max-w-md mx-auto">
          You know the problem React was built to solve. Let's learn how it
          solves it — one concept at a time.
        </p>
        <Link
          href="/resources/react/what-is-react"
          className="inline-flex items-center gap-2 font-mono text-sm px-6 py-3 text-bg-primary font-semibold transition-all duration-200 hover:opacity-90"
          style={{
            background: "#E8FF47",
            boxShadow: "0 0 24px #E8FF4740",
          }}
        >
          Start Lesson 1: What is React? →
        </Link>
      </div>
    </article>
  );
}
