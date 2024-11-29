const { spawn } = require('child_process');

export default function handler(req, res) {
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, use POST' });
  }
  try {
  let { language, code, input, className } = req.body;
  
  if (!language || !code) {
    return res.status(400).json({ error: 'Code or language is empty.' });
  }
  const defaults = {
    cwd: process.cwd()+`/DockerExec/${language}`,
  }
  !className && (className = 'main');
  !input && (input = '');
  if (language === 'c'){}
  let parsed_code = code.replace(/"/g, '\\"').replace(/\\n/g, '\\\\\\n').replace(/\n/g, '\\n').replace(/\$/g, '\\$').replace(/`/g, '\\`');
  
  let parsed_input = input.replace(/"/g, '\\"').replace(/\n/g, '\\n');
  const args = `-e FILE_CONTENT="${parsed_code}" -e FILE_INPUT="${parsed_input}" -e FILE_NAME="${className}"`;
  const cmd = `docker run --rm ${args} ${language}runner`;
  const runner = spawn('bash',['-c', cmd], defaults);

  let output = '';
  let error = '';

  runner.stdout.on('data', (data) => {
    output += data.toString();
  });

  runner.stderr.on('data', (data) => {
    error += data.toString();
  });

  runner.on('exit', (code) => {
    if (code === 124) {
      return res.status(400).json({ output: "", error: 'Timeout Error' });
    }
    if (code === 137) {
      return res.status(400).json({ output: "", error: 'Memory Limit/Stdout Buffer Exceeded' });
    }
    return res.status(200).json({ output, error });
  });
}
  catch (error) {
    return res.status(500).json({ output: "", error: error.message });
  }
}