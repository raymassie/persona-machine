// Persona Engine - Main Application Logic

let traitData = {};
let personaData = {
    primary_traits: [],
    cognitive_style: '', // Single-select
    core_motivations: [],
    decision_making_framework: '',
    tone_dimensions: {
        formal_casual: 50,
        serious_funny: 0,
        respectful_irreverent: 0,
        matter_enthusiastic: 0
    },
    personality_dimensions: {
        passive_assertive: 50,
        pessimistic_optimistic: 50,
        closed_open: 50
    },
    behavioral_dimensions: {
        concise_detailed: 50,
        conservative_risk: 50,
        deliberate_quick: 50
    },
    interpersonal_dimensions: {
        empathy: 50,
        patience: 50,
        energy: 50
    },
    communication_tone: [],
    communication_sentence_structure: [],
    work_style: [],
    problem_solving_approach: [],
    learning_style: [],
    core_values: [],
    bias_awareness: [],
    growth_motivation: [],
    cognitive_humanism: [],
    humanistic_cognition: [],
    self_actualization: [],
    behavioral_growth: [],
    technology_adoption: 50, // Slider: 0=Resistant, 100=Early Adopter
    crisis_response: '', // Single-select
    influence_style: '', // Single-select
    resource_relationship: '', // Single-select
    time_orientation: '', // Single-select
    collaboration_style: '', // Single-select
    leadership_style: [],
    stress_responses: [],
    blind_spots: []
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    loadTraitData();
    initializeEventListeners();
    initializeCategories();
});

// Load trait data from JSON file
async function loadTraitData() {
    try {
        const response = await fetch('trait-data-cleaned.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        traitData = await response.json();
        console.log('✅ Trait data loaded:', Object.keys(traitData).length, 'categories');
        console.log('✅ Sample data:', {
            primary_traits: traitData.primary_traits?.length || 0,
            communication_tone: traitData.communication_tone?.length || 0
        });
        populateSelectors();
        // Show default preview after data is loaded
        updatePreview();
    } catch (error) {
        console.error('❌ Error loading trait data:', error);
        alert('Error loading trait data. Please make sure you are running this from a web server (not file://).\n\nYou can run: python3 -m http.server 8000');
    }
}

// Group traits by root word for progressive selection
function groupTraitsByRoot(traits) {
    const groups = {};
    const standalone = [];
    
    traits.forEach(trait => {
        // Split by whitespace, but preserve the original trait
        const words = trait.toLowerCase().trim().split(/\s+/);
        if (!words.length || !words[0]) return;
        
        // Extract root (first word, cleaned of punctuation)
        let root = words[0].replace(/[^\w-]/g, '');
        // If root has a hyphen, take only the part before the hyphen
        if (root.includes('-')) {
            root = root.split('-')[0];
        }
        
        // If multi-word phrase, group by root word
        if (words.length > 1) {
            if (!groups[root]) {
                groups[root] = [];
            }
            groups[root].push(trait);
        } else {
            // Single word trait - check if other traits start with this word
            const hasVariations = traits.some(t => {
                if (t === trait) return false;
                const tWords = t.toLowerCase().trim().split(/\s+/);
                return tWords.length > 1 && tWords[0].replace(/[^\w-]/g, '') === root;
            });
            if (hasVariations) {
                if (!groups[root]) {
                    groups[root] = [];
                }
                groups[root].push(trait);
            } else {
                standalone.push(trait);
            }
        }
    });
    
    // Filter groups to only those with 2+ items
    const filteredGroups = {};
    Object.keys(groups).forEach(root => {
        if (groups[root].length > 1) {
            filteredGroups[root] = groups[root].sort();
        } else {
            standalone.push(groups[root][0]);
        }
    });
    
    return { groups: filteredGroups, standalone: standalone.sort() };
}

// Populate all selectors with trait options
function populateSelectors() {
    // Fields that benefit from grouping (large lists with patterns)
    const groupedFields = [
        'core_values', 'core_motivations', 'communication_tone', 
        'work_style', 'problem_solving_approach', 'learning_style',
        'communication_sentence_structure', 'leadership_style', 
        'primary_traits', 'blind_spots', 'stress_responses',
        'growth_motivation', 'behavioral_growth', 'humanistic_cognition',
        'bias_awareness'
    ];
    
    // Single-select fields (only one selection allowed)
    const singleSelectFields = [
        'cognitive_style', 'crisis_response', 
        'influence_style', 'resource_relationship', 'time_orientation', 
        'collaboration_style'
    ];
    
    // All chip selector fields (both single and multi-select)
    const allChipFields = [
        'primary_traits', 'cognitive_style', 'core_motivations',
        'communication_tone', 'communication_sentence_structure', 
        'work_style', 'problem_solving_approach', 'learning_style',
        'core_values', 'bias_awareness', 'growth_motivation',
        'cognitive_humanism', 'humanistic_cognition', 'self_actualization',
        'behavioral_growth', 'crisis_response',
        'influence_style', 'resource_relationship', 'time_orientation',
        'collaboration_style', 'leadership_style', 'stress_responses', 
        'blind_spots'
    ];

    allChipFields.forEach(field => {
        const isSingleSelect = singleSelectFields.includes(field);
        const optionsContainer = document.getElementById(`${field}-options`);
        if (!optionsContainer) {
            console.warn(`⚠️ Options container not found: ${field}-options`);
            return;
        }
        if (!traitData[field]) {
            console.warn(`⚠️ No data for field: ${field}`);
            return;
        }
        
        // Clear container before populating
        optionsContainer.innerHTML = '';
        
        const allOptions = traitData[field];
        const useGrouping = groupedFields.includes(field) && allOptions.length >= 25;
        
        console.log(`🔍 Field: ${field}, In groupedFields: ${groupedFields.includes(field)}, Length: ${allOptions.length}, Will use grouping: ${useGrouping}`);
        
        if (useGrouping) {
            // Use grouped/progressive display
            const { groups, standalone } = groupTraitsByRoot(allOptions);
            console.log(`✅ Populating ${field} with grouped display: ${Object.keys(groups).length} groups, ${standalone.length} standalone`);
            
            const optionsWrapper = document.createElement('div');
            optionsWrapper.className = 'trait-options-wrapper';
            optionsContainer.appendChild(optionsWrapper);
            
            // Add grouped options
            Object.keys(groups).sort().forEach(root => {
                const items = groups[root];
                const groupContainer = document.createElement('div');
                groupContainer.className = 'trait-group-item';
                
                const groupHeader = document.createElement('div');
                groupHeader.className = 'trait-group-header';
                groupHeader.innerHTML = `<span class="group-name">${root}</span> <span class="group-count">(${items.length})</span> <span class="group-toggle">+</span>`;
                
                // Use mousedown to prevent input blur
                groupHeader.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    const isExpanded = groupContainer.classList.contains('expanded');
                    const itemsContainer = groupContainer.querySelector('.trait-group-items');
                    
                    if (isExpanded) {
                        groupContainer.classList.remove('expanded');
                        groupHeader.querySelector('.group-toggle').textContent = '+';
                        itemsContainer.style.display = 'none';
                    } else {
                        groupContainer.classList.add('expanded');
                        groupHeader.querySelector('.group-toggle').textContent = '−';
                        itemsContainer.style.display = 'block';
                    }
                    
                    return false;
                });
                groupContainer.appendChild(groupHeader);
                
                const itemsContainer = document.createElement('div');
                itemsContainer.className = 'trait-group-items';
                itemsContainer.style.display = 'none';
                
                items.forEach(item => {
                    const option = document.createElement('div');
                    option.className = 'trait-option trait-option-nested';
                    option.textContent = item;
                    option.dataset.value = item;
                    option.addEventListener('mousedown', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    });
                    option.addEventListener('click', (e) => {
                        e.stopPropagation();
                        toggleTrait(field, item, isSingleSelect);
                    });
                    itemsContainer.appendChild(option);
                });
                
                groupContainer.appendChild(itemsContainer);
                optionsWrapper.appendChild(groupContainer);
            });
            
            // Add standalone options
            standalone.forEach(trait => {
                const option = document.createElement('div');
                option.className = 'trait-option';
                option.textContent = trait;
                option.dataset.value = trait;
                option.addEventListener('click', () => toggleTrait(field, trait, isSingleSelect));
                optionsWrapper.appendChild(option);
            });
            
        } else {
            // Use simple progressive display (first 50, then show all)
            const maxInitialDisplay = 50;
            const hasMore = allOptions.length > maxInitialDisplay;
            
            console.log(`✅ Populating ${field} with ${allOptions.length} options (showing ${Math.min(maxInitialDisplay, allOptions.length)} initially)`);
            
            const optionsWrapper = document.createElement('div');
            optionsWrapper.className = 'trait-options-wrapper';
            optionsContainer.appendChild(optionsWrapper);
            
            if (hasMore) {
                const showAllBtn = document.createElement('button');
                showAllBtn.className = 'show-all-btn';
                showAllBtn.textContent = `Show All (${allOptions.length} total)`;
                showAllBtn.type = 'button';
                showAllBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isExpanded = optionsWrapper.classList.contains('expanded');
                    
                    if (isExpanded) {
                        optionsWrapper.classList.remove('expanded');
                        showAllBtn.textContent = `Show All (${allOptions.length} total)`;
                        optionsWrapper.querySelectorAll('.trait-option').forEach((option, index) => {
                            option.style.display = index < maxInitialDisplay ? 'block' : 'none';
                        });
                    } else {
                        optionsWrapper.classList.add('expanded');
                        showAllBtn.textContent = 'Show Less';
                        optionsWrapper.querySelectorAll('.trait-option').forEach(option => {
                            option.style.display = 'block';
                        });
                    }
                });
                optionsContainer.appendChild(showAllBtn);
            }
            
            allOptions.forEach((trait, index) => {
                const option = document.createElement('div');
                option.className = 'trait-option';
                option.textContent = trait;
                option.dataset.value = trait;
                option.style.display = index < maxInitialDisplay ? 'block' : 'none';
                option.addEventListener('click', () => toggleTrait(field, trait, isSingleSelect));
                optionsWrapper.appendChild(option);
            });
        }
    });
}

// Initialize category toggles
function initializeCategories() {
    const categories = ['core', 'communication', 'behavioral', 'values', 'humanism', 'tier1', 'tier2', 'stress'];
    categories.forEach(cat => {
        const header = document.querySelector(`[data-category="${cat}"] .category-header`);
        if (header) {
            const content = document.getElementById(`${cat}-content`);
            if (content) {
                // Start with first category open
                if (cat === 'core') {
                    header.classList.add('active');
                    content.classList.add('active');
                }
            }
        }
    });
}

// Toggle category expansion
function toggleCategory(category) {
    const header = document.querySelector(`[data-category="${category}"] .category-header`);
    const content = document.getElementById(`${category}-content`);
    
    if (header && content) {
        const isActive = header.classList.contains('active');
        
        if (isActive) {
            header.classList.remove('active');
            content.classList.remove('active');
        } else {
            header.classList.add('active');
            content.classList.add('active');
        }
    }
}

// Handle trait search input
function initializeEventListeners() {
    // Trait search inputs
    document.querySelectorAll('.trait-search').forEach(input => {
        input.addEventListener('input', (e) => {
            const field = e.target.dataset.search;
            filterTraitOptions(field, e.target.value);
        });
        
        input.addEventListener('focus', (e) => {
            const field = e.target.dataset.search;
            const options = document.getElementById(`${field}-options`);
            if (options) {
                options.classList.add('active');
            }
        });
        
        input.addEventListener('blur', (e) => {
            // Delay to allow click events
            setTimeout(() => {
                const field = e.target.dataset.search;
                const options = document.getElementById(`${field}-options`);
                if (options) {
                    options.classList.remove('active');
                }
            }, 200);
        });
        
        // Show placeholder hint when field is focused and empty
        input.addEventListener('focus', (e) => {
            const field = e.target.dataset.search;
            const selectedContainer = document.getElementById(`${field}-selected`);
            if (selectedContainer && (!personaData[field] || personaData[field].length === 0)) {
                // Could add a subtle hint here if needed
            }
        });
    });


    // Textarea inputs (like decision_making_framework)
    document.querySelectorAll('.trait-textarea[data-field]').forEach(textarea => {
        textarea.addEventListener('input', (e) => {
            const field = e.target.dataset.field;
            personaData[field] = e.target.value || '';
            updatePreview();
        });
    });

    // Format radio buttons (custom Atlas-style) - exclude modal buttons
    document.querySelectorAll('.radio-button:not([data-modal="true"])').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const format = button.dataset.format;
            selectFormat(format);
            updatePreview();
        });
    });
    
    // Also handle label clicks - exclude modal labels
    document.querySelectorAll('.format-toggles:not(.modal-format-toggles) .format-option label').forEach(label => {
        label.addEventListener('click', (e) => {
            e.stopPropagation();
            const formatOption = label.closest('.format-option');
            const radioButton = formatOption.querySelector('.radio-button');
            const format = radioButton.dataset.format;
            selectFormat(format);
            updatePreview();
        });
    });
    

    // Tone sliders
    document.querySelectorAll('.tone-slider').forEach(slider => {
        slider.addEventListener('input', (e) => {
            const dimension = e.target.dataset.dimension;
            const value = parseInt(e.target.value);
            personaData.tone_dimensions[dimension] = value;
            updateTonePreview();
            updatePreview();
        });
    });
    
    // Personality sliders
    document.querySelectorAll('.personality-slider').forEach(slider => {
        slider.addEventListener('input', (e) => {
            const dimension = e.target.dataset.dimension;
            const value = parseInt(e.target.value);
            personaData.personality_dimensions[dimension] = value;
            updatePreview();
        });
    });
    
    // Behavioral sliders
    document.querySelectorAll('.behavioral-slider').forEach(slider => {
        slider.addEventListener('input', (e) => {
            const dimension = e.target.dataset.dimension;
            const value = parseInt(e.target.value);
            personaData.behavioral_dimensions[dimension] = value;
            updatePreview();
        });
    });
    
    // Interpersonal sliders
    document.querySelectorAll('.interpersonal-slider').forEach(slider => {
        slider.addEventListener('input', (e) => {
            const dimension = e.target.dataset.dimension;
            const value = parseInt(e.target.value);
            personaData.interpersonal_dimensions[dimension] = value;
            updatePreview();
        });
    });
    
    // Tier 1 sliders
    document.querySelectorAll('.tier1-slider').forEach(slider => {
        slider.addEventListener('input', (e) => {
            const dimension = e.target.dataset.dimension;
            const value = parseInt(e.target.value);
            personaData[dimension] = value;
            updatePreview();
        });
    });
    
    // Initialize tone preview
    updateTonePreview();

    // Clear all button
    document.getElementById('clear-all-btn').addEventListener('click', clearAll);
    document.getElementById('random-btn').addEventListener('click', randomizePersona);

    // Copy and download buttons
    document.getElementById('copy-btn').addEventListener('click', copyPreview);
    document.getElementById('download-btn').addEventListener('click', downloadPreview);
}

// Filter trait options based on search
function filterTraitOptions(field, searchTerm) {
    const options = document.getElementById(`${field}-options`);
    if (!options) return;

    const term = searchTerm.toLowerCase();
    const wrapper = options.querySelector('.trait-options-wrapper');
    if (!wrapper) return;
    
    const showAllBtn = options.querySelector('.show-all-btn');
    const groupItems = wrapper.querySelectorAll('.trait-group-item');
    const standaloneOptions = wrapper.querySelectorAll('.trait-option:not(.trait-option-nested)');
    
    if (groupItems.length > 0) {
        // Handle grouped display
        groupItems.forEach(groupItem => {
            const groupHeader = groupItem.querySelector('.trait-group-header');
            const groupName = groupHeader.querySelector('.group-name').textContent.toLowerCase();
            const itemsContainer = groupItem.querySelector('.trait-group-items');
            const nestedOptions = itemsContainer.querySelectorAll('.trait-option-nested');
            
            let hasMatch = false;
            
            // Check if group name matches
            if (term === '' || groupName.includes(term)) {
                hasMatch = true;
            }
            
            // Check nested options
            nestedOptions.forEach(option => {
                const text = option.textContent.toLowerCase();
                if (term === '' || text.includes(term)) {
                    option.style.display = 'block';
                    hasMatch = true;
                } else {
                    option.style.display = 'none';
                }
            });
            
            // Show/hide group based on matches
            if (term === '' || hasMatch) {
                groupItem.style.display = 'block';
                // Auto-expand if searching
                if (term !== '' && hasMatch) {
                    groupItem.classList.add('expanded');
                    groupHeader.querySelector('.group-toggle').textContent = '−';
                    itemsContainer.style.display = 'block';
                }
            } else {
                groupItem.style.display = 'none';
            }
        });
        
        // Handle standalone options
        standaloneOptions.forEach(option => {
            const text = option.textContent.toLowerCase();
            if (term === '' || text.includes(term)) {
                option.style.display = 'block';
            } else {
                option.style.display = 'none';
            }
        });
    } else {
        // Handle simple display
        const optionElements = wrapper.querySelectorAll('.trait-option');
        
        optionElements.forEach(option => {
            const text = option.textContent.toLowerCase();
            if (term === '' || text.includes(term)) {
                option.style.display = 'block';
            } else {
                option.style.display = 'none';
            }
        });
        
        // Show/hide "Show All" button based on search
        if (showAllBtn) {
            if (term === '') {
                showAllBtn.style.display = 'block';
            } else {
                showAllBtn.style.display = 'none';
            }
        }
    }
}

// Toggle trait selection
function toggleTrait(field, trait, isSingleSelect = false) {
    if (isSingleSelect) {
        // Single-select: replace current selection
        if (personaData[field] === trait) {
            // Deselect if clicking the same trait
            personaData[field] = '';
        } else {
            personaData[field] = trait;
        }
    } else {
        // Multi-select: toggle selection
        if (!personaData[field]) {
            personaData[field] = [];
        }
        
        // Ensure it's an array
        if (!Array.isArray(personaData[field])) {
            personaData[field] = [];
        }
        
        const index = personaData[field].indexOf(trait);
        if (index > -1) {
            personaData[field].splice(index, 1);
        } else {
            personaData[field].push(trait);
        }
    }
    
    updateTraitDisplay(field, isSingleSelect);
    updatePreview();
}

// Update trait display (chips)
function updateTraitDisplay(field, isSingleSelect = false) {
    const selectedContainer = document.getElementById(`${field}-selected`);
    if (!selectedContainer) return;

    selectedContainer.innerHTML = '';
    
    if (isSingleSelect) {
        // Single-select: show one chip
        if (personaData[field] && personaData[field] !== '') {
            const chip = document.createElement('span');
            chip.className = 'trait-chip';
            chip.innerHTML = `${personaData[field]} <span class="remove" onclick="removeTrait('${field}', '${personaData[field].replace(/'/g, "\\'")}')">×</span>`;
            selectedContainer.appendChild(chip);
        }
    } else {
        // Multi-select: show multiple chips
        if (personaData[field] && Array.isArray(personaData[field]) && personaData[field].length > 0) {
            personaData[field].forEach(trait => {
                const chip = document.createElement('span');
                chip.className = 'trait-chip';
                chip.innerHTML = `${trait} <span class="remove" onclick="removeTrait('${field}', '${trait.replace(/'/g, "\\'")}')">×</span>`;
                selectedContainer.appendChild(chip);
            });
        }
    }

    // Update option selected state
    const options = document.getElementById(`${field}-options`);
    if (options) {
        options.querySelectorAll('.trait-option').forEach(option => {
            const value = option.dataset.value;
            let isSelected = false;
            
            if (isSingleSelect) {
                isSelected = personaData[field] === value;
            } else {
                isSelected = Array.isArray(personaData[field]) && personaData[field].includes(value);
            }
            
            if (isSelected) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
        
        // Also update nested options in grouped displays
        options.querySelectorAll('.trait-option-nested').forEach(option => {
            const value = option.dataset.value;
            let isSelected = false;
            
            if (isSingleSelect) {
                isSelected = personaData[field] === value;
            } else {
                isSelected = Array.isArray(personaData[field]) && personaData[field].includes(value);
            }
            
            if (isSelected) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
    }
}

// Remove trait
function removeTrait(field, trait) {
    // Check if it's a single-select field
    const selector = document.querySelector(`[data-field="${field}"]`);
    const isSingleSelect = selector && selector.dataset.singleSelect === 'true';
    
    if (isSingleSelect) {
        personaData[field] = '';
    } else {
        if (personaData[field] && Array.isArray(personaData[field])) {
            const index = personaData[field].indexOf(trait);
            if (index > -1) {
                personaData[field].splice(index, 1);
            }
        }
    }
    
    updateTraitDisplay(field, isSingleSelect);
    updatePreview();
}


// Update tone preview text based on slider positions
function updateTonePreview() {
    const preview = document.getElementById('tone-preview-text');
    if (!preview) return;

    const tones = personaData.tone_dimensions;
    let message = "";
    
    // Determine message based on all four dimensions
    // Match the examples from the image
    
    // Example 1: Formal, Serious, Respectful, Matter-of-fact
    if (tones.formal_casual < 25 && tones.serious_funny < 25 && 
        tones.respectful_irreverent < 25 && tones.matter_enthusiastic < 25) {
        message = "We apologize, but we are experiencing a problem.";
    }
    // Example 2: Slightly Casual, Serious, Respectful, Matter-of-fact
    else if (tones.formal_casual >= 25 && tones.formal_casual < 60 && 
             tones.serious_funny < 25 && tones.respectful_irreverent < 25 && 
             tones.matter_enthusiastic < 25) {
        message = "We're sorry, but we're experiencing a problem on our end.";
    }
    // Example 3: Casual, Serious, Respectful, Slightly Enthusiastic
    else if (tones.formal_casual >= 60 && tones.serious_funny < 25 && 
             tones.respectful_irreverent < 25 && 
             tones.matter_enthusiastic >= 25 && tones.matter_enthusiastic < 60) {
        message = "Oops! We're sorry, but we're experiencing a problem on our end.";
    }
    // Example 4: Casual, Slightly Funny, Irreverent, Enthusiastic
    else if (tones.formal_casual >= 60 && tones.serious_funny >= 25 && 
             tones.respectful_irreverent >= 60 && tones.matter_enthusiastic >= 60) {
        message = "What did you do!? You broke it! (Just kidding. We're experiencing a problem on our end.)";
    }
    // Dynamic generation for other combinations
    else {
        // Start with base message
        if (tones.formal_casual < 30) {
            message = "We apologize, but we are experiencing a problem.";
        } else if (tones.formal_casual < 60) {
            message = "We're sorry, but we're experiencing a problem on our end.";
        } else {
            message = "Oops! We're experiencing a problem on our end.";
        }
        
        // Add funny element
        if (tones.serious_funny > 40 && tones.formal_casual > 60) {
            message = "What did you do!? You broke it! (Just kidding. " + message.toLowerCase() + ")";
        }
        
        // Add enthusiastic element
        if (tones.matter_enthusiastic > 50) {
            message = message.replace("experiencing a problem", "experiencing a problem, but we're on it!");
        }
        
        // Adjust for irreverent
        if (tones.respectful_irreverent > 70 && tones.formal_casual > 60) {
            message = "What did you do!? You broke it! (Just kidding. We're experiencing a problem on our end.)";
        }
    }
    
    preview.textContent = message;
}

// Clear all selections
function clearAll() {
    if (confirm('Clear all personality parameters?')) {
        Object.keys(personaData).forEach(key => {
            if (key === 'tone_dimensions') {
                personaData.tone_dimensions = {
                    formal_casual: 50,
                    serious_funny: 0,
                    respectful_irreverent: 0,
                    matter_enthusiastic: 0
                };
            } else if (key === 'personality_dimensions') {
                personaData.personality_dimensions = {
                    passive_assertive: 50,
                    pessimistic_optimistic: 50,
                    closed_open: 50
                };
            } else if (key === 'behavioral_dimensions') {
                personaData.behavioral_dimensions = {
                    concise_detailed: 50,
                    conservative_risk: 50,
                    deliberate_quick: 50
                };
            } else if (key === 'interpersonal_dimensions') {
                personaData.interpersonal_dimensions = {
                    empathy: 50,
                    patience: 50,
                    energy: 50
                };
            } else if (Array.isArray(personaData[key])) {
                personaData[key] = [];
            } else {
                personaData[key] = '';
            }
        });
        
        // Reset all sliders
        document.querySelectorAll('.tone-slider').forEach(slider => {
            const dimension = slider.dataset.dimension;
            if (dimension === 'formal_casual') {
                slider.value = 50;
            } else {
                slider.value = 0;
            }
        });
        
        document.querySelectorAll('.personality-slider, .behavioral-slider, .interpersonal-slider, .tier1-slider').forEach(slider => {
            slider.value = 50;
        });
        
        updateTonePreview();

        // Reset all displays
        document.querySelectorAll('.selected-traits').forEach(container => {
            container.innerHTML = '';
        });

        document.querySelectorAll('.trait-textarea').forEach(textarea => {
            textarea.value = '';
        });

        document.querySelectorAll('.trait-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Update trait displays for all fields
        const singleSelectFields = [
            'cognitive_style', 'crisis_response',
            'influence_style', 'resource_relationship', 'time_orientation',
            'collaboration_style'
        ];
        
        const allChipFields = [
            'primary_traits', 'cognitive_style', 'core_motivations',
            'communication_tone', 'communication_sentence_structure', 
            'work_style', 'problem_solving_approach', 'learning_style',
            'core_values', 'bias_awareness', 'growth_motivation',
            'cognitive_humanism', 'humanistic_cognition', 'self_actualization',
            'behavioral_growth', 'crisis_response',
            'influence_style', 'resource_relationship', 'time_orientation',
            'collaboration_style', 'leadership_style', 'stress_responses', 
            'blind_spots'
        ];
        
        allChipFields.forEach(field => {
            const isSingleSelect = singleSelectFields.includes(field);
            updateTraitDisplay(field, isSingleSelect);
        });

        updatePreview();
    }
}

// Randomize persona - generates random personality parameters
function randomizePersona() {
    if (!traitData || Object.keys(traitData).length === 0) {
        alert('Trait data not loaded yet. Please wait a moment and try again.');
        return;
    }
    
    // Clear existing selections first
    Object.keys(personaData).forEach(key => {
        if (key === 'tone_dimensions') {
            personaData.tone_dimensions = {
                formal_casual: 50,
                serious_funny: 0,
                respectful_irreverent: 0,
                matter_enthusiastic: 0
            };
        } else if (key === 'personality_dimensions') {
            personaData.personality_dimensions = {
                passive_assertive: 50,
                pessimistic_optimistic: 50,
                closed_open: 50
            };
        } else if (key === 'behavioral_dimensions') {
            personaData.behavioral_dimensions = {
                concise_detailed: 50,
                conservative_risk: 50,
                deliberate_quick: 50
            };
        } else if (key === 'interpersonal_dimensions') {
            personaData.interpersonal_dimensions = {
                empathy: 50,
                patience: 50,
                energy: 50
            };
        } else if (key === 'technology_adoption') {
            // Technology adoption is a slider, keep as number
            personaData.technology_adoption = 50;
        } else if (Array.isArray(personaData[key])) {
            personaData[key] = [];
        } else {
            personaData[key] = '';
        }
    });
    
    // Helper function to get random items from array
    function getRandomItems(array, min = 2, max = 6) {
        if (!array || array.length === 0) return [];
        const count = Math.floor(Math.random() * (max - min + 1)) + min;
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, array.length));
    }
    
    // Helper function to get random item from array
    function getRandomItem(array) {
        if (!array || array.length === 0) return '';
        return array[Math.floor(Math.random() * array.length)];
    }
    
    // Helper function for random slider value
    function randomSliderValue() {
        return Math.floor(Math.random() * 101);
    }
    
    // Randomize sliders
    personaData.tone_dimensions.formal_casual = randomSliderValue();
    personaData.tone_dimensions.serious_funny = randomSliderValue();
    personaData.tone_dimensions.respectful_irreverent = randomSliderValue();
    personaData.tone_dimensions.matter_enthusiastic = randomSliderValue();
    
    personaData.personality_dimensions.passive_assertive = randomSliderValue();
    personaData.personality_dimensions.pessimistic_optimistic = randomSliderValue();
    personaData.personality_dimensions.closed_open = randomSliderValue();
    
    personaData.behavioral_dimensions.concise_detailed = randomSliderValue();
    personaData.behavioral_dimensions.conservative_risk = randomSliderValue();
    personaData.behavioral_dimensions.deliberate_quick = randomSliderValue();
    
    personaData.interpersonal_dimensions.empathy = randomSliderValue();
    personaData.interpersonal_dimensions.patience = randomSliderValue();
    personaData.interpersonal_dimensions.energy = randomSliderValue();
    
    personaData.technology_adoption = randomSliderValue();
    
    // Randomize array fields (select 2-6 random items)
    const arrayFields = [
        'primary_traits', 'core_motivations', 'communication_tone',
        'communication_sentence_structure', 'work_style', 'problem_solving_approach',
        'learning_style', 'core_values', 'bias_awareness', 'growth_motivation',
        'cognitive_humanism', 'humanistic_cognition', 'self_actualization',
        'behavioral_growth', 'leadership_style', 'stress_responses', 'blind_spots'
    ];
    
    arrayFields.forEach(field => {
        if (traitData[field] && Array.isArray(traitData[field]) && traitData[field].length > 0) {
            personaData[field] = getRandomItems(traitData[field], 2, 6);
        }
    });
    
    // Randomize single-select fields
    if (traitData.cognitive_style && traitData.cognitive_style.length > 0) {
        personaData.cognitive_style = getRandomItem(traitData.cognitive_style);
    }
    
    if (traitData.crisis_response && traitData.crisis_response.length > 0) {
        personaData.crisis_response = getRandomItem(traitData.crisis_response);
    }
    
    if (traitData.influence_style && traitData.influence_style.length > 0) {
        personaData.influence_style = getRandomItem(traitData.influence_style);
    }
    
    if (traitData.resource_relationship && traitData.resource_relationship.length > 0) {
        personaData.resource_relationship = getRandomItem(traitData.resource_relationship);
    }
    
    if (traitData.time_orientation && traitData.time_orientation.length > 0) {
        personaData.time_orientation = getRandomItem(traitData.time_orientation);
    }
    
    if (traitData.collaboration_style && traitData.collaboration_style.length > 0) {
        personaData.collaboration_style = getRandomItem(traitData.collaboration_style);
    }
    
    // Update UI - sliders
    document.querySelectorAll('.tone-slider').forEach(slider => {
        const dimension = slider.dataset.dimension;
        if (personaData.tone_dimensions[dimension] !== undefined) {
            slider.value = personaData.tone_dimensions[dimension];
        }
    });
    
    document.querySelectorAll('.personality-slider').forEach(slider => {
        const dimension = slider.dataset.dimension;
        if (personaData.personality_dimensions[dimension] !== undefined) {
            slider.value = personaData.personality_dimensions[dimension];
        }
    });
    
    document.querySelectorAll('.behavioral-slider').forEach(slider => {
        const dimension = slider.dataset.dimension;
        if (personaData.behavioral_dimensions[dimension] !== undefined) {
            slider.value = personaData.behavioral_dimensions[dimension];
        }
    });
    
    document.querySelectorAll('.interpersonal-slider').forEach(slider => {
        const dimension = slider.dataset.dimension;
        if (personaData.interpersonal_dimensions[dimension] !== undefined) {
            slider.value = personaData.interpersonal_dimensions[dimension];
        }
    });
    
    document.querySelectorAll('.tier1-slider').forEach(slider => {
        const dimension = slider.dataset.dimension;
        if (personaData[dimension] !== undefined) {
            slider.value = personaData[dimension];
        }
    });
    
    updateTonePreview();
    
    // Update single-select chip fields
        const singleSelectFields = [
            'cognitive_style', 'crisis_response',
            'influence_style', 'resource_relationship', 'time_orientation',
            'collaboration_style'
        ];
        
        singleSelectFields.forEach(field => {
            if (personaData[field]) {
                updateTraitDisplay(field, true);
            }
        });
    
    // Update multi-select fields - clear UI first, then select random traits
    arrayFields.forEach(field => {
        if (personaData[field] && Array.isArray(personaData[field])) {
            // Clear existing UI selections
            const options = document.querySelectorAll(`#${field}-options .trait-option`);
            options.forEach(opt => opt.classList.remove('selected'));
            
            // Select the random traits
            personaData[field].forEach(trait => {
                const option = Array.from(options).find(opt => {
                    const text = opt.textContent.trim();
                    return text === trait || text === trait.replace(/\s+/g, ' ').trim();
                });
                if (option) {
                    option.classList.add('selected');
                }
            });
            
            // Update display
            updateTraitDisplay(field);
        }
    });
    
    // Update preview
    updatePreview();
    
    // Scroll to top to show the results
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Get selected format from custom radio buttons
function getSelectedFormat() {
    const checked = document.querySelector('.radio-button.checked');
    return checked ? checked.dataset.format : 'markdown';
}

// Select format (update custom radio buttons)
function selectFormat(format) {
    document.querySelectorAll('.radio-button').forEach(btn => {
        btn.classList.remove('checked');
    });
    const selectedBtn = document.querySelector(`.radio-button[data-format="${format}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('checked');
    }
}

// Update preview
function updatePreview() {
    const format = getSelectedFormat();
    const previewContent = document.getElementById('preview-content');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');

    // Always show the preview, even with default/empty data
    copyBtn.disabled = false;
    downloadBtn.disabled = false;

    let output = '';
    switch (format) {
        case 'markdown':
            output = generateMarkdown();
            break;
        case 'json':
            output = generateJSON();
            break;
        case 'yaml':
            output = generateYAML();
            break;
    }

    previewContent.innerHTML = `<pre>${escapeHtml(output)}</pre>`;
    copyBtn.disabled = false;
    downloadBtn.disabled = false;
}

// Helper function to convert technology adoption slider value to label
function getTechnologyAdoptionLabel(value) {
    if (value <= 20) return 'Resistant';
    if (value <= 40) return 'Skeptical';
    if (value <= 60) return 'Selective';
    if (value <= 80) return 'Pragmatic';
    return 'Early Adopter';
}

// Generate Markdown format
function generateMarkdown() {
    let md = '# AI Agent Persona\n\n';
    md += '**Generated by Persona Engine**\n\n';
    md += '---\n\n';

    // Core Personality
    if (personaData.primary_traits.length > 0 || personaData.cognitive_style || personaData.core_motivations.length > 0 || personaData.decision_making_framework || personaData.personality_dimensions) {
        md += '## Core Personality\n\n';
        
        // Personality Dimensions
        if (personaData.personality_dimensions) {
            md += '### Personality Dimensions\n';
            md += `- **Passive ↔ Assertive**: ${personaData.personality_dimensions.passive_assertive}% (${personaData.personality_dimensions.passive_assertive < 30 ? 'Passive' : personaData.personality_dimensions.passive_assertive > 70 ? 'Assertive' : 'Moderate'})\n`;
            md += `- **Pessimistic ↔ Optimistic**: ${personaData.personality_dimensions.pessimistic_optimistic}% (${personaData.personality_dimensions.pessimistic_optimistic < 30 ? 'Pessimistic' : personaData.personality_dimensions.pessimistic_optimistic > 70 ? 'Optimistic' : 'Moderate'})\n`;
            md += `- **Closed-minded ↔ Open-minded**: ${personaData.personality_dimensions.closed_open}% (${personaData.personality_dimensions.closed_open < 30 ? 'Closed-minded' : personaData.personality_dimensions.closed_open > 70 ? 'Open-minded' : 'Moderate'})\n\n`;
        }
        
        if (personaData.primary_traits.length > 0) {
            md += '### Primary Traits\n';
            md += personaData.primary_traits.map(t => `- ${t}`).join('\n') + '\n\n';
        }
        
        if (personaData.cognitive_style) {
            md += `### Cognitive Style\n${personaData.cognitive_style}\n\n`;
        }
        
        if (personaData.core_motivations.length > 0) {
            md += '### Core Motivations\n';
            md += personaData.core_motivations.map(m => `- ${m}`).join('\n') + '\n\n';
        }
        
        if (personaData.decision_making_framework) {
            md += `### Decision Making Framework\n${personaData.decision_making_framework}\n\n`;
        }
    }

    // Communication Style
    if (personaData.tone_dimensions || personaData.communication_tone.length > 0 || personaData.communication_sentence_structure.length > 0) {
        md += '## Communication Style\n\n';
        
        // Tone Dimensions
        if (personaData.tone_dimensions) {
            md += '### Tone of Voice Dimensions\n';
            md += `- **Formal ↔ Casual**: ${personaData.tone_dimensions.formal_casual}% (${personaData.tone_dimensions.formal_casual < 30 ? 'Formal' : personaData.tone_dimensions.formal_casual > 70 ? 'Casual' : 'Moderate'})\n`;
            md += `- **Serious ↔ Funny**: ${personaData.tone_dimensions.serious_funny}% (${personaData.tone_dimensions.serious_funny < 30 ? 'Serious' : personaData.tone_dimensions.serious_funny > 70 ? 'Funny' : 'Moderate'})\n`;
            md += `- **Respectful ↔ Irreverent**: ${personaData.tone_dimensions.respectful_irreverent}% (${personaData.tone_dimensions.respectful_irreverent < 30 ? 'Respectful' : personaData.tone_dimensions.respectful_irreverent > 70 ? 'Irreverent' : 'Moderate'})\n`;
            md += `- **Matter-of-fact ↔ Enthusiastic**: ${personaData.tone_dimensions.matter_enthusiastic}% (${personaData.tone_dimensions.matter_enthusiastic < 30 ? 'Matter-of-fact' : personaData.tone_dimensions.matter_enthusiastic > 70 ? 'Enthusiastic' : 'Moderate'})\n\n`;
        }
        
        if (personaData.communication_tone.length > 0) {
            md += '### Additional Tone Traits\n';
            md += personaData.communication_tone.map(t => `- ${t}`).join('\n') + '\n\n';
        }
        
        if (personaData.communication_sentence_structure.length > 0) {
            md += '### Sentence Structure\n';
            md += personaData.communication_sentence_structure.map(s => `- ${s}`).join('\n') + '\n\n';
        }
    }

    // Behavioral Patterns
    if (personaData.work_style.length > 0 || personaData.problem_solving_approach.length > 0 || personaData.learning_style.length > 0 || personaData.behavioral_dimensions) {
        md += '## Behavioral Patterns\n\n';
        
        // Behavioral Dimensions
        if (personaData.behavioral_dimensions) {
            md += '### Behavioral Dimensions\n';
            md += `- **Concise ↔ Detailed**: ${personaData.behavioral_dimensions.concise_detailed}% (${personaData.behavioral_dimensions.concise_detailed < 30 ? 'Concise' : personaData.behavioral_dimensions.concise_detailed > 70 ? 'Detailed' : 'Moderate'})\n`;
            md += `- **Conservative ↔ Risk-taking**: ${personaData.behavioral_dimensions.conservative_risk}% (${personaData.behavioral_dimensions.conservative_risk < 30 ? 'Conservative' : personaData.behavioral_dimensions.conservative_risk > 70 ? 'Risk-taking' : 'Moderate'})\n`;
            md += `- **Deliberate ↔ Quick**: ${personaData.behavioral_dimensions.deliberate_quick}% (${personaData.behavioral_dimensions.deliberate_quick < 30 ? 'Deliberate' : personaData.behavioral_dimensions.deliberate_quick > 70 ? 'Quick' : 'Moderate'})\n\n`;
        }
        
        if (personaData.work_style.length > 0) {
            md += '### Work Style\n';
            md += personaData.work_style.map(w => `- ${w}`).join('\n') + '\n\n';
        }
        
        if (personaData.problem_solving_approach.length > 0) {
            md += '### Problem Solving Approach\n';
            md += personaData.problem_solving_approach.map(p => `- ${p}`).join('\n') + '\n\n';
        }
        
        if (personaData.learning_style.length > 0) {
            md += '### Learning Style\n';
            md += personaData.learning_style.map(l => `- ${l}`).join('\n') + '\n\n';
        }
    }

    // Values
    if (personaData.core_values.length > 0) {
        md += '## Values & Ethics\n\n';
        md += '### Core Values\n';
        md += personaData.core_values.map(v => `- ${v}`).join('\n') + '\n\n';
    }

    // Behavioral Humanism
    if (personaData.bias_awareness.length > 0 || personaData.growth_motivation.length > 0 || 
        personaData.cognitive_humanism.length > 0 || personaData.humanistic_cognition.length > 0 ||
        personaData.self_actualization.length > 0 || personaData.behavioral_growth.length > 0) {
        md += '## Behavioral Humanism\n\n';
        
        if (personaData.bias_awareness.length > 0) {
            md += '### Bias Awareness\n';
            md += personaData.bias_awareness.map(b => `- ${b}`).join('\n') + '\n\n';
        }
        
        if (personaData.growth_motivation.length > 0) {
            md += '### Growth Motivation\n';
            md += personaData.growth_motivation.map(g => `- ${g}`).join('\n') + '\n\n';
        }
        
        if (personaData.cognitive_humanism.length > 0) {
            md += '### Cognitive Humanism\n';
            md += personaData.cognitive_humanism.map(c => `- ${c}`).join('\n') + '\n\n';
        }
        
        if (personaData.humanistic_cognition.length > 0) {
            md += '### Humanistic Cognition\n';
            md += personaData.humanistic_cognition.map(h => `- ${h}`).join('\n') + '\n\n';
        }
        
        if (personaData.self_actualization.length > 0) {
            md += '### Self-Actualization\n';
            md += personaData.self_actualization.map(s => `- ${s}`).join('\n') + '\n\n';
        }
        
        if (personaData.behavioral_growth.length > 0) {
            md += '### Behavioral Growth\n';
            md += personaData.behavioral_growth.map(b => `- ${b}`).join('\n') + '\n\n';
        }
    }

    // Tier 1
    if (personaData.technology_adoption !== undefined || personaData.crisis_response || personaData.influence_style) {
        md += '## Modern Dimensions (Tier 1)\n\n';
        
        if (personaData.technology_adoption !== undefined) {
            const label = getTechnologyAdoptionLabel(personaData.technology_adoption);
            md += `### Technology Adoption\n${label} (${personaData.technology_adoption}%)\n\n`;
        }
        
        if (personaData.crisis_response) {
            md += `### Crisis Response\n${personaData.crisis_response}\n\n`;
        }
        
        if (personaData.influence_style) {
            md += `### Influence Style\n${personaData.influence_style}\n\n`;
        }
    }

    // Tier 2
    if (personaData.resource_relationship || personaData.time_orientation || personaData.collaboration_style || personaData.leadership_style.length > 0 || personaData.interpersonal_dimensions) {
        md += '## Interpersonal Dimensions (Tier 2)\n\n';
        
        // Interpersonal Dimensions
        if (personaData.interpersonal_dimensions) {
            md += '### Interpersonal Dimensions\n';
            md += `- **Empathy**: ${personaData.interpersonal_dimensions.empathy}% (${personaData.interpersonal_dimensions.empathy < 30 ? 'Low' : personaData.interpersonal_dimensions.empathy > 70 ? 'High' : 'Moderate'})\n`;
            md += `- **Patience**: ${personaData.interpersonal_dimensions.patience}% (${personaData.interpersonal_dimensions.patience < 30 ? 'Impatient' : personaData.interpersonal_dimensions.patience > 70 ? 'Patient' : 'Moderate'})\n`;
            md += `- **Energy**: ${personaData.interpersonal_dimensions.energy}% (${personaData.interpersonal_dimensions.energy < 30 ? 'Calm' : personaData.interpersonal_dimensions.energy > 70 ? 'Energetic' : 'Moderate'})\n\n`;
        }
        
        if (personaData.resource_relationship) {
            md += `### Resource Relationship\n${personaData.resource_relationship}\n\n`;
        }
        
        if (personaData.time_orientation) {
            md += `### Time Orientation\n${personaData.time_orientation}\n\n`;
        }
        
        if (personaData.collaboration_style) {
            md += `### Collaboration Style\n${personaData.collaboration_style}\n\n`;
        }
        
        if (personaData.leadership_style.length > 0) {
            md += '### Leadership Style\n';
            md += personaData.leadership_style.map(l => `- ${l}`).join('\n') + '\n\n';
        }
    }

    // Stress & Blind Spots
    if (personaData.stress_responses.length > 0 || personaData.blind_spots.length > 0) {
        md += '## Stress Responses & Blind Spots\n\n';
        
        if (personaData.stress_responses.length > 0) {
            md += '### Stress Responses\n';
            md += personaData.stress_responses.map(s => `- ${s}`).join('\n') + '\n\n';
        }
        
        if (personaData.blind_spots.length > 0) {
            md += '### Blind Spots\n';
            md += personaData.blind_spots.map(b => `- ${b}`).join('\n') + '\n\n';
        }
    }

    return md;
}

// Generate JSON format
function generateJSON() {
    const json = {
        persona: {
            core_personality: {
                personality_dimensions: personaData.personality_dimensions || null,
                primary_traits: personaData.primary_traits,
                cognitive_style: personaData.cognitive_style || null,
                core_motivations: personaData.core_motivations,
                decision_making_framework: personaData.decision_making_framework || null
            },
            communication_style: {
                tone_dimensions: personaData.tone_dimensions || null,
                tone: personaData.communication_tone,
                sentence_structure: personaData.communication_sentence_structure
            },
            behavioral_patterns: {
                behavioral_dimensions: personaData.behavioral_dimensions || null,
                work_style: personaData.work_style,
                problem_solving_approach: personaData.problem_solving_approach,
                learning_style: personaData.learning_style
            },
            values: {
                core_values: personaData.core_values
            },
            behavioral_humanism: {
                bias_awareness: personaData.bias_awareness,
                growth_motivation: personaData.growth_motivation,
                cognitive_humanism: personaData.cognitive_humanism,
                humanistic_cognition: personaData.humanistic_cognition,
                self_actualization: personaData.self_actualization,
                behavioral_growth: personaData.behavioral_growth
            },
            tier_1_modern_dimensions: {
                technology_adoption: personaData.technology_adoption !== undefined ? {
                    value: personaData.technology_adoption,
                    label: getTechnologyAdoptionLabel(personaData.technology_adoption)
                } : null,
                crisis_response: personaData.crisis_response || null,
                influence_style: personaData.influence_style || null
            },
            tier_2_interpersonal_dimensions: {
                interpersonal_dimensions: personaData.interpersonal_dimensions || null,
                resource_relationship: personaData.resource_relationship || null,
                time_orientation: personaData.time_orientation || null,
                collaboration_style: personaData.collaboration_style || null,
                leadership_style: personaData.leadership_style
            },
            stress_and_awareness: {
                stress_responses: personaData.stress_responses,
                blind_spots: personaData.blind_spots
            }
        },
        metadata: {
            generated_by: 'Persona Engine',
            generated_at: new Date().toISOString(),
            version: '1.0'
        }
    };

    // Remove null/empty values
    return JSON.stringify(json, null, 2);
}

// Generate YAML format
function generateYAML() {
    let yaml = '# AI Agent Persona\n';
    yaml += '# Generated by Persona Engine\n\n';
    
    yaml += 'persona:\n';
    
    // Core Personality
    yaml += '  core_personality:\n';
    if (personaData.personality_dimensions) {
        yaml += '    personality_dimensions:\n';
        yaml += `      passive_assertive: ${personaData.personality_dimensions.passive_assertive}\n`;
        yaml += `      pessimistic_optimistic: ${personaData.personality_dimensions.pessimistic_optimistic}\n`;
        yaml += `      closed_open: ${personaData.personality_dimensions.closed_open}\n`;
    }
    if (personaData.primary_traits.length > 0) {
        yaml += '    primary_traits:\n';
        personaData.primary_traits.forEach(t => {
            yaml += `      - ${t}\n`;
        });
    }
    if (personaData.cognitive_style) {
        yaml += `    cognitive_style: "${personaData.cognitive_style}"\n`;
    }
    if (personaData.core_motivations.length > 0) {
        yaml += '    core_motivations:\n';
        personaData.core_motivations.forEach(m => {
            yaml += `      - ${m}\n`;
        });
    }
    if (personaData.decision_making_framework) {
        yaml += `    decision_making_framework: ${personaData.decision_making_framework}\n`;
    }
    
    // Communication
    yaml += '  communication_style:\n';
    if (personaData.tone_dimensions) {
        yaml += '    tone_dimensions:\n';
        yaml += `      formal_casual: ${personaData.tone_dimensions.formal_casual}\n`;
        yaml += `      serious_funny: ${personaData.tone_dimensions.serious_funny}\n`;
        yaml += `      respectful_irreverent: ${personaData.tone_dimensions.respectful_irreverent}\n`;
        yaml += `      matter_enthusiastic: ${personaData.tone_dimensions.matter_enthusiastic}\n`;
    }
    if (personaData.communication_tone.length > 0) {
        yaml += '    tone:\n';
        personaData.communication_tone.forEach(t => {
            yaml += `      - ${t}\n`;
        });
    }
    if (personaData.communication_sentence_structure.length > 0) {
        yaml += '    sentence_structure:\n';
        personaData.communication_sentence_structure.forEach(s => {
            yaml += `      - ${s}\n`;
        });
    }
    
    // Behavioral Patterns
    yaml += '  behavioral_patterns:\n';
    if (personaData.behavioral_dimensions) {
        yaml += '    behavioral_dimensions:\n';
        yaml += `      concise_detailed: ${personaData.behavioral_dimensions.concise_detailed}\n`;
        yaml += `      conservative_risk: ${personaData.behavioral_dimensions.conservative_risk}\n`;
        yaml += `      deliberate_quick: ${personaData.behavioral_dimensions.deliberate_quick}\n`;
    }
    if (personaData.work_style.length > 0) {
        yaml += '    work_style:\n';
        personaData.work_style.forEach(w => {
            yaml += `      - ${w}\n`;
        });
    }
    if (personaData.problem_solving_approach.length > 0) {
        yaml += '    problem_solving_approach:\n';
        personaData.problem_solving_approach.forEach(p => {
            yaml += `      - ${p}\n`;
        });
    }
    if (personaData.learning_style.length > 0) {
        yaml += '    learning_style:\n';
        personaData.learning_style.forEach(l => {
            yaml += `      - ${l}\n`;
        });
    }
    
    // Values
    if (personaData.core_values.length > 0) {
        yaml += '  values:\n';
        yaml += '    core_values:\n';
        personaData.core_values.forEach(v => {
            yaml += `      - ${v}\n`;
        });
    }
    
    // Behavioral Humanism
    if (personaData.bias_awareness.length > 0 || personaData.growth_motivation.length > 0 || 
        personaData.cognitive_humanism.length > 0 || personaData.humanistic_cognition.length > 0 ||
        personaData.self_actualization.length > 0 || personaData.behavioral_growth.length > 0) {
        yaml += '  behavioral_humanism:\n';
        
        if (personaData.bias_awareness.length > 0) {
            yaml += '    bias_awareness:\n';
            personaData.bias_awareness.forEach(b => {
                yaml += `      - ${b}\n`;
            });
        }
        
        if (personaData.growth_motivation.length > 0) {
            yaml += '    growth_motivation:\n';
            personaData.growth_motivation.forEach(g => {
                yaml += `      - ${g}\n`;
            });
        }
        
        if (personaData.cognitive_humanism.length > 0) {
            yaml += '    cognitive_humanism:\n';
            personaData.cognitive_humanism.forEach(c => {
                yaml += `      - ${c}\n`;
            });
        }
        
        if (personaData.humanistic_cognition.length > 0) {
            yaml += '    humanistic_cognition:\n';
            personaData.humanistic_cognition.forEach(h => {
                yaml += `      - ${h}\n`;
            });
        }
        
        if (personaData.self_actualization.length > 0) {
            yaml += '    self_actualization:\n';
            personaData.self_actualization.forEach(s => {
                yaml += `      - ${s}\n`;
            });
        }
        
        if (personaData.behavioral_growth.length > 0) {
            yaml += '    behavioral_growth:\n';
            personaData.behavioral_growth.forEach(b => {
                yaml += `      - ${b}\n`;
            });
        }
    }
    
    // Tier 1
    if (personaData.technology_adoption !== undefined || personaData.crisis_response || personaData.influence_style) {
        yaml += '  tier_1_modern_dimensions:\n';
        if (personaData.technology_adoption !== undefined) {
            const label = getTechnologyAdoptionLabel(personaData.technology_adoption);
            yaml += `    technology_adoption:\n`;
            yaml += `      value: ${personaData.technology_adoption}\n`;
            yaml += `      label: "${label}"\n`;
        }
        if (personaData.crisis_response) {
            yaml += `    crisis_response: "${personaData.crisis_response}"\n`;
        }
        if (personaData.influence_style) {
            yaml += `    influence_style: "${personaData.influence_style}"\n`;
        }
    }
    
    // Tier 2
    if (personaData.resource_relationship || personaData.time_orientation || personaData.collaboration_style || personaData.leadership_style.length > 0 || personaData.interpersonal_dimensions) {
        yaml += '  tier_2_interpersonal_dimensions:\n';
        if (personaData.interpersonal_dimensions) {
            yaml += '    interpersonal_dimensions:\n';
            yaml += `      empathy: ${personaData.interpersonal_dimensions.empathy}\n`;
            yaml += `      patience: ${personaData.interpersonal_dimensions.patience}\n`;
            yaml += `      energy: ${personaData.interpersonal_dimensions.energy}\n`;
        }
        if (personaData.resource_relationship) {
            yaml += `    resource_relationship: "${personaData.resource_relationship}"\n`;
        }
        if (personaData.time_orientation) {
            yaml += `    time_orientation: "${personaData.time_orientation}"\n`;
        }
        if (personaData.collaboration_style) {
            yaml += `    collaboration_style: "${personaData.collaboration_style}"\n`;
        }
        if (personaData.leadership_style.length > 0) {
            yaml += '    leadership_style:\n';
            personaData.leadership_style.forEach(l => {
                yaml += `      - ${l}\n`;
            });
        }
    }
    
    // Stress & Blind Spots
    if (personaData.stress_responses.length > 0 || personaData.blind_spots.length > 0) {
        yaml += '  stress_and_awareness:\n';
        if (personaData.stress_responses.length > 0) {
            yaml += '    stress_responses:\n';
            personaData.stress_responses.forEach(s => {
                yaml += `      - ${s}\n`;
            });
        }
        if (personaData.blind_spots.length > 0) {
            yaml += '    blind_spots:\n';
            personaData.blind_spots.forEach(b => {
                yaml += `      - ${b}\n`;
            });
        }
    }
    
    yaml += '\nmetadata:\n';
    yaml += '  generated_by: Persona Engine\n';
    yaml += `  generated_at: ${new Date().toISOString()}\n`;
    yaml += '  version: "1.0"\n';
    
    return yaml;
}

// Copy preview to clipboard
function copyPreview() {
    const format = getSelectedFormat();
    let text = '';
    
    switch (format) {
        case 'markdown':
            text = generateMarkdown();
            break;
        case 'json':
            text = generateJSON();
            break;
        case 'yaml':
            text = generateYAML();
            break;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('copy-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}

// Download preview
function downloadPreview() {
    const format = getSelectedFormat();
    let text = '';
    let extension = '';
    
    switch (format) {
        case 'markdown':
            text = generateMarkdown();
            extension = 'md';
            break;
        case 'json':
            text = generateJSON();
            extension = 'json';
            break;
        case 'yaml':
            text = generateYAML();
            extension = 'yaml';
            break;
    }
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `persona.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}




// Escape HTML for preview
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions globally available
window.toggleCategory = toggleCategory;
window.removeTrait = removeTrait;

