// Monster class
// fetches, stores and formats monster data
class Monster {
  constructor(name) {
    this.name = name;
    this.ALLOWED_SOURCES = ["MM", "MPMM"];
  }

  formatUrl(source) {
    return `https://5e.tools/img/${source}/${this.name}.png`;
  }

  formatFilename() {
    return `${this.name.toLowerCase()}.png`;
  }

  // returns the source associated with this monster
  // or undefined if none are
  async findSource() {
    for (let i = 0; i < this.ALLOWED_SOURCES.length; i++) {
      let isIncluded = await this.#isValidSource(this.ALLOWED_SOURCES[i]);
      if (isIncluded) {
        return this.ALLOWED_SOURCES[i];
      }
    }
    return undefined;
  }

  // checks if a source by making a HEAD request
  async #isValidSource(source) {
    let response = await fetch(this.formatUrl(source), {method: 'HEAD'});
    return response.ok;
  }
}





// FileUploader class
// uploads file from url to input element
class FileUploader {
  async uploadFile(input, sourceUrl, uploadFilename) {
    const file = await this.#createFile(sourceUrl, uploadFilename);
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
  
    const event = new Event('change', {bubbles: true});
    input.dispatchEvent(event);
  }

  async #createFile(sourceUrl, uploadFilename) {
    let response = await fetch(sourceUrl);
    let data = await response.blob();
    let metadata = {type: 'image/png'};
    return new File([data], uploadFilename, metadata);
  }
}





// Monster search bar component
// Adds monster search bar to token tab
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
`;

// uploads image for monster
async function uploadMonster() {
  const textInput = document.querySelector('[title="Monster Input Field"]');
  const fileInput = document.getElementsByTagName('input')[0];
  var monster = new Monster(textInput.value);
  const correctSource = await monster.findSource();

  // if a source was found, uploads image
  if (correctSource) {
    var uploader = new FileUploader();
    await uploader.uploadFile(fileInput, monster.formatUrl(correctSource), monster.formatFilename());
  }
  // if not, sends alert to user
  else {
    window.alert("Monster name not found");
  }
}

// adds monster search bar to token tab with registered function
function addMonsterSearchBar() {
  // adds monster search bar to page
  const tokenSearchBar = document.getElementsByClassName('css-1rc500d')[0];
  tokenSearchBar.insertAdjacentHTML('afterend', MONSTER_SEARCH_BAR);

  // registers uploadMonster function on monster search bar button press
  const uploadMonsterButton = document.querySelector('[title="Upload Monster"]');
  uploadMonsterButton.onclick = function() {uploadMonster()};
}

// checks if a given mutation is due to the token tab being opened
function isTokenTabOpen(mutation) {
  return mutation.type == 'childList' &&
  mutation.addedNodes.length > 0 &&
  mutation.addedNodes[0].className == 'ReactModal__Overlay' &&
  mutation.addedNodes[0].parentElement == document.getElementsByClassName('ReactModalPortal')[11];
}

// add mutation observer
// when token tab opened, adds monster search bar
const observer = new MutationObserver((mutationList) => {
  for (const mutation of mutationList) {
    if (isTokenTabOpen(mutation)) {
      addMonsterSearchBar()
    }
  }
});

// enables the mutation observer on document body
observer.observe(document.body, {subtree: true, childList: true});