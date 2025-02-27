import { EEmailEnum } from "../../enums/email.enum";

export const allTemplates: {
  [key: string]: { subject: string; templateName: string };
} = {
  [EEmailEnum.REGISTER]: {
    subject: "Welcome to our site",
    templateName: "register.email",
  },
  [EEmailEnum.CHANGE_PASSWORD]: {
    subject: "Just following steps and all we be good",
    templateName: "change.password.email",
  },
  [EEmailEnum.CHANGE_EMAIL]: {
    subject: "Just following steps and all we be good",
    templateName: "change.email",
  },
  [EEmailEnum.FORGOT_PASSWORD]: {
    subject: "Just following steps and all we be good",
    templateName: "forgot.password.email",
  },
  [EEmailEnum.ACTIVATE_EMAIL]: {
    subject: "Just press the button",
    templateName: "activate.email",
  },
};
