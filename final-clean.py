#!/usr/bin/env python3
"""
Final aggressive cleaning pass - remove all domain-specific and method-based traits
"""

import json
import re

def final_clean(data):
    """Final aggressive cleaning"""
    cleaned = {}
    
    # Patterns that indicate non-personality/non-value traits
    domain_patterns = [
        r'\b(anatomical|compositional|copywriting|commentary|collaborative|creative|ergonomic|experimental|inventive|literary|narrative|nursing|performance|persuasive|professional|programming|sales|scholarly|strategic|systematic|teaching|therapeutic)\s+excellence\b',
        r'\b(clear|forward|systems)\s*-\s*thinking\b',
        r'\b(artistically|emotionally|intellectually)\s*-\s*(expressive|intelligent|rigorous|curious)\b',
        r'\b(compositional|constitutional|contractual|conservationist|constitutional|developmental|dialectical|ecological|empirical|empiricist|existential|feminist|free-market|historical|humanistic|interdisciplinary|literary|materialist|media-savvy|masculine)\b',
        r'\b(conflict-resolution|disco-obsessed|funnel-obsessed|legacy-conscious|long-term|high-energy)\b',
        r'\b(conceptual|comprehensive|compositional|contradictory|counterintuitive|dystopian|eternal|groundbreaking|lyrical|prophetic|structural|symbolic|theatrical|visual)\b'
    ]
    
    def is_problematic(trait, category):
        trait_lower = trait.lower().strip()
        
        # Check domain patterns
        for pattern in domain_patterns:
            if re.search(pattern, trait_lower):
                return True
        
        # Core values shouldn't have "excellence" compounds (these are methods, not values)
        if category == 'core_values' and 'excellence' in trait_lower and len(trait_lower.split()) > 1:
            return True
        
        # Primary traits shouldn't have "thinking", "expressive" in compounds
        if category == 'primary_traits':
            if re.search(r'-\s*(thinking|expressive|intelligent|rigorous|curious|savvy|conscious|obsessed)', trait_lower):
                return True
            # Single word domain descriptors
            if trait_lower in ['compositional', 'constitutional', 'contractual', 'conservationist', 'developmental', 
                              'dialectical', 'ecological', 'empirical', 'empiricist', 'existential', 'feminist',
                              'free-market', 'historical', 'humanistic', 'interdisciplinary', 'literary', 'materialist',
                              'masculine', 'conceptual', 'comprehensive', 'contradictory', 'counterintuitive',
                              'dystopian', 'eternal', 'groundbreaking', 'lyrical', 'prophetic', 'structural',
                              'symbolic', 'theatrical', 'visual']:
                return True
        
        return False
    
    for category, traits in data.items():
        if not isinstance(traits, list):
            cleaned[category] = traits
            continue
        
        cleaned_list = []
        for trait in traits:
            if not is_problematic(trait, category):
                cleaned_list.append(trait)
        
        cleaned[category] = sorted(list(set(cleaned_list)))
        removed = len(traits) - len(cleaned[category])
        if removed > 0:
            print(f"{category}: {len(traits)} -> {len(cleaned[category])} ({removed} removed)")
    
    return cleaned

# Load and clean
with open('trait-data-cleaned.json', 'r') as f:
    data = json.load(f)

print("Final cleaning pass...\n")
final_data = final_clean(data)

# Save
with open('trait-data-cleaned.json', 'w') as f:
    json.dump(final_data, f, indent=2)

print(f"\n✅ Final cleaned data saved")

# Show samples
for category in ['core_values', 'primary_traits']:
    print(f"\n{category.upper()} ({len(final_data.get(category, []))} total):")
    for trait in final_data.get(category, [])[:25]:
        print(f"  - {trait}")

