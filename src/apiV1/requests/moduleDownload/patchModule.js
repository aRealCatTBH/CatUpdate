import { readFileSync, writeFileSync, mkdirSync, readdirSync, lstatSync, copyFileSync, createWriteStream } from 'fs';

import stream from 'stream';
import path from 'path';

import unzipper from 'unzipper';
import archiver from 'archiver';

import basicProxy from '../../../generic/proxy/index.js';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


export default async (req, res, cacheDir, cacheFinalFile) => {
  const branch = branches[req.params.branch];
  
  console.log('[CustomModule] Could not find cache dir, creating custom version');
  
  const prox = await basicProxy(req, res, {
    responseType: 'arraybuffer'
  }, [req.params.version, req.params.version.substring(branch.version.toString().length)]);
  
  console.time('fromNetwork');
  
  let s = stream.Readable.from(prox.data);
  
  const cacheExtractDir = `${cacheDir}/extract`;
  
  let t = s.pipe(unzipper.Extract({ path: `${cacheExtractDir}` }));
  
  console.log('waiting');
  
  await new Promise(res => t.on('finish', res));
  await sleep(100);
  
  console.log('waited');
  
  console.log('Extract finished');
  
  console.time('fromExtract');
  
  console.log('Patching file');
  
  let code = readFileSync(`${cacheExtractDir}/index.js`, 'utf-8');
  
  code = `${branch.patch}\n\n${code}`;
  
  writeFileSync(`${cacheExtractDir}/index.js`, code);
  
  console.log('Copying other files');
  
  function copyFolderSync(from, to) {
    mkdirSync(to);
    readdirSync(from).forEach(element => {
      if (lstatSync(path.join(from, element)).isFile()) {
        copyFileSync(path.join(from, element), path.join(to, element));
      } else {
        copyFolderSync(path.join(from, element), path.join(to, element));
      }
    });
  }
  
  for (let f of branch.files) {
    console.log(f, f.split('/').pop());
    
    if (lstatSync(f).isDirectory()) {
      copyFolderSync(f, `${cacheExtractDir}/${f.split('/').pop()}`)
    } else {
      copyFileSync(f, `${cacheExtractDir}/${f.split('/').pop()}`);
    }
  }
  
  console.log('Creating new final zip');
  
  const outputStream = createWriteStream(`${cacheFinalFile}`);
  
  const archive = archiver('zip');
  
  archive.pipe(outputStream);
  
  archive.directory(cacheExtractDir, false);
  
  archive.finalize();
  
  console.log('Waiting for archive to finish');
  
  await new Promise(res => outputStream.on('close', res));
  
  console.log('Finished - sending file');
  
  console.timeEnd('fromNetwork');
  console.timeEnd('fromExtract');
  
  res.sendFile(cacheFinalFile);
  
  s.destroy();
  
  outputStream.close();
  outputStream.destroy();
};