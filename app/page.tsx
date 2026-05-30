import LangSwitcher from "./components/LangSwitcher";

export default function Home() {
  return (
    <div className="page">

      {/* Nav */}
      <nav>
        <a href="#" className="nav-logo" data-i18n="nav.logo">
          Capoeira International
        </a>
        <div className="nav-end">
          <a href="/smiq" className="nav-cta" data-i18n="nav.cta">Join the Effort</a>
          <LangSwitcher />
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-center">
          <div className="hero-eyebrow" data-i18n="hero.eyebrow">Capoeira International</div>
          <h1>
            <span data-i18n="hero.h1_line1">Building</span><br />
            <em data-i18n="hero.h1_line2">Our Future</em><br />
            <span data-i18n="hero.h1_line3">Together</span>
          </h1>
          <p className="hero-sub" data-i18n="hero.body1">
            We are a community of practitioners, teachers and students from across
            the globe who believe that Capoeira is the most magnificent sport on
            Earth, a powerful vehicle for profound transformation and an
            incomparable force for good. Whether you are just starting your
            Capoeira journey, leading others as they start theirs, or once belonged
            but walked away, there is a place for you here.
          </p>
          <p className="hero-sub" data-i18n="hero.body2">
            If you want to be a part of shaping the future of this art form, we
            welcome you.
          </p>
          <a href="/smiq" className="hero-cta">
            <span data-i18n="hero.cta">Join the Effort</span>
            <span className="arrow">→</span>
          </a>
          <p className="hero-note" data-i18n="hero.note">Takes 2 minutes · No spam, ever</p>
        </div>
        <div className="scroll-hint" data-i18n="hero.scroll">Scroll</div>
      </section>

      <div className="divider" />

      {/* Who We Are */}
      <section className="section">
        <span className="section-eyebrow" data-i18n="who_we_are.eyebrow">Who We Are</span>
        <h2 data-i18n-html="who_we_are.h2">
          A community built by capoeiristas,{" "}
          <em>for capoeiristas.</em>
        </h2>
        <p data-i18n="who_we_are.body1">
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
          <span data-i18n="who_we_are.body2_plain">
            Unlike traditional online communities focused on content consumption,
            the Capoeira International Community is structured as a founder&apos;s
            collective — members are not subscribers receiving value, they are
            co-creators producing it. We are not affiliated with any single group,
            lineage or style.
          </span>
          {" "}
          <strong data-i18n="who_we_are.body2_strong">We belong to and work for the whole of Capoeira</strong>
          {" "}
          <span data-i18n="who_we_are.body2_tail">— Angola, Regional, and everything in between.</span>
        </p>

        <div className="pillars">
          <div className="pillar">
            <span className="pillar-icon">🌍</span>
            <span className="pillar-title" data-i18n="pillars.global_reach_title">Global Reach</span>
            <p className="pillar-text" data-i18n="pillars.global_reach_text">
              From São Paulo to Stockholm, Cape Town to Seoul — Capoeira is
              everywhere and so are we.
            </p>
          </div>
          <div className="pillar">
            <span className="pillar-icon">🤝</span>
            <span className="pillar-title" data-i18n="pillars.no_agenda_title">No Agenda</span>
            <p className="pillar-text" data-i18n="pillars.no_agenda_text">
              We are not selling you a course. We are listening first, and
              building second.
            </p>
          </div>
          <div className="pillar">
            <span className="pillar-icon">🥋</span>
            <span className="pillar-title" data-i18n="pillars.all_levels_title">All Levels</span>
            <p className="pillar-text" data-i18n="pillars.all_levels_text">
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
          <span className="section-eyebrow" data-i18n="who_this_is_for.eyebrow">Who This Is For</span>
          <h2 data-i18n-html="who_this_is_for.h2">
            Wherever you are in your journey —{" "}
            <em>you belong here.</em>
          </h2>
          <p className="lead" data-i18n="who_this_is_for.body1">
            This is a single-question survey designed to identify the most
            pressing challenges our community faces today, from the individual
            perspectives of those who directly experience them every day. It is
            open to every person who practices Capoeira today or has ever
            practiced it in the past and wants to contribute to finding the
            solutions to the obstacles that have historically held us back.
          </p>
          <p className="lead" data-i18n="who_this_is_for.body2">To participate, pick the path that fits you most.</p>

          <div className="seg-list">
            <div className="seg-item">
              <span className="icon">🌱</span>
              <span className="name" data-i18n="landing_segments.newbie_name">The Newbie</span>
              <span className="desc" data-i18n="landing_segments.newbie_desc">Exploring Capoeira for the first time</span>
            </div>
            <div className="seg-item">
              <span className="icon">🎵</span>
              <span className="name" data-i18n="landing_segments.student_name">The Student</span>
              <span className="desc" data-i18n="landing_segments.student_desc">Training consistently and growing</span>
            </div>
            <div className="seg-item">
              <span className="icon">🌀</span>
              <span className="name" data-i18n="landing_segments.pro_name">The Pro</span>
              <span className="desc" data-i18n="landing_segments.pro_desc">Years of training, deepening the art</span>
            </div>
            <div className="seg-item">
              <span className="icon">🪘</span>
              <span className="name" data-i18n="landing_segments.expert_name">The Expert</span>
              <span className="desc" data-i18n="landing_segments.expert_desc">Instructors, mestres, and school leaders</span>
            </div>
            <div className="seg-item">
              <span className="icon">🌙</span>
              <span className="name" data-i18n="landing_segments.left_name">The One Who Left</span>
              <span className="desc" data-i18n="landing_segments.left_desc">Trained once and stepped away</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why We're Asking */}
      <section className="why-section">
        <span
          className="section-eyebrow"
          data-i18n="why_asking.eyebrow"
          style={{ display: "block", textAlign: "center", marginBottom: "20px" }}
        >
          Why We&apos;re Asking
        </span>
        <h2 data-i18n-html="why_asking.h2">
          Your answer shapes what <em>comes next.</em>
        </h2>
        <p data-i18n="why_asking.body1">
          This is not a survey for the sake of data. Every response is read
          personally. The patterns we find will directly inform what Capoeira
          International builds.
        </p>
        <p>
          <strong data-i18n="why_asking.body2_strong">We ask one question.</strong>
          {" "}
          <span data-i18n="why_asking.body2_rest">What is your single biggest
          challenge or frustration right now? That&apos;s it. No long forms, no
          trick questions.</span>
        </p>

        <ul className="promise-list">
          <li data-i18n="why_asking.promise1">We will never sell or share your information</li>
          <li data-i18n="why_asking.promise2">This takes under two minutes</li>
          <li data-i18n="why_asking.promise3">Every voice — beginner to mestre — carries equal weight</li>
        </ul>
      </section>

      <div className="divider" />

      {/* Final CTA */}
      <section className="final-cta">
        <h2>
          <span data-i18n="final_cta.h2_line1">Ready to speak</span><br />
          <em data-i18n="final_cta.h2_line2">your truth?</em>
        </h2>
        <p data-i18n="final_cta.body">Two minutes. One question. Your contribution to the future of Capoeira.</p>
        <a href="/smiq" className="hero-cta">
          <span data-i18n="final_cta.cta">Join the Effort</span>
          <span className="arrow">→</span>
        </a>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-logo" data-i18n="footer.logo">Capoeira International</div>
        <div className="footer-note" data-i18n="footer.tagline">
          With you. For you. Forward.
        </div>
      </footer>

    </div>
  );
}
