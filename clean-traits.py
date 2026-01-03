#!/usr/bin/env python3
"""
Clean trait data to focus on actual personality traits and values.
Removes domain-specific, methodological, and process-oriented traits.
"""

import json
import re

# Patterns that indicate non-personality traits (methods, processes, domains)
NON_PERSONALITY_PATTERNS = [
    # Methods and processes
    r'\b(analysis|analyzing|assessment|evaluation|research|study|application|implementation|development|design|creation|execution|optimization|observation|exploration|experimentation|testing|method|approach|technique|framework|system|process|procedure)\b',
    # Domain-specific
    r'\b(algorithm|advertising|animation|architecture|artistic|cinematic|compositional|contractual|constitutional|musical|typographic|mathematical|scientific|medical|business|marketing|brand|customer|client|user|product|service|content|data|ai|technology|digital|software|hardware)\b',
    # Action-oriented (methods, not traits)
    r'\b(driven|focused|oriented|based|centered|obsessed|savvy|minded|conscious|aware|grounded|rooted|sophisticated)\s+(by|on|with|in|for)',
    # Specific methodologies
    r'\b(thinking|reasoning|problem-solving|decision-making|innovation|transformation|disruption|advancement|improvement|iteration|ideation)\b',
]

# Patterns that indicate actual personality traits (good)
PERSONALITY_PATTERNS = [
    r'^(analytical|creative|empathetic|assertive|confident|curious|disciplined|organized|passionate|patient|perfectionist|pragmatic|strategic|visionary|introverted|extroverted|optimistic|pessimistic|ambitious|humble|authentic|honest|compassionate|generous|loyal|trustworthy|courageous|resilient|adaptable|flexible|open-minded|closed-minded|introspective|extroverted|sensitive|insensitive|tactful|diplomatic|direct|blunt|warm|cold|friendly|distant|collaborative|independent|competitive|cooperative|aggressive|passive|proactive|reactive|innovative|traditional|rebellious|conformist|rebellious|experimental|conservative|liberal|radical|moderate)$',
]

# Value keywords (good indicators)
VALUE_KEYWORDS = [
    'integrity', 'honesty', 'respect', 'compassion', 'justice', 'freedom', 'equality', 
    'excellence', 'truth', 'authenticity', 'courage', 'wisdom', 'dignity', 'fairness', 
    'loyalty', 'empathy', 'generosity', 'humility', 'ethics', 'morality', 'principles', 
    'virtue', 'honor', 'trust', 'duty', 'responsibility', 'biodiversity', 'conservation',
    'transparency', 'inclusivity', 'empowerment', 'sustainability', 'privacy'
]

# Trait keywords that are OK (actual personality descriptors)
TRAIT_KEYWORDS = [
    'analytical', 'creative', 'empathetic', 'assertive', 'confident', 'curious', 
    'disciplined', 'organized', 'passionate', 'patient', 'perfectionist', 'pragmatic', 
    'strategic', 'visionary', 'ambitious', 'humble', 'authentic', 'honest', 'compassionate',
    'generous', 'loyal', 'trustworthy', 'courageous', 'resilient', 'adaptable', 'flexible',
    'open-minded', 'introspective', 'sensitive', 'tactful', 'diplomatic', 'direct', 'blunt',
    'warm', 'friendly', 'collaborative', 'independent', 'competitive', 'cooperative',
    'aggressive', 'passive', 'proactive', 'reactive', 'innovative', 'traditional', 'rebellious',
    'experimental', 'conservative', 'moderate', 'complex', 'simple', 'systematic', 'chaotic',
    'methodical', 'spontaneous', 'calculated', 'intuitive', 'logical', 'emotional', 'rational',
    'contemplative', 'action-oriented', 'decisive', 'indecisive', 'risk-taking', 'cautious',
    'bold', 'timid', 'charismatic', 'reserved', 'eloquent', 'concise', 'verbose', 'clear',
    'articulate', 'communicative', 'expressive', 'restrained', 'emotional', 'detached'
]

def is_method_or_process(trait):
    """Check if trait is a method/process rather than personality"""
    trait_lower = trait.lower()
    
    # Check for non-personality patterns
    for pattern in NON_PERSONALITY_PATTERNS:
        if re.search(pattern, trait_lower):
            return True
    
    # Check for compound phrases that suggest methods
    if any(word in trait_lower for word in ['-driven', '-focused', '-oriented', '-based', '-centered', '-obsessed']):
        # Allow some exceptions
        if trait_lower in ['action-oriented', 'detail-oriented', 'results-oriented']:
            return False
        # If it's followed by a domain term, it's likely a method
        domain_words = ['business', 'customer', 'client', 'user', 'product', 'content', 'data', 'brand', 'market', 'algorithm', 'advertising', 'artistic', 'cinematic']
        for domain in domain_words:
            if domain in trait_lower:
                return True
    
    return False

def is_domain_specific(trait):
    """Check if trait is domain-specific rather than universal personality"""
    trait_lower = trait.lower()
    
    domain_indicators = [
        'algorithmic', 'advertising', 'animation', 'architectural', 'artistic', 'cinematic',
        'musical', 'typographic', 'mathematical', 'scientific', 'medical', 'business',
        'marketing', 'brand', 'customer', 'client', 'user', 'product', 'content', 'data',
        'ai', 'technology', 'software', 'hardware', 'design', 'engineering'
    ]
    
    # Check if trait contains domain indicators (unless it's clearly a personality trait)
    for domain in domain_indicators:
        if domain in trait_lower and trait_lower not in ['artistic', 'scientific']:  # These can be personality traits
            return True
    
    return False

def is_actual_personality_trait(trait):
    """Check if trait is an actual personality descriptor"""
    trait_lower = trait.lower().strip()
    
    # Single word or simple compound
    if '-' in trait_lower:
        parts = trait_lower.split('-')
        if len(parts) == 2:
            # Simple compounds like "detail-oriented", "action-oriented" are OK
            if parts[1] in ['oriented', 'focused', 'minded', 'driven'] and parts[0] in ['action', 'detail', 'results', 'goal', 'people', 'team']:
                return True
    
    # Check against known trait keywords
    if trait_lower in TRAIT_KEYWORDS:
        return True
    
    # Check if it matches personality patterns
    for pattern in PERSONALITY_PATTERNS:
        if re.match(pattern, trait_lower):
            return True
    
    # Simple adjectives (single word, ends in common trait endings)
    if re.match(r'^[a-z]+(ive|ful|ous|ent|ant|ic|al|able|ible|ing)$', trait_lower) and len(trait_lower) < 20:
        return not is_method_or_process(trait)
    
    return False

def is_actual_value(trait):
    """Check if trait is an actual value (abstract principle)"""
    trait_lower = trait.lower().strip()
    
    # Check for value keywords
    for keyword in VALUE_KEYWORDS:
        if keyword in trait_lower:
            # Make sure it's not a method ("value analysis" vs "value")
            if trait_lower == keyword or trait_lower.startswith(keyword + ' ') or trait_lower.endswith(' ' + keyword):
                return True
    
    # Values are typically abstract nouns, not processes
    # Good: "integrity", "honesty", "freedom", "excellence"
    # Bad: "analytical thinking", "innovation process"
    
    # If it contains method/process words, it's not a value
    if is_method_or_process(trait):
        return False
    
    # Single word abstract nouns are likely values
    if re.match(r'^[a-z]+$', trait_lower) and len(trait_lower) < 20:
        # Exclude common adjectives that aren't values
        non_value_adjectives = ['analytical', 'creative', 'systematic', 'complex', 'simple']
        if trait_lower not in non_value_adjectives:
            return True
    
    return False

def clean_traits(data):
    """Clean traits in each category"""
    cleaned = {}
    
    for category, traits in data.items():
        if not isinstance(traits, list):
            cleaned[category] = traits
            continue
        
        cleaned_list = []
        
        for trait in traits:
            trait = trait.strip()
            if not trait:
                continue
            
            # Category-specific filtering
            if category == 'core_values':
                # Values should be abstract principles
                if is_actual_value(trait) and not is_method_or_process(trait) and not is_domain_specific(trait):
                    cleaned_list.append(trait)
            
            elif category == 'primary_traits':
                # Traits should be personality descriptors
                if is_actual_personality_trait(trait) and not is_method_or_process(trait) and not is_domain_specific(trait):
                    cleaned_list.append(trait)
            
            elif category in ['communication_tone', 'work_style']:
                # These can be more flexible, but still filter out methods
                if not is_method_or_process(trait) or trait.lower() in ['action-oriented', 'detail-oriented', 'results-oriented']:
                    cleaned_list.append(trait)
            
            else:
                # For other categories, just filter obvious methods
                if not is_method_or_process(trait):
                    cleaned_list.append(trait)
        
        # Remove duplicates and sort
        cleaned_list = sorted(list(set(cleaned_list)))
        cleaned[category] = cleaned_list
        
        print(f"{category}: {len(data[category])} -> {len(cleaned_list)} ({len(data[category]) - len(cleaned_list)} removed)")
    
    return cleaned

# Load and clean
with open('trait-data.json', 'r') as f:
    data = json.load(f)

print("Cleaning trait data...\n")
cleaned_data = clean_traits(data)

# Save cleaned data
with open('trait-data-cleaned.json', 'w') as f:
    json.dump(cleaned_data, f, indent=2)

print(f"\n✅ Cleaned data saved to trait-data-cleaned.json")
print(f"Total categories: {len(cleaned_data)}")

# Show sample results
for category in ['core_values', 'primary_traits']:
    print(f"\n{category.upper()} samples (first 20):")
    for trait in cleaned_data.get(category, [])[:20]:
        print(f"  - {trait}")

