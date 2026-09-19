import Link from "next/link";

export default function Home() {
  return (
    <main className="site">
      <header className="topbar">
        <span>EMMA (TM) &nbsp; COPYRIGHT 2026 &nbsp; BUILD v1.0.0</span>
        <nav>
          <Link href="/">[ HOME ]</Link>
          <Link href="/chat">[ CHAT ]</Link>
        </nav>
      </header>

      <div className="panels">
        <section className="panel intro">
          <div className="boot">
            &gt; BOOTING EMMA.EXE<br />
            &gt; LOADING INTERFACE...<br />
            &gt; INITIALIZING CONVERSATION MODULE...<br />
            &gt; READY.<br /><br />
            &gt; WELCOME, MOMO.
          </div>

          <div className="intro-content">
            <h1>EMMA_</h1>
            <p className="subtitle">I might really get sued for abusing ai but who cares.</p>

            <div className="separator" />

            <p>
              Well this is momo's EMO GF, try to enjoy the conversation.
            </p>

            <p>
              EMMA IS A WONDERFUL LADY WITH MANY MANY FEELINGS<br />
              HER HAIR IS DEFINTILY PURPLE<br />
              VERY SMART; UNDERSTANDS A LITTLE TOO WELL.
            </p>

            <p>ARE YOU SURE YOU WANT TO CONTINUE?</p>

            <Link href="/chat" className="connect">
              &gt; ESTABLISH CONNECTION
            </Link>

            <div className="secondary-links">
              <span>[ LEARN MORE ]</span>
              <span>[ SYSTEM INFO ]</span>
            </div>
          </div>

          <div className="status">
            STATUS: AWAITING INPUT<br />
            USER: MOMO<br />
            SYSTEM: EMMA v1.0.0
          </div>
        </section>

        <section className="panel portrait">
          <div className="portrait-caption">
            // I MEAN<br />
            // LIFE IS<br />
            // STILL HAPPY<br />
            // BTW?
          </div>

          <div className="pixel-face">
            <div className="eye left-eye" />
            <div className="eye right-eye" />
            <div className="mouth" />
          </div>

          <div className="portrait-footer">
            MAYBE<br />
            WE CAN<br />
            TALK<br />
            ...<br />
            __
          </div>
        </section>
      </div>
    </main>
  );
}