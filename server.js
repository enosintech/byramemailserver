import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_SERVER_EMAIL,
        pass: process.env.GMAIL_SERVER_PASS,
    },
})

transporter.verify((error, success) => {
    if(error) {
        console.log(error) 
    } else {
        console.log("Server is ready to receive messages")
    }
});

app.post("/api/sendEmail", async (req, res) => {
    try {
        const { email, subject, message } = req.body;

        let info = await transporter.sendMail({
            from: email,
            to: 'inquiries@makeupbyram.com',
            subject: subject,
            text: `Reach Me on this email: ${email}. \n\n\n${message}`,
        });

        return res.status(200).send({
            success: true,
            message: `Email ${info.messageId} sent successfully!`
        })

    } catch (error) {
        return res.status(400).send({
            success: false,
            message: `Email not sent. ${error}`
        })
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});