import EmailTemplates from "email-templates";
import nodemailer, { Transporter } from "nodemailer";
import * as path from "path";

import { configs } from "../configs";
import { allTemplates } from "../configs/constants/email.constants";
import { EEmailEnum } from "../enums/email.enum";

class EmailService {
  private transporter: Transporter;
  private templateParser;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: configs.NO_REPLY_EMAIL,
        pass: configs.NO_REPLY_PASSWORD,
      },
    });

    this.templateParser = new EmailTemplates({
      views: {
        root: path.join(process.cwd(), "src", "static", "templates"),
        options: {
          extension: "hbs",
        },
      },
      juice: true,
      juiceResources: {
        webResources: {
          relativeTo: path.join(
            process.cwd(),
            "src",
            "static",
            "templates",
            "styles",
          ),
        },
      },
    });
  }

  public async sendEmail(
    email: string,
    emailAction: EEmailEnum,
    locals: Record<string, string> = {},
  ) {
    const templateData = allTemplates[emailAction];
    locals.frontURL = configs.FRONT_URL;

    const html = await this.templateParser.render(
      templateData.templateName,
      locals,
    );

    return this.transporter.sendMail({
      from: "No reply",
      to: email,
      subject: templateData.subject,
      html,
    });
  }
}

export const emailService = new EmailService();
