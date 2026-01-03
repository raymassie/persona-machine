#!/usr/bin/env python3
"""
Strict cleaning: Focus only on actual personality traits and values.
Removes domain-specific, methodological, and process-oriented traits.
"""

import json
import re

# Explicit list of domain-specific words that should be removed from personality traits
DOMAIN_WORDS = {
    'algorithmic', 'advertising', 'animation', 'architectural', 'artistic', 'cinematic',
    'musical', 'typographic', 'mathematical', 'scientific', 'medical', 'business',
    'marketing', 'brand', 'customer', 'client', 'user', 'product', 'content', 'data',
    'ai', 'technology', 'software', 'hardware', 'design', 'engineering', 'cultural',
    'educational', 'environmental', 'organizational', 'operational', 'political',
    'technical', 'theoretical', 'macroeconomic', 'quantitative', 'scalable', 'structural',
    'behavioral', 'methodological', 'analytical'  # when used in compound phrases
}

# Method/process words that disqualify a trait
METHOD_WORDS = {
    'analysis', 'analyzing', 'assessment', 'evaluation', 'research', 'study',
    'application', 'implementation', 'development', 'creation', 'execution',
    'optimization', 'observation', 'exploration', 'experimentation', 'testing',
    'method', 'approach', 'technique', 'framework', 'system', 'process',
    'thinking', 'reasoning', 'innovation', 'transformation', 'disruption'
}

# Not personality traits (descriptors of things, not people)
NOT_PERSONALITY = {
    'actionable', 'behavioral', 'scalable', 'structural', 'referential', 'discursive',
    'encyclopedic', 'ergonomic', 'fundamental', 'global', 'holistic', 'immersive',
    'integrative', 'investigative', 'mediating', 'organizational', 'operational',
    'storytelling', 'suspenseful', 'transformational', 'transformative'
}

# Actual personality traits (universal descriptors of people)
PERSONALITY_TRAITS = {
    'accessible', 'action-oriented', 'adventurous', 'aggressive', 'altruistic',
    'ambitious', 'analytical', 'atmospheric', 'authentic', 'authoritative', 'blunt',
    'bold', 'brilliant', 'calculated', 'challenging', 'chaotic', 'charismatic', 'clear',
    'collaborative', 'communicative', 'compassionate', 'competitive', 'complex',
    'comprehensive', 'conceptual', 'confident', 'confrontational', 'conscious',
    'contemplative', 'controlling', 'controversial', 'conversational', 'counterintuitive',
    'courageous', 'creative', 'critical', 'curious', 'cynical', 'decisive', 'defiant',
    'demanding', 'democratic', 'developmental', 'dialectical', 'diplomatic', 'direct',
    'disciplined', 'disruptive', 'dramatic', 'dynamic', 'eclectic', 'efficient',
    'elegant', 'eloquent', 'emotional', 'empathetic', 'empirical', 'empowering',
    'energetic', 'engaging', 'enigmatic', 'enthusiastic', 'entrepreneurial', 'eternal',
    'ethical', 'existential', 'experimental', 'expressive', 'flamboyant', 'futuristic',
    'generous', 'groundbreaking', 'hardworking', 'helpful', 'historical', 'humanistic',
    'humble', 'humorous', 'hypercompetitive', 'iconoclastic', 'idealistic', 'inclusive',
    'independent', 'influential', 'innovative', 'insightful', 'inspiring', 'intellectual',
    'introspective', 'introverted', 'intuitive', 'irreverent', 'liberal', 'logical',
    'lyrical', 'meditative', 'melancholic', 'methodical', 'meticulous', 'moral',
    'motivational', 'mysterious', 'mystical', 'nostalgic', 'nurturing', 'observant',
    'obsessive', 'optimistic', 'organic', 'passionate', 'patient', 'patriotic', 'peaceful',
    'perfectionist', 'perfectionistic', 'persistent', 'personal', 'persuasive',
    'philanthropic', 'philosophical', 'pioneering', 'playful', 'powerful', 'practical',
    'pragmatic', 'prodigious', 'professional', 'progressive', 'prolific', 'prophetic',
    'provocative', 'psychological', 'rational', 'realistic', 'rebellious', 'reflective',
    'reformative', 'relatable', 'resilient', 'resourceful', 'results-oriented', 'rigorous',
    'risk-taking', 'romantic', 'satirical', 'sensitive', 'skeptical', 'social', 'spiritual',
    'spontaneous', 'stoic', 'strategic', 'symbolic', 'systematic', 'theatrical',
    'therapeutic', 'thoughtful', 'tolerant', 'transcendent', 'transparent', 'trustworthy',
    'truthful', 'unconventional', 'virtuosic', 'visionary', 'visual', 'vulnerable'
}

# Values (abstract principles, not methods)
CORE_VALUES = {
    'accessibility', 'action', 'adventure', 'antifragility', 'authenticity', 'beauty',
    'biodiversity', 'challenge', 'character', 'collaboration', 'compassion', 'conservation',
    'courage', 'creativity', 'dignity', 'diversity', 'education', 'empowerment', 'equality',
    'excellence', 'fairness', 'freedom', 'generosity', 'honesty', 'humility', 'inclusivity',
    'independence', 'integrity', 'justice', 'knowledge', 'loyalty', 'morality', 'openness',
    'peace', 'privacy', 'respect', 'responsibility', 'sustainability', 'transparency',
    'trust', 'truth', 'wisdom'
}

def is_compound_with_method(trait):
    """Check if trait is a compound phrase with a method word"""
    trait_lower = trait.lower()
    words = trait_lower.split()
    
    for word in words:
        if word in METHOD_WORDS:
            return True
    
    # Check for patterns like "analytical X", "methodological X"
    if re.match(r'^(analytical|methodological|algorithmic|data-driven|research-based)\s+', trait_lower):
        return True
    
    return False

def contains_domain_word(trait):
    """Check if trait contains domain-specific words"""
    trait_lower = trait.lower()
    words = set(re.findall(r'\b\w+\b', trait_lower))
    
    # Check if any word matches domain words
    if words.intersection(DOMAIN_WORDS):
        # Allow some exceptions
        if trait_lower in ['artistic', 'creative', 'analytical']:  # These can be personality traits when standalone
            return False
        return True
    
    return False

def clean_primary_traits(traits):
    """Clean primary traits to only include actual personality descriptors"""
    cleaned = []
    
    for trait in traits:
        trait_lower = trait.lower().strip()
        
        # Skip if it's explicitly not a personality trait
        if trait_lower in NOT_PERSONALITY:
            continue
        
        # Skip if it contains domain words (unless it's in our approved list)
        if contains_domain_word(trait) and trait_lower not in PERSONALITY_TRAITS:
            continue
        
        # Skip if it's a compound with method words
        if is_compound_with_method(trait):
            continue
        
        # If it's in our approved list, keep it
        if trait_lower in PERSONALITY_TRAITS:
            cleaned.append(trait)
            continue
        
        # For traits ending in -oriented, -focused, -driven, -based, -centered
        # Only keep specific approved ones
        if re.search(r'-(oriented|focused|driven|based|centered|minded)$', trait_lower):
            if trait_lower in ['action-oriented', 'detail-oriented', 'results-oriented', 'goal-oriented', 'people-oriented', 'team-oriented']:
                cleaned.append(trait)
            continue
        
        # Simple adjectives (single word, no hyphens, reasonable length)
        if re.match(r'^[a-z]+$', trait_lower) and len(trait_lower) < 20:
            # Common trait endings
            if re.search(r'(ive|ful|ous|ent|ant|ic|al|able|ible|ing|ed)$', trait_lower):
                if trait_lower not in DOMAIN_WORDS and trait_lower not in NOT_PERSONALITY:
                    cleaned.append(trait)
                    continue
        
        # If it passed all checks and seems like a personality trait, keep it
        # (conservative approach - only keep if we're confident)
        if len(trait_lower.split()) == 1 and len(trait_lower) < 25:
            if not contains_domain_word(trait) and not is_compound_with_method(trait):
                cleaned.append(trait)
    
    return cleaned

def clean_core_values(traits):
    """Clean core values to only include abstract principles"""
    cleaned = []
    
    for trait in traits:
        trait_lower = trait.lower().strip()
        
        # Skip compound phrases with method words
        if is_compound_with_method(trait):
            continue
        
        # Skip if it contains domain words (unless it's a recognized value)
        if contains_domain_word(trait) and trait_lower not in CORE_VALUES:
            continue
        
        # If it's in our approved values list, keep it
        if trait_lower in CORE_VALUES:
            cleaned.append(trait)
            continue
        
        # Single word abstract nouns are likely values
        if re.match(r'^[a-z]+$', trait_lower) and len(trait_lower) < 20:
            # Common value endings
            if trait_lower.endswith(('ity', 'ness', 'ment', 'tion', 'sion', 'cy', 'ty')) or trait_lower in ['truth', 'honor', 'duty', 'freedom', 'peace', 'justice']:
                if trait_lower not in DOMAIN_WORDS and not is_compound_with_method(trait):
                    cleaned.append(trait)
                    continue
        
        # Two-word phrases that are values (like "climate justice")
        if len(trait_lower.split()) == 2:
            words = trait_lower.split()
            # If second word is a value word
            if words[1] in ['justice', 'integrity', 'truth', 'excellence', 'freedom', 'rights', 'welfare']:
                if words[0] not in METHOD_WORDS and words[0] not in DOMAIN_WORDS:
                    cleaned.append(trait)
                    continue
    
    return cleaned

def clean_traits(data):
    """Clean traits in each category"""
    cleaned = {}
    
    for category, traits in data.items():
        if not isinstance(traits, list):
            cleaned[category] = traits
            continue
        
        if category == 'primary_traits':
            cleaned_list = clean_primary_traits(traits)
        elif category == 'core_values':
            cleaned_list = clean_core_values(traits)
        else:
            # For other categories, apply basic filtering
            cleaned_list = []
            for trait in traits:
                trait_lower = trait.lower().strip()
                if not is_compound_with_method(trait) and not contains_domain_word(trait):
                    cleaned_list.append(trait)
            cleaned_list = sorted(list(set(cleaned_list)))
        
        cleaned[category] = sorted(list(set(cleaned_list)))
        
        print(f"{category}: {len(traits)} -> {len(cleaned[category])} ({len(traits) - len(cleaned[category])} removed)")
    
    return cleaned

# Load and clean
with open('trait-data.json', 'r') as f:
    data = json.load(f)

print("Strictly cleaning trait data...\n")
cleaned_data = clean_traits(data)

# Save cleaned data
with open('trait-data-cleaned.json', 'w') as f:
    json.dump(cleaned_data, f, indent=2)

print(f"\n✅ Cleaned data saved to trait-data-cleaned.json")

# Show samples
for category in ['core_values', 'primary_traits']:
    print(f"\n{category.upper()} ({len(cleaned_data.get(category, []))} total):")
    for trait in cleaned_data.get(category, [])[:30]:
        print(f"  - {trait}")

