// Test mermaid rendering in page
(async () => {
  const players = document.querySelectorAll("mermaid-flow-player");
  console.log("Found players:", players.length);
  
  for (let i = 0; i < players.length; i++) {
    const p = players[i];
    console.log(`Player ${i}:`, p.outerHTML.substring(0, 100));
  }
  
  console.log("mermaid:", typeof window.mermaid);
  console.log("mermaid.run:", typeof window.mermaid?.run);
  
  // Try to manually trigger rendering
  if (window.mermaid?.run) {
    const testPre = document.createElement("pre");
    testPre.className = "mermaid";
    testPre.id = "debug-test";
    testPre.textContent = "flowchart LR\nA --> B";
    document.body.appendChild(testPre);
    console.log("Created test pre");
    
    try {
      await window.mermaid.run({ nodes: [testPre] });
      console.log("mermaid.run succeeded, result:", testPre.innerHTML.substring(0, 100));
    } catch(e) {
      console.log("mermaid.run error:", e.message);
    }
  }
})();