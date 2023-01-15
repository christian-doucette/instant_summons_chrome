// formats link to pull image from
function format_links(monster_name) {
  mm = `https://5e.tools/img/MM/${monster_name}.png`
  mpmm = `https://5e.tools/img/MPMM/${monster_name}.png`
  return [mm, mpmm]
}

// formats path to store download
function format_path(monster_name) {
  let underscored_monster_name = monster_name.toLowerCase().replace(" ", "_")
  return `monsters/${underscored_monster_name}.png`
}

// downloads monster on message
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    format_links(request.monster_name).forEach(function (item, index) {
      chrome.downloads.download({url: item, filename: format_path(request.monster_name)})
    });
    sendResponse({status: "success"});
  }
);
