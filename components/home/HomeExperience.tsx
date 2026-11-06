import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projects";
import { conversationUrl } from "@/lib/contact";
import NeedFinder from "./NeedFinder";
import TeamsCarousel from "./TeamsCarousel";
import styles from "./home.module.css";

const selectedWork = [
  { slug: "fixora-global-hub", type: "Marketplace · Web application", description: "Helping customers find skilled artisans, agree on the work, and pay with confidence.", contribution: "Product design, full-stack engineering, payments & realtime messaging", tone: "sage" },
  { slug: "autodrive", type: "Mobile application · Mobility", description: "Making vehicle document renewals easier, from the first reminder to payment and delivery tracking.", contribution: "Product design, Flutter development & payment integration", tone: "blue" },
  { slug: "hermex-travels", type: "Mobile application · Travel", description: "Bringing flights, hotels, trip planning, and travel support into one mobile experience.", contribution: "Flutter frontend, REST API integration & responsive booking flows", tone: "sky" },
  { slug: "epraise-welding", type: "Business website · Client portal", description: "Giving a welding business a place to showcase its work, talk to clients, and manage quotations.", contribution: "Product design, full-stack engineering & a client-managed gallery", tone: "sand" },
  { slug: "my-health-padi", type: "Mobile application · Healthcare", description: "Helping patients connect with healthcare professionals and navigate care from their phones.", contribution: "Flutter development, role-based experiences & AI integration", tone: "rose" },
  { slug: "brainbox-studios", type: "Business website · Technology", description: "Helping a technology firm explain what it does and make the right first impression with potential clients.", contribution: "Website design, development & product storytelling", tone: "lavender" },
];

export default function HomeExperience() {
  return (
    <div className={styles.home}>
      <section className={`${styles.container} ${styles.hero}`} aria-labelledby="hello-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><span className={styles.statusDot} /> A product engineer in Lagos, Nigeria</p>
          <p className={styles.hello}>Hi, I&apos;m Ipinnuoluwa.</p>
          <h1 id="hello-title">Good ideas deserve<br />to become <span>useful things.</span></h1>
          <p className={styles.intro}>I design and build mobile apps, websites, and tools that make life a little easier. I&apos;m here to help you make sense of the idea, build it properly, and get it into people&apos;s hands.</p>
          <div className={styles.actions}>
            <a className={styles.button} href="#selected-work">See what I&apos;ve built <span aria-hidden="true">↓</span></a>
            <a className={styles.textLink} href={conversationUrl()} target="_blank" rel="noopener noreferrer">Have something in mind? Let&apos;s talk ↗</a>
          </div>
          <p className={styles.reassurance}>An idea, a business challenge, or an &ldquo;I&apos;m not sure yet&rdquo; is a good place to start.</p>
        </div>
        <figure className={styles.portrait}>
          <div className={styles.portraitImage}>
            <Image src="/images/Profile picture.jpeg" alt="Ipinnuoluwa Oladipo, smiling in a black shirt" fill priority sizes="(max-width: 760px) 90vw, 440px" />
          </div>
          <figcaption><span>Ipinnuoluwa Oladipo</span><span>Engineer. Builder. Your collaborator.</span></figcaption>
          <a href="#a-little-about-me" className={styles.photoNote}>The person behind the projects <span aria-hidden="true">↙</span></a>
        </figure>
      </section>

      <TeamsCarousel />

      <section id="selected-work" className={`${styles.container} ${styles.section}`} aria-labelledby="work-title">
        <div className={styles.sectionHeading}>
          <div><p className={styles.eyebrow}>A few things I&apos;ve helped bring to life</p><h2 id="work-title">The work, up close.</h2></div>
          <p>Real products, real problems.<br />Take a look around. Try them out.</p>
        </div>
        <div className={styles.projectGrid}>
          {selectedWork.map((work, index) => {
            const project = projects.find(item => item.slug === work.slug)!;
            const isHermex = project.slug === "hermex-travels";
            const phoneScreens = project.slug === "autodrive"
              ? ["/images/projects/autodrive/Frame%20536.png", "/images/projects/autodrive/Frame%20526.png"]
              : project.slug === "my-health-padi"
                ? ["/images/projects/my-health-padi/Home%20page.avif", "/images/projects/my-health-padi/Screenshot%202026-03-31%20142740.png"]
                : null;
            return (
              <article key={project.slug} className={styles.project}>
                <Link href={`/work/${project.slug}`} className={`${styles.artwork} ${styles[work.tone]}`} aria-label={`Explore ${project.title} case study`}>
                  <span className={styles.artworkLabel}>{work.type}</span>
                  {isHermex ? (
                    <div className={styles.travelScreens}>
                      {[project.images![1], project.images![0]].map((src, i) => <div key={src}><Image src={src} alt={`${project.title} ${i === 0 ? "booking" : "travel assistant"} preview`} fill sizes="(max-width: 760px) 42vw, 230px" /></div>)}
                    </div>
                  ) : phoneScreens ? (
                    <div className={styles.phoneScreens}>
                      {phoneScreens.map((src, i) => <div key={src}><Image src={src} alt={`${project.title} app screen ${i + 1}`} fill sizes="(max-width: 760px) 40vw, 200px" /></div>)}
                    </div>
                  ) : (
                    <div className={`${styles.productImage} ${project.category === "mobile" ? styles.mobileImage : styles.browserImage}`}>
                      {project.category === "web" && <div className={styles.browserBar} aria-hidden="true"><i /><i /><i /><span>{project.title}</span></div>}
                      <div className={styles.imageFrame}><Image src={project.image!} alt={`${project.title} product interface`} fill sizes="(max-width: 760px) 90vw, 560px" className={project.category === "mobile" ? styles.containImage : ""} /></div>
                    </div>
                  )}
                  <span className={styles.artworkArrow} aria-hidden="true">↗</span>
                </Link>
                <div className={styles.projectMeta}><span>0{index + 1} / {project.category === "mobile" ? "Mobile" : "Web"}</span><span><span className={styles.smallDot} />{project.status}</span></div>
                <h3><Link href={`/work/${project.slug}`}>{project.title}</Link></h3>
                <p className={styles.projectDescription}>{work.description}</p>
                <p className={styles.contribution}><span>My part</span>{work.contribution}</p>
                <div className={styles.projectLinks}>
                  <Link href={`/work/${project.slug}`}>Behind the build <span aria-hidden="true">↗</span></Link>
                  {project.playStoreUrl && <a href={project.playStoreUrl} target="_blank" rel="noopener noreferrer" aria-label={`Get ${project.title} on Google Play`}>Google Play ↗</a>}
                  {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.title} live website`}>Visit website ↗</a>}
                </div>
              </article>
            );
          })}
        </div>
        <div className={styles.moreWork}><p>There&apos;s more where that came from.</p><Link href="/work" className={styles.outlineButton}>Explore all my work <span aria-hidden="true">↗</span></Link></div>
        <a className={styles.launchLink} href="https://kb-s-booking-site.vercel.app/" target="_blank" rel="noopener noreferrer"><span>Also on the workbench</span> A focused DJ booking experience for KB La Maestea <span aria-hidden="true">↗</span></a>
      </section>

      <section id="a-little-about-me" className={styles.personalSection} aria-labelledby="person-title">
        <div className={`${styles.container} ${styles.personalGrid}`}>
          <div className={styles.personalPhotos}>
            <figure className={styles.casualPhoto}><div><Image src="/images/Ipinnuoluwa-header.jpg" alt="Ipinnuoluwa off duty, wearing a hoodie, headphones, and sunglasses" fill sizes="(max-width: 760px) 72vw, 350px" /></div><figcaption>A little less formal.</figcaption></figure>
            <span className={styles.personalNote}>Same person.<br />Different tabs open.</span>
          </div>
          <div className={styles.personalCopy}>
            <p className={styles.eyebrow}>A little about me</p>
            <h2 id="person-title">A person first.<br /><span>A builder, always.</span></h2>
            <p>I&apos;m Ipinnuoluwa Oladipo, based in Lagos. I studied Mechanical Engineering at Covenant University, then found another way to put that systems-thinking brain to work: building software.</p>
            <p>I enjoy taking something that feels complicated and making it make sense. Sometimes that&apos;s a mobile app. Sometimes it&apos;s a better way for a business to run. The starting point is always understanding the people who will use it.</p>
            <p>You don&apos;t have to speak tech to work with me. Bring the context, the questions, and the messy first idea. We&apos;ll work through it together.</p>
            <div className={styles.personalLinks}><Link href="/about">More of my story ↗</Link><a href="https://www.linkedin.com/in/ipinnuoluwa-oladipo-876360235/" target="_blank" rel="noopener noreferrer">Find me on LinkedIn ↗</a></div>
          </div>
        </div>
      </section>

      <section className={`${styles.container} ${styles.section}`} aria-labelledby="wins-title">
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>A little moment to celebrate</p><h2 id="wins-title">Good things along the way.</h2></div><p>Building, learning, and finding<br />more reasons to keep going.</p></div>
        <div className={styles.recognition}>
          <div className={styles.grantPhotos}>
            <figure><div className={`${styles.grantPhoto} ${styles.launchpadPhoto}`}><Image src="/images/recognition/launchpad-africa-cohort-2-2026.jpg" alt="Ipinnuoluwa celebrating with the Launchpad Africa team and a first-place Cohort 2 award cheque for 500 dollars" fill sizes="(max-width: 760px) 90vw, 650px" /></div><figcaption>First place, Launchpad Africa Cohort 2 · 2026. A moment worth smiling about.</figcaption></figure>
            <figure className={styles.earlierGrant}><div className={styles.grantPhoto}><Image src="/images/recognition/tech-advantage-support-grant-2026.jpg" alt="Finalists at the 2026 Tech Advantage Support Grant at The Roundtable Lekki" fill sizes="(max-width: 760px) 70vw, 450px" /></div><figcaption>And an earlier milestone: the Tech Advantage Support Grant, The Roundtable Lekki.</figcaption></figure>
          </div>
          <div className={styles.grantStory}>
            <span className={styles.grantCount}>02 <span>grant wins &amp; counting</span></span>
            <h3>First place.<br />And a very big smile.</h3>
            <p>I&apos;ve now won two grants, and that&apos;s something I&apos;m genuinely excited about. It means a lot to have people believe in what I&apos;m building.</p>
            <div className={styles.grantDetail}><span>One of those milestones</span><h4>Tech Advantage Support Grant</h4><p>Third place out of 70 in 2026, with the only mobile technology-led solution among the five finalists.</p></div>
            <div className={styles.grantDetail}><span>The next chapter · 2026</span><h4>Launchpad Africa, Cohort 2</h4><p>First place and a $500 grant. A new milestone, shared with the people helping make it possible.</p><a href="https://lnkd.in/p/emJXzr3F" target="_blank" rel="noopener noreferrer">See the announcement ↗</a></div>
            <Link href="/about">More about the journey ↗</Link>
          </div>
        </div>
      </section>

      <section id="find-your-start" className={`${styles.container} ${styles.section} ${styles.claritySection}`} aria-labelledby="clarity-title">
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>You don&apos;t need all the answers yet</p><h2 id="clarity-title">What are you trying<br />to make possible?</h2></div><p>Start with what sounds like you.<br />We can figure out the technical part.</p></div>
        <NeedFinder />
      </section>

      <section className={`${styles.container} ${styles.workingTogether}`} aria-labelledby="together-title">
        <p className={styles.eyebrow}>What it&apos;s like to work together</p><h2 id="together-title">Less guesswork. More conversation.</h2>
        <div className={styles.principles}>
          <div><span>01 / Understand</span><h3>We start by listening.</h3><p>Who is it for? What is getting in the way? We get clear on the problem before jumping to a solution.</p></div>
          <div><span>02 / Build</span><h3>You stay in the loop.</h3><p>We agree on a useful first step, then make progress visible so you can ask questions and give feedback.</p></div>
          <div><span>03 / Hand over</span><h3>What we build is yours.</h3><p>Code, documentation, and a clear handover. You should understand what you have and how to move forward.</p></div>
        </div>
      </section>

      <section id="lets-talk" className={styles.contactSection} aria-labelledby="contact-title">
        <div className={`${styles.container} ${styles.contactInner}`}>
          <Image src="/images/Profile picture.jpeg" alt="" width={72} height={72} className={styles.contactAvatar} />
          <p className={styles.eyebrow}>Your idea doesn&apos;t have to be fully formed</p><h2 id="contact-title">Let&apos;s make sense<br />of it <span>together.</span></h2>
          <p>Tell me what you&apos;re thinking about, what&apos;s not working, or what you&apos;d love to build. That&apos;s enough to start a conversation.</p>
          <a href={conversationUrl()} target="_blank" rel="noopener noreferrer" className={styles.button}>Say hello on WhatsApp <span aria-hidden="true">↗</span></a>
          <span className={styles.contactAside}>You bring the idea. We&apos;ll find the next step.</span>
        </div>
      </section>
    </div>
  );
}
