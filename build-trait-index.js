// Script to build trait index from Influence Atlas profiles
// This creates a mapping of domain/archetype to common traits

const fs = require('fs');
const path = require('path');

async function buildTraitIndex() {
    console.log('🔄 Loading Atlas profiles...');
    
    // Load the all-profiles.json from Influence Atlas
    const atlasPath = path.join(__dirname, '../influence-atlas/all-profiles.json');
    const profiles = JSON.parse(fs.readFileSync(atlasPath, 'utf8'));
    
    console.log(`✅ Loaded ${profiles.length} profiles`);
    
    // Trait categories to index
    const traitCategories = {
        'primary_traits': 'psychological_profile.primary_traits',
        'core_motivations': 'psychological_profile.core_motivations',
        'cognitive_style': 'psychological_profile.cognitive_style',
        'communication_tone': 'communication_style.tone',
        'communication_sentence_structure': 'communication_style.sentence_structure',
        'work_style': 'behavioral_patterns.work_style',
        'problem_solving_approach': 'behavioral_patterns.problem_solving_approach',
        'learning_style': 'learning.learning_style',
        'core_values': 'values.core_values',
        'leadership_style': 'collaboration.leadership_style',
        'stress_responses': 'behavioral_patterns.stress_responses',
        'blind_spots': 'psychological_profile.blind_spots'
    };
    
    // Index structure: { domain: { traitCategory: { trait: count } }, archetype: { ... } }
    const domainIndex = {};
    const archetypeIndex = {};
    
    // Helper to get nested value
    function getNestedValue(obj, path) {
        return path.split('.').reduce((current, prop) => current?.[prop], obj);
    }
    
    // Helper to parse trait values (handle arrays, strings, etc.)
    function parseTraits(value) {
        if (!value) return [];
        if (Array.isArray(value)) return value.map(t => String(t).trim().toLowerCase());
        if (typeof value === 'string') {
            return value.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0);
        }
        return [];
    }
    
    // Process each profile
    profiles.forEach(profile => {
        const domain = profile.domain;
        const archetype = profile.archetype;
        
        if (!domain && !archetype) return;
        
        // Process each trait category
        Object.entries(traitCategories).forEach(([categoryKey, categoryPath]) => {
            const traitValue = getNestedValue(profile, categoryPath);
            const traits = parseTraits(traitValue);
            
            traits.forEach(trait => {
                // Index by domain
                if (domain) {
                    if (!domainIndex[domain]) domainIndex[domain] = {};
                    if (!domainIndex[domain][categoryKey]) domainIndex[domain][categoryKey] = {};
                    domainIndex[domain][categoryKey][trait] = (domainIndex[domain][categoryKey][trait] || 0) + 1;
                }
                
                // Index by archetype
                if (archetype) {
                    if (!archetypeIndex[archetype]) archetypeIndex[archetype] = {};
                    if (!archetypeIndex[archetype][categoryKey]) archetypeIndex[archetype][categoryKey] = {};
                    archetypeIndex[archetype][categoryKey][trait] = (archetypeIndex[archetype][categoryKey][trait] || 0) + 1;
                }
            });
        });
    });
    
    // Convert counts to sorted arrays (traits sorted by frequency)
    function sortTraitsByFrequency(traitCounts) {
        return Object.entries(traitCounts)
            .sort((a, b) => b[1] - a[1]) // Sort by count descending
            .map(([trait]) => trait); // Return just the trait names
    }
    
    // Process indices to create sorted trait lists
    const processedDomainIndex = {};
    Object.entries(domainIndex).forEach(([domain, categories]) => {
        processedDomainIndex[domain] = {};
        Object.entries(categories).forEach(([category, traitCounts]) => {
            processedDomainIndex[domain][category] = sortTraitsByFrequency(traitCounts);
        });
    });
    
    const processedArchetypeIndex = {};
    Object.entries(archetypeIndex).forEach(([archetype, categories]) => {
        processedArchetypeIndex[archetype] = {};
        Object.entries(categories).forEach(([category, traitCounts]) => {
            processedArchetypeIndex[archetype][category] = sortTraitsByFrequency(traitCounts);
        });
    });
    
    // Create final index structure
    const traitIndex = {
        domain: processedDomainIndex,
        archetype: processedArchetypeIndex,
        metadata: {
            totalProfiles: profiles.length,
            domains: Object.keys(processedDomainIndex).length,
            archetypes: Object.keys(processedArchetypeIndex).length,
            generated: new Date().toISOString()
        }
    };
    
    // Write to file
    const outputPath = path.join(__dirname, 'trait-index.json');
    fs.writeFileSync(outputPath, JSON.stringify(traitIndex, null, 2));
    
    console.log(`✅ Trait index created: ${outputPath}`);
    console.log(`📊 Indexed ${traitIndex.metadata.domains} domains and ${traitIndex.metadata.archetypes} archetypes`);
    
    // Show some stats
    const sampleDomain = Object.keys(processedDomainIndex)[0];
    if (sampleDomain) {
        console.log(`\n📋 Sample domain "${sampleDomain}":`);
        Object.entries(processedDomainIndex[sampleDomain]).forEach(([category, traits]) => {
            console.log(`  ${category}: ${traits.length} traits (top 5: ${traits.slice(0, 5).join(', ')})`);
        });
    }
}

buildTraitIndex().catch(console.error);

