import { createFlowPlayer } from '/local-dist/index.js';

function initInteractiveStage(stageEl) {
  var mermaidEl = stageEl.querySelector('.mermaid[data-interactive]');
  var stateValueEl = stageEl.querySelector('.state-value');
  var resetBtn = stageEl.querySelector('.reset-btn');
  if (!mermaidEl) return;

  var player = createFlowPlayer({
    root: mermaidEl,
    mode: 'interactive',
    dim: 'others',
    hooks: {
      onStepStart: function(step) {
        updateLabel(step.id);
      }
    }
  });

  function getNodeLabel(nodeId) {
    var index = player.index();
    if (!index) return nodeId;
    var nodeEl = index.nodes.get(nodeId);
    if (!nodeEl) return nodeId;
    var text = nodeEl.querySelector('text, .nodeLabel');
    return text ? text.textContent.trim() : nodeId;
  }

  function updateLabel(nodeId) {
    if (!nodeId) return;
    var label = getNodeLabel(nodeId);
    var paths = player.getAvailablePaths();
    stateValueEl.textContent = paths.length === 0 ? label + ' (done)' : label;
  }

  resetBtn.addEventListener('click', function() {
    player.reset();
    var nodeId = player.getCurrentNode();
    if (nodeId) {
      stateValueEl.textContent = getNodeLabel(nodeId);
    } else {
      stateValueEl.textContent = 'Loading...';
    }
  });

  async function init() {
    await player.ready();
    var nodeId = player.getCurrentNode();
    if (nodeId) {
      stateValueEl.textContent = getNodeLabel(nodeId);
    }
  }

  setTimeout(init, 1500);
}

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    document.querySelectorAll('.interactive-stage').forEach(function(stage) {
      initInteractiveStage(stage);
    });
  }, 1200);
});
