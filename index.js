#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const prompts = require('prompts')


function isValidHttpUrl(string) {
    let url
    
    try {
        url = new URL(string)
    } catch (_) {
        return false
    }
  
    return url.protocol === "http:" || url.protocol === "https:"
}

function cloneTemplate(projectName, url = "https://github.com/fehujs/starter-template") {
    execSync(`git clone ${url} ./${projectName}`, { stdio: 'inherit' })
}

(async () => {
    console.log(
        " _____    _            _      " + "\n" +
        "|  ___|__| |__  _   _ (_)___  " + "\n" +
        "| |_ / _ \\ '_ \\| | | || / __| " + "\n" +
        "|  _|  __/ | | | |_| || \\__ \\ " + "\n" +
        "|_|  \\___|_| |_|\\__,_|/ |___/ " + "\n" +
        "                    |__/      "
    )

    const response = await prompts([
        {
            type: "text",
            name: "projectName",
            message: "What is your project name?",
            initial: "myapp"
        },
        {
            type: "text",
            name: "templateURL",
            message: "Which template would you use?",
            initial: "https://github.com/fehujs/starter-template",
            validate: url => !isValidHttpUrl(url) ? "Please enter a valid URL (to a Git repository)" : true
        },
    ])

    const projectName = response.projectName
    const targetDir = path.resolve(process.cwd(), projectName)

    if (fs.existsSync(targetDir)) {
        console.error(`Error: Directory ${projectName} already exists.`)
        process.exit(1)
    }

    console.log(`Creating project in ${targetDir}...`)
    cloneTemplate(projectName, response.templateURL)

    console.log('Installing dependencies...')
    execSync(`pnpm install`, { stdio: 'inherit', cwd: targetDir })

    console.log(`Project ${projectName} created successfully!`)
})()
