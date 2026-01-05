const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to save applications
app.post('/api/apply', (req, res) => {
    const application = {
        ...req.body,
        timestamp: new Date().toISOString(),
        ip: req.ip
    };
    
    // In production, save to database
    // For now, log to file and console
    console.log('New Application:', application);
    
    // Save to applications.json
    const filePath = path.join(__dirname, 'applications.json');
    let applications = [];
    
    try {
        if (fs.existsSync(filePath)) {
            applications = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    } catch (err) {
        console.error('Error reading applications file:', err);
    }
    
    applications.push(application);
    
    fs.writeFileSync(filePath, JSON.stringify(applications, null, 2));
    
    // Send WhatsApp notification (simulated)
    sendWhatsAppNotification(application);
    
    res.json({
        success: true,
        message: 'Application submitted successfully!',
        data: application
    });
});

// View applications (admin route)
app.get('/admin/applications', (req, res) => {
    const filePath = path.join(__dirname, 'applications.json');
    
    try {
        if (fs.existsSync(filePath)) {
            const applications = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            res.json(applications);
        } else {
            res.json([]);
        }
    } catch (err) {
        res.status(500).json({ error: 'Error reading applications' });
    }
});

// Simulate WhatsApp notification
function sendWhatsAppNotification(application) {
    const message = `
🚀 *New Internship Application!*

*Company:* ${application.companyName}
*Contact Person:* ${application.contactPerson}
*Email:* ${application.email}
*Phone:* ${application.phone}

*Message:*
${application.message}

*Submitted:* ${new Date(application.timestamp).toLocaleString()}
    `;
    
    console.log('\n=== WHATSAPP NOTIFICATION ===');
    console.log(message);
    console.log('============================\n');
    
    // In production, integrate with WhatsApp Business API
    // For demo, we just log to console
}

// Download CV endpoint
app.get('/download-cv', (req, res) => {
    // In production, serve actual CV file
    // For demo, create a sample PDF
    const cvContent = `
        Junaid Ul Haque Sheikh
        Internship Applicant
        
        Objective:
        Seeking internship training position in software house to apply 
        and enhance technical skills in web development.
        
        Skills:
        - HTML5, CSS3, JavaScript
        - Responsive Web Design
        - Git & GitHub
        - Netlify/Vercel Deployment
        - Frontend Development
        
        Education:
        GIAIC - Web Development & AI
        
        Contact:
        WhatsApp: +92 335 9033554
        Location: Karachi, Pakistan
        
        Portfolio:
        28+ Live Projects Deployed
    `;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Junaid_Ul_Haque_CV.pdf"');
    
    // In production, serve actual PDF file
    res.send(cvContent);
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Portfolio website ready!`);
    console.log(`📝 Applications will be saved to applications.json`);
    console.log(`📞 WhatsApp: +92 335 9033554`);
});