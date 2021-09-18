// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// This is invoked before everything else for the windows, thanks to electron

function setValues() {
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text;
    }
  };

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type] as string);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // Don't actually do this: React does some more stuff after this event,
  // so if you want this to work, you need to delay it until React has finished
  // rendering some stuff
  setTimeout(setValues, 1000);
});
