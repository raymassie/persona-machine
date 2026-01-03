# Persona Machine

**Build custom AI agent personalities**

An interactive tool for creating AI agent personas using behavioral and psychological trait frameworks derived from Behavioral Humanism research. Generate ready-to-use persona instructions in Markdown, JSON, or YAML formats for AI agent configuration.

## Quick Start

### Live Demo

**🌐 [View Live Demo on GitHub Pages](https://raymassie.github.io/persona-machine/)**

The application is hosted on GitHub Pages and ready to use immediately. No installation required!

### Local Development

**Important:** This app must be run from a web server, not opened directly as a file (file:// protocol won't work due to CORS).

#### Option 1: Python HTTP Server
```bash
cd persona-machine
python3 -m http.server 8000
```
Then open: http://localhost:8000

#### Option 2: Any Other Web Server
- Use any local web server (Node.js http-server, PHP built-in server, etc.)
- Just make sure it serves the files with proper CORS headers

### Deploy to GitHub Pages

To deploy your own copy to GitHub Pages:

1. **Fork or clone this repository**
2. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `master` (or `main`)
   - Folder: `/ (root)`
   - Click Save
3. **Your site will be live at**: `https://[your-username].github.io/persona-machine/`

The app works automatically on GitHub Pages since it's a static site with no build process required.

## Overview

Persona Engine allows you to construct detailed personality profiles for AI agents by selecting from comprehensive trait categories. The tool generates ready-to-use persona instructions in Markdown, JSON, or YAML formats.

## Features

- **Comprehensive Trait Selection**: 5,600+ unique trait values across 26 behavioral categories
- **Hierarchical Grouping**: Large trait lists automatically grouped by root word (e.g., "building (15)", "understanding (12)") for easier navigation
- **Interactive Builder**: Searchable trait selectors with multi-select and single-select support
- **Real-Time Preview**: See your persona as you build it in the selected format
- **Multiple Export Formats**: Generate personas in Markdown, JSON, or YAML
- **Slider Controls**: 14 oppositional trait dimensions with visual sliders:
  - Communication Tone: Formal/Casual, Serious/Funny, Respectful/Irreverent, Matter-of-fact/Enthusiastic
  - Personality: Passive/Assertive, Pessimistic/Optimistic, Closed/Open-minded
  - Behavioral: Concise/Detailed, Conservative/Risk-taking, Deliberate/Quick
  - Interpersonal: Empathy, Patience, Energy
  - Technology Adoption: Resistant/Early Adopter
- **Progressive Selection**: Fields with many options show first 50, then "Show All" for better performance
- **Behavioral Humanism Framework**: Includes all 7 core dimensions plus Tier 1 and Tier 2 expansions
- **Clean UI**: Organized by category with collapsible sections
- **No Dependencies**: Pure vanilla JavaScript, HTML, and CSS

## Trait Categories

### Core Personality
- Primary Traits (208 unique values, grouped)
- Cognitive Style (single-select, 32 options)
- Core Motivations (541 unique values, grouped into 94 topic groups)
- Decision Making Framework (free-form textarea)
- Personality Dimensions (sliders): Passive/Assertive, Pessimistic/Optimistic, Closed/Open-minded

### Communication Style
- Tone of Voice Dimensions (sliders): Formal/Casual, Serious/Funny, Respectful/Irreverent, Matter-of-fact/Enthusiastic
- Additional Communication Traits (310 unique values, grouped)
- Sentence Structure (325 unique values, grouped)

### Behavioral Patterns
- Work Style (342 unique values, grouped)
- Problem Solving Approach (282 unique values, grouped)
- Learning Style (146 unique values, grouped)
- Behavioral Dimensions (sliders): Concise/Detailed, Conservative/Risk-taking, Deliberate/Quick

### Values & Ethics
- Core Values (63 unique values, grouped)

### Behavioral Humanism (7 Dimensions)
- Bias Awareness (27 unique values, grouped)
- Growth Motivation (45 unique values, grouped)
- Cognitive Humanism (3 unique values)
- Humanistic Cognition (30 unique values, grouped)
- Self-Actualization (2 unique values)
- Behavioral Growth (31 unique values, grouped)

### Modern Dimensions (Tier 1)
- Technology Adoption (slider: Resistant ↔ Early Adopter)
- Crisis Response (single-select, 3 options)
- Influence Style (single-select, 17 options)

### Interpersonal Dimensions (Tier 2)
- Resource Relationship (single-select, 16 options)
- Time Orientation (single-select, 12 options)
- Collaboration Style (single-select, 26 options)
- Leadership Style (254 unique values, grouped)
- Interpersonal Dimensions (sliders): Empathy, Patience, Energy

### Stress & Awareness
- Stress Responses (200 unique values, grouped)
- Blind Spots (201 unique values, grouped)

## Usage

1. **Start a web server** (see Quick Start above)
2. **Open the app** in your browser
3. **Select Traits**: 
   - Click on any search field (e.g., "Core Motivations")
   - Start typing to filter, or click on any option
   - For grouped fields, click group headers (e.g., "building (15)") to expand/collapse
   - Selected traits appear as blue chips below the field
   - Multi-select fields allow multiple selections; single-select fields allow only one
4. **Adjust Sliders**: Move sliders to set oppositional trait dimensions (0-100 scale)
   - Communication tone sliders update a live example message
5. **Preview**: Watch your persona take shape in real-time in the right panel
6. **Choose Format**: Select Markdown, JSON, or YAML output format using radio buttons
7. **Export**: 
   - **Copy**: Click "COPY" to copy the persona to clipboard
   - **Download**: Click "DOWNLOAD" to save as a file
8. **Randomize**: Click "RANDOM" to generate a random persona configuration
9. **Clear**: Click "CLEAR ALL" to reset all selections

## Export Formats

### Markdown
Human-readable format with clear sections and bullet points. Perfect for documentation or direct use in AI prompts.

### JSON
Structured data format with nested objects. Ideal for programmatic use or integration with other tools.

### YAML
Clean, readable format popular in AI/ML configurations. Great for system prompts and persona injection.

## Data Source

Trait data is extracted from the Influence Atlas project, which contains 324 profiles of influential figures evaluated through a Behavioral Humanism framework combining:
- Daniel Kahneman's Behavioral Economics
- Abraham Maslow's Humanistic Psychology

## Technology

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Data**: JSON-based trait database
- **No Dependencies**: Runs entirely in the browser

## File Structure

```
persona-machine/
├── index.html                  # Main application HTML
├── styles.css                  # Application styling
├── app.js                      # Application logic (trait loading, grouping, UI, export)
├── trait-data-cleaned.json     # Cleaned trait database (5,600+ traits across 26 categories)
├── trait-data.json             # Original trait data (legacy)
├── trait-data-grouped.json     # Grouped structure for core_values (legacy)
├── *.py                        # Python scripts for data cleaning (development tools)
└── README.md                   # This file
```

## Troubleshooting

**No traits appearing?**
- Make sure you're running from a web server, not file://
- Check browser console for errors (F12)
- Verify trait-data.json is in the same directory

**Dropdown not showing?**
- Click on a search field to focus it
- The dropdown should appear automatically
- Try typing to filter options

## License

This project uses trait data derived from Influence Atlas. See the Influence Atlas license for data usage terms.

## Implementation Details

### Trait Grouping
Fields with 25+ items automatically use hierarchical grouping:
- Traits are grouped by root word (first word)
- Groups display as collapsible headers with counts (e.g., "building (15)")
- Click headers to expand/collapse groups
- Standalone traits (no groups) display directly
- Groups are sorted alphabetically

### Single vs Multi-Select
- **Multi-select fields**: Allow multiple trait selections (chips display)
- **Single-select fields**: Allow only one selection (replaces previous selection)
- Single-select fields: `cognitive_style`, `crisis_response`, `influence_style`, `resource_relationship`, `time_orientation`, `collaboration_style`

### Sliders
Slider values (0-100) are converted to descriptive labels in exports:
- Technology Adoption: 0-20=Resistant, 21-40=Skeptical, 41-60=Selective, 61-80=Pragmatic, 81-100=Early Adopter
- Other sliders use threshold-based labels (e.g., <30=Low, 30-70=Moderate, >70=High)

## Future Enhancements

- Save/load persona configurations
- Persona comparison tools
- Trait compatibility suggestions
- Pre-built persona templates based on Influence Atlas profiles
- Advanced filtering and recommendations
- Persona validation and consistency checking
