export interface Step {
  number: number;
  phase: string;
  title: string;
  subtitle: string;
  goal: string;
  benefit: string;
  tasks: string[];
  codeExample?: string;
  expectedOutput: string;
}

export const STEPS: Step[] = [
  {
    number: 0,
    phase: "Setup",
    title: "Install",
    subtitle: "CLI + Agent Framework",
    goal: "Get the Lobster University CLI and configure your first agent framework.",
    benefit: "You'll have a working development environment ready for skill installation.",
    tasks: [
      "Install Node.js >= 18 if not already installed",
      "Install the Lobster U CLI globally",
      "Verify the installation",
      "Choose your agent framework (OpenClaw, Claude Code, Cursor, or Windsurf)",
    ],
    codeExample: `# Install the CLI
npm install -g @lobster-u/cli

# Verify installation
lobster-u --version

# Initialize a new project
lobster-u init my-agent`,
    expectedOutput: "CLI installed and `lobster-u --version` prints the version number.",
  },
  {
    number: 1,
    phase: "Activate",
    title: "Meet Your Agent",
    subtitle: "First Contact",
    goal: "Install your first skill and have a real conversation with your enhanced agent.",
    benefit: "You'll experience the difference between a vanilla agent and one with specialized skills.",
    tasks: [
      "Install the google-search skill",
      "Ask your agent to search for something specific",
      "Compare the output quality with and without the skill",
      "Read the SKILL.md to understand what the skill does",
    ],
    codeExample: `# Install your first skill
lobster-u install @lobster-u/google-search

# Check what's installed
lobster-u list

# Read the skill definition
cat skills/google-search/SKILL.md`,
    expectedOutput: "Your agent performs a noticeably better web search with credibility annotations.",
  },
  {
    number: 2,
    phase: "Activate",
    title: "First Real Task",
    subtitle: "Ship Something",
    goal: "Complete a real task using multiple skills working together.",
    benefit: "You'll see how skill composition creates capabilities greater than the sum of parts.",
    tasks: [
      "Install a skill combo (e.g., code-gen + code-review)",
      "Give your agent a real coding task",
      "Observe how skills collaborate automatically",
      "Save the output as a real deliverable",
    ],
    codeExample: `# Install a skill combo
lobster-u install @lobster-u/code-gen @lobster-u/code-review

# The CLI resolves dependencies automatically
# code-review depends on code-gen, so both install in order`,
    expectedOutput: "A code file that was generated AND reviewed, with quality annotations.",
  },
  {
    number: 3,
    phase: "Stabilize",
    title: "Safety Baseline",
    subtitle: "Health Check",
    goal: "Run diagnostics on your agent to establish a performance baseline.",
    benefit: "You'll know exactly where your agent stands and what to improve.",
    tasks: [
      "Install the assessment and healthcheck skills",
      "Run a full health check",
      "Take the 5-dimension assessment",
      "Record your baseline scores",
    ],
    codeExample: `# Install diagnostic skills
lobster-u install @lobster-u/assessment @lobster-u/healthcheck

# Run health check
# Ask your agent: "Run a full health check"

# Run 5D assessment
# Ask your agent: "Assess my capabilities across all 5 dimensions"`,
    expectedOutput: "A 5-dimension radar chart showing Information, Processing, Creation, Analysis, Meta scores.",
  },
  {
    number: 4,
    phase: "Stabilize",
    title: "Personalize",
    subtitle: "Make It Yours",
    goal: "Customize your agent's personality, preferences, and skill loadout.",
    benefit: "Your agent becomes uniquely yours — optimized for your specific use cases.",
    tasks: [
      "Create a custom skill using the CLI",
      "Edit the SKILL.md with your domain expertise",
      "Add knowledge files with your personal best practices",
      "Test your custom skill",
    ],
    codeExample: `# Create a custom skill
lobster-u create my-domain-skill

# Edit the generated files
# skills/my-domain-skill/SKILL.md    — role definition
# skills/my-domain-skill/knowledge/  — your expertise
# skills/my-domain-skill/strategies/ — behavioral patterns

# Test it
lobster-u test my-domain-skill`,
    expectedOutput: "A working custom skill that encodes your personal expertise.",
  },
  {
    number: 5,
    phase: "Optimize",
    title: "Advanced Tasks",
    subtitle: "Push the Limits",
    goal: "Tackle complex, multi-step tasks that require deep skill composition.",
    benefit: "You'll unlock the full potential of skill orchestration.",
    tasks: [
      "Follow a complete Playbook end-to-end",
      "Use 5+ skills in a single workflow",
      "Measure the quality improvement vs. baseline",
      "Share your results in the Campus community",
    ],
    codeExample: `# Pick a playbook that matches your goals
# e.g., "AI Skill Learning" or "Crypto Trading Fundamentals"

# Install all required skills at once
lobster-u install @lobster-u/chain-analyzer @lobster-u/dex-trader @lobster-u/wallet-monitor

# Follow the playbook steps
# Each step has human actions + agent actions`,
    expectedOutput: "A complete deliverable produced by following a Playbook workflow.",
  },
  {
    number: 6,
    phase: "Optimize",
    title: "Self-Evolution",
    subtitle: "Continuous Improvement",
    goal: "Set up autonomous self-improvement loops for your agent.",
    benefit: "Your agent gets better over time without manual intervention.",
    tasks: [
      "Install the selfoptimize skill",
      "Run a self-optimization cycle",
      "Compare new assessment scores with baseline",
      "Set up the reminder skill for regular check-ins",
    ],
    codeExample: `# Install self-evolution skills
lobster-u install @lobster-u/selfoptimize @lobster-u/reminder

# Ask your agent:
# "Analyze my recent performance and suggest optimizations"

# Set up weekly reminders
# "Set a weekly reminder to run health check and assessment"`,
    expectedOutput: "Measurable improvement in at least 2 assessment dimensions compared to Step 3 baseline.",
  },
  {
    number: 7,
    phase: "Systematize",
    title: "Before / After / Beyond",
    subtitle: "Full Circle",
    goal: "Get certified, contribute to the community, and plan your next level.",
    benefit: "You'll have an on-chain credential and a clear path forward.",
    tasks: [
      "Run the certification skill to generate your certificate",
      "Share your Before/After comparison in Campus",
      "Rate and review skills you've used",
      "Plan your next Playbook or create one for others",
    ],
    codeExample: `# Get certified
lobster-u install @lobster-u/certify

# Ask your agent:
# "Generate my capability certificate based on all assessments"

# The certificate shows:
# - 5D scores (letter grades A-F)
# - Skills mastered
# - Playbooks completed
# - Karma earned`,
    expectedOutput: "A Silver/Gold certification with verifiable on-chain credentials.",
  },
];

export function getStep(number: number): Step | undefined {
  return STEPS.find((s) => s.number === number);
}

export function getTotalSteps(): number {
  return STEPS.length;
}
