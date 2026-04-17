import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

const link = { color: "#1a73e8" };

function Section({ id, emoji, title, children }: { id: string; emoji?: string; title: React.ReactNode; children: React.ReactNode }) {
  return (
    <Box id={id} sx={{ marginBottom: "2.5rem", scrollMarginTop: "1rem" }}>
      <Typography variant="body1" component="div" sx={{ lineHeight: 1.8 }}>
        <span style={{ fontWeight: "bold" }}>
          {emoji && <>{emoji} </>}{title}
        </span>
        {" "}{children}
      </Typography>
    </Box>
  );
}

function SectionHeader({ title, id }: { title: string; id?: string }) {
  return (
    <Typography id={id} variant="h5" sx={{ fontWeight: "bold", marginTop: "3rem", marginBottom: "1.5rem", borderBottom: "3px solid #00feff", paddingBottom: "0.5rem", scrollMarginTop: "1rem" }}>
      {title}
    </Typography>
  );
}

function TOCLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li style={{ marginBottom: "0.25rem" }}>
      <a href={href} style={{ ...link, fontWeight: "bold" }}>{children}</a>
    </li>
  );
}

export default function FaqPage() {
  const isSmall = useMediaQuery("(max-width:600px)");

  React.useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      // Delay to let page render before scrolling
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
      }, 100);
    }
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      {/* Header */}
      <Box sx={{ backgroundColor: "#00feff", textAlign: "center", padding: isSmall ? "1.5rem" : "2rem" }}>
        <a href="https://www.edsbscharitybowl.com">
          <img
            src={import.meta.env.BASE_URL + "logo.png"}
            alt="Charity Bowl 2026"
            style={{ maxWidth: isSmall ? "200px" : "300px", height: "auto" }}
          />
        </a>
      </Box>
      <Box sx={{ textAlign: "center", padding: isSmall ? "1rem" : "1.5rem" }}>
        <Typography variant={isSmall ? "h5" : "h4"} fontWeight="bold" color="#000">
          2026 EDSBS CHARITY BOWL
        </Typography>
        <Typography variant="subtitle1" color="#000">
          BENEFITING NEW AMERICAN PATHWAYS
        </Typography>
        <Typography variant="h6" fontWeight="bold" color="#000" sx={{ marginTop: "1rem" }}>
          GAME GUIDE & FAQ
        </Typography>
      </Box>

      <Container maxWidth="md" sx={{ padding: isSmall ? "1.5rem" : "2rem", color: "#222" }}>

        {/* TABLE OF CONTENTS */}
        <Box sx={{ marginBottom: "2rem" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}>GAME GUIDE</Typography>
          <ul style={{ listStyle: "none", paddingLeft: "0.5rem" }}>
            <TOCLink href="#what-am-i-looking-at">What am I looking at here?</TOCLink>
            <TOCLink href="#whats-edsbs">What's EDSBS?</TOCLink>
            <TOCLink href="#why-new-ap">Why New American Pathways?</TOCLink>
            <TOCLink href="#keys-to-the-game">Keys to the game</TOCLink>
            <TOCLink href="#how-to-play">How to play</TOCLink>
          </ul>

          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5rem", marginTop: "1rem" }}>FREQUENTLY ASKED QUESTIONS</Typography>
          <ul style={{ listStyle: "none", paddingLeft: "0.5rem" }}>
            <TOCLink href="#where-is-link">Where is the link to donate?</TOCLink>
            <TOCLink href="#donate-more-than-once">Can I donate more than once?</TOCLink>
            <TOCLink href="#donate-mobile">How do I donate via mobile?</TOCLink>
            <TOCLink href="#donated-early">I donated early. Can you go find it and add it to this year's board?</TOCLink>
            <TOCLink href="#money-cannon">How does Money Cannon work?</TOCLink>
            <TOCLink href="#new-format">Why is there a new game format this year?</TOCLink>
            <TOCLink href="#charitibundibowl">What is #CharitibundiBowl?</TOCLink>
            <TOCLink href="#what-does-new-ap-do">What does New American Pathways do?</TOCLink>
            <TOCLink href="#whats-a-refugee">What's a refugee?</TOCLink>
            <TOCLink href="#where-from">Where do New AP refugees come from?</TOCLink>
            <TOCLink href="#executive-orders">What's happening with New AP and refugees in the wake of recent executive orders?</TOCLink>
            <TOCLink href="#matching-gifts">Do you accept corporate matching gifts?</TOCLink>
            <TOCLink href="#donate-another-way">I'm trying to donate another way. Help?</TOCLink>
            <TOCLink href="#last-year-total">How much money did we raise last year?</TOCLink>
            <TOCLink href="#who-won">Who won last year's Bowl?</TOCLink>
            <TOCLink href="#should-i-bother">I can't afford to make a big donation, and/or my school is never going to catch Michigan. Should I even bother competing?</TOCLink>
            <TOCLink href="#michigan-winning">So how does Michigan keep winning?</TOCLink>
            <TOCLink href="#own-contest">Can I run my own Charity Bowl contest just for my school/office/etc.?</TOCLink>
          </ul>

          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5rem", marginTop: "1rem" }}>TROUBLESHOOTING</Typography>
          <ul style={{ listStyle: "none", paddingLeft: "0.5rem" }}>
            <TOCLink href="#no-team">I DON'T SEE MY TEAM IN THE DROPDOWN!</TOCLink>
            <TOCLink href="#not-updating">I just donated but GiveSmart and/or Money Cannon isn't updating.</TOCLink>
            <TOCLink href="#another-question">I've got another question or issue I can't resolve after carefully reading this document!</TOCLink>
          </ul>

          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5rem", marginTop: "1rem" }}>KNOWN ISSUES</Typography>
          <ul style={{ listStyle: "none", paddingLeft: "0.5rem" }}>
            <TOCLink href="#recurring-gifts">RECURRING GIFTS DO NOT ROLL OVER</TOCLink>
            <TOCLink href="#paypal">PAYPAL IS NOT OUR FRIEND</TOCLink>
          </ul>
        </Box>

        <Box sx={{ marginBottom: "3rem" }} />

        {/* INTRODUCTIONS */}
        <SectionHeader title="INTRODUCTIONS" />

        <Section id="what-am-i-looking-at" emoji="❓" title={<strong>What am I looking at here?</strong>}>
          The <a href="https://www.edsbscharitybowl.com" target="_blank" style={link}>Charity Bowl</a> (known online as the #CharitibundiBowl) is an annual fundraising contest staged by the EDSBS extended universe in aid of <a href="https://newamericanpathways.org/" target="_blank" style={link}>New American Pathways</a>, a full-service refugee resettlement nonprofit based in Atlanta. This year marks the 20th (TWENTIETH) edition of the Charity Bowl, in which teams of rival football fans compete to see who can bring in the most money to aid our most vulnerable neighbors.
          <Box sx={{ backgroundColor: "#f5f5f5", padding: "1rem", borderLeft: "3px solid #00feff", marginTop: "1rem" }}>
            <strong>NOTE: If you've competed in the Bowl before, you might want to read on anyway; we're celebrating the 20th edition with a brand-new leaderboard system. More about that shortly!</strong>
          </Box>
        </Section>

        <Section id="whats-edsbs" emoji="❓" title={<strong>What's EDSBS?</strong>}>
          A college football website founded in 2005 by Spencer Hall, where the brains behind Channel 6 were incubated.
        </Section>

        <Section id="why-new-ap" emoji="❓" title={<strong>Why New American Pathways?</strong>}>
          A couple career changes and several mergers ago, young Spencer Hall worked at one of New AP's predecessor orgs. You can read more about that time, and what still moves us to work with these communities today, <a href="https://channel-6.ghost.io/how-we-got-here/" target="_blank" style={link}>right here</a>.
        </Section>

        <Box sx={{ marginBottom: "3rem" }} />

        {/* KEYS TO THE GAME */}
        <SectionHeader title="KEYS TO THE GAME [FOOTBALL TERM]" id="keys-to-the-game" />

        <Typography variant="body1" sx={{ lineHeight: 1.8, marginBottom: "1rem" }}>
          🔑 <strong>The 2026 EDSBS Charity Bowl will kick off (football term) on Monday morning, April 20, at 10 a.m. ET,</strong> with regular updates to follow on the New American Pathways <a href="https://bsky.app/profile/newap-georgia.bsky.social" target="_blank" style={link}>Bluesky feed</a> and <a href="https://www.instagram.com/newamericanpathways/" target="_blank" style={link}>Instagram grid</a>. The game officially concludes on Friday evening, April 24 (although we have been known to extend the contest into the weekend in pursuit of stretch goals).
        </Typography>

        <Typography variant="body1" sx={{ lineHeight: 1.8, marginBottom: "1rem" }}>
          🔑 <strong>The <a href="https://bsky.app/profile/newap-georgia.bsky.social" target="_blank" style={link}>New AP Bluesky feed</a> will have the most up-to-date information during Bowl week</strong> regarding official stop/start times and scores. Our team of volunteers will be camped out there for a minimum of 12 hours each day to deliver scoring updates and celebrate especially creative donations and dedications from coast to coast.
        </Typography>

        <Typography variant="body1" sx={{ lineHeight: 1.8, marginBottom: "1rem" }}>
          🔑 <strong>Money Cannon is back!</strong> Thanks to some incredibly generous friends of the program, last year we launched <a href="https://www.moneycannon.org" target="_blank" style={link}>MoneyCannon.org</a>, where you can view the latest Charitibundi Bowl scoring updates, see where your team ranks in conference standings, and even create your own custom leaderboards to track. You can read more about how Money Cannon works <a href="https://www.moneycannon.org/about.html" target="_blank" style={link}>here</a>.
        </Typography>

        <Typography variant="body1" sx={{ lineHeight: 1.8, marginBottom: "1rem" }}>
          🔑 <strong>The Bowl Help Desk is back!</strong> You can get answers to questions you can't find here, or flag any issues you run into, at our dedicated donor help desk, manned by local Atlanta hero JacketDan. You can reach him <a href="https://bsky.app/profile/jacketdan.bsky.social" target="_blank" style={link}>on Bluesky</a> or by emailing <a href="mailto:dannewampathway@gmail.com" style={link}>dannewampathway@gmail.com</a>.
        </Typography>

        <Typography variant="body1" sx={{ lineHeight: 1.8, marginBottom: "1rem" }}>
          🔑 <strong>New this year: Concierge team assignment services!</strong> Don't have a college football team? Spencer Hall is here <em>for you</em>, neighbor. Tell him a little bit about yourself, and he'll assign you a college football rooting interest. You can reach him <a href="https://bsky.app/profile/edsbs.bsky.social" target="_blank" style={link}>on Bluesky</a> or by emailing <a href="mailto:harumphharumph@gmail.com" style={link}>harumphharumph@gmail.com</a>. That's right: Spencer cares so much about this contest that he's agreed to read his own emails. Truly, we live in unprecedented times.
        </Typography>

        <Typography variant="body1" sx={{ lineHeight: 1.8, marginBottom: "1rem" }}>
          🔑 <strong>From Monday morning on, <a href="https://www.edsbscharitybowl.com" target="_blank" style={link}>EDSBSCharityBowl.com</a> will be your home for everything else:</strong> A portal to submit your actual donations, a running grand total display of all the money we've raised so far, and links where you can learn more about New AP and their work.
        </Typography>

        <Box sx={{ marginBottom: "3rem" }} />

        {/* HOW TO PLAY */}
        <SectionHeader title="HOW TO PLAY" id="how-to-play" />

        <Box>
          <Box sx={{ marginBottom: "1.5rem" }}>
            <Typography variant="body1" sx={{ lineHeight: 1.8, marginBottom: "1rem" }}>
              ✅ Beginning <strong>Monday, April 20 at 10 a.m. ET,</strong> navigate to <a href="https://www.edsbscharitybowl.com" target="_blank" style={link}>EDSBSCharityBowl.com</a> and click the green "DONATE" button, then navigate to the dropdown menu. You will see a long list of schools that have college football teams (and a few that don't, but we'll get to that). Select the institution you want to compete under, and type in your donation amount. At the end of the week, the team with the highest donation total will be declared the winner.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, marginBottom: "1rem" }}>
              ✅ <strong>NEW GAME FORMAT FOR 2026!</strong> In honor of the 20th edition of the Charitibundi Bowl, we're returning the contest to its college football roots with a <strong>pre-set field of teams.</strong> This field will consist of all 138 schools scheduled to field FBS programs in 2026, a handful of mid-major schools with longstanding community ties to the Charity Bowl, and a few noncorporeal programs that are, strictly speaking, imaginary. You can view the full list of eligible teams <a href="/teams.html" style={link}>here</a>.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, marginBottom: "1rem" }}>
              ✅ By tradition, <strong>donations are typically made in the form of a football score or statistic</strong> that has sentimental value to the donor. You might give $70.33, for example, in memory of West Virginia's 2012 Orange Bowl romp over Clemson, or $26.28, to honor Barry Sanders' single-season rushing record.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, marginBottom: "1rem" }}>
              ✅ You'll also have the option to make this one-time gift a quarterly or monthly recurring donation, <strong>which will earn a year's worth of multiplier points for scoring purposes.</strong> Example: You're donating $100 on behalf of Vanderbilt (Diego Pavia party!). If you make that donation a $100 quarterly pledge instead, Vanderbilt will be awarded a full year's worth of donations to their team score – in this case, $400. A $100 monthly pledge will add $1,200 to your team score. <em>(Note that recurring gifts, as well as corporate matching gifts, are not going to show up on the splash page running total right away, since we have to enter those manually.)</em>
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, marginBottom: "1rem" }}>
              ✅ <strong>New this year: Tell us your story!</strong>{" "}
              You'll also see a dedication box on the donation page. We'd love to hear more about what brought you to the Bowl, and why helping refugees rebuild their lives matters to you, whether you're a former refugee yourself, have loved ones in refugee communities, or simply want to beat Texas (who doesn't?). We'll be highlighting our favorite dedication messages all week long on New AP's social channels.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              ✅ Now comes the fun part: <strong>TIME TO BRAG ABOUT YOUR GENEROSITY ONLINE.</strong> Post your donation receipt! <strong>(Don't forget to redact any identifying info!)</strong> Tag Spencer. Tag New AP. Tag your school and your school's famous alumni. Cheerfully bullying your friends and rivals into joining the game themselves is how we keep Bowl week festive and this operation growing.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ marginBottom: "3rem" }} />

        {/* FREQUENTLY ASKED QUESTIONS */}
        <SectionHeader title="FREQUENTLY ASKED QUESTIONS" />

        <Section id="where-is-link" emoji="⁉️" title={<strong>Where is the link to donate?</strong>}>
          <>
            Beginning on Monday morning, April 20, you'll see it at <a href="https://www.edsbscharitybowl.com" target="_blank" style={link}>EDSBSCharityBowl.com</a>. If you're reading this before April 20, that link is currently hidden for a reason. Here is that reason, in very large letters:
            <Box sx={{ textAlign: "center", padding: "1.5rem", backgroundColor: "#f5f5f5", borderLeft: "3px solid #c00", marginTop: "1rem", marginBottom: "1rem" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#c00" }}>
                IF YOU WANT YOUR DONATION TO COUNT TOWARDS THE 2026 CHARITY BOWL, DO NOT DONATE EARLY.
              </Typography>
            </Box>
            <p>New AP gratefully accepts donations year-round, but if you make a Charity Bowl donation before we launch this year's Bowl, your gift will be recorded in last year's database, and will not be counted towards this year's score. Links and text messaging codes from prior years are not valid for this year's Bowl scoring.</p>
          </>
        </Section>

        <Section id="donate-more-than-once" emoji="⁉️" title={<strong>Can I donate more than once?</strong>}>
          You're welcome to do so! ONCE IT'S TIME.
        </Section>

        <Section id="donate-mobile" emoji="⁉️" title={<strong>How do I donate via mobile?</strong>}>
          You can either navigate to <a href="https://www.edsbscharitybowl.com" target="_blank" style={link}>EDSBSCharityBowl.com</a> on your mobile browser, or text <strong>charitybowl26</strong> to <strong>91999</strong> – again, AFTER THE BOWL LAUNCHES ON MONDAY MORNING.
        </Section>

        <Section id="donated-early" emoji="⁉️" title={<strong>I donated early anyway. Can you go find it and add it to this year's board?</strong>}>
          No. We're very busy! Thank you for your money.
        </Section>

        <Section id="money-cannon" emoji="⁉️" title={<strong>How does Money Cannon work?</strong>}>
          Instructions on navigating our pre-set leaderboards and creating your own custom rivalries can be found <a href="https://www.moneycannon.org/about.html" target="_blank" style={link}>right here</a>.
        </Section>

        <Section id="new-format" emoji="⁉️" title={<strong>Why is there a new game format this year?</strong>}>
          <>
            Many reasons! Among them:
            <ul>
              <li>Marking the 20th edition of the Bowl by honoring the reason this community came to be (arguing about college football online)</li>
              <li>Simplifying the donation process (no more dreaded write-in box)</li>
              <li>Streamlining operations for the team operating the Bowl (this was a big one)</li>
            </ul>
          </>
        </Section>

        <Section id="charitibundibowl" emoji="⁉️" title={<strong>What is #CharitibundiBowl?</strong>}>
          The official contest hashtag. We've been doing this a while, and conversations around charitable giving have evolved in that time. So a few years back, we co-opted <a href="https://espnevents.com/press/event/boca-raton-bowl-announces-cheribundi-tart-cherry-new-title-sponsor/" target="_blank" style={link}>this fabulous, short-lived Boca Raton Bowl name</a> for our own purposes. Most people still call it the Charity Bowl. You are all welcome to fight about that amongst yourselves.
        </Section>

        <Section id="what-does-new-ap-do" emoji="⁉️" title={<strong>What does New American Pathways do?</strong>}>
          <a href="https://newamericanpathways.org/" target="_blank" style={link}>New American Pathways</a> supports refugee families resettling in America from the day they touch down at the airport until the day they take their citizenship exams. As you might imagine, this encompasses a huge range of services, from finding safe housing, getting children enrolled in school and adults in job training, to language classes, legal aid, and after-school programs. You can read their latest <a href="/2025impactreport.pdf" target="_blank" style={link}>annual impact report</a>, and check out their <a href="https://www.facebook.com/NewAmericanPathways" target="_blank" style={link}>Facebook</a> and <a href="https://www.instagram.com/newamericanpathways/" target="_blank" style={link}>Instagram</a> pages to learn how their work shapes communities in and around Atlanta.
        </Section>

        <Section id="whats-a-refugee" emoji="⁉️" title={<strong>What's a refugee?</strong>}>
          A refugee has been forced to flee their home country because of war, violence, or a well-founded fear of persecution for reasons of race, religion, nationality, political opinion, or membership in a particular social group. Refugee status in the United States means that a refugee has applied for resettlement abroad and has been granted the opportunity to resettle here. Applicants undergo a lengthy 13-step screening process conducted by the U.S Department of State and U.S. Department of Homeland Security.
        </Section>

        <Section id="where-from" emoji="⁉️" title={<strong>Where do New AP refugees come from?</strong>}>
          All over! In 2024, New AP welcomed refugees from Myanmar, The Democratic Republic of the Congo, Iraq, Afghanistan, Ukraine, Somalia, South Sudan, Sudan, Syria, Eritrea, Cuba, Haiti, and Venezuela.
        </Section>

        <Section id="executive-orders" emoji="⁉️" title={<strong>What's happening with New AP and refugees in the wake of recent executive orders?</strong>}>
          <>
            We'll let them tell you:
            <Typography variant="body1" component="blockquote" sx={{ fontStyle: "italic", borderLeft: "3px solid #6ab648", paddingLeft: "1.5rem", marginLeft: 0, marginTop: "1rem", marginBottom: "1rem" }}>
              "Fiscal year 2025 was a year full of change and challenges for New American Pathways and the clients we serve. Over the course of the year, there were more than 500 executive actions issued from the current administration that negatively impacted refugee and immigrant communities. Many of those fundamentally changed the work we do, resulting in us pivoting multiple times to ensure we were responding to current needs."
            </Typography>
            <p>For more about New AP's evolving mission in 2025 and beyond, see their <a href="/2025impactreport.pdf" target="_blank" style={link}>2025 impact report</a>. New AP's <a href="https://newamericanpathways.org/" target="_blank" style={link}>website</a> will be updated with the most current information regarding refugees entering America as events warrant.</p>
          </>
        </Section>

        <Section id="matching-gifts" emoji="⁉️" title={<strong>Do you accept corporate matching gifts?</strong>}>
          We will happily take your bosses' money! All matching donations that can be verified by your employer before the end of the Bowl will be added to the leaderboard. To have your matching gift verified and scored, contact Carina Buchwald at <a href="mailto:cbuchwald@newamericanpathways.org" style={link}>cbuchwald@newamericanpathways.org</a>.
        </Section>

        <Section id="donate-another-way" emoji="⁉️" title={<strong>I'm trying to donate another way. Help?</strong>}>
          If you want to pitch in, we'll do whatever we can to make it work. If you're making a donation via a family foundation/donor advised fund/trust account, donating over $1000 and trying to avoid credit card processing fees, donating from overseas, donating via wire transfer, want to make a gift of stock or other appreciated securities, or have any other questions, please contact Carina Buchwald at <a href="mailto:cbuchwald@newamericanpathways.org" style={link}>cbuchwald@newamericanpathways.org</a> for assistance.
        </Section>

        <Section id="last-year-total" emoji="⁉️" title={<strong>How much money did we raise last year?</strong>}>
          The 2025 #CharitibundiBowl raised $1,370,251. <strong>Wow, what else has this extremely normal college football collective done?</strong> Several years ago, thanks to your rampaging generosity, we were able to establish the <a href="https://www.youtube.com/watch?v=YiBm13ATFBY&ab_channel=NewAmericanPathways" target="_blank" style={link}>EDSBS Empowerment Fund</a>. This fund covers a range of smaller needs that arise for refugees and their families outside the major programs offered by New AP. A typical use might involve paying for driving lessons so that parents can commute to their new jobs, and covering childcare during those lessons.
        </Section>

        <Section id="who-won" emoji="⁉️" title={<strong>Who won last year's Bowl?</strong>}>
          This answer gets funnier every year: For a mind-bending streak of many, many years, that school has been Michigan, and for almost as long a time, the second-place school has not come particularly close. Is this the year that narrative is finally challenged? We'll all find out together! Aren't you tired of making Spencer get Michigan-themed tattoos? Don't answer that!
        </Section>

        <Section id="should-i-bother" emoji="⁉️" title={<strong>I can't afford to make a big donation, and/or my school is never going to catch Michigan. Should I even bother competing?</strong>}>
          If there's anybody who understands this, it's a bunch of journalists and nonprofit volunteers. But! We say this every year, and it keeps on being true: The VAST majority of donations we receive every year are in the $20 range. $10 is welcome. $5 is welcome. It all helps.
        </Section>

        <Section id="michigan-winning" emoji="⁉️" title={<strong>So how does Michigan keep winning?</strong>}>
          <>
            The schools at the top of the leaderboard all tend to have one or two big-money donors bumping them up the ranks, but even at Michigan, <strong>the $20 donors outstrip everybody else by volume.</strong> The Wolverines keep winning because they have HORDES of donors. Wanna topple them this year? Do what they do: <em>Get your friends involved.</em>
            <p>We also understand that given the current state of upheaval both at home and abroad, you may not be able to make your planned contributions to the Bowl this year. If you can still share news about the Bowl with your families, coworkers, alumni clubs? That's fantastic. Again: It all helps. Every bit of it. Every one of you. We're just a loose collective of football idiots yelling into the internet. None of this is possible without y'all.</p>
          </>
        </Section>

        <Section id="own-contest" emoji="⁉️" title={<strong>Can I run my own Charity Bowl contest just for my school/office/etc.?</strong>}>
          Absolutely. Cal rocketed into the top ten in 2023 thanks entirely to a small group of alumni trying to one-up each other. As long as your donations are recorded after our official launch on April 20 (Monday morning) and before midnight ET on April 24 (Friday night), they'll be counted.
        </Section>

        <Box sx={{ marginBottom: "3rem" }} />

        {/* TROUBLESHOOTING */}
        <SectionHeader title="TROUBLESHOOTING" />

        <Section id="no-team" emoji="❌" title={<strong>I DON'T SEE MY TEAM IN THE DROPDOWN! BIAS!! HATERS!!! P E R F I D Y</strong>}>
          <>
            A reminder that for this 20th edition of the Bowl, we're working with a new game format. You'll need to select an FBS football team or a team from our list of selected mid-majors along with your donation.
            <p>If you don't see your FBS football team on the first scroll through the menu, remember to check other likely places on the list. (Look for Southern California under USC, etc.) If you still can't find your team, email Dan at our help desk at <a href="mailto:dannewampathway@gmail.com" style={link}>dannewampathway@gmail.com</a> for assistance.</p>
            <p>If you don't HAVE an FBS rooting interest, first of all: Congratulations! You will easily outlive the rest of us without an emotional attachment to an upper-division college football program. And you've got an array of available options for participation in this year's Bowl:</p>
            <ul>
              <li>Pick a team at random</li>
              <li>Pick a team close to your hometown</li>
              <li>Pick a team as far from your hometown as humanly possible</li>
              <li>Contact the reason for the season himself, Spencer Hall, <a href="https://bsky.app/profile/edsbs.bsky.social" target="_blank" style={link}>on Bluesky</a> or by emailing <a href="mailto:harumphharumph@gmail.com" style={link}>harumphharumph@gmail.com</a> and make him pick a team for you</li>
              <li>(Our favorite option) Adopt the team with the lowest current score on <a href="https://www.moneycannon.org" target="_blank" style={link}>Money Cannon</a> and bump it out of last place</li>
            </ul>
            <p>Don't think of it as abandoning Wichita State. Think of it as being folded into the surly embrace of Louisiana-Monroe. Welcome, cousin!</p>
          </>
        </Section>

        <Section id="not-updating" emoji="⁉️" title={<strong>I just donated but GiveSmart and/or Money Cannon isn't updating.</strong>}>
          <>
            Be not afraid! The thermometer on the GiveSmart page and the leaderboards on Money Cannon are nearly always going to be under-counting team totals. There's a couple reasons for this: First, y'all donate at such a rampaging pace that every once in a while we will <em>crash</em> the GiveSmart site. Second – and this accounts for most of the lag – is <strong>monthly/quarterly pledges, corporate matching donations, and offline donations that come in from overseas/wire transfers/etc. all have to be added manually</strong> by New AP staff and Bowl volunteers. Thanks in advance for your patience, and your money, and your bosses' money.
            <p>(And if that scoreboard lag time makes you nervous, well, better get some friends and family to donate too, just to be sure.)</p>
          </>
        </Section>

        <Section id="another-question" emoji="⁉️" title={<strong>I've got another question or issue I can't resolve after carefully reading this document!</strong>}>
          You can get answers to questions you can't find here, or flag any issues you run into, at our dedicated donor help desk, manned by local Atlanta hero JacketDan. You can reach him <a href="https://bsky.app/profile/jacketdan.bsky.social" target="_blank" style={link}>on Bluesky</a> or by emailing <a href="mailto:dannewampathway@gmail.com" style={link}>dannewampathway@gmail.com</a>.
        </Section>

        <Box sx={{ marginBottom: "3rem" }} />

        {/* KNOWN ISSUES */}
        <SectionHeader title="KNOWN ISSUES (BECAUSE IT WOULDN'T BE AN EDSBS EVENT WITHOUT SOME WEIRD HICCUPS)" />

        <Section id="recurring-gifts" emoji="❌" title={<strong>RECURRING GIFTS DO NOT ROLL OVER.</strong>}>
          <>
            Some of you will remember from last year that, on the donation platform New AP uses, we have no way of rolling a recurring donation over from last year's contest to the 2026 campaign. Yes, it's a pain in the ass for us too. So. What does this mean for you?
            <Box sx={{ textAlign: "center", padding: "1.5rem", backgroundColor: "#f5f5f5", borderLeft: "3px solid #c00", marginTop: "1rem", marginBottom: "1rem" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                IF YOU SET UP A 2025 RECURRING GIFT AND WANT IT SCORED FOR 2026, YOU HAVE TO CANCEL IT AND MAKE A NEW PLEDGE.
              </Typography>
            </Box>
            <p>This is tedious! We're sorry about that! Please <a href="https://docs.google.com/forms/d/e/1FAIpQLSePI1hjch6TyjY2CF-qhBLcDwZPNgDCIxDtuelmaN3GkH1m9A/viewform" target="_blank" style={link}>complete this form</a> and the team at New AP will cancel future transactions you set up for the 2025 campaign. You will receive a confirmation email from New AP once it has been completed.</p>
          </>
        </Section>

        <Section id="paypal" emoji="❌" title={<strong>PAYPAL IS NOT OUR FRIEND.</strong>}>
          We've run into a ton of problems in the past trying to get recurring gifts to process via PayPal. If you want to make a recurring (monthly or quarterly) gift, the best way to do that is via credit card. If that method doesn't work for you for any reason, please contact Carina Buchwald at <a href="mailto:cbuchwald@newamericanpathways.org" style={link}>cbuchwald@newamericanpathways.org</a> to make alternate arrangements.
        </Section>

        <Box sx={{ marginBottom: "3rem" }} />

        {/* FINAL WARNING */}
        <SectionHeader title="A FINAL WARNING" />
        <Typography variant="body1" sx={{ lineHeight: 1.8, marginBottom: "2rem" }}>
          Please ESPECIALLY be your sweet selves when interacting with New AP folks, many of whom are former refugees themselves. The Wednesday afternoon data-entry volunteer who misfiled your Texas Tech donation under Texas State may not have the latest Big 12 realignment committed to memory, but they also might be working in their fourth language, so COOL IT.
        </Typography>

        <Box sx={{ marginBottom: "3rem" }} />

        {/* THAT'S IT */}
        <SectionHeader title="THAT'S IT, THAT'S ALL" />
        <Typography variant="body1" sx={{ lineHeight: 1.8, marginBottom: "1rem" }}>
          It may take us a while to get there, but we didn't come this far by being timid: The world is on fire, but our hearts are aflame, and <strong>we're setting this year's initial goal at $1,000,000.</strong> Dazzle us, won't you?
        </Typography>

      </Container>

      {/* Footer: cyan bar with logo linked to edsbscharitybowl.com */}
      <Box sx={{ backgroundColor: "#00feff", textAlign: "center", padding: isSmall ? "1.5rem" : "2rem" }}>
        <a href="https://www.edsbscharitybowl.com">
          <img
            src={import.meta.env.BASE_URL + "logo.png"}
            alt="Charity Bowl 2026"
            style={{ maxWidth: isSmall ? "200px" : "300px", height: "auto" }}
          />
        </a>
      </Box>
    </Box>
  );
}
