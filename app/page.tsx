export default function Home() {
  return (
    <div className="page">

      {/* Nav */}
      <nav>
        <a href="#" className="nav-logo">
          Capoeira International <span>Community</span>
        </a>
        <a href="/smiq" className="nav-cta">Join the Conversation</a>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-eyebrow">Capoeira International</div>
        <h1>
          One art.<br />
          <em>Many journeys.</em><br />
          One conversation.
        </h1>
        <p className="hero-sub">
          We are building something for every person who has ever stepped into a
          roda — beginner, mestre, or someone who once trained and walked away.
          But first, we need to hear from you.
        </p>
        <a href="/smiq" className="hero-cta">
          Join the Conversation
          <span className="arrow">→</span>
        </a>
        <p className="hero-note">Takes 2 minutes &nbsp;·&nbsp; No spam, ever</p>
        <div className="scroll-hint">Scroll</div>
      </section>

      <div className="divider" />

      {/* Who We Are */}
      <section className="section">
        <span className="section-eyebrow">Who We Are</span>
        <h2>
          A community built by capoeiristas,{" "}
          <em>for capoeiristas.</em>
        </h2>
        <p>
          Capoeira International exists because this art deserves more than
          scattered Facebook groups and word-of-mouth. We are practitioners,
          teachers, and students from across the globe who believe
          {"Capoeira's"} future depends on how well we listen to each other.
        </p>
        <p>
          We are not affiliated with any single lineage or style.{" "}
          <strong>We belong to the whole of Capoeira</strong> — Angola,
          Regional, and everything in between. Our work is to understand where
          this community is, what it needs, and to create things that genuinely
          serve it.
        </p>

        <div className="pillars">
          <div className="pillar">
            <span className="pillar-icon">🌍</span>
            <span className="pillar-title">Global Reach</span>
            <p className="pillar-text">
              From São Paulo to Stockholm, Cape Town to Seoul — Capoeira is
              everywhere and so are we.
            </p>
          </div>
          <div className="pillar">
            <span className="pillar-icon">🤝</span>
            <span className="pillar-title">No Agenda</span>
            <p className="pillar-text">
              We are not selling you a course. We are listening first, and
              building second.
            </p>
          </div>
          <div className="pillar">
            <span className="pillar-icon">🥋</span>
            <span className="pillar-title">All Levels</span>
            <p className="pillar-text">
              Whether you trained for a week or thirty years, your perspective
              belongs in this conversation.
            </p>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Who This Is For */}
      <section className="segments-section">
        <div className="segments-inner">
          <span className="section-eyebrow">Who This Is For</span>
          <h2>
            Wherever you are in your journey —{" "}
            <em>you belong here.</em>
          </h2>
          <p className="lead">
            This conversation is open to every person who has ever had Capoeira
            in their life. Pick the path that fits you most.
          </p>

          <div className="seg-list">
            <div className="seg-item">
              <span className="icon">🌱</span>
              <span className="name">The Curious One</span>
              <span className="desc">Exploring Capoeira for the first time</span>
            </div>
            <div className="seg-item">
              <span className="icon">🎵</span>
              <span className="name">The Student</span>
              <span className="desc">Training consistently and growing</span>
            </div>
            <div className="seg-item">
              <span className="icon">🌀</span>
              <span className="name">The Practitioner</span>
              <span className="desc">Years of training, deepening the art</span>
            </div>
            <div className="seg-item">
              <span className="icon">🪘</span>
              <span className="name">The Teacher</span>
              <span className="desc">Instructors, mestres, and school leaders</span>
            </div>
            <div className="seg-item">
              <span className="icon">🌙</span>
              <span className="name">The One Who Left</span>
              <span className="desc">Trained once and stepped away</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why We're Asking */}
      <section className="why-section">
        <span
          className="section-eyebrow"
          style={{ display: "block", textAlign: "center", marginBottom: "20px" }}
        >
          Why We&apos;re Asking
        </span>
        <h2>
          Your answer shapes what <em>comes next.</em>
        </h2>
        <p>
          This is not a survey for the sake of data. Every response is read
          personally. The patterns we find will directly inform what Capoeira
          International builds — the resources, the conversations, the events,
          the community.
        </p>
        <p>
          <strong>We ask one question.</strong> What is your single biggest
          challenge or frustration right now? {"That's"} it. No long forms, no
          trick questions.
        </p>

        <ul className="promise-list">
          <li>Your answer is read by a human, not just processed by an algorithm</li>
          <li>We will never sell or share your information</li>
          <li>This takes under two minutes</li>
          <li>Every voice — beginner to mestre — carries equal weight here</li>
        </ul>
      </section>

      <div className="divider" />

      {/* Final CTA */}
      <section className="final-cta">
        <h2>
          Ready to share<br />
          <em>your story?</em>
        </h2>
        <p>Two minutes. One question. Your voice in the future of Capoeira.</p>
        <a href="/smiq" className="hero-cta">
          Join the Conversation
          <span className="arrow">→</span>
        </a>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-logo">Capoeira International</div>
        <div className="footer-note">
          Listening to the community &nbsp;·&nbsp; Built with care
        </div>
      </footer>

    </div>
  );
}
