const ALL_SOURCES = ["MM", "MPMM", "TftYP", "ToA", "CoS"]
const DEFAULT_SOURCES = ["MM"]


// adds checkboxes for each source
function setupCheckboxes(enabledSources) {
    for (var source of ALL_SOURCES) {
        addCheckbox(source, source, enabledSources.includes(source))
    }
}


// adds a checkbox to the page
function addCheckbox(name, labelName, checked) {
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.name = name;
    checkbox.value = name;
    checkbox.id = name;
    checkbox.checked = checked
    checkbox.addEventListener('change', (event) => onCheckboxChange(event.currentTarget))
    checkbox.onclick = onCheckboxChange()

    var label = document.createElement('label');
    label.htmlFor = name;
    label.appendChild(document.createTextNode(labelName));

    document.body.appendChild(checkbox);
    document.body.appendChild(label);
    document.body.appendChild(document.createElement("br"));
}


// updates local storage enabledSources on checkbox change
function onCheckboxChange(checkbox) {
    chrome.storage.local.get(["enabledSources"], function(result){
        if (checkbox.checked) {
            var newEnabledSources = result.enabledSources.filter(item => item !== checkbox.value).concat(checkbox.value)
            chrome.storage.local.set({enabledSources: newEnabledSources});
        }
        else {
            var newEnabledSources = result.enabledSources.filter(item => item !== checkbox.value)
            chrome.storage.local.set({enabledSources: newEnabledSources});
        }
    })
}


// Pulls enabledSources from storage, otherwise uses default
chrome.storage.local.get(["enabledSources"], function(result){
    if (!result.enabledSources) {
        chrome.storage.local.set({enabledSources: DEFAULT_SOURCES}, function() {
            setupCheckboxes(DEFAULT_SOURCES)
        })
    }
    else {
        setupCheckboxes(result.enabledSources)
    }
})
