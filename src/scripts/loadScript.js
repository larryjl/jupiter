export default function loadScript(scriptId, url, callback) {
  const existingScript = document.getElementById(scriptId);
  let script;

  if (!existingScript) {
    script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.id = scriptId;
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (callback) {
        callback();
      }
    };
  }

  if (existingScript && callback) callback();
  return script;
}
