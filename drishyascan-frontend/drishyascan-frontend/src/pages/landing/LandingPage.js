import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { styled } from '@mui/system';
import logo from '../../assets/web_logo.png';

// Custom styled component for sections
const Section = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  paddingTop: theme.spacing(10), // Increased padding to account for fixed navbar
  paddingBottom: theme.spacing(8),
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  scrollMarginTop: theme.spacing(8), // Add scroll margin to account for fixed navbar
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.background.paper,
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  variant: 'h3',
  component: 'h2',
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  color: theme.palette.primary.main,
  fontWeight: 700,
  fontSize: '2.5rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
}));

const SectionContent = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  maxWidth: '800px',
  margin: '0 auto',
  color: theme.palette.text.secondary,
}));

const MainTitle = styled(Typography)(({ theme }) => ({
  fontSize: '4rem',
  fontWeight: 700,
  textAlign: 'center',
  background: 'linear-gradient(45deg, #2563EB 30%, #FFFFFF 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    fontSize: '3rem',
  },
}));

const Tagline = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 500,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.25rem',
  },
}));

const Description = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  lineHeight: 1.8,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  maxWidth: '900px',
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
}));

const FeatureTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 600,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1),
}));

const FeatureDescription = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(4),
}));

const FeatureList = styled(Box)(({ theme }) => ({
  maxWidth: '800px',
  margin: '0 auto',
  padding: theme.spacing(2),
}));

const ProductContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(4),
  marginTop: theme.spacing(4),
}));

const VideoPlaceholder = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '800px',
  aspectRatio: '16/9',
  backgroundColor: theme.palette.grey[200],
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  fontSize: '1.2rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.grey[300],
  },
}));

const TryButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
}));

const ProductDescription = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  maxWidth: '600px',
  margin: '0 auto',
  color: theme.palette.text.secondary,
  lineHeight: 1.6,
}));

const AboutContent = styled(Box)(({ theme }) => ({
  maxWidth: '1000px',
  margin: '0 auto',
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  // alignItems: 'center', // Keep content centered by default, adjust inner elements
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(4),
  marginBottom: theme.spacing(6),
  justifyContent: 'center', // Center logo and text horizontally
  width: '100%',
  flexDirection: 'column',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
  },
}));

const LogoImage = styled('img')(({ theme }) => ({
  maxWidth: '250px',
  height: 'auto',
  // Removed marginBottom here as it's handled by LogoContainer gap
  display: 'block',
}));

const CognitiveCraftsTitle = styled(Typography)(({ theme }) => ({
  fontSize: '3.5rem',
  fontWeight: 700,
  color: theme.palette.text.primary, // Adjust color as needed, maybe primary.main or white
  lineHeight: 1.2,
  [theme.breakpoints.down('sm')]: {
    fontSize: '3rem',
  },
}));

const TaglineText = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 500,
  color: theme.palette.primary.light, // Use a lighter primary color or secondary
  marginTop: theme.spacing(0.5),
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
}));

const AboutText = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  lineHeight: 1.8,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(3),
  textAlign: 'left',
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto', // Center the text blocks
}));

const AboutSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.75rem',
  fontWeight: 600,
  color: theme.palette.primary.main,
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(3),
  textAlign: 'left',
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto', // Center the subtitle
  borderBottom: `2px solid ${theme.palette.primary.main}`,
  paddingBottom: theme.spacing(1),
}));

const ContactInfo = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto', // Center the contact info box
  boxShadow: theme.shadows[2],
}));

const ContactItem = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  marginBottom: theme.spacing(2),
  color: theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  '&:last-child': {
    marginBottom: 0,
  },
}));

const ProductList = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto', // Center the product list
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(4),
}));

const ProductItem = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '&:last-child': {
    marginBottom: 0,
  },
}));

const ProductTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.3rem',
  fontWeight: 600,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
}));

const features = [
  {
    title: 'Automated Website Scanning',
    description: 'Scan entire websites or individual pages with configurable depth, batch processing, and optional scheduled scans.'
  },
  {
    title: 'WCAG 2.1 Compliance Analysis',
    description: 'Identify accessibility issues based on WCAG 2.1 AA standards. Issues are categorized by severity and linked to the relevant code and guidelines.'
  },
  {
    title: 'Detailed Reporting and Export Options',
    description: 'Generate comprehensive reports with clear descriptions and recommendations. Export reports in PDF or CSV formats for sharing or auditing.'
  },
  {
    title: 'Dashboard and Progress Tracking',
    description: 'Gain visual insight into accessibility status, recent scans, issue trends, and historical progress with real-time data visualization.'
  },
  {
    title: 'User Roles and Project Management',
    description: 'Organize work by projects, assign websites, and manage team collaboration with secure, role-based access controls.'
  },
  {
    title: 'Secure and Scalable Architecture',
    description: 'Powered by React, Spring Boot, and SQL, with JWT-based authentication, REST APIs, and CI/CD support for modern deployment environments.'
  }
];

// Styled components and content for Technologies section
const TechnologiesCardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row', // Arrange cards horizontally by default
  gap: theme.spacing(4), // Space between cards
  marginTop: theme.spacing(4),
  flexWrap: 'wrap', // Allow cards to wrap on smaller screens
  justifyContent: 'center', // Center cards when wrapped
  maxWidth: '1200px', // Limit container width if needed
  margin: '0 auto', // Center the container
}));

const TechCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  boxShadow: theme.shadows[3],
  flex: '1 1 300px', // Flex properties to allow cards to grow/shrink and set a base width
  maxWidth: '400px', // Max width for individual cards
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start', // Align content to the start within the card
}));

const TechCategoryCardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.3rem',
  fontWeight: 600,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  borderBottom: `2px solid ${theme.palette.divider}`, // Subtle divider below category title
  paddingBottom: theme.spacing(1),
  width: '100%',
}));

const TechCardItemList = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(2), // Indent the list items
  marginTop: theme.spacing(1),
}));

const TechCardItem = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  '&:last-child': {
    marginBottom: 0,
  },
}));

const technologiesContent = [
  {
    category: 'Frontend Technologies',
    items: ['React', 'Material UI', 'Tailwind CSS (if used)', 'JavaScript/TypeScript']
  },
  {
    category: 'Backend & DevOps Technologies',
    items: ['Java', 'Spring Boot', 'SQL Database (e.g., PostgreSQL, MySQL)', 'REST APIs', 'JWT Authentication', 'CI/CD Pipelines']
  }
];

// Styled components and content for Insights section
const InsightsCardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row', // Arrange cards horizontally by default
  gap: theme.spacing(4), // Space between cards
  marginTop: theme.spacing(4),
  flexWrap: 'wrap', // Allow cards to wrap on smaller screens
  justifyContent: 'center', // Center cards when wrapped
  maxWidth: '1200px', // Limit container width if needed
  margin: '0 auto', // Center the container
}));

const InsightCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  boxShadow: theme.shadows[3],
  flex: '1 1 300px', // Flex properties to allow cards to grow/shrink and set a base width
  maxWidth: '350px', // Max width for individual cards
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start', // Align content to the start within the card
}));

const InsightCardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  fontWeight: 600,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1.5),
}));

const InsightCardDescription = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: theme.palette.text.secondary,
  lineHeight: 1.6,
}));

const insightsContent = [
  {
    title: '95.9% of Websites Fail WCAG 2.2 Compliance',
    description: 'According to the 2025 WebAIM Million Report, 95.9% of analyzed homepages did not meet WCAG 2.2 Level A/AA standards. This statistic underscores the widespread need for improved web accessibility practices.'
  },
  {
    title: 'Digital Accessibility Software Market Projected to Double by 2032',
    description: 'The digital accessibility software market, valued at USD 670.37 million in 2023, is projected to reach USD 1,373.92 million by 2032, growing at a CAGR of 8.35%. This growth is driven by increasing regulatory compliance requirements and the integration of AI technologies.'
  },
  {
    title: 'AI-Powered Tools Automate 60% of Accessibility Fixes',
    description: 'Emerging technologies are making accessibility more achievable. AI-driven tools can now automate 60% of accessibility fixes, streamlining the process of identifying and resolving common issues.'
  }
];

// Styled components for Contact section
const ContactDetailsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: theme.spacing(4),
  gap: theme.spacing(2),
}));

const ContactDetailItem = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  color: theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  // Add icon styling if needed later
}));

const ContactLink = styled('a')(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  fontWeight: 500,
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const ContactFormContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto',
  boxShadow: theme.shadows[2],
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

const FormInput = styled('input')(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: '1rem',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  '&:focus': {
    outline: 'none',
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 0.2rem ${theme.palette.primary.main}30`,
  },
}));

const FormTextArea = styled('textarea')(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: '1rem',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  minHeight: '150px',
  resize: 'vertical',
  '&:focus': {
    outline: 'none',
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 0.2rem ${theme.palette.primary.main}30`,
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  alignSelf: 'center',
}));

// Styled component for Footer
const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper, // Or a different color
  padding: theme.spacing(4),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(8),
}));

const FooterLink = styled('a')(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  fontWeight: 500,
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const LandingPage = () => {
  // Placeholder for form submission logic
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission (e.g., send data to an API)
    console.log('Form submitted!');
    // You would typically collect form data here and send it to a backend endpoint
  };

  return (
    <Box>
      {/* Overview Section */}
      <Section id="overview">
        <Container maxWidth="lg">
          <MainTitle>DrishyaScan</MainTitle>
          <Tagline>Making Web Accessibility Testing Simple and Efficient</Tagline>
          <Description>
            DrishyaScan is a powerful web accessibility analyzer that helps developers, content creators, and organizations ensure their websites are inclusive and compliant with WCAG guidelines. With features like automated scanning, detailed issue detection, role-based collaboration, and downloadable reports, DrishyaScan simplifies the process of identifying and fixing accessibility barriers—empowering teams to build a more accessible web for everyone.
          </Description>
        </Container>
      </Section>

      {/* Features Section */}
      <Section id="features">
        <Container maxWidth="lg">
          <SectionTitle>Features</SectionTitle>
          <SectionContent>
            Discover the powerful features that make DrishyaScan the ultimate web accessibility testing tool.
          </SectionContent>
          <FeatureList>
            {features.map((feature, index) => (
              <Box key={index}>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </Box>
            ))}
          </FeatureList>
        </Container>
      </Section>

      {/* Product Section */}
      <Section id="product">
        <Container maxWidth="lg">
          <SectionTitle>Product</SectionTitle>
          <SectionContent>
            Experience the power of DrishyaScan through our comprehensive accessibility testing solution.
          </SectionContent>
          <ProductContainer>
            <VideoPlaceholder>
              Watch DrishyaScan in Action
            </VideoPlaceholder>
            <ProductDescription>
              DrishyaScan provides a comprehensive suite of tools for web accessibility testing, 
              making it easier than ever to ensure your websites are accessible to everyone. 
              Our solution combines powerful automation with detailed reporting and team collaboration features.
            </ProductDescription>
            <TryButton 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => window.location.href = '/login'}
            >
              Try DrishyaScan Free
            </TryButton>
          </ProductContainer>
        </Container>
      </Section>

      {/* About Section */}
      <Section id="about">
        <Container maxWidth="lg">
          <SectionTitle>About Us</SectionTitle>
          <AboutContent>
            <LogoContainer>
              <LogoImage src={logo} alt="Cognitive Crafts Logo" />
              <Box>
                <CognitiveCraftsTitle component="div">COGNITIVE</CognitiveCraftsTitle>
                <CognitiveCraftsTitle component="div">CRAFTS</CognitiveCraftsTitle>
                <TaglineText>AI & JAVA APPLICATIONS</TaglineText>
              </Box>
            </LogoContainer>
            
            <AboutText>
              Cognitive Crafts is a forward-thinking technology organization focused on building intelligent, accessible, and scalable software solutions. Founded with a mission to combine the power of artificial intelligence, modern web technologies, and strong software engineering principles, we specialize in solving real-world problems through innovative digital products.
            </AboutText>
            
            <AboutText>
              Our team of developers, designers, and engineers is passionate about creating tools that empower developers, testers, and organizations to build better, more inclusive digital experiences.
            </AboutText>

            <AboutSubtitle>What We Do</AboutSubtitle>
            <AboutText>
              At Cognitive Crafts, we design and develop full-stack, cloud-ready applications using Java, Spring Boot, React, Python, and modern DevOps pipelines. Our products reflect our core values: simplicity, performance, security, and accessibility.
            </AboutText>
            <AboutText>
              We focus on delivering:
            </AboutText>
            <AboutText component="ul" sx={{ pl: 4 }}>
              <li>AI-assisted development tools</li>
              <li>Accessibility compliance platforms</li>
              <li>Automation & QA solutions</li>
              <li>Enterprise-ready microservices and APIs</li>
              <li>Full DevOps lifecycle integration</li>
            </AboutText>

            <AboutSubtitle>Our Products</AboutSubtitle>
            <ProductList>
              <ProductItem>
                <ProductTitle>1. DrishyaScan</ProductTitle>
                <AboutText>
                  A powerful web accessibility analyzer that helps developers and organizations ensure WCAG compliance, detect issues across websites, and generate actionable reports. DrishyaScan is built with React, Spring Boot, and supports scheduled scanning, role-based collaboration, and real-time dashboards.
                </AboutText>
              </ProductItem>
              <ProductItem>
                <ProductTitle>2. TestAura</ProductTitle>
                <AboutText>
                  An AI-powered Smart Test Case Generator designed to help QA engineers and developers automatically generate test cases based on requirements, code snippets, or user stories. TestAura streamlines test coverage analysis, reduces manual effort, and integrates seamlessly into CI/CD pipelines.
                </AboutText>
              </ProductItem>
            </ProductList>

            <AboutSubtitle>Contact Us</AboutSubtitle>
            <AboutText>
              Have a question, suggestion, or partnership idea? Reach out to us.
            </AboutText>
            <br />
            <ContactInfo>
              <ContactItem>Email: contact@cognitivecrafts.com</ContactItem>
              <ContactItem>Phone: +1 (555) 123-4567</ContactItem>
            </ContactInfo>
          </AboutContent>
        </Container>
      </Section>

      {/* Technologies Section */}
      <Section id="technologies">
        <Container maxWidth="lg">
          <SectionTitle>Our Technology Stack</SectionTitle>
          <SectionContent>
            Discover the robust and modern technologies that power DrishyaScan.
          </SectionContent>
          <br />
          <TechnologiesCardContainer>
            {technologiesContent.map((techCategory, index) => (
              <TechCard key={index}>
                <TechCategoryCardTitle>{techCategory.category}</TechCategoryCardTitle>
                <TechCardItemList component="ul">
                  {techCategory.items.map((item, itemIndex) => (
                    <TechCardItem component="li" key={itemIndex}>{item}</TechCardItem>
                  ))}
                </TechCardItemList>
              </TechCard>
            ))}
          </TechnologiesCardContainer>
        </Container>
      </Section>

      {/* Insights Section */}
      <Section id="insights">
        <Container maxWidth="lg">
          <SectionTitle>Latest Insights</SectionTitle>
          <SectionContent>
            Stay updated with the latest news, articles, and insights from the web accessibility world.
          </SectionContent>
          <br />
          <InsightsCardContainer>
            {insightsContent.map((insight, index) => (
              <InsightCard key={index}>
                <InsightCardTitle>{insight.title}</InsightCardTitle>
                <InsightCardDescription>{insight.description}</InsightCardDescription>
              </InsightCard>
            ))}
          </InsightsCardContainer>
        </Container>
      </Section>

      {/* Contact Section */}
      <Section id="contact">
        <Container maxWidth="lg">
          <SectionTitle>Get in Touch</SectionTitle>
          <SectionContent>
            We'd love to hear from you! Reach out to us with any questions, inquiries, or partnership proposals.
          </SectionContent>
          <ContactDetailsContainer>
            <ContactDetailItem>
              Email: <ContactLink href="mailto:contact@cognitivecrafts.com">contact@cognitivecrafts.com</ContactLink>
            </ContactDetailItem>
            <ContactDetailItem>
              Phone: <ContactLink href="tel:+15551234567">+1 (555) 123-4567</ContactLink>
            </ContactDetailItem>
            <br />
            {/* Optional: Add Location or Social Media here */}
          </ContactDetailsContainer>

          <ContactFormContainer component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" component="h3" sx={{ textAlign: 'center' }}>
              Send us a Message
            </Typography>
            <FormInput type="text" placeholder="Your Name" required />
            <FormInput type="email" placeholder="Your Email" required />
            <FormInput type="text" placeholder="Subject" />
            <FormTextArea placeholder="Your Message" required />
            <SubmitButton variant="contained" color="primary" type="submit">
              Send Message
            </SubmitButton>
          </ContactFormContainer>

        </Container>
      </Section>
    </Box>
  );
};

export default LandingPage; 