const MONSTER_SEARCH_BAR = `
<div class="css-1rc500d">
   <div class="css-146l5zf">
      <input title="Monster Input Field" placeholder="Upload Monster Token by Name"  class="css-nsmwue" value="">
   </div>
   <button aria-label="Upload Monster" title="Upload Monster" class="css-6p9ci6-IconButton">
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentcolor">
         <path d="M0 0h24v24H0V0z" fill="none"></path>
         <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 11h-3v3c0 .55-.45 1-1 1s-1-.45-1-1v-3H8c-.55 0-1-.45-1-1s.45-1 1-1h3V8c0-.55.45-1 1-1s1 .45 1 1v3h3c.55 0 1 .45 1 1s-.45 1-1 1z"></path>
      </svg>
   </button>
</div>
`

// Monster sources that images will be pulled from
const ALLOWED_SOURCES = ["MM", "MPMM"];


// add mutation observer
// when monster token page pulled up
// adds search bar
const observer = new MutationObserver((mutationList) => {
  for (const mutation of mutationList) {
    if (mutation.type == 'childList' &&
        mutation.addedNodes.length > 0 &&
        mutation.addedNodes[0].className == 'ReactModal__Overlay' &&
        mutation.addedNodes[0].parentElement == document.getElementsByClassName('ReactModalPortal')[11]
    ) {
      addMonsterSearchBar()
    }
  }
});

// enables the mutation observer
root_element = document.body
observer.observe(root_element, {subtree: true, childList: true});






// formats link to pull image from
function format_link(source, monster_name) {
  return `https://5e.tools/img/${source}/${monster_name}.png`;
}

// formats path to store download
function format_filename(monster_name) {
  return `${monster_name.toLowerCase()}.png`;
}



// checks if the monster is included in a given source
// by making a HEAD request against the image site
async function checkSource(source, monster_name) {
  let response = await fetch(format_link(source, monster_name), {method: 'HEAD'})
  return response.ok
}

// finds the source which contains the given monster
// if none do, returns undefined
async function findCorrectSource(monster_name) {
  for (let i = 0; i < ALLOWED_SOURCES.length; i++) {
    let is_included = await checkSource(ALLOWED_SOURCES[i], monster_name);
    if (is_included) {
      return ALLOWED_SOURCES[i];
    }
  }
  return undefined;
}



// creates file from a given image url
async function createFile(source, monster_name) {
  let response = await fetch(format_link(source, monster_name));
  let data = await response.blob();
  let metadata = {type: 'image/png'};
  return new File([data], format_filename(monster_name), metadata);
}

// uploads monster image to owlbear form
async function uploadFile(source, monster_name) {
  const designFile = await createFile(source, monster_name);
  const input = document.getElementsByTagName('input')[0];
  const dt = new DataTransfer();
  dt.items.add(designFile);
  input.files = dt.files;

  const event = new Event('change', {bubbles: true});
  input.dispatchEvent(event);
}



// uploads image for monster
async function uploadMonster() {
  const monster_name = document.querySelector('[title="Monster Input Field"]').value;
  const correct_source = await findCorrectSource(monster_name);

  // if a source was found, uploads image
  if (correct_source) {
    await uploadFile(correct_source, monster_name);
  }
  // if not, sends alert to user
  else {
    window.alert("Monster name not found");
  }
}



// Adds my monster search bar to token page
function addMonsterSearchBar() {
  // adds monster search bar to page
  const search_bar = document.getElementsByClassName('css-1rc500d')[0];
  search_bar.insertAdjacentHTML('afterend', MONSTER_SEARCH_BAR);

  // registers uploadMonster function on monster search bar button press
  const upload_monster_button = document.querySelector('[title="Upload Monster"]');
  upload_monster_button.onclick = function() {uploadMonster()};
}
