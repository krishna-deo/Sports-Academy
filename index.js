// Fallback entry point for cloud deployment hosting environments (such as Render or Heroku)
// that execute "node index.js" from the repository root by default.
// Since root package.json specifies "type": "module", we use ES import syntax.
import './server/index.js';
