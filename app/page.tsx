export default function Home() {
  return (
    <div className="page">

      {/* Nav */}
      <nav>
        <a href="#" className="nav-logo">
          Capoeira International
        </a>
        <a href="/smiq" className="nav-cta">Join the Effort</a>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-eyebrow">Capoeira International</div>
        <h1>
          Building<br />
          <em>Our Future</em><br />
          Together
        </h1>
        <p className="hero-sub">
          We are a community of practitioners, teachers and students from across
          the globe who believe that Capoeira is the most magnificent sport on
          Earth, a powerful vehicle for profound transformation and an
          incomparable force for good. Whether you are just starting your
          Capoeira journey, leading others as they start theirs, or once belonged
          but walked away, there is a place for you here.
        </p>
        <p className="hero-sub">
          If you want to be a part of shaping the future of this art form, we
          welcome you.
        </p>
        <a href="/smiq" className="hero-cta">
          Join the Effort
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
          The Capoeira International Community is a private, invite-only
          professional community designed to unite the global community of
          Capoeira students, instructors, school owners, and Mestres in a
          collaborative effort to architect the future infrastructure of the
          sport. We are building a high-signal R&amp;D engine where members
          co-fund and co-design solutions to the operational, educational, and
          professional challenges that have historically held the art form back
          from achieving its full global potential.
        </p>
        <p>
          Unlike traditional online communities focused on content consumption,
          the Capoeira International Community is structured as a founder&apos;s
          collective — members are not subscribers receiving value, they are
          co-creators producing it. We are not affiliated with any single group,
          lineage or style.{" "}
          <strong>We belong to and work for the whole of Capoeira</strong> —
          Angola, Regional, and everything in between.
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
            This is a single-question survey designed to identify the most
            pressing challenges our community faces today, from the individual
            perspectives of those who directly experience them every day. It is
            open to every person who practices Capoeira today or has ever
            practiced it in the past and wants to contribute to finding the
            solutions to the obstacles that have historically held us back.
          </p>
          <p className="lead">To participate, pick the path that fits you most.</p>

          <div className="seg-list">
            <div className="seg-item">
              <span className="icon">🌱</span>
              <span className="name">The Newbie</span>
              <span className="desc">Exploring Capoeira for the first time</span>
            </div>
            <div className="seg-item">
              <span className="icon">🎵</span>
              <span className="name">The Student</span>
              <span className="desc">Training consistently and growing</span>
            </div>
            <div className="seg-item">
              <span className="icon">🌀</span>
              <span className="name">The Pro</span>
              <span className="desc">Years of training, deepening the art</span>
            </div>
            <div className="seg-item">
              <span className="icon">🪘</span>
              <span className="name">The Expert</span>
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
          International builds.
        </p>
        <p>
          <strong>We ask one question.</strong> What is your single biggest
          challenge or frustration right now? That&apos;s it. No long forms, no
          trick questions.
        </p>

        <ul className="promise-list">
          <li>We will never sell or share your information</li>
          <li>This takes under two minutes</li>
          <li>Every voice — beginner to mestre — carries equal weight</li>
        </ul>
      </section>

      <div className="divider" />

      {/* Final CTA */}
      <section className="final-cta">
        <h2>
          Ready to speak<br />
          <em>your truth?</em>
        </h2>
        <p>Two minutes. One question. Your contribution to the future of Capoeira.</p>
        <a href="/smiq" className="hero-cta">
          Join the Effort
          <span className="arrow">→</span>
        </a>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-logo">Capoeira International</div>
        <div className="footer-note">
          With you. For you. Forward.
        </div>
      </footer>

    </div>
  );
}
