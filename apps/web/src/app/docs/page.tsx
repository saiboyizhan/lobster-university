export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-8 text-4xl font-bold text-zinc-900 dark:text-white">
          Documentation
        </h1>

        <div className="prose prose-zinc max-w-none dark:prose-invert">
          <h2>Getting Started</h2>
          <h3>Install the CLI</h3>
          <pre className="rounded-lg bg-zinc-950 p-4 text-sm text-green-400">
            <code>npm install -g @lobster-u/cli</code>
          </pre>

          <h3>Install a Skill</h3>
          <pre className="rounded-lg bg-zinc-950 p-4 text-sm text-green-400">
            <code>{`# Single skill
lobster-u install @lobster-u/google-search

# Multiple skills
lobster-u install @lobster-u/code-gen @lobster-u/code-review @lobster-u/debugger`}</code>
          </pre>

          <h3>Create a Custom Skill</h3>
          <pre className="rounded-lg bg-zinc-950 p-4 text-sm text-green-400">
            <code>{`lobster-u create my-custom-skill
cd skills/my-custom-skill
# Edit SKILL.md, knowledge/, strategies/
lobster-u test my-custom-skill`}</code>
          </pre>

          <h2>Skill Package Structure</h2>
          <p>
            Every skill follows a consistent structure. The manifest defines
            metadata, SKILL.md defines the agent&apos;s role, knowledge/ holds domain
            expertise, and strategies/ contains behavioral patterns.
          </p>
          <pre className="rounded-lg bg-zinc-950 p-4 text-sm text-zinc-300">
            <code>{`@lobster-u/<skill-name>/
├── package.json          # npm package config
├── manifest.json         # category, tags, dependencies
├── SKILL.md              # role, triggers, capabilities
├── knowledge/            # domain knowledge files
├── strategies/           # behavioral strategies
└── tests/                # smoke + benchmark tests`}</code>
          </pre>

          <h2>Playbook Format</h2>
          <p>
            Playbooks are end-to-end learning guides with a human-agent split:
            humans make decisions, agents handle execution.
          </p>
          <ol>
            <li><strong>Overview</strong> — Goal, audience, time estimate</li>
            <li><strong>Prerequisites</strong> — Required skills and tools</li>
            <li><strong>Steps</strong> — 3-5 steps with human + agent actions</li>
            <li><strong>Skill Pack</strong> — Required skill packages</li>
            <li><strong>Expected Output</strong> — What you should ship</li>
          </ol>

          <h2>Compatibility</h2>
          <table>
            <thead>
              <tr>
                <th>Framework</th>
                <th>Version</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>OpenClaw</td><td>&gt;= 0.5.0</td><td>Supported</td></tr>
              <tr><td>Claude Code</td><td>&gt;= 1.0.0</td><td>Supported</td></tr>
              <tr><td>Cursor</td><td>Latest</td><td>Supported</td></tr>
              <tr><td>Windsurf</td><td>Latest</td><td>Supported</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
