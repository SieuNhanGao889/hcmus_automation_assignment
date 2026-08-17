/**
 * Chèn thêm tên thông tin sinh viên vào index.html
 */
const fs = require('fs/promises');
const path = require('path');

class RunInfoReporter {
  constructor() {
    this.runBy = 'Run by: 23127364';
    this.runAt = new Date().toISOString();
  }

  async onEnd() {
    const reportPath = path.resolve(process.cwd(), 'playwright-report', 'index.html');
    for (let attempt = 0; attempt < 20; attempt += 1) {
      try {
        const html = await fs.readFile(reportPath, 'utf8');
        const banner = `<div id="hw04-run-info" style="padding:8px 12px;background:#fff7ed;border-bottom:1px solid #fed7aa;font:14px Arial,sans-serif;color:#7c2d12">${this.runBy} | ${this.runAt}</div>`;
        const cleaned = html.replace(/<div id="hw04-run-info"[\s\S]*?<\/div>/, '');
        const updated = cleaned.replace(/<body([^>]*)>/i, `<body$1>${banner}`);
        await fs.writeFile(reportPath, updated, 'utf8');
        return;
      } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    }
  }
}

module.exports = RunInfoReporter;
