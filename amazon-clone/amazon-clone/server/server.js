const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "amazon-clone-server" });
});

app.get("/api/products", (_req, res) => {
    res.json({ success: true, products: [] });
});

function createTransporter() {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
        return nodemailer.createTransport({
            host,
            port: Number(process.env.SMTP_PORT || 587),
            secure: false,
            auth: { user, pass }
        });
    }

    return nodemailer.createTransport({
        jsonTransport: true
    });
}

app.post("/api/notifications/order", async (req, res) => {
    const {
        orderId,
        customerName,
        customerEmail,
        totalAmount,
        itemCount
    } = req.body || {};

    if (!orderId || !customerEmail) {
        return res.status(400).json({
            success: false,
            message: "orderId and customerEmail are required"
        });
    }

    const transporter = createTransporter();
    const from = process.env.ORDER_FROM_EMAIL || "no-reply@amazon-clone.local";

    const html = `
    <div style="font-family: Arial, sans-serif; color: #111;">
      <h2>Your Amazon order has been placed</h2>
      <p>Hello ${customerName || "Customer"},</p>
      <p>Thank you for shopping with us. Your order is confirmed.</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Items:</strong> ${itemCount || 0}</p>
      <p><strong>Total:</strong> Rs.${totalAmount || 0}</p>
      <p>You can track your order from your account anytime.</p>
    </div>
  `;

    try {
        const info = await transporter.sendMail({
            from,
            to: customerEmail,
            subject: `Amazon Order Confirmation - ${orderId}`,
            html
        });

        return res.json({
            success: true,
            message: "Order notification email processed",
            transport: info.envelope ? "smtp" : "json",
            preview: info.message || null
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to process notification email",
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
