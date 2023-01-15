const MONSTER_SEARCH_BAR = `
<div class="css-1rc500d">
   <div class="css-146l5zf">
      <input title="Monster Input Field" placeholder="Import Monster Token"  class="css-nsmwue" value="">
   </div>
   <button aria-label="Download Monster" title="Download Monster" class="css-6p9ci6-IconButton">
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentcolor">
         <path d="M0 0h24v24H0V0z" fill="none"></path>
         <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 11h-3v3c0 .55-.45 1-1 1s-1-.45-1-1v-3H8c-.55 0-1-.45-1-1s.45-1 1-1h3V8c0-.55.45-1 1-1s1 .45 1 1v3h3c.55 0 1 .45 1 1s-.45 1-1 1z"></path>
      </svg>
   </button>
</div>
`

// Registers addMonsterSearchBar on token button
var edit_tokens_button = document.querySelector('[title="Edit Tokens"]');
edit_tokens_button.onclick = function() {addMonsterSearchBar()};


// Adds my monster search bar to token page
async function addMonsterSearchBar() {
  // wait 100ms
  // hacky fix I'll remove later
  await new Promise(resolve => setTimeout(resolve, 100));

  // adds monster search bar to page
  let search_bar = document.getElementsByClassName('css-1rc500d')[0];
  search_bar.insertAdjacentHTML('afterend', MONSTER_SEARCH_BAR);

  // registers downloadMonster function on monster search bar button press
  var download_monsters_button = document.querySelector('[title="Download Monster"]');
  download_monsters_button.onclick = function() {downloadMonster()};
}


// downloads image for monster
async function downloadMonster() {
  var monster_input_field = document.querySelector('[title="Monster Input Field"]');

  const response = await chrome.runtime.sendMessage({monster_name: monster_input_field.value});
  console.log(response);
}
