# Persona Machine

**Build custom AI agent personalities with behavioral and psychological trait frameworks**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-brightgreen)](https://raymassie.github.io/persona-machine/)
[![License](https://img.shields.io/badge/License-Influence%20Atlas-blue)](LICENSE)

An interactive web application for creating detailed AI agent personas. Select from 5,600+ behavioral traits across 26 categories, adjust personality dimensions with intuitive sliders, and generate ready-to-use persona instructions in Markdown, JSON, or YAML formats.

## 🌐 [Try It Now - Live Demo](https://raymassie.github.io/persona-machine/)

No installation required. The application runs entirely in your browser.

## What is Persona Machine?

Persona Machine helps you build comprehensive personality profiles for AI agents by combining:

- **Behavioral Humanism Framework**: Traits derived from Daniel Kahneman's Behavioral Economics and Abraham Maslow's Humanistic Psychology
- **5,600+ Unique Traits**: Curated from analysis of 324 influential figures
- **14 Interactive Sliders**: Visual controls for oppositional personality dimensions
- **Real-Time Preview**: See your persona take shape as you build it
- **Multiple Export Formats**: Generate personas ready for AI system integration

## Key Features

### 👤 Persona Identity
- **Name Input**: Give your persona a custom name
- **Domain Selection**: Choose from 29 domains (Technology, Design, Psychology, Business, etc.)
- **Archetype Selection**: Select from 37 role-based archetypes (Visionary, Scholar, Coach, etc.)
- **10 Personality Presets**: Quick-start templates for common personality types:
  - Analytical Thinker, Creative Visionary, Motivational Coach
  - Empathetic Counselor, Strategic Advisor, Practical Problem Solver
  - Innovative Explorer, Collaborative Team Player, Authoritative Leader
  - Balanced Generalist

### 🎯 Comprehensive Trait Selection
- **26 Behavioral Categories**: From core personality to stress responses
- **Hierarchical Grouping**: Large trait lists automatically organized (e.g., "building (15)", "understanding (12)")
- **Smart Search**: Filter traits instantly as you type
- **Multi-Select & Single-Select**: Choose the right selection mode for each trait type

### 🎚️ Interactive Sliders
Control oppositional dimensions with visual sliders:
- **Communication Tone**: Formal ↔ Casual, Serious ↔ Funny, Respectful ↔ Irreverent, Matter-of-fact ↔ Enthusiastic
- **Personality**: Passive ↔ Assertive, Pessimistic ↔ Optimistic, Closed ↔ Open-minded
- **Behavioral**: Concise ↔ Detailed, Conservative ↔ Risk-taking, Deliberate ↔ Quick
- **Interpersonal**: Empathy, Patience, Energy levels
- **Technology Adoption**: Resistant ↔ Early Adopter

### 📊 Real-Time Preview
Watch your persona generate in real-time as you make selections. Switch between formats instantly:
- **Markdown**: Human-readable format with name, domain, archetype, and all traits
- **JSON**: Structured data with complete persona metadata for programmatic use
- **YAML**: Clean format popular in AI/ML configurations with full context

### 🚀 Export & Share
- **Copy to Clipboard**: One-click copying for immediate use
- **Download Files**: Save personas as `.md`, `.json`, or `.yaml` files
- **Ready to Use**: Generated personas are formatted for direct AI agent injection

## How to Use

1. **Visit the [Live Demo](https://raymassie.github.io/persona-machine/)**
2. **Set Identity** (optional):
   - Enter a persona name
   - Select a domain and archetype
   - Or load a preset to start with a pre-configured personality
3. **Select Traits**: 
   - Click any search field (e.g., "Core Motivations")
   - Type to filter or click options to select
   - For grouped fields, click headers like "building (15)" to expand/collapse
   - Selected traits appear as chips below each field
3. **Adjust Sliders**: Move sliders to set personality dimensions (0-100 scale)
4. **Preview**: Watch your persona generate in the right panel
5. **Choose Format**: Select Markdown, JSON, or YAML
6. **Export**: Copy or download your persona

### Quick Actions
- **Load Preset**: Choose from 10 pre-configured personality types
- **RANDOM**: Generate a random persona configuration
- **CLEAR ALL**: Reset all selections

## Trait Categories

### Core Personality
- Primary Traits (208 values, grouped)
- Cognitive Style (single-select)
- Core Motivations (541 values, 94 topic groups)
- Decision Making Framework (free-form)
- Personality Dimensions (3 sliders)

### Communication Style
- Tone Dimensions (4 sliders with live preview)
- Additional Communication Traits (310 values, grouped)
- Sentence Structure (325 values, grouped)

### Behavioral Patterns
- Work Style (342 values, grouped)
- Problem Solving Approach (282 values, grouped)
- Learning Style (146 values, grouped)
- Behavioral Dimensions (3 sliders)

### Values & Ethics
- Core Values (63 values, grouped)

### Behavioral Humanism
- Bias Awareness, Growth Motivation, Cognitive Humanism
- Humanistic Cognition, Self-Actualization, Behavioral Growth

### Modern Dimensions (Tier 1)
- Technology Adoption (slider)
- Crisis Response, Influence Style

### Interpersonal Dimensions (Tier 2)
- Resource Relationship, Time Orientation, Collaboration Style
- Leadership Style (254 values, grouped)
- Interpersonal Dimensions (3 sliders)

### Stress & Awareness
- Stress Responses (200 values, grouped)
- Blind Spots (201 values, grouped)

## Data Source

Trait data is extracted from the [Influence Atlas](https://github.com/raymassie/influence-atlas) project, which contains 324 profiles of influential figures evaluated through a Behavioral Humanism framework combining:
- **Daniel Kahneman's Behavioral Economics**: Cognitive biases, decision-making patterns
- **Abraham Maslow's Humanistic Psychology**: Self-actualization, growth motivation

## Technology

- **Pure Vanilla JavaScript**: No frameworks, no build process
- **HTML5 & CSS3**: Modern, responsive design
- **JSON Data**: 5,600+ traits across 26 categories
- **Zero Dependencies**: Runs entirely in the browser

## Use Cases

- **AI Agent Configuration**: Generate personas for chatbots, virtual assistants, and AI agents
- **Character Development**: Create detailed personality profiles for creative projects
- **Research & Analysis**: Explore behavioral trait combinations and patterns
- **Team Building**: Understand personality dimensions in collaborative settings
- **Educational**: Learn about behavioral psychology and trait frameworks

## Browser Support

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

This project uses trait data derived from Influence Atlas. See the [Influence Atlas license](https://github.com/raymassie/influence-atlas) for data usage terms.

## Contributing

Contributions welcome! This is a static site with no build process:
1. Fork the repository
2. Make your changes
3. Test locally (see Development section)
4. Submit a pull request

## Development

For local development:

```bash
# Clone the repository
git clone https://github.com/raymassie/persona-machine.git
cd persona-machine

# Start a local server (required due to CORS)
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

**Note**: The app must be run from a web server, not opened directly as a file.

## Repository

- **GitHub**: [raymassie/persona-machine](https://github.com/raymassie/persona-machine)
- **Live Demo**: [raymassie.github.io/persona-machine](https://raymassie.github.io/persona-machine/)
- **Issues**: [Report bugs or request features](https://github.com/raymassie/persona-machine/issues)

---

**Built with ❤️ using Behavioral Humanism research**
