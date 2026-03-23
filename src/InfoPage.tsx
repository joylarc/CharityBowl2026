import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

function Section({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ width: "100%", padding: "2rem 0" }}>
      {children}
    </Box>
  );
}

export default function InfoPage() {
  const isSmall = useMediaQuery("(max-width:500px)");

  return (
    <Box sx={{ backgroundColor: "#00ffff", minHeight: "100vh" }}>
      <Container maxWidth="md" sx={{ padding: isSmall ? "2rem 1.5rem" : "3rem 2rem" }}>

        {/* Hero */}
        <Section>
          <Typography
            variant={isSmall ? "h6" : "h5"}
            fontWeight="bold"
            color="#000"
            sx={{ textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", mb: 2 }}
          >
            Prove yourself better than your rival in the name of charity
          </Typography>
          <Typography
            variant={isSmall ? "h4" : "h3"}
            fontWeight="bold"
            color="#000"
            sx={{ textAlign: "center" }}
          >
            EDSBS Charity Bowl
          </Typography>
          <Typography
            variant={isSmall ? "h5" : "h4"}
            fontWeight="bold"
            color="#000"
            sx={{ textAlign: "center" }}
          >
            April 20 &ndash; 26, 2026
          </Typography>
        </Section>

        <Divider sx={{ borderColor: "rgba(0,0,0,0.2)" }} />

        {/* Benefiting New American Pathways */}
        <Section>
          <Typography variant={isSmall ? "h5" : "h4"} fontWeight="bold" color="#000" gutterBottom>
            Benefiting New American Pathways
          </Typography>
          <Typography variant="body1" color="#000" sx={{ fontSize: isSmall ? "1rem" : "1.1rem" }}>
            Give to New American Pathways in the name of your favorite college football team to help
            win the bowl &mdash; and bragging rights as the most generous team in the nation.
          </Typography>
        </Section>

        <Divider sx={{ borderColor: "rgba(0,0,0,0.2)" }} />

        {/* The game is the same */}
        <Section>
          <Typography variant="body1" color="#000" sx={{ fontSize: isSmall ? "1rem" : "1.1rem" }}>
            The game is the same as it's always been: Make a donation in the name of your school or
            team. That donation should take the form of the score of a victory by your morally and
            physically superior team over a depraved, uncharitable and weaker rival.
          </Typography>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="#000"
            sx={{ marginTop: "1.5rem", textAlign: "center" }}
          >
            <a href="http://edsbscharitybowl.com" target="_blank" style={{ color: "#000" }}>
              FAQ
            </a>
          </Typography>
        </Section>

        <Divider sx={{ borderColor: "rgba(0,0,0,0.2)" }} />

        {/* Crippling Blow */}
        <Section>
          <Typography variant={isSmall ? "h5" : "h4"} fontWeight="bold" color="#000" gutterBottom>
            Crippling Blow to Refugee Resettlement
          </Typography>
          <Typography variant="body1" color="#000" sx={{ fontSize: isSmall ? "1rem" : "1.1rem", mb: 2 }}>
            On February 27, the State Department terminated its 40+ year contract with Church World
            Service, New American Pathways' national refugee resettlement affiliate. This took place
            despite a nationwide injunction that blocked the administration's suspension of the U.S.
            Refugee Admissions Program on January 22 and withholding of funds for those services.
            This action led to:
          </Typography>
          <Box component="ul" sx={{ color: "#000", fontSize: isSmall ? "1rem" : "1.1rem", pl: 3, mb: 2 }}>
            <li>
              The indefinite suspension of the U.S. refugee resettlement program, leaving thousands
              of refugees, including unaccompanied minors, without a pathway to safety.
            </li>
            <li>
              The cancellation of flights for hundreds of refugees who had been approved for
              resettlement in late January and early February and
            </li>
            <li>
              The freezing of funding for essential services — including rent, utilities, and food
              assistance — for refugees who arrived in January.
            </li>
          </Box>
          <Typography variant="body1" color="#000" sx={{ fontSize: isSmall ? "1rem" : "1.1rem", mb: 2 }}>
            New American Pathways has not welcomed any new refugee arrivals since January 22. Since
            the funding freeze, we have raised 90% of the $726,000 in federal monies withheld to
            provide welcoming services to refugees who arrived prior to January 22. We anticipate
            further cuts to Department of Health and Human Services and Department of Education
            programs, and are projecting losses of $5 million in federal and state pass-through
            funding next year.
          </Typography>
          <Typography variant="body1" color="#000" sx={{ fontSize: isSmall ? "1rem" : "1.1rem", mb: 2 }}>
            Despite these setbacks, we remain committed to supporting the thousands of new Americans
            already living in our communities. Looking ahead, we will preserve critical programs and
            services focused on Health &amp; Safety, Financial Stability &amp; Self-Sufficiency,
            Immigration &amp; Advocacy, and Support for Children, Parents &amp; Schools.
          </Typography>
          <Typography variant="body1" color="#000" sx={{ fontSize: isSmall ? "1rem" : "1.1rem", mb: 2 }}>
            During the first Trump administration, more than 125 refugee resettlement agencies closed
            their doors. Since late January, our Atlanta refugee-serving colleague agencies have
            collectively terminated over 65 full-time staff. To date, New American Pathways has not
            laid off any staff and does not anticipate doing so.
          </Typography>
          <Typography variant="body1" color="#000" sx={{ fontSize: isSmall ? "1rem" : "1.1rem", mb: 2 }}>
            As we celebrate our tenth anniversary, we reflect on a decade filled with courage,
            resilience, and resourcefulness. We have navigated a global pandemic, resettled evacuees
            from Afghanistan, Ukraine and other volatile regions worldwide, and adapted to monumental
            shifts in public policy. Through it all, we have remained dedicated to our mission of
            helping refugees and Georgia thrive.
          </Typography>
          <Typography variant="body1" color="#000" sx={{ fontSize: isSmall ? "1rem" : "1.1rem" }}>
            The unrivaled and ungrudging support of our EDSBS Charity Bowl family continues to be
            instrumental in empowering New American Pathways to remain robust, adaptable and
            effective in meeting the needs of new Americans, thrive in the face of unprecedented and
            harmful actions that affect refugee and immigrant communities, and operate seamlessly in
            an evolving, challenging and uncertain environment.
          </Typography>
        </Section>

        <Divider sx={{ borderColor: "rgba(0,0,0,0.2)" }} />

        {/* It begins with spite */}
        <Section>
          <Typography
            variant={isSmall ? "h5" : "h4"}
            fontWeight="bold"
            color="#000"
            sx={{ textAlign: "center" }}
            gutterBottom
          >
            It begins with spite and ends with hugs (and spite).
          </Typography>
          <Typography
            variant={isSmall ? "h4" : "h3"}
            fontWeight="bold"
            color="#000"
            sx={{ textAlign: "center" }}
          >
            Raised in 2025: $1,357,921
          </Typography>
        </Section>

      </Container>
    </Box>
  );
}
