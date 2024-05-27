const readline = require('node:readline')
const { exec } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const packageJsonPath = path.join(__dirname, '../package.json')

run()

function run() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  rl.question('请选择版本号更新类型（major, minor, patch, beta）：', async (type) => {
    try {
      const packageJson = require(packageJsonPath)
      const newVersion = updateVersion(type, packageJson)
      packageJson.version = newVersion
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  
      console.log(`版本号更新为：${newVersion}`)
      await runCommand('npm run build')
      await runCommand(`git commit -am "Release ${newVersion}"`)
      await runCommand(`git tag -a v${newVersion} -m "Release ${newVersion}"`)
      await runCommand('git push && git push --tags')
      await runCommand('npm publish')
  
      console.log('发布成功！')
    } catch (err) {
      console.error('发布失败：', err)
    } finally {
      rl.close()
    }
  })
}


function updateVersion(type, packageJson) {
  const currentVersion = packageJson.version.split('.')
  let [major, minor, patch] = currentVersion.map(num => parseInt(num))

  switch(type) {
    case 'major':
      major++
      minor = 0
      patch = 0
      break

    case 'minor':
      minor++
      patch = 0
      break

    case 'patch':
      patch++
      break

    case 'beta':
      patch++
      return `${major}.${minor}.${patch}-beta`

    default:
      throw new Error('Unknown version type')
  }

  return `${major}.${minor}.${patch}`
}

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err)
        return
      }

      resolve(stdout.trim())
    })
  })
}
