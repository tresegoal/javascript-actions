import * as core from '@actions/core';
import * as github from '@actions/github';
import * as nodemailer from 'nodemailer';

async function run() {
    try {
        const to = core.getInput("to");
        const from = core.getInput("from");
        const pwd = core.getInput("password");

        const issue = github.context.payload.issue;
        console.log(issue);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: from,
                pass: pwd
            }
        });

        await transporter.sendMail({
            from,
            to,
            subject: `Nouvelle issue ouverte: ${issue.title}`,
            text: `
                titre: ${issue.title}
                auteur: ${issue.user.login}
                lien: ${issue.html_url}
                
                description: ${issue.body}
            `
        });
        core.info("Email envoye avec succes !")
        core.setOutput("date", issue.updated_at)
    } catch (e) {
        core.setFailed(`echec: ${e.message}`)
    }
}

run();

