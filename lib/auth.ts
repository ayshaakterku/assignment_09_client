import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { sendEmail } from "@/components/email";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("mentor-lagbe");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
        //.....email pass reset start...
    sendResetPassword: async ({ user, url, token }, request) => {
      void sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },    
    onPasswordReset: async ({ user }) => {
      console.log(`Password reset for ${user.email}`);
    },
  //.....email pass reset end...
  },
  
    user: {
    additionalFields: {
      role: {
        type: ["tutor", "student", "admin"],
        input: true,
        defaultValue: "student",
        transform: {
          input: (value) =>
            value === "tutor" || value === "admin" ? value : "student",
        },
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      bio: {
        type: "string",
        required: false,
        input: true,
      },
      location: {
        type: "string",
        required: false,
        input: true,
      },
      // Not shown on the sign-up page. `input: false` means clients can never
      // send a value, so every new account starts on the free plan.
      // Future upgrades/downgrades should be written server-side (e.g. after a
      // payment webhook or from an admin route), for example:
      //   await db.collection("user").updateOne({ _id: userId }, { $set: { plan: "pro" } })
      // or, from a trusted server handler, `auth.api.updateUser`.
      plan: {
        type: ["free", "pro"],
        required: false,
        input: false,
        defaultValue: "free",
      },
    },
  },

  

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

});
