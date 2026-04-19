import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";

function QA({ question, children }: { question: React.ReactNode; children: React.ReactNode }) {
  return (
    <Box sx={{ marginBottom: "2rem" }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
        {question}
      </Typography>
      <Typography variant="body1" component="div" sx={{ lineHeight: 1.8 }}>
        {children}
      </Typography>
    </Box>
  );
}

export default function AboutPage() {
  const isSmall = useMediaQuery("(max-width:500px)");

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Box sx={{ backgroundColor: "#00feff" }}>
        <Container maxWidth="lg" sx={{ padding: isSmall ? "1.5rem" : "2rem" }}>
          <Typography variant={isSmall ? "h5" : "h4"} fontWeight="bold" color="#000" sx={{ textAlign: "center" }}>
            About Money Cannon
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ padding: isSmall ? "1.5rem" : "2rem" }}>
        <QA question="What am I looking at here?">
          Money Cannon is a live-ish updating scoreboard of <a href="https://www.edsbscharitybowl.com" target="_blank" style={{ color: "#1a73e8" }}>EDSBS Charity Bowl</a> (or #CharitibundiBowl) donations by team.
        </QA>

        <Divider sx={{ borderColor: "#00feff", borderWidth: 1.5, marginBottom: "2rem" }} />

        <QA question={'"Live-ish"?'}>
          Online donations via GiveSmart take about 20 minutes to be reflected in the Money Cannon totals. Corporate matching gifts, paper checks, and other donations that aren't entered via the GiveSmart portal have to be added manually, which can sometimes take us a couple days depending on volume/speed of donations.
        </QA>

        <Divider sx={{ borderColor: "#00feff", borderWidth: 1.5, marginBottom: "2rem" }} />

        <QA question="Sounds like my rivals could have more dry powder (money powder) than I'm seeing on the scoreboard!">
          You are very wise! Better donate a little more, just in case.
        </QA>

        <Divider sx={{ borderColor: "#00feff", borderWidth: 1.5, marginBottom: "2rem" }} />

        <QA question="How do I navigate Money Cannon?">
          <>
            <p>
              The default view is the complete leaderboard, with all 152 eligible teams for the 2026 #CharitibundiBowl. You can also view the standings by conference on the <strong>Conferences</strong> tab, and use the <strong>Rivalries</strong> tab to investigate the status of such long-standing feuds as the Iron Bowl, the World's Largest Outdoor Cocktail Party, and Texas vs. Texas A&amp;M (just kidding; we know they're not rivals).
            </p>
            <p>
              Teams are listed by the names shown{" "}
              <a href="/teams.html" style={{ color: "#1a73e8" }}>here</a>
              , which also correspond to the drop-down menu options on GiveSmart. You can also find your team via search bar on the <strong>Leaderboard</strong>, <strong>Conferences</strong> and <strong>Rivalries</strong> tabs.
            </p>
          </>
        </QA>

        <Divider sx={{ borderColor: "#00feff", borderWidth: 1.5, marginBottom: "2rem" }} />

        <QA question="What if my incredibly specific grudge-match rivalry is not listed? Concierge Spencer assigned me to Louisiana Tech and I want to ensure we are crushing Louisiana Monroe.">
          We got you, cher. Click on over to the <strong>Head-to-Head</strong> tab. Type the team name into the search bar, then click to add that team to your custom leaderboard. To remove, mouse over the team name and click the red trash can on the right. (On mobile, click on the team name, then click the trash can.)
        </QA>

        <Divider sx={{ borderColor: "#00feff", borderWidth: 1.5, marginBottom: "2rem" }} />

        <QA question="How can I share the good news of my team's moral and physical superiority over our lesser rivals?">
          After creating a set of teams on the <strong>Head-to-Head</strong> tab, click the <strong>"Share This Score"</strong> button at the bottom of the page to copy a link that will go directly to your bespoke rivalry view. This url is specific to that set of teams, and will continue to work throughout the bowl as the donation totals change. If you want to add or drop teams from your custom rivalry, you'll need to generate a new link.
        </QA>

        <Divider sx={{ borderColor: "#00feff", borderWidth: 1.5, marginBottom: "2rem" }} />

        <QA question="This is incredible!">
          Yes, yes it is. We're really something.
        </QA>

        <Divider sx={{ borderColor: "#00feff", borderWidth: 1.5, marginBottom: "2rem" }} />

        <QA question={<>What if, once I've created my perfect custom leaderboard, I discover my team is <em>losing</em>?</>}>
          Hit that donate button, make a contribution, wait about 20 minutes, then reload to see the impact your gift is having on the race. (And as always, feel free to spend your idle time while waiting for your donation to percolate through our system to brag online about your generosity of spirit.)
        </QA>

        <Divider sx={{ borderColor: "#00feff", borderWidth: 1.5, marginBottom: "2rem" }} />

        <QA question="I have a question not addressed here!">
          You can get answers to questions you can't find here, or flag any issues you run into, at our dedicated donor help desk, manned by local Atlanta hero JacketDan. You can reach him{" "}
          <a href="https://bsky.app/profile/jacketdan.bsky.social" target="_blank" style={{ color: "#1a73e8" }}>on Bluesky</a>
          {" "}or by emailing{" "}
          <a href="mailto:dannewampathway@gmail.com" style={{ color: "#1a73e8" }}>dannewampathway@gmail.com</a>.
        </QA>
      </Container>
    </Box>
  );
}
